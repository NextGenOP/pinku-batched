import { Wand2 } from "lucide-react";
import { type ReactNode } from "react";

const Header = (): ReactNode => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center mb-4">
        <div className="bg-[#27e47a] p-3 rounded-full">
          <Wand2 size={32} className="text-[#010c05]" />
        </div>
      </div>
      <h1 className="text-4xl font-bold mb-2">Pinku Batch Filter</h1>
      <p className="text-[#a4d7ba] max-w-md mx-auto">
        Transform multiple images with our magical duotone filter.
        Upload, process, and download all at once.
      </p>
    </div>
  );
};

export default Header;