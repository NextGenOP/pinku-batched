import { CheckCircle, Download, ClipboardCopy, Check, ZoomIn } from "@octanejs/lucide";
import type { ProcessedImage } from "../types.ts";

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

export function ResultsSection(props: ResultsSectionProps) @{
  <div class="border-2 border-[#a4d7ba]/40 rounded-xl p-6 bg-[#1e5034]/50">
    @if (props.isProcessing && props.processedImages.length === 0) {
      <div class="mb-4">
        <div class="flex justify-between text-sm text-[#a4d7ba] mb-1">
          <span>Processing Images</span>
          <span>{props.processingProgress as string}{"%" as string}</span>
        </div>
        <div class="w-full bg-[#010c05]/50 rounded-full h-2.5">
          <div
            class="bg-[#27e47a] h-2.5 rounded-full transition-all duration-300"
            style={{ width: props.processingProgress + "%" }}
          ></div>
        </div>
      </div>
    }
    @if (props.processedImages.length > 0) {
      <div>
        <div class="flex items-center justify-between gap-4 mb-4">
          <div class="flex items-center gap-2">
            <CheckCircle class="text-[#27e47a]" size={20} />
            <h3 class="text-lg font-semibold">
              {"Processed Results (" + props.processedImages.length + ")" as string}
            </h3>
          </div>
          @if (!props.isProcessing) {
            <button
              class="flex items-center justify-center gap-2 bg-[#27e47a] hover:bg-[#22c56e] text-[#010c05] px-4 py-2 rounded-lg font-bold transition-all duration-300"
              onClick={props.handleDownloadAll}
            >
              <Download size={16} />
              Download All
            </button>
          }
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-4">
          @for (const image of props.processedImages; key image.url) {
            <div class="bg-black/20 rounded-lg overflow-hidden group relative">
              <div class="aspect-square flex items-center justify-center p-2">
                <img
                  class="max-w-full max-h-full object-contain"
                  src={image.url}
                  alt={"Processed " + image.originalName}
                />
              </div>
              <div class="absolute inset-0 bg-black/80 p-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between">
                <div class="flex justify-between items-start">
                  <p class="text-[#ececec] text-xs truncate w-full pr-2">
                    {image.originalName as string}
                  </p>
                  <button
                    onClick={() => props.setSelectedImage(image.url)}
                    class="flex-shrink-0 bg-white/10 hover:bg-white/20 text-white rounded-full w-6 h-6 flex items-center justify-center transition-colors"
                    aria-label={"Preview " + image.originalName}
                  >
                    <ZoomIn size={14} />
                  </button>
                </div>
                <div class="space-y-1.5">
                  <button
                    class="w-full flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 text-xs py-2 rounded-md transition-colors"
                    onClick={() => props.handleDownloadSingle(image.url, image.name)}
                  >
                    <Download size={14} />
                    <span>Download</span>
                  </button>
                  <button
                    class={[
                      "w-full flex items-center justify-center gap-1.5 text-xs py-2 rounded-md transition-colors",
                      props.copiedImageIndex === props.processedImages.indexOf(image)
                        ? "bg-green-500 text-white"
                        : "bg-white/10 hover:bg-white/20",
                    ]}
                    onClick={() => props.handleCopySingle(image.url, props.processedImages.indexOf(image))}
                  >
                    @if (props.copiedImageIndex === props.processedImages.indexOf(image)) {
                      <>
                        <Check size={14} />
                        <span>Copied!</span>
                      </>
                    } @else {
                      <>
                        <ClipboardCopy size={14} />
                        <span>Copy</span>
                      </>
                    }
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    }
  </div>
}
