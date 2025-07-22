import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Badge, Button, Input } from "reactstrap";

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
      author: "You",
      date: new Date().toISOString(),
      isPinned: false,
      reactions: { like: 0, likedBy: [] },
      comments: []
    };
    setStudentAnnouncements([newAnn, ...studentAnnouncements]);
    setStudentAnnouncement("");
    setAnnouncementTitle("");
    setAllowComments(true);
    setFormExpanded(false);
  };

  return (
    <div style={{ background: "#f7fafd", minHeight: "100vh" }}>
      {/* Banner */}
      <div style={{
        width: '100%',
        minHeight: 180,
        background: `url(${currentClass.banner}) center/cover no-repeat`,
        borderRadius: 24,
        margin: '24px auto 0',
        maxWidth: 1100,
        position: 'relative',
        boxShadow: '0 2px 16px 0 rgba(44,62,80,.10)'
      }}>
        <div style={{
          background: 'rgba(0,0,0,0.35)',
          borderRadius: 24,
          width: '100%',
          height: '100%',
          padding: 36,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          color: '#fff',
          position: 'relative'
        }}>
          <div style={{ fontWeight: 700, fontSize: 28, marginBottom: 4 }}>
            {currentClass.name} <span style={{ fontWeight: 400, fontSize: 20 }}>({currentClass.section})</span>
          </div>
          <div style={{ fontSize: 16, marginBottom: 16 }}>{currentClass.subject}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
            <span style={{ fontWeight: 600, fontSize: 16 }}>Class Code:</span>
            <Badge color="primary" style={{ fontSize: 16, fontWeight: 700, background: '#fff', color: '#2096ff', letterSpacing: 2, padding: '8px 18px', borderRadius: 10 }}>{currentClass.code}</Badge>
            <i className="ni ni-copy-2" style={{ fontSize: 20, color: '#fff', marginLeft: 8, cursor: 'pointer' }} title="Copy code"></i>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Badge color="info" style={{ fontWeight: 500, fontSize: 12, background: '#222', color: '#fff', borderRadius: 8, padding: '4px 12px', opacity: 0.7 }}>{currentClass.semester}</Badge>
            <Badge color="info" style={{ fontWeight: 500, fontSize: 12, background: '#222', color: '#fff', borderRadius: 8, padding: '4px 12px', opacity: 0.7 }}>{currentClass.schoolYear}</Badge>
          </div>
          <div style={{ position: 'absolute', top: 24, right: 36, textAlign: 'right' }}>
            <a href="#" style={{ color: '#fff', fontWeight: 500, fontSize: 13, textDecoration: 'underline', marginRight: 16 }}>Select theme</a>
            <a href="#" style={{ color: '#fff', fontWeight: 500, fontSize: 13, textDecoration: 'underline' }}>Upload photo</a>
          </div>
          <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', opacity: 0.18 }}>
            <i className="ni ni-button-play" style={{ fontSize: 80, color: '#fff' }} />
          </div>
        </div>
      </div>
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
                <div style={{ color: '#888' }}>No scheduled announcements.</div>
              </div>
            )}
            {activeStreamTab === 'drafts' && (
              <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #324cdd11', border: 'none', marginBottom: 24, marginTop: 0, padding: '2rem 2rem 1.5rem', maxWidth: '100%' }}>
                <div style={{ fontWeight: 700, color: '#2d3559', marginBottom: 8 }}>Draft Announcements</div>
                <div style={{ color: '#888' }}>No drafts saved.</div>
              </div>
            )}
            {/* Student Announcement Post Form */}
            {!formExpanded ? (
              <div style={{ marginBottom: 24 }}>
                <textarea
                  value={studentAnnouncement}
                  onFocus={() => setFormExpanded(true)}
                  onChange={e => setStudentAnnouncement(e.target.value)}
                  placeholder="Share an announcement with your class..."
                  style={{ width: '100%', fontSize: 16, minHeight: 56, borderRadius: 12, padding: '16px 18px', border: 'none', background: '#f7fafd', boxShadow: 'none', resize: 'none', outline: 'none', color: '#888' }}
                />
              </div>
            ) : (
              <form onSubmit={handleStudentPostAnnouncement} style={{ marginBottom: 24, background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #324cdd11', padding: '1.5rem 1.5rem 1rem', border: '1.5px solid #e9ecef', maxWidth: '100%', position: 'relative' }}>
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
                  <button type="button" style={{ border: 'none', background: '#f7fafd', borderRadius: 8, padding: '8px 14px', fontSize: 18, cursor: 'pointer' }}>
                    <i className="fa fa-smile" />
                  </button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                  <button type="button" style={{ fontWeight: 500, borderRadius: 8, minWidth: 80, fontSize: 15, background: '#f7fafd', color: '#222', border: 'none', padding: '8px 20px', cursor: 'pointer' }} onClick={() => { setFormExpanded(false); setStudentAnnouncement(""); setAnnouncementTitle(""); setAllowComments(true); }}>
                    Cancel
                  </button>
                  <button type="submit" style={{ fontWeight: 600, borderRadius: 8, minWidth: 100, fontSize: 15, background: '#7b8cff', color: '#fff', border: 'none', padding: '8px 20px', cursor: studentAnnouncement.trim() ? 'pointer' : 'not-allowed', opacity: studentAnnouncement.trim() ? 1 : 0.6 }} disabled={!studentAnnouncement.trim()}>
                    <i className="ni ni-send" style={{ fontSize: 16, marginRight: 6 }} />
                    Post
                  </button>
                  <button type="button" style={{ border: 'none', background: '#f7fafd', borderRadius: 8, padding: '8px 14px', fontSize: 18, cursor: 'pointer' }}>
                    <i className="fa fa-user-plus" />
                  </button>
                </div>
              </form>
            )}
            {/* Announcements List */}
            <div style={{ marginTop: 32 }}>
              {[...studentAnnouncements, ...mockAnnouncements].map((announcement) => (
                <div key={announcement.id} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #324cdd11', borderLeft: announcement.isPinned ? '4px solid #f7b731' : '4px solid #324cdd', marginBottom: 24, padding: 0, position: 'relative' }}>
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
                        {/* Comments Section */}
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
                        </div>
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
    </div>
  );
};

export default ClassroomDetailStudent; 