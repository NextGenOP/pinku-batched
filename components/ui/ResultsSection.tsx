import {
  CheckCircle,
  Download,
  ClipboardCopy,
  Check,
  ZoomIn,
} from "lucide-react";
import { type ReactNode } from "react";
import { type ProcessedImage } from "../types";

interface ResultsSectionProps {
  isProcessing: boolean;
  processedImages: ProcessedImage[];
  processingProgress: number;
  handleDownloadAll: () => void;
  handleDownloadSingle: (url: string, name: string) => void;
  handleCopySingle: (url: string, index: number) => void;
  copiedImageIndex: number | null;
  setSelectedImage: (url: string | null) => void;
}

const ResultsSection = ({
  isProcessing,
  processedImages,
  processingProgress,
  handleDownloadAll,
  handleDownloadSingle,
  handleCopySingle,
  copiedImageIndex,
  setSelectedImage,
}: ResultsSectionProps): ReactNode => {
  return (
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
              <h3 className="text-lg font-semibold">
                Processed Results ({processedImages.length})
              </h3>
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
              <div
                key={index}
                className="bg-black/20 rounded-lg overflow-hidden group relative"
              >
                <div className="aspect-square flex items-center justify-center p-2">
                  <img
                    className="max-w-full max-h-full object-contain"
                    src={image.url}
                    alt={`Processed ${image.originalName}`}
                  />
                </div>
                <div className="absolute inset-0 bg-black/80 p-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <p className="text-[#ececec] text-xs truncate w-full pr-2">
                      {image.originalName}
                    </p>
                    <button
                      onClick={() => setSelectedImage(image.url)}
                      className="flex-shrink-0 bg-white/10 hover:bg-white/20 text-white rounded-full w-6 h-6 flex items-center justify-center transition-colors"
                      aria-label={`Preview ${image.originalName}`}
                    >
                      <ZoomIn size={14} />
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    <button
                      className="w-full flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 text-xs py-2 rounded-md transition-colors"
                      onClick={() =>
                        handleDownloadSingle(image.url, image.name)
                      }
                    >
                      <Download size={14} />
                      <span>Download</span>
                    </button>
                    <button
                      className={`w-full flex items-center justify-center gap-1.5 text-xs py-2 rounded-md transition-colors ${copiedImageIndex === index ? "bg-green-500 text-white" : "bg-white/10 hover:bg-white/20"}`}
                      onClick={() => handleCopySingle(image.url, index)}
                    >
                      {copiedImageIndex === index ? (
                        <Check size={14} />
                      ) : (
                        <ClipboardCopy size={14} />
                      )}
                      <span>
                        {copiedImageIndex === index ? "Copied!" : "Copy"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsSection;
