import { Wand2 } from "@octanejs/lucide";

export function Header() @{
  <div class="text-center mb-8">
    <div class="flex items-center justify-center mb-4">
      <div class="bg-[#27e47a] p-3 rounded-full">
        <Wand2 size={32} class="text-[#010c05]" />
      </div>
    </div>
    <h1 class="text-4xl font-bold mb-2">Pinku Batch Filter</h1>
    <p class="text-[#a4d7ba] max-w-md mx-auto">
      Transform multiple images with our magical duotone filter. Upload, process, and download all at once.
    </p>
  </div>
}
