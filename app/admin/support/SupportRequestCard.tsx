"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteSupportRequest } from "./actions";

export type SupportRequest = {
  id: string;
  created_at: string;
  name: string;
  email: string | null;
  message: string;
  status: "pending" | "reviewed" | "resolved";
};

export default function SupportRequestCard({
  request,
}: {
  request: SupportRequest;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const maxLength = 150;
  const shouldTruncate = request.message.length > maxLength;
  const displayedMessage = isExpanded 
    ? request.message 
    : shouldTruncate 
      ? request.message.slice(0, maxLength) + "..." 
      : request.message;

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this message?")) return;
    
    setIsDeleting(true);
    const result = await deleteSupportRequest(request.id);
    
    if (result.error) {
       toast.error(result.error);
       setIsDeleting(false);
    } else {
       toast.success("Message deleted successfully");
       // No need to set isDeleting(false) since the component will unmount
       // when the server re-renders the list
    }
  }

  return (
    <div
      className={`bg-white/5 border border-white/10 rounded-xl p-5 sm:p-6 flex flex-col gap-4 transition-opacity ${
        isDeleting ? "opacity-50 pointer-events-none" : ""
      }`}
    >
        {/* Top Header: Name & actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-bold text-white">{request.name}</h3>
            {request.email && (
              <a
                href={`mailto:${request.email}`}
                className="text-sm text-accent hover:text-white transition-colors"
              >
                {request.email}
              </a>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full ${
                request.status === "pending"
                  ? "bg-yellow-500/20 text-yellow-500"
                  : request.status === "resolved"
                    ? "bg-green-500/20 text-green-500"
                    : "bg-white/10 text-white"
              }`}
            >
              {request.status}
            </span>
            <span className="text-xs text-muted" suppressHydrationWarning>
              {formatDistanceToNow(new Date(request.created_at), {
                addSuffix: true,
              })}
            </span>
            {/* Delete Button */}
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              title="Delete message"
              className="bg-red-500/10 hover:bg-red-500/20 text-red-500 p-2 rounded-lg transition-colors ml-2"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

      <div className="text-sm sm:text-base text-white/90 whitespace-pre-wrap font-mono break-all overflow-hidden w-full">
        {displayedMessage}
        
        {shouldTruncate && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-accent hover:text-white transition-colors text-sm font-sans mt-2 block font-medium"
          >
            {isExpanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>
    </div>
  );
}
