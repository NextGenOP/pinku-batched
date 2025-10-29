import {
    useEffect,
    useRef,
    useState,
    useMemo,
    type ChangeEvent,
    type ReactNode
} from "react";
import { type ProcessedImage } from "./components/types";

// Import utility functions
import { GREEN_SHADOW, PINK_HIGHLIGHT, generateLUTs, filtering } from "./components/utils/imageProcessing";

// Import UI components
import ImagePreviewModal from "./components/ui/ImagePreviewModal";
import Header from "./components/ui/Header";
import UploadArea from "./components/ui/UploadArea";
import ActionButtons from "./components/ui/ActionButtons";
import ResultsSection from "./components/ui/ResultsSection";
import FeaturesSection from "./components/ui/FeaturesSection";

export default function Page(): ReactNode {
    const [files, setFiles] = useState<File[]>([]);
    const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [processingProgress, setProcessingProgress] = useState<number>(0);
    const [copiedImageIndex, setCopiedImageIndex] = useState<number | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isReversed, setIsReversed] = useState<boolean>(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const handlePaste = async (event: ClipboardEvent) => {
        if (!event.clipboardData) return;
        const items = event.clipboardData.items;
        const imageFiles: File[] = [];

        for (const item of items) {
            if (item.type.startsWith("image/")) {
                const blob = item.getAsFile();
                if (blob) {
                    const file = new File([blob], `pasted-image-${Date.now()}.${blob.type.split('/')[1]}`, { type: blob.type });
                    imageFiles.push(file);
                }
            }
        }

        if (imageFiles.length > 0) {
            setFiles(prev => [...prev, ...imageFiles]);
            setProcessedImages([]);
        }
    };

    useEffect(() => {
        window.addEventListener("paste", handlePaste);
        return () => {
            window.removeEventListener("paste", handlePaste);
        };
    }, []);

    const filePreviews = useMemo(() => files.map(file => ({
        name: file.name,
        url: URL.createObjectURL(file)
    })), [files]);

    useEffect(() => {
        return () => {
            filePreviews.forEach(file => URL.revokeObjectURL(file.url));
        };
    }, [filePreviews]);

    function openFile() {
        if (fileRef.current) {
            fileRef.current.click();
        }
    }

    function fileChanged(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setFiles(prev => [...prev, ...newFiles]);
            setProcessedImages([]);
        }
    }
    
    const handleRemoveFile = (indexToRemove: number) => {
        setFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleConvert = async () => {
        if (files.length === 0) return;
        setIsProcessing(true);
        setProcessingProgress(0);
        setProcessedImages([]);
        let processedCount = 0;

        // Generate LUTs dynamically based on the isReversed state
        const shadowColor = isReversed ? PINK_HIGHLIGHT : GREEN_SHADOW;
        const highlightColor = isReversed ? GREEN_SHADOW : PINK_HIGHLIGHT;
        const luts = generateLUTs(shadowColor, highlightColor);

        const processingPromises = files.map(async (file) => {
            const image = document.createElement('img');
            const objectUrl = URL.createObjectURL(file);
            try {
                await new Promise<void>((resolve, reject) => {
                    image.onload = () => resolve();
                    image.onerror = reject;
                    image.src = objectUrl;
                });
                const canvas = document.createElement('canvas');
                canvas.width = image.width;
                canvas.height = image.height;
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    ctx.drawImage(image, 0, 0);
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    // Pass the dynamically generated LUTs to the filtering function
                    const filterResult = filtering(imageData, luts);
                    ctx.putImageData(filterResult, 0, 0);
                    processedCount++;
                    setProcessingProgress(Math.round((processedCount / files.length) * 100));
                    return { url: canvas.toDataURL('image/png'), name: `pinku_${file.name}`, originalName: file.name };
                }
            } finally {
                URL.revokeObjectURL(objectUrl);
            }
            return null;
        });

        try {
            const results = await Promise.all(processingPromises);
            const validResults = results.filter(res => res !== null) as ProcessedImage[];
            setProcessedImages(validResults);
        } catch (error) {
            console.error("An error occurred during image processing:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownloadAll = () => {
        processedImages.forEach((image, index) => {
            setTimeout(() => {
                const a = document.createElement("a");
                a.href = image.url;
                a.download = image.name;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }, index * 100);
        });
    };

    const handleDownloadSingle = (url: string, name: string) => {
        const a = document.createElement("a");
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handleCopySingle = async (url: string, index: number) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            await navigator.clipboard.write([
                new ClipboardItem({ [blob.type]: blob })
            ]);
            setCopiedImageIndex(index);
            setTimeout(() => setCopiedImageIndex(null), 2000);
        } catch (error) {
            console.error("Failed to copy image to clipboard:", error);
            alert("Sorry, couldn't copy the image. Your browser might not support this feature.");
        }
    };

    const handleReset = () => {
        setFiles([]);
        setProcessedImages([]);
        setProcessingProgress(0);
        setIsReversed(false); // Also reset the color direction
    };

    return (
        <div className="bg-[#010c05] min-h-screen px-4 py-8 flex justify-center text-[#ececec]">
            <div className="w-full max-w-6xl">
                <Header />
                
                {/* Main Card */}
                <div className="bg-[#1e5034]/50 backdrop-blur-lg rounded-2xl border border-[#a4d7ba]/40 shadow-2xl overflow-hidden">
                    <div className="p-6 md:p-8">
                        <UploadArea 
                            files={files}
                            filePreviews={filePreviews}
                            openFile={openFile}
                            handleRemoveFile={handleRemoveFile}
                            setSelectedImage={setSelectedImage}
                        />
                        
                        <ActionButtons
                            filesLength={files.length}
                            isProcessing={isProcessing}
                            processingProgress={processingProgress}
                            handleReset={handleReset}
                            handleConvert={handleConvert}
                            isReversed={isReversed}
                            setIsReversed={setIsReversed}
                        />
                        
                        {/* Results Section */}
                        {(isProcessing || processedImages.length > 0) && (
                            <ResultsSection
                                isProcessing={isProcessing}
                                processedImages={processedImages}
                                processingProgress={processingProgress}
                                handleDownloadAll={handleDownloadAll}
                                handleDownloadSingle={handleDownloadSingle}
                                handleCopySingle={handleCopySingle}
                                copiedImageIndex={copiedImageIndex}
                                setSelectedImage={setSelectedImage}
                            />
                        )}
                    </div>
                </div>
                
                <FeaturesSection />
            </div>
            
            <ImagePreviewModal imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />
        </div>
    );
}