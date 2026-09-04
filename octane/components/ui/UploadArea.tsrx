import { Upload, Camera, XCircle, ZoomIn } from "@octanejs/lucide";
import type { FilePreview } from "../types.ts";

interface UploadAreaProps {
  files: File[];
  filePreviews: FilePreview[];
  openFile: () => void;
  handleRemoveFile: (indexToRemove: number) => void;
  setSelectedImage: (url: string | null) => void;
}

export function UploadArea(props: UploadAreaProps) @{
  <div
    class="w-full border-2 border-dashed border-[#a4d7ba]/50 hover:border-[#27e47a] p-8 rounded-xl min-h-[15rem] transition-all duration-300 bg-[#a4d7ba]/10 hover:bg-[#a4d7ba]/20 mb-6 cursor-pointer"
    onClick={props.openFile}
  >
    @if (props.files.length === 0) {
      <div class="text-center">
        <div class="bg-[#27e47a] p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <Upload size={24} class="text-[#010c05]" />
        </div>
        <h3 class="text-xl font-semibold mb-2">Upload Multiple Images</h3>
        <p class="text-[#a4d7ba] mb-4">Drag & drop, click to browse, or paste an image</p>
        <div class="inline-flex items-center gap-2 bg-[#a4d7ba]/20 hover:bg-[#a4d7ba]/30 px-4 py-2 rounded-lg transition-colors">
          <Camera size={16} />
          <span>Choose Files</span>
        </div>
        <p class="text-xs text-[#a4d7ba]/80 mt-3">Supports JPG, PNG, WEBP</p>
      </div>
    } @else {
      <div class="w-full">
        <div class="text-center mb-4">
          <h3 class="text-xl font-medium">
            {props.files.length as string} {props.files.length !== 1 ? "Images" : "Image"} Ready to Process
          </h3>
          <p class="text-[#a4d7ba] text-sm">You can remove images or add more.</p>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-3 max-h-64 overflow-y-auto p-2 bg-black/20 rounded-lg">
          @for (const file of props.filePreviews; key file.url) {
            <div class="relative group aspect-square bg-[#010c05]/50 rounded-lg overflow-hidden">
              <img
                src={file.url}
                alt={file.name}
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={(e: Event) => {
                    e.stopPropagation();
                    props.setSelectedImage(file.url);
                  }}
                  class="bg-sky-500/80 hover:bg-sky-500 text-white rounded-full w-8 h-8 flex items-center justify-center transition-transform transform hover:scale-110"
                  aria-label={"Preview " + file.name}
                >
                  <ZoomIn size={20} />
                </button>
                <button
                  onClick={(e: Event) => {
                    e.stopPropagation();
                    props.handleRemoveFile(props.filePreviews.indexOf(file));
                  }}
                  class="bg-red-500/80 hover:bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center transition-transform transform hover:scale-110"
                  aria-label={"Remove " + file.name}
                >
                  <XCircle size={20} />
                </button>
              </div>
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1">
                <p class="text-white text-xs truncate px-1">{file.name as string}</p>
              </div>
            </div>
          }
        </div>
      </div>
    }
  </div>
}
