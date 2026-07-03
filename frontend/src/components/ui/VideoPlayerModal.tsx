import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

export function VideoPlayerModal({
  open,
  onClose,
  video,
  isDarkMode,
  extraActions,
}: {
  open: boolean;
  onClose: () => void;
  video: any;
  isDarkMode: boolean;
  extraActions?: React.ReactNode;
}) {
  if (!video) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className={`max-w-2xl w-full p-0 overflow-hidden ${
          isDarkMode ? "bg-black/90" : "bg-white"
        }`}
        style={{ borderRadius: 16 }}
      >
        <div className="relative">
          <button
            className="absolute top-2 right-2 z-10 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <video
            src={video.videoFile}
            poster={video.thumbnail}
            controls
            autoPlay
            className="w-full h-[360px] bg-black rounded-t-lg"
            style={{ objectFit: "contain" }}
          />
        </div>
        <div className="p-6">
          <DialogHeader>
            <DialogTitle
              className={`text-2xl font-bold mb-2 ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              {video.title}
            </DialogTitle>
            <DialogDescription
              className={`mb-2 ${
                isDarkMode ? "text-white/70" : "text-black/70"
              }`}
            >
              {video.description}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-4 text-sm">
            <span className={isDarkMode ? "text-white/60" : "text-black/60"}>
              Uploaded by: {video.owner?.username || "Unknown"}
            </span>
          </div>
          {extraActions && (
            <div className="mt-4 flex justify-end">{extraActions}</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
