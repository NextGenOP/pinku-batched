import {
    useEffect,
    useRef,
    useState,
    useMemo,
    type ChangeEvent,
    type ReactNode
} from "react";
import { Upload, Wand2, RefreshCw, Download, CheckCircle, XCircle, Camera } from "lucide-react";

// --- Original Pink Filter Logic (Unchanged) ---
const COLOR_A: number[] = [22, 80, 39];
const COLOR_B: number[] = [249, 159, 210];

const rLUT: Uint8ClampedArray = new Uint8ClampedArray(256);
const gLUT: Uint8ClampedArray = new Uint8ClampedArray(256);
const bLUT: Uint8ClampedArray = new Uint8ClampedArray(256);

for (let i = 0; i < 256; i++) {
    const luminance = i / 255.0;
    const invLuminance = 1.0 - luminance;
    rLUT[i] = (COLOR_A[0] * invLuminance) + (COLOR_B[0] * luminance);
    gLUT[i] = (COLOR_A[1] * invLuminance) + (COLOR_B[1] * luminance);
    bLUT[i] = (COLOR_A[2] * invLuminance) + (COLOR_B[2] * luminance);
}

// Optimized filtering function using the pre-computed LUTs
function filtering(imageData: ImageData): ImageData {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const luminanceInt = Math.round((r * 0.2126) + (g * 0.7152) + (b * 0.0722));
        
        // Modify the data in place to save memory
        data[i] = rLUT[luminanceInt];
        data[i + 1] = gLUT[luminanceInt];
        data[i + 2] = bLUT[luminanceInt];
        // Alpha channel (data[i + 3]) remains 255
    }
    return imageData;
}


export default function Page(): ReactNode {
    const [files, setFiles] = useState<File[]>([]);
    const [processedImages, setProcessedImages] = useState<{ url: string, name: string, originalName: string }[]>([]);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [processingProgress, setProcessingProgress] = useState<number>(0);
    const fileRef = useRef<HTMLInputElement>(null);

    // --- Optimization 3: Better Memory Management for Previews ---
    const filePreviews = useMemo(() => files.map(file => ({
        name: file.name,
        url: URL.createObjectURL(file)
    })), [files]);

    useEffect(() => {
        // This is a cleanup function that runs when the component unmounts
        // or when `filePreviews` changes.
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
            setProcessedImages([]); // Clear previous results
        }
    }
    
    const handleRemoveFile = (indexToRemove: number) => {
        setFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    // --- Optimization 2: Process Images in Parallel ---
    const handleConvert = async () => {
        if (files.length === 0) return;

        setIsProcessing(true);
        setProcessingProgress(0);
        setProcessedImages([]);
        
        let processedCount = 0;

        const processingPromises = files.map(async (file) => {
            const image = document.createElement('img');
            const objectUrl = URL.createObjectURL(file);
            
            try {
                await new Promise<void>((resolve, reject) => {
                    image.onload = () => resolve();
                    image.onerror = reject; // Handle potential loading errors
                    image.src = objectUrl;
                });

                // Use a temporary canvas for each image to allow parallel processing
                const canvas = document.createElement('canvas');
                canvas.width = image.width;
                canvas.height = image.height;
                const ctx = canvas.getContext("2d");

                if (ctx) {
                    ctx.drawImage(image, 0, 0);
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const filterResult = filtering(imageData);
                    ctx.putImageData(filterResult, 0, 0);

                    // Atomically update progress
                    processedCount++;
                    setProcessingProgress(Math.round((processedCount / files.length) * 100));

                    return {
                        url: canvas.toDataURL('image/png'),
                        name: `pinku_${file.name}`,
                        originalName: file.name
                    };
                }
            } finally {
                // Immediate cleanup of the object URL
                URL.revokeObjectURL(objectUrl);
            }
            return null;
        });

        try {
            const results = await Promise.all(processingPromises);
            const validResults = results.filter(res => res !== null) as {url: string, name: string, originalName: string}[];
            setProcessedImages(validResults);
        } catch (error) {
            console.error("An error occurred during image processing:", error);
            // Optionally, set an error state to show the user
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

    const handleReset = () => {
        setFiles([]);
        setProcessedImages([]);
        setProcessingProgress(0);
    };

    return (
        <div className="bg-[#010c05] min-h-screen px-4 py-8 flex justify-center text-[#ececec]">
            <div className="w-full max-w-6xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <div className="bg-[#27e47a] p-3 rounded-full">
                            <Wand2 size={32} className="text-[#010c05]" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold mb-2">Pinku Batch Filter</h1>
                    <p className="text-[#a4d7ba] max-w-md mx-auto">
                        Transform multiple images with our magical pink duotone filter.
                        Upload, process, and download all at once.
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-[#1e5034]/50 backdrop-blur-lg rounded-2xl border border-[#a4d7ba]/40 shadow-2xl overflow-hidden">
                    <div className="p-6 md:p-8">
                        {/* Upload Area */}
                        <div
                            className="w-full border-2 border-dashed border-[#a4d7ba]/50 hover:border-[#27e47a] p-8 rounded-xl min-h-[15rem] transition-all duration-300 bg-[#a4d7ba]/10 hover:bg-[#a4d7ba]/20 mb-6 cursor-pointer"
                            onClick={openFile}
                        >
                            <input
                                type="file"
                                className="hidden"
                                ref={fileRef}
                                onChange={fileChanged}
                                accept="image/*"
                                multiple
                            />
                            {files.length === 0 ? (
                                <div className="text-center">
                                    <div className="bg-[#27e47a] p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                        <Upload size={24} className="text-[#010c05]" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">Upload Multiple Images</h3>
                                    <p className="text-[#a4d7ba] mb-4">Drag & drop or click to browse</p>
                                    <div className="inline-flex items-center gap-2 bg-[#a4d7ba]/20 hover:bg-[#a4d7ba]/30 px-4 py-2 rounded-lg transition-colors">
                                        <Camera size={16} />
                                        <span>Choose Files</span>
                                    </div>
                                    <p className="text-xs text-[#a4d7ba]/80 mt-3">Supports JPG, PNG, WEBP</p>
                                </div>
                            ) : (
                                <div className="w-full">
                                      <div className="text-center mb-4">
                                        <h3 className="text-xl font-medium">
                                            {files.length} Image{files.length !== 1 ? 's' : ''} Ready to Process
                                        </h3>
                                        <p className="text-[#a4d7ba] text-sm">You can remove images or add more.</p>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-3 max-h-64 overflow-y-auto p-2 bg-black/20 rounded-lg">
                                        {filePreviews.map((file, index) => (
                                            <div key={index} className="relative group aspect-square bg-[#010c05]/50 rounded-lg overflow-hidden">
                                                <img
                                                    src={file.url}
                                                    alt={file.name}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRemoveFile(index);
                                                        }}
                                                        className="bg-red-500/80 hover:bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center transition-transform transform hover:scale-110"
                                                        aria-label={`Remove ${file.name}`}
                                                    >
                                                        <XCircle size={20} />
                                                    </button>
                                                </div>
                                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1">
                                                    <p className="text-white text-xs truncate px-1">{file.name}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {files.length > 0 && (
                                <button
                                    className="flex items-center justify-center gap-2 bg-[#1e5034] hover:bg-[#2a6f47] p-4 rounded-xl font-medium transition-colors"
                                    onClick={handleReset}
                                >
                                    <RefreshCw size={20} />
                                    Clear All
                                </button>
                            )}
                            <button
                                className={`flex items-center justify-center gap-2 bg-[#27e47a] hover:bg-[#22c56e] text-[#010c05] p-4 rounded-xl font-bold transition-all duration-300 ${files.length === 0 ? 'md:col-span-2' : ''} disabled:opacity-50 disabled:cursor-not-allowed`}
                                onClick={handleConvert}
                                disabled={files.length === 0 || isProcessing}
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#010c05]"></div>
                                        Processing... {processingProgress}%
                                    </>
                                ) : (
                                    <>
                                        <Wand2 size={20} />
                                        Apply Pinku Filter to All ({files.length})
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Progress Bar & Results Section */}
                        {(isProcessing || processedImages.length > 0) && (
                            <div className="border-2 border-[#a4d7ba]/40 rounded-xl p-6 bg-[#1e5034]/50">
                                {isProcessing && !processedImages.length && (
                                       <div className="mb-4">
                                        <div className="flex justify-between text-sm text-[#a4d7ba] mb-1">
                                            <span>Processing Images</span>
                                            <span>{processingProgress}%</span>
                                        </div>
                                        <div className="w-full bg-[#010c05]/50 rounded-full h-2.5">
                                            <div
                                                className="bg-[#27e47a] h-2.5 rounded-full transition-all duration-300"
                                                style={{ width: `${processingProgress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}
                                {processedImages.length > 0 && (
                                    <div>
                                        <div className="flex items-center justify-between gap-4 mb-4">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="text-[#27e47a]" size={20} />
                                                <h3 className="text-lg font-semibold">Processed Results ({processedImages.length}/{files.length})</h3>
                                            </div>
                                            {!isProcessing && (
                                                <button
                                                    className="flex items-center justify-center gap-2 bg-[#27e47a] hover:bg-[#22c56e] text-[#010c05] px-4 py-2 rounded-lg font-bold transition-all duration-300"
                                                    onClick={handleDownloadAll}
                                                >
                                                    <Download size={16} />
                                                    Download All
                                                </button>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-4">
                                            {processedImages.map((image, index) => (
                                                <div key={index} className="bg-black/20 rounded-lg overflow-hidden group relative">
                                                    <div className="aspect-square flex items-center justify-center p-2">
                                                        <img
                                                            className="max-w-full max-h-full object-contain"
                                                            src={image.url}
                                                            alt={`Processed ${image.originalName}`}
                                                        />
                                                    </div>
                                                    <div className="absolute inset-0 bg-black/70 p-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end">
                                                        <p className="text-[#ececec] text-xs truncate mb-2">{image.originalName}</p>
                                                        <button
                                                            className="w-full flex items-center justify-center gap-1 bg-white/10 hover:bg-white/20 text-xs py-2 rounded-md transition-colors"
                                                            onClick={() => handleDownloadSingle(image.url, image.name)}
                                                        >
                                                            <Download size={14} />
                                                            Download
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Features Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="bg-[#1e5034]/50 backdrop-blur-sm rounded-xl p-6 border border-[#a4d7ba]/30">
                        <div className="bg-[#27e47a]/20 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                            <Wand2 className="text-[#27e47a]" size={24} />
                        </div>
                        <h3 className="font-semibold mb-2">Batch Processing</h3>
                        <p className="text-[#a4d7ba] text-sm">Process multiple images at once with our optimized algorithm</p>
                    </div>
                    
                    <div className="bg-[#1e5034]/50 backdrop-blur-sm rounded-xl p-6 border border-[#a4d7ba]/30">
                        <div className="bg-[#a4d7ba]/20 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                            <Download className="text-[#a4d7ba]" size={24} />
                        </div>
                        <h3 className="font-semibold mb-2">High Quality Output</h3>
                        <p className="text-[#a4d7ba] text-sm">Download your processed images in original resolution</p>
                    </div>
                    
                    <div className="bg-[#1e5034]/50 backdrop-blur-sm rounded-xl p-6 border border-[#a4d7ba]/30">
                        <div className="bg-[#a4d7ba]/20 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                            <Upload className="text-[#a4d7ba]" size={24} />
                        </div>
                        <h3 className="font-semibold mb-2">Easy to Use</h3>
                        <p className="text-[#a4d7ba] text-sm">Simple interface designed for batch image processing</p>
                    </div>
                </div>
            </div>
        </div>
    );
}