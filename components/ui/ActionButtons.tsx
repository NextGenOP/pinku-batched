import { RefreshCw, Wand2, ArrowRightLeft } from "lucide-react";
import { type ReactNode } from "react";

interface ActionButtonsProps {
  filesLength: number;
  isProcessing: boolean;
  processingProgress: number;
  handleReset: () => void;
  handleConvert: () => void;
  isReversed: boolean;
  setIsReversed: (reversed: boolean) => void;
}

const ActionButtons = ({
  filesLength,
  isProcessing,
  processingProgress,
  handleReset,
  handleConvert,
  isReversed,
  setIsReversed
}: ActionButtonsProps): ReactNode => {
  return (
    <>
      {/* Filter Options */}
      {filesLength > 0 && !isProcessing && (
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsReversed(!isReversed)}
            title="Reverse shadow and highlight colors"
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-[#1e5034] hover:bg-[#2a6f47] transition-colors"
          >
            <ArrowRightLeft size={16} />
            <span>{isReversed ? "Shadow: Pink, Highlight: Green" : "Shadow: Green, Highlight: Pink"}</span>
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {filesLength > 0 && (
          <button
            className="flex items-center justify-center gap-2 bg-[#1e5034] hover:bg-[#2a6f47] p-4 rounded-xl font-medium transition-colors"
            onClick={handleReset}
          >
            <RefreshCw size={20} />
            Clear All
          </button>
        )}
        <button
          className={`flex items-center justify-center gap-2 bg-[#27e47a] hover:bg-[#22c56e] text-[#010c05] p-4 rounded-xl font-bold transition-all duration-300 ${filesLength === 0 ? 'md:col-span-2' : ''} disabled:opacity-50 disabled:cursor-not-allowed`}
          onClick={handleConvert}
          disabled={filesLength === 0 || isProcessing}
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#010c05]"></div>
              Processing... {processingProgress}%
            </>
          ) : (
            <>
              <Wand2 size={20} />
              Apply Filter to All ({filesLength})
            </>
          )}
        </button>
      </div>
    </>
  );
};

export default ActionButtons;