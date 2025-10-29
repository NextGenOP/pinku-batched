import { XCircle } from "lucide-react";
import { type ReactNode } from "react";

interface ImagePreviewModalProps {
  imageUrl: string | null;
  onClose: () => void;
}

const ImagePreviewModal = ({ imageUrl, onClose }: ImagePreviewModalProps): ReactNode => {
  if (!imageUrl) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/75 transition-colors z-10"
        onClick={onClose}
        aria-label="Close image preview"
      >
        <XCircle size={32} />
      </button>
      <img
        src={imageUrl}
        alt="Image Preview"
        className="max-w-full max-h-full object-contain"
        onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking the image
      />
    </div>
  );
};

export default ImagePreviewModal;