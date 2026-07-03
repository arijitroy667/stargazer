import React, { createContext } from "react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Check, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import {
  Star,
  Moon,
  Sun,
  Search,
  MessageCircle,
  User,
  Settings,
  LogOut,
  Heart,
  Play,
  Upload,
  Plus,
  Edit3,
  X,
} from "lucide-react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ConstellationBackground } from "@/components/ConstellationBackground";
import { GlassmorphicCard } from "@/components/GlassmorphicCard";

function VideoUploadForm({
  isDarkMode,
  fetchDashboardData,
  fetchAllVideos,
  user,
  onSuccess,
  closeForm,
}: {
  isDarkMode: boolean;
  fetchDashboardData: Function;
  fetchAllVideos: Function;
  user: any;
  onSuccess?: Function;
  closeForm?: Function;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Access apiUrl and uploadVideo from parent scope if needed
  const apiUrl = import.meta.env.VITE_BACKEND_API;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !thumbnail || !videoFile) {
      alert("Please fill all fields and select files.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("thumbnail", thumbnail);
    formData.append("videoFile", videoFile);

    try {
      await axios.post(`${apiUrl}/videos`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Video uploaded successfully!");
      setTitle("");
      setDescription("");
      setThumbnail(null);
      setVideoFile(null);
      // Optionally, trigger a refresh of dashboard data here
      if (user?._id && fetchDashboardData) {
        await Promise.all([
          fetchDashboardData(user._id),
          fetchAllVideos(1, 10),
        ]);
      }

      if (onSuccess) onSuccess();
      if (closeForm) closeForm();
    } catch (err) {
      alert("Failed to upload video.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className={isDarkMode ? "text-white" : "text-black"}>
          Title
        </Label>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={
            isDarkMode
              ? "bg-white/10 border-white/20 text-white"
              : "bg-black/5 border-black/20 text-black"
          }
          placeholder="Enter video title"
        />
      </div>
      <div>
        <Label className={isDarkMode ? "text-white" : "text-black"}>
          Description
        </Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={
            isDarkMode
              ? "bg-white/10 border-white/20 text-white"
              : "bg-black/5 border-black/20 text-black"
          }
          placeholder="Describe your video"
        />
      </div>
      <div>
        <Label className={isDarkMode ? "text-white" : "text-black"}>
          Thumbnail
        </Label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
          className={
            isDarkMode
              ? "bg-white/10 border-white/20 text-white"
              : "bg-black/5 border-black/20 text-black"
          }
        />
      </div>
      <div>
        <Label className={isDarkMode ? "text-white" : "text-black"}>
          Video File
        </Label>
        <Input
          type="file"
          accept="video/*"
          onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
          className={
            isDarkMode
              ? "bg-white/10 border-white/20 text-white"
              : "bg-black/5 border-black/20 text-black"
          }
        />
      </div>
      <div className="flex justify-end">
        <Button
          type="submit"
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          disabled={loading}
        >
          <Upload className="w-4 h-4 mr-2" />
          {loading ? "Uploading..." : "Publish Video"}
        </Button>
      </div>
    </form>
  );
}

function VideoPlayerModal({
  open,
  onClose,
  video,
  isDarkMode,
}: {
  open: boolean;
  onClose: () => void;
  video: any;
  isDarkMode: boolean;
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
              Uploaded by: {video.uploader?.username || "Unknown"}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CommentModal({
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

const Index = () => {
  const navigate = useNavigate();
  const fullNameRef = useRef(null);
  const emailRef = useRef(null);
  const apiUrl = import.meta.env.VITE_BACKEND_API;
  const [currentView, setCurrentView] = useState<
    "landing" | "auth" | "dashboard"
  >(() => {
    const storedUser = localStorage.getItem("user");
    // If user exists in localStorage, start in dashboard, else landing
    return storedUser ? "dashboard" : "landing";
  });
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [activeTab, setActiveTab] = useState("socials");
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [followedUserIds, setFollowedUserIds] = useState<Set<string>>(
    new Set()
  );
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [allVideos, setAllVideos] = useState([]);
  const [loadingAllVideos, setLoadingAllVideos] = useState(true);
  const [vidssUploadOpen, setVidssUploadOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [likedVideoIds, setLikedVideoIds] = useState<Set<string>>(new Set());
  const [likedTweetIds, setLikedTweetIds] = useState<Set<string>>(new Set());
  const [communityUsers, setCommunityUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    playlists: [],
    videos: [],
    tweets: [],
    likedVideos: [],
    loading: true,
    error: null,
  });
  const [allTweets, setAllTweets] = useState([]);
  const [loadingAllTweets, setLoadingAllTweets] = useState(true);
  const [gazePostContent, setGazePostContent] = useState("");
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      setCurrentView("dashboard"); // Ensure we're in dashboard when user exists
    } else {
      localStorage.removeItem("user");
      setCurrentView("landing"); // Go to landing when no user
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("currentView", currentView);
  }, [currentView]);

  useEffect(() => {
    if (dashboardData.likedVideos && Array.isArray(dashboardData.likedVideos)) {
      setLikedVideoIds(
        new Set(dashboardData.likedVideos.map((v: any) => v._id))
      );
    }
  }, [dashboardData.likedVideos]);

  useEffect(() => {
    const fetchAndPopulatePlaylists = async () => {
      if (!user?._id) return;

      // Fetch dashboard data (playlists, videos, etc.)
      const [playlistsRes, videosRes, tweetsRes, likedVideosRes] =
        await Promise.all([
          axios.get(`${apiUrl}/playlist/user/${user._id}`, {
            withCredentials: true,
          }),
          axios.get(`${apiUrl}/videos`, { withCredentials: true }),
          axios.get(`${apiUrl}/tweets/user/${user._id}`, {
            withCredentials: true,
          }),
          axios.get(`${apiUrl}/likes/videos`, { withCredentials: true }),
        ]);

      // For each playlist, fetch full video objects
      const playlistsRaw = Array.isArray(playlistsRes.data.data)
        ? playlistsRes.data.data
        : [];
      const playlistsWithVideos = await Promise.all(
        playlistsRaw.map(async (playlist: any) => {
          const videoIds = playlist.videos;
          if (!videoIds || videoIds.length === 0)
            return { ...playlist, videos: [] };
          const videoObjects = await Promise.all(
            videoIds.map((id: string) =>
              axios
                .get(`${apiUrl}/videos/${id}`, { withCredentials: true })
                .then((res) => res.data.data)
                .catch(() => null)
            )
          );
          return { ...playlist, videos: videoObjects.filter(Boolean) };
        })
      );

      setDashboardData({
        playlists: playlistsWithVideos,
        videos: Array.isArray(videosRes.data.data.videos)
          ? videosRes.data.data.videos
          : [],
        tweets: Array.isArray(tweetsRes.data.data) ? tweetsRes.data.data : [],
        likedVideos: Array.isArray(likedVideosRes.data.data)
          ? likedVideosRes.data.data
          : [],
        loading: false,
        error: null,
      });
    };

    if (user?._id) {
      fetchAndPopulatePlaylists();
      fetchDashboardData(user._id);
      fetchSubscribedChannels();
      fetchAllVideos(1, 10);
    }
    fetchAllTweets();
    fetchAndSetTweets();
  }, [user?._id]);

  useEffect(() => {
    const fetchLikedTweets = async () => {
      if (!user?._id) return;
      try {
        const res = await axios.get(`${apiUrl}/likes/tweets`, {
          withCredentials: true,
        });

        setLikedTweetIds(
          new Set(
            Array.isArray(res.data.data)
              ? res.data.data.map((t: any) => t._id)
              : []
          )
        );
      } catch (error) {
        setLikedTweetIds(new Set());
      }
    };
    fetchLikedTweets();
  }, [user?._id]);

  useEffect(() => {
    if (user?._id) {
      fetchCommunityUsers();
    }
  }, [user?._id]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formMode = authMode; // 'login' or 'signup'

    const username = (form.querySelector("#username") as HTMLInputElement)
      ?.value;
    const password = (form.querySelector("#password") as HTMLInputElement)
      ?.value;
    const email = (form.querySelector("#email") as HTMLInputElement)?.value;

    if (formMode === "signup") {
      const fullName = (form.querySelector("#fullName") as HTMLInputElement)
        ?.value;
      const avatarFile = (form.querySelector("#avatar") as HTMLInputElement)
        ?.files?.[0];
      const coverFile = (form.querySelector("#coverImage") as HTMLInputElement)
        ?.files?.[0];

      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

      if (avatarFile && avatarFile.size > MAX_FILE_SIZE) {
        alert("Avatar file is too large. Max size is 5MB.");
        return;
      }
      if (coverFile && coverFile.size > MAX_FILE_SIZE) {
        alert("Cover image file is too large. Max size is 5MB.");
        return;
      }

      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("username", username);
      formData.append("password", password);
      if (avatarFile) formData.append("avatar", avatarFile);
      if (coverFile) formData.append("coverImage", coverFile);

      try {
        const response = await axios.post(
          `${apiUrl}/users/register`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        const userData = response.data.data;
        setUser(userData);

        setCurrentView("dashboard");
      } catch (error) {
        console.error("Signup failed:", error);
        // optionally show error message
      }
    } else {
      // Login
      try {
        const response = await axios.post(
          `${apiUrl}/users/login`,
          {
            email,
            username,
            password,
          },
          { withCredentials: true }
        );

        const userData = response.data.data.user;
        setUser(userData);
        //console.log(userData);
        setCurrentView("dashboard");
      } catch (error) {
        console.error("Login failed:", error);
        // optionally show error message
      }
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${apiUrl}/users/logout`,
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setUser(null);
      localStorage.removeItem("user");
      setCurrentView("landing");
    } catch (error) {
      console.error("Logout failed:", error);
      setUser(null);
      localStorage.removeItem("user");
      setCurrentView("landing");
    }
  };

  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    const fullName = fullNameRef.current?.value;
    const email = emailRef.current?.value;

    try {
      const response = await axios.patch(
        `${apiUrl}/users/update-account`,
        {
          fullName,
          email,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setUser((prev) => ({
          ...prev,
          fullName,
          email,
        }));
        console.log("Update successful:", response.data);
      }
      // Show success notification/toast if needed
    } catch (error) {
      if (error.response?.status === 401) {
        // Handle unauthorized - maybe redirect to login
        setCurrentView("auth");
      }
      console.error("Error updating account:", error);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const oldPassword = (
      form.querySelector("#currentPassword") as HTMLInputElement
    )?.value;
    const newPassword = (form.querySelector("#newPassword") as HTMLInputElement)
      ?.value;
    const confirmPassword = (
      form.querySelector("#confirmPassword") as HTMLInputElement
    )?.value;

    if (newPassword !== confirmPassword) {
      // You can show a toast or alert here
      alert("New password and confirm password do not match.");
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}/users/change-password`,
        {
          oldPassword,
          newPassword,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        // Optionally show success notification
        alert("Password changed successfully.");
      }
    } catch (error) {
      // Optionally show error notification
      alert("Failed to change password.");
      console.error("Error changing password:", error);
    }
  };

  // Handler for updating avatar
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await axios.patch(`${apiUrl}/users/avatar`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.success) {
        setUser((prev) => ({
          ...prev,
          avatar: response.data.data.avatar,
        }));
      }
    } catch (error) {
      alert("Failed to update avatar.");
      console.error("Avatar update error:", error);
    }
  };

  // Handler for updating cover image
  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("coverImage", file);

    try {
      const response = await axios.patch(
        `${apiUrl}/users/cover-image`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (response.data.success) {
        setUser((prev) => ({
          ...prev,
          coverImage: response.data.data.coverImage,
        }));
      }
    } catch (error) {
      alert("Failed to update cover image.");
      console.error("Cover image update error:", error);
    }
  };

  const handleVideoClick = (video: any) => {
    setSelectedVideo(video);
    setIsVideoModalOpen(true);
  };

  const handleVideoModalClose = () => {
    setIsVideoModalOpen(false);
    setSelectedVideo(null);
  };

  const useFollowStats = (userId: string | number) => {
    const [stats, setStats] = useState({ followers: 0, following: 0 });

    useEffect(() => {
      if (!userId) return;

      const fetchStats = async () => {
        try {
          const [followingRes, followersRes] = await Promise.all([
            axios.get(`${apiUrl}/subscriptions/u/${userId}`, {
              withCredentials: true,
            }),
            axios.get(`${apiUrl}/subscriptions/c/${userId}`, {
              withCredentials: true,
            }),
          ]);

          // Get lengths from response arrays
          const followersCount = Array.isArray(followersRes.data.data)
            ? followersRes.data.data.length
            : 0;

          const followingCount = Array.isArray(followingRes.data.data)
            ? followingRes.data.data.length
            : 0;

          setStats({
            followers: followersCount,
            following: followingCount,
          });
        } catch (error) {
          setStats({ followers: 0, following: 0 });
          console.error("Error fetching follow stats:", error);
        }
      };

      fetchStats();
    }, [userId]);

    return stats;
  };

  const followStats = useFollowStats(user?._id);

  const fetchDashboardData = async (userId: string) => {
    if (!userId) return;
    setDashboardData((prev) => ({ ...prev, loading: true }));

    try {
      const [
        playlistsRes,
        videosRes,
        tweetsRes,
        likedVideosRes,
        likedTweetsRes,
      ] = await Promise.all([
        axios.get(`${apiUrl}/playlist/user/${userId}`, {
          withCredentials: true,
        }),
        axios.get(`${apiUrl}/videos`, { withCredentials: true }),
        axios.get(`${apiUrl}/tweets/user/${userId}`, { withCredentials: true }),
        axios.get(`${apiUrl}/likes/videos`, { withCredentials: true }),
        axios.get(`${apiUrl}/likes/tweets`, { withCredentials: true }),
      ]);

      const followStatsResponse = await Promise.all([
        axios.get(`${apiUrl}/subscriptions/u/${userId}`, {
          withCredentials: true,
        }),
        axios.get(`${apiUrl}/subscriptions/c/${userId}`, {
          withCredentials: true,
        }),
      ]);

      const followersCount = Array.isArray(followStatsResponse[1].data.data)
        ? followStatsResponse[1].data.data.length
        : 0;

      const followingCount = Array.isArray(followStatsResponse[0].data.data)
        ? followStatsResponse[0].data.data.length
        : 0;

      // Process playlists and fetch video details
      const playlistsRaw = Array.isArray(playlistsRes.data.data)
        ? playlistsRes.data.data
        : [];
      const playlistsWithVideos = await Promise.all(
        playlistsRaw.map(async (playlist: any) => {
          const videoIds = playlist.videos;
          if (!videoIds || videoIds.length === 0)
            return { ...playlist, videos: [] };
          const videoObjects = await Promise.all(
            videoIds.map((id: string) =>
              axios
                .get(`${apiUrl}/videos/${id}`, { withCredentials: true })
                .then((res) => res.data.data)
                .catch(() => null)
            )
          );
          return { ...playlist, videos: videoObjects.filter(Boolean) };
        })
      );

      setDashboardData({
        playlists: playlistsWithVideos,
        videos: Array.isArray(videosRes.data.data.videos)
          ? videosRes.data.data.videos
          : [],
        tweets: Array.isArray(tweetsRes.data.data) ? tweetsRes.data.data : [],
        likedVideos: Array.isArray(likedVideosRes.data.data)
          ? likedVideosRes.data.data
          : [],
        loading: false,
        error: null,
      });

      // Update likedTweetIds here
      setLikedVideoIds(
        new Set(likedVideosRes.data.data.map((v: any) => v._id))
      );
      setLikedTweetIds(
        new Set(likedTweetsRes.data.data.map((t: any) => t._id))
      );
    } catch (error) {
      setDashboardData((prev) => ({ ...prev, loading: false, error: error }));
    }
  };

  const fetchAndSetTweets = async () => {
    if (!user?._id) return;
    setDashboardData((prev) => ({ ...prev, loading: true }));
    try {
      const [tweetsRes, likedTweetsRes] = await Promise.all([
        axios.get(`${apiUrl}/tweets/user/${user._id}`, {
          withCredentials: true,
        }),
        axios.get(`${apiUrl}/likes/tweets`, { withCredentials: true }),
      ]);
      setDashboardData((prev) => ({
        ...prev,
        tweets: Array.isArray(tweetsRes.data.data) ? tweetsRes.data.data : [],
        loading: false,
      }));
      setLikedTweetIds(
        new Set(
          Array.isArray(likedTweetsRes.data.data)
            ? likedTweetsRes.data.data.map((t: any) => t._id)
            : []
        )
      );
    } catch (error) {
      setDashboardData((prev) => ({ ...prev, loading: false }));
      console.log("Error fetching tweets:", error);
    }
  };

  // Separate creation functions
  const createPlaylist = async (playlistData: any) => {
    return axios.post(`${apiUrl}/playlist`, playlistData, {
      withCredentials: true,
    });
  };

  const getVideoUrl = (video: any) => {
    return video.videoFile;
  };

  const handlePlaylistVideoClick = (video: any) => {
    setSelectedVideo({
      ...video,
      videoUrl: getVideoUrl(video),
    });
    setIsVideoModalOpen(true);
  };

  const refreshPlaylist = async (playlistId: string) => {
    try {
      const updatedPlaylist = await fetchPlaylistVideos(playlistId);
      setDashboardData((prev) => ({
        ...prev,
        playlists: prev.playlists.map((p) =>
          p._id === playlistId ? updatedPlaylist : p
        ),
      }));
    } catch (error) {
      console.error("Error refreshing playlist:", error);
    }
  };

  const handleAddVideo = async (videoId: string, playlistId: string) => {
    try {
      await axios.patch(
        `${apiUrl}/playlist/add/${videoId}/${playlistId}`,
        {},
        { withCredentials: true }
      );
      await refreshPlaylist(playlistId);
    } catch (error) {
      alert("Failed to add video to playlist");
    }
  };

  const handleRemoveVideo = async (videoId: string, playlistId: string) => {
    try {
      await axios.patch(
        `${apiUrl}/playlist/remove/${videoId}/${playlistId}`,
        {},
        { withCredentials: true }
      );
      await refreshPlaylist(playlistId);
    } catch (error) {
      alert("Failed to remove video from playlist");
    }
  };

  const handleDeletePlaylist = async (playlistId: string) => {
    if (!confirm("Are you sure you want to delete this playlist?")) return;

    try {
      await axios.delete(`${apiUrl}/playlist/${playlistId}`, {
        withCredentials: true,
      });
      setDashboardData((prev) => ({
        ...prev,
        playlists: prev.playlists.filter((p) => p._id !== playlistId),
      }));
    } catch (error) {
      alert("Failed to delete playlist");
    }
  };

  const fetchPlaylistVideos = async (playlistId: string) => {
    try {
      const response = await axios.get(`${apiUrl}/playlist/${playlistId}`, {
        withCredentials: true,
      });
      // response.data.data.videos is an array of video IDs
      const videoIds = response.data.data.videos;
      if (!videoIds || videoIds.length === 0)
        return { ...response.data.data, videos: [] };

      // Fetch full video objects for each video ID
      const videoObjects = await Promise.all(
        videoIds.map((id: string) =>
          axios
            .get(`${apiUrl}/videos/${id}`, { withCredentials: true })
            .then((res) => res.data.data)
            .catch(() => null)
        )
      );

      // Filter out any failed fetches (nulls)
      const validVideos = videoObjects.filter(Boolean);

      // Return the playlist object with full video objects
      return { ...response.data.data, videos: validVideos };
    } catch (error) {
      console.error("Error fetching playlist videos:", error);
      return { videos: [] };
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return;
    try {
      // 1. Delete the video
      await axios.delete(`${apiUrl}/videos/${videoId}`, {
        withCredentials: true,
      });

      // 2. Remove the video from all playlists
      const playlistIds = dashboardData.playlists
        .filter(
          (playlist: any) =>
            Array.isArray(playlist.videos) &&
            playlist.videos.some((v: any) => v._id === videoId)
        )
        .map((playlist: any) => playlist._id);

      await Promise.all(
        playlistIds.map((playlistId: string) =>
          axios.patch(
            `${apiUrl}/playlist/remove/${videoId}/${playlistId}`,
            {},
            { withCredentials: true }
          )
        )
      );

      // 3. Refresh all data
      await Promise.all([fetchDashboardData(user._id), fetchAllVideos(1, 10)]);
    } catch (error) {
      alert("Failed to delete video.");
    }
  };

  const handleLikeVideo = async (videoId: string) => {
    try {
      await axios.post(
        `${apiUrl}/likes/toggle/v/${videoId}`,
        {},
        { withCredentials: true }
      );

      // Update like status immediately for better UX
      setLikedVideoIds((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(videoId)) {
          newSet.delete(videoId);
        } else {
          newSet.add(videoId);
        }
        return newSet;
      });

      // Refresh all data
      await Promise.all([
        fetchDashboardData(user._id), // Refresh dashboard videos
        fetchAllVideos(), // Refresh all videos in Vidss section
      ]);
    } catch (error) {
      alert("Failed to like video.");
    }
  };

  const handleUpdateThumbnail = async (videoId: string) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const title = prompt("Enter a title for the thumbnail:");
      const description = prompt("Enter a description for the thumbnail:");
      const formData = new FormData();
      formData.append("thumbnail", file);
      formData.append("title", title);
      formData.append("description", description);
      try {
        await axios.patch(`${apiUrl}/videos/${videoId}`, formData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
        await fetchDashboardData(user._id); // Refresh videos after update
      } catch (error) {
        alert("Failed to update thumbnail.");
      }
    };
    fileInput.click();
  };

  const createTweet = async (tweetData: any) => {
    return axios.post(`${apiUrl}/tweets`, tweetData, { withCredentials: true });
  };

  const handleCreateTweetFromDashboard = async () => {
    const content = prompt("What's on your mind?");
    if (!content) return;
    try {
      await createTweet({ content });

      // Refresh both tweet collections
      await Promise.all([
        fetchAndSetTweets(), // Refresh Dashboard My Tweets
        fetchAllTweets(), // Refresh GAZE tweets
      ]);
    } catch (err) {
      alert("Failed to create tweet.");
    }
  };

  const handleDeleteTweet = async (tweetId: string) => {
    if (!confirm("Are you sure you want to delete this tweet?")) return;
    try {
      await axios.delete(`${apiUrl}/tweets/${tweetId}`, {
        withCredentials: true,
      });
      await Promise.all([fetchAndSetTweets(), fetchAllTweets()]);
    } catch (error) {
      alert("Failed to delete tweet.");
    }
  };

  const handleLikeTweet = async (tweetId: string) => {
    try {
      // Optimistically update UI first
      setLikedTweetIds((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(tweetId)) {
          newSet.delete(tweetId);
        } else {
          newSet.add(tweetId);
        }
        return newSet;
      });

      // Then make the API call
      await axios.post(
        `${apiUrl}/likes/toggle/t/${tweetId}`,
        {},
        { withCredentials: true }
      );

      // Optionally, refresh data in the background
      Promise.all([
        fetchAndSetTweets(),
        fetchDashboardData(user._id),
        fetchAllTweets(),
      ]).catch(console.error);
    } catch (error) {
      // Revert UI state on error
      setLikedTweetIds((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(tweetId)) {
          newSet.delete(tweetId);
        } else {
          newSet.add(tweetId);
        }
        return newSet;
      });
      console.error("Failed to like tweet:", error);
    }
  };

  const handleUpdateTweet = async (tweetId: string, oldContent: string) => {
    const newContent = prompt("Update your tweet:", oldContent);
    if (!newContent || newContent === oldContent) return;
    try {
      await axios.patch(
        `${apiUrl}/tweets/${tweetId}`,
        { content: newContent },
        { withCredentials: true }
      );
      await Promise.all([fetchAndSetTweets(), fetchAllTweets()]);
    } catch (error) {
      alert("Failed to update tweet.");
    }
  };

  const fetchCommunityUsers = async () => {
    setLoadingUsers(true);
    try {
      // Fetch all users first
      const response = await axios.get(`${apiUrl}/users/allUsers`, {
        withCredentials: true,
      });

      // For each user, fetch their follow stats
      const usersWithStats = await Promise.all(
        response.data.data.map(async (user: any) => {
          const [followingRes, followersRes] = await Promise.all([
            axios.get(`${apiUrl}/subscriptions/u/${user._id}`, {
              withCredentials: true,
            }),
            axios.get(`${apiUrl}/subscriptions/c/${user._id}`, {
              withCredentials: true,
            }),
          ]);

          return {
            ...user,
            followers: followersRes.data.data || [],
            following: followingRes.data.data || [],
          };
        })
      );

      setCommunityUsers(usersWithStats);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchSubscribedChannels = async () => {
    if (!user?._id) return;
    try {
      const response = await axios.get(
        `${apiUrl}/subscriptions/u/${user._id}`,
        { withCredentials: true }
      );

      // Extract IDs of users you follow
      const subscribedIds = new Set<string>(
        Array.isArray(response.data.data)
          ? response.data.data.map((channel: any) =>
              typeof channel === "object" ? channel._id : channel
            )
          : []
      );

      // Store in localStorage to share between components
      localStorage.setItem(
        "followedChannels",
        JSON.stringify([...subscribedIds])
      );

      setFollowedUserIds(subscribedIds);
    } catch (error) {
      console.error("Error fetching subscribed channels:", error);
    }
  };

  const handleFollowUser = async (userId: string) => {
    try {
      // Toggle follow status on the server
      await axios.post(
        `${apiUrl}/subscriptions/c/${userId}`,
        {},
        { withCredentials: true }
      );

      // Update local state optimistically
      setFollowedUserIds((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(userId)) {
          newSet.delete(userId);
        } else {
          newSet.add(userId);
        }
        return newSet;
      });

      // Refresh all necessary data to ensure consistency
      await Promise.all([
        fetchCommunityUsers(), // Update community users list
        fetchSubscribedChannels(), // Update followed users list
        fetchDashboardData(user._id), // Update dashboard stats
      ]);
    } catch (error) {
      console.error("Failed to follow user:", error);
      // Roll back optimistic update on error
      fetchSubscribedChannels();
      alert("Failed to update follow status");
    }
  };

  const isFollowingUser = (targetUser: any) => {
    return followedUserIds.has(targetUser._id);
  };

  const fetchAllTweets = async () => {
    setLoadingAllTweets(true);
    try {
      const response = await axios.get(`${apiUrl}/tweets/everytweet`, {
        withCredentials: true,
      });

      const tweetsData = Array.isArray(response.data.data)
        ? response.data.data
        : [];
      setAllTweets(tweetsData);
    } catch (error) {
      console.error("Error fetching all tweets:", error);
    } finally {
      setLoadingAllTweets(false);
    }
  };

  // Add this function to handle posting a new tweet from the GAZE section
  const handleGazePost = async () => {
    if (!gazePostContent.trim()) return;

    try {
      await createTweet({ content: gazePostContent });
      setGazePostContent(""); // Clear the input
      // Refresh tweets to show the new one
      await Promise.all([fetchAllTweets(), fetchAndSetTweets()]);
    } catch (error) {
      alert("Failed to post tweet.");
      console.error("Error posting tweet:", error);
    }
  };

  const fetchAllVideos = async (page?: number, limit?: number) => {
    setLoadingAllVideos(true);

    const safePage = typeof page === "number" && page > 0 ? page : 1;
    const safeLimit = typeof limit === "number" && limit > 0 ? limit : 10;
    try {
      const response = await axios.get(
        `${apiUrl}/videos/everyvideo/${safePage}/${safeLimit}`,
        {
          withCredentials: true,
        }
      );

      const videosData = Array.isArray(response.data.data.videos)
        ? response.data.data.videos
        : [];
      setAllVideos(videosData);
    } catch (error) {
      console.error("Error fetching all videos:", error);
    } finally {
      setLoadingAllVideos(false);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (currentView === "landing") {
    return (
      <ThemeProvider isDark={isDarkMode}>
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
          <ConstellationBackground />

          {/* Premium Glassmorphic Navigation */}
          <nav className="fixed top-0 w-full z-50 backdrop-blur-2xl bg-gradient-to-r from-white/5 via-white/10 to-white/5 border-none shadow-lg shadow-black/5">
            <div className="container mx-auto px-8 py-5 flex justify-between items-center">
              <div className="flex items-center space-x-3 animate-spring-up">
                <Star className="w-8 h-8 text-yellow-400 animate-twinkle" />
                <span className="text-2xl font-bold text-white shimmer-text tracking-wide">
                  StarGazer
                </span>
              </div>

              <div className="flex items-center space-x-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="rounded-full p-3 backdrop-blur-sm bg-white/10 text-white hover:bg-white/20 transition-all duration-500 hover:scale-105 border-none"
                >
                  {isDarkMode ? (
                    <Sun className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <Moon className="w-5 h-5 text-black" />
                  )}
                </Button>
                <Button
                  onClick={() => setCurrentView("auth")}
                  className={`premium-button glas-panel rounded-full px-6 py-3 backdrop-blur-sm border-none transition-all duration-500 hover:scale-105 shadow-lg shadow-white/10 ${
                    isDarkMode
                      ? "bg-black text-white hover:bg-neutral-900"
                      : "bg-white text-black hover:bg-neutral-100"
                  }`}
                >
                  Join StarGazer
                </Button>
              </div>
            </div>
          </nav>

          {/* Hero Section with Kinetic Typography */}
          <div className="flex items-center justify-center min-h-screen px-6">
            <div className="text-center max-w-4xl">
              <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 animate-kinetic-text">
                <span className="inline-block shimmer-text">Connect</span>{" "}
                <span
                  className="inline-block shimmer-text"
                  style={{ animationDelay: "0.2s" }}
                >
                  Among
                </span>{" "}
                <span
                  className="inline-block shimmer-text"
                  style={{ animationDelay: "0.4s" }}
                >
                  the
                </span>{" "}
                <span
                  className="inline-block shimmer-text text-yellow-400"
                  style={{ animationDelay: "0.6s" }}
                >
                  Stars
                </span>
              </h1>
              <p
                className="text-xl md:text-2xl text-purple-200 mb-8 animate-spring-up"
                style={{ animationDelay: "0.8s" }}
              >
                A cosmic social experience where your thoughts shine as bright
                as constellations
              </p>

              <div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                style={{ animationDelay: "1s" }}
              >
                <Button
                  size="lg"
                  onClick={() => setCurrentView("auth")}
                  className="premium-button glass-panel bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 text-lg backdrop-blur-sm hover-lift animate-spring-up"
                >
                  <Star className="w-5 h-5 mr-2 animate-twinkle" />
                  Join the Galaxy
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    setAuthMode("login");
                    setCurrentView("auth");
                  }}
                  className={`premium-button glass-panel px-8 py-4 backdrop-blur-sm animate-spring-up ${
                    isDarkMode
                      ? "bg-black text-white hover:bg-neutral-900"
                      : "bg-white text-black hover:bg-neutral-100"
                  }`}
                  style={{ animationDelay: "1.1s" }}
                >
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  if (currentView === "auth") {
    return (
      <ThemeProvider isDark={isDarkMode}>
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
          <ConstellationBackground />

          <div className="flex items-center justify-center min-h-screen px-6">
            <GlassmorphicCard className="w-full max-w-md">
              <div className="p-8">
                <div className="text-center mb-8">
                  <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {authMode === "login" ? "Welcome Back" : "Join StarGazer"}
                  </h2>
                  <p className="text-purple-200">
                    {authMode === "login"
                      ? "Sign in to your cosmic journey"
                      : "Create your stellar profile"}
                  </p>
                </div>

                {/* Login/SignUp form submission */}
                <form onSubmit={handleAuth} className="space-y-6">
                  {authMode === "signup" && (
                    <>
                      <div>
                        <Label htmlFor="fullName" className="text-white">
                          Full Name
                        </Label>
                        <Input
                          id="fullName"
                          type="text"
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                          placeholder="Your cosmic name"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email" className="text-white">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                          placeholder="your@email.com"
                        />
                      </div>

                      <div>
                        <Label htmlFor="avatar" className="text-white">
                          Avatar Image
                        </Label>
                        <Input
                          id="avatar"
                          type="file"
                          accept="image/*"
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                        />
                      </div>

                      <div>
                        <Label htmlFor="coverImage" className="text-white">
                          Cover Image (optional)
                        </Label>
                        <Input
                          id="coverImage"
                          type="file"
                          accept="image/*"
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <Label htmlFor="username" className="text-white">
                      {authMode === "login" ? "Username" : "Username"}
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      placeholder={
                        authMode === "login" ? "username" : "@yourusername"
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-white">
                      Confirm Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="password" className="text-white">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      placeholder="Enter your password"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    {authMode === "login" ? "Sign In" : "Create Account"}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    onClick={() =>
                      setAuthMode(authMode === "login" ? "signup" : "login")
                    }
                    className="text-purple-300 hover:text-white transition-colors"
                  >
                    {authMode === "login"
                      ? "Don't have an account? Sign up"
                      : "Already have an account? Sign in"}
                  </button>
                </div>

                <div className="mt-4 text-center">
                  <button
                    onClick={() => setCurrentView("landing")}
                    className="text-purple-300 hover:text-white transition-colors text-sm"
                  >
                    ← Back to landing
                  </button>
                </div>
              </div>
            </GlassmorphicCard>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  // Dashboard
  return (
    <ThemeProvider isDark={isDarkMode}>
      <div
        className={`min-h-screen transition-all duration-500 ${
          isDarkMode
            ? "bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950"
            : "bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100"
        }`}
      >
        {/* Premium Glassmorphic Header */}
        <header
          className={`sticky top-0 z-50 backdrop-blur-2xl border-none shadow-lg transition-all duration-500 ${
            isDarkMode
              ? "bg-gradient-to-r from-black/10 via-purple-900/15 to-black/10 shadow-purple-500/5"
              : "bg-gradient-to-r from-white/20 via-blue-100/25 to-white/20 shadow-blue-500/5"
          }`}
        >
          <div className="container mx-auto px-8 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-3">
                  <Star
                    className={`w-8 h-8 ${
                      isDarkMode ? "text-yellow-400" : "text-indigo-600"
                    }`}
                  />
                  <span
                    className={`text-2xl font-bold tracking-wide ${
                      isDarkMode ? "text-white" : "text-indigo-900"
                    }`}
                  >
                    StarGazer
                  </span>
                </div>

                <div className="relative">
                  <Search
                    className={`w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 ${
                      isDarkMode ? "text-white/60" : "text-black/60"
                    }`}
                  />
                  <Input
                    placeholder="Search the galaxy..."
                    className={`pl-12 w-96 h-12 rounded-full transition-all duration-300 border-none ${
                      isDarkMode
                        ? "bg-white/10 text-white placeholder:text-white/60 backdrop-blur-sm focus:bg-white/15"
                        : "bg-black/5 text-black placeholder:text-black/60 backdrop-blur-sm focus:bg-black/10"
                    }`}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className={`rounded-full p-3 backdrop-blur-sm ${
                    isDarkMode
                      ? "text-white hover:bg-white/10"
                      : "text-black hover:bg-black/10"
                  } border-none transition-all duration-300 hover:scale-105`}
                >
                  {isDarkMode ? (
                    <Sun className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <Moon className="w-5 h-5 text-black" />
                  )}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full"
                    >
                      <Avatar className="h-10 w-10 ring-2 ring-purple-500/30">
                        <AvatarImage src={user.avatar} alt={user.fullName} />
                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm">
                          SG
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className={`w-64 rounded-2xl border-none shadow-2xl ${
                      isDarkMode
                        ? "bg-black/60 backdrop-blur-2xl text-white"
                        : "bg-white/60 backdrop-blur-2xl text-black"
                    }`}
                    align="end"
                    forceMount
                  >
                    <DropdownMenuItem
                      className="flex items-center gap-3 cursor-pointer p-4 rounded-xl hover:bg-white/10 transition-all duration-300"
                      onClick={() => setActiveTab("profile")}
                    >
                      <User className="w-5 h-5" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex items-center gap-3 cursor-pointer p-4 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-5 h-5" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-8"
          >
            <TabsList
              className={`grid w-full grid-cols-4 ${
                isDarkMode
                  ? "bg-white/10 backdrop-blur-sm"
                  : "bg-black/5 backdrop-blur-sm"
              }`}
            >
              <TabsTrigger
                value="socials"
                className={`${
                  isDarkMode
                    ? "data-[state=active]:bg-white/20 text-white"
                    : "data-[state=active]:bg-white text-black"
                }`}
              >
                Socials
              </TabsTrigger>
              <TabsTrigger
                value="dashboard"
                className={`${
                  isDarkMode
                    ? "data-[state=active]:bg-white/20 text-white"
                    : "data-[state=active]:bg-white text-black"
                }`}
              >
                Dashboard
              </TabsTrigger>
              <TabsTrigger
                value="profile"
                className={`${
                  isDarkMode
                    ? "data-[state=active]:bg-white/20 text-white"
                    : "data-[state=active]:bg-white text-black"
                }`}
              >
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className={`${
                  isDarkMode
                    ? "data-[state=active]:bg-white/20 text-white"
                    : "data-[state=active]:bg-white text-black"
                }`}
              >
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="socials" className="space-y-8">
              {/* User Directory */}
              <section>
                <h2
                  className={`text-2xl font-bold mb-6 ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  Stellar Community
                </h2>
                {loadingUsers ? (
                  <div>Loading users...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {communityUsers.map((communityUser: any) => (
                      <GlassmorphicCard key={communityUser._id} className="p-6">
                        <div className="flex items-center space-x-4 mb-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage
                              src={communityUser.avatar}
                              alt={communityUser.fullName}
                            />
                            <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                              {communityUser.fullName?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3
                              className={`font-semibold ${
                                isDarkMode ? "text-white" : "text-black"
                              }`}
                            >
                              {communityUser.fullName}
                            </h3>
                            <p
                              className={`text-sm ${
                                isDarkMode ? "text-white/60" : "text-black/60"
                              }`}
                            >
                              @{communityUser.username}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex space-x-4 text-sm">
                            <span
                              className={
                                isDarkMode ? "text-white/80" : "text-black/80"
                              }
                            >
                              {Array.isArray(communityUser.followers)
                                ? communityUser.followers.length
                                : 0}{" "}
                              followers
                            </span>
                            <span
                              className={
                                isDarkMode ? "text-white/80" : "text-black/80"
                              }
                            >
                              {Array.isArray(communityUser.following)
                                ? communityUser.following.length
                                : 0}{" "}
                              following
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleFollowUser(communityUser._id)}
                            className={`flex-1 transition-all duration-300 ${
                              isFollowingUser(communityUser)
                                ? "bg-green-500 hover:bg-red-500 group"
                                : "premium-button bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                            }`}
                          >
                            {isFollowingUser(communityUser) ? (
                              <>
                                <Check className="w-4 h-4 mr-2 group-hover:hidden" />
                                <UserPlus className="w-4 h-4 mr-2 hidden group-hover:block" />
                                <span className="group-hover:hidden">
                                  Following
                                </span>
                                <span className="hidden group-hover:block">
                                  Unfollow
                                </span>
                              </>
                            ) : (
                              <>
                                <UserPlus className="w-4 h-4 mr-2" />
                                Follow
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className={`flex-1 ${
                              isDarkMode
                                ? "text-white border-white/30 hover:bg-white/10"
                                : "text-black border-black/30 hover:bg-black/10"
                            }`}
                            onClick={() =>
                              navigate(`/profile/${communityUser._id}`)
                            }
                          >
                            <User className="w-4 h-4 mr-2" />
                            View Profile
                          </Button>
                        </div>
                      </GlassmorphicCard>
                    ))}
                  </div>
                )}
              </section>

              {/* GAZE and Vidss Sections Side by Side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Gaze Section */}
                <section>
                  <h2
                    className={`text-2xl font-bold mb-6 ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    GAZE
                  </h2>

                  {/* Post Input */}
                  <GlassmorphicCard className="p-6 mb-6">
                    <div className="flex space-x-4">
                      <Avatar>
                        <AvatarImage src={user.avatar} alt={user.fullName} />
                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          {user.fullName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Textarea
                          placeholder="What's on your mind? Share your cosmic thoughts..."
                          className={`resize-none ${
                            isDarkMode
                              ? "bg-white/10 border-white/20 text-white placeholder:text-white/60"
                              : "bg-black/5 border-black/20 text-black placeholder:text-black/60"
                          }`}
                          value={gazePostContent}
                          onChange={(e) => setGazePostContent(e.target.value)}
                        />
                        <div className="flex justify-end mt-3">
                          <Button
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                            onClick={handleGazePost}
                            disabled={!gazePostContent.trim()}
                          >
                            <Edit3 className="w-4 h-4 mr-2" />
                            Post
                          </Button>
                        </div>
                      </div>
                    </div>
                  </GlassmorphicCard>

                  {/* Posts Feed */}
                  <div
                    className="space-y-6 overflow-y-auto scrollbar-transparent"
                    style={{
                      maxHeight: "600px",
                      minHeight: "300px",
                      paddingRight: 8,
                    }}
                  >
                    {loadingAllTweets ? (
                      <div className="flex justify-center py-10">
                        <div className="animate-pulse text-center">
                          <div
                            className={
                              isDarkMode ? "text-white/60" : "text-black/60"
                            }
                          >
                            Loading tweets...
                          </div>
                        </div>
                      </div>
                    ) : allTweets.length === 0 ? (
                      <div className="text-center py-10">
                        <p
                          className={
                            isDarkMode ? "text-white/60" : "text-black/60"
                          }
                        >
                          No tweets yet. Be the first to share your thoughts!
                        </p>
                      </div>
                    ) : (
                      allTweets.map((tweet: any) => (
                        <GlassmorphicCard key={tweet._id} className="p-6">
                          <div className="flex items-start space-x-4">
                            <Avatar>
                              <AvatarImage
                                src={tweet.owner?.avatar}
                                alt={tweet.owner?.fullName}
                              />
                              <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                {tweet.owner?.fullName?.charAt(0) || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4
                                  className={`font-semibold ${
                                    isDarkMode ? "text-white" : "text-black"
                                  }`}
                                >
                                  <span
                                    className={`text-sm ${
                                      isDarkMode
                                        ? "text-white/60"
                                        : "text-black/60"
                                    }`}
                                  >
                                    @{tweet.owner?.username || "unknown"}
                                  </span>
                                </h4>
                                <span
                                  className={`text-sm ${
                                    isDarkMode
                                      ? "text-white/40"
                                      : "text-black/40"
                                  }`}
                                >
                                  ·{" "}
                                  {new Date(
                                    tweet.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <p
                                className={`mb-4 ${
                                  isDarkMode ? "text-white/80" : "text-black/80"
                                }`}
                              >
                                {tweet.content}
                              </p>
                              <div className="flex items-center space-x-6">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleLikeTweet(tweet._id)}
                                  className={
                                    likedTweetIds.has(tweet._id)
                                      ? isDarkMode
                                        ? "text-pink-400 hover:text-pink-600"
                                        : "text-pink-600 hover:text-pink-800"
                                      : isDarkMode
                                      ? "text-white/60 hover:text-pink-400"
                                      : "text-black/60 hover:text-pink-600"
                                  }
                                >
                                  <Heart
                                    className={`w-4 h-4 mr-1 ${
                                      likedTweetIds.has(tweet._id)
                                        ? "fill-current"
                                        : ""
                                    }`}
                                    fill={
                                      likedTweetIds.has(tweet._id)
                                        ? "currentColor"
                                        : "none"
                                    }
                                    stroke="currentColor"
                                  />
                                  Like
                                </Button>

                                {tweet.owner?._id === user?._id && (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className={
                                        isDarkMode
                                          ? "text-purple-400 hover:text-purple-600"
                                          : "text-purple-600 hover:text-purple-800"
                                      }
                                      onClick={() =>
                                        handleUpdateTweet(
                                          tweet._id,
                                          tweet.content
                                        )
                                      }
                                    >
                                      <Edit3 className="w-4 h-4 mr-1" />
                                      Update
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className={
                                        isDarkMode
                                          ? "text-red-500 hover:text-red-600"
                                          : "text-red-600 hover:text-red-700"
                                      }
                                      onClick={() => {
                                        if (
                                          confirm(
                                            "Are you sure you want to delete this tweet?"
                                          )
                                        ) {
                                          handleDeleteTweet(tweet._id).then(
                                            () => {
                                              fetchAllTweets(); // Refresh all tweets after delete
                                            }
                                          );
                                        }
                                      }}
                                    >
                                      <X className="w-4 h-4 mr-1" />
                                      Delete
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </GlassmorphicCard>
                      ))
                    )}
                  </div>
                </section>

                {/* Vidss Section */}
                <section>
                  <h2
                    className={`text-2xl font-bold mb-6 ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    Vidss
                  </h2>

                  {/* Video Upload */}
                  <GlassmorphicCard className="p-6 mb-6">
                    {vidssUploadOpen ? (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3
                            className={
                              isDarkMode
                                ? "text-white font-medium"
                                : "text-black font-medium"
                            }
                          >
                            Upload New Video
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setVidssUploadOpen(false)}
                            className={isDarkMode ? "text-white" : "text-black"}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <VideoUploadForm
                          isDarkMode={isDarkMode}
                          fetchDashboardData={fetchDashboardData}
                          fetchAllVideos={fetchAllVideos}
                          user={user}
                          onSuccess={() => setVidssUploadOpen(false)}
                          closeForm={() => setVidssUploadOpen(false)}
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col space-y-4">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage
                              src={user?.avatar}
                              alt={user?.fullName}
                            />
                            <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                              {user?.fullName?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <Input
                              placeholder="Share a stellar video..."
                              className={`${
                                isDarkMode
                                  ? "bg-white/10 border-white/20 text-white placeholder:text-white/60"
                                  : "bg-black/5 border-black/20 text-black placeholder:text-black/60"
                              }`}
                              onClick={() => setVidssUploadOpen(true)}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                            onClick={() => setVidssUploadOpen(true)}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Video
                          </Button>
                        </div>
                      </div>
                    )}
                  </GlassmorphicCard>

                  {/* Video Feed - make this section scrollable and videos playable */}
                  <div
                    className="space-y-6 overflow-y-auto scrollbar-transparent"
                    style={{
                      maxHeight: "600px",
                      minHeight: "300px",
                      paddingRight: 8,
                    }}
                  >
                    {loadingAllVideos ? (
                      <div className="flex justify-center py-10">
                        <div className="animate-pulse text-center">
                          <div
                            className={
                              isDarkMode ? "text-white/60" : "text-black/60"
                            }
                          >
                            Loading videos...
                          </div>
                        </div>
                      </div>
                    ) : allVideos.length === 0 ? (
                      <div className="text-center py-10">
                        <p
                          className={
                            isDarkMode ? "text-white/60" : "text-black/60"
                          }
                        >
                          No videos yet. Be the first to share one!
                        </p>
                      </div>
                    ) : (
                      allVideos.map((video: any) => (
                        <GlassmorphicCard key={video._id} className="p-6">
                          <div className="flex items-start space-x-4">
                            <Avatar>
                              <AvatarImage
                                src={video.owner?.avatar}
                                alt={video.owner?.fullName}
                              />
                              <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                                {video.owner?.fullName?.charAt(0) || "V"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4
                                  className={`font-semibold ${
                                    isDarkMode ? "text-white" : "text-black"
                                  }`}
                                >
                                  {video.owner?.fullName || "Video Creator"}
                                </h4>
                                <span
                                  className={`text-sm ${
                                    isDarkMode
                                      ? "text-white/60"
                                      : "text-black/60"
                                  }`}
                                >
                                  @{video.owner?.username || "creator"}
                                </span>
                                <span
                                  className={`text-sm ${
                                    isDarkMode
                                      ? "text-white/40"
                                      : "text-black/40"
                                  }`}
                                >
                                  ·{" "}
                                  {new Date(
                                    video.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>

                              {/* Playable Video */}
                              <div
                                className="aspect-video rounded-lg mb-4 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity overflow-hidden bg-black"
                                style={{ width: "384px", height: "216px" }}
                              >
                                <video
                                  src={video.videoFile}
                                  poster={video.thumbnail}
                                  controls
                                  className="w-full h-full object-contain rounded"
                                  style={{ background: "#000" }}
                                />
                              </div>

                              <h3
                                className={`font-medium mb-2 ${
                                  isDarkMode ? "text-white" : "text-black"
                                }`}
                              >
                                {video.title}
                              </h3>

                              <p
                                className={`mb-4 ${
                                  isDarkMode ? "text-white/80" : "text-black/80"
                                }`}
                              >
                                {video.description}
                              </p>

                              <div className="flex items-center space-x-6">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleLikeVideo(video._id)}
                                  className={
                                    likedVideoIds.has(video._id)
                                      ? isDarkMode
                                        ? "text-pink-400 hover:text-pink-600"
                                        : "text-pink-600 hover:text-pink-800"
                                      : isDarkMode
                                      ? "text-white/60 hover:text-pink-400"
                                      : "text-black/60 hover:text-pink-600"
                                  }
                                >
                                  <Heart
                                    className={`w-4 h-4 mr-1 ${
                                      likedVideoIds.has(video._id)
                                        ? "fill-current"
                                        : ""
                                    }`}
                                    fill={
                                      likedVideoIds.has(video._id)
                                        ? "currentColor"
                                        : "none"
                                    }
                                    stroke="currentColor"
                                  />
                                  Like
                                </Button>

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={
                                    isDarkMode
                                      ? "text-white/60 hover:text-white"
                                      : "text-black/60 hover:text-black"
                                  }
                                  onClick={() => {
                                    setSelectedVideo(video);
                                    setIsCommentModalOpen(true);
                                  }}
                                >
                                  <MessageCircle className="w-4 h-4 mr-1" />
                                  Comment
                                </Button>

                                {/* Show additional options for videos owned by current user */}
                                {video.owner?._id === user?._id && (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className={
                                        isDarkMode
                                          ? "text-red-500 hover:text-red-600"
                                          : "text-red-600 hover:text-red-700"
                                      }
                                      onClick={() => {
                                        if (
                                          confirm(
                                            "Are you sure you want to delete this video?"
                                          )
                                        ) {
                                          handleDeleteVideo(video._id).then(
                                            () => {
                                              fetchAllVideos(1, 10); // Refresh all videos after delete
                                            }
                                          );
                                        }
                                      }}
                                    >
                                      <X className="w-4 h-4 mr-1" />
                                      Delete
                                    </Button>
                                  </>
                                )}

                                {/* Add to Playlist button */}
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className={
                                        isDarkMode
                                          ? "text-white/60 hover:text-white"
                                          : "text-black/60 hover:text-black"
                                      }
                                    >
                                      <Plus className="w-4 h-4 mr-1" />
                                      Add to Playlist
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    className={`w-64 ${
                                      isDarkMode
                                        ? "bg-black/80 text-white"
                                        : "bg-white text-black"
                                    } backdrop-blur-lg`}
                                  >
                                    {dashboardData.playlists.length === 0 ? (
                                      <div className="px-2 py-4 text-center text-sm">
                                        No playlists yet. Create one in the
                                        Dashboard!
                                      </div>
                                    ) : (
                                      dashboardData.playlists.map(
                                        (playlist: any) => (
                                          <DropdownMenuItem
                                            key={playlist._id}
                                            className="cursor-pointer"
                                            onClick={async () => {
                                              await handleAddVideo(
                                                video._id,
                                                playlist._id
                                              );
                                              await fetchDashboardData(
                                                user._id
                                              );
                                            }}
                                          >
                                            {playlist.name}
                                          </DropdownMenuItem>
                                        )
                                      )
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </div>
                        </GlassmorphicCard>
                      ))
                    )}
                  </div>
                </section>
                {selectedVideo && (
                  <CommentModal
                    open={isCommentModalOpen}
                    onClose={() => setIsCommentModalOpen(false)}
                    videoId={selectedVideo._id}
                    user={user}
                    isDarkMode={isDarkMode}
                  />
                )}
              </div>
            </TabsContent>

            <TabsContent value="dashboard" className="space-y-8">
              {/* Cover Header */}
              <GlassmorphicCard className="relative overflow-hidden">
                {/* Cover Image as background */}
                <div className="absolute inset-0 h-48 w-full overflow-hidden z-0">
                  {user.coverImage ? (
                    <img
                      src={user.coverImage}
                      alt="Cover"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="h-48 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600"></div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    ref={coverInputRef}
                    style={{ display: "none" }}
                    onChange={handleCoverChange}
                  />
                  <button
                    type="button"
                    className="absolute right-4 bottom-4 bg-black/60 text-white px-3 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => coverInputRef.current?.click()}
                  >
                    Change Cover
                  </button>
                  {/* Overlay for better text visibility */}
                  <div className="absolute inset-0 bg-black/30"></div>
                </div>
                <div className="relative z-10 p-6 pt-32">
                  <div className="flex items-end space-x-6">
                    {/* Avatar */}
                    <Avatar
                      className="w-24 h-24 border-4 border-white cursor-pointer relative group"
                      onClick={() => avatarInputRef.current?.click()}
                    >
                      <AvatarImage src={user.avatar} alt={user.fullName} />
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl">
                        SG
                      </AvatarFallback>
                      <input
                        type="file"
                        accept="image/*"
                        ref={avatarInputRef}
                        style={{ display: "none" }}
                        onChange={handleAvatarChange}
                      />
                      <span className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        Change
                      </span>
                    </Avatar>
                    <div className="pb-2">
                      <h1
                        className={`text-3xl font-bold ${
                          isDarkMode ? "text-white" : "text-black"
                        }`}
                      >
                        {user.fullName}
                      </h1>
                      <p
                        className={`${
                          isDarkMode ? "text-white/60" : "text-black/60"
                        }`}
                      >
                        {user.username}
                      </p>
                      <div className="flex space-x-6 mt-2">
                        <span
                          className={`text-sm ${
                            isDarkMode ? "text-white/80" : "text-black/80"
                          }`}
                        >
                          <strong>{followStats.following}</strong> Following
                        </span>
                        <span
                          className={`text-sm ${
                            isDarkMode ? "text-white/80" : "text-black/80"
                          }`}
                        >
                          <strong>{followStats.followers}</strong> Followers
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassmorphicCard>

              {/* Dashboard Tabs */}
              <Tabs defaultValue="playlists" className="space-y-6">
                <TabsList
                  className={`${isDarkMode ? "bg-white/10" : "bg-black/5"}`}
                >
                  <TabsTrigger
                    value="playlists"
                    className={
                      isDarkMode
                        ? "data-[state=active]:bg-white/20 text-white"
                        : "data-[state=active]:bg-white text-black"
                    }
                  >
                    My Playlists
                  </TabsTrigger>
                  <TabsTrigger
                    value="videos"
                    className={
                      isDarkMode
                        ? "data-[state=active]:bg-white/20 text-white"
                        : "data-[state=active]:bg-white text-black"
                    }
                  >
                    My Videos
                  </TabsTrigger>
                  <TabsTrigger
                    value="tweets"
                    className={
                      isDarkMode
                        ? "data-[state=active]:bg-white/20 text-white"
                        : "data-[state=active]:bg-white text-black"
                    }
                  >
                    My Tweets
                  </TabsTrigger>
                  <TabsTrigger
                    value="liked"
                    className={
                      isDarkMode
                        ? "data-[state=active]:bg-white/20 text-white"
                        : "data-[state=active]:bg-white text-black"
                    }
                  >
                    Liked Videos
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="playlists">
                  <div className="flex justify-between items-center mb-6">
                    <h3
                      className={`text-xl font-bold ${
                        isDarkMode ? "text-white" : "text-black"
                      }`}
                    >
                      My Playlists
                    </h3>
                    <Button
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      onClick={async () => {
                        const name = prompt("Enter playlist name:");
                        const description = prompt("Write your description");
                        if (!name || !description) return;
                        try {
                          await createPlaylist({ name, description });
                          // Refresh playlists immediately
                          await fetchDashboardData(user?._id);
                        } catch (err) {
                          alert("Failed to create playlist.");
                        }
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Playlist
                    </Button>
                  </div>

                  {dashboardData.loading ? (
                    <div>Loading...</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {dashboardData.playlists.map((playlist: any) => (
                        <GlassmorphicCard key={playlist._id} className="p-4">
                          {/* Playlist Header */}
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4
                                className={`font-semibold mb-2 ${
                                  isDarkMode ? "text-white" : "text-black"
                                }`}
                              >
                                {playlist.name}
                              </h4>
                              <p
                                className={`text-sm ${
                                  isDarkMode ? "text-white/60" : "text-black/60"
                                }`}
                              >
                                {Array.isArray(playlist.videos)
                                  ? playlist.videos.length
                                  : 0}{" "}
                                videos
                              </p>
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeletePlaylist(playlist._id)}
                            >
                              Delete
                            </Button>
                          </div>

                          {/* Videos List */}
                          {Array.isArray(playlist.videos) &&
                            playlist.videos.length > 0 && (
                              <div className="space-y-2 mb-4">
                                <Label
                                  className={`block mb-1 ${
                                    isDarkMode ? "text-white" : "text-black"
                                  }`}
                                >
                                  Videos in Playlist
                                </Label>
                                <div className="max-h-48 overflow-y-auto space-y-2">
                                  {playlist.videos.map((video: any) => (
                                    <div
                                      key={video._id}
                                      className="flex items-center justify-between bg-black/10 rounded px-2 py-1 cursor-pointer hover:bg-black/20"
                                      onClick={() =>
                                        handlePlaylistVideoClick(video)
                                      }
                                    >
                                      <div className="flex items-center space-x-2">
                                        <Play className="w-4 h-4 " />
                                        <span
                                          className={
                                            isDarkMode
                                              ? "text-white"
                                              : "text-black"
                                          }
                                        >
                                          {video.title}
                                        </span>
                                      </div>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={async (e) => {
                                          e.stopPropagation();
                                          await handleRemoveVideo(
                                            video._id,
                                            playlist._id
                                          );
                                        }}
                                      >
                                        <X className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                          {/* Manage Playlist Dialog */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className={`w-full ${
                                  isDarkMode
                                    ? "text-white border-white/30 hover:bg-white/10"
                                    : "text-black border-black/30 hover:bg-black/10"
                                }`}
                              >
                                Manage Playlist
                              </Button>
                            </DialogTrigger>
                            <DialogContent
                              className={`${
                                isDarkMode ? "bg-black/80" : "bg-white/80"
                              } backdrop-blur-lg`}
                            >
                              <DialogHeader>
                                <DialogTitle
                                  className={
                                    isDarkMode ? "text-white" : "text-black"
                                  }
                                >
                                  Manage Playlist
                                </DialogTitle>
                                <DialogDescription
                                  className={
                                    isDarkMode
                                      ? "text-white/70"
                                      : "text-black/70"
                                  }
                                >
                                  Update playlist details and manage videos
                                </DialogDescription>
                              </DialogHeader>

                              {/* Update Playlist Form */}
                              <form
                                onSubmit={async (e) => {
                                  e.preventDefault();
                                  const form = e.target as HTMLFormElement;
                                  const name = (
                                    form.querySelector(
                                      "[name='name']"
                                    ) as HTMLInputElement
                                  )?.value;
                                  const description = (
                                    form.querySelector(
                                      "[name='description']"
                                    ) as HTMLTextAreaElement
                                  )?.value;

                                  try {
                                    await axios.patch(
                                      `${apiUrl}/playlist/${playlist._id}`,
                                      { name, description },
                                      { withCredentials: true }
                                    );
                                    await fetchDashboardData(user._id);
                                  } catch (err) {
                                    alert("Failed to update playlist.");
                                  }
                                }}
                                className="space-y-4"
                              >
                                <div>
                                  <Label
                                    className={
                                      isDarkMode ? "text-white" : "text-black"
                                    }
                                  >
                                    Name
                                  </Label>
                                  <Input
                                    name="name"
                                    defaultValue={playlist.name}
                                    className={
                                      isDarkMode
                                        ? "bg-white/10 text-white"
                                        : "bg-black/5"
                                    }
                                  />
                                </div>

                                <div>
                                  <Label
                                    className={
                                      isDarkMode ? "text-white" : "text-black"
                                    }
                                  >
                                    Description
                                  </Label>
                                  <Textarea
                                    name="description"
                                    defaultValue={playlist.description}
                                    className={
                                      isDarkMode
                                        ? "bg-white/10 text-white"
                                        : "bg-black/5"
                                    }
                                  />
                                </div>

                                <Button
                                  type="submit"
                                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
                                >
                                  Save Changes
                                </Button>
                              </form>

                              {/* Add Videos Section */}
                              <div className="mt-6">
                                <Label
                                  className={
                                    isDarkMode ? "text-white" : "text-black"
                                  }
                                >
                                  Add Videos
                                </Label>
                                <div className="max-h-48 overflow-y-auto mt-2 space-y-2">
                                  {dashboardData.videos
                                    .filter(
                                      (video) =>
                                        !playlist.videos?.some(
                                          (v) => v._id === video._id
                                        )
                                    )
                                    .map((video: any) => (
                                      <div
                                        key={video._id}
                                        className="flex items-center justify-between p-2 hover:bg-white/10 rounded"
                                      >
                                        <span
                                          className={
                                            isDarkMode
                                              ? "text-white"
                                              : "text-black"
                                          }
                                        >
                                          {video.title}
                                        </span>
                                        <Button
                                          size="sm"
                                          onClick={() =>
                                            handleAddVideo(
                                              video._id,
                                              playlist._id
                                            )
                                          }
                                        >
                                          Add
                                        </Button>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </GlassmorphicCard>
                      ))}
                    </div>
                  )}

                  {/* Video Player Modal */}
                  <VideoPlayerModal
                    open={isVideoModalOpen}
                    onClose={handleVideoModalClose}
                    video={
                      selectedVideo
                        ? {
                            ...selectedVideo,
                            videoUrl: getVideoUrl(selectedVideo),
                          }
                        : null
                    }
                    isDarkMode={isDarkMode}
                  />
                </TabsContent>

                <TabsContent value="videos">
                  <div className="flex justify-between items-center mb-6">
                    <h3
                      className={`text-xl font-bold ${
                        isDarkMode ? "text-white" : "text-black"
                      }`}
                    >
                      My Videos
                    </h3>
                  </div>
                  <GlassmorphicCard className="p-6 mb-8">
                    <VideoUploadForm
                      isDarkMode={isDarkMode}
                      fetchDashboardData={fetchDashboardData}
                      fetchAllVideos={fetchAllVideos}
                      user={user}
                    />
                  </GlassmorphicCard>
                  {dashboardData.loading ? (
                    <div>Loading...</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {dashboardData.videos.map((video: any) => (
                        <div
                          key={video._id}
                          className="p-4 cursor-pointer hover:scale-[1.03] transition-transform group"
                          onClick={() => handleVideoClick(video)}
                        >
                          <GlassmorphicCard>
                            {/* Thumbnail */}
                            <div className="aspect-video bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                              {video.thumbnail ? (
                                <img
                                  src={video.thumbnail}
                                  alt={video.title}
                                  className="object-cover w-full h-full"
                                />
                              ) : (
                                <Play className="w-12 h-12 text-white opacity-60" />
                              )}
                            </div>
                            {/* Title */}
                            <h4
                              className={`font-semibold mb-2 ${
                                isDarkMode ? "text-white" : "text-black"
                              }`}
                            >
                              {video.title}
                            </h4>
                            {/* Description */}
                            <p
                              className={`text-sm mb-2 ${
                                isDarkMode ? "text-white/60" : "text-black/60"
                              }`}
                            >
                              {video.description}
                            </p>
                            {/* Actions */}
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={
                                    isDarkMode
                                      ? "text-red-500 hover:text-red-600"
                                      : "text-red-600 hover:text-red-700"
                                  }
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteVideo(video._id);
                                  }}
                                >
                                  <X className="w-4 h-4 mr-1" />
                                  Delete
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={
                                    isDarkMode
                                      ? "text-purple-400 hover:text-purple-600"
                                      : "text-purple-600 hover:text-purple-800"
                                  }
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateThumbnail(video._id);
                                  }}
                                >
                                  <Edit3 className="w-4 h-4 mr-1" />
                                  Update Thumbnail
                                </Button>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={
                                  likedVideoIds.has(video._id)
                                    ? isDarkMode
                                      ? "text-pink-400 hover:text-pink-600"
                                      : "text-pink-600 hover:text-pink-800"
                                    : isDarkMode
                                    ? "text-white/60 hover:text-pink-400"
                                    : "text-black/60 hover:text-pink-600"
                                }
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleLikeVideo(video._id);
                                }}
                              >
                                <Heart
                                  className={`w-4 h-4 mr-1 ${
                                    likedVideoIds.has(video._id)
                                      ? "fill-current"
                                      : ""
                                  }`}
                                  fill={
                                    likedVideoIds.has(video._id)
                                      ? "currentColor"
                                      : "none"
                                  }
                                  stroke="currentColor"
                                />
                                Like
                              </Button>
                            </div>
                          </GlassmorphicCard>
                        </div>
                      ))}
                    </div>
                  )}
                  <VideoPlayerModal
                    open={isVideoModalOpen}
                    onClose={handleVideoModalClose}
                    video={selectedVideo}
                    isDarkMode={isDarkMode}
                  />
                </TabsContent>

                <TabsContent value="tweets">
                  <div className="flex justify-between items-center mb-6">
                    <h3
                      className={`text-xl font-bold ${
                        isDarkMode ? "text-white" : "text-black"
                      }`}
                    >
                      My Tweets
                    </h3>
                    <Button
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      onClick={handleCreateTweetFromDashboard}
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Create Tweet
                    </Button>
                  </div>
                  {dashboardData.loading ? (
                    <div>Loading...</div>
                  ) : (
                    <div className="space-y-4">
                      {dashboardData.tweets.map((tweet: any) => (
                        <GlassmorphicCard key={tweet._id} className="p-6">
                          <p
                            className={`mb-2 ${
                              isDarkMode ? "text-white/80" : "text-black/80"
                            }`}
                          >
                            {tweet.content}
                          </p>
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className={
                                likedTweetIds.has(tweet._id)
                                  ? isDarkMode
                                    ? "text-pink-400 hover:text-pink-600"
                                    : "text-pink-600 hover:text-pink-800"
                                  : isDarkMode
                                  ? "text-white/60 hover:text-pink-400"
                                  : "text-black/60 hover:text-pink-600"
                              }
                              onClick={() => handleLikeTweet(tweet._id)}
                            >
                              <Heart
                                className={`w-4 h-4 mr-1 ${
                                  likedTweetIds.has(tweet._id)
                                    ? "fill-current"
                                    : ""
                                }`}
                                fill={
                                  likedTweetIds.has(tweet._id)
                                    ? "currentColor"
                                    : "none"
                                }
                                stroke="currentColor"
                              />
                              Like
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={
                                isDarkMode
                                  ? "text-red-500 hover:text-red-600"
                                  : "text-red-600 hover:text-red-700"
                              }
                              onClick={() => handleDeleteTweet(tweet._id)}
                            >
                              <X className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={
                                isDarkMode
                                  ? "text-purple-400 hover:text-purple-600"
                                  : "text-purple-600 hover:text-purple-800"
                              }
                              onClick={() =>
                                handleUpdateTweet(tweet._id, tweet.content)
                              }
                            >
                              <Edit3 className="w-4 h-4 mr-1" />
                              Update
                            </Button>
                          </div>
                        </GlassmorphicCard>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="liked">
                  {dashboardData.loading ? (
                    <div>Loading...</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {dashboardData.likedVideos.map((video: any) => (
                        <GlassmorphicCard key={video._id} className="p-4">
                          {/* Render liked video info */}
                          <h4
                            className={`font-semibold mb-2 ${
                              isDarkMode ? "text-white" : "text-black"
                            }`}
                          >
                            {video.title}
                          </h4>
                          {/* ...other liked video details... */}
                        </GlassmorphicCard>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </TabsContent>

            <TabsContent value="profile" className="space-y-8">
              {/* Profile Header */}
              <GlassmorphicCard className="relative overflow-hidden">
                {/* Cover Image as background */}
                <div className="absolute inset-0 h-48 w-full overflow-hidden z-0">
                  {user.coverImage ? (
                    <img
                      src={user.coverImage}
                      alt="Cover"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="h-48 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600"></div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    ref={coverInputRef}
                    style={{ display: "none" }}
                    onChange={handleCoverChange}
                  />
                  <button
                    type="button"
                    className="absolute right-4 bottom-4 bg-black/60 text-white px-3 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => coverInputRef.current?.click()}
                  >
                    Change Cover
                  </button>
                  {/* Overlay for better text visibility */}
                  <div className="absolute inset-0 bg-black/30"></div>
                </div>
                <div className="relative z-10 p-6 pt-32">
                  <div className="flex items-end space-x-6">
                    {/* Avatar */}
                    <Avatar
                      className="w-24 h-24 border-4 border-white cursor-pointer relative group"
                      onClick={() => avatarInputRef.current?.click()}
                    >
                      <AvatarImage src={user.avatar} alt={user.fullName} />
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl">
                        SG
                      </AvatarFallback>
                      <input
                        type="file"
                        accept="image/*"
                        ref={avatarInputRef}
                        style={{ display: "none" }}
                        onChange={handleAvatarChange}
                      />
                      <span className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        Change
                      </span>
                    </Avatar>
                    <div className="pb-2">
                      <h1
                        className={`text-3xl font-bold ${
                          isDarkMode ? "text-white" : "text-black"
                        }`}
                      >
                        {user.fullName}
                      </h1>
                      <p
                        className={`${
                          isDarkMode ? "text-white/60" : "text-black/60"
                        }`}
                      >
                        {user.username}
                      </p>
                      <div className="flex space-x-6 mt-2">
                        <span
                          className={`text-sm ${
                            isDarkMode ? "text-white/80" : "text-black/80"
                          }`}
                        >
                          <strong>{followStats.following}</strong> Following
                        </span>
                        <span
                          className={`text-sm ${
                            isDarkMode ? "text-white/80" : "text-black/80"
                          }`}
                        >
                          <strong>{followStats.followers}</strong> Followers
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassmorphicCard>

              {/* Profile Edit Section */}
              <GlassmorphicCard className="p-6">
                <h2
                  className={`text-2xl font-bold mb-6 ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  Edit Profile
                </h2>
                <div className="space-y-6">
                  <form onSubmit={handleUpdateAccount}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label
                          className={isDarkMode ? "text-white" : "text-black"}
                        >
                          Full Name
                        </Label>
                        <Input
                          defaultValue={user.fullName}
                          ref={fullNameRef}
                          className={
                            isDarkMode
                              ? "bg-white/10 border-white/20 text-white"
                              : "bg-black/5 border-black/20 text-black"
                          }
                        />
                      </div>
                      <div>
                        <Label
                          className={isDarkMode ? "text-white" : "text-black"}
                        >
                          Email
                        </Label>
                        <Input
                          defaultValue={user.email}
                          type="email"
                          ref={emailRef}
                          className={
                            isDarkMode
                              ? "bg-white/10 border-white/20 text-white"
                              : "bg-black/5 border-black/20 text-black"
                          }
                        />
                      </div>
                      <div className="flex justify-end space-x-4 col-span-full">
                        <Button
                          type="submit"
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        >
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </form>

                  <div>
                    <h3
                      className={`text-lg font-semibold mb-4 ${
                        isDarkMode ? "text-white" : "text-black"
                      }`}
                    >
                      Change Password
                    </h3>
                    <form onSubmit={handleChangePassword}>
                      <div className="space-y-4">
                        <div>
                          <Label
                            className={`${
                              isDarkMode ? "text-white" : "text-black"
                            }`}
                          >
                            Current Password
                          </Label>
                          <Input
                            id="currentPassword"
                            type="password"
                            placeholder="Enter current password"
                            className={`${
                              isDarkMode
                                ? "bg-white/10 border-white/20 text-white placeholder:text-white/60"
                                : "bg-black/5 border-black/20 text-black placeholder:text-black/60"
                            }`}
                          />
                        </div>
                        <div>
                          <Label
                            className={`${
                              isDarkMode ? "text-white" : "text-black"
                            }`}
                          >
                            New Password
                          </Label>
                          <Input
                            id="newPassword"
                            type="password"
                            placeholder="Enter new password"
                            className={`${
                              isDarkMode
                                ? "bg-white/10 border-white/20 text-white placeholder:text-white/60"
                                : "bg-black/5 border-black/20 text-black placeholder:text-black/60"
                            }`}
                          />
                        </div>
                        <div>
                          <Label
                            className={`${
                              isDarkMode ? "text-white" : "text-black"
                            }`}
                          >
                            Confirm New Password
                          </Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm new password"
                            className={`${
                              isDarkMode
                                ? "bg-white/10 border-white/20 text-white placeholder:text-white/60"
                                : "bg-black/5 border-black/20 text-black placeholder:text-black/60"
                            }`}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-4 mt-4">
                        <Button
                          type="submit"
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        >
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              </GlassmorphicCard>
            </TabsContent>

            <TabsContent value="settings" className="space-y-8">
              <h2
                className={`text-2xl font-bold mb-6 ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                Settings
              </h2>

              {/* General Settings */}
              <GlassmorphicCard className="p-6">
                <h3
                  className={`text-lg font-semibold mb-4 ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  <Settings className="w-5 h-5 inline mr-2" />
                  General
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label
                        className={`${
                          isDarkMode ? "text-white" : "text-black"
                        }`}
                      >
                        Dark Mode
                      </Label>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-white/60" : "text-black/60"
                        }`}
                      >
                        Switch between light and dark themes
                      </p>
                    </div>
                    <Switch
                      checked={isDarkMode}
                      onCheckedChange={toggleTheme}
                    />
                  </div>
                </div>
              </GlassmorphicCard>

              {/* Account Actions */}
              <GlassmorphicCard className="p-6">
                <h3
                  className={`text-lg font-semibold mb-4 ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  Account Actions
                </h3>
                <div className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-[10%] justify-start text-red-500 hover:text-red-600"
                  >
                    Delete Account
                  </Button>
                </div>
              </GlassmorphicCard>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;
