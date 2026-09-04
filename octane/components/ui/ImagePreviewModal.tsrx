import { XCircle } from "@octanejs/lucide";

interface ImagePreviewModalProps {
  imageUrl: string | null;
  onClose: () => void;
}

export function ImagePreviewModal(props: ImagePreviewModalProps) @{
  <>
    @if (props.imageUrl) {
      <div
        class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in"
        onClick={props.onClose}
      >
        <button
          class="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/75 transition-colors z-10"
          onClick={props.onClose}
          aria-label="Close image preview"
        >
          <XCircle size={32} />
        </button>
        <img
          src={props.imageUrl as string}
          alt="Image Preview"
          class="max-w-full max-h-full object-contain"
          onClick={(e: Event) => e.stopPropagation()}
        />
      </div>
    }
  </>
}
