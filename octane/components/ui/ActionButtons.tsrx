import { RefreshCw, Wand2, ArrowRightLeft } from "@octanejs/lucide";

interface ActionButtonsProps {
  filesLength: number;
  isProcessing: boolean;
  processingProgress: number;
  handleReset: () => void;
  handleConvert: () => void;
  isReversed: boolean;
  setIsReversed: (reversed: boolean) => void;
}

export function ActionButtons(props: ActionButtonsProps) @{
  <>
    @if (props.filesLength > 0 && !props.isProcessing) {
      <div class="flex justify-end mb-4">
        <button
          onClick={() => props.setIsReversed(!props.isReversed)}
          title="Reverse shadow and highlight colors"
          class="flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-[#1e5034] hover:bg-[#2a6f47] transition-colors"
        >
          <ArrowRightLeft size={16} />
          <span>{props.isReversed ? "Shadow: Pink, Highlight: Green" : "Shadow: Green, Highlight: Pink"}</span>
        </button>
      </div>
    }

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      @if (props.filesLength > 0) {
        <button
          class="flex items-center justify-center gap-2 bg-[#1e5034] hover:bg-[#2a6f47] p-4 rounded-xl font-medium transition-colors"
          onClick={props.handleReset}
        >
          <RefreshCw size={20} />
          Clear All
        </button>
      }
      <button
        class={[
          "flex items-center justify-center gap-2 bg-[#27e47a] hover:bg-[#22c56e] text-[#010c05] p-4 rounded-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
          props.filesLength === 0 && "md:col-span-2",
        ]}
        onClick={props.handleConvert}
        disabled={props.filesLength === 0 || props.isProcessing}
      >
        @if (props.isProcessing) {
          <>
            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-[#010c05]"></div>
            {"Processing... " + props.processingProgress + "%" as string}
          </>
        } @else {
          <>
            <Wand2 size={20} />
            {"Apply Filter to All (" + props.filesLength + ")" as string}
          </>
        }
      </button>
    </div>
  </>
}
