import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import axios from "axios";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CommentModal({
  open,
  onClose,
  videoId,
  user,
  isDarkMode,
}: {
  open: boolean;
  onClose: () => void;
  videoId: string;
  user: any;
  isDarkMode: boolean;
}) {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");

  const apiUrl = import.meta.env.VITE_BACKEND_API;

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/comments/${videoId}`, {
        withCredentials: true,
      });
      console.log("Fetched comments:", res);

      setComments(Array.isArray(res.data.data) ? res.data.data : []);
    } catch {
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchComments();
    // eslint-disable-next-line
  }, [open, videoId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await axios.post(
        `${apiUrl}/comments/${videoId}`,
        { content: newComment },
        { withCredentials: true }
      );
      setNewComment("");
      fetchComments();
    } catch {}
  };

  const handleUpdateComment = async (commentId: string) => {
    if (!editingContent.trim()) return;
    try {
      await axios.patch(
        `${apiUrl}/comments/c/${commentId}`,
        { content: editingContent },
        { withCredentials: true }
      );
      setEditingId(null);
      setEditingContent("");
      fetchComments();
    } catch {}
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await axios.delete(`${apiUrl}/comments/c/${commentId}`, {
        withCredentials: true,
      });
      fetchComments();
    } catch {}
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className={`max-w-lg w-full ${isDarkMode ? "bg-black/90" : "bg-white"}`}
      >
        <DialogHeader>
          <DialogTitle className={isDarkMode ? "text-white" : "text-black"}>
            Comments
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-[350px] overflow-y-auto">
          {loading ? (
            <div className={isDarkMode ? "text-white/60" : "text-black/60"}>
              Loading...
            </div>
          ) : comments.length === 0 ? (
            <div className={isDarkMode ? "text-white/60" : "text-black/60"}>
              No comments yet.
            </div>
          ) : (
            comments.map((c) => (
              <div key={c._id} className="flex items-start space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={c.owner?.avatar} alt={c.owner?.username} />
                  <AvatarFallback>
                    {c.owner?.username?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span
                      className={
                        isDarkMode
                          ? "text-white font-medium"
                          : "text-black font-medium"
                      }
                    >
                      {c.owner?.username || "User"}
                    </span>
                    <span
                      className={
                        isDarkMode
                          ? "text-white/40 text-xs"
                          : "text-black/40 text-xs"
                      }
                    >
                      {new Date(c.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {editingId === c._id ? (
                    <div className="flex items-center space-x-2 mt-1">
                      <Input
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        className={
                          isDarkMode ? "bg-white/10 text-white" : "bg-black/5"
                        }
                      />
                      <Button
                        size="sm"
                        onClick={() => handleUpdateComment(c._id)}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div
                      className={isDarkMode ? "text-white/80" : "text-black/80"}
                    >
                      {c.content}
                    </div>
                  )}
                  {c.owner?._id === user?._id && editingId !== c._id && (
                    <div className="flex space-x-2 mt-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingId(c._id);
                          setEditingContent(c.content);
                        }}
                        className="text-blue-400"
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteComment(c._id)}
                        className="text-red-500"
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="flex items-center space-x-2 mt-4">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className={isDarkMode ? "bg-white/10 text-white" : "bg-black/5"}
          />
          <Button onClick={handleAddComment} disabled={!newComment.trim()}>
            Post
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}