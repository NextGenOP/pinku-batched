import { Upload, Camera, XCircle, ZoomIn } from "lucide-react";
import { type ReactNode, type Dispatch, type SetStateAction } from "react";

interface UploadAreaProps {
  files: File[];
  filePreviews: { name: string; url: string }[];
  openFile: () => void;
  handleRemoveFile: (indexToRemove: number) => void;
  setSelectedImage: Dispatch<SetStateAction<string | null>>;
}

const UploadArea = ({
  files,
  filePreviews,
  openFile,
  handleRemoveFile,
  setSelectedImage
}: UploadAreaProps): ReactNode => {
  return (
    <div
      className="w-full border-2 border-dashed border-[#a4d7ba]/50 hover:border-[#27e47a] p-8 rounded-xl min-h-[15rem] transition-all duration-300 bg-[#a4d7ba]/10 hover:bg-[#a4d7ba]/20 mb-6 cursor-pointer"
      onClick={openFile}
    >
      {files.length === 0 ? (
        <div className="text-center">
          <div className="bg-[#27e47a] p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Upload size={24} className="text-[#010c05]" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Upload Multiple Images</h3>
          <p className="text-[#a4d7ba] mb-4">Drag & drop, click to browse, or paste an image</p>
          <div className="inline-flex items-center gap-2 bg-[#a4d7ba]/20 hover:bg-[#a4d7ba]/30 px-4 py-2 rounded-lg transition-colors">
            <Camera size={16} />
            <span>Choose Files</span>
          </div>
          <p className="text-xs text-[#a4d7ba]/80 mt-3">Supports JPG, PNG, WEBP</p>
        </div>
      ) : (
        <div className="w-full">
          <div className="text-center mb-4">
            <h3 className="text-xl font-medium">
              {files.length} Image{files.length !== 1 ? 's' : ''} Ready to Process
            </h3>
            <p className="text-[#a4d7ba] text-sm">You can remove images or add more.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-3 max-h-64 overflow-y-auto p-2 bg-black/20 rounded-lg">
            {filePreviews.map((file, index) => (
              <div key={index} className="relative group aspect-square bg-[#010c05]/50 rounded-lg overflow-hidden">
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(file.url);
                    }}
                    className="bg-sky-500/80 hover:bg-sky-500 text-white rounded-full w-8 h-8 flex items-center justify-center transition-transform transform hover:scale-110"
                    aria-label={`Preview ${file.name}`}
                  >
                    <ZoomIn size={20} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile(index);
                    }}
                    className="bg-red-500/80 hover:bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center transition-transform transform hover:scale-110"
                    aria-label={`Remove ${file.name}`}
                  >
                    <XCircle size={20} />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1">
                  <p className="text-white text-xs truncate px-1">{file.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadArea;