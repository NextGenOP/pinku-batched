import { Wand2, Download, ClipboardCopy } from "lucide-react";
import { type ReactNode } from "react";

const FeaturesSection = (): ReactNode => {
  return (
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
          <ClipboardCopy className="text-[#a4d7ba]" size={24} />
        </div>
        <h3 className="font-semibold mb-2">Clipboard Support</h3>
        <p className="text-[#a4d7ba] text-sm">Easily paste images to upload and copy results back.</p>
      </div>
    </div>
  );
};

export default FeaturesSection;