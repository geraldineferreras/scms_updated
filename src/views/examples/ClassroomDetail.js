import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardBody,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Tooltip,
  Badge,
  Table,
  Input,
  Form,
  FormGroup,
  Label,
  ListGroup,
  ListGroupItem,
  Alert,
  ModalFooter,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  InputGroup,
  InputGroupText,
  ButtonGroup
} from "reactstrap";
import classnames from "classnames";
import Header from "../../components/Headers/Header";
import "./Classroom.css";
import { FaEllipsisV, FaClipboardList, FaQuestionCircle, FaBook, FaRedo, FaFolder, FaPlus, FaPaperclip, FaSmile } from 'react-icons/fa';
import userDefault from '../../assets/img/theme/user-default.svg';

const themes = [
  { name: "Blue Gradient", value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { name: "Purple Gradient", value: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
  { name: "Green Gradient", value: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" },
  { name: "Orange Gradient", value: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" },
  { name: "Pink Gradient", value: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)" },
  { name: "Aqua Gradient", value: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
  { name: "Sunset", value: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)" },
  { name: "Deep Blue", value: "linear-gradient(135deg, #232526 0%, #414345 100%)" },
  { name: "Night Sky", value: "url('https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80')" },
  { name: "Books Image", value: "url('https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80')" },
  { name: "Mountains", value: "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80')" },
  { name: "Classroom", value: "url('https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&q=80')" },
  { name: "Abstract", value: "url('https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=600&q=80')" },
  { name: "Notebook", value: "url('https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80')" }
];

// Sample data for tabs
const sampleAnnouncements = [
  {
    id: 1,
    title: "Welcome to the new semester!",
    content: "I'm excited to start this journey with all of you. Let's make this semester productive and engaging.",
    author: "Prof. Smith",
    date: "2024-01-15",
    isPinned: true
  },
  {
    id: 2,
    title: "Assignment #1 Due Date Extended",
    content: "Due to technical difficulties, the deadline for Assignment #1 has been extended to Friday, January 20th.",
    author: "Prof. Smith",
    date: "2024-01-14",
    isPinned: false
  },
  {
    id: 3,
    title: "Class Schedule Update",
    content: "Starting next week, we'll have an additional lab session every Wednesday from 2-4 PM.",
    author: "Prof. Smith",
    date: "2024-01-13",
    isPinned: false
  }
];

const sampleAssignments = [
  {
    id: 1,
    title: "Assignment #1: Basic Concepts",
    type: "Assignment",
    dueDate: "2024-01-20",
    points: 100,
    status: "active"
  },
  {
    id: 2,
    title: "Quiz #1: Introduction",
    type: "Quiz",
    dueDate: "2024-01-25",
    points: 50,
    status: "active"
  },
  {
    id: 3,
    title: "Project Proposal",
    type: "Project",
    dueDate: "2024-02-01",
    points: 200,
    status: "active"
  }
];

const sampleStudents = [
  { id: 1, name: "John Doe", email: "john.doe@student.edu", role: "Student", joinedDate: "2024-01-10" },
  { id: 2, name: "Jane Smith", email: "jane.smith@student.edu", role: "Student", joinedDate: "2024-01-10" },
  { id: 3, name: "Mike Johnson", email: "mike.johnson@student.edu", role: "Student", joinedDate: "2024-01-11" },
  { id: 4, name: "Sarah Wilson", email: "sarah.wilson@student.edu", role: "Student", joinedDate: "2024-01-12" },
  { id: 5, name: "David Brown", email: "david.brown@student.edu", role: "Student", joinedDate: "2024-01-13" }
];

const sampleGrades = [
  { studentId: 1, studentName: "John Doe", assignment1: 85, quiz1: 90, project1: 88, average: 87.7 },
  { studentId: 2, studentName: "Jane Smith", assignment1: 92, quiz1: 88, project1: 95, average: 91.7 },
  { studentId: 3, studentName: "Mike Johnson", assignment1: 78, quiz1: 85, project1: 82, average: 81.7 },
  { studentId: 4, studentName: "Sarah Wilson", assignment1: 95, quiz1: 92, project1: 90, average: 92.3 },
  { studentId: 5, studentName: "David Brown", assignment1: 88, quiz1: 90, project1: 87, average: 88.3 }
];

const avatarUrls = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=150&h=150&fit=crop&crop=face"
];

const getRandomAvatar = (userId) => {
  if (userId === undefined || userId === null) return userDefault;
  const idString = typeof userId === 'string' || typeof userId === 'number' ? userId.toString() : '0';
  const index = Math.abs(idString.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % avatarUrls.length;
  return avatarUrls[index];
};

const getAvatarForUser = (user) => {
  if (!user) return userDefault;
  if (user.profile_pic && user.profile_pic !== userDefault) {
    return user.profile_pic;
  }
  if (user.id) {
    return getRandomAvatar(user.id);
  }
  return userDefault;
};

const findUserByName = (name) => {
  if (!name) return null;
  const allUsers = [...sampleStudents, { id: 'teacher', name: 'Prof. Smith', role: 'teacher' }];
  return allUsers.find(u => u.name?.toLowerCase() === name.toLowerCase() || u.full_name?.toLowerCase() === name.toLowerCase());
};

// Helper to get file type, icon, and preview
const getFileTypeIconOrPreview = (att) => {
  // Handle different attachment types
  if (!att) {
    return { preview: <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="40" rx="6" fill="#fff" stroke="#90A4AE" strokeWidth="2"/><path d="M8 8h16v24H8z" fill="#fff"/><text x="16" y="28" textAnchor="middle" fontSize="10" fill="#90A4AE" fontWeight="bold">FILE</text></svg>, type: 'FILE', color: '#90A4AE' };
  }

  // Handle link attachments
  if (att.type === "Link" && att.url) {
    return { preview: <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="40" rx="6" fill="#fff" stroke="#1976D2" strokeWidth="2"/><path d="M8 8h16v24H8z" fill="#fff"/><text x="16" y="28" textAnchor="middle" fontSize="10" fill="#1976D2" fontWeight="bold">LINK</text></svg>, type: 'LINK', color: '#1976D2' };
  }

  // Handle YouTube attachments
  if (att.type === "YouTube" && att.url) {
    return { preview: <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="40" rx="6" fill="#fff" stroke="#FF0000" strokeWidth="2"/><path d="M8 8h16v24H8z" fill="#fff"/><text x="16" y="28" textAnchor="middle" fontSize="10" fill="#FF0000" fontWeight="bold">YT</text></svg>, type: 'YOUTUBE', color: '#FF0000' };
  }

  // Handle file attachments
  const fileName = att.name;
  if (!fileName || typeof fileName !== 'string') {
    return { preview: <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="40" rx="6" fill="#fff" stroke="#90A4AE" strokeWidth="2"/><path d="M8 8h16v24H8z" fill="#fff"/><text x="16" y="28" textAnchor="middle" fontSize="10" fill="#90A4AE" fontWeight="bold">FILE</text></svg>, type: 'FILE', color: '#90A4AE' };
  }

  const ext = fileName.split('.').pop().toLowerCase();
  const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];

  // Microsoft Word
  const wordExts = ['doc', 'docx', 'dot', 'dotx', 'docm', 'dotm'];
  if (wordExts.includes(ext)) {
    return { preview: <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="40" rx="6" fill="#fff" stroke="#1976D2" strokeWidth="2"/><path d="M8 8h16v24H8z" fill="#fff"/><text x="16" y="28" textAnchor="middle" fontSize="10" fill="#1976D2" fontWeight="bold">WORD</text></svg>, type: 'WORD', color: '#1976D2' };
  }
  // Microsoft Excel (including CSV)
  const excelExts = ['xls', 'xlsx', 'xlsm', 'xlsb', 'xlt', 'xltx', 'xltm', 'csv'];
  if (excelExts.includes(ext)) {
    return { preview: <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="40" rx="6" fill="#fff" stroke="#388E3C" strokeWidth="2"/><path d="M8 8h16v24H8z" fill="#fff"/><text x="16" y="28" textAnchor="middle" fontSize="10" fill="#388E3C" fontWeight="bold">EXCEL</text></svg>, type: 'EXCEL', color: '#388E3C' };
  }
  // Microsoft PowerPoint
  const pptExts = ['ppt', 'pptx', 'pps', 'ppsx', 'pptm', 'potx', 'potm', 'ppsm'];
  if (pptExts.includes(ext)) {
    return { preview: <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="40" rx="6" fill="#fff" stroke="#FF9800" strokeWidth="2"/><path d="M8 8h16v24H8z" fill="#fff"/><text x="16" y="28" textAnchor="middle" fontSize="10" fill="#FF9800" fontWeight="bold">PPT</text></svg>, type: 'PPT', color: '#FF9800' };
  }
  // TXT
  if (ext === 'txt') {
    return { preview: <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="40" rx="6" fill="#fff" stroke="#607d8b" strokeWidth="2"/><path d="M8 8h16v24H8z" fill="#fff"/><text x="16" y="28" textAnchor="middle" fontSize="10" fill="#607d8b" fontWeight="bold">TXT</text></svg>, type: 'TXT', color: '#607d8b' };
  }

  if (imageTypes.includes(ext) && att.file) {
    const url = URL.createObjectURL(att.file);
    return { preview: <img src={url} alt={fileName} style={{ width: 32, height: 40, objectFit: 'cover', borderRadius: 6, border: '1px solid #e9ecef' }} />, type: ext.toUpperCase(), color: '#90A4AE' };
  }
  if (ext === 'mp4') return { preview: <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="40" rx="6" fill="#fff" stroke="#8e24aa" strokeWidth="2"/><polygon points="13,14 25,20 13,26" fill="#8e24aa"/><text x="16" y="36" textAnchor="middle" fontSize="10" fill="#8e24aa" fontWeight="bold">MP4</text></svg>, type: 'MP4', color: '#8e24aa' };
  if (ext === 'mp3') return { preview: <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="40" rx="6" fill="#fff" stroke="#43a047" strokeWidth="2"/><circle cx="16" cy="20" r="7" fill="#43a047"/><rect x="22" y="13" width="3" height="14" rx="1.5" fill="#43a047"/><text x="16" y="36" textAnchor="middle" fontSize="10" fill="#43a047" fontWeight="bold">MP3</text></svg>, type: 'MP3', color: '#43a047' };
  if (ext === 'pdf') return { preview: <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="40" rx="6" fill="#fff" stroke="#F44336" strokeWidth="2"/><path d="M8 8h16v24H8z" fill="#fff"/><text x="16" y="28" textAnchor="middle" fontSize="10" fill="#F44336" fontWeight="bold">PDF</text></svg>, type: 'PDF', color: '#F44336' };
  return { preview: <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="40" rx="6" fill="#fff" stroke="#90A4AE" strokeWidth="2"/><path d="M8 8h16v24H8z" fill="#fff"/><text x="16" y="28" textAnchor="middle" fontSize="10" fill="#90A4AE" fontWeight="bold">FILE</text></svg>, type: ext.toUpperCase(), color: '#90A4AE' };
};

const ClassroomDetail = () => {
  const { code } = useParams();
  const [activeTab, setActiveTab] = useState("stream");
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [tooltipHover, setTooltipHover] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(() => {
    const key = `classroom_theme_${code}`;
    return localStorage.getItem(key) || themes[0].value;
  });
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [announcements, setAnnouncements] = useState(sampleAnnouncements);
  const fileInputRef = useRef();
  const [customTheme, setCustomTheme] = useState(() => {
    const key = `classroom_custom_theme_${code}`;
    return localStorage.getItem(key) || null;
  });
  const [uploadStatus, setUploadStatus] = useState('');

  const MAX_IMAGE_WIDTH = 800;
  const MAX_IMAGE_HEIGHT = 600;
  const MAX_IMAGE_SIZE = 1.5 * 1024 * 1024; // 1.5MB

  // Get class info from localStorage (set by Classroom.js)
  const [classInfo, setClassInfo] = useState(null);

  // Add new state for modals and forms
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showAddGradeModal, setShowAddGradeModal] = useState(false);
  const [assignments, setAssignments] = useState(sampleAssignments);
  const [students, setStudents] = useState(sampleStudents);
  const [grades, setGrades] = useState(sampleGrades);

  const [createForm, setCreateForm] = useState({
    type: '',
    title: '',
    dueDate: '',
    points: ''
  });
  const [inviteForm, setInviteForm] = useState({
    name: '',
    email: ''
  });
  const [gradeForm, setGradeForm] = useState({
    studentId: '',
    work: '',
    grade: ''
  });

  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const [audienceDropdownOpen, setAudienceDropdownOpen] = useState(false);
  const [addDropdownOpen, setAddDropdownOpen] = useState(false);
  const [postDropdownOpen, setPostDropdownOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState('2024-2025');
  const [selectedAudience, setSelectedAudience] = useState('All students');
  const years = ['2023-2024', '2024-2025', '2025-2026'];
  const audiences = ['All students'];

  const [attachments, setAttachments] = useState([]);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showYouTubeModal, setShowYouTubeModal] = useState(false);
  const [linkInput, setLinkInput] = useState("");
  const [youtubeInput, setYouTubeInput] = useState("");
  const [linkError, setLinkError] = useState("");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [drafts, setDrafts] = useState([]);
  const [scheduledPosts, setScheduledPosts] = useState([]);

  // Topic management state
  const [topics, setTopics] = useState([{ id: 1, name: 'Misc' }]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [topicMenuOpen, setTopicMenuOpen] = useState(null);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [topicInput, setTopicInput] = useState("");
  const [topicEditId, setTopicEditId] = useState(null);
  const [topicEditInput, setTopicEditInput] = useState("");
  const [classwork, setClasswork] = useState([]);
  // Modal state for each create type
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showReuseModal, setShowReuseModal] = useState(false);
  // Form state for each create type
  const [assignmentForm, setAssignmentForm] = useState({ title: '', instructions: '', points: 100, dueDate: '', topic: '', attachments: [] });
  const assignmentFileInputRef = useRef();
  const [quizForm, setQuizForm] = useState({ title: '', instructions: '', points: 10, dueDate: '', topic: '', attachments: [] });
  const quizFileInputRef = useRef();
  const [questionForm, setQuestionForm] = useState({ question: '', options: ['', ''], dueDate: '', topic: '', attachments: [] });
  const questionFileInputRef = useRef();
  const [materialForm, setMaterialForm] = useState({ title: '', description: '', topic: '', attachments: [] });
  const materialFileInputRef = useRef();

  const [announcementDropdowns, setAnnouncementDropdowns] = useState({});
  const [editingAnnouncementId, setEditingAnnouncementId] = useState(null);
  const [editAnnouncementData, setEditAnnouncementData] = useState({ title: '', content: '' });

  const [formExpanded, setFormExpanded] = useState(false);

  const [attachmentDropdownOpen, setAttachmentDropdownOpen] = useState(false);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const emojiPickerRef = useRef();

  // 1. Add state for preview modal and attachment
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewAttachment, setPreviewAttachment] = useState(null);
  const [previewText, setPreviewText] = useState("");

  // Add state for mp3 playing
  const [mp3Playing, setMp3Playing] = useState(false);

  // 1. Add state for the new announcement title
  const [newAnnouncementTitle, setNewAnnouncementTitle] = useState("");

  // 1. Add state for allowComments in the creation form
  const [allowComments, setAllowComments] = useState(true);

  // 3. In handlePostAnnouncement, save both title and content
  const handlePostAnnouncement = (e) => {
    e.preventDefault();
    if ((newAnnouncement && newAnnouncement.trim().length > 0) || attachments.length > 0) {
      const announcement = {
        id: Date.now(),
        title: newAnnouncementTitle,
        content: newAnnouncement,
        author: "Prof. Smith",
        date: new Date().toISOString().split('T')[0],
        isPinned: false,
        attachments,
        year: selectedYear,
        audience: selectedAudience,
        originalIndex: announcements.length,
        comments: [],
        allowComments,
      };
      setAnnouncements([announcement, ...announcements]);
      setNewAnnouncement("");
      setNewAnnouncementTitle("");
      setAttachments([]);
    }
  };

  // 3. Add handler to post a comment
  const handlePostComment = (announcementId) => {
    const comment = commentInputs[announcementId]?.trim();
    if (!comment) return;
    setAnnouncements(prev => prev.map(a =>
      a.id === announcementId
        ? { ...a, comments: [...(a.comments || []), { text: comment, author: "Prof. Smith", date: new Date().toISOString().split('T')[0] }] }
        : a
    ));
    setCommentInputs(inputs => ({ ...inputs, [announcementId]: "" }));
  };

  // 2. Add a function to handle preview open
  const handlePreviewAttachment = async (att) => {
    setPreviewAttachment(att);
    setPreviewText("");
    setPreviewModalOpen(true);
    // If TXT or CSV, read as text
    const ext = att.name ? att.name.split('.').pop().toLowerCase() : '';
    if ((ext === 'txt' || ext === 'csv') && att.file) {
      const text = await att.file.text();
      setPreviewText(text);
    }
  };

  useEffect(() => {
    const classes = JSON.parse(localStorage.getItem("teacherClasses")) || [];
    const foundClass = classes.find(cls => cls.code === code);
    setClassInfo(foundClass);
  }, [code]);

  useEffect(() => {
    if (!emojiPickerOpen) return;
    function handleClickOutside(event) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [emojiPickerOpen]);

  const handleCopyCode = () => {
    if (classInfo) {
      navigator.clipboard.writeText(classInfo.code);
      setCopied(true);
      setTooltipHover(true);
      setTimeout(() => {
        setCopied(false);
        setTooltipHover(false);
      }, 1200);
    }
  };

  const handleSelectTheme = (themeValue) => {
    setSelectedTheme(themeValue);
    localStorage.setItem(`classroom_theme_${code}`, themeValue);
    setShowThemeModal(false);
  };

  const handleUploadPhoto = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    const img = new window.Image();
    const reader = new FileReader();
    reader.onload = function (event) {
      img.onload = function () {
        let width = img.width;
        let height = img.height;
        if (width > MAX_IMAGE_WIDTH || height > MAX_IMAGE_HEIGHT) {
          const aspect = width / height;
          if (width > height) {
            width = MAX_IMAGE_WIDTH;
            height = Math.round(width / aspect);
          } else {
            height = MAX_IMAGE_HEIGHT;
            width = Math.round(height * aspect);
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        if (dataUrl.length > MAX_IMAGE_SIZE * 1.37) {
          setUploadStatus('Image is too large after compression. Please choose a smaller image.');
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }
        setCustomTheme(dataUrl);
        setSelectedTheme(dataUrl);
        localStorage.setItem(`classroom_custom_theme_${code}`, dataUrl);
        localStorage.setItem(`classroom_theme_${code}`, dataUrl);
        setUploadStatus('Photo uploaded and compressed successfully!');
        if (fileInputRef.current) fileInputRef.current.value = "";
      };
      img.onerror = function () {
        setUploadStatus('Failed to load image.');
        if (fileInputRef.current) fileInputRef.current.value = "";
      };
      img.src = event.target.result;
    };
    reader.onerror = function () {
      setUploadStatus('Error reading file.');
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsDataURL(file);
  };

  const handleAddAttachment = (type) => {
    if (type === "Google Drive") {
      alert("Google Drive integration coming soon!");
    } else if (type === "Link") {
      setShowLinkModal(true);
    } else if (type === "File") {
      fileInputRef.current.click();
    } else if (type === "YouTube") {
      setShowYouTubeModal(true);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setAttachments(prev => [...prev, ...files.map(file => ({ name: file.name, file }))]);
    }
    e.target.value = "";
  };

  const handleAddLink = () => {
    let url = linkInput.trim();
    setLinkError("");
    if (!url) {
      setLinkError("Please enter a link URL");
      return;
    }

    // If it already looks like a valid URL, keep as is
    let formatted = url;
    let valid = false;
    // Try as-is
    try {
      const urlObj = new URL(formatted);
      if (urlObj.protocol && urlObj.hostname) valid = true;
    } catch {}

    // If not valid, try to autoformat
    if (!valid) {
      // Remove spaces and illegal chars
      if (/[^a-zA-Z0-9.-]/.test(url)) {
        setLinkError("Please enter a valid URL or word (no spaces or special characters)");
        return;
      }
      formatted = `https://${url}.com`;
      try {
        const urlObj = new URL(formatted);
        if (urlObj.protocol && urlObj.hostname) valid = true;
      } catch {}
    }

    if (!valid) {
      setLinkError("Could not autoformat to a valid link. Please check your input.");
      return;
    }

    setAttachments([...attachments, { type: "Link", url: formatted }]);
      setLinkInput("");
    setLinkError("");
      setShowLinkModal(false);
  };

  const handleAddYouTube = () => {
    if (youtubeInput.trim()) {
      setAttachments([...attachments, { type: "YouTube", url: youtubeInput }]);
      setYouTubeInput("");
      setShowYouTubeModal(false);
    }
  };

  const handleRemoveAttachment = (idx) => {
    setAttachments(attachments.filter((_, i) => i !== idx));
  };

  const handleSchedule = (e) => {
    e.preventDefault();
    if (newAnnouncement.trim() && scheduleDate && scheduleTime) {
      setScheduledPosts([
        ...scheduledPosts,
        {
          text: newAnnouncement,
          attachments,
          year: selectedYear,
          audience: selectedAudience,
          schedule: `${scheduleDate} ${scheduleTime}`
        }
      ]);
      setShowScheduleModal(false);
      setNewAnnouncement("");
      setAttachments([]);
      setScheduleDate("");
      setScheduleTime("");
      alert("Post scheduled!");
    }
  };

  const handleSaveDraft = () => {
    if (newAnnouncement.trim()) {
      setDrafts([
        ...drafts,
        {
          text: newAnnouncement,
          attachments,
          year: selectedYear,
          audience: selectedAudience
        }
      ]);
      setNewAnnouncement("");
      setAttachments([]);
      alert("Draft saved!");
    }
  };

  const handleCreateChange = e => setCreateForm({ ...createForm, [e.target.name]: e.target.value });
  const handleInviteChange = e => setInviteForm({ ...inviteForm, [e.target.name]: e.target.value });
  const handleGradeChange = e => setGradeForm({ ...gradeForm, [e.target.name]: e.target.value });

  const handleCreateSubmit = e => {
    e.preventDefault();
    if (createForm.type && createForm.title && createForm.dueDate && createForm.points) {
      setAssignments([...assignments, { id: Date.now(), ...createForm }]);
      setShowCreateModal(false);
      setCreateForm({ type: '', title: '', dueDate: '', points: '' });
    }
  };
  const handleInviteSubmit = e => {
    e.preventDefault();
    if (inviteForm.name && inviteForm.email) {
      setStudents([
        ...students,
        {
          id: Date.now(),
          name: inviteForm.name,
          email: inviteForm.email,
          role: 'Student',
          joinedDate: new Date().toISOString().split('T')[0]
        }
      ]);
      setShowInviteModal(false);
      setInviteForm({ name: '', email: '' });
    }
  };
  const handleAddGradeSubmit = e => {
    e.preventDefault();
    if (gradeForm.studentId && gradeForm.work && gradeForm.grade) {
      const student = students.find(s => String(s.id) === gradeForm.studentId);
      const workKey = gradeForm.work;
      let updated = false;
      const newGrades = grades.map(g => {
        if (String(g.studentId) === gradeForm.studentId) {
          updated = true;
          const updatedGrade = { ...g, [workKey]: Number(gradeForm.grade) };
          // Recalculate average
          const works = ['assignment1', 'quiz1', 'project1'];
          const sum = works.reduce((acc, key) => acc + (updatedGrade[key] || 0), 0);
          updatedGrade.average = sum / works.length;
          return updatedGrade;
        }
        return g;
      });
      if (!updated && student) {
        // New grade entry for student
        const newGrade = {
          studentId: student.id,
          studentName: student.name,
          assignment1: 0,
          quiz1: 0,
          project1: 0,
          [workKey]: Number(gradeForm.grade)
        };
        const works = ['assignment1', 'quiz1', 'project1'];
        const sum = works.reduce((acc, key) => acc + (newGrade[key] || 0), 0);
        newGrade.average = sum / works.length;
        newGrades.push(newGrade);
      }
      setGrades(newGrades);
      setShowAddGradeModal(false);
      setGradeForm({ studentId: '', work: '', grade: '' });
    }
  };

  // Topic handlers
  const handleAddTopic = () => {
    if (topicInput.trim()) {
      setTopics([{ id: Date.now(), name: topicInput }, ...topics]);
      setTopicInput("");
      setShowTopicModal(false);
    }
  };
  const handleDeleteTopic = (id) => {
    setTopics(topics.filter(t => t.id !== id));
    if (selectedTopic === id) setSelectedTopic(null);
  };
  const handleRenameTopic = (id) => {
    setTopics(topics.map(t => t.id === id ? { ...t, name: topicEditInput } : t));
    setTopicEditId(null);
    setTopicEditInput("");
  };
  const handleMoveTopic = (id, dir) => {
    const idx = topics.findIndex(t => t.id === id);
    if (idx < 0) return;
    const newTopics = [...topics];
    if (dir === 'up' && idx > 0) {
      [newTopics[idx - 1], newTopics[idx]] = [newTopics[idx], newTopics[idx - 1]];
    } else if (dir === 'down' && idx < newTopics.length - 1) {
      [newTopics[idx + 1], newTopics[idx]] = [newTopics[idx], newTopics[idx + 1]];
    }
    setTopics(newTopics);
  };
  // Assignment modal handlers
  const handleAssignmentChange = e => setAssignmentForm({ ...assignmentForm, [e.target.name]: e.target.value });
  const handleAssignmentFile = e => {
    const file = e.target.files[0];
    if (file) setAssignmentForm({ ...assignmentForm, attachments: [...assignmentForm.attachments, { name: file.name, file }] });
    e.target.value = "";
  };
  const handleRemoveAssignmentAttachment = idx => setAssignmentForm({ ...assignmentForm, attachments: assignmentForm.attachments.filter((_, i) => i !== idx) });
  const handleAssignmentSubmit = e => {
    e.preventDefault();
    setClasswork([...classwork, { id: Date.now(), type: 'Assignment', ...assignmentForm }]);
    setShowAssignmentModal(false);
    setAssignmentForm({ title: '', instructions: '', points: 100, dueDate: '', topic: '', attachments: [] });
  };

  // Quiz handlers
  const handleQuizChange = e => setQuizForm({ ...quizForm, [e.target.name]: e.target.value });
  const handleQuizFile = e => {
    const file = e.target.files[0];
    if (file) setQuizForm({ ...quizForm, attachments: [...quizForm.attachments, { name: file.name, file }] });
    e.target.value = "";
  };
  const handleRemoveQuizAttachment = idx => setQuizForm({ ...quizForm, attachments: quizForm.attachments.filter((_, i) => i !== idx) });
  const handleQuizSubmit = e => {
    e.preventDefault();
    setClasswork([...classwork, { id: Date.now(), type: 'Quiz', ...quizForm }]);
    setShowQuizModal(false);
    setQuizForm({ title: '', instructions: '', points: 10, dueDate: '', topic: '', attachments: [] });
  };

  // Question handlers
  const handleQuestionChange = e => setQuestionForm({ ...questionForm, [e.target.name]: e.target.value });
  const handleQuestionOptionChange = (idx, val) => setQuestionForm({ ...questionForm, options: questionForm.options.map((o, i) => i === idx ? val : o) });
  const handleAddQuestionOption = () => setQuestionForm({ ...questionForm, options: [...questionForm.options, ''] });
  const handleRemoveQuestionOption = idx => setQuestionForm({ ...questionForm, options: questionForm.options.filter((_, i) => i !== idx) });
  const handleQuestionFile = e => {
    const file = e.target.files[0];
    if (file) setQuestionForm({ ...questionForm, attachments: [...questionForm.attachments, { name: file.name, file }] });
    e.target.value = "";
  };
  const handleRemoveQuestionAttachment = idx => setQuestionForm({ ...questionForm, attachments: questionForm.attachments.filter((_, i) => i !== idx) });
  const handleQuestionSubmit = e => {
    e.preventDefault();
    setClasswork([...classwork, { id: Date.now(), type: 'Question', ...questionForm }]);
    setShowQuestionModal(false);
    setQuestionForm({ question: '', options: ['', ''], dueDate: '', topic: '', attachments: [] });
  };

  // Material handlers
  const handleMaterialChange = e => setMaterialForm({ ...materialForm, [e.target.name]: e.target.value });
  const handleMaterialFile = e => {
    const file = e.target.files[0];
    if (file) setMaterialForm({ ...materialForm, attachments: [...materialForm.attachments, { name: file.name, file }] });
    e.target.value = "";
  };
  const handleRemoveMaterialAttachment = idx => setMaterialForm({ ...materialForm, attachments: materialForm.attachments.filter((_, i) => i !== idx) });
  const handleMaterialSubmit = e => {
    e.preventDefault();
    setClasswork([...classwork, { id: Date.now(), type: 'Material', ...materialForm }]);
    setShowMaterialModal(false);
    setMaterialForm({ title: '', description: '', topic: '', attachments: [] });
  };

  // Reuse post handler
  const handleReusePost = item => {
    setClasswork([...classwork, { ...item, id: Date.now() }]);
    setShowReuseModal(false);
  };

  // Modal header style helper
  const modalHeaderStyle = (color) => ({
    background: color,
    color: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: '1.5rem 1.5rem 1rem',
    display: 'flex',
    alignItems: 'center',
    gap: 12
  });
  const modalBodyStyle = {
    background: 'linear-gradient(135deg, #f8fafc 0%, #e9ecef 100%)',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    padding: '1.5rem',
  };
  const iconStyle = {
    fontSize: 28,
    marginRight: 8,
    opacity: 0.85
  };

  const handleDropdownToggle = (id) => {
    setAnnouncementDropdowns((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleEditAnnouncement = (id) => {
    const ann = announcements.find(a => a.id === id);
    setEditingAnnouncementId(id);
    setEditAnnouncementData({ 
      title: ann.title, 
      content: ann.content, 
      attachments: ann.attachments ? [...ann.attachments] : [],
      allowComments: ann.allowComments,
    });
  };

  const handleEditAnnouncementChange = (e) => {
    const { name, value } = e.target;
    setEditAnnouncementData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEditAnnouncement = (id) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { 
      ...a, 
      title: editAnnouncementData.title, 
      content: editAnnouncementData.content,
      attachments: editAnnouncementData.attachments || [],
      allowComments: editAnnouncementData.allowComments !== false
    } : a));
    setEditingAnnouncementId(null);
    setEditAnnouncementData({ title: '', content: '', attachments: [], allowComments: true });
  };

  const handleCancelEditAnnouncement = () => {
    setEditingAnnouncementId(null);
    setEditAnnouncementData({ title: '', content: '', attachments: [], allowComments: true });
  };

  const handleDeleteAnnouncement = (id) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  const handleCancelPost = (e) => {
    if (e) e.preventDefault();
    setNewAnnouncement("");
    setAttachments([]);
  };

  // Add handler to pin/unpin an announcement
  const handlePinAnnouncement = (id) => {
    setAnnouncements(prev => {
      // Add originalIndex to any missing (for legacy announcements)
      let withIndex = prev.map((a, i) => a.originalIndex === undefined ? { ...a, originalIndex: i } : a);
      const updated = withIndex.map(a => a.id === id ? { ...a, isPinned: !a.isPinned } : a);
      const pinned = updated.filter(a => a.isPinned);
      const unpinned = updated.filter(a => !a.isPinned).sort((a, b) => a.originalIndex - b.originalIndex);
      return [...pinned, ...unpinned];
    });
  };

  // 1. Add state for comment input (per announcement)
  const [commentInputs, setCommentInputs] = useState({});

  // 1. Add state for editing comments
  const [editingComment, setEditingComment] = useState({}); // { [announcementId]: commentIdx }
  const [editingCommentText, setEditingCommentText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState({}); // { [announcementId]: bool }
  const emojiList = ["😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", "😋", "😎", "😍", "😘", "🥰", "😗", "😙", "😚", "🙂", "🤗", "🤩", "🤔", "🤨", "😐", "😑", "😶", "🙄", "😏", "😣", "😥", "😮", "🤐", "😯", "😪", "😫", "🥱", "😴", "😌", "😛", "😜", "😝", "🤤", "😒", "😓", "😔", "😕", "🙃", "🤑", "😲", "☹️", "🙁", "😖", "😞", "😟", "😤", "😢", "😭", "😦", "😧", "😨", "😩", "🤯", "😬", "😰", "😱", "🥵", "🥶", "😳", "🤪", "😵", "😡", "😠", "🤬", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "😇", "🥳", "🥺", "🤠", "🥸", "😈", "👿", "👹", "👺", "💀", "👻", "👽", "🤖", "💩", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾"];

  // 2. Edit comment handler
  const handleEditComment = (announcementId, idx, text) => {
    setEditingComment({ [announcementId]: idx });
    setEditingCommentText(text);
  };
  const handleSaveEditComment = (announcementId, idx) => {
    setAnnouncements(prev => prev.map(a =>
      a.id === announcementId
        ? { ...a, comments: a.comments.map((c, i) => i === idx ? { ...c, text: editingCommentText } : c) }
      : a
    ));
    setEditingComment({});
    setEditingCommentText("");
  };
  const handleCancelEditComment = () => {
    setEditingComment({});
    setEditingCommentText("");
  };
  // 3. Delete comment handler
  const handleDeleteComment = (announcementId, idx) => {
    if (!window.confirm("Delete this comment?")) return;
    setAnnouncements(prev => prev.map(a =>
      a.id === announcementId
        ? { ...a, comments: a.comments.filter((_, i) => i !== idx) }
      : a
    ));
  };
  // 4. Emoji picker for comment input
  const handleAddEmojiToInput = (announcementId, emoji) => {
    setCommentInputs(inputs => ({ ...inputs, [announcementId]: (inputs[announcementId] || "") + emoji }));
    setShowEmojiPicker(picker => ({ ...picker, [announcementId]: false }));
  };

  // Add handlers for edit attachments
  const editFileInputRef = useRef();
  const handleEditFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setEditAnnouncementData(prev => ({
        ...prev,
        attachments: [...(prev.attachments || []), ...files.map(file => ({ name: file.name, file }))]
      }));
    }
    e.target.value = "";
  };
  const handleRemoveEditAttachment = (idx) => {
    setEditAnnouncementData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== idx)
    }));
  };

  if (!classInfo) {
    return (
      <div>
        <Header compact />
        <div className="container mt-4">
          <Alert color="warning">
            <h4>Class Not Found</h4>
            <p>The class with code "{code}" could not be found.</p>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header compact />
      <div className="container mt-4">
        <div style={{
          borderRadius: 18,
          background: selectedTheme,
          color: "#fff",
          minHeight: 170,
          boxShadow: "0 4px 24px rgba(44,62,80,0.13)",
          marginBottom: 32,
          position: 'relative',
          overflow: 'hidden',
          padding: '32px 40px',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}>
          {/* Overlay for image themes */}
          {selectedTheme && selectedTheme.startsWith('url(') && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0,0,0,0.45)',
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
              {classInfo.name} <span style={{ fontWeight: 400, fontSize: 22, opacity: 0.92, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.7), 0 1px 0 #000' }}>({classInfo.section})</span>
            </h1>
            <div style={{ fontSize: 20, opacity: 0.95, fontWeight: 500 }}>{classInfo.subject}</div>
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
                {classInfo.code}
              </span>
              <Button 
                color="link" 
                size="sm" 
                id={`copyCodeBtn-${classInfo.code}`} 
                style={{ color: '#007bff', marginLeft: 4, fontSize: 18, padding: 0, cursor: 'pointer' }} 
                onClick={handleCopyCode} 
                aria-label="Copy class code"
              >
                <i className="ni ni-single-copy-04" />
              </Button>
              <Tooltip 
                placement="top" 
                isOpen={tooltipHover || copied} 
                target={`copyCodeBtn-${classInfo.code}`} 
                toggle={() => setTooltipHover(!tooltipHover)}
              >
                {copied ? "Copied!" : "Copy code"}
              </Tooltip>
              <Button 
                color="link" 
                size="sm" 
                style={{ color: '#fff', marginLeft: 8, fontSize: 20 }} 
                onClick={() => setShowCodeModal(true)} 
                title="Display"
              >
                <i className="ni ni-fullscreen-2" />
              </Button>
            </div>
            <div className="mt-2">
              <Badge color="light" className="text-dark me-2">{classInfo.semester}</Badge>
              <Badge color="light" className="text-dark">{classInfo.schoolYear}</Badge>
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

        {/* Code Display Modal */}
        <Modal isOpen={showCodeModal} toggle={() => setShowCodeModal(false)} centered>
          <ModalHeader toggle={() => setShowCodeModal(false)} style={{ border: 'none' }} />
          <ModalBody className="text-center">
            <div style={{ fontSize: 64, fontWeight: 800, color: '#1976d2', letterSpacing: 2, marginBottom: 16 }}>{classInfo.code}</div>
            <div style={{ fontSize: 20, color: '#222', fontWeight: 600 }}>{classInfo.name}</div>
          </ModalBody>
        </Modal>

        {/* Theme Selection Modal */}
        <Modal isOpen={showThemeModal} toggle={() => setShowThemeModal(false)} centered size="lg">
          <ModalHeader toggle={() => setShowThemeModal(false)} style={{ border: 'none' }}>Select a Theme</ModalHeader>
          <ModalBody>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: 18
            }}>
              {customTheme && (
                <div
                  key="custom-photo"
                  onClick={() => handleSelectTheme(customTheme)}
                  style={{
                    width: '100%',
                    height: 70,
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
              {themes.map((theme, idx) => (
                <div
                  key={theme.name}
                  onClick={() => handleSelectTheme(theme.value)}
                  style={{
                    width: '100%',
                    height: 70,
                    borderRadius: 14,
                    cursor: 'pointer',
                    border: selectedTheme === theme.value ? '3px solid #007bff' : '2px solid #eee',
                    background: theme.value.startsWith('url') ? undefined : theme.value,
                    backgroundImage: theme.value.startsWith('url') ? theme.value : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                    boxShadow: selectedTheme === theme.value ? '0 2px 12px rgba(44,62,80,0.15)' : 'none',
                    transition: 'border 0.2s, box-shadow 0.2s',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    overflow: 'hidden',
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
              ))}
            </div>
          </ModalBody>
        </Modal>

        {/* Navigation Tabs */}
        <Nav tabs className="mb-4" style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(44,62,80,0.07)' }}>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "stream" })}
              onClick={() => setActiveTab("stream")}
              style={{ cursor: "pointer", fontWeight: 600, fontSize: 16 }}
            >
              <i className="ni ni-chat-round mr-2 text-info"></i> Stream
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "classwork" })}
              onClick={() => setActiveTab("classwork")}
              style={{ cursor: "pointer", fontWeight: 600, fontSize: 16 }}
            >
              <i className="ni ni-archive-2 mr-2 text-orange"></i> Classwork
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "people" })}
              onClick={() => setActiveTab("people")}
              style={{ cursor: "pointer", fontWeight: 600, fontSize: 16 }}
            >
              <i className="ni ni-single-02 mr-2 text-success"></i> People
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "grades" })}
              onClick={() => setActiveTab("grades")}
              style={{ cursor: "pointer", fontWeight: 600, fontSize: 16 }}
            >
              <i className="ni ni-chart-bar-32 mr-2 text-warning"></i> Grades
            </NavLink>
          </NavItem>
        </Nav>

        {/* Tab Content */}
        <TabContent activeTab={activeTab}>
          {/* Stream Tab */}
          <TabPane tabId="stream">
            <Card className="mb-4" style={{ borderRadius: 18, boxShadow: '0 8px 32px rgba(50,76,221,0.10)', background: 'linear-gradient(135deg, #f8fafc 0%, #e9ecef 100%)', border: '1.5px solid #e9ecef' }}>
              <CardBody>
                <h4 className="mb-4" style={{ fontWeight: 800, color: '#324cdd', letterSpacing: 1 }}>Stream <i className="ni ni-chat-round text-info ml-2" /></h4>
                {/* Post Announcement Form Only */}
                {!formExpanded ? (
                  <FormGroup className="mb-2" style={{ margin: 0 }}>
                    <Input
                      type="textarea"
                      name="announcement"
                      value={newAnnouncement}
                      onFocus={() => setFormExpanded(true)}
                      onChange={e => setNewAnnouncement(e.target.value)}
                      placeholder="Share an announcement with your class..."
                      style={{ fontSize: 14, minHeight: 80, padding: 8, borderRadius: 8, border: '1px solid #bfcfff', background: '#fff' }}
                    />
                  </FormGroup>
                ) : (
                  <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #324cdd11', padding: '1.5rem 1.5rem 1rem', marginBottom: 0, border: '1.5px solid #e9ecef', maxWidth: '100%' }}>
                    <Form onSubmit={handlePostAnnouncement} style={{ marginBottom: 12 }}>
                      <div style={{ marginBottom: 10, display: 'flex', alignItems: 'center' }}>
                        <div style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                          <input type="checkbox" id="allowComments" checked={allowComments} onChange={e => setAllowComments(e.target.checked)} style={{ accentColor: '#285fa7', width: 18, height: 18, margin: 0 }} />
                          <label htmlFor="allowComments" style={{ fontWeight: 500, fontSize: 16, color: '#444', margin: 0, cursor: 'pointer', userSelect: 'none' }}>Allow comments</label>
                        </div>
                      </div>
                      <FormGroup className="mb-2">
                        <Input
                          type="text"
                          name="announcementTitle"
                          value={newAnnouncementTitle}
                          onChange={e => setNewAnnouncementTitle(e.target.value)}
                          placeholder="Announcement title (optional)"
                          style={{ fontSize: 15, borderRadius: 8, border: '1px solid #bfcfff', background: '#fff', marginBottom: 8 }}
                        />
                      </FormGroup>
                      <FormGroup className="mb-2">
                        <Input
                          type="textarea"
                          name="announcement"
                          value={newAnnouncement}
                          autoFocus
                          onChange={e => setNewAnnouncement(e.target.value)}
                          placeholder="Share an announcement with your class..."
                          style={{ fontSize: 14, minHeight: 80, padding: 8, borderRadius: 8, border: '1px solid #bfcfff', background: '#fff' }}
                        />
                      </FormGroup>
                      <div className="d-flex w-100" style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                        <div className="d-flex align-items-center" style={{ gap: 8, position: 'relative' }}>
                          <Dropdown isOpen={attachmentDropdownOpen} toggle={() => setAttachmentDropdownOpen(!attachmentDropdownOpen)}>
                            <DropdownToggle color="secondary" style={{ fontSize: 18, padding: '4px 14px', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <FaPaperclip />
                      </DropdownToggle>
                      <DropdownMenu>
                              <DropdownItem onClick={() => { setAttachmentDropdownOpen(false); fileInputRef.current.click(); }}>File</DropdownItem>
                              <DropdownItem onClick={() => { setAttachmentDropdownOpen(false); setShowLinkModal(true); }}>Link</DropdownItem>
                              <DropdownItem onClick={() => { setAttachmentDropdownOpen(false); setShowYouTubeModal(true); }}>YouTube</DropdownItem>
                              <DropdownItem onClick={() => { setAttachmentDropdownOpen(false); /* TODO: Google Drive logic */ }}>Google Drive</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                    <input type="file" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileChange} />
                          <div style={{ position: 'relative' }}>
                            <Button color="secondary" style={{ fontSize: 18, padding: '4px 14px', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}>
                              <FaSmile />
                            </Button>
                            {emojiPickerOpen && (
                              <div ref={emojiPickerRef} style={{ position: 'absolute', top: 40, left: 0, background: '#fff', border: '1px solid #e9ecef', borderRadius: 8, boxShadow: '0 2px 8px #324cdd22', padding: 8, zIndex: 10, minWidth: 260, maxWidth: 320, maxHeight: 200, overflowY: 'auto' }}>
                                {[
                                  "😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", "😋", "😎", "😍", "😘", "🥰", "😗", "😙", "😚", "🙂", "🤗", "🤩", "🤔", "🤨", "😐", "😑", "😶", "🙄", "😏", "😣", "😥", "😮", "🤐", "😯", "😪", "😫", "🥱", "😴", "😌", "😛", "😜", "😝", "🤤", "😒", "😓", "😔", "😕", "🙃", "🤑", "😲", "☹️", "🙁", "😖", "😞", "😟", "😤", "😢", "😭", "😦", "😧", "😨", "😩", "🤯", "😬", "😰", "😱", "🥵", "🥶", "😳", "🤪", "😵", "😡", "😠", "🤬", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "😇", "🥳", "🥺", "🤠", "🥸", "😈", "👿", "👹", "👺", "💀", "👻", "👽", "🤖", "💩", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾"
                                ].map(emoji => (
                                  <span key={emoji} style={{ fontSize: 22, cursor: 'pointer', margin: 4 }} onClick={() => {
                                    setNewAnnouncement(newAnnouncement + emoji);
                                    setEmojiPickerOpen(false);
                                  }}>{emoji}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                    <div className="d-flex align-items-center" style={{ gap: 8 }}>
                          <Button color="secondary" style={{ fontSize: 13, padding: '4px 18px', borderRadius: 8 }} onClick={e => { handleCancelPost(e); setFormExpanded(false); }}>Cancel</Button>
                          <Button color="primary" type="submit" style={{ fontSize: 15, padding: '4px 22px', borderRadius: 8, fontWeight: 700, boxShadow: '0 2px 8px #667eea33', background: '#7b8cff', border: 'none' }} disabled={(!newAnnouncement || newAnnouncement.trim().length === 0) && attachments.length === 0}>
                            <i className="ni ni-send mr-1" style={{ fontSize: 15 }} /> Post
                        </Button>
                          <Dropdown isOpen={postDropdownOpen} toggle={() => (newAnnouncement.trim() || attachments.length > 0) && setPostDropdownOpen(!postDropdownOpen)} disabled={!newAnnouncement.trim() && attachments.length === 0}>
                            <DropdownToggle style={{ fontSize: 13, padding: '4px 10px', borderRadius: 8, background: '#bfcfff', border: 'none' }} disabled={!newAnnouncement.trim() && attachments.length === 0}>
                              <FaEllipsisV size={13} />
                        </DropdownToggle>
                            <DropdownMenu right>
                              <DropdownItem onClick={() => setShowScheduleModal(true)} disabled={!newAnnouncement.trim() && attachments.length === 0}>Schedule</DropdownItem>
                              <DropdownItem onClick={handleSaveDraft} disabled={!newAnnouncement.trim() && attachments.length === 0}>Save as Draft</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  </div>
                    </Form>
                    {/* After the form controls in the expanded form, show attached files if any */}
                    {attachments.length > 0 && (
                      <div style={{ marginTop: 12, marginBottom: 4, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                        {attachments.map((att, idx) => {
                          const { preview, type, color } = getFileTypeIconOrPreview(att);
                          const url = att.file ? URL.createObjectURL(att.file) : undefined;
                          const isLink = att.type === "Link" || att.type === "YouTube";
                          const displayName = isLink ? att.url : att.name;
                          
                          return (
                            <div key={idx} style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #e9ecef', padding: '0.5rem 1.25rem', display: 'flex', alignItems: 'center', gap: 12, minWidth: 180, maxWidth: 320, width: '100%' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: 8 }}>{preview}</div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 600, fontSize: 16, color: '#232b3b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 140 }} title={displayName}>{displayName}</div>
                                <div style={{ fontSize: 13, color: '#90A4AE', marginTop: 2 }}>
                                  {type} 
                                  {url && <>&bull; <a href={url} download={att.name} style={{ color: color, fontWeight: 600, textDecoration: 'none' }}>Download</a></>}
                                  {isLink && <>&bull; <a href={att.url} target="_blank" rel="noopener noreferrer" style={{ color: color, fontWeight: 600, textDecoration: 'none' }}>View Link</a></>}
                      </div>
                    </div>
                              <Button close onClick={() => setAttachments(attachments.filter((_, i) => i !== idx))} style={{ fontSize: 18, marginLeft: 4 }} />
                      </div>
                          );
                        })}
                    </div>
                    )}
                  </div>
                )}
                  {/* Schedule Modal */}
                  <Modal isOpen={showScheduleModal} toggle={() => setShowScheduleModal(false)} centered>
                    <div style={{ padding: '2rem' }}>
                      <h5 style={{ fontWeight: 700, marginBottom: 16 }}>Schedule Post</h5>
                      <InputGroup className="mb-3">
                        <InputGroupText><i className="ni ni-calendar-grid-58" /></InputGroupText>
                        <Input type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} />
                      </InputGroup>
                      <InputGroup>
                        <InputGroupText><i className="ni ni-watch-time" /></InputGroupText>
                        <Input type="time" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} />
                      </InputGroup>
                      <div className="d-flex justify-content-end mt-3" style={{ gap: 8 }}>
                        <Button color="secondary" outline onClick={() => setShowScheduleModal(false)}>Cancel</Button>
                      <Button color="primary" onClick={handleSchedule} disabled={!scheduleDate || !scheduleTime || (!newAnnouncement.trim() && attachments.length === 0)}>Schedule</Button>
                      </div>
                    </div>
                  </Modal>
                {/* Announcements List */}
                <div style={{ marginTop: 48 }}>
                  {announcements.map((announcement) => {
                    const authorUser = findUserByName(announcement.author);
                    const avatarSrc = getAvatarForUser(authorUser);
                    const isEditing = editingAnnouncementId === announcement.id;
                    return (
                      <Card key={announcement.id} className="mb-2" style={{ borderRadius: 12, boxShadow: '0 2px 8px #324cdd11', borderLeft: announcement.isPinned ? '4px solid #f7b731' : '4px solid #324cdd', background: '#fff', transition: 'box-shadow 0.2s, border-color 0.2s', padding: 0 }}>
                        <CardBody style={{ padding: '0.75rem 1rem' }}>
                          <div className="d-flex align-items-center justify-content-between" style={{ marginBottom: 8 }}>
                            <div className="d-flex align-items-center" style={{ gap: 8 }}>
                              <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                <img src={avatarSrc} alt="avatar" style={{ width: 26, height: 26, borderRadius: '50%', objectFit: 'cover' }} />
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                  <div style={{ fontWeight: 600, color: '#111', fontSize: 12 }}>{announcement.author}</div>
                                  {announcement.isPinned && (
                                    <Badge color="warning" className="ml-2">Pinned</Badge>
                                  )}
                                </div>
                                <small className="text-muted" style={{ fontSize: 11 }}>{announcement.date}</small>
                              </div>
                            </div>
                            <div className="d-flex align-items-center" style={{ marginLeft: 12, flexShrink: 0 }}>
                              <Dropdown isOpen={announcementDropdowns[announcement.id]} toggle={() => handleDropdownToggle(announcement.id)}>
                                <DropdownToggle tag="span" data-toggle="dropdown" aria-expanded={announcementDropdowns[announcement.id]} style={{ cursor: 'pointer', padding: 2, border: 'none', background: 'none' }}>
                                  <FaEllipsisV size={14} />
                                </DropdownToggle>
                                <DropdownMenu right>
                                  <DropdownItem onClick={() => handleEditAnnouncement(announcement.id)}>Edit</DropdownItem>
                                  <DropdownItem onClick={() => handleDeleteAnnouncement(announcement.id)}>Delete</DropdownItem>
                                  <DropdownItem onClick={() => handlePinAnnouncement(announcement.id)}>
                                    {announcement.isPinned ? 'Unpin' : 'Pin this announcement'}
                                  </DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                            </div>
                          </div>
                          {isEditing ? (
                            <>
                              {/* Editable title input */}
                              <input
                                name="title"
                                value={editAnnouncementData.title}
                                onChange={handleEditAnnouncementChange}
                                style={{ fontWeight: 700, fontSize: 15, color: '#111', marginBottom: 8, border: '1px solid #e9ecef', borderRadius: 5, padding: '4px 10px', width: '100%' }}
                                placeholder="Announcement title (optional)"
                              />
                              {/* Editable content textarea */}
                              <textarea
                                name="content"
                                value={editAnnouncementData.content}
                                onChange={handleEditAnnouncementChange}
                                style={{ fontSize: 13, color: '#2d3748', border: '1px solid #e9ecef', borderRadius: 5, padding: 8, width: '100%', minHeight: 80, marginBottom: 8 }}
                                rows={3}
                                placeholder="Share an announcement with your class..."
                              />
                              {/* Attachments: show current with remove, and add new */}
                              <div style={{ marginBottom: 8 }}>
                                {editAnnouncementData.attachments && editAnnouncementData.attachments.length > 0 && (
                                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 8 }}>
                                    {editAnnouncementData.attachments.map((att, idx) => {
                                      const { preview, type, color } = getFileTypeIconOrPreview(att);
                                      const url = att.file ? URL.createObjectURL(att.file) : undefined;
                                      const isLink = att.type === "Link" || att.type === "YouTube";
                                      const displayName = isLink ? att.url : att.name;
                                      return (
                                        <div key={idx} style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #e9ecef', padding: '0.5rem 1.25rem', display: 'flex', alignItems: 'center', gap: 12, minWidth: 180, maxWidth: 320, width: '100%' }}>
                                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: 8 }}>{preview}</div>
                                          <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontWeight: 600, fontSize: 16, color: '#232b3b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 140 }} title={displayName}>{displayName}</div>
                                            <div style={{ fontSize: 13, color: '#90A4AE', marginTop: 2 }}>
                                              {type}
                                              {url && <>&bull; <a href={url} download={att.name} style={{ color: color, fontWeight: 600, textDecoration: 'none' }}>Download</a></>}
                                              {isLink && <>&bull; <a href={att.url} target="_blank" rel="noopener noreferrer" style={{ color: color, fontWeight: 600, textDecoration: 'none' }}>View Link</a></>}
                                            </div>
                                          </div>
                                          <Button close onClick={() => handleRemoveEditAttachment(idx)} style={{ fontSize: 18, marginLeft: 4 }} />
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                                {/* Add new attachment */}
                                <input type="file" multiple style={{ display: 'none' }} ref={editFileInputRef} onChange={handleEditFileChange} />
                                <Button color="secondary" size="sm" style={{ fontSize: 14, borderRadius: 8, padding: '4px 14px' }} onClick={() => editFileInputRef.current.click()}>
                                  <FaPaperclip style={{ marginRight: 6 }} /> Add Attachment
                                </Button>
                              </div>
                              {/* Save/Cancel buttons */}
                              <div className="d-flex" style={{ gap: 8, marginTop: 8 }}>
                                <Button color="success" size="sm" onClick={() => handleSaveEditAnnouncement(announcement.id)} style={{ fontSize: 13, padding: '4px 18px', borderRadius: 8 }}>Save</Button>
                                <Button color="secondary" size="sm" onClick={handleCancelEditAnnouncement} style={{ fontSize: 13, padding: '4px 18px', borderRadius: 8 }}>Cancel</Button>
                              </div>
                              {/* In edit mode, add a toggle for allowComments */}
                              <input type="checkbox" id="editAllowComments" checked={editAnnouncementData.allowComments !== false} onChange={e => setEditAnnouncementData(prev => ({ ...prev, allowComments: e.target.checked }))} style={{ marginRight: 8 }} />
                              <label htmlFor="editAllowComments" style={{ fontWeight: 500, fontSize: 14, color: '#444', marginRight: 16 }}>Allow comments</label>
                            </>
                          ) : (
                            <>
                              {announcement.title && announcement.title.trim() !== "" && (
                                <h6 className="mb-1 font-weight-bold" style={{ color: '#111', fontSize: 17, letterSpacing: 0.2, marginBottom: 8 }}>
                                  {announcement.title}
                                </h6>
                              )}
                              <p className="mb-2" style={{ fontSize: 13, color: '#2d3748', marginBottom: 0 }}>{announcement.content}</p>
                              {!isEditing && announcement.attachments && announcement.attachments.length > 0 && (
                                <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                                  {announcement.attachments.map((att, idx) => {
                                    const { preview, type, color } = getFileTypeIconOrPreview(att);
                                    const url = att.file ? URL.createObjectURL(att.file) : undefined;
                                    const isLink = att.type === "Link" || att.type === "YouTube";
                                    const displayName = isLink ? att.url : att.name;
                                    return (
                                      <div
                                        key={idx}
                                        onClick={() => {
                                          if (isLink && att.url) {
                                            window.open(att.url, '_blank', 'noopener,noreferrer');
                                          } else {
                                            handlePreviewAttachment(att);
                                          }
                                        }}
                                        style={{ background: '#f8fafd', borderRadius: 8, boxShadow: '0 2px 8px #e9ecef', padding: '0.5rem 1.25rem', display: 'flex', alignItems: 'center', gap: 12, minWidth: 180, maxWidth: 320, width: '100%', cursor: 'pointer' }}
                                      >
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: 8 }}>{preview}</div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                          <div style={{ fontWeight: 600, fontSize: 16, color: '#232b3b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 140 }} title={displayName}>{displayName}</div>
                                          <div style={{ fontSize: 13, color: '#90A4AE', marginTop: 2 }}>
                                            {type}
                                            {url && <>&bull; <a href={url} download={att.name} style={{ color: color, fontWeight: 600, textDecoration: 'none' }} onClick={e => e.stopPropagation()}>Download</a></>}
                                            {isLink && <>&bull; <a href={att.url} target="_blank" rel="noopener noreferrer" style={{ color: color, fontWeight: 600, textDecoration: 'none' }} onClick={e => e.stopPropagation()}>View Link</a></>}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                              {/* After the message content, add the comment section: */}
                              {announcement.allowComments !== false && (
                                <div style={{ background: '#f8fafd', borderRadius: 8, marginTop: 12, padding: '12px 18px 10px', boxShadow: '0 1px 4px #324cdd11' }}>
                                  {announcement.comments && announcement.comments.length > 0 && (
                                    <div style={{ fontWeight: 600, fontSize: 13, color: '#111', marginBottom: 6 }}>Comments</div>
                                  )}
                                  {/* List comments */}
                                  {announcement.comments && announcement.comments.length > 0 && (
                                    <div style={{ marginBottom: 8 }}>
                                      {announcement.comments.map((c, idx) => {
                                        const commentUser = findUserByName(c.author);
                                        const commentAvatar = getAvatarForUser(commentUser);
                                        const isEditing = editingComment[announcement.id] === idx;
                                        const isOwn = c.author === "Prof. Smith";
                                        return (
                                          <div key={idx} className="d-flex align-items-start" style={{ marginBottom: 6, gap: 10, padding: '4px 0', borderBottom: '1px solid #e9ecef', fontSize: 13, color: '#2d3748' }}>
                                            <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginTop: 2 }}>
                                              <img src={commentAvatar} alt="avatar" style={{ width: 20, height: 20, borderRadius: '50%', objectFit: 'cover' }} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                              <span style={{ fontWeight: 600 }}>{c.author}</span>
                                              <span style={{ color: '#90A4AE', fontSize: 11, marginLeft: 8 }}>{c.date}</span>
                                              {isEditing ? (
                                                <div className="d-flex align-items-center" style={{ gap: 6, marginTop: 2 }}>
                                                  <input
                                                    type="text"
                                                    className="form-control"
                                                    style={{ fontSize: 13, borderRadius: 6, border: '1px solid #bfcfff', background: '#fff', flex: 1 }}
                                                    value={editingCommentText}
                                                    onChange={e => setEditingCommentText(e.target.value)}
                                                    onKeyDown={e => { if (e.key === 'Enter') handleSaveEditComment(announcement.id, idx); }}
                                                    autoFocus
                                                  />
                                                  <button className="btn btn-success btn-sm" style={{ fontSize: 13, borderRadius: 6, fontWeight: 600, padding: '4px 10px' }} onClick={() => handleSaveEditComment(announcement.id, idx)}>Save</button>
                                                  <button className="btn btn-secondary btn-sm" style={{ fontSize: 13, borderRadius: 6, fontWeight: 600, padding: '4px 10px' }} onClick={handleCancelEditComment}>Cancel</button>
                                                </div>
                                              ) : (
                                                <div style={{ marginLeft: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
                                                  <span>{c.text}</span>
                                                  {isOwn && (
                                                    <>
                                                      <button className="btn btn-link btn-sm p-0" style={{ fontSize: 13, color: '#324cdd' }} onClick={() => handleEditComment(announcement.id, idx, c.text)}>Edit</button>
                                                      <button className="btn btn-link btn-sm p-0" style={{ fontSize: 13, color: '#e74c3c' }} onClick={() => handleDeleteComment(announcement.id, idx)}>Delete</button>
                                                    </>
                                                  )}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                  {/* Input for new comment */}
                                  <div className="d-flex" style={{ gap: 8, position: 'relative' }}>
                                    <input
                                      type="text"
                                      className="form-control"
                                      style={{ fontSize: 13, borderRadius: 6, border: '1px solid #bfcfff', background: '#fff' }}
                                      placeholder="Add a comment..."
                                      value={commentInputs[announcement.id] || ""}
                                      onChange={e => setCommentInputs(inputs => ({ ...inputs, [announcement.id]: e.target.value }))}
                                      onKeyDown={e => { if (e.key === 'Enter') handlePostComment(announcement.id); }}
                                    />
                                    <button
                                      type="button"
                                      className="btn btn-secondary"
                                      style={{ fontSize: 18, borderRadius: 8, padding: '4px 14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                      onClick={() => setShowEmojiPicker(picker => ({ ...picker, [announcement.id]: !picker[announcement.id] }))}
                                    >
                                      <FaSmile />
                                    </button>
                                    {showEmojiPicker[announcement.id] && (
                                      <div style={{ position: 'absolute', top: '100%', left: 0, background: '#fff', border: '1px solid #e9ecef', borderRadius: 8, boxShadow: '0 2px 8px #324cdd22', padding: 8, zIndex: 10, minWidth: 220, maxWidth: 320, maxHeight: 200, overflowY: 'auto' }}>
                                        {emojiList.map(emoji => (
                                          <span key={emoji} style={{ fontSize: 22, cursor: 'pointer', margin: 4 }} onClick={() => handleAddEmojiToInput(announcement.id, emoji)}>{emoji}</span>
                                        ))}
                                      </div>
                                    )}
                                    <button
                                      className="btn btn-primary btn-sm"
                                      style={{ fontSize: 13, borderRadius: 6, fontWeight: 600, padding: '4px 16px' }}
                                      onClick={() => handlePostComment(announcement.id)}
                                      disabled={!(commentInputs[announcement.id] && commentInputs[announcement.id].trim())}
                                    >Post</button>
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </CardBody>
                      </Card>
                    );
                  })}
                </div>
              </CardBody>
            </Card>
          </TabPane>

          {/* Classwork Tab */}
          <TabPane tabId="classwork">
            <div className="container mt-4">
              <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px rgba(44,62,80,0.10)', padding: '2.5rem 2.5rem 2rem', marginBottom: 32 }}>
                <div className="d-flex justify-content-end mb-4">
                  <Button color="primary" style={{ borderRadius: 32, fontWeight: 700, fontSize: 20, padding: '0.75rem 2.5rem', boxShadow: '0 4px 24px #667eea55', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none', transition: 'box-shadow 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.boxShadow = '0 8px 32px #667eea55'}
                    onMouseOut={e => e.currentTarget.style.boxShadow = '0 4px 24px #667eea55'}
                    onClick={() => setShowCreateModal(true)}>
                    + Create
                  </Button>
                </div>
                <div style={{ maxWidth: 900, margin: '0 auto' }}>
                  {assignments.map((item) => (
                    <div key={item.id} style={{ background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px rgba(44,62,80,0.10)', marginBottom: 24, padding: '2rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'box-shadow 0.2s', minHeight: 90 }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 22, color: '#2d3748', marginBottom: 6 }}>{item.title}</div>
                        <div style={{ fontSize: 16, color: '#6c757d', fontWeight: 500 }}>
                          {item.type} {item.dueDate && <>• Due: {item.dueDate}</>} {item.points && <>• {item.points} points</>}
                        </div>
                      </div>
                      <span style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', fontWeight: 700, fontSize: 14, borderRadius: 999, padding: '0.5em 1.25em', letterSpacing: 1, boxShadow: '0 2px 8px #667eea33', textTransform: 'uppercase' }}>{item.type}</span>
                    </div>
                  ))}
                </div>
                {/* Create Classwork Modal */}
                <Modal isOpen={showCreateModal} toggle={() => setShowCreateModal(false)} centered contentClassName="modal-content" style={{ borderRadius: 18 }}>
                  <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', borderTopLeftRadius: 18, borderTopRightRadius: 18, padding: '2rem 2rem 1rem', fontWeight: 800, fontSize: 22, letterSpacing: 1 }}>Create Classwork</div>
                  <Form onSubmit={handleCreateSubmit} style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e9ecef 100%)', borderBottomLeftRadius: 18, borderBottomRightRadius: 18, padding: '2rem' }}>
                    <ModalBody style={{ background: 'transparent', padding: 0 }}>
                      <FormGroup>
                        <Label for="type" className="font-weight-bold">Type</Label>
                        <Input type="select" name="type" id="type" value={createForm.type} onChange={handleCreateChange} required style={{ borderRadius: 10, padding: '0.75rem', fontWeight: 600, fontSize: 16 }}>
                          <option value="">Select type</option>
                          <option>Assignment</option>
                          <option>Quiz</option>
                          <option>Project</option>
                        </Input>
                      </FormGroup>
                      <FormGroup>
                        <Label for="title" className="font-weight-bold">Title</Label>
                        <Input name="title" id="title" value={createForm.title} onChange={handleCreateChange} required style={{ borderRadius: 10, padding: '0.75rem', fontWeight: 600, fontSize: 16 }} />
                      </FormGroup>
                      <FormGroup>
                        <Label for="dueDate" className="font-weight-bold">Due Date</Label>
                        <Input type="date" name="dueDate" id="dueDate" value={createForm.dueDate} onChange={handleCreateChange} required style={{ borderRadius: 10, padding: '0.75rem', fontWeight: 600, fontSize: 16 }} />
                      </FormGroup>
                      <FormGroup>
                        <Label for="points" className="font-weight-bold">Points</Label>
                        <Input type="number" name="points" id="points" value={createForm.points} onChange={handleCreateChange} required min="1" style={{ borderRadius: 10, padding: '0.75rem', fontWeight: 600, fontSize: 16 }} />
                      </FormGroup>
                    </ModalBody>
                    <ModalFooter style={{ border: 'none', background: 'transparent' }}>
                      <Button color="secondary" onClick={() => setShowCreateModal(false)} style={{ borderRadius: 10, fontWeight: 600 }}>Cancel</Button>
                      <Button color="primary" type="submit" style={{ borderRadius: 10, fontWeight: 700, boxShadow: '0 2px 8px #667eea55', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}>Create</Button>
                    </ModalFooter>
                  </Form>
                </Modal>
              </div>
            </div>
          </TabPane>

          {/* People Tab */}
          <TabPane tabId="people">
            <Card className="mb-4" style={{ borderRadius: 14, boxShadow: '0 2px 8px rgba(44,62,80,0.07)' }}>
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="mb-0">People</h4>
                  <Button color="primary" size="sm" style={{ borderRadius: "8px" }} onClick={() => setShowInviteModal(true)}>
                    <i className="ni ni-fat-add mr-1"></i> Invite
                  </Button>
                </div>
                
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id}>
                        <td>{student.name}</td>
                        <td>{student.email}</td>
                        <td>
                          <Badge color="success">{student.role}</Badge>
                        </td>
                        <td>{student.joinedDate}</td>
                        <td>
                          <Button color="link" size="sm" className="p-0 mr-2">
                            <i className="ni ni-single-02"></i>
                          </Button>
                          <Button color="link" size="sm" className="p-0 text-danger">
                            <i className="ni ni-fat-remove"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </TabPane>

          {/* Grades Tab */}
          <TabPane tabId="grades">
            <Card className="mb-4" style={{ borderRadius: 14, boxShadow: '0 2px 8px rgba(44,62,80,0.07)' }}>
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="mb-0">Grades</h4>
                  <Button color="primary" size="sm" style={{ borderRadius: "8px" }} onClick={() => setShowAddGradeModal(true)}>
                    <i className="ni ni-fat-add mr-1"></i> Add Grade
                  </Button>
                </div>
                
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Assignment #1</th>
                      <th>Quiz #1</th>
                      <th>Project #1</th>
                      <th>Average</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grades.map((grade) => (
                      <tr key={grade.studentId}>
                        <td>{grade.studentName}</td>
                        <td>{grade.assignment1}</td>
                        <td>{grade.quiz1}</td>
                        <td>{grade.project1}</td>
                        <td>
                          <Badge color={grade.average >= 90 ? "success" : grade.average >= 80 ? "primary" : "warning"}>
                            {grade.average.toFixed(1)}
                          </Badge>
                        </td>
                        <td>
                          <Button color="link" size="sm" className="p-0 mr-2">
                            <i className="ni ni-ruler-pencil"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </TabPane>
        </TabContent>
      </div>

      {/* Invite Student Modal */}
      <Modal isOpen={showInviteModal} toggle={() => setShowInviteModal(false)} centered contentClassName="modal-content" style={{ borderRadius: 16 }}>
        <div style={modalHeaderStyle('linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)')}>
          <i className="ni ni-single-02" style={iconStyle}></i>
          <span style={{ fontWeight: 700, fontSize: 20 }}>Invite Student</span>
        </div>
        <Form onSubmit={handleInviteSubmit} style={modalBodyStyle}>
          <ModalBody style={{ background: 'transparent', padding: 0 }}>
            <FormGroup>
              <Label for="name" style={{ fontWeight: 600 }}>Name</Label>
              <Input name="name" id="name" value={inviteForm.name} onChange={handleInviteChange} required style={{ borderRadius: 10, padding: '0.75rem' }} />
            </FormGroup>
            <FormGroup>
              <Label for="email" style={{ fontWeight: 600 }}>Email</Label>
              <Input type="email" name="email" id="email" value={inviteForm.email} onChange={handleInviteChange} required style={{ borderRadius: 10, padding: '0.75rem' }} />
            </FormGroup>
          </ModalBody>
          <ModalFooter style={{ border: 'none', background: 'transparent' }}>
            <Button color="secondary" onClick={() => setShowInviteModal(false)} style={{ borderRadius: 10, fontWeight: 600 }}>Cancel</Button>
            <Button color="primary" type="submit" style={{ borderRadius: 10, fontWeight: 600, boxShadow: '0 2px 8px #43e97b55' }}>Invite</Button>
          </ModalFooter>
        </Form>
      </Modal>

      {/* Add Grade Modal */}
      <Modal isOpen={showAddGradeModal} toggle={() => setShowAddGradeModal(false)} centered contentClassName="modal-content" style={{ borderRadius: 16 }}>
        <div style={modalHeaderStyle('linear-gradient(135deg, #fa709a 0%, #fee140 100%)')}>
          <i className="ni ni-chart-bar-32" style={iconStyle}></i>
          <span style={{ fontWeight: 700, fontSize: 20 }}>Add Grade</span>
        </div>
        <Form onSubmit={handleAddGradeSubmit} style={modalBodyStyle}>
          <ModalBody style={{ background: 'transparent', padding: 0 }}>
            <FormGroup>
              <Label for="studentId" style={{ fontWeight: 600 }}>Student</Label>
              <Input type="select" name="studentId" id="studentId" value={gradeForm.studentId} onChange={handleGradeChange} required style={{ borderRadius: 10, padding: '0.75rem' }}>
                <option value="">Select student</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="work" style={{ fontWeight: 600 }}>Work</Label>
              <Input type="select" name="work" id="work" value={gradeForm.work} onChange={handleGradeChange} required style={{ borderRadius: 10, padding: '0.75rem' }}>
                <option value="">Select work</option>
                <option value="assignment1">Assignment #1</option>
                <option value="quiz1">Quiz #1</option>
                <option value="project1">Project #1</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="grade" style={{ fontWeight: 600 }}>Grade</Label>
              <Input type="number" name="grade" id="grade" value={gradeForm.grade} onChange={handleGradeChange} required min="0" max="100" style={{ borderRadius: 10, padding: '0.75rem' }} />
            </FormGroup>
          </ModalBody>
          <ModalFooter style={{ border: 'none', background: 'transparent' }}>
            <Button color="secondary" onClick={() => setShowAddGradeModal(false)} style={{ borderRadius: 10, fontWeight: 600 }}>Cancel</Button>
            <Button color="primary" type="submit" style={{ borderRadius: 10, fontWeight: 600, boxShadow: '0 2px 8px #fa709a55' }}>Add</Button>
          </ModalFooter>
        </Form>
      </Modal>

      {/* Link Modal */}
      <Modal isOpen={showLinkModal} toggle={() => {
        setShowLinkModal(false);
        setLinkError("");
        setLinkInput("");
      }} centered>
        <ModalHeader>
          <h5 className="mb-0 font-weight-bold">Add Link</h5>
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="linkInput" className="font-weight-bold">Link URL</Label>
            <Input
              type="url"
              id="linkInput"
              placeholder="Enter link URL (e.g., https://example.com)..."
              value={linkInput}
              onChange={e => {
                setLinkInput(e.target.value);
                if (linkError) setLinkError("");
              }}
              className={linkError ? "is-invalid" : ""}
            />
            {linkError && (
              <div className="invalid-feedback d-block">
                {linkError}
              </div>
            )}
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => {
            setShowLinkModal(false);
            setLinkError("");
            setLinkInput("");
          }}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleAddLink}>
            Add Link
          </Button>
        </ModalFooter>
      </Modal>

      {/* Preview Modal */}
      <Modal isOpen={previewModalOpen} toggle={() => setPreviewModalOpen(false)} size="lg" centered style={{ transform: 'translateX(96px)' }}>
        <ModalHeader toggle={() => setPreviewModalOpen(false)}>
          File Preview
        </ModalHeader>
        <ModalBody style={{ minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {previewAttachment && (() => {
            const ext = previewAttachment.name ? previewAttachment.name.split('.').pop().toLowerCase() : '';
            // Microsoft Office
            const wordExts = ['doc', 'docx', 'dot', 'dotx', 'docm', 'dotm'];
            const excelExts = ['xls', 'xlsx', 'xlsm', 'xlsb', 'xlt', 'xltx', 'xltm', 'csv'];
            const pptExts = ['ppt', 'pptx', 'pps', 'ppsx', 'pptm', 'potx', 'potm', 'ppsm'];
            if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(ext) && previewAttachment.file) {
              const url = URL.createObjectURL(previewAttachment.file);
              return <img src={url} alt={previewAttachment.name} style={{ maxWidth: '100%', maxHeight: 400, borderRadius: 8 }} />;
            }
            if (ext === 'pdf' && previewAttachment.file) {
              const url = URL.createObjectURL(previewAttachment.file);
              return <iframe src={url} title="PDF Preview" style={{ width: '100%', height: 500, border: 'none' }} />;
            }
            if ((ext === 'txt' || ext === 'csv') && previewText) {
              return <pre style={{ width: '100%', maxHeight: 400, overflow: 'auto', background: '#f8fafd', borderRadius: 8, padding: 16 }}>{previewText}</pre>;
            }
            if (wordExts.includes(ext)) {
              return <div style={{ textAlign: 'center', width: '100%' }}>
                <svg width="64" height="80" viewBox="0 0 32 40" fill="none" style={{ marginBottom: 16 }}><rect width="32" height="40" rx="6" fill="#fff" stroke="#1976D2" strokeWidth="2"/><text x="16" y="28" textAnchor="middle" fontSize="16" fill="#1976D2" fontWeight="bold">WORD</text></svg>
                <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>{previewAttachment.name}</div>
                <div>Preview not supported. <a href={URL.createObjectURL(previewAttachment.file)} download={previewAttachment.name} style={{ color: '#324cdd', fontWeight: 600 }}>Download</a></div>
              </div>;
            }
            if (excelExts.includes(ext)) {
              return <div style={{ textAlign: 'center', width: '100%' }}>
                <svg width="64" height="80" viewBox="0 0 32 40" fill="none" style={{ marginBottom: 16 }}><rect width="32" height="40" rx="6" fill="#fff" stroke="#388E3C" strokeWidth="2"/><text x="16" y="28" textAnchor="middle" fontSize="16" fill="#388E3C" fontWeight="bold">EXCEL</text></svg>
                <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>{previewAttachment.name}</div>
                <div>Preview not supported. <a href={URL.createObjectURL(previewAttachment.file)} download={previewAttachment.name} style={{ color: '#388E3C', fontWeight: 600 }}>Download</a></div>
              </div>;
            }
            if (pptExts.includes(ext)) {
              return <div style={{ textAlign: 'center', width: '100%' }}>
                <svg width="64" height="80" viewBox="0 0 32 40" fill="none" style={{ marginBottom: 16 }}><rect width="32" height="40" rx="6" fill="#fff" stroke="#FF9800" strokeWidth="2"/><text x="16" y="28" textAnchor="middle" fontSize="16" fill="#FF9800" fontWeight="bold">PPT</text></svg>
                <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>{previewAttachment.name}</div>
                <div>Preview not supported. <a href={URL.createObjectURL(previewAttachment.file)} download={previewAttachment.name} style={{ color: '#FF9800', fontWeight: 600 }}>Download</a></div>
                <div style={{ marginTop: 16 }}>
                  <a href="https://slides.google.com" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', background: '#FF9800', padding: '8px 18px', borderRadius: 8, fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>Try to open in Google Slides</a>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>(Upload the file in Google Slides to view it online)</div>
                </div>
              </div>;
            }
            if (ext === 'mp3' && previewAttachment.file) {
              const url = URL.createObjectURL(previewAttachment.file);
              return (
                <div style={{ width: '100%', textAlign: 'center' }}>
                  <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 28 }}>{previewAttachment.name}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                    <div style={{ marginBottom: 8, position: 'relative', width: 120, height: 120 }}>
                      {/* Sound waves - smaller so they don't reach the text */}
                      {[1,2,3].map(i => (
                        <div
                          key={i}
                          style={{
                            position: 'absolute',
                            left: 60 - i*20,
                            top: 60 - i*20,
                            width: i*40,
                            height: i*40,
                            borderRadius: '50%',
                            border: '2px solid #90caf9',
                            opacity: 0.5,
                            pointerEvents: 'none',
                            animation: mp3Playing ? `wave-pulse 1.2s ${i*0.2}s infinite linear` : 'none',
                            zIndex: 1,
                          }}
                        />
                      ))}
                      {/* Vinyl record */}
                      <svg width="120" height="120" viewBox="0 0 120 120" style={{ zIndex: 2, position: 'relative', display: 'block' }}>
                        <circle cx="60" cy="60" r="56" fill="#222" stroke="#444" strokeWidth="4" />
                        <circle cx="60" cy="60" r="20" fill="#324cdd" />
                        <circle cx="60" cy="60" r="6" fill="#fff" />
                      </svg>
                    </div>
                    <audio
                      controls
                      style={{ width: '100%' }}
                      src={url}
                      onPlay={() => setMp3Playing(true)}
                      onPause={() => setMp3Playing(false)}
                      onEnded={() => setMp3Playing(false)}
                    >
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                  <style>{`
                    @keyframes wave-pulse {
                      0% { opacity: 0.5; transform: scale(1); }
                      50% { opacity: 1; transform: scale(1.08); }
                      100% { opacity: 0.5; transform: scale(1); }
                    }
                  `}</style>
                </div>
              );
            }
            if (ext === 'mp4' && previewAttachment.file) {
              const url = URL.createObjectURL(previewAttachment.file);
              return <video controls style={{ width: '100%', maxHeight: 400, borderRadius: 8 }} src={url}>Your browser does not support the video tag.</video>;
            }
            return <div style={{ textAlign: 'center', width: '100%' }}>
              <p>No preview available for this file type.</p>
              {previewAttachment.file && <a href={URL.createObjectURL(previewAttachment.file)} download={previewAttachment.name} style={{ color: '#324cdd', fontWeight: 600 }}>Download</a>}
            </div>;
          })()}
        </ModalBody>
      </Modal>
    </div>
  );
};

export default ClassroomDetail; 