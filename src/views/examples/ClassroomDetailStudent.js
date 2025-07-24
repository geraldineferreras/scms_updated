import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Badge, Button, Input, Modal, ModalHeader, ModalBody, Tooltip } from "reactstrap";
import Cropper from 'react-easy-crop';
import getCroppedImg from './utils/cropImage';
import { useAuth } from '../../contexts/AuthContext';

const mockClasses = [
  {
    name: "Object Oriented Programming",
    section: "BSIT 3A",
    subject: "Object Oriented Programming",
    code: "B7P3R9",
    semester: "1ST SEMESTER",
    schoolYear: "2024-2025",
    banner: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Data Structures and Algorithms",
    section: "BSIT 2B",
    subject: "Data Structures and Algorithms",
    code: "A1C2D3",
    semester: "1ST SEMESTER",
    schoolYear: "2024-2025",
    banner: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Database Management Systems",
    section: "BSIT 3C",
    subject: "Database Management Systems",
    code: "X9Y8Z7",
    semester: "1ST SEMESTER",
    schoolYear: "2024-2025",
    banner: "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "SAD SUBJECT",
    section: "BSIT 3C",
    subject: "SAD SUBJECT",
    code: "M7AGZY",
    semester: "1ST SEMESTER",
    schoolYear: "2024-2025",
    banner: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "SAD 312",
    section: "BSIT 3C",
    subject: "SAD 312",
    code: "5XHJE9",
    semester: "1ST SEMESTER",
    schoolYear: "2024-2025",
    banner: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=800&q=80"
  }
];

const mockPosts = [
  {
    id: 1,
    author: {
      name: "Prof. Smith",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    date: "2024-01-15",
    title: "Welcome to the new semester!",
    content: "I'm excited to start this journey with all of you. Let's make this semester productive and engaging.",
    comments: []
  },
  {
    id: 2,
    author: {
      name: "Prof. Smith",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    date: "2024-01-14",
    title: "Classroom rules",
    content: "Please be respectful and participate actively in class discussions.",
    comments: []
  }
];

const mockAssignments = [
  {
    id: 7,
    title: "Activity 7",
    due: "Nov 29, 2024, 5:00 PM",
    posted: "Nov 11, 2024",
    status: "Graded",
    description: "Draw and explain four levels of text encryption model; each level has different conditions or processes.",
    instructions: "View instructions",
    expanded: true
  },
  {
    id: 5,
    title: "Activity 5",
    due: "Nov 29, 2024, 5:00 PM",
    posted: "",
    status: "",
    description: "",
    instructions: "",
    expanded: false
  },
  {
    id: 6,
    title: "Activity 6",
    due: "Nov 16, 2024",
    posted: "",
    status: "",
    description: "",
    instructions: "",
    expanded: false
  },
  {
    id: 8,
    title: "Final Project",
    due: "Dec 13, 2024, 5:00 PM",
    posted: "",
    status: "",
    description: "",
    instructions: "",
    expanded: false
  },
  {
    id: 4,
    title: "Activity 4",
    due: "Oct 30, 2024, 5:00 PM",
    posted: "",
    status: "",
    description: "",
    instructions: "",
    expanded: false
  },
  {
    id: 2,
    title: "Activity 2",
    due: "Sep 30, 2024, 5:00 PM",
    posted: "",
    status: "",
    description: "",
    instructions: "",
    expanded: false
  },
  {
    id: 3,
    title: "Activity 3",
    due: "Sep 24, 2024, 5:00 PM",
    posted: "",
    status: "",
    description: "",
    instructions: "",
    expanded: false
  },
  {
    id: 1,
    title: "Activity 1",
    due: "Sep 17, 2024, 5:00 PM",
    posted: "",
    status: "",
    description: "",
    instructions: "",
    expanded: false
  }
];

// Mock data for People tab
const teachers = [
  { name: "Christian S. Mallari", avatar: "https://randomuser.me/api/portraits/men/75.jpg" }
];

const classmates = [
  { name: "Dabu, Justine Roman T.", avatar: "https://randomuser.me/api/portraits/men/76.jpg" },
  { name: "Dela Rosa, Lorenz Andre G.", avatar: null },
  { name: "Jerico Madla", avatar: null }
  // ...add more classmates as needed
];

const tabList = [
  { key: "stream", label: "Stream", icon: "ni ni-chat-round" },
  { key: "classwork", label: "Classwork", icon: "ni ni-briefcase-24" },
  { key: "people", label: "People", icon: "ni ni-single-02" },
  { key: "grades", label: "Grades", icon: "ni ni-chart-bar-32" }
];

const gradeFilters = ["All", "Assigned", "Returned", "Missing"];

// Add mock announcements for student stream tab (similar to teacher)
const mockAnnouncements = [
  {
    id: 1,
    title: "Welcome to the new semester!",
    content: "I'm excited to start this journey with all of you. Let's make this semester productive and engaging.",
    author: "Prof. Smith",
    date: "2024-01-15T09:00:00.000Z",
    isPinned: true,
    reactions: { like: 2, likedBy: ["Prof. Smith", "John Doe"] },
    comments: [
      { text: "Looking forward to this semester!", author: "Prof. Smith", date: "2024-01-15T10:30:00.000Z" },
      { text: "Thank you for the warm welcome!", author: "John Doe", date: "2024-01-15T11:15:00.000Z" }
    ]
  },
  {
    id: 2,
    title: "Assignment #1 Due Date Extended",
    content: "Due to technical difficulties, the deadline for Assignment #1 has been extended to Friday, January 20th.",
    author: "Prof. Smith",
    date: "2024-01-14T14:00:00.000Z",
    isPinned: false,
    reactions: { like: 0, likedBy: [] },
    comments: [
      { text: "Great news! I was having trouble with the submission system.", author: "Jane Smith", date: "2024-01-14T14:20:00.000Z" }
    ]
  }
];

// Helper to format relative time
function formatRelativeTime(dateString) {
  if (!dateString) return '';
  const now = new Date();
  const date = new Date(dateString);
  const diff = (now - date) / 1000;
  if (isNaN(diff)) return '';
  if (diff < 60) return 'Just now';
  if (diff < 3600) {
    const mins = Math.floor(diff / 60);
    return `${mins} min${mins > 1 ? 's' : ''} ago`;
  }
  if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  if (diff < 604800) {
    const days = Math.floor(diff / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

const themes = [
  { name: "Blue Gradient", value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", type: "Color Theme" },
  { name: "Purple Gradient", value: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", type: "Color Theme" },
  { name: "Green Gradient", value: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", type: "Color Theme" },
  { name: "Orange Gradient", value: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", type: "Color Theme" },
  { name: "Pink Gradient", value: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)", type: "Color Theme" },
  { name: "Aqua Gradient", value: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", type: "Color Theme" },
  { name: "Sunset", value: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)", type: "Color Theme" },
  { name: "Deep Blue", value: "linear-gradient(135deg, #232526 0%, #414345 100%)", type: "Color Theme" },
  { name: "Classroom SVG", value: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDQwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3QgeD0iMzAiIHk9IjMwIiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjUwIiByeD0iOCIgZmlsbD0iIzQ0NGI1YSIvPjxyZWN0IHg9IjUwIiB5PSI4MCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjEyIiByeD0iMyIgZmlsbD0iI2U5NzZkMiIvPjxyZWN0IHg9IjE3MCIgeT0iNjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSIyMCIgcng9IjQiIGZpbGw9IiMzOWY5ZjEiLz48cmVjdCB4PSIyMzAiIHk9IjgwIiB3aWR0aD0iNTAiIGhlaWdodD0iMTAiIHJ4PSIyIiBmaWxsPSIjMTk3NmQyIi8+PHJlY3QgeD0iMjQwIiB5PSI2MCIgd2lkdGg9IjMwIiBoZWlnaHQ9IjE1IiByeD0iMiIgZmlsbD0iI2Y5ZGM1YyIvPjxyZWN0IHg9IjMyMCIgeT0iNDAiIHdpZHRoPSI1MCIgaGVpZ2h0PSIzNSIgcng9IjUiIGZpbGw9IiM0NDRiNWEiLz48cmVjdCB4PSIzMzAiIHk9IjcwIiB3aWR0aD0iMzAiIGhlaWdodD0iNyIgcng9IjIiIGZpbGw9IiMxOTc2ZDIiLz48cmVjdCB4PSIzNDAiIHk9IjUwIiB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHJ4PSIyIiBmaWxsPSIjZjlkYzVjIi8+PC9zdmc+')", type: "SVG Theme" },
  { name: "Books SVG", value: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDQwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3QgeD0iNjAiIHk9IjYwIiB3aWR0aD0iMzAiIGhlaWdodD0iNDAiIHJ4PSI2IiBmaWxsPSIjNGNhZjUwIi8+PHJlY3QgeD0iMTAwIiB5PSI3MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjMwIiByeD0iNCIgZmlsbD0iI2Y5ZGM1YyIvPjxyZWN0IHg9IjE0MCIgeT0iODAiIHdpZHRoPSI0MCIgaGVpZ2h0PSIyMCIgcng9IjQiIGZpbGw9IiMxOTc2ZDIiLz48L3N2Zz4=')", type: "SVG Theme" },
  { name: "Night Sky", value: "url('https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80')", type: "Photo" },
  { name: "Books Image", value: "url('https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80')", type: "Photo" },
  { name: "Mountains", value: "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80')", type: "Photo" },
  { name: "Classroom", value: "url('https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&q=80')", type: "Photo" },
  { name: "Abstract", value: "url('https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=600&q=80')", type: "Photo" },
  { name: "Notebook", value: "url('https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80')", type: "Photo" }
];

const ClassroomDetailStudent = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("stream");
  const [activeStreamTab, setActiveStreamTab] = useState(null); // 'scheduled' | 'drafts' | null
  const [announcement, setAnnouncement] = useState("");
  const [expandedId, setExpandedId] = useState(7);
  const [gradeFilter, setGradeFilter] = useState("All");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [expandedGradeId, setExpandedGradeId] = useState(7);
  const currentClass = mockClasses.find(cls => cls.code === code) || mockClasses[0];
  const [studentAnnouncement, setStudentAnnouncement] = useState("");
  const [studentAnnouncements, setStudentAnnouncements] = useState([]);
  const [formExpanded, setFormExpanded] = useState(false);
  const [allowComments, setAllowComments] = useState(true);
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [likedAnnouncements, setLikedAnnouncements] = useState({}); // { [id]: true/false }
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef();
  const [editingAnnouncementId, setEditingAnnouncementId] = useState(null);
  const [editAnnouncementTitle, setEditAnnouncementTitle] = useState("");
  const [editAnnouncementContent, setEditAnnouncementContent] = useState("");
  const [attachmentDropdownOpenId, setAttachmentDropdownOpenId] = useState(null); // id of announcement or 'new' for new post
  const attachmentMenuRef = useRef();
  const [showYouTubeModal, setShowYouTubeModal] = useState(false);
  const [showDriveModal, setShowDriveModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [modalUrl, setModalUrl] = useState("");
  const [attachments, setAttachments] = useState([]); // for new post
  const [editAttachments, setEditAttachments] = useState({}); // { [id]: [attachments] }
  const fileInputRef = useRef();
  const [openCommentMenu, setOpenCommentMenu] = useState({}); // { [announcementId]: commentIdx }
  const commentMenuRef = useRef();
  const [editingComment, setEditingComment] = useState({}); // { announcementId, idx }
  const [editCommentValue, setEditCommentValue] = useState("");
  const [collapsedComments, setCollapsedComments] = useState({}); // { [announcementId]: boolean }
  // Add emoji picker state and emoji list
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef();
  const emojiList = [
    "😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", "😋", "😎", "😍", "😘", "🥰", "😗", "😙", "😚", "🙂", "🤗", "🤩", "🤔", "🤨", "😐", "😑", "😶", "🙄", "😏", "😣", "😥", "😮", "🤐", "😯", "😪", "😫", "🥱", "😴", "😌", "😛", "😜", "😝", "🤤", "😒", "😓", "😔", "😕", "🙃", "🤑", "😲", "☹️", "🙁", "😖", "😞", "😟", "😤", "😢", "😭", "😦", "😧", "😨", "😩", "🤯", "😬", "😰", "😱", "🥵", "🥶", "😳", "🤪", "😵", "😡", "😠", "🤬", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "😇", "🥳", "🥺", "🤠", "🥸", "😈", "👿", "👹", "👺", "💀", "👻", "👽", "🤖", "💩", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾",
    // Heart emojis
    "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟"
  ];

  const [selectedTheme, setSelectedTheme] = useState(() => {
    const key = `classroom_theme_${code}`;
    return localStorage.getItem(key) || themes[0].value;
  });
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [customTheme, setCustomTheme] = useState(() => {
    const key = `classroom_custom_theme_${code}`;
    return localStorage.getItem(key) || null;
  });
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImage, setCropImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [minZoom, setMinZoom] = useState(1);
  const [copied, setCopied] = useState(false);
  const [tooltipHover, setTooltipHover] = useState(false);
  // Add preview modal state and handler at the top of the component
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewAttachment, setPreviewAttachment] = useState(null);
  const [previewText, setPreviewText] = useState("");
  // MP3 preview design state and logic
  const mp3Backgrounds = [
    'linear-gradient(135deg, #232526 0%, #414345 100%)',
    'linear-gradient(135deg, #141e30 0%, #243b55 100%)',
    'linear-gradient(135deg, #283e51 0%, #485563 100%)',
    'linear-gradient(135deg, #434343 0%, #262626 100%)',
    'linear-gradient(135deg, #373b44 0%, #4286f4 100%)',
    'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)',
    'linear-gradient(135deg, #0f2027 0%, #2c5364 100%)',
  ];
  const [mp3BgIndex, setMp3BgIndex] = useState(0);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const visualizerIntervalRef = useRef(null);
  useEffect(() => {
    const interval = setInterval(() => {
      setMp3BgIndex(idx => (idx + 1) % mp3Backgrounds.length);
    }, 30000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    if (previewAttachment && previewAttachment.file && previewAttachment.file.type && previewAttachment.file.type.startsWith('audio/')) {
      const url = typeof previewAttachment.file === 'string' ? previewAttachment.file : URL.createObjectURL(previewAttachment.file);
      setAudioUrl(url);
      return () => { if (typeof previewAttachment.file !== 'string') URL.revokeObjectURL(url); };
    }
  }, [previewAttachment]);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handlePlay = () => {
      setIsPlaying(true);
      // Start visualizer
      const bars = document.querySelectorAll('.visualizer-bar');
      visualizerIntervalRef.current = setInterval(() => {
        bars.forEach((bar, index) => {
          const height = Math.random() * 50 + 10;
          bar.style.height = height + 'px';
          bar.style.animationDelay = (index * 0.1) + 's';
        });
      }, 100);
    };
    const handlePause = () => {
      setIsPlaying(false);
      // Stop visualizer
      if (visualizerIntervalRef.current) {
        clearInterval(visualizerIntervalRef.current);
        visualizerIntervalRef.current = null;
        const bars = document.querySelectorAll('.visualizer-bar');
        bars.forEach(bar => {
          bar.style.height = '10px';
        });
      }
    };
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handlePause);
    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handlePause);
      if (visualizerIntervalRef.current) {
        clearInterval(visualizerIntervalRef.current);
        visualizerIntervalRef.current = null;
      }
    };
  }, [audioUrl]);

  const auth = useAuth();
  const user = auth?.user;
  // Fallback for environments where useAuth is not available
  let loggedInName = user?.full_name || user?.name;
  if (!loggedInName) {
    try {
      const localUser = JSON.parse(localStorage.getItem('scms_logged_in_user'));
      loggedInName = localUser?.full_name || localUser?.name;
    } catch {}
  }
  if (!loggedInName) loggedInName = 'You';

  useEffect(() => {
    if (!cropImage) return;
    const img = new window.Image();
    img.onload = () => {
      const aspect = 3.5 / 1;
      const imgAspect = img.width / img.height;
      let minZoomValue = 1;
      if (imgAspect > aspect) {
        minZoomValue = aspect / imgAspect;
      } else {
        minZoomValue = imgAspect / aspect;
      }
      setMinZoom(Math.max(1, minZoomValue));
    };
    img.src = cropImage;
  }, [cropImage]);

  const handleSelectTheme = (themeValue) => {
    setSelectedTheme(themeValue);
    localStorage.setItem(`classroom_theme_${code}`, themeValue);
    setShowThemeModal(false);
  };

  const handleUploadPhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new window.Image();
        img.onload = () => {
          const maxDim = 2000;
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            const scale = Math.min(maxDim / width, maxDim / height);
            width = Math.round(width * scale);
            height = Math.round(height * scale);
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const safeDataUrl = canvas.toDataURL('image/png');
          setCropImage(safeDataUrl);
          setCropModalOpen(true);
        };
        img.onerror = () => {
          alert('Failed to load image for re-encoding.');
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropSave = async () => {
    if (!croppedAreaPixels) {
      alert('Crop area not set. Please move or resize the crop box.');
      return;
    }
    try {
      const croppedImg = await getCroppedImg(cropImage, croppedAreaPixels);
      setShowThemeModal(false);
      setCropModalOpen(false);
      setCropImage(null);
      handleSelectTheme(croppedImg);
    } catch (e) {
      alert('Failed to crop image');
    }
  };

  // Close emoji picker on outside click
  useEffect(() => {
    function handleClick(e) {
      if (showEmojiPicker && emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showEmojiPicker]);

  // Helper to insert emoji at cursor position
  function insertEmojiAtCursor(emoji) {
    const textarea = document.getElementById('student-announcement-textarea');
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const before = studentAnnouncement.substring(0, start);
      const after = studentAnnouncement.substring(end);
      setStudentAnnouncement(before + emoji + after);
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
      }, 0);
    } else {
      setStudentAnnouncement(studentAnnouncement + emoji);
    }
    setShowEmojiPicker(false);
  }

  // Close menu on outside click
  useEffect(() => {
    function handleClick(e) {
      if (openMenuId !== null && menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [openMenuId]);

  // Close attachment dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (attachmentDropdownOpenId && attachmentMenuRef.current && !attachmentMenuRef.current.contains(e.target)) {
        setAttachmentDropdownOpenId(null);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [attachmentDropdownOpenId]);

  // Close comment menu on outside click
  useEffect(() => {
    function handleClick(e) {
      if (Object.keys(openCommentMenu).length && commentMenuRef.current && !commentMenuRef.current.contains(e.target)) {
        setOpenCommentMenu({});
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [openCommentMenu]);

  function handleLike(announcement) {
    setLikedAnnouncements(prev => {
      const liked = !!prev[announcement.id];
      // Update the like count in the announcement (mockAnnouncements is static, so for demo, update local state)
      if (!liked) {
        announcement.reactions.like = (announcement.reactions.like || 0) + 1;
      } else {
        announcement.reactions.like = Math.max(0, (announcement.reactions.like || 0) - 1);
      }
      return { ...prev, [announcement.id]: !liked };
    });
  }

  function handleEditClick(announcement) {
    setEditingAnnouncementId(announcement.id);
    setEditAnnouncementTitle(announcement.title);
    setEditAnnouncementContent(announcement.content);
    setOpenMenuId(null);
  }

  function handleEditSave(announcement) {
    // Update in studentAnnouncements if it's a student post, else in mockAnnouncements
    if (studentAnnouncements.some(a => a.id === announcement.id)) {
      setStudentAnnouncements(prev => prev.map(a => a.id === announcement.id ? { ...a, title: editAnnouncementTitle, content: editAnnouncementContent } : a));
    } else {
      announcement.title = editAnnouncementTitle;
      announcement.content = editAnnouncementContent;
    }
    setEditingAnnouncementId(null);
  }

  function handleEditCancel() {
    setEditingAnnouncementId(null);
  }

  function handleUnpin(announcement) {
    announcement.isPinned = false;
    setOpenMenuId(null);
    // Force re-render for mockAnnouncements (if needed)
    setStudentAnnouncements(prev => [...prev]);
  }

  function handlePin(announcement) {
    announcement.isPinned = true;
    setOpenMenuId(null);
    setStudentAnnouncements(prev => [...prev]);
  }

  function handleAttachmentOption(option) {
    setAttachmentDropdownOpenId(null);
    if (option === 'youtube') {
      setShowYouTubeModal(true);
      setModalUrl("");
    } else if (option === 'drive') {
      setShowDriveModal(true);
      setModalUrl("");
    } else if (option === 'link') {
      setShowLinkModal(true);
      setModalUrl("");
    } else if (option === 'file') {
      if (fileInputRef.current) fileInputRef.current.click();
    }
  }
  function handleAddModalAttachment(type, forEditId) {
    const att = { type, url: modalUrl };
    if (forEditId) {
      setEditAttachments(prev => ({ ...prev, [forEditId]: [...(prev[forEditId] || []), att] }));
    } else {
      setAttachments(prev => [...prev, att]);
    }
    setShowYouTubeModal(false);
    setShowDriveModal(false);
    setShowLinkModal(false);
    setModalUrl("");
  }
  function handleFileChange(e, forEditId) {
    const file = e.target.files[0];
    if (!file) return;
    const att = { type: 'file', file, name: file.name };
    if (forEditId) {
      setEditAttachments(prev => ({ ...prev, [forEditId]: [...(prev[forEditId] || []), att] }));
    } else {
      setAttachments(prev => [...prev, att]);
    }
    e.target.value = "";
  }

  function handleCommentMenu(announcementId, idx) {
    setOpenCommentMenu(openCommentMenu.announcementId === announcementId && openCommentMenu.idx === idx ? {} : { announcementId, idx });
  }
  function handleCommentEdit(announcementId, idx) {
    setOpenCommentMenu({});
    setEditingComment({ announcementId, idx });
    const ann = [...studentAnnouncements, ...mockAnnouncements].find(a => a.id === announcementId);
    setEditCommentValue(ann.comments[idx].text);
  }
  function handleCommentEditSave(announcementId, idx) {
    // Update in studentAnnouncements if it's a student post, else in mockAnnouncements
    if (studentAnnouncements.some(a => a.id === announcementId)) {
      setStudentAnnouncements(prev => prev.map(a => a.id === announcementId ? { ...a, comments: a.comments.map((c, i) => i === idx ? { ...c, text: editCommentValue } : c) } : a));
    } else {
      const ann = mockAnnouncements.find(a => a.id === announcementId);
      if (ann) ann.comments[idx].text = editCommentValue;
    }
    setEditingComment({});
    setEditCommentValue("");
  }
  function handleCommentEditCancel() {
    setEditingComment({});
    setEditCommentValue("");
  }
  function handleCommentDelete(announcementId, idx) {
    setOpenCommentMenu({});
    if (studentAnnouncements.some(a => a.id === announcementId)) {
      setStudentAnnouncements(prev => prev.map(a => a.id === announcementId ? { ...a, comments: a.comments.filter((_, i) => i !== idx) } : a));
    } else {
      const ann = mockAnnouncements.find(a => a.id === announcementId);
      if (ann) ann.comments.splice(idx, 1);
    }
  }

  // Helper to post a new announcement as student
  const handleStudentPostAnnouncement = (e) => {
    e.preventDefault();
    if (!studentAnnouncement.trim()) return;
    const newAnn = {
      id: Date.now(),
      title: announcementTitle,
      content: studentAnnouncement,
      author: loggedInName,
      date: new Date().toISOString(),
      isPinned: false,
      reactions: { like: 0, likedBy: [] },
      comments: [],
      allowComments: allowComments,
      attachments: attachments
    };
    setStudentAnnouncements([newAnn, ...studentAnnouncements]);
    setStudentAnnouncement("");
    setAnnouncementTitle("");
    setAllowComments(true);
    setFormExpanded(false);
    setAttachments([]);
    setEditingDraftId(null);
  };

  // Add state for comment input and emoji picker per announcement
  const [commentInputs, setCommentInputs] = useState({}); // { [announcementId]: value }
  const [showCommentEmojiPicker, setShowCommentEmojiPicker] = useState({}); // { [announcementId]: bool }
  const commentEmojiPickerRefs = useRef({});

  // Close comment emoji picker on outside click
  useEffect(() => {
    function handleClick(e) {
      Object.keys(showCommentEmojiPicker).forEach(id => {
        if (showCommentEmojiPicker[id] && commentEmojiPickerRefs.current[id] && !commentEmojiPickerRefs.current[id].contains(e.target)) {
          setShowCommentEmojiPicker(prev => ({ ...prev, [id]: false }));
        }
      });
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showCommentEmojiPicker]);

  function handleCommentInputChange(announcementId, value) {
    setCommentInputs(inputs => ({ ...inputs, [announcementId]: value }));
  }
  function handleAddEmojiToComment(announcementId, emoji) {
    setCommentInputs(inputs => ({ ...inputs, [announcementId]: (inputs[announcementId] || "") + emoji }));
    setShowCommentEmojiPicker(prev => ({ ...prev, [announcementId]: false }));
  }
  function handlePostComment(announcementId) {
    const value = (commentInputs[announcementId] || "").trim();
    if (!value) return;
    if (studentAnnouncements.some(a => a.id === announcementId)) {
      setStudentAnnouncements(prev => prev.map(a => a.id === announcementId ? { ...a, comments: [...a.comments, { text: value, author: loggedInName, date: new Date().toISOString() }] } : a));
    } else {
      const ann = mockAnnouncements.find(a => a.id === announcementId);
      if (ann) ann.comments.push({ text: value, author: loggedInName, date: new Date().toISOString() });
    }
    setCommentInputs(inputs => ({ ...inputs, [announcementId]: "" }));
  }

  // Before rendering the announcements list:
  const sortedAnnouncements = [...studentAnnouncements, ...mockAnnouncements].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    // If both are pinned or both are not pinned, sort by date descending
    return new Date(b.date) - new Date(a.date);
  });

  // Add state for student selection modal and selected students for the post
  const [showStudentSelectModal, setShowStudentSelectModal] = useState(false);
  const [studentSearch, setStudentSearch] = useState("");
  const [tempSelectedStudents, setTempSelectedStudents] = useState([]); // array of student names or ids
  const [selectedAnnouncementStudents, setSelectedAnnouncementStudents] = useState([]); // for the post
  const getAvatarForUser = (user) => user.avatar || "https://randomuser.me/api/portraits/men/75.jpg";

  // Add state for 3-dots dropdown
  const [showPostOptionsDropdown, setShowPostOptionsDropdown] = useState(false);
  const postOptionsDropdownRef = useRef();

  // Close 3-dots dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (showPostOptionsDropdown && postOptionsDropdownRef.current && !postOptionsDropdownRef.current.contains(e.target)) {
        setShowPostOptionsDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showPostOptionsDropdown]);

  // Add state for scheduled modal and scheduled announcements
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [scheduledAnnouncements, setScheduledAnnouncements] = useState([]);

  // After scheduledAnnouncements state:
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setScheduledAnnouncements(prev => {
        const due = prev.filter(a => new Date(a.date) <= now);
        if (due.length > 0) {
          setStudentAnnouncements(current => [...due, ...current]);
        }
        return prev.filter(a => new Date(a.date) > now);
      });
    }, 30000); // check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Add state for drafts
  const [draftAnnouncements, setDraftAnnouncements] = useState([]);
  // Add state to track if editing a draft
  const [editingDraftId, setEditingDraftId] = useState(null);

  const handleCopyCode = () => {
    if (currentClass) {
      navigator.clipboard.writeText(currentClass.code);
      setCopied(true);
      setTooltipHover(true);
      setTimeout(() => {
        setCopied(false);
        setTooltipHover(false);
      }, 1200);
    }
  };

  const handlePreviewAttachment = async (att) => {
    setPreviewAttachment(att);
    setPreviewText("");
    setPreviewModalOpen(true);
    const ext = att.name ? att.name.split('.').pop().toLowerCase() : '';
    if ((ext === 'txt' || ext === 'csv') && att.file) {
      const text = await att.file.text();
      setPreviewText(text);
    }
  };

  // Helper to get file type icon for attachments
  function getFileTypeIcon(att) {
    if (!att) return null;
    const fileName = att.name || '';
    const ext = fileName.split('.').pop().toLowerCase();
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
    const wordExts = ['doc', 'docx', 'dot', 'dotx', 'docm', 'dotm'];
    const excelExts = ['xls', 'xlsx', 'xlsm', 'xlsb', 'xlt', 'xltx', 'xltm', 'csv'];
    const pptExts = ['ppt', 'pptx', 'pps', 'ppsx', 'pptm', 'potx', 'potm', 'ppsm'];
    if (att.type === 'link') {
      return <i className="fa fa-globe" style={{ fontSize: 32, color: '#888', marginRight: 14 }} />;
    }
    if (att.type === 'youtube') {
      return <i className="fa fa-youtube-play" style={{ fontSize: 32, color: '#f00', marginRight: 14 }} />;
    }
    if (att.type === 'drive') {
      return <i className="fa fa-cloud-upload" style={{ fontSize: 32, color: '#1976d2', marginRight: 14 }} />;
    }
    if (att.type === 'file' && att.file && att.file.type && att.file.type.startsWith('image')) {
      return <img src={typeof att.file === 'string' ? att.file : URL.createObjectURL(att.file)} alt={att.name} style={{ width: 38, height: 38, borderRadius: 6, objectFit: 'cover', marginRight: 14 }} />;
    }
    if (att.type === 'file' && att.file && att.file.type && att.file.type.startsWith('audio')) {
      return <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 14 }}><rect width="32" height="40" rx="6" fill="#fff" stroke="#43a047" strokeWidth="2"/><circle cx="16" cy="20" r="7" fill="#43a047"/><rect x="22" y="13" width="3" height="14" rx="1.5" fill="#43a047"/><text x="16" y="36" textAnchor="middle" fontSize="10" fill="#43a047" fontWeight="bold">MP3</text></svg>;
    }
    if (att.type === 'file' && att.file && att.file.type && att.file.type.startsWith('video')) {
      return <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 14 }}><rect width="32" height="40" rx="6" fill="#fff" stroke="#8e24aa" strokeWidth="2"/><polygon points="13,14 25,20 13,26" fill="#8e24aa"/><text x="16" y="36" textAnchor="middle" fontSize="10" fill="#8e24aa" fontWeight="bold">MP4</text></svg>;
    }
    if (att.type === 'file' && ext === 'pdf') {
      return <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 14 }}><rect width="32" height="40" rx="6" fill="#fff" stroke="#F44336" strokeWidth="2"/><path d="M8 8h16v24H8z" fill="#fff"/><text x="16" y="28" textAnchor="middle" fontSize="10" fill="#F44336" fontWeight="bold">PDF</text></svg>;
    }
    if (att.type === 'file' && wordExts.includes(ext)) {
      return <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 14 }}><rect width="32" height="40" rx="6" fill="#fff" stroke="#1976D2" strokeWidth="2"/><path d="M8 8h16v24H8z" fill="#fff"/><text x="16" y="28" textAnchor="middle" fontSize="10" fill="#1976D2" fontWeight="bold">WORD</text></svg>;
    }
    if (att.type === 'file' && excelExts.includes(ext)) {
      return <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 14 }}><rect width="32" height="40" rx="6" fill="#fff" stroke="#388E3C" strokeWidth="2"/><path d="M8 8h16v24H8z" fill="#fff"/><text x="16" y="28" textAnchor="middle" fontSize="10" fill="#388E3C" fontWeight="bold">EXCEL</text></svg>;
    }
    if (att.type === 'file' && pptExts.includes(ext)) {
      return <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 14 }}><rect width="32" height="40" rx="6" fill="#fff" stroke="#FF9800" strokeWidth="2"/><path d="M8 8h16v24H8z" fill="#fff"/><text x="16" y="28" textAnchor="middle" fontSize="10" fill="#FF9800" fontWeight="bold">PPT</text></svg>;
    }
    if (att.type === 'file' && ext === 'txt') {
      return <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 14 }}><rect width="32" height="40" rx="6" fill="#fff" stroke="#607d8b" strokeWidth="2"/><path d="M8 8h16v24H8z" fill="#fff"/><text x="16" y="28" textAnchor="middle" fontSize="10" fill="#607d8b" fontWeight="bold">TXT</text></svg>;
    }
    if (att.type === 'file') {
      return <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 14 }}><rect width="32" height="40" rx="6" fill="#bbb" /><path d="M8 8h16v24H8z" fill="#fff"/><text x="16" y="28" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="bold">FILE</text></svg>;
    }
    return null;
  }

  // Add at the top of the component
  const wavePathRef = useRef(null);
  // Animate the wave at the bottom
  useEffect(() => {
    let t = 0;
    let running = true;
    let frameId;
    function animateWave() {
      if (!running) return;
      t += 0.02;
      const amp = 10;
      const y1 = 40 + Math.sin(t) * amp;
      const y2 = 40 + Math.cos(t/2) * amp;
      if (wavePathRef.current) {
        wavePathRef.current.setAttribute('d', `M0,${y1} Q360,${80-amp} 720,${y2} T1440,${y1} V80 H0 Z`);
      }
      frameId = requestAnimationFrame(animateWave);
    }
    animateWave();
    return () => { running = false; if (frameId) cancelAnimationFrame(frameId); };
  }, [previewModalOpen]);

  return (
    <div style={{ background: "#f7fafd", minHeight: "100vh" }}>
      {/* Banner */}
      <div style={{
        borderRadius: 18,
        background: selectedTheme && selectedTheme.startsWith('data:image') ? `url('${selectedTheme}')` : selectedTheme,
        color: "#fff",
        minHeight: 170,
        boxShadow: "0 4px 24px rgba(44,62,80,0.13)",
        margin: '24px auto 32px',
        position: 'relative',
        overflow: 'hidden',
        padding: '32px 40px',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        maxWidth: 1100,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}>
        {selectedTheme && (selectedTheme.startsWith('url(') || selectedTheme.startsWith('data:image')) && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.38)',
            zIndex: 1
          }} />
        )}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{
            fontWeight: 800,
            letterSpacing: 1,
            color: '#fff',
            textShadow: '0 2px 8px rgba(0,0,0,0.7), 0 1px 0 #000'
          }}>
            {currentClass.name} <span style={{ fontWeight: 400, fontSize: 22, opacity: 0.92, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.7), 0 1px 0 #000' }}>({currentClass.section})</span>
          </h1>
          <div style={{ fontSize: 20, opacity: 0.95, fontWeight: 500 }}>{currentClass.subject}</div>
          <div className="mt-3 d-flex align-items-center flex-wrap">
            <span style={{ fontWeight: 600, fontSize: 18 }}>Class Code:</span>
            <span style={{
              background: '#fff',
              color: '#007bff',
              borderRadius: 10,
              padding: '4px 16px',
              fontWeight: 800,
              fontSize: 20,
              marginLeft: 14,
              letterSpacing: 2,
              boxShadow: '0 2px 8px rgba(44,62,80,0.10)'
            }}>
              {currentClass.code}
            </span>
            <Button 
              color="link" 
              size="sm" 
              id={`copyCodeBtn-${currentClass.code}`} 
              style={{ color: '#007bff', marginLeft: 4, fontSize: 18, padding: 0, cursor: 'pointer' }} 
              onClick={handleCopyCode} 
              aria-label="Copy class code"
            >
              <i className="ni ni-single-copy-04" />
            </Button>
            <Tooltip 
              placement="top" 
              isOpen={tooltipHover || copied} 
              target={`copyCodeBtn-${currentClass.code}`} 
              toggle={() => setTooltipHover(!tooltipHover)}
            >
              {copied ? "Copied!" : "Copy code"}
            </Tooltip>
          </div>
          <div className="mt-2">
            <Badge color="light" className="text-dark me-2">{currentClass.semester}</Badge>
            <Badge color="light" className="text-dark">{currentClass.schoolYear}</Badge>
          </div>
        </div>
        <div className="d-flex flex-column align-items-end" style={{ minWidth: 160, position: 'relative', zIndex: 2 }}>
          <Button 
            color="link" 
            style={{ color: '#fff', fontWeight: 400, fontSize: 13, padding: 0, marginBottom: 4, textDecoration: 'none' }} 
            onClick={() => setShowThemeModal(true)}
          >
            Select theme
          </Button>
          <Button 
            color="link" 
            style={{ color: '#fff', fontWeight: 400, fontSize: 13, padding: 0, textDecoration: 'none' }} 
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >
            Upload photo
          </Button>
          <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleUploadPhoto} />
        </div>
        <svg viewBox="0 0 1440 60" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 60 }} xmlns="http://www.w3.org/2000/svg">
          <path fill="#fff" fillOpacity="1" d="M0,32L48,37.3C96,43,192,53,288,49.3C384,45,480,27,576,21.3C672,16,768,32,864,37.3C960,43,1056,27,1152,21.3C1248,16,1344,32,1392,40.7L1440,48L1440,160L1392,160C1344,160,1248,160,1152,160C1056,160,960,160,864,160C768,160,672,160,576,160C480,160,384,160,288,160C192,160,96,160,48,160L0,160Z"></path>
        </svg>
      </div>
      {/* Theme Selection Modal */}
      <Modal isOpen={showThemeModal} toggle={() => setShowThemeModal(false)} centered size="lg">
        <ModalHeader toggle={() => setShowThemeModal(false)} style={{ border: 'none' }}>Select a Theme</ModalHeader>
        <ModalBody>
          {customTheme && (
            <div
              key="custom-photo"
              onClick={() => handleSelectTheme(customTheme)}
              style={{
                width: '100%',
                height: 120,
                borderRadius: 14,
                cursor: 'pointer',
                border: selectedTheme === customTheme ? '3px solid #007bff' : '2px solid #eee',
                backgroundImage: `url('${customTheme}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                boxShadow: selectedTheme === customTheme ? '0 2px 12px rgba(44,62,80,0.15)' : 'none',
                transition: 'border 0.2s, box-shadow 0.2s',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                overflow: 'hidden',
                marginBottom: 24
              }}
              title="Custom Photo"
            >
              <span style={{
                background: 'rgba(0,0,0,0.32)',
                borderRadius: 8,
                padding: '2px 10px',
                margin: 8,
                marginBottom: 10,
                color: '#fff',
                fontWeight: 600,
                fontSize: 14,
                position: 'absolute',
                left: 8,
                bottom: 8,
                maxWidth: '90%',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                boxShadow: '0 1px 4px rgba(0,0,0,0.10)'
              }}>Custom Photo</span>
            </div>
          )}
          {(() => {
            const groupedThemes = themes.reduce((acc, theme) => {
              if (!acc[theme.type]) {
                acc[theme.type] = [];
              }
              acc[theme.type].push(theme);
              return acc;
            }, {});

            return Object.entries(groupedThemes).map(([type, themeList]) => (
              <div key={type} style={{ marginBottom: 32 }}>
                <h6 style={{
                  color: '#8a98a8',
                  fontWeight: 700,
                  fontSize: 13,
                  marginBottom: 12,
                  marginTop: 18,
                  paddingBottom: 0,
                  textTransform: 'uppercase',
                  letterSpacing: 1.2,
                  background: 'none',
                  border: 'none',
                  boxShadow: 'none',
                  fontFamily: 'inherit',
                  lineHeight: 1.2
                }}>
                  {type}
                </h6>
                <div style={{ display: 'flex', flexDirection: 'row', gap: 12, overflowX: 'auto', paddingBottom: 4 }}>
                  {themeList.map((theme) => {
                    const isGradient = theme.value.startsWith('linear-gradient');
                    const isImage = theme.value.startsWith('url');
                    return (
                      <div
                        key={theme.name}
                        onClick={() => handleSelectTheme(theme.value)}
                        style={{
                          minWidth: 180,
                          maxWidth: 220,
                          height: 70,
                          borderRadius: 14,
                          cursor: 'pointer',
                          border: selectedTheme === theme.value ? '3px solid #007bff' : '2px solid #eee',
                          ...(isGradient ? { background: theme.value } : {}),
                          ...(isImage ? { backgroundImage: theme.value } : {}),
                          backgroundSize: '110%',
                          backgroundPosition: 'center',
                          position: 'relative',
                          boxShadow: selectedTheme === theme.value ? '0 2px 12px rgba(44,62,80,0.15)' : 'none',
                          transition: 'border 0.2s, box-shadow 0.2s',
                          display: 'flex',
                          alignItems: 'flex-end',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          marginBottom: 0
                        }}
                        title={theme.name}
                      >
                        <span style={{
                          background: 'rgba(0,0,0,0.32)',
                          borderRadius: 8,
                          padding: '2px 10px',
                          margin: 8,
                          marginBottom: 10,
                          color: '#fff',
                          fontWeight: 600,
                          fontSize: 14,
                          position: 'absolute',
                          left: 8,
                          bottom: 8,
                          maxWidth: '90%',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          boxShadow: '0 1px 4px rgba(0,0,0,0.10)'
                        }}>{theme.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ));
          })()}
        </ModalBody>
      </Modal>
      {/* Crop Modal */}
      <Modal isOpen={cropModalOpen} toggle={() => setCropModalOpen(false)} centered size="lg">
        <ModalHeader toggle={() => setCropModalOpen(false)} style={{ border: 'none' }}>Crop Photo</ModalHeader>
        <ModalBody>
          {cropImage && (
            <div style={{ position: 'relative', width: '100%', height: 320, background: '#222', borderRadius: 16, overflow: 'hidden' }}>
              <Cropper
                image={cropImage}
                crop={crop}
                zoom={zoom}
                aspect={3.5 / 1}
                minZoom={minZoom}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                cropShape="rect"
                showGrid={false}
              />
            </div>
          )}
          <div className="d-flex justify-content-end mt-3">
            <Button color="primary" onClick={handleCropSave}>Save</Button>
          </div>
        </ModalBody>
      </Modal>
      {/* Tabs */}
      <div style={{ maxWidth: 1100, margin: '0 auto', marginTop: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px 0 rgba(44,62,80,.06)', padding: '0 24px', height: 56 }}>
          {tabList.map(tab => (
            <div
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                fontWeight: 600,
                fontSize: 15,
                color: activeTab === tab.key ? '#2096ff' : '#888',
                background: activeTab === tab.key ? '#e6e8ff' : 'none',
                borderRadius: 12,
                padding: '8px 22px',
                marginRight: 12,
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              <i className={tab.icon} style={{ fontSize: 20, marginRight: 8, color: activeTab === tab.key ? '#2096ff' : '#bbb' }} />
              {tab.label}
            </div>
          ))}
        </div>
      </div>
      {/* Stream Section */}
      {activeTab === "stream" && (
        <div style={{ maxWidth: 1100, margin: '24px auto 0', fontSize: '15px' }}>
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px rgba(50,76,221,0.10)', border: '1.5px solid #e9ecef', padding: 32, marginBottom: 24 }}>
            <div style={{ fontWeight: 800, color: '#324cdd', letterSpacing: 1, marginBottom: 12, display: 'flex', alignItems: 'center' }}>
              <i className="ni ni-chat-round" style={{ fontSize: 22, marginRight: 8, color: '#2096ff' }} /> Stream
            </div>
            {/* Scheduled/Drafts toggles (clickable, outlined style) */}
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 16, gap: 12 }}>
              <button
                type="button"
                onClick={() => setActiveStreamTab(activeStreamTab === 'scheduled' ? null : 'scheduled')}
                style={{
                  borderRadius: 8,
                  fontWeight: 500,
                  padding: '6px 18px',
                  minHeight: 'auto',
                  lineHeight: 1.2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: activeStreamTab === 'scheduled' ? '#1976d2' : '#fff',
                  color: activeStreamTab === 'scheduled' ? '#fff' : '#222',
                  border: '1.5px solid #222',
                  boxShadow: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                <i className="fa fa-calendar" style={{ fontSize: 18, marginRight: 6, color: activeStreamTab === 'scheduled' ? '#fff' : '#222' }} /> Scheduled
              </button>
              <button
                type="button"
                onClick={() => setActiveStreamTab(activeStreamTab === 'drafts' ? null : 'drafts')}
                style={{
                  borderRadius: 8,
                  fontWeight: 500,
                  padding: '6px 18px',
                  minHeight: 'auto',
                  lineHeight: 1.2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: activeStreamTab === 'drafts' ? '#1976d2' : '#fff',
                  color: activeStreamTab === 'drafts' ? '#fff' : '#222',
                  border: '1.5px solid #222',
                  boxShadow: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                <i className="fa fa-file-alt" style={{ fontSize: 18, marginRight: 6, color: activeStreamTab === 'drafts' ? '#fff' : '#222' }} /> Drafts
              </button>
            </div>
            {/* Dropdown panel for Scheduled/Drafts */}
            {activeStreamTab === 'scheduled' && (
              <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #324cdd11', border: 'none', marginBottom: 24, marginTop: 0, padding: '2rem 2rem 1.5rem', maxWidth: '100%' }}>
                <div style={{ fontWeight: 700, color: '#2d3559', marginBottom: 8 }}>Scheduled Announcements</div>
                {scheduledAnnouncements.length === 0 ? (
                  <div style={{ color: '#888' }}>No scheduled announcements.</div>
                ) : (
                  scheduledAnnouncements.map((announcement) => (
                    <div key={announcement.id} style={{ background: '#f8fafd', borderRadius: 12, boxShadow: '0 2px 8px #324cdd11', marginBottom: 18, padding: '18px 24px' }}>
                      <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 6 }}>{announcement.title}</div>
                      <div style={{ color: '#444', fontSize: 15, marginBottom: 12 }}>{announcement.content}</div>
                      <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>Scheduled for: {new Date(announcement.date).toLocaleString()}</div>
                      {announcement.attachments && announcement.attachments.length > 0 && (
                        <div style={{ margin: '10px 0 16px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {announcement.attachments.map((att, idx) => {
                            const isMp3 = att.type === 'file' && att.file && (att.file.type === 'audio/mp3' || att.file.type === 'audio/mpeg' || (att.name && att.name.toLowerCase().endsWith('.mp3')));
                            const isPdf = att.type === 'file' && att.file && (att.file.type === 'application/pdf' || (att.name && att.name.toLowerCase().endsWith('.pdf')));
                            const fileType = isMp3 ? 'MP3' : isPdf ? 'PDF' : (att.file && att.file.type ? att.file.type.split('/')[1]?.toUpperCase() : att.type.charAt(0).toUpperCase() + att.type.slice(1));
                            const typeColor = isMp3 ? '#43a047' : isPdf ? '#F44336' : '#888';
                            const linkColor = isMp3 ? '#43a047' : isPdf ? '#F44336' : '#1976d2';
                            const isFile = att.type === 'file' && att.file;
                            return (
                              <div
                                key={idx}
                                style={{ display: 'flex', alignItems: 'center', background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px #e9ecef', padding: '10px 18px', minWidth: 220, maxWidth: 340, cursor: isFile ? 'pointer' : 'default' }}
                                onClick={isFile ? () => handlePreviewAttachment(att) : undefined}
                              >
                                {/* File icon */}
                                {isMp3 ? (
                                  <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 14 }}>
                                    <rect width="32" height="40" rx="6" fill="#fff" stroke="#43a047" strokeWidth="2"/>
                                    <circle cx="16" cy="20" r="7" fill="#43a047"/>
                                    <rect x="22" y="13" width="3" height="14" rx="1.5" fill="#43a047"/>
                                    <text x="16" y="36" textAnchor="middle" fontSize="10" fill="#43a047" fontWeight="bold">MP3</text>
                                  </svg>
                                ) : isPdf ? (
                                  <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 14 }}>
                                    <rect width="32" height="40" rx="6" fill="#fff" stroke="#F44336" strokeWidth="2"/>
                                    <path d="M8 8h16v24H8z" fill="#fff"/>
                                    <text x="16" y="28" textAnchor="middle" fontSize="10" fill="#F44336" fontWeight="bold">PDF</text>
                                  </svg>
                                ) : getFileTypeIcon(att)}
                                {/* File info */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontWeight: 600, fontSize: 15, color: '#232b3b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 140 }}>{att.name || att.url || 'Attachment'}</div>
                                  <div style={{ fontSize: 13, fontWeight: 500, marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <span style={{ color: typeColor }}>{fileType}</span>
                                    {isFile && <span style={{ color: '#b0b0b0', fontWeight: 700, fontSize: 15, margin: '0 2px' }}>•</span>}
                                    {isFile ? (
                                      <a
                                        href={typeof att.file === 'string' ? att.file : URL.createObjectURL(att.file)}
                                        download={att.name}
                                        style={{ fontSize: 13, color: linkColor, fontWeight: 600, textDecoration: 'underline' }}
                                        onClick={e => { e.stopPropagation(); }}
                                      >
                                        Download
                                      </a>
                                    ) : att.url ? (
                                      <a
                                        href={att.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ fontSize: 13, color: '#1976d2', fontWeight: 600, textDecoration: 'underline' }}
                                        onClick={e => e.stopPropagation()}
                                      >
                                        Open
                                      </a>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
            {activeStreamTab === 'drafts' && (
              <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #324cdd11', border: 'none', marginBottom: 24, marginTop: 0, padding: '2rem 2rem 1.5rem', maxWidth: '100%' }}>
                <div style={{ fontWeight: 700, color: '#2d3559', marginBottom: 8 }}>Draft Announcements</div>
                {draftAnnouncements.length === 0 ? (
                  <div style={{ color: '#888' }}>No drafts saved.</div>
                ) : (
                  draftAnnouncements.map((announcement) => (
                    <div key={announcement.id} style={{ background: '#f8fafd', borderRadius: 12, boxShadow: '0 2px 8px #324cdd11', marginBottom: 18, padding: '18px 24px', cursor: 'pointer' }}
                      onClick={() => {
                        setStudentAnnouncement(announcement.content);
                        setAnnouncementTitle(announcement.title);
                        setAllowComments(announcement.allowComments);
                        setAttachments(announcement.attachments || []);
                        setFormExpanded(true);
                        setEditingDraftId(announcement.id);
                        setDraftAnnouncements(draftAnnouncements.filter(d => d.id !== announcement.id));
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 6 }}>{announcement.title}</div>
                      <div style={{ color: '#444', fontSize: 15, marginBottom: 12 }}>{announcement.content}</div>
                      <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>Saved as draft: {new Date(announcement.date).toLocaleString()}</div>
                      {announcement.attachments && announcement.attachments.length > 0 && (
                        <div style={{ margin: '10px 0 16px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {announcement.attachments.map((att, idx) => {
                            const isMp3 = att.type === 'file' && att.file && (att.file.type === 'audio/mp3' || att.file.type === 'audio/mpeg' || (att.name && att.name.toLowerCase().endsWith('.mp3')));
                            const isPdf = att.type === 'file' && att.file && (att.file.type === 'application/pdf' || (att.name && att.name.toLowerCase().endsWith('.pdf')));
                            const fileType = isMp3 ? 'MP3' : isPdf ? 'PDF' : (att.file && att.file.type ? att.file.type.split('/')[1]?.toUpperCase() : att.type.charAt(0).toUpperCase() + att.type.slice(1));
                            const typeColor = isMp3 ? '#43a047' : isPdf ? '#F44336' : '#888';
                            const linkColor = isMp3 ? '#43a047' : isPdf ? '#F44336' : '#1976d2';
                            const isFile = att.type === 'file' && att.file;
                            return (
                              <div
                                key={idx}
                                style={{ display: 'flex', alignItems: 'center', background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px #e9ecef', padding: '10px 18px', minWidth: 220, maxWidth: 340, cursor: isFile ? 'pointer' : 'default' }}
                                onClick={isFile ? () => handlePreviewAttachment(att) : undefined}
                              >
                                {/* File icon */}
                                {isMp3 ? (
                                  <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 14 }}>
                                    <rect width="32" height="40" rx="6" fill="#fff" stroke="#43a047" strokeWidth="2"/>
                                    <circle cx="16" cy="20" r="7" fill="#43a047"/>
                                    <rect x="22" y="13" width="3" height="14" rx="1.5" fill="#43a047"/>
                                    <text x="16" y="36" textAnchor="middle" fontSize="10" fill="#43a047" fontWeight="bold">MP3</text>
                                  </svg>
                                ) : isPdf ? (
                                  <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 14 }}>
                                    <rect width="32" height="40" rx="6" fill="#fff" stroke="#F44336" strokeWidth="2"/>
                                    <path d="M8 8h16v24H8z" fill="#fff"/>
                                    <text x="16" y="28" textAnchor="middle" fontSize="10" fill="#F44336" fontWeight="bold">PDF</text>
                                  </svg>
                                ) : getFileTypeIcon(att)}
                                {/* File info */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontWeight: 600, fontSize: 15, color: '#232b3b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 140 }}>{att.name || att.url || 'Attachment'}</div>
                                  <div style={{ fontSize: 13, fontWeight: 500, marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <span style={{ color: typeColor }}>{fileType}</span>
                                    {isFile && <span style={{ color: '#b0b0b0', fontWeight: 700, fontSize: 15, margin: '0 2px' }}>•</span>}
                                    {isFile ? (
                                      <a
                                        href={typeof att.file === 'string' ? att.file : URL.createObjectURL(att.file)}
                                        download={att.name}
                                        style={{ fontSize: 13, color: linkColor, fontWeight: 600, textDecoration: 'underline' }}
                                        onClick={e => { e.stopPropagation(); }}
                                      >
                                        Download
                                      </a>
                                    ) : att.url ? (
                                      <a
                                        href={att.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ fontSize: 13, color: '#1976d2', fontWeight: 600, textDecoration: 'underline' }}
                                        onClick={e => e.stopPropagation()}
                                      >
                                        Open
                                      </a>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
            {/* Student Announcement Post Form */}
            {!formExpanded ? (
              <div style={{ marginBottom: 24 }}>
                <textarea
                  id="student-announcement-textarea"
                  value={studentAnnouncement}
                  onFocus={() => setFormExpanded(true)}
                  onChange={e => setStudentAnnouncement(e.target.value)}
                  placeholder="Share an announcement with your class..."
                  style={{ width: '100%', fontSize: 16, minHeight: 56, borderRadius: 12, padding: '16px 18px', border: 'none', background: '#f7fafd', boxShadow: 'none', resize: 'none', outline: 'none', color: '#888' }}
                />
              </div>
            ) : (
              <form onSubmit={handleStudentPostAnnouncement} style={{ marginBottom: 24, background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #324cdd11', padding: '1.5rem 1.5rem 1rem', border: '1.5px solid #e9ecef', maxWidth: '100%', position: 'relative' }}>
                <button
                  type="button"
                  style={{ position: 'absolute', top: 18, right: 18, background: '#f7fafd', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 22, cursor: 'pointer', boxShadow: '0 1px 4px #e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  title="Add people"
                  onClick={() => { setTempSelectedStudents(selectedAnnouncementStudents); setShowStudentSelectModal(true); }}
                >
                  {selectedAnnouncementStudents.length > 0 && (
                    <span style={{ background: '#e3eafe', color: '#324cdd', borderRadius: '50%', padding: '2px 8px', fontWeight: 700, fontSize: 13, minWidth: 18, minHeight: 18, textAlign: 'center', boxShadow: '0 2px 8px #324cdd11', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{selectedAnnouncementStudents.length}</span>
                  )}
                  <i className="fa fa-user-plus" />
                </button>
                <div style={{ marginBottom: 10, display: 'flex', alignItems: 'center' }}>
                  <input type="checkbox" id="allowComments" checked={allowComments} onChange={e => setAllowComments(e.target.checked)} style={{ marginRight: 8 }} />
                  <label htmlFor="allowComments" style={{ fontWeight: 500, fontSize: 16, color: '#222', margin: 0 }}>Allow comments</label>
                </div>
                <input
                  type="text"
                  value={announcementTitle}
                  onChange={e => setAnnouncementTitle(e.target.value)}
                  placeholder="Announcement title (optional)"
                  style={{ width: '100%', fontSize: 15, borderRadius: 8, border: '1px solid #bfcfff', background: '#fff', marginBottom: 8, padding: '10px 12px' }}
                />
                <textarea
                  id="student-announcement-textarea"
                  value={studentAnnouncement}
                  onChange={e => setStudentAnnouncement(e.target.value)}
                  placeholder="Share an announcement with your class..."
                  style={{ width: '100%', fontSize: 16, minHeight: 56, borderRadius: 12, padding: '16px 18px', border: 'none', background: '#f7fafd', boxShadow: 'none', resize: 'vertical', outline: 'none', color: '#222', marginBottom: 8 }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <div style={{ marginBottom: 12, position: 'relative', display: 'inline-block' }}>
                    <button
                      style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: 'none', borderRadius: 8, boxShadow: '0 2px 8px #e9ecef', padding: '10px 18px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}
                      onClick={() => setAttachmentDropdownOpenId('new')}
                      type="button"
                    >
                      <i className="fa fa-paperclip" style={{ fontSize: 18 }} /> Add Attachment
                    </button>
                    {attachmentDropdownOpenId === 'new' && (
                      <div ref={attachmentMenuRef} style={{ position: 'absolute', top: 48, left: 0, background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px #324cdd22', padding: '10px 0', minWidth: 180, zIndex: 20 }}>
                        <div style={{ padding: '10px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }} onClick={() => handleAttachmentOption('file')}>
                          <i className="fa fa-file" style={{ fontSize: 18 }} /> File
                        </div>
                        <div style={{ padding: '10px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }} onClick={() => handleAttachmentOption('link')}>
                          <i className="fa fa-globe" style={{ fontSize: 18 }} /> Link
                        </div>
                        <div style={{ padding: '10px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }} onClick={() => handleAttachmentOption('youtube')}>
                          <i className="fa fa-youtube-play" style={{ fontSize: 18, color: '#f00' }} /> YouTube
                        </div>
                        <div style={{ padding: '10px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }} onClick={() => handleAttachmentOption('drive')}>
                          <i className="fa fa-cloud-upload" style={{ fontSize: 18 }} /> Google Drive
                        </div>
                      </div>
                    )}
                  </div>
                  <div style={{ position: 'relative' }}>
                    <button
                      type="button"
                      style={{ border: 'none', background: '#f7fafd', borderRadius: 8, padding: '8px 14px', fontSize: 18, cursor: 'pointer' }}
                      onClick={e => { e.preventDefault(); setShowEmojiPicker(v => !v); }}
                    >
                      <i className="fa fa-smile" />
                    </button>
                    {showEmojiPicker && (
                      <div ref={emojiPickerRef} style={{ position: 'absolute', top: 44, left: 0, background: '#fff', border: '1px solid #e9ecef', borderRadius: 8, boxShadow: '0 2px 8px #324cdd22', padding: 8, zIndex: 30, minWidth: 260, maxWidth: 260, width: 260, maxHeight: 200, overflowY: 'auto' }}>
                        {emojiList.map(emoji => (
                          <span key={emoji} style={{ fontSize: 22, cursor: 'pointer', margin: 4 }} onClick={() => insertEmojiAtCursor(emoji)}>{emoji}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {attachments.length > 0 && (
                  <div style={{ margin: '12px 0 0 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {attachments.map((att, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px #e9ecef', padding: '12px 18px', minWidth: 220, maxWidth: 340 }}>
                        {getFileTypeIcon(att)}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: 15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160 }}>{att.name || att.url || 'Attachment'}</div>
                          <div style={{ fontSize: 13, color: '#888' }}>{att.type === 'file' ? (att.file ? att.file.type.split('/')[1]?.toUpperCase() : 'FILE') : att.type.charAt(0).toUpperCase() + att.type.slice(1)}</div>
                        </div>
                        {att.type === 'file' && att.file ? (
                          <a href={URL.createObjectURL(att.file)} download={att.name} style={{ fontSize: 14, color: '#1976d2', fontWeight: 500, marginLeft: 10, textDecoration: 'underline' }}>Download</a>
                        ) : att.url ? (
                          <a href={att.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, color: '#1976d2', fontWeight: 500, marginLeft: 10, textDecoration: 'underline' }}>Open</a>
                        ) : null}
                        <button type="button" onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))} style={{ marginLeft: 10, background: 'none', border: 'none', color: '#888', fontSize: 18, cursor: 'pointer' }} title="Remove attachment">
                          <i className="fa fa-times-circle" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                  <button type="button" style={{ fontWeight: 500, borderRadius: 8, minWidth: 80, fontSize: 15, background: '#f7fafd', color: '#222', border: 'none', padding: '8px 20px', cursor: 'pointer' }} onClick={() => { setFormExpanded(false); setStudentAnnouncement(""); setAnnouncementTitle(""); setAllowComments(true); }}>
                    Cancel
                  </button>
                  <button type="submit" style={{ fontWeight: 600, borderRadius: 8, minWidth: 100, fontSize: 15, background: '#7b8cff', color: '#fff', border: 'none', padding: '8px 20px', cursor: studentAnnouncement.trim() ? 'pointer' : 'not-allowed', opacity: studentAnnouncement.trim() ? 1 : 0.6 }} disabled={!studentAnnouncement.trim()}>
                    <i className="ni ni-send" style={{ fontSize: 16, marginRight: 6 }} />
                    Post
                  </button>
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <button
                      type="button"
                      style={{
                        background: '#fff',
                        border: 'none',
                        borderRadius: 12,
                        width: 40,
                        height: 48,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 12px rgba(44,62,80,0.07)',
                        padding: 0,
                        cursor: 'pointer',
                        transition: 'box-shadow 0.15s',
                      }}
                      onClick={() => setShowPostOptionsDropdown(v => !v)}
                    >
                      <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#444', display: 'block' }} />
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#444', display: 'block' }} />
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#444', display: 'block' }} />
                      </span>
                    </button>
                    {showPostOptionsDropdown && (
                      <div ref={postOptionsDropdownRef} style={{ position: 'absolute', bottom: 48, right: 0, background: '#fff', borderRadius: 10, boxShadow: '0 2px 12px #324cdd22', padding: '8px 0', minWidth: 140, zIndex: 30 }}>
                        <div style={{ padding: '10px 20px', cursor: 'pointer', fontWeight: 500, color: '#222', fontSize: 15 }}
                          onClick={() => { setShowScheduleModal(true); setShowPostOptionsDropdown(false); }}
                        >
                          <i className="fa fa-calendar" style={{ marginRight: 8, color: '#1976d2' }} /> Scheduled
                        </div>
                        <div style={{ padding: '10px 20px', cursor: 'pointer', fontWeight: 500, color: '#222', fontSize: 15 }}
                          onClick={() => {
                            if (!studentAnnouncement.trim() && !announcementTitle.trim()) return;
                            const newDraft = {
                              id: Date.now(),
                              title: announcementTitle,
                              content: studentAnnouncement,
                              author: loggedInName,
                              date: new Date().toISOString(),
                              isPinned: false,
                              reactions: { like: 0, likedBy: [] },
                              comments: [],
                              allowComments: allowComments,
                              attachments: attachments
                            };
                            setDraftAnnouncements([newDraft, ...draftAnnouncements]);
                            setStudentAnnouncement("");
                            setAnnouncementTitle("");
                            setAllowComments(true);
                            setFormExpanded(false);
                            setAttachments([]);
                            setShowPostOptionsDropdown(false);
                          }}
                        >
                          <i className="fa fa-file-alt" style={{ marginRight: 8, color: '#1976d2' }} /> Drafts
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            )}
            {/* Announcements List */}
            <div style={{ marginTop: 32 }}>
              {sortedAnnouncements.map((announcement) => (
                <div
                  key={announcement.id}
                  style={{
                    background: '#fff',
                    borderRadius: 12,
                    boxShadow: '0 2px 8px #324cdd11',
                    borderLeft: announcement.isPinned ? '4px solid #f7b731' : 'none',
                    marginBottom: 24,
                    padding: 0,
                    position: 'relative'
                  }}
                >
                  <div style={{ padding: '0.75rem 1rem', position: 'relative' }}>
                    {/* Like and menu group in upper right */}
                    <div style={{ position: 'absolute', top: 16, right: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div
                        style={{ display: 'flex', alignItems: 'center', gap: 4, color: likedAnnouncements[announcement.id] ? '#1976d2' : '#b0b0b0', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}
                        onClick={() => handleLike(announcement)}
                        title={likedAnnouncements[announcement.id] ? 'Unlike' : 'Like'}
                      >
                        <i className="fa fa-thumbs-up" style={{ color: likedAnnouncements[announcement.id] ? '#1976d2' : '#b0b0b0', fontSize: 18 }} />
                        <span>{announcement.reactions?.like || 0}</span>
                      </div>
                      <div style={{ color: '#5e6e8c', fontSize: 20, cursor: 'pointer', paddingLeft: 4, position: 'relative' }}>
                        <i className="fa fa-ellipsis-v" onClick={() => setOpenMenuId(openMenuId === announcement.id ? null : announcement.id)} />
                        {openMenuId === announcement.id && (
                          <div ref={menuRef} style={{ position: 'absolute', top: 28, right: 0, background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px #324cdd22', padding: '18px 0', minWidth: 160, zIndex: 10 }}>
                            <div style={{ padding: '8px 20px', cursor: 'pointer', fontWeight: 400, color: '#222', fontSize: 16 }} onClick={() => handleEditClick(announcement)}>Edit</div>
                            <div style={{ padding: '8px 20px', cursor: 'pointer', fontWeight: 400, color: '#222', fontSize: 16 }} onClick={() => { setOpenMenuId(null); /* handle delete here */ }}>Delete</div>
                            {announcement.isPinned ? (
                              <div style={{ padding: '8px 20px', cursor: 'pointer', fontWeight: 400, color: '#222', fontSize: 16 }} onClick={() => handleUnpin(announcement)}>Unpin</div>
                            ) : (
                              <div style={{ padding: '8px 20px', cursor: 'pointer', fontWeight: 400, color: '#222', fontSize: 16 }} onClick={() => handlePin(announcement)}>Pin this announcement</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Inline edit form if editing */}
                    {editingAnnouncementId === announcement.id ? (
                      <>
                        {/* Author info, date, and pinned badge (always visible) */}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8, justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginTop: -4 }}>
                              <img src={announcement.author === 'Prof. Smith' ? 'https://randomuser.me/api/portraits/men/32.jpg' : announcement.author === 'You' ? 'https://randomuser.me/api/portraits/women/44.jpg' : 'https://randomuser.me/api/portraits/men/75.jpg'} alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <div style={{ fontWeight: 600, color: '#111' }}>{announcement.author}</div>
                                {announcement.isPinned && (
                                  <Badge color="warning" className="ml-2">Pinned</Badge>
                                )}
                              </div>
                              <small className="text-muted">{formatRelativeTime(announcement.date)}</small>
                            </div>
                          </div>
                        </div>
                        {/* Edit form for title/content only */}
                        <div style={{ marginTop: 8 }}>
                          <input
                            type="text"
                            value={editAnnouncementTitle}
                            onChange={e => setEditAnnouncementTitle(e.target.value)}
                            style={{ width: '100%', fontWeight: 700, fontSize: 18, marginBottom: 8, borderRadius: 8, border: '1px solid #e0e0e0', padding: '8px 12px' }}
                          />
                          <textarea
                            value={editAnnouncementContent}
                            onChange={e => setEditAnnouncementContent(e.target.value)}
                            style={{ width: '100%', fontSize: 15, borderRadius: 8, border: '1px solid #e0e0e0', padding: '12px', minHeight: 60, marginBottom: 12 }}
                          />
                          {/* Add Attachment button */}
                          <div style={{ marginBottom: 12, position: 'relative', display: 'inline-block' }}>
                            <button
                              style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: 'none', borderRadius: 8, boxShadow: '0 2px 8px #e9ecef', padding: '10px 18px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}
                              onClick={() => setAttachmentDropdownOpenId(announcement.id)}
                              type="button"
                            >
                              <i className="fa fa-paperclip" style={{ fontSize: 18 }} /> Add Attachment
                            </button>
                            {attachmentDropdownOpenId === announcement.id && (
                              <div ref={attachmentMenuRef} style={{ position: 'absolute', top: 48, left: 0, background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px #324cdd22', padding: '10px 0', minWidth: 180, zIndex: 20 }}>
                                <div style={{ padding: '10px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }} onClick={() => handleAttachmentOption('file')}>
                                  <i className="fa fa-file" style={{ fontSize: 18 }} /> File
                                </div>
                                <div style={{ padding: '10px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }} onClick={() => handleAttachmentOption('link')}>
                                  <i className="fa fa-globe" style={{ fontSize: 18 }} /> Link
                                </div>
                                <div style={{ padding: '10px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }} onClick={() => handleAttachmentOption('youtube')}>
                                  <i className="fa fa-youtube-play" style={{ fontSize: 18, color: '#f00' }} /> YouTube
                                </div>
                                <div style={{ padding: '10px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }} onClick={() => handleAttachmentOption('drive')}>
                                  <i className="fa fa-cloud-upload" style={{ fontSize: 18 }} /> Google Drive
                                </div>
                              </div>
                            )}
                          </div>
                          {/* Allow comments checkbox */}
                          <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center' }}>
                            <input type="checkbox" id={`allowComments-edit-${announcement.id}`} checked={allowComments} onChange={e => setAllowComments(e.target.checked)} style={{ marginRight: 8 }} />
                            <label htmlFor={`allowComments-edit-${announcement.id}`} style={{ fontWeight: 500, color: '#222', margin: 0 }}>Allow comments</label>
                          </div>
                          {/* Who can view this announcement */}
                          <div style={{ marginBottom: 18 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, color: '#222', marginBottom: 6 }}>
                              <i className="fa fa-user" style={{ fontSize: 18 }} /> Who can view this announcement?
                            </div>
                            <button style={{ background: '#bfc5cc', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer', opacity: 0.8 }}>
                              + Select students
                            </button>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                            <button onClick={handleEditCancel} style={{ background: '#f7fafd', color: '#222', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
                            <button onClick={() => handleEditSave(announcement)} style={{ background: '#2ecc71', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 600, cursor: 'pointer' }}>Save</button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8, justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginTop: -4 }}>
                              <img src={announcement.author === 'Prof. Smith' ? 'https://randomuser.me/api/portraits/men/32.jpg' : announcement.author === 'You' ? 'https://randomuser.me/api/portraits/women/44.jpg' : 'https://randomuser.me/api/portraits/men/75.jpg'} alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <div style={{ fontWeight: 600, color: '#111', fontSize: 14 }}>{announcement.author}</div>
                                {announcement.isPinned && (
                                  <Badge color="warning" className="ml-2">Pinned</Badge>
                                )}
                              </div>
                              <small className="text-muted" style={{ fontSize: 11 }}>{formatRelativeTime(announcement.date)}</small>
                            </div>
                          </div>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 6 }}>{announcement.title}</div>
                        <div style={{ color: '#444', fontSize: 15, marginBottom: 12 }}>{announcement.content}</div>
                        {announcement.attachments && announcement.attachments.length > 0 && (
                          <div style={{ margin: '10px 0 16px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {announcement.attachments.map((att, idx) => {
                              const isMp3 = att.type === 'file' && att.file && (att.file.type === 'audio/mp3' || att.file.type === 'audio/mpeg' || (att.name && att.name.toLowerCase().endsWith('.mp3')));
                              const isPdf = att.type === 'file' && att.file && (att.file.type === 'application/pdf' || (att.name && att.name.toLowerCase().endsWith('.pdf')));
                              const fileType = isMp3 ? 'MP3' : isPdf ? 'PDF' : (att.file && att.file.type ? att.file.type.split('/')[1]?.toUpperCase() : att.type.charAt(0).toUpperCase() + att.type.slice(1));
                              const typeColor = isMp3 ? '#43a047' : isPdf ? '#F44336' : '#888';
                              const linkColor = isMp3 ? '#43a047' : isPdf ? '#F44336' : '#1976d2';
                              const isFile = att.type === 'file' && att.file;
                              return (
                                <div
                                  key={idx}
                                  style={{ display: 'flex', alignItems: 'center', background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px #e9ecef', padding: '10px 18px', minWidth: 220, maxWidth: 340, cursor: isFile ? 'pointer' : 'default' }}
                                  onClick={isFile ? () => handlePreviewAttachment(att) : undefined}
                                >
                                  {/* File icon */}
                                  {isMp3 ? (
                                    <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 14 }}>
                                      <rect width="32" height="40" rx="6" fill="#fff" stroke="#43a047" strokeWidth="2"/>
                                      <circle cx="16" cy="20" r="7" fill="#43a047"/>
                                      <rect x="22" y="13" width="3" height="14" rx="1.5" fill="#43a047"/>
                                      <text x="16" y="36" textAnchor="middle" fontSize="10" fill="#43a047" fontWeight="bold">MP3</text>
                                    </svg>
                                  ) : isPdf ? (
                                    <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 14 }}>
                                      <rect width="32" height="40" rx="6" fill="#fff" stroke="#F44336" strokeWidth="2"/>
                                      <path d="M8 8h16v24H8z" fill="#fff"/>
                                      <text x="16" y="28" textAnchor="middle" fontSize="10" fill="#F44336" fontWeight="bold">PDF</text>
                                    </svg>
                                  ) : getFileTypeIcon(att)}
                                  {/* File info */}
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 600, fontSize: 15, color: '#232b3b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 140 }}>{att.name || att.url || 'Attachment'}</div>
                                    <div style={{ fontSize: 13, fontWeight: 500, marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                                      <span style={{ color: typeColor }}>{fileType}</span>
                                      {isFile && <span style={{ color: '#b0b0b0', fontWeight: 700, fontSize: 15, margin: '0 2px' }}>•</span>}
                                      {isFile ? (
                                        <a
                                          href={typeof att.file === 'string' ? att.file : URL.createObjectURL(att.file)}
                                          download={att.name}
                                          style={{ fontSize: 13, color: linkColor, fontWeight: 600, textDecoration: 'underline' }}
                                          onClick={e => { e.stopPropagation(); }}
                                        >
                                          Download
                                        </a>
                                      ) : att.url ? (
                                        <a
                                          href={att.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          style={{ fontSize: 13, color: '#1976d2', fontWeight: 600, textDecoration: 'underline' }}
                                          onClick={e => e.stopPropagation()}
                                        >
                                          Open
                                        </a>
                                      ) : null}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        {/* Comments Section */}
                        {announcement.allowComments !== false ? (
                          <div style={{ background: '#f7fafd', borderRadius: 10, padding: '12px 18px', marginTop: 10 }}>
                            <div
                              style={{ fontWeight: 600, fontSize: 15, marginBottom: 8, cursor: 'pointer', userSelect: 'none' }}
                              onClick={() => setCollapsedComments(prev => ({ ...prev, [announcement.id]: !prev[announcement.id] }))}
                            >
                              Comments ({announcement.comments.length})
                            </div>
                            {!collapsedComments[announcement.id] && announcement.comments.map((comment, idx) => (
                              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 10, position: 'relative' }}>
                                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginRight: 10 }}>
                                  <img src={comment.author === 'Prof. Smith' ? 'https://randomuser.me/api/portraits/men/32.jpg' : 'https://randomuser.me/api/portraits/men/75.jpg'} alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontWeight: 600, fontSize: 14 }}>{comment.author} <span style={{ color: '#888', fontWeight: 400, fontSize: 12, marginLeft: 6 }}>{formatRelativeTime(comment.date)}</span></div>
                                  {editingComment.announcementId === announcement.id && editingComment.idx === idx ? (
                                    <>
                                      <input
                                        type="text"
                                        value={editCommentValue}
                                        onChange={e => setEditCommentValue(e.target.value)}
                                        style={{ width: '100%', fontSize: 15, borderRadius: 6, border: '1px solid #e0e0e0', padding: '6px 10px', marginBottom: 6 }}
                                      />
                                      <div style={{ display: 'flex', gap: 8 }}>
                                        <button onClick={handleCommentEditCancel} style={{ background: '#f7fafd', color: '#222', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
                                        <button onClick={() => handleCommentEditSave(announcement.id, idx)} style={{ background: '#2ecc71', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 600, cursor: 'pointer' }}>Save</button>
                                      </div>
                                    </>
                                  ) : (
                                    <div style={{ fontSize: 15, color: '#444' }}>{comment.text}</div>
                                  )}
                                </div>
                                <div style={{ position: 'relative', marginLeft: 8 }}>
                                  <i className="fa fa-ellipsis-v" style={{ color: '#5e6e8c', fontSize: 18, cursor: 'pointer' }} onClick={() => handleCommentMenu(announcement.id, idx)} />
                                  {openCommentMenu.announcementId === announcement.id && openCommentMenu.idx === idx && (
                                    <div ref={commentMenuRef} style={{ position: 'absolute', top: 22, right: 0, background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px #324cdd22', padding: '10px 0', minWidth: 120, zIndex: 20 }}>
                                      <div style={{ padding: '10px 20px', cursor: 'pointer' }} onClick={() => handleCommentEdit(announcement.id, idx)}>Edit</div>
                                      <div style={{ padding: '10px 20px', cursor: 'pointer' }} onClick={() => handleCommentDelete(announcement.id, idx)}>Delete</div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                            {/* Comment input box */}
                            {!collapsedComments[announcement.id] && (
                              <div style={{ display: 'flex', alignItems: 'center', marginTop: 12, gap: 8 }}>
                                <input
                                  type="text"
                                  placeholder="Add a comment..."
                                  value={commentInputs[announcement.id] || ""}
                                  onChange={e => handleCommentInputChange(announcement.id, e.target.value)}
                                  style={{ flex: 1, borderRadius: 10, border: '2px solid #bfcfff', padding: '10px 16px', fontSize: 15, outline: 'none', background: '#fff', transition: 'border 0.2s' }}
                                  onKeyDown={e => { if (e.key === 'Enter') handlePostComment(announcement.id); }}
                                />
                                <div style={{ position: 'relative' }}>
                                  <button
                                    type="button"
                                    style={{ background: '#fff', border: 'none', borderRadius: 8, padding: 6, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px #e9ecef' }}
                                    onClick={() => setShowCommentEmojiPicker(prev => ({ ...prev, [announcement.id]: !prev[announcement.id] }))}
                                  >
                                    <i className="fa fa-smile" style={{ fontSize: 18 }} />
                                  </button>
                                  {showCommentEmojiPicker[announcement.id] && (
                                    <div ref={el => { if (el) commentEmojiPickerRefs.current[announcement.id] = el; }} style={{ position: 'absolute', top: 40, left: 0, background: '#fff', border: '1px solid #e9ecef', borderRadius: 8, boxShadow: '0 2px 8px #324cdd22', padding: 8, zIndex: 30, minWidth: 220, maxWidth: 220, width: 220, maxHeight: 180, overflowY: 'auto' }}>
                                      {emojiList.map(emoji => (
                                        <span key={emoji} style={{ fontSize: 20, cursor: 'pointer', margin: 3 }} onClick={() => handleAddEmojiToComment(announcement.id, emoji)}>{emoji}</span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  style={{ background: '#7b8cff', border: 'none', borderRadius: 8, padding: 0, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18, boxShadow: '0 1px 4px #e9ecef' }}
                                  onClick={() => handlePostComment(announcement.id)}
                                  disabled={!(commentInputs[announcement.id] || '').trim()}
                                >
                                  <i className="ni ni-send" />
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div style={{ background: '#f7fafd', borderRadius: 10, padding: '12px 18px', marginTop: 10, color: '#888', fontWeight: 500 }}>
                            Comments are disabled for this post.
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Classwork Section */}
      {activeTab === "classwork" && (
        <div style={{ maxWidth: 700, margin: '32px auto 0' }}>
          {mockAssignments.map(a => (
            <div key={a.id} style={{ marginBottom: 18 }}>
              {expandedId === a.id ? (
                <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px 0 rgba(44,62,80,.10)', border: '1px solid #eee', padding: 0, overflow: 'hidden', position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center', padding: '18px 24px 0 24px' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 18 }}>
                      <i className="ni ni-single-copy-04" style={{ fontSize: 24, color: '#888' }} />
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 17 }}>{a.title}</div>
                    <div style={{ flex: 1 }} />
                    <div style={{ color: '#888', fontSize: 14, fontWeight: 500 }}>Due {a.due}</div>
                    <i className="ni ni-bold-down" style={{ fontSize: 20, color: '#888', marginLeft: 18, cursor: 'pointer' }} onClick={() => setExpandedId(null)} />
                    <i className="ni ni-button-power" style={{ fontSize: 20, color: '#888', marginLeft: 12, cursor: 'pointer', opacity: 0.3 }} />
                  </div>
                  <div style={{ padding: '0 24px 0 86px', color: '#888', fontSize: 13, marginTop: 8, display: 'flex', alignItems: 'center' }}>
                    <span>Posted {a.posted}</span>
                    <span style={{ marginLeft: 'auto', color: '#4caf50', fontWeight: 600 }}>{a.status}</span>
                  </div>
                  <div style={{ padding: '12px 24px 0 86px', fontSize: 15, color: '#444' }}>{a.description}</div>
                  <div style={{ padding: '12px 24px 12px 86px', borderTop: '1px solid #eee', background: '#fafbfc', fontSize: 15, color: '#1976d2', fontWeight: 600, cursor: 'pointer' }}
                    onClick={() => navigate(`/student/classroom/${code}/assignment/${a.id}`)}
                  >
                    {a.instructions}
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #eee', background: 'none', cursor: 'pointer' }} onClick={() => setExpandedId(a.id)}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 18 }}>
                    <i className="ni ni-single-copy-04" style={{ fontSize: 20, color: '#888' }} />
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{a.title}</div>
                  <div style={{ flex: 1 }} />
                  <div style={{ color: '#888', fontSize: 14, fontWeight: 500 }}>{a.due ? `Due ${a.due}` : ''}</div>
                  <i className="ni ni-bold-up" style={{ fontSize: 18, color: '#888', marginLeft: 18, cursor: 'pointer', opacity: 0.7 }} />
                  <i className="ni ni-button-power" style={{ fontSize: 18, color: '#888', marginLeft: 12, cursor: 'pointer', opacity: 0.2 }} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {/* People Section */}
      {activeTab === "people" && (
        <div style={{ maxWidth: 700, margin: '32px auto 0', background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px 0 rgba(44,62,80,.06)', padding: 32 }}>
          {/* Teachers Section */}
          <div style={{ fontWeight: 700, fontSize: 28, marginBottom: 8 }}>Teachers</div>
          <hr style={{ margin: '0 0 18px 0', borderColor: '#eee' }} />
          {teachers.map((teacher, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
              {teacher.avatar ? (
                <img src={teacher.avatar} alt={teacher.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', marginRight: 18 }} />
              ) : (
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#673ab7', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 20, marginRight: 18 }}>
                  {teacher.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
              )}
              <span style={{ fontSize: 16, fontWeight: 500 }}>{teacher.name}</span>
            </div>
          ))}

          {/* Classmates Section */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 36 }}>
            <div style={{ fontWeight: 700, fontSize: 28 }}>Classmates</div>
            <div style={{ color: '#555', fontWeight: 500, fontSize: 15 }}>{classmates.length} students</div>
          </div>
          <hr style={{ margin: '0 0 18px 0', borderColor: '#eee' }} />
          {classmates.map((student, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
              {student.avatar ? (
                <img src={student.avatar} alt={student.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', marginRight: 18 }} />
              ) : (
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#512da8', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 20, marginRight: 18 }}>
                  {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
              )}
              <span style={{ fontSize: 16, fontWeight: 500 }}>{student.name}</span>
            </div>
          ))}
        </div>
      )}
      {/* Grades Section */}
      {activeTab === "grades" && (
        <div style={{ maxWidth: 900, margin: '32px auto 0', background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px 0 rgba(44,62,80,.06)', padding: 32 }}>
          {/* Student Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 32 }}>
            <img src="" alt="Ferreras, Geraldine P." style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover' }} />
            <span style={{ fontWeight: 700, fontSize: 28 }}>Ferreras, Geraldine P.</span>
          </div>
          <hr style={{ margin: '24px 0 32px 0', borderColor: '#eee' }} />
          {/* Filter Dropdown */}
          <div style={{ marginBottom: 32, position: 'relative', width: 360 }}>
            <div
              style={{
                border: '2px solid #1976d2',
                borderRadius: 8,
                padding: '14px 18px',
                fontSize: 16,
                fontWeight: 500,
                color: '#222',
                background: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                userSelect: 'none'
              }}
              onClick={() => setDropdownOpen(v => !v)}
            >
              <span>{gradeFilter}</span>
              <span style={{ marginLeft: 16, fontSize: 20, color: '#888', transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(-180deg)' : 'rotate(0deg)' }}>&#9660;</span>
            </div>
            {dropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '110%',
                left: 0,
                width: '100%',
                background: '#fff',
                border: '2px solid #1976d2',
                borderRadius: 8,
                boxShadow: '0 4px 16px 0 rgba(44,62,80,.10)',
                zIndex: 10,
                marginTop: 2
              }}>
                {gradeFilters.map(option => (
                  <div
                    key={option}
                    style={{
                      padding: '14px 18px',
                      fontSize: 16,
                      fontWeight: 500,
                      color: '#222',
                      background: gradeFilter === option ? '#f0f7ff' : '#fff',
                      cursor: 'pointer',
                      borderRadius: 8
                    }}
                    onClick={() => { setGradeFilter(option); setDropdownOpen(false); }}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Assignment List */}
          <div>
            {mockAssignments.map(a => (
              <div key={a.id}>
                {expandedGradeId === a.id ? (
                  <div style={{ border: '2px solid #1976d2', borderRadius: 12, marginBottom: 18, background: '#f8fafd' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', cursor: 'pointer' }} onClick={() => setExpandedGradeId(null)}>
                      <div>
                        <span style={{ fontWeight: 700, fontSize: 18, marginRight: 12 }}>{a.title}</span>
                        <i className="ni ni-paper-clip" style={{ fontSize: 18, marginRight: 4, color: '#888' }} />
                        <span style={{ fontSize: 15, color: '#888', marginRight: 18 }}>{a.id === 7 ? 3 : a.id === 5 || a.id === 6 || a.id === 8 || a.id === 2 ? 1 : 2}</span>
                        <div style={{ fontSize: 15, color: '#888', marginTop: 2 }}>Due {a.due}</div>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: 18 }}>{a.id === 8 ? 'Turned in' : a.id === 7 ? '45/50' : a.id === 5 ? '48/50' : a.id === 6 ? '50/50' : a.id === 4 ? '48/50' : a.id === 2 ? '42/50' : '45/50'}</div>
                    </div>
                    {/* Expanded content for Activity 7 only */}
                    {a.id === 7 && (
                      <>
                        <div style={{ display: 'flex', gap: 16, padding: '0 24px 24px 24px', flexWrap: 'wrap' }}>
                          <div style={{ width: 220, background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: 12, marginTop: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                            <img src="https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=120&q=80" alt="pdf" style={{ width: 38, height: 38, borderRadius: 6, objectFit: 'cover' }} />
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 120 }}>FERRERAS, Geraldine P. ...</div>
                              <div style={{ fontSize: 13, color: '#888' }}>PDF</div>
                            </div>
                          </div>
                          <div style={{ width: 220, background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: 12, marginTop: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                            <img src="https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=120&q=80" alt="img" style={{ width: 38, height: 38, borderRadius: 6, objectFit: 'cover' }} />
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 15 }}>Page 2.jpg</div>
                              <div style={{ fontSize: 13, color: '#888' }}>Image</div>
                            </div>
                          </div>
                          <div style={{ width: 220, background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: 12, marginTop: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                            <img src="https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=120&q=80" alt="img" style={{ width: 38, height: 38, borderRadius: 6, objectFit: 'cover' }} />
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 15 }}>Page 1.jpg</div>
                              <div style={{ fontSize: 13, color: '#888' }}>Image</div>
                            </div>
                          </div>
                        </div>
                        <div style={{ padding: '0 24px 18px 24px' }}>
                          <a
                            href="#"
                            style={{ color: '#1976d2', fontWeight: 500, fontSize: 16, textDecoration: 'underline' }}
                            onClick={e => {
                              e.preventDefault();
                              navigate(`/student/classroom/${code}/assignment/${a.id}`);
                            }}
                          >
                            View details
                          </a>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div style={{ borderBottom: '1px solid #eee', padding: '18px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => setExpandedGradeId(a.id)}>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: 18, marginRight: 12 }}>{a.title}</span>
                      <i className="ni ni-paper-clip" style={{ fontSize: 18, marginRight: 4, color: '#888' }} />
                      <span style={{ fontSize: 15, color: '#888', marginRight: 18 }}>{a.id === 7 ? 3 : a.id === 5 || a.id === 6 || a.id === 8 || a.id === 2 ? 1 : 2}</span>
                      <div style={{ fontSize: 15, color: '#888', marginTop: 2 }}>Due {a.due}</div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 18 }}>{a.id === 8 ? 'Turned in' : a.id === 7 ? '45/50' : a.id === 5 ? '48/50' : a.id === 6 ? '50/50' : a.id === 4 ? '48/50' : a.id === 2 ? '42/50' : '45/50'}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {/* TODO: Add content for other tabs */}
      {showYouTubeModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.15)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 4px 32px #324cdd22', padding: '2rem', minWidth: 340, maxWidth: 400 }}>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 18 }}>Add YouTube Video</div>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>YouTube URL</div>
            <input type="text" value={modalUrl} onChange={e => setModalUrl(e.target.value)} placeholder="Paste YouTube URL here" style={{ width: '100%', borderRadius: 8, border: '1px solid #e0e0e0', padding: '12px', marginBottom: 24 }} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button onClick={() => { setShowYouTubeModal(false); setModalUrl(""); }} style={{ background: '#f7fafd', color: '#222', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => handleAddModalAttachment('youtube', editingAnnouncementId === announcement.id ? announcement.id : null)} style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 600, cursor: 'pointer' }}>Add Video</button>
            </div>
          </div>
        </div>
      )}
      {showDriveModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.15)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 4px 32px #324cdd22', padding: '2rem', minWidth: 340, maxWidth: 400 }}>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 18 }}>Add Google Drive File</div>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Google Drive URL</div>
            <input type="text" value={modalUrl} onChange={e => setModalUrl(e.target.value)} placeholder="Paste Google Drive URL here" style={{ width: '100%', borderRadius: 8, border: '1px solid #e0e0e0', padding: '12px', marginBottom: 24 }} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button onClick={() => { setShowDriveModal(false); setModalUrl(""); }} style={{ background: '#f7fafd', color: '#222', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => handleAddModalAttachment('drive', editingAnnouncementId === announcement.id ? announcement.id : null)} style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 600, cursor: 'pointer' }}>Add File</button>
            </div>
          </div>
        </div>
      )}
      {showLinkModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.15)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 4px 32px #324cdd22', padding: '2rem', minWidth: 340, maxWidth: 400 }}>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 18 }}>Add Link</div>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Link URL</div>
            <input type="text" value={modalUrl} onChange={e => setModalUrl(e.target.value)} placeholder="Paste link URL here" style={{ width: '100%', borderRadius: 8, border: '1px solid #e0e0e0', padding: '12px', marginBottom: 24 }} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button onClick={() => { setShowLinkModal(false); setModalUrl(""); }} style={{ background: '#f7fafd', color: '#222', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => handleAddModalAttachment('link', editingAnnouncementId === announcement.id ? announcement.id : null)} style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 600, cursor: 'pointer' }}>Add Link</button>
            </div>
          </div>
        </div>
      )}
      <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={e => handleFileChange(e, editingAnnouncementId ? editingAnnouncementId : null)} />
      {showStudentSelectModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.15)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 8px 32px rgba(44,62,80,.12)', minWidth: 400, maxWidth: 600, width: '90%', padding: 0 }}>
            <div style={{ borderRadius: 20, background: '#fff', padding: 0 }}>
              <div style={{ border: 'none', padding: '24px 24px 0 24px', fontWeight: 700, fontSize: 18, background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Add Users</span>
                <button onClick={() => setShowStudentSelectModal(false)} style={{ background: 'none', border: 'none', fontSize: 22, color: '#888', cursor: 'pointer' }}>&times;</button>
              </div>
              <div style={{ padding: '0 24px 24px 24px' }}>
                <div style={{ position: 'relative', width: '100%', marginBottom: 18 }}>
                  <i className="fa fa-search" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#b0b7c3', fontSize: 16, pointerEvents: 'none' }} />
                  <input
                    placeholder="Search students..."
                    value={studentSearch}
                    onChange={e => setStudentSearch(e.target.value)}
                    style={{ background: '#f7f8fa', borderRadius: 8, border: '1px solid #e9ecef', fontSize: 15, color: '#232b3b', padding: '8px 14px 8px 40px', boxShadow: '0 1px 2px rgba(44,62,80,0.03)', minWidth: 0, width: '100%' }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontWeight: 600, color: '#222', fontSize: 12 }}>Students ({tempSelectedStudents.length})</span>
                  {(() => {
                    const filtered = classmates.filter(s => !studentSearch || s.name.toLowerCase().includes(studentSearch.toLowerCase()));
                    const allSelected = filtered.length > 0 && filtered.every(s => tempSelectedStudents.includes(s.name));
                    return (
                      <button
                        type="button"
                        style={{ background: 'none', border: 'none', color: '#5e72e4', fontWeight: 500, fontSize: 12, cursor: 'pointer', padding: '1px 6px', margin: 0 }}
                        onClick={() => {
                          if (allSelected) {
                            setTempSelectedStudents(prev => prev.filter(n => !filtered.map(s => s.name).includes(n)));
                          } else {
                            setTempSelectedStudents(prev => Array.from(new Set([...prev, ...filtered.map(s => s.name)])));
                          }
                        }}
                      >
                        {allSelected ? 'Unselect All' : 'Select All'}
                      </button>
                    );
                  })()}
                </div>
                <div style={{ maxHeight: 220, overflowY: 'auto', border: 'none', borderRadius: 12, background: '#f9fafd', padding: '0 8px 0 0', marginBottom: 8 }}>
                  {classmates.filter(s => !studentSearch || s.name.toLowerCase().includes(studentSearch.toLowerCase())).length === 0 ? (
                    <div className="text-center text-muted py-5">No students found</div>
                  ) : (
                    classmates.filter(s => !studentSearch || s.name.toLowerCase().includes(studentSearch.toLowerCase())).map((s) => {
                      const isSelected = tempSelectedStudents.includes(s.name);
                      return (
                        <div
                          key={s.name}
                          style={{ display: 'flex', alignItems: 'center', padding: '6px 10px', borderRadius: 8, marginBottom: 2, cursor: 'pointer', background: isSelected ? '#eaf4fb' : 'transparent' }}
                          onClick={e => {
                            if (e.target.type === 'checkbox') return;
                            if (isSelected) {
                              setTempSelectedStudents(prev => prev.filter(n => n !== s.name));
                            } else {
                              setTempSelectedStudents(prev => [...prev, s.name]);
                            }
                          }}
                        >
                          <img src={getAvatarForUser(s)} alt={s.name} style={{ width: 28, height: 28, borderRadius: '50%', marginRight: 10, objectFit: 'cover', border: '1px solid #e9ecef' }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, fontSize: 14, color: '#2d3748', textTransform: 'none' }}>{s.name}</div>
                            <div style={{ fontSize: 12, color: '#7b8a9b', fontWeight: 400 }}>{s.email || ''}</div>
                          </div>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={e => {
                              if (e.target.checked) {
                                setTempSelectedStudents(prev => [...prev, s.name]);
                              } else {
                                setTempSelectedStudents(prev => prev.filter(n => n !== s.name));
                              }
                            }}
                            style={{ marginLeft: 10, cursor: 'pointer' }}
                            aria-label={`Select ${s.name}`}
                            onClick={e => e.stopPropagation()}
                          />
                        </div>
                      );
                    })
                  )}
                </div>
                {/* Selected students pills in modal */}
                <div style={{ minHeight: 50, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8, alignItems: tempSelectedStudents.length === 0 ? 'center' : 'flex-start', justifyContent: 'center', background: '#f7f8fa', borderRadius: 8, padding: 8, border: '1px solid #e9ecef', marginTop: 12 }}>
                  {tempSelectedStudents.length === 0 ? (
                    <div style={{ width: '100%', height: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#b0b7c3', fontSize: 11, minHeight: 30, textAlign: 'center', gridColumn: '1 / -1', margin: '0 auto' }}>
                      <i className="fa fa-user-plus" style={{ marginBottom: 2 }} />
                      <div style={{ fontSize: 11, fontWeight: 500 }}>No students selected</div>
                    </div>
                  ) : (
                    tempSelectedStudents.map(name => {
                      const s = classmates.find(stu => stu.name === name);
                      return s ? (
                        <span key={name} style={{ display: 'flex', alignItems: 'center', background: '#e9ecef', borderRadius: 9, padding: '1px 6px', fontSize: 10, fontWeight: 600, color: '#2d3748', minHeight: 22 }}>
                          <img src={getAvatarForUser(s)} alt={s.name} style={{ width: 14, height: 14, borderRadius: '50%', marginRight: 4, objectFit: 'cover', border: '1px solid #fff' }} />
                          <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginRight: 5, lineHeight: 1.1 }}>
                            <span style={{ fontWeight: 600, fontSize: 10, color: '#2d3748', textTransform: 'none' }}>{s.name}</span>
                            <span style={{ color: '#7b8a9b', fontWeight: 400, fontSize: 9 }}>{s.email || ''}</span>
                          </span>
                          <span style={{ flex: 1 }} />
                          <i
                            className="fa fa-times-circle"
                            style={{ marginLeft: 2, cursor: 'pointer', color: '#7b8a9b', fontSize: 11 }}
                            onClick={e => { e.stopPropagation(); setTempSelectedStudents(prev => prev.filter(n => n !== name)); }}
                          />
                        </span>
                      ) : null;
                    })
                  )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 18 }}>
                  <button onClick={() => setShowStudentSelectModal(false)} style={{ background: '#f7fafd', color: '#222', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
                  <button onClick={() => { setSelectedAnnouncementStudents(tempSelectedStudents); setShowStudentSelectModal(false); }} style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 600, cursor: 'pointer' }}>Confirm</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showScheduleModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.15)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 4px 32px #324cdd22', padding: '2rem', minWidth: 340, maxWidth: 400 }}>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 18 }}>Schedule Announcement</div>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Select date and time</div>
            <input type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} style={{ width: '100%', borderRadius: 8, border: '1px solid #e0e0e0', padding: '12px', marginBottom: 12 }} />
            <input type="time" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} style={{ width: '100%', borderRadius: 8, border: '1px solid #e0e0e0', padding: '12px', marginBottom: 24 }} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button onClick={() => setShowScheduleModal(false)} style={{ background: '#f7fafd', color: '#222', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
              <button
                onClick={() => {
                  if (!studentAnnouncement.trim()) return;
                  if (!scheduleDate || !scheduleTime) return;
                  const dateTime = new Date(`${scheduleDate}T${scheduleTime}`);
                  const newAnn = {
                    id: Date.now(),
                    title: announcementTitle,
                    content: studentAnnouncement,
                    author: loggedInName,
                    date: dateTime.toISOString(),
                    isPinned: false,
                    reactions: { like: 0, likedBy: [] },
                    comments: [],
                    allowComments: allowComments,
                    attachments: attachments
                  };
                  setScheduledAnnouncements([newAnn, ...scheduledAnnouncements]);
                  setStudentAnnouncement("");
                  setAnnouncementTitle("");
                  setAllowComments(true);
                  setFormExpanded(false);
                  setAttachments([]);
                  setShowScheduleModal(false);
                  setScheduleDate("");
                  setScheduleTime("");
                }}
                style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 600, cursor: 'pointer' }}
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Attachment Preview Modal */}
      <Modal isOpen={previewModalOpen} toggle={() => setPreviewModalOpen(false)} centered size="lg">
        <ModalHeader toggle={() => setPreviewModalOpen(false)}>
          {previewAttachment ? (previewAttachment.name || 'File Preview') : 'Preview'}
        </ModalHeader>
        <ModalBody>
          {previewAttachment && (
            <div>
              {previewAttachment.file && previewAttachment.file.type && previewAttachment.file.type.startsWith('image/') ? (
                <img src={typeof previewAttachment.file === 'string' ? previewAttachment.file : URL.createObjectURL(previewAttachment.file)} alt={previewAttachment.name} style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }} />
              ) : previewAttachment.file && previewAttachment.file.type && previewAttachment.file.type.startsWith('video/') ? (
                <video controls style={{ width: '100%', maxHeight: '600px', borderRadius: '8px' }}>
                  <source src={typeof previewAttachment.file === 'string' ? previewAttachment.file : URL.createObjectURL(previewAttachment.file)} type={previewAttachment.file.type} />
                  Your browser does not support the video tag.
                </video>
              ) : previewAttachment.file && previewAttachment.file.type && previewAttachment.file.type.startsWith('audio/') ? (
                <div id="mp3-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px 15px', background: mp3Backgrounds[mp3BgIndex], borderRadius: '16px', color: 'white', position: 'relative', overflow: 'hidden', transition: 'all 2s cubic-bezier(0.4,0,0.2,1)', boxShadow: isPlaying ? '0 20px 60px rgba(0,0,0,0.4), 0 0 30px rgba(255,255,255,0.1)' : '0 8px 32px rgba(0,0,0,0.2)', maxHeight: '600px' }}>
            <div id="mp3-disk" style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'conic-gradient(from 0deg, #333 0deg, #666 90deg, #333 180deg, #666 270deg, #333 360deg)', border: '6px solid #fff', boxShadow: isPlaying ? '0 8px 32px rgba(0,0,0,0.5), 0 0 15px rgba(255,255,255,0.2)' : '0 6px 24px rgba(0,0,0,0.3)', marginBottom: '20px', position: 'relative', transition: 'all 0.3s ease', zIndex: 2, transform: isPlaying ? 'scale(1.1)' : 'scale(1)', animation: isPlaying ? 'rotate 2s linear infinite' : 'none' }}>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '24px', height: '24px', borderRadius: '50%', background: '#fff', border: '2px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#333' }} />
              </div>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '96px', height: '96px', borderRadius: '50%', background: 'repeating-conic-gradient(from 0deg, transparent 0deg, transparent 2deg, rgba(255,255,255,0.1) 2deg, rgba(255,255,255,0.1) 4deg)' }} />
            </div>
            {/* Audio Visualizer Bars */}
            <div id="audio-visualizer" style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '40px', marginBottom: '15px', opacity: isPlaying ? 1 : 0, transition: 'opacity 0.3s ease', zIndex: 2 }}>
              {[...Array(20)].map((_, i) => (
                <div key={i} className="visualizer-bar" style={{ width: '3px', background: 'rgba(255, 255, 255, 0.8)', borderRadius: '1.5px', height: '8px', transition: 'height 0.1s ease', boxShadow: '0 0 6px 1px rgba(255,255,255,0.3)' }} />
              ))}
            </div>
            {/* Floating Particles */}
            <div id="particles-container" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1, opacity: isPlaying ? 1 : 0, transition: 'opacity 0.5s ease' }}>
              {[...Array(20)].map((_, i) => (
                <div key={i} className="particle" style={{ position: 'absolute', width: `${Math.random() * 8 + 4}px`, height: `${Math.random() * 8 + 4}px`, background: 'rgba(255, 255, 255, 0.7)', borderRadius: '50%', left: `${Math.random() * 90 + 5}%`, top: `${Math.random() * 80 + 10}%`, boxShadow: '0 0 12px 2px rgba(255,255,255,0.3)', animation: isPlaying ? `float ${3 + Math.random() * 4}s ease-in-out infinite` : 'none', animationDelay: `${Math.random() * 2}s`, transform: `rotate(${Math.random() * 360}deg)` }} />
              ))}
            </div>
            {/* Audio Player */}
            <div style={{ width: '100%', maxWidth: '500px', zIndex: 2, position: 'relative' }}>
              <audio ref={audioRef} id="mp3-player" controls src={audioUrl || ''} style={{ width: '100%', borderRadius: '20px' }}>
                <source src={audioUrl || ''} type={previewAttachment?.file?.type || 'audio/mp3'} />
                Your browser does not support the audio tag.
              </audio>
            </div>
            <div style={{ marginTop: '6px', textAlign: 'center', background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', padding: '8px 12px', borderRadius: '12px', boxShadow: '0 6px 24px rgba(0,0,0,0.1)', width: '100%', maxWidth: '500px', fontWeight: 500, position: 'relative', zIndex: 2, transition: 'all 0.3s ease' }}>
              <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transition: 'all 2s cubic-bezier(0.4,0,0.2,1)' }}>
                <circle cx="24" cy="24" r="24" fill="#43a047" />
                <path d="M32 12V30.5C32 33.5376 29.5376 36 26.5 36C23.4624 36 21 33.5376 21 30.5C21 27.4624 23.4624 25 26.5 25C27.8807 25 29.0784 25.3358 29.5858 25.8787C29.8358 26.1287 30 26.4886 30 26.8787V16H18V30.5C18 33.5376 15.5376 36 12.5 36C9.46243 36 7 33.5376 7 30.5C7 27.4624 9.46243 25 12.5 25C13.8807 25 15.0784 25.3358 15.5858 25.8787C15.8358 26.1287 16 26.4886 16 26.8787V12C16 11.4477 16.4477 11 17 11H31C31.5523 11 32 11.4477 32 12Z" fill="white"/>
              </svg>
              <div>{previewAttachment.name}</div>
              <div style={{ fontSize: '13px', opacity: '0.8', color: '#7f8c8d' }}>MP3 Audio File</div>
            </div>
            <style>{`
              @keyframes rotate {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
              @keyframes float {
                0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
                50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
              }
              @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
              }
              #mp3-disk:hover {
                transform: scale(1.1);
                box-shadow: 0 12px 48px rgba(0,0,0,0.4);
              }
              .particle {
                animation-delay: calc(var(--i) * -0.5s);
              }
              .visualizer-bar {
                animation: visualizerPulse 0.5s ease-in-out infinite alternate;
              }
              @keyframes visualizerPulse {
                from { height: 10px; }
                to { height: 40px; }
              }
              * { transition: all 0.3s ease; }
            `}</style>
            {/* Subtle Animated Wave at Bottom */}
            <div style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: '80px', zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
              <svg width="100%" height="100%" viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
                <path ref={wavePathRef} d="M0,40 Q360,80 720,40 T1440,40 V80 H0 Z" fill="rgba(255,255,255,0.10)" />
              </svg>
            </div>
          </div>
        ) : previewAttachment.file && previewAttachment.file.type === 'application/pdf' ? (
          <iframe src={typeof previewAttachment.file === 'string' ? previewAttachment.file : URL.createObjectURL(previewAttachment.file)} style={{ width: '100%', height: '600px', border: 'none', borderRadius: '8px' }} title={previewAttachment.name} />
        ) : previewText ? (
          <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '14px', whiteSpace: 'pre-wrap', maxHeight: '500px', overflowY: 'auto' }}>{previewText}</div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <i className="ni ni-single-copy-04" style={{ fontSize: '48px', color: '#ccc', marginBottom: '16px' }} />
            <p style={{ color: '#666' }}>Preview not available for this file type.</p>
            {previewAttachment.file && (
              <Button color="primary" onClick={() => {
                const url = typeof previewAttachment.file === 'string' ? previewAttachment.file : URL.createObjectURL(previewAttachment.file);
                const a = document.createElement('a');
                a.href = url;
                a.download = previewAttachment.name;
                a.click();
                if (typeof previewAttachment.file !== 'string') URL.revokeObjectURL(url);
              }}>
                Download File
              </Button>
            )}
          </div>
        )}
      </div>
    )}
  </ModalBody>
</Modal>
    </div>
  );
};

export default ClassroomDetailStudent; 