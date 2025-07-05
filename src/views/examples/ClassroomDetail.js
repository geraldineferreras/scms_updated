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
import { FaEllipsisV, FaClipboardList, FaQuestionCircle, FaBook, FaRedo, FaFolder, FaPlus } from 'react-icons/fa';

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

  useEffect(() => {
    const classes = JSON.parse(localStorage.getItem("teacherClasses")) || [];
    const foundClass = classes.find(cls => cls.code === code);
    setClassInfo(foundClass);
  }, [code]);

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
    const file = e.target.files[0];
    if (file) {
      setAttachments([...attachments, { type: "File", name: file.name, file }]);
    }
    e.target.value = "";
  };

  const handleAddLink = () => {
    if (linkInput.trim()) {
      setAttachments([...attachments, { type: "Link", url: linkInput }]);
      setLinkInput("");
      setShowLinkModal(false);
    }
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

  const handlePostAnnouncement = (e) => {
    e.preventDefault();
    if (newAnnouncement.trim()) {
      const announcement = {
        id: Date.now(),
        title: newAnnouncement,
        content: newAnnouncement,
        author: "Prof. Smith",
        date: new Date().toISOString().split('T')[0],
        isPinned: false,
        attachments,
        year: selectedYear,
        audience: selectedAudience
      };
      setAnnouncements([announcement, ...announcements]);
      setNewAnnouncement("");
      setAttachments([]);
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
        }}>
          <div>
            <h1 style={{ fontWeight: 800, letterSpacing: 1 }}>
              {classInfo.name} <span style={{ fontWeight: 400, fontSize: 22, opacity: 0.85 }}>({classInfo.section})</span>
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
          <div className="d-flex flex-column align-items-end" style={{ minWidth: 160 }}>
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
            <Card className="mb-4" style={{ borderRadius: 14, boxShadow: '0 2px 8px rgba(44,62,80,0.07)' }}>
              <CardBody>
                <h4 className="mb-3">Stream</h4>
                
                {/* Post Announcement Form */}
                <Form onSubmit={handlePostAnnouncement} className="mb-4" style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(44,62,80,0.10)', padding: '1.5rem', marginBottom: 32 }}>
                  {/* For row */}
                  <div className="d-flex align-items-center mb-3" style={{ gap: 16 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>For</div>
                      <Dropdown isOpen={yearDropdownOpen} toggle={() => setYearDropdownOpen(!yearDropdownOpen)}>
                        <DropdownToggle caret color="light" style={{ borderRadius: 8, minWidth: 140, fontWeight: 500, color: '#222', border: '1px solid #e9ecef' }}>
                          {selectedYear}
                        </DropdownToggle>
                        <DropdownMenu>
                          {years.map(y => <DropdownItem key={y} onClick={() => setSelectedYear(y)}>{y}</DropdownItem>)}
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4, color: 'transparent' }}>-</div>
                      <Dropdown isOpen={audienceDropdownOpen} toggle={() => setAudienceDropdownOpen(!audienceDropdownOpen)}>
                        <DropdownToggle caret color="light" style={{ borderRadius: 8, minWidth: 140, fontWeight: 500, color: '#222', border: '1px solid #e9ecef' }}>
                          {selectedAudience}
                        </DropdownToggle>
                        <DropdownMenu>
                          {audiences.map(a => <DropdownItem key={a} onClick={() => setSelectedAudience(a)}>{a}</DropdownItem>)}
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  </div>
                  {/* Textarea */}
                  <FormGroup className="mb-3">
                    <Input
                      type="textarea"
                      name="announcement"
                      id="announcement"
                      value={newAnnouncement}
                      onChange={(e) => setNewAnnouncement(e.target.value)}
                      placeholder="Share with your class"
                      rows="3"
                      style={{ borderRadius: 10, border: '1.5px solid #bfc9da', fontSize: 17, padding: '1.25rem 1rem', boxShadow: 'none', minHeight: 90, color: '#222', background: '#f8fafc' }}
                    />
                  </FormGroup>
                  {/* Attachments preview */}
                  {attachments.length > 0 && (
                    <div className="mb-3" style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                      {attachments.map((att, idx) => (
                        <div key={idx} style={{ background: '#f1f3f4', borderRadius: 8, padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                          {att.type === 'File' && <i className="ni ni-paperclip" style={{ color: '#1976d2' }}></i>}
                          {att.type === 'Link' && <i className="ni ni-link-2" style={{ color: '#34A853' }}></i>}
                          {att.type === 'YouTube' && <i className="ni ni-youtube-play" style={{ color: '#EA4335' }}></i>}
                          <span style={{ fontWeight: 500, fontSize: 15 }}>
                            {att.type === 'File' ? att.name : att.url}
                          </span>
                          <Button close onClick={() => handleRemoveAttachment(idx)} style={{ fontSize: 18, marginLeft: 4 }} />
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Action Row */}
                  <div className="d-flex align-items-center justify-content-between mt-3" style={{ gap: 12 }}>
                    <Dropdown isOpen={addDropdownOpen} toggle={() => setAddDropdownOpen(!addDropdownOpen)}>
                      <DropdownToggle color="light" style={{ borderRadius: 8, fontWeight: 600, color: '#1976d2', border: '1px solid #e9ecef', display: 'flex', alignItems: 'center', gap: 6, padding: '0.5rem 1.25rem' }}>
                        <i className="ni ni-attach-87" style={{ fontSize: 18, marginRight: 4 }}></i> Add
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem header>Add attachment</DropdownItem>
                        <DropdownItem onClick={() => handleAddAttachment('Google Drive')}><i className="ni ni-cloud-upload-96 mr-2" style={{ color: '#4285F4' }}></i> Google Drive</DropdownItem>
                        <DropdownItem onClick={() => handleAddAttachment('Link')}><i className="ni ni-link-2 mr-2" style={{ color: '#34A853' }}></i> Link</DropdownItem>
                        <DropdownItem onClick={() => handleAddAttachment('File')}><i className="ni ni-paperclip mr-2" style={{ color: '#F9AB00' }}></i> File</DropdownItem>
                        <DropdownItem onClick={() => handleAddAttachment('YouTube')}><i className="ni ni-youtube-play mr-2" style={{ color: '#EA4335' }}></i> YouTube</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                    <input type="file" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileChange} />
                    <div className="d-flex align-items-center" style={{ gap: 8 }}>
                      <Button color="secondary" outline style={{ borderRadius: 8, fontWeight: 600, minWidth: 90 }} onClick={e => { e.preventDefault(); setNewAnnouncement(''); setAttachments([]); }}>Cancel</Button>
                      <Dropdown isOpen={postDropdownOpen} toggle={() => setPostDropdownOpen(!postDropdownOpen)} direction="down">
                        <Button color="primary" type="submit" style={{ borderRadius: '8px 0 0 8px', fontWeight: 700, minWidth: 90, boxShadow: '0 2px 8px #1976d255' }} disabled={!newAnnouncement.trim()}>
                          Post
                        </Button>
                        <DropdownToggle color="primary" style={{ borderRadius: '0 8px 8px 0', fontWeight: 700, minWidth: 30, boxShadow: '0 2px 8px #1976d255', borderLeft: '1px solid #1565c0', padding: '0 0.75rem' }} caret disabled={!newAnnouncement.trim()}>
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem onClick={e => { e.preventDefault(); setShowScheduleModal(true); }}>Schedule</DropdownItem>
                          <DropdownItem onClick={e => { e.preventDefault(); handleSaveDraft(); }}>Save draft</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  </div>
                  {/* Link Modal */}
                  <Modal isOpen={showLinkModal} toggle={() => setShowLinkModal(false)} centered>
                    <div style={{ padding: '2rem' }}>
                      <h5 style={{ fontWeight: 700, marginBottom: 16 }}>Add Link</h5>
                      <InputGroup>
                        <InputGroupText><i className="ni ni-link-2" /></InputGroupText>
                        <Input type="url" placeholder="Paste a link..." value={linkInput} onChange={e => setLinkInput(e.target.value)} />
                      </InputGroup>
                      <div className="d-flex justify-content-end mt-3" style={{ gap: 8 }}>
                        <Button color="secondary" outline onClick={() => setShowLinkModal(false)}>Cancel</Button>
                        <Button color="primary" onClick={handleAddLink} disabled={!linkInput.trim()}>Add</Button>
                      </div>
                    </div>
                  </Modal>
                  {/* YouTube Modal */}
                  <Modal isOpen={showYouTubeModal} toggle={() => setShowYouTubeModal(false)} centered>
                    <div style={{ padding: '2rem' }}>
                      <h5 style={{ fontWeight: 700, marginBottom: 16 }}>Add YouTube Link</h5>
                      <InputGroup>
                        <InputGroupText><i className="ni ni-youtube-play" /></InputGroupText>
                        <Input type="url" placeholder="Paste a YouTube link..." value={youtubeInput} onChange={e => setYouTubeInput(e.target.value)} />
                      </InputGroup>
                      <div className="d-flex justify-content-end mt-3" style={{ gap: 8 }}>
                        <Button color="secondary" outline onClick={() => setShowYouTubeModal(false)}>Cancel</Button>
                        <Button color="primary" onClick={handleAddYouTube} disabled={!youtubeInput.trim()}>Add</Button>
                      </div>
                    </div>
                  </Modal>
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
                        <Button color="primary" onClick={handleSchedule} disabled={!scheduleDate || !scheduleTime || !newAnnouncement.trim()}>Schedule</Button>
                      </div>
                    </div>
                  </Modal>
                </Form>

                {/* Announcements List */}
                <div>
                  {announcements.map((announcement) => (
                    <Card key={announcement.id} className="mb-3" style={{ borderRadius: "12px" }}>
                      <CardBody>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="mb-1 font-weight-bold">
                            {announcement.title}
                            {announcement.isPinned && (
                              <Badge color="warning" className="ml-2">Pinned</Badge>
                            )}
                          </h6>
                          <small className="text-muted">{announcement.date}</small>
                        </div>
                        <p className="mb-2">{announcement.content}</p>
                        <small className="text-muted">Posted by {announcement.author}</small>
                      </CardBody>
                    </Card>
                  ))}
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
    </div>
  );
};

export default ClassroomDetail; 