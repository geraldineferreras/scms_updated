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
  ButtonGroup,
  Collapse
} from "reactstrap";
import classnames from "classnames";
import Header from "../../components/Headers/Header";
import "./Classroom.css";
import { FaEllipsisV, FaClipboardList, FaQuestionCircle, FaBook, FaRedo, FaFolder, FaPlus, FaPaperclip, FaSmile, FaRegThumbsUp, FaThumbsUp, FaUserPlus, FaRegFileAlt, FaCheck, FaTimes, FaSearch, FaRegCalendarAlt, FaTrash } from 'react-icons/fa';
import userDefault from '../../assets/img/theme/user-default.svg';
import Cropper from 'react-easy-crop';
import getCroppedImg from './utils/cropImage'; // We'll add this helper next

const themes = [
  { name: "Blue Gradient", value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", type: "Color Theme" },
  { name: "Purple Gradient", value: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", type: "Color Theme" },
  { name: "Green Gradient", value: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", type: "Color Theme" },
  { name: "Orange Gradient", value: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", type: "Color Theme" },
  { name: "Pink Gradient", value: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)", type: "Color Theme" },
  { name: "Aqua Gradient", value: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", type: "Color Theme" },
  { name: "Sunset", value: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)", type: "Color Theme" },
  { name: "Deep Blue", value: "linear-gradient(135deg, #232526 0%, #414345 100%)", type: "Color Theme" },
  // SVG Themes
  { name: "Classroom SVG", value: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDQwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3QgeD0iMzAiIHk9IjMwIiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjUwIiByeD0iOCIgZmlsbD0iIzQ0NGI1YSIvPjxyZWN0IHg9IjUwIiB5PSI4MCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjEyIiByeD0iMyIgZmlsbD0iIzE5NzZkMiIvPjxyZWN0IHg9IjE3MCIgeT0iNjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSIyMCIgcng9IjQiIGZpbGw9IiNmOWRjNWMiLz48cmVjdCB4PSIxODAiIHk9Ijc1IiB3aWR0aD0iMjAiIGhlaWdodD0iNiIgcng9IjIiIGZpbGw9IiNmZmI0YTIiLz48cmVjdCB4PSIyMzAiIHk9IjgwIiB3aWR0aD0iNTAiIGhlaWdodD0iMTAiIHJ4PSIyIiBmaWxsPSIjMTk3NmQyIi8+PHJlY3QgeD0iMjQwIiB5PSI2MCIgd2lkdGg9IjMwIiBoZWlnaHQ9IjE1IiByeD0iMiIgZmlsbD0iI2Y5ZGM1YyIvPjxyZWN0IHg9IjMyMCIgeT0iNDAiIHdpZHRoPSI1MCIgaGVpZ2h0PSIzNSIgcng9IjUiIGZpbGw9IiM0NDRiNWEiLz48cmVjdCB4PSIzMzAiIHk9IjcwIiB3aWR0aD0iMzAiIGhlaWdodD0iNyIgcng9IjIiIGZpbGw9IiMxOTc2ZDIiLz48cmVjdCB4PSIzNDAiIHk9IjUwIiB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHJ4PSIyIiBmaWxsPSIjZjlkYzVjIi8+PC9zdmc+')", type: "SVG Theme" },
  { name: "Books SVG", value: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDQwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3QgeD0iNjAiIHk9IjYwIiB3aWR0aD0iMzAiIGhlaWdodD0iNDAiIHJ4PSI2IiBmaWxsPSIjNGNhZjUwIi8+PHJlY3QgeD0iMTAwIiB5PSI3MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjMwIiByeD0iNCIgZmlsbD0iI2Y5ZGM1YyIvPjxyZWN0IHg9IjE0MCIgeT0iODAiIHdpZHRoPSI0MCIgaGVpZ2h0PSIyMCIgcng9IjQiIGZpbGw9IiMxOTc2ZDIiLz48L3N2Zz4=')", type: "SVG Theme" },
  // Existing image/photo themes
  { name: "Night Sky", value: "url('https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80')", type: "Photo" },
  { name: "Books Image", value: "url('https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80')", type: "Photo" },
  { name: "Mountains", value: "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80')", type: "Photo" },
  { name: "Classroom", value: "url('https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&q=80')", type: "Photo" },
  { name: "Abstract", value: "url('https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=600&q=80')", type: "Photo" },
  { name: "Notebook", value: "url('https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80')", type: "Photo" }
];

// Sample data for tabs
const sampleAnnouncements = [
  {
    id: 1,
    title: "Welcome to the new semester!",
    content: "I'm excited to start this journey with all of you. Let's make this semester productive and engaging.",
    author: "Prof. Smith",
    date: "2024-01-15",
    isPinned: true,
    reactions: { like: 2, likedBy: ["Prof. Smith", "John Doe"] }
  },
  {
    id: 2,
    title: "Assignment #1 Due Date Extended",
    content: "Due to technical difficulties, the deadline for Assignment #1 has been extended to Friday, January 20th.",
    author: "Prof. Smith",
    date: "2024-01-14",
    isPinned: false,
    reactions: { like: 0, likedBy: [] }
  },
  {
    id: 3,
    title: "Class Schedule Update",
    content: "Starting next week, we'll have an additional lab session every Wednesday from 2-4 PM.",
    author: "Prof. Smith",
    date: "2024-01-13",
    isPinned: false,
    reactions: { like: 1, likedBy: ["Jane Smith"] }
  }
];

const sampleAssignments = [
  {
    id: 1,
    title: "Assignment #1: Basic Concepts",
    type: "Assignment",
    dueDate: "2024-01-20",
    points: 100,
    status: "active",
    comments: [],
    date: "2024-01-10T09:00:00.000Z",
    details: "Complete the basic concepts worksheet and upload your answers."
  },
  {
    id: 2,
    title: "Quiz #1: Introduction",
    type: "Quiz",
    dueDate: "2024-01-25",
    points: 50,
    status: "active",
    comments: [],
    date: "2024-01-15T10:00:00.000Z",
    details: "Short quiz covering the introduction chapter."
  },
  {
    id: 3,
    title: "Project Proposal",
    type: "Project",
    dueDate: "2024-02-01",
    points: 200,
    status: "active",
    comments: [],
    date: "2024-01-18T11:00:00.000Z",
    details: "Submit your project proposal for review."
  }
];

const sampleStudents = [
  { id: 1, name: "John Doe", email: "john.doe@student.edu", role: "Student", joinedDate: "2024-01-10" },
  { id: 2, name: "Jane Smith", email: "jane.smith@student.edu", role: "Student", joinedDate: "2024-01-10" },
  { id: 3, name: "Mike Johnson", email: "mike.johnson@student.edu", role: "Student", joinedDate: "2024-01-11", profile_pic: "https://randomuser.me/api/portraits/men/75.jpg" },
  { id: 4, name: "Sarah Wilson", email: "sarah.wilson@student.edu", role: "Student", joinedDate: "2024-01-12" },
  { id: 5, name: "David Brown", email: "david.brown@student.edu", role: "Student", joinedDate: "2024-01-13" },
  { id: 6, name: "Sarah Lee", email: "sarah.lee@student.edu", role: "Student", joinedDate: "2024-01-14", profile_pic: "https://randomuser.me/api/portraits/women/44.jpg" },
  { id: 7, name: "David Kim", email: "david.kim@student.edu", role: "Student", joinedDate: "2024-01-15", profile_pic: "https://randomuser.me/api/portraits/men/65.jpg" },
  { id: 8, name: "Emily Chen", email: "emily.chen@student.edu", role: "Student", joinedDate: "2024-01-16", profile_pic: "https://randomuser.me/api/portraits/women/68.jpg" },
  { id: 9, name: "Carlos Ramirez", email: "carlos.ramirez@student.edu", role: "Student", joinedDate: "2024-01-17", profile_pic: "https://randomuser.me/api/portraits/men/23.jpg" },
  { id: 10, name: "Priya Patel", email: "priya.patel@student.edu", role: "Student", joinedDate: "2024-01-18", profile_pic: "https://randomuser.me/api/portraits/women/12.jpg" },
  { id: 11, name: "Alex Brown", email: "alex.brown@student.edu", role: "Student", joinedDate: "2024-01-19", profile_pic: "https://randomuser.me/api/portraits/men/41.jpg" },
  { id: 12, name: "Linda Nguyen", email: "linda.nguyen@student.edu", role: "Student", joinedDate: "2024-01-20", profile_pic: "https://randomuser.me/api/portraits/women/29.jpg" },
  { id: 13, name: "Olivia Garcia", email: "olivia.garcia@student.edu", role: "Student", joinedDate: "2024-01-21", profile_pic: "https://randomuser.me/api/portraits/women/50.jpg" },
  { id: 14, name: "Ethan Martinez", email: "ethan.martinez@student.edu", role: "Student", joinedDate: "2024-01-22", profile_pic: "https://randomuser.me/api/portraits/men/52.jpg" },
  { id: 15, name: "Sophia Lee", email: "sophia.lee@student.edu", role: "Student", joinedDate: "2024-01-23", profile_pic: "https://randomuser.me/api/portraits/women/60.jpg" },
  { id: 16, name: "Benjamin Clark", email: "benjamin.clark@student.edu", role: "Student", joinedDate: "2024-01-24", profile_pic: "https://randomuser.me/api/portraits/men/61.jpg" },
  { id: 17, name: "Mia Rodriguez", email: "mia.rodriguez@student.edu", role: "Student", joinedDate: "2024-01-25", profile_pic: "https://randomuser.me/api/portraits/women/65.jpg" },
  { id: 18, name: "William Scott", email: "william.scott@student.edu", role: "Student", joinedDate: "2024-01-26", profile_pic: "https://randomuser.me/api/portraits/men/67.jpg" },
  { id: 19, name: "Ava Turner", email: "ava.turner@student.edu", role: "Student", joinedDate: "2024-01-27", profile_pic: "https://randomuser.me/api/portraits/women/70.jpg" },
  { id: 20, name: "James Harris", email: "james.harris@student.edu", role: "Student", joinedDate: "2024-01-28", profile_pic: "https://randomuser.me/api/portraits/men/72.jpg" },
  { id: 21, name: "Ella Walker", email: "ella.walker@student.edu", role: "Student", joinedDate: "2024-01-29", profile_pic: "https://randomuser.me/api/portraits/women/73.jpg" },
  { id: 22, name: "Lucas Young", email: "lucas.young@student.edu", role: "Student", joinedDate: "2024-01-30", profile_pic: "https://randomuser.me/api/portraits/men/74.jpg" }
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

// Add this above the ClassroomDetail component definition
const useClickOutside = (ref, handler, when) => {
  useEffect(() => {
    if (!when) return;
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler, when]);
};

// Utility: Format date as relative time (like Facebook)
function formatRelativeTime(dateString) {
  if (!dateString) return '';
  const now = new Date();
  const date = new Date(dateString);
  const diff = (now - date) / 1000; // seconds
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
  // Otherwise, show full date (e.g., June 24, 2025)
  return date.toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric'
  });
}

// Microsoft Office file detection and preview helpers
const isMicrosoftFile = (fileName) => {
  if (!fileName) return false;
  const ext = fileName.split('.').pop().toLowerCase();
  const microsoftExts = [
    // Word
    'doc', 'docx', 'dot', 'dotx', 'docm', 'dotm',
    // Excel
    'xls', 'xlsx', 'xlsm', 'xlsb', 'xlt', 'xltx', 'xltm', 'csv',
    // PowerPoint
    'ppt', 'pptx', 'pps', 'ppsx', 'pptm', 'potx', 'potm', 'ppsm'
  ];
  return microsoftExts.includes(ext);
};

const getMicrosoftFileType = (fileName) => {
  if (!fileName) return 'Office';
  const ext = fileName.split('.').pop().toLowerCase();
  
  // Word files
  if (['doc', 'docx', 'dot', 'dotx', 'docm', 'dotm'].includes(ext)) {
    return 'Word';
  }
  // Excel files
  if (['xls', 'xlsx', 'xlsm', 'xlsb', 'xlt', 'xltx', 'xltm', 'csv'].includes(ext)) {
    return 'Excel';
  }
  // PowerPoint files
  if (['ppt', 'pptx', 'pps', 'ppsx', 'pptm', 'potx', 'potm', 'ppsm'].includes(ext)) {
    return 'PowerPoint';
  }
  
  return 'Office';
};

const openMicrosoftOnline = async (file) => {
  try {
    // Convert file to base64 for Office Online
    const base64 = await fileToBase64(file);
    
    // Create Office Online URL
    const officeOnlineUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(base64)}`;
    
    // Open in new tab
    window.open(officeOnlineUrl, '_blank', 'noopener,noreferrer');
  } catch (error) {
    console.error('Error opening file in Office Online:', error);
    // Fallback to download
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  }
};

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

// Add this function for truncating text
const truncate = (str, n) => (str && str.length > n ? str.substr(0, n - 1) + '...' : str);

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
    points: '',
    details: '',
    attachments: [],
    assignedStudents: []
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

  // 2. Add state for modal and selected students
  const [showStudentSelectModal, setShowStudentSelectModal] = useState(false);
  const [selectedAnnouncementStudents, setSelectedAnnouncementStudents] = useState([]);

  // Add at the top of ClassroomDetail component:
  const [tempSelectedStudents, setTempSelectedStudents] = useState([]);
  
  // Current user - in a real app, this would come from user context
  const currentUser = "Prof. Smith";

  // Add at the top of ClassroomDetail component:
  const [commentDropdownOpen, setCommentDropdownOpen] = useState(null);

  // At the top of ClassroomDetail component:
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showDraftsCollapse, setShowDraftsCollapse] = useState(false);
  const [showScheduledCollapse, setShowScheduledCollapse] = useState(false);

  // Add this state at the top of ClassroomDetail component:
  const [classworkDropdownOpen, setClassworkDropdownOpen] = useState(null);

  // Add state for expanded classwork card
  const [expandedClassworkId, setExpandedClassworkId] = useState(null);

  // Add separate state for attachment dropdown in edit form
  const [editAttachmentDropdownOpen, setEditAttachmentDropdownOpen] = useState(false);

  // Add state for expanded classwork
  const [expandedClasswork, setExpandedClasswork] = useState(null);
  
  // Add state for assignment dropdowns
  const [assignmentDropdowns, setAssignmentDropdowns] = useState({});
  const [editClassworkData, setEditClassworkData] = useState({ title: '', details: '', dueDate: '', points: '', type: 'Assignment' });
  
  // Classwork creation attachment states
  const [createAttachmentDropdownOpen, setCreateAttachmentDropdownOpen] = useState(false);
  const [showCreateLinkModal, setShowCreateLinkModal] = useState(false);
  const [showCreateYouTubeModal, setShowCreateYouTubeModal] = useState(false);
  const [showCreateDriveModal, setShowCreateDriveModal] = useState(false);
  const [showCreateStudentSelectModal, setShowCreateStudentSelectModal] = useState(false);
  const [createLinkInput, setCreateLinkInput] = useState("");
  const [createYouTubeInput, setCreateYouTubeInput] = useState("");
  const [createDriveInput, setCreateDriveInput] = useState("");
  const createFileInputRef = useRef();

  // Add state for edit attachment modals
  const [showEditLinkModal, setShowEditLinkModal] = useState(false);
  const [showEditYouTubeModal, setShowEditYouTubeModal] = useState(false);
  const [showEditDriveModal, setShowEditDriveModal] = useState(false);
  const [editLinkInput, setEditLinkInput] = useState("");
  const [editYouTubeInput, setEditYouTubeInput] = useState("");
  const [editDriveInput, setEditDriveInput] = useState("");
  const [editLinkError, setEditLinkError] = useState("");
  const editFileInputRef = useRef();

  // Add state for edit announcement student selection
  const [showEditStudentSelectModal, setShowEditStudentSelectModal] = useState(false);
  const [editSelectedStudents, setEditSelectedStudents] = useState([]);

  // 3. In handlePostAnnouncement, save both title and content
  const handlePostAnnouncement = (e) => {
    e.preventDefault();
    if ((newAnnouncement && newAnnouncement.trim().length > 0) || attachments.length > 0) {
      const announcement = {
        id: Date.now(),
        title: newAnnouncementTitle,
        content: newAnnouncement,
        author: "Prof. Smith",
        date: new Date().toISOString(),
        isPinned: false,
        attachments,
        year: selectedYear,
        audience: selectedAudience,
        originalIndex: announcements.length,
        comments: [],
        allowComments,
        reactions: { like: 0, likedBy: [] },
        visibleTo: selectedAnnouncementStudents,
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
        ? { ...a, comments: (a.comments || []).concat({ text: comment, author: "Prof. Smith", date: new Date().toISOString() }) }
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

  // Ensure all announcements have reactions property
  useEffect(() => {
    setAnnouncements(prev => prev.map(announcement => {
      if (!announcement.reactions) {
        return { ...announcement, reactions: { like: 0, likedBy: [] } };
      }
      if (!announcement.reactions.likedBy) {
        return { ...announcement, reactions: { ...announcement.reactions, likedBy: [] } };
      }
      return announcement;
    }));
  }, []);

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
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new window.Image();
        img.onload = () => {
          // Resize if too large
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
      console.log('Cropping with:', { cropImage, croppedAreaPixels });
      const croppedImg = await getCroppedImg(cropImage, croppedAreaPixels);
      // Save croppedImg as custom photo (base64)
      setShowThemeModal(false);
      setCropModalOpen(false);
      setCropImage(null);
      // Set as selected theme (simulate upload)
      handleSelectTheme(croppedImg);
    } catch (e) {
      alert('Failed to crop image');
    }
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
    let formatted = url;
    let valid = false;
    try {
      const urlObj = new URL(formatted);
      if (urlObj.protocol && urlObj.hostname) valid = true;
    } catch {}
    if (!valid) {
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
    if (editingClassworkId) {
      setEditClassworkAttachments(prev => [...prev, { type: "Link", url: formatted }]);
    } else {
      setAttachments(prev => [...prev, { type: "Link", url: formatted }]);
    }
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
    if (newAnnouncement.trim() || newAnnouncementTitle.trim() || attachments.length > 0) {
      setDrafts([
        ...drafts,
        {
          text: newAnnouncement,
          title: newAnnouncementTitle,
          attachments,
          year: selectedYear,
          audience: selectedAudience,
          visibleTo: selectedAnnouncementStudents,
          lastEdited: new Date().toISOString()
        }
      ]);
      setNewAnnouncement("");
      setNewAnnouncementTitle("");
      setAttachments([]);
      setSelectedAnnouncementStudents([]);
      alert("Draft saved!");
    }
  };

  const handleCreateChange = e => setCreateForm({ ...createForm, [e.target.name]: e.target.value });
  const handleInviteChange = e => setInviteForm({ ...inviteForm, [e.target.name]: e.target.value });
  const handleGradeChange = e => setGradeForm({ ...gradeForm, [e.target.name]: e.target.value });

  const handleCreateSubmit = e => {
    e.preventDefault();
    if (createForm.type && createForm.title) {
      const newClasswork = {
        id: Date.now(),
        ...createForm,
        author: "Prof. Smith",
        date: new Date().toISOString(),
        comments: [],
        // Only include dueDate and points if they have values
        ...(createForm.dueDate && { dueDate: createForm.dueDate }),
        ...(createForm.points && { points: createForm.points })
      };
      
      setAssignments([...assignments, newClasswork]);
      setShowCreateModal(false);
      setCreateForm({ type: '', title: '', dueDate: '', points: '', details: '', attachments: [], assignedStudents: [] });
      setCreateType('');
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

  const handleClassworkDropdownToggle = (id) => {
    setAssignmentDropdowns((prev) => ({ ...prev, [id]: !prev[id] }));
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
    // Set the current selected students for editing
    setEditSelectedStudents(ann.visibleTo || []);
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
      allowComments: editAnnouncementData.allowComments !== false,
      visibleTo: editSelectedStudents
    } : a));
    setEditingAnnouncementId(null);
    setEditAnnouncementData({ title: '', content: '', attachments: [], allowComments: true });
    setEditSelectedStudents([]);
  };

  const handleCancelEditAnnouncement = () => {
    setEditingAnnouncementId(null);
    setEditAnnouncementData({ title: '', content: '', attachments: [], allowComments: true });
    setEditSelectedStudents([]);
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
  const [editingCommentText, setEditingCommentText] = useState({}); // { [itemId-idx]: text }
  const [showEmojiPicker, setShowEmojiPicker] = useState({}); // { [announcementId]: bool }
  const [showEditEmojiPicker, setShowEditEmojiPicker] = useState({}); // { [announcementId-commentIdx]: bool }
  const emojiList = [
    "😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", "😋", "😎", "😍", "😘", "🥰", "😗", "😙", "😚", "🙂", "🤗", "🤩", "🤔", "🤨", "😐", "😑", "😶", "🙄", "😏", "😣", "😥", "😮", "🤐", "😯", "😪", "😫", "🥱", "😴", "😌", "😛", "😜", "😝", "🤤", "😒", "😓", "😔", "😕", "🙃", "🤑", "😲", "☹️", "🙁", "😖", "😞", "😟", "😤", "😢", "😭", "😦", "😧", "😨", "😩", "🤯", "😬", "😰", "😱", "🥵", "🥶", "😳", "🤪", "😵", "😡", "😠", "🤬", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "😇", "🥳", "🥺", "🤠", "🥸", "😈", "👿", "👹", "👺", "💀", "👻", "👽", "🤖", "💩", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾",
    // Heart emojis
    "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟"
  ];

  // 2. Edit comment handler
  const handleEditComment = (itemId, idx, text) => {
    setEditingComment({ [itemId]: idx });
    setEditingCommentText(prev => ({ ...prev, [`${itemId}-${idx}`]: text }));
  };

  // Update handleSaveEditComment to work with both announcements and classwork
  const handleSaveEditComment = (itemId, idx) => {
    const text = editingCommentText[`${itemId}-${idx}`] || "";
    // Check if item is in assignments (classwork)
    const classworkItem = assignments.find(a => a.id === itemId);
    if (classworkItem) {
      setAssignments(prev => prev.map(a =>
        a.id === itemId
          ? { ...a, comments: (a.comments || []).map((c, i) => i === idx ? { ...c, text } : c) }
          : a
      ));
    } else {
      // Otherwise, update announcements
      setAnnouncements(prev => prev.map(a =>
        a.id === itemId
          ? { ...a, comments: (a.comments || []).map((c, i) => i === idx ? { ...c, text } : c) }
          : a
      ));
    }
    setEditingComment({});
    setEditingCommentText(prev => {
      const newObj = { ...prev };
      delete newObj[`${itemId}-${idx}`];
      return newObj;
    });
  };

  const handleCancelEditComment = (itemId, idx) => {
    setEditingComment({});
    setEditingCommentText(prev => {
      const newObj = { ...prev };
      delete newObj[`${itemId}-${idx}`];
      return newObj;
    });
  };

  // 3. Delete comment handler
  const handleDeleteComment = (itemId, idx) => {
    if (!window.confirm("Delete this comment?")) return;
    // Check if item is in assignments (classwork)
    const classworkItem = assignments.find(a => a.id === itemId);
    if (classworkItem) {
      setAssignments(prev => prev.map(a =>
        a.id === itemId
          ? { ...a, comments: (a.comments || []).filter((_, i) => i !== idx) }
          : a
      ));
    } else {
      // Otherwise, update announcements
      setAnnouncements(prev => prev.map(a =>
        a.id === itemId
          ? { ...a, comments: (a.comments || []).filter((_, i) => i !== idx) }
          : a
      ));
    }
  };

  const handleLikeAnnouncement = (announcementId) => {
    setAnnouncements(prev => prev.map(a => {
      if (a.id === announcementId) {
        const reactions = a.reactions || { like: 0, likedBy: [] };
        const likedBy = reactions.likedBy || [];
        const hasLiked = likedBy.includes(currentUser);
        
        if (hasLiked) {
          // Unlike: remove user from likedBy and decrease count
          const newLikedBy = likedBy.filter(user => user !== currentUser);
          return {
            ...a,
            reactions: {
              ...reactions,
              like: reactions.like - 1,
              likedBy: newLikedBy
            }
          };
        } else {
          // Like: add user to likedBy and increase count
          return {
            ...a,
            reactions: {
              ...reactions,
              like: reactions.like + 1,
              likedBy: [...likedBy, currentUser]
            }
          };
        }
      }
      return a;
    }));
  };
  // 4. Emoji picker for comment input
  const handleAddEmojiToInput = (announcementId, emoji) => {
    setCommentInputs(inputs => ({ ...inputs, [announcementId]: (inputs[announcementId] || "") + emoji }));
    setShowEmojiPicker(picker => ({ ...picker, [announcementId]: false }));
  };

  // Add handlers for edit attachments
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

  // Edit attachment handlers
  const handleEditAddAttachment = (type) => {
    if (type === "Google Drive") {
      alert("Google Drive integration coming soon!");
    } else if (type === "Link") {
      setShowEditLinkModal(true);
    } else if (type === "File") {
      editFileInputRef.current.click();
    } else if (type === "YouTube") {
      setShowEditYouTubeModal(true);
    }
  };

  const handleEditAddLink = () => {
    let url = editLinkInput.trim();
    setEditLinkError("");
    if (!url) {
      setEditLinkError("Please enter a link URL");
      return;
    }
    let formatted = url;
    let valid = false;
    try {
      const urlObj = new URL(formatted);
      if (urlObj.protocol && urlObj.hostname) valid = true;
    } catch {}
    if (!valid) {
      if (/[^a-zA-Z0-9.-]/.test(url)) {
        setEditLinkError("Please enter a valid URL or word (no spaces or special characters)");
        return;
      }
      formatted = `https://${url}.com`;
      try {
        const urlObj = new URL(formatted);
        if (urlObj.protocol && urlObj.hostname) valid = true;
      } catch {}
    }
    if (!valid) {
      setEditLinkError("Could not autoformat to a valid link. Please check your input.");
      return;
    }
    setEditAnnouncementData(prev => ({
      ...prev,
      attachments: [...(prev.attachments || []), { type: "Link", url: formatted }]
    }));
    setEditLinkInput("");
    setEditLinkError("");
    setShowEditLinkModal(false);
  };

  const handleEditAddYouTube = () => {
    if (editYouTubeInput.trim()) {
      setEditAnnouncementData(prev => ({
        ...prev,
        attachments: [...(prev.attachments || []), { type: "YouTube", url: editYouTubeInput }]
      }));
      setEditYouTubeInput("");
      setShowEditYouTubeModal(false);
    }
  };

  // 1. Add state for student search
  const [studentSearch, setStudentSearch] = useState("");

  // Inside ClassroomDetail component, before return
  const emojiDropdownRefs = useRef({});

  const [openEmojiPickerId, setOpenEmojiPickerId] = useState(null);

  // After emojiDropdownRefs and openEmojiPickerId, add this useEffect:
  useEffect(() => {
    if (openEmojiPickerId === null) return;
    const handleClick = (event) => {
      const ref = emojiDropdownRefs.current[openEmojiPickerId];
      if (ref && !ref.contains(event.target)) {
        setOpenEmojiPickerId(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [openEmojiPickerId]);

  // Add click outside handler for comment dropdown
  useEffect(() => {
    if (commentDropdownOpen === null) return;
    const handleClick = (event) => {
      setCommentDropdownOpen(null);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [commentDropdownOpen]);

  // Add after showEditEmojiPicker definition
  const editEmojiDropdownRefs = useRef({});
  useEffect(() => {
    function handleClickOutsideEditEmoji(event) {
      Object.keys(showEditEmojiPicker).forEach(key => {
        if (showEditEmojiPicker[key]) {
          const ref = editEmojiDropdownRefs.current[key];
          if (ref && !ref.contains(event.target)) {
            setShowEditEmojiPicker(picker => ({ ...picker, [key]: false }));
          }
        }
      });
    }
    if (Object.values(showEditEmojiPicker).some(Boolean)) {
      document.addEventListener('mousedown', handleClickOutsideEditEmoji);
      return () => document.removeEventListener('mousedown', handleClickOutsideEditEmoji);
    }
  }, [showEditEmojiPicker]);

  // Add state for createTypeSelector
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [createType, setCreateType] = useState('');
  const typeDropdownRef = useRef();

  // Close dropdown on outside click
  useEffect(() => {
    if (!showTypeDropdown) return;
    function handleClick(e) {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(e.target)) {
        setShowTypeDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showTypeDropdown]);

  // Add state for editing classwork
  const [editingClassworkId, setEditingClassworkId] = useState(null);
  const [editForm, setEditForm] = useState({ type: '', title: '', dueDate: '', points: '', details: '' });

  // Add state for edit classwork attachments
  const [editClassworkAttachments, setEditClassworkAttachments] = useState([]);
  const editClassworkFileInputRef = useRef();

  // Add state and handler for classwork comments at the top of the component
  const handlePostClassworkComment = (id) => {
    const comment = commentInputs[id]?.trim();
    if (!comment) return;
    setAssignments(prev => prev.map(a =>
      a.id === id
        ? { ...a, comments: (a.comments || []).concat({ text: comment, author: "Prof. Smith", date: new Date().toISOString() }) }
        : a
    ));
    setCommentInputs(inputs => ({ ...inputs, [id]: "" }));
  };

  // Add handlers for editing classwork
  const handleEditClasswork = (id) => {
    const assignment = assignments.find(a => a.id === id);
    setEditingClassworkId(id);
    setEditClassworkData({ 
      title: assignment.title, 
      details: assignment.details || '', 
      dueDate: assignment.dueDate || '',
      points: assignment.points || '',
      type: assignment.type || 'Assignment'
    });
  };

  const handleEditClassworkChange = (e) => {
    const { name, value } = e.target;
    setEditClassworkData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEditClasswork = (id) => {
    setAssignments(prev => prev.map(a => a.id === id ? { 
      ...a, 
      title: editClassworkData.title, 
      details: editClassworkData.details,
      dueDate: editClassworkData.dueDate,
      points: editClassworkData.points,
      type: editClassworkData.type
    } : a));
    setEditingClassworkId(null);
    setEditClassworkData({ title: '', details: '', dueDate: '', points: '', type: 'Assignment' });
  };

  const handleCancelEditClasswork = () => {
    setEditingClassworkId(null);
    setEditClassworkData({ title: '', details: '', dueDate: '', points: '', type: 'Assignment' });
  };

  const handleDeleteClasswork = (id) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
  };

  // Classwork creation attachment handlers
  const handleCreateFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setCreateForm(prev => ({
        ...prev,
        attachments: [...(prev.attachments || []), ...files.map(file => ({ name: file.name, file }))]
      }));
    }
    e.target.value = "";
  };

  const handleRemoveCreateAttachment = (idx) => {
    setCreateForm(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== idx)
    }));
  };

  const handleCreateAddLink = () => {
    let url = createLinkInput.trim();
    if (!url) return;
    
    let formatted = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      formatted = 'https://' + url;
    }
    
    setCreateForm(prev => ({
      ...prev,
      attachments: [...(prev.attachments || []), { name: url, url: formatted, type: "Link" }]
    }));
    setCreateLinkInput("");
    setShowCreateLinkModal(false);
  };

  const handleCreateAddYouTube = () => {
    let url = createYouTubeInput.trim();
    if (!url) return;
    
    // Extract video ID from YouTube URL
    let videoId = '';
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(youtubeRegex);
    if (match) {
      videoId = match[1];
    } else {
      videoId = url;
    }
    
    const formattedUrl = `https://www.youtube.com/watch?v=${videoId}`;
    
    setCreateForm(prev => ({
      ...prev,
      attachments: [...(prev.attachments || []), { name: `YouTube: ${videoId}`, url: formattedUrl, type: "YouTube" }]
    }));
    setCreateYouTubeInput("");
    setShowCreateYouTubeModal(false);
  };

  const handleCreateAddDrive = () => {
    let url = createDriveInput.trim();
    if (!url) return;
    
    setCreateForm(prev => ({
      ...prev,
      attachments: [...(prev.attachments || []), { name: `Google Drive: ${url}`, url: url, type: "Google Drive" }]
    }));
    setCreateDriveInput("");
    setShowCreateDriveModal(false);
  };

  const handleAddAssignedStudent = (studentId) => {
    setCreateForm(prev => ({
      ...prev,
      assignedStudents: [...(prev.assignedStudents || []), studentId]
    }));
  };

  const handleRemoveAssignedStudent = (studentId) => {
    setCreateForm(prev => ({
      ...prev,
      assignedStudents: prev.assignedStudents.filter(id => id !== studentId)
    }));
  };

  // Add state for cropping modal
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImage, setCropImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [minZoom, setMinZoom] = useState(1);

  useEffect(() => {
    if (!cropImage) return;
    const img = new window.Image();
    img.onload = () => {
      // Calculate the minimum zoom so the crop area never exceeds the image
      const aspect = 3.5 / 1; // or your aspect ratio
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

  const [pillRemoveHoverId, setPillRemoveHoverId] = useState(null);

  const [scheduled, setScheduled] = useState([]);

  const handleScheduleAnnouncement = () => {
    if (newAnnouncement.trim() && scheduleDate && scheduleTime) {
      setScheduled([
        ...scheduled,
        {
          text: newAnnouncement,
          title: newAnnouncementTitle,
          attachments,
          year: selectedYear,
          audience: selectedAudience,
          visibleTo: selectedAnnouncementStudents,
          scheduledFor: {
            date: scheduleDate,
            time: scheduleTime
          }
        }
      ]);
      setNewAnnouncement("");
      setNewAnnouncementTitle("");
      setAttachments([]);
      setSelectedAnnouncementStudents([]);
      setScheduleDate('');
      setScheduleTime('');
      setShowScheduleModal(false);
      alert("Announcement scheduled!");
    }
  };

  // Auto-post scheduled announcements when time is reached
  useEffect(() => {
    const checkScheduledAnnouncements = () => {
      const now = new Date();
      const currentTime = now.getTime();
      
      setScheduled(prevScheduled => {
        const newScheduled = [];
        const toPost = [];
        
        prevScheduled.forEach(item => {
          const scheduledDateTime = new Date(`${item.scheduledFor.date}T${item.scheduledFor.time}`);
          const scheduledTime = scheduledDateTime.getTime();
          
          if (currentTime >= scheduledTime) {
            toPost.push(item);
          } else {
            newScheduled.push(item);
          }
        });
        
        toPost.forEach(item => {
          const newAnnouncement = {
            id: Date.now() + Math.random(),
            title: item.title || 'Scheduled Announcement',
            content: item.text,
            author: "Prof. Smith",
            date: new Date().toISOString(),
            isPinned: false,
            reactions: { like: 0, likedBy: [] },
            attachments: item.attachments || [],
            year: item.year,
            audience: item.audience,
            visibleTo: item.visibleTo || []
          };
          setAnnouncements(prev => [newAnnouncement, ...prev]);
        });
        
        return newScheduled;
      });
    };
    
    const interval = setInterval(checkScheduledAnnouncements, 60000);
    checkScheduledAnnouncements();
    return () => clearInterval(interval);
  }, []);

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
          background: selectedTheme && selectedTheme.startsWith('data:image') ? `url('${selectedTheme}')` : selectedTheme,
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
          {/* Overlay for image themes and custom photo */}
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
              <i className="ni ni-archive-2 mr-2 text-info"></i> Classwork
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
                {activeTab === "stream" && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 8, gap: 2 }}>
                    <Button
                      onClick={() => { setShowScheduledCollapse(!showScheduledCollapse); setShowDraftsCollapse(false); }}
                      style={{
                        borderRadius: 6,
                        fontWeight: 500,
                        fontSize: 13,
                        padding: '4px 12px',
                        minHeight: 'auto',
                        lineHeight: 1.2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        background: showScheduledCollapse ? '#5E72E4' : '#fff',
                        color: showScheduledCollapse ? '#fff' : '#222',
                        border: showScheduledCollapse ? '1.5px solid #5E72E4' : '1.5px solid #222',
                        boxShadow: showScheduledCollapse ? '0 2px 8px #324cdd22' : 'none',
                        transition: 'all 0.15s'
                      }}
                    >
                      <FaRegCalendarAlt style={{ fontSize: 15, marginRight: 4 }} /> Scheduled
                    </Button>
                    <Button
                      onClick={() => { setShowDraftsCollapse(!showDraftsCollapse); setShowScheduledCollapse(false); }}
                      style={{
                        borderRadius: 6,
                        fontWeight: 500,
                        fontSize: 13,
                        padding: '4px 12px',
                        minHeight: 'auto',
                        lineHeight: 1.2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        background: showDraftsCollapse ? '#5E72E4' : '#fff',
                        color: showDraftsCollapse ? '#fff' : '#222',
                        border: showDraftsCollapse ? '1.5px solid #5E72E4' : '1.5px solid #222',
                        boxShadow: showDraftsCollapse ? '0 2px 8px #324cdd22' : 'none',
                        transition: 'all 0.15s'
                      }}
                    >
                      <FaRegFileAlt style={{ fontSize: 15, marginRight: 4 }} /> Drafts
                    </Button>
                  </div>
                )}
                {activeTab === "stream" && showScheduledCollapse && (
                  <Collapse isOpen={showScheduledCollapse}>
                    <Card style={{ marginBottom: 16, borderRadius: 12, boxShadow: '0 2px 8px #324cdd11' }}>
                      <CardBody style={{ maxHeight: 320, overflowY: 'auto' }}>
                        <h5>Scheduled Announcements</h5>
                        {scheduled.length === 0 ? (
                          <div style={{ color: '#888' }}>No scheduled announcements.</div>
                        ) : (
                          [...scheduled].sort((a, b) => {
                            const aDate = new Date(a.scheduledFor?.date + ' ' + a.scheduledFor?.time);
                            const bDate = new Date(b.scheduledFor?.date + ' ' + b.scheduledFor?.time);
                            return aDate - bDate;
                          }).map((item, idx) => (
                            <div key={idx} 
                              style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between', 
                                padding: '8px 12px', // reduced padding
                                borderBottom: '1px solid #e9ecef', 
                                background: '#fff',
                                borderRadius: 8, // reduced radius
                                marginBottom: 6, // reduced margin
                                boxShadow: '0 1px 4px #324cdd08', // lighter shadow
                                cursor: 'default',
                                transition: 'background 0.13s',
                                fontFamily: 'inherit',
                                fontSize: 14, // reduced base font size
                                color: '#232b3b',
                                fontWeight: 600
                              }}
                            >
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 700, fontSize: 15, color: '#232b3b', marginBottom: 2, fontFamily: 'inherit', letterSpacing: 0.5 }}>{item.title || '(No Title)'}</div>
                                <div style={{ fontWeight: 500, fontSize: 13, color: '#232b3b', opacity: 0.85, fontFamily: 'inherit', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 220 }}>
                                  {truncate(item.text, 60)}
                                </div>
                                <div style={{ fontSize: 11, color: '#8898AA', marginTop: 2 }}>
                                  Scheduled for {item.scheduledFor.date} at {item.scheduledFor.time}
                                </div>
                                <div style={{ fontSize: 11, color: '#888', display: 'flex', alignItems: 'center', gap: 8 }}>
                                  {/* Attachment count */}
                                  <span style={{ color: '#7D8FA9', fontWeight: 700, fontSize: 12 }}>
                                    <i className="fa fa-paperclip" style={{ marginRight: 3, fontSize: 12 }} />
                                    {item.attachments && item.attachments.length ? `${item.attachments.length} attachment${item.attachments.length !== 1 ? 's' : ''}` : 'No attachments'}
                                  </span>
                                  {/* Student count (always show) */}
                                  <span style={{ color: '#7D8FA9', fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center' }}>
                                    <i className="fa fa-users" style={{ marginRight: 3, fontSize: 12 }} />
                                    {item.visibleTo && item.visibleTo.length > 0
                                      ? `${item.visibleTo.length} student${item.visibleTo.length !== 1 ? 's' : ''} selected`
                                      : '0 students selected'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </CardBody>
                    </Card>
                  </Collapse>
                )}
                {activeTab === "stream" && (
                  <Collapse isOpen={showDraftsCollapse}>
                    <Card style={{ marginBottom: 16, borderRadius: 12, boxShadow: '0 2px 8px #324cdd11' }}>
                      <CardBody style={{ maxHeight: 320, overflowY: 'auto' }}>
                        <h5>Draft Announcements</h5>
                        {drafts.length === 0 ? (
                          <div style={{ color: '#888' }}>No drafts saved.</div>
                        ) : (
                          [...drafts].sort((a, b) => {
                            const aDate = new Date(a.lastEdited);
                            const bDate = new Date(b.lastEdited);
                            return bDate - aDate;
                          }).map((draft, idx) => (
                            <div key={idx} 
                              style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between', 
                                padding: '8px 12px', // reduced padding
                                borderBottom: '1px solid #e9ecef', 
                                background: '#fff',
                                borderRadius: 8, // reduced radius
                                marginBottom: 6, // reduced margin
                                boxShadow: '0 1px 4px #324cdd08', // lighter shadow
                                cursor: 'pointer',
                                transition: 'background 0.13s',
                                fontFamily: 'inherit',
                                fontSize: 14, // reduced base font size
                                color: '#232b3b',
                                fontWeight: 600
                              }}
                              onClick={() => {
                                setNewAnnouncement(draft.text || '');
                                setNewAnnouncementTitle(draft.title || '');
                                setAttachments(draft.attachments || []);
                                setSelectedAnnouncementStudents(draft.visibleTo || []);
                                setFormExpanded(true);
                                setShowDraftsCollapse(false);
                              }}
                            >
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 700, fontSize: 15, color: '#232b3b', marginBottom: 2, fontFamily: 'inherit', letterSpacing: 0.5 }}>{draft.title || '(No Title)'}</div>
                                <div style={{ fontWeight: 500, fontSize: 13, color: '#232b3b', opacity: 0.85, fontFamily: 'inherit', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 220 }}>
                                  {truncate(draft.text, 60)}
                                </div>
                                <div style={{ fontSize: 11, color: '#8898AA', marginTop: 2 }}>
                                  Last edited on {draft.lastEdited ? new Date(draft.lastEdited).toLocaleString() : ''}
                                </div>
                                <div style={{ fontSize: 11, color: '#888', display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                                  {/* Attachment count */}
                                  <span style={{ color: '#7D8FA9', fontWeight: 700, fontSize: 12 }}>
                                    <i className="fa fa-paperclip" style={{ marginRight: 3, fontSize: 12 }} />
                                    {draft.attachments && draft.attachments.length ? `${draft.attachments.length} attachment${draft.attachments.length !== 1 ? 's' : ''}` : 'No attachments'}
                                  </span>
                                  {/* Student count (always show) */}
                                  <span style={{ color: '#7D8FA9', fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center' }}>
                                    <i className="fa fa-users" style={{ marginRight: 3, fontSize: 12 }} />
                                    {draft.visibleTo && draft.visibleTo.length > 0
                                      ? `${draft.visibleTo.length} student${draft.visibleTo.length !== 1 ? 's' : ''} selected`
                                      : '0 students selected'}
                                  </span>
                                </div>
                              </div>
                              <FaTrash 
                                style={{ color: '#e74c3c', fontSize: 14, marginLeft: 12, flexShrink: 0, cursor: 'pointer' }} 
                                onClick={e => {
                                  e.stopPropagation();
                                  setDrafts(drafts.filter((_, i) => i !== idx));
                                }}
                              />
                            </div>
                          ))
                        )}
                      </CardBody>
                    </Card>
                  </Collapse>
                )}
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
                  <Form onSubmit={handlePostAnnouncement} style={{ marginBottom: 12 }}>
                  <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #324cdd11', padding: '1.5rem 1.5rem 1rem', marginBottom: 0, border: '1.5px solid #e9ecef', maxWidth: '100%', position: 'relative' }}>
                    {/* Add student button at top right */}
                    <div style={{ position: 'absolute', top: 24, right: 24, display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 8, zIndex: 2 }}>
                      {selectedAnnouncementStudents.length > 0 && (
                        <span style={{ background: '#e3eafe', color: '#324cdd', borderRadius: '50%', padding: '2px 8px', fontWeight: 700, fontSize: 11, minWidth: 18, minHeight: 18, textAlign: 'center', boxShadow: '0 2px 8px #324cdd11', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                          {selectedAnnouncementStudents.length}
                        </span>
                      )}
                      <Button color="secondary" style={{ borderRadius: 8, padding: '6px 12px', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 0, boxShadow: '0 2px 8px #324cdd11' }} onClick={() => { setTempSelectedStudents(selectedAnnouncementStudents); setShowStudentSelectModal(true); }}>
                        <FaUserPlus />
                      </Button>
                    </div>
                      <div style={{ marginBottom: 10, display: 'flex', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <input type="checkbox" id="allowComments" checked={allowComments} onChange={e => setAllowComments(e.target.checked)} style={{ marginRight: 8 }} />
                            <label htmlFor="allowComments" style={{ fontWeight: 500, fontSize: 16, color: '#222', margin: 0 }}>Allow comments</label>
                          </div>
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
                      <div className="d-flex w-100 action-row" style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: 16, flexWrap: 'wrap' }}>
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
                              <div ref={emojiPickerRef} className="create-emoji-dropdown" style={{ position: 'absolute', top: 40, left: 0, background: '#fff', border: '1px solid #e9ecef', borderRadius: 8, boxShadow: '0 2px 8px #324cdd22', padding: 8, zIndex: 10, minWidth: 280, maxWidth: 280, width: 280, maxHeight: 200, overflowY: 'auto' }}>
                                {emojiList.map(emoji => (
                                  <span key={emoji} style={{ fontSize: 22, cursor: 'pointer', margin: 4 }} onClick={() => {
                                    setNewAnnouncement(newAnnouncement + emoji);
                                    setEmojiPickerOpen(false);
                                  }}>{emoji}</span>
                                ))}
                                <style>{`
                                  @media (max-width: 600px) {
                                    .create-emoji-dropdown {
                                      min-width: 180px !important;
                                      max-width: 180px !important;
                                      width: 180px !important;
                                    }
                                  }
                                `}</style>
                              </div>
                            )}
                          </div>
                        </div>
             
                        <div className="d-flex align-items-center action-buttons" style={{ gap: 8 }}>
                          <Button color="secondary" className="cancel-btn-desktop" style={{ fontSize: 13, padding: '4px 18px', borderRadius: 8, display: 'block' }} onClick={e => { handleCancelPost(e); setFormExpanded(false); setAllowComments(true); setSelectedAnnouncementStudents([]); setTempSelectedStudents([]); setAttachments([]); setNewAnnouncement(''); setNewAnnouncementTitle(''); }}>Cancel</Button>
                          <Button color="primary" className="post-btn-desktop" type="submit" style={{ fontSize: 13, padding: '7px 28px', borderRadius: 8, fontWeight: 700, boxShadow: '0 2px 8px #667eea33', background: '#7b8cff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }} disabled={(!newAnnouncement || newAnnouncement.trim().length === 0) && attachments.length === 0}>
                            <i className="ni ni-send" style={{ fontSize: 16 }} />
                        </Button>
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          <Button
                            color="secondary"
                            style={{ borderRadius: 8, padding: '4px 10px', marginLeft: 0 }}
                            disabled={(!newAnnouncement && !newAnnouncementTitle && attachments.length === 0) || (!newAnnouncement.trim() && !newAnnouncementTitle.trim() && attachments.length === 0)}
                            onClick={() => setShowMoreMenu(!showMoreMenu)}
                          >
                            <span style={{ fontWeight: 'bold', fontSize: 18 }}>⋮</span>
                          </Button>
                          {showMoreMenu && (
                            <div style={{
                              position: 'absolute',
                              right: 0,
                              top: 45,
                              background: '#fff',
                              border: '1px solid #e9ecef',
                              borderRadius: 8,
                              boxShadow: '0 2px 8px #324cdd22',
                              zIndex: 100,
                              minWidth: 160
                            }}>
                              <Button
                                color="link"
                                style={{ width: '100%', textAlign: 'left', padding: '8px 16px', color: '#212529', fontWeight: 400, fontSize: 15, fontFamily: 'inherit', letterSpacing: 0, background: 'none', border: 'none', marginRight: 0, marginLeft: 0 }}
                                onClick={() => {
                                  setShowMoreMenu(false);
                                  setShowScheduleModal(true);
                                }}
                              >
                                Schedule
                              </Button>
                              <Button
                               color="link"
                               className="no-left-margin"
                               style={{ width: '100%', textAlign: 'left', padding: '8px 16px', color: '#212529', fontWeight: 400, fontSize: 15, fontFamily: 'inherit', letterSpacing: 0, background: 'none', border: 'none', marginRight: 0, marginLeft: 0}}
                               onClick={() => {
                                 setShowMoreMenu(false);
                                 handleSaveDraft();
                                }}
                              >
                               Save as Draft
                              </Button>
                    </div>
                          )}
                  </div>
                      </div>
                    </div>
                    {/* Mobile-only Post and Cancel buttons inside the Form */}
                    <div className="cancel-btn-mobile-row" style={{ display: 'none', width: '100%', marginTop: 20, justifyContent: 'flex-end', gap: 8 }}>
                      <Button color="secondary" className="cancel-btn-mobile" style={{ fontSize: 13, padding: '4px 18px', borderRadius: 8 }} onClick={e => { handleCancelPost(e); setFormExpanded(false); setAllowComments(true); setSelectedAnnouncementStudents([]); setTempSelectedStudents([]); setAttachments([]); setNewAnnouncement(''); setNewAnnouncementTitle(''); }}>Cancel</Button>
                      <Button color="primary" className="post-btn-mobile" type="submit" style={{ fontSize: 13, padding: '7px 28px', borderRadius: 8, fontWeight: 700, boxShadow: '0 2px 8px #667eea33', background: '#7b8cff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }} disabled={(!newAnnouncement || newAnnouncement.trim().length === 0) && attachments.length === 0}>
                        <i className="ni ni-send" style={{ fontSize: 16 }} />
                      </Button>
                      <div style={{ position: 'relative', display: 'inline-block' }} className="more-btn-mobile-wrapper">
                        <Button
                          color="secondary"
                          style={{ borderRadius: 8, padding: '4px 10px', marginLeft: 0 }}
                          disabled={(!newAnnouncement && !newAnnouncementTitle && attachments.length === 0) || (!newAnnouncement.trim() && !newAnnouncementTitle.trim() && attachments.length === 0)}
                          onClick={() => setShowMoreMenu(!showMoreMenu)}
                        >
                          <span style={{ fontWeight: 'bold', fontSize: 18 }}>⋮</span>
                        </Button>
                        {showMoreMenu && (
                          <div style={{
                            position: 'absolute',
                            right: 0,
                            top: 45,
                            background: '#fff',
                            border: '1px solid #e9ecef',
                            borderRadius: 8,
                            boxShadow: '0 2px 8px #324cdd22',
                            zIndex: 100,
                            minWidth: 160
                          }}>
                            <Button
                              color="link"
                              style={{ width: '100%', textAlign: 'left', padding: '8px 16px', color: '#212529', fontWeight: 400, fontSize: 15, fontFamily: 'inherit', letterSpacing: 0, background: 'none', border: 'none', marginRight: 0, marginLeft: 0 }}
                              onClick={() => {
                                setShowMoreMenu(false);
                                handleSaveDraft();
                              }}
                            >
                              Save as Draft
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    <style>{`
                    @media (max-width: 600px) {
                      .cancel-btn-desktop, .post-btn-desktop, .menu-btn-desktop { display: none !important; }
                      .cancel-btn-mobile-row { display: flex !important; }
                    }
                    `}</style>
                    {/* After the form controls in the expanded form, show attached files if any */}
                    {attachments.length > 0 && (
                      <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
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
                  
                </Form>
                 )} {/* Schedule Modal */}
                  <Modal isOpen={showScheduleModal} toggle={() => setShowScheduleModal(false)}>
                    <ModalHeader toggle={() => setShowScheduleModal(false)} style={{ fontWeight: 700, fontSize: 18 }}>Schedule Announcement</ModalHeader>
                    <ModalBody>
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ fontWeight: 600, fontSize: 15 }}>Date</label>
                        <Input type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} style={{ fontSize: 15, borderRadius: 8, border: '1px solid #bfcfff', background: '#fff', marginBottom: 8 }} />
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ fontWeight: 600, fontSize: 15 }}>Time</label>
                        <Input type="time" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} style={{ fontSize: 15, borderRadius: 8, border: '1px solid #bfcfff', background: '#fff' }} />
                    </div>
                    </ModalBody>
                    <ModalFooter>
                      <Button color="secondary" onClick={() => setShowScheduleModal(false)}>Cancel</Button>
                      <Button color="primary" onClick={handleScheduleAnnouncement} disabled={!scheduleDate || !scheduleTime || !newAnnouncement.trim()}>Schedule</Button>
                    </ModalFooter>
                  </Modal>
                {/* Announcements List */}
                <div style={{ marginTop: 48 }}>
                  {announcements.map((announcement) => {
                    const authorUser = findUserByName(announcement.author);
                    const avatarSrc = getAvatarForUser(authorUser);
                    const isEditing = editingAnnouncementId === announcement.id;
                    return (
                      <Card key={announcement.id} className="mb-4" style={{ borderRadius: 12, boxShadow: '0 2px 8px #324cdd11', borderLeft: announcement.isPinned ? '4px solid #f7b731' : '4px solid #324cdd', background: '#fff', transition: 'box-shadow 0.2s, border-color 0.2s', padding: 0 }}>
                        <CardBody style={{ padding: '0.75rem 1rem' }}>
                          <div className="d-flex align-items-center justify-content-between" style={{ marginBottom: 8 }}>
                            <div className="d-flex align-items-center" style={{ gap: 8 }}>
                              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginTop: -4 }}>
                                <img src={avatarSrc} alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
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
                            <div className="d-flex align-items-center" style={{ marginLeft: 12, flexShrink: 0 }}>
                              <Button 
                                color="link" 
                                style={{ 
                                  color: (announcement.reactions?.likedBy || []).includes("Prof. Smith") ? '#007bff' : '#000', 
                                  fontSize: 12, 
                                  padding: 2, 
                                  marginRight: 16 
                                }} 
                                onClick={() => handleLikeAnnouncement(announcement.id)}
                                aria-label="Like announcement"
                              >
                                {(announcement.reactions?.likedBy || []).includes("Prof. Smith") ? 
                                  <FaThumbsUp size={12} /> : 
                                  <FaRegThumbsUp size={12} />
                                } 
                                <span style={{ fontSize: 11, marginLeft: 2 }}>
                                  {(announcement.reactions && announcement.reactions.like) || 0}
                                </span>
                              </Button>
                              <Dropdown isOpen={announcementDropdowns[announcement.id]} toggle={() => handleDropdownToggle(announcement.id)}>
                                <DropdownToggle tag="span" style={{ cursor: 'pointer', padding: 2, border: 'none', background: 'none' }}>
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
                                style={{ fontWeight: 700, fontSize: 14, color: '#111', marginBottom: 6, border: '1px solid #e9ecef', borderRadius: 5, padding: '4px 10px', width: '100%' }}
                                placeholder="Announcement title (optional)"
                              />
                              {/* Editable content textarea */}
                              <textarea
                                name="content"
                                value={editAnnouncementData.content}
                                onChange={handleEditAnnouncementChange}
                                style={{ fontSize: 14, color: '#2d3748', border: '1px solid #e9ecef', borderRadius: 5, padding: 8, width: '100%', minHeight: 80, marginBottom: 8 }}
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
                                <Dropdown isOpen={editAttachmentDropdownOpen} toggle={() => setEditAttachmentDropdownOpen(!editAttachmentDropdownOpen)}>
                                  <DropdownToggle color="secondary" size="sm" style={{ fontSize: 14, borderRadius: 8, padding: '4px 14px' }}>
                                  <FaPaperclip style={{ marginRight: 6 }} /> Add Attachment
                                  </DropdownToggle>
                                  <DropdownMenu>
                                    <DropdownItem onClick={() => { setEditAttachmentDropdownOpen(false); editFileInputRef.current.click(); }}>
                                      <i className="ni ni-single-copy-04" style={{ marginRight: 8 }} /> File
                                    </DropdownItem>
                                    <DropdownItem onClick={() => { setShowEditLinkModal(true); setEditAttachmentDropdownOpen(false); }}>
                                      <i className="ni ni-world-2" style={{ marginRight: 8 }} /> Link
                                    </DropdownItem>
                                    <DropdownItem onClick={() => { setShowEditYouTubeModal(true); setEditAttachmentDropdownOpen(false); }}>
                                      <i className="ni ni-video-camera-2" style={{ marginRight: 8 }} /> YouTube
                                    </DropdownItem>
                                    <DropdownItem onClick={() => { setShowEditDriveModal(true); setEditAttachmentDropdownOpen(false); }}>
                                      <i className="ni ni-cloud-upload-96" style={{ marginRight: 8 }} /> Google Drive
                                    </DropdownItem>
                                  </DropdownMenu>
                                </Dropdown>
                                {/* Allow comments checkbox below attachments */}
                                <div style={{ marginTop: 12, marginBottom: 0 }}>
                                  <input type="checkbox" id="editAllowComments" checked={editAnnouncementData.allowComments !== false} onChange={e => setEditAnnouncementData(prev => ({ ...prev, allowComments: e.target.checked }))} style={{ marginRight: 8 }} />
                                  <label htmlFor="editAllowComments" style={{ fontWeight: 500, fontSize: 14, color: '#444', marginRight: 16 }}>Allow comments</label>
                                </div>
                              </div>
                              {/* Student selection for edit announcement */}
                              <div style={{ marginTop: 16, marginBottom: 16 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                  <i className="ni ni-single-02" style={{ fontSize: 16, color: '#666' }} />
                                  <span style={{ fontWeight: 600, fontSize: 14, color: '#111' }}>
                                    Who can view this announcement?
                                    {editSelectedStudents.length > 0 && (
                                      <span style={{ background: '#e3eafe', color: '#324cdd', borderRadius: '50%', padding: '2px 8px', fontWeight: 700, fontSize: 11, minWidth: 18, minHeight: 18, textAlign: 'center', boxShadow: '0 2px 8px #324cdd11', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginLeft: 8 }}>
                                        {editSelectedStudents.length}
                                      </span>
                                    )}
                                  </span>
                                </div>
                                <Button 
                                  color="light" 
                                  size="sm" 
                                  onClick={() => { setTempSelectedStudents(editSelectedStudents); setShowEditStudentSelectModal(true); }}
                                  style={{ fontSize: 13, borderRadius: 6, padding: '4px 12px' }}
                                >
                                  <i className="ni ni-fat-add" style={{ marginRight: 4 }} />
                                  {editSelectedStudents.length > 0 ? 'Edit students' : 'Select students'}
                                </Button>
                              </div>
                              {/* Save/Cancel buttons */}
                              <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: 16, marginBottom: 12 }}>
                                <Button color="success" size="sm" onClick={() => handleSaveEditAnnouncement(announcement.id)} style={{ fontSize: 13, padding: '4px 18px', borderRadius: 8, marginRight: 8 }}>Save</Button>
                                <Button color="secondary" size="sm" onClick={handleCancelEditAnnouncement} style={{ fontSize: 13, padding: '4px 18px', borderRadius: 8 }}>Cancel</Button>
                              </div>
                            </>
                          ) : (
                            <>
                              {announcement.title && announcement.title.trim() !== "" && (
                                <h6 className="mb-1 font-weight-bold" style={{ color: '#111', fontSize: 14, letterSpacing: 0.1, marginBottom: 6 }}>
                                  {announcement.title}
                                </h6>
                              )}
                              <p className="mb-2" style={{ fontSize: 14, color: '#2d3748', marginBottom: 2, lineHeight: 1.2 }}>{announcement.content}</p>
                              {!isEditing && announcement.attachments && announcement.attachments.length > 0 && (
                                <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
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
                                            {url && <>&bull; <a href={url} download={att.name} style={{ color: color, fontWeight: 600, textDecoration: 'none' }}>Download</a></>}
                                            {isLink && <>&bull; <a href={att.url} target="_blank" rel="noopener noreferrer" style={{ color: color, fontWeight: 600, textDecoration: 'none' }}>View Link</a></>}
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
                                  {/* Input for new comment */}
                                  <div className="d-flex comment-input-row" style={{ gap: 8, position: 'relative', marginTop: 0, marginBottom: 4 }}>
                                    <input
                                      type="text"
                                      className="form-control"
                                      style={{ fontSize: 10, borderRadius: 6, border: '1px solid #bfcfff', background: '#fff', height: '32px', padding: '4px 8px' }}
                                      placeholder="Add a comment..."
                                      value={commentInputs[announcement.id] || ""}
                                      onChange={e => setCommentInputs(inputs => ({ ...inputs, [announcement.id]: e.target.value }))}
                                      onKeyDown={e => { if (e.key === 'Enter') handlePostComment(announcement.id); }}
                                    />
                                    {/* Desktop only: emoji and post button */}
                                    <div className="comment-emoji-btn-desktop-container" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8 }}>
                                      <button
                                        type="button"
                                        className="btn btn-secondary comment-emoji-btn-desktop"
                                        style={{ fontSize: 14, borderRadius: 6, padding: '3px 10px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        onClick={e => {
                                          e.stopPropagation();
                                          if (openEmojiPickerId === announcement.id) {
                                            setOpenEmojiPickerId(null);
                                          } else {
                                            setTimeout(() => setOpenEmojiPickerId(announcement.id), 0);
                                          }
                                        }}
                                      >
                                        <FaSmile style={{ fontSize: 14 }} />
                                      </button>
                                      {/* Desktop dropdown */}
                                      {openEmojiPickerId === announcement.id && (
                                        <div
                                          className="comment-emoji-dropdown-desktop"
                                          ref={el => { if (el && openEmojiPickerId === announcement.id) emojiDropdownRefs.current[announcement.id] = el; }}
                                          style={{ position: 'absolute', top: 40, left: -180, background: '#fff', border: '1px solid #e9ecef', borderRadius: 6, boxShadow: '0 2px 8px #324cdd22', zIndex: 10, width: 200, minWidth: 200, maxWidth: 200, maxHeight: 150, overflowY: 'auto', marginTop: 8, padding: 6 }}
                                        >
                                          {emojiList.map(emoji => (
                                            <span key={emoji} style={{ fontSize: 18, cursor: 'pointer', margin: 2, display: 'inline-block' }} onClick={() => handleAddEmojiToInput(announcement.id, emoji)}>{emoji}</span>
                                          ))}
                                        </div>
                                      )}
                                      <style>{`
                                        @media (min-width: 601px) {
                                          .comment-emoji-dropdown-desktop { display: block !important; }
                                        }
                                        @media (max-width: 600px) {
                                          .comment-emoji-dropdown-desktop { display: none !important; }
                                        }
                                      `}</style>
                                      <button
                                        className="btn btn-primary btn-sm comment-post-btn-desktop"
                                        style={{ fontSize: 14, borderRadius: 6, padding: '3px 10px', minWidth: '36px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        onClick={() => handlePostComment(announcement.id)}
                                        disabled={!(commentInputs[announcement.id] && commentInputs[announcement.id].trim())}
                                      >
                                        <i className="ni ni-send" style={{ fontSize: 14 }} />
                                      </button>
                                    </div>
                                    {/* Mobile only: emoji dropdown at left of comment box */}
                                    {openEmojiPickerId === announcement.id && (
                                      <div className="comment-emoji-dropdown-mobile" style={{ display: 'none', position: 'absolute', top: '100%', left: -45, background: '#fff', border: '1px solid #e9ecef', borderRadius: 6, boxShadow: '0 2px 8px #324cdd22', padding: 6, zIndex: 10, width: 160, minWidth: 160, maxWidth: 160, maxHeight: 150, overflowY: 'auto', marginTop: 55 }}>
                                        {emojiList.map(emoji => (
                                          <span key={emoji} style={{ fontSize: 18, cursor: 'pointer', margin: 2, display: 'inline-block' }} onClick={() => handleAddEmojiToInput(announcement.id, emoji)}>{emoji}</span>
                                        ))}
                                      </div>
                                    )}
                                    <style>{`
                                      @media (max-width: 600px) {
                                        .comment-emoji-dropdown-mobile {
                                          display: block !important;
                                          min-width: 160px !important;
                                          max-width: 160px !important;
                                          width: 160px !important;
                                        }
                                      }
                                      @media (min-width: 601px) {
                                        .comment-emoji-dropdown-mobile { display: none !important; }
                                      }
                                    `}</style>
                                  </div>
                                  {/* Mobile only: emoji and post button below input */}
                                  <div className="d-flex comment-input-btn-row-mobile" style={{ display: 'none', gap: 8, marginTop: 8, justifyContent: 'flex-end' }}>
                                    <button
                                      type="button"
                                      className="btn btn-secondary"
                                      style={{ fontSize: 14, borderRadius: 6, padding: '3px 10px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 8 }}
                                      onClick={e => { e.stopPropagation(); setOpenEmojiPickerId(openEmojiPickerId === announcement.id ? null : announcement.id); }}
                                    >
                                      <FaSmile style={{ fontSize: 14 }} />
                                    </button>
                                    <button
                                      className="btn btn-primary btn-sm"
                                      style={{ fontSize: 14, borderRadius: 6, padding: '3px 10px', minWidth: '36px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 8 }}
                                      onClick={() => handlePostComment(announcement.id)}
                                      disabled={!(commentInputs[announcement.id] && commentInputs[announcement.id].trim())}
                                    >
                                      <i className="ni ni-send" style={{ fontSize: 14 }} />
                                    </button>
                                  </div>
                                  <style>{`
                                    @media (max-width: 600px) {
                                      .comment-emoji-btn-desktop, .comment-post-btn-desktop { display: none !important; }
                                      .comment-input-btn-row-mobile { display: flex !important; }
                                    }
                                    @media (min-width: 601px) {
                                      .comment-input-btn-row-mobile { display: none !important; }
                                    }
                                  `}</style>
                                  
                                  {/* Comments List */}
                                  {announcement.comments && announcement.comments.length > 0 && (
                                    <div style={{ marginTop: 16 }}>
                                      <div style={{ fontWeight: 600, fontSize: 13, color: '#111', marginBottom: 12 }}>Comments</div>
                                      {announcement.comments.map((comment, idx) => {
                                        const isOwnComment = comment.author === currentUser;
                                        const isTeacher = currentUser === "Prof. Smith"; // In a real app, this would come from user context
                                        
                                        return (
                                          <div key={idx} style={{ 
                                            display: 'flex', 
                                            gap: 8, 
                                            marginBottom: 12, 
                                            padding: '8px 0',
                                            borderBottom: idx < announcement.comments.length - 1 ? '1px solid #f0f0f0' : 'none'
                                          }}>
                                            {/* Avatar */}
                                            <div style={{ 
                                              width: 24, 
                                              height: 24, 
                                              borderRadius: '50%', 
                                              background: '#e9ecef', 
                                              display: 'flex', 
                                              alignItems: 'center', 
                                              justifyContent: 'center', 
                                              overflow: 'hidden',
                                              flexShrink: 0
                                            }}>
                                              <img 
                                                src={getAvatarForUser(comment.author)} 
                                                alt="avatar" 
                                                style={{ 
                                                  width: 24, 
                                                  height: 24, 
                                                  borderRadius: '50%', 
                                                  objectFit: 'cover', 
                                                  display: 'block' 
                                                }} 
                                              />
                                            </div>
                                            
                                            {/* Comment Content */}
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                                                <div style={{ fontWeight: 600, color: '#111', fontSize: 11 }}>{comment.author}</div>
                                                <small className="text-muted" style={{ fontSize: 9 }}>{formatRelativeTime(comment.date)}</small>
                                                
                                                {/* Three-dot menu */}
                                                {(isOwnComment || isTeacher) && (
                                                  <div style={{ marginLeft: 'auto', position: 'relative' }}>
                                                    <button
                                                      type="button"
                                                      className="btn btn-link p-0"
                                                      style={{ 
                                                        fontSize: 20, 
                                                        color: '#6c757d', 
                                                        padding: '2px 2px 2px 4px',
                                                        border: 'none',
                                                        background: 'none',
                                                        cursor: 'pointer',
                                                        lineHeight: 1,
                                                        marginRight: '0px !important' // force remove margin right
                                                      }}
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        setCommentDropdownOpen(commentDropdownOpen === `${announcement.id}-${idx}` ? null : `${announcement.id}-${idx}`);
                                                      }}
                                                      aria-label="Open menu"
                                                    >
                                                      &#8942;
                                                    </button>
                                                    
                                                    {/* Dropdown Menu */}
                                                    {commentDropdownOpen === `${announcement.id}-${idx}` && (
                                                      <div style={{
                                                        position: 'absolute',
                                                        top: 28, // fixed offset to prevent shifting
                                                        right: 0,
                                                        background: '#fff',
                                                        border: 'none',
                                                        borderRadius: 12,
                                                        boxShadow: '0 8px 24px rgba(44,62,80,0.13)',
                                                        zIndex: 10,
                                                        minWidth: 120,
                                                        padding: '10px 0'
                                                      }}>
                                                        {isOwnComment && (
                                                          <button
                                                            className="btn btn-link p-2 w-100 text-left"
                                                            style={{ 
                                                              fontSize: 16,
                                                              color: '#232b3b', 
                                                              border: 'none',
                                                              background: 'none',
                                                              cursor: 'pointer',
                                                              display: 'block',
                                                              width: '100%',
                                                              textAlign: 'left',
                                                              padding: '10px 0',
                                                              fontWeight: 400,
                                                              marginLeft: 4 // add 4px margin left
                                                              // no marginRight
                                                            }}
                                                            onClick={(e) => {
                                                              e.stopPropagation();
                                                              handleEditComment(announcement.id, idx, comment.text);
                                                              setCommentDropdownOpen(null);
                                                            }}
                                                          >
                                                            Edit
                                                          </button>
                                                        )}
                                                        <button
                                                          className="btn btn-link p-2 w-100 text-left"
                                                          style={{ 
                                                            fontSize: 14, 
                                                            color: '#232b3b', 
                                                            border: 'none',
                                                            background: 'none',
                                                            cursor: 'pointer',
                                                            display: 'block',
                                                            width: '100%',
                                                            textAlign: 'left',
                                                            padding: '10px 18px',
                                                            fontWeight: 400
                                                          }}
                                                          onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteComment(announcement.id, idx);
                                                            setCommentDropdownOpen(null);
                                                          }}
                                                        >
                                                          Delete
                                                        </button>
                                                      </div>
                                                    )}
                                                  </div>
                                                )}
                                              </div>
                                              
                                              {/* Comment Text */}
                                              {editingComment[announcement.id] === idx ? (
                                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                                  <input
                                                    type="text"
                                                    className="form-control"
                                                    style={{ fontSize: 11, borderRadius: 4, border: '1px solid #bfcfff', background: '#fff', height: '28px', padding: '4px 8px' }}
                                                    value={editingCommentText[`${announcement.id}-${idx}`] || comment.text}
                                                    onChange={(e) => setEditingCommentText(prev => ({ ...prev, [`${announcement.id}-${idx}`]: e.target.value }))}
                                                    onKeyDown={(e) => {
                                                      if (e.key === 'Enter') {
                                                        handleSaveEditComment(announcement.id, idx);
                                                      } else if (e.key === 'Escape') {
                                                        handleCancelEditComment(announcement.id, idx);
                                                      }
                                                    }}
                                                  />
                                                  <button
                                                    className="btn btn-primary btn-sm"
                                                    style={{ fontSize: 10, borderRadius: 4, padding: '2px 8px', height: '28px' }}
                                                    onClick={() => handleSaveEditComment(announcement.id, idx)}
                                                  >
                                                    Save
                                                  </button>
                                                  <button
                                                    className="btn btn-secondary btn-sm"
                                                    style={{ fontSize: 10, borderRadius: 4, padding: '2px 8px', height: '28px' }}
                                                    onClick={() => handleCancelEditComment(announcement.id, idx)}
                                                  >
                                                    Cancel
                                                  </button>
                                                </div>
                                              ) : (
                                                <div style={{ fontSize: 11, color: '#2d3748', lineHeight: 1.3 }}>
                                                  {comment.text}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
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
            <Card className="mb-4" style={{ borderRadius: 18, boxShadow: '0 8px 32px rgba(50,76,221,0.10)', background: 'linear-gradient(135deg, #f8fafc 0%, #e9ecef 100%)', border: '1.5px solid #e9ecef' }}>
              <CardBody>
                <h4 className="mb-4" style={{ fontWeight: 800, color: '#324cdd', letterSpacing: 1 }}>Classwork <i className="ni ni-archive-2 text-info ml-2" /></h4>
                {/* Create Button */}
                <div className="d-flex justify-content-end mb-4" style={{ position: 'relative' }}>
                  <Button 
                    color="primary" 
                    style={{ 
                      borderRadius: 32, 
                      fontWeight: 700, 
                      fontSize: 16, 
                      padding: '12px 32px', 
                      boxShadow: '0 4px 24px #667eea55', 
                      background: 'linear-gradient(135deg, #667eea 0%, #324cdd 100%)', 
                      border: 'none', 
                      color: '#fff',
                      transition: 'box-shadow 0.2s' 
                    }}
                    onMouseOver={e => e.currentTarget.style.boxShadow = '0 8px 32px #667eea55'}
                    onMouseOut={e => e.currentTarget.style.boxShadow = '0 4px 24px #667eea55'}
                    onClick={() => {
                      if (showCreateModal || showTypeDropdown) {
                        setShowCreateModal(false);
                        setShowTypeDropdown(false);
                        setCreateType('');
                        setCreateForm({ type: '', title: '', dueDate: '', points: '', details: '' });
                      } else {
                        setShowTypeDropdown(true);
                      }
                    }}
                  >
                    <FaPlus style={{ marginRight: 8 }} /> Create
                  </Button>
                  {/* Custom Dropdown for Assignment, Quiz, Material */}
                  {showTypeDropdown && !showCreateModal && (
                    <div ref={typeDropdownRef} style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: 8,
                      background: '#fff',
                      borderRadius: 16,
                      boxShadow: '0 8px 32px rgba(50,76,221,0.10)',
                      minWidth: 180,
                      zIndex: 20,
                      padding: '8px 0',
                    }}>
                      {['Assignment', 'Quiz', 'Material'].map(type => (
                        <div
                          key={type}
                          style={{
                            padding: '14px 24px',
                            cursor: 'pointer',
                            fontSize: 17,
                            color: '#222',
                            fontWeight: 500,
                            borderBottom: type !== 'Material' ? '1px solid #f2f2f2' : 'none',
                            transition: 'background 0.13s',
                          }}
                          onClick={() => {
                            setCreateType(type);
                            setCreateForm(f => ({ ...f, type }));
                            setShowCreateModal(true);
                            setShowTypeDropdown(false);
                          }}
                          onMouseOver={e => e.currentTarget.style.background = '#f8fafc'}
                          onMouseOut={e => e.currentTarget.style.background = '#fff'}
                        >
                          {type}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* Collapsible Create Classwork Form */}
                {showCreateModal && (
                  <div style={{
                    background: '#fff',
                    borderRadius: 16,
                    boxShadow: '0 2px 12px #324cdd11',
                    border: '1.5px solid #e9ecef',
                    padding: '1.5rem 1.5rem 1rem',
                    marginBottom: 32,
                    maxWidth: 700,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    position: 'relative'
                  }}>
                    <Form onSubmit={handleCreateSubmit} style={{ marginBottom: 12 }}>
                      <div style={{ fontWeight: 800, fontSize: 22, letterSpacing: 1, color: '#111', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                        <FaRegFileAlt style={{ fontSize: 24, color: '#111' }} />
                        Create {createType || 'Classwork'}
                      </div>
                      <FormGroup className="mb-2">
                        <Input
                          type="text"
                          name="title"
                          value={createForm.title}
                          onChange={handleCreateChange}
                          placeholder={`${createType || 'Classwork'} title`}
                          style={{ fontSize: 15, borderRadius: 8, border: '1px solid #bfcfff', background: '#fff', marginBottom: 8 }}
                          required
                        />
                      </FormGroup>
                      <FormGroup className="mb-2">
                        <Input
                          type="textarea"
                          name="details"
                          value={createForm.details || ''}
                          onChange={handleCreateChange}
                          placeholder="Add more details about this classwork..."
                          style={{ fontSize: 14, minHeight: 80, padding: 8, borderRadius: 8, border: '1px solid #bfcfff', background: '#fff' }}
                        />
                      </FormGroup>
                      {/* Conditional fields based on type */}
                      {createForm.type !== 'Material' && (
                      <div className="d-flex" style={{ gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
                        <FormGroup style={{ flex: 1, minWidth: 180, marginBottom: 0 }}>
                          <Input
                            type="date"
                            name="dueDate"
                            value={createForm.dueDate}
                            onChange={handleCreateChange}
                              placeholder="Due Date (optional)"
                            style={{ fontSize: 14, borderRadius: 8, border: '1px solid #bfcfff', background: '#fff' }}
                          />
                        </FormGroup>
                          <FormGroup style={{ flex: 1, minWidth: 180, marginBottom: 0 }}>
                          <Input
                            type="number"
                            name="points"
                            value={createForm.points}
                            onChange={handleCreateChange}
                              placeholder="Points (optional)"
                            style={{ fontSize: 14, borderRadius: 8, border: '1px solid #bfcfff', background: '#fff' }}
                          />
                        </FormGroup>
                              </div>
                            )}
                      
                      {/* Attachments Section */}
                      <div style={{ marginBottom: 12 }}>
                        {createForm.attachments && createForm.attachments.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 8 }}>
                            {createForm.attachments.map((att, idx) => {
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
                                  <Button close onClick={() => handleRemoveCreateAttachment(idx)} style={{ fontSize: 18, marginLeft: 4 }} />
                              </div>
                            );
                          })}
                        </div>
                      )}
                        {/* Add attachment button */}
                        <Dropdown isOpen={createAttachmentDropdownOpen} toggle={() => setCreateAttachmentDropdownOpen(!createAttachmentDropdownOpen)}>
                          <DropdownToggle color="secondary" size="sm" style={{ fontSize: 14, borderRadius: 8, padding: '4px 14px' }}>
                            <FaPaperclip style={{ marginRight: 6 }} /> Add Attachment
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem onClick={() => { createFileInputRef.current.click(); setCreateAttachmentDropdownOpen(false); }}>
                              <i className="ni ni-single-copy-04" style={{ marginRight: 8 }} /> File
                            </DropdownItem>
                            <DropdownItem onClick={() => { setShowCreateLinkModal(true); setCreateAttachmentDropdownOpen(false); }}>
                              <i className="ni ni-world-2" style={{ marginRight: 8 }} /> Link
                            </DropdownItem>
                            <DropdownItem onClick={() => { setShowCreateYouTubeModal(true); setCreateAttachmentDropdownOpen(false); }}>
                              <i className="ni ni-video-camera-2" style={{ marginRight: 8 }} /> YouTube
                            </DropdownItem>
                            <DropdownItem onClick={() => { setShowCreateDriveModal(true); setCreateAttachmentDropdownOpen(false); }}>
                              <i className="ni ni-cloud-upload-96" style={{ marginRight: 8 }} /> Google Drive
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                        <input type="file" multiple style={{ display: 'none' }} ref={createFileInputRef} onChange={handleCreateFileChange} />
                      </div>
                      
                      {/* Student Assignment Section */}
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                          <i className="ni ni-single-02" style={{ fontSize: 16, color: '#666' }} />
                          <span style={{ fontWeight: 600, fontSize: 14, color: '#111' }}>Assign to students</span>
                        </div>
                        {createForm.assignedStudents && createForm.assignedStudents.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                            {createForm.assignedStudents.map((studentId, idx) => {
                              const student = students.find(s => s.id === studentId);
                              return student ? (
                                <Badge key={studentId} color="info" style={{ fontSize: 12, padding: '4px 8px' }}>
                                  {student.name}
                                  <Button close size="sm" onClick={() => handleRemoveAssignedStudent(studentId)} style={{ marginLeft: 4, fontSize: 10 }} />
                                </Badge>
                              ) : null;
                            })}
                          </div>
                        )}
                        <Button 
                          color="light" 
                          size="sm" 
                          onClick={() => setShowCreateStudentSelectModal(true)}
                          style={{ fontSize: 13, borderRadius: 6, padding: '4px 12px' }}
                        >
                          <i className="ni ni-fat-add" style={{ marginRight: 4 }} />
                          {createForm.assignedStudents.length > 0 ? 'Add more students' : 'Add students'}
                        </Button>
                      </div>
                      <div className="d-flex justify-content-end" style={{ gap: 8 }}>
                        <Button
                          type="button"
                          color="light"
                          onClick={() => setShowCreateModal(false)}
                          style={{ borderRadius: 8, fontSize: 14 }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          color="primary"
                          style={{ borderRadius: 8, fontSize: 14 }}
                        >
                          Create
                        </Button>
                      </div>
                    </Form>
                  </div>
                )}
                {/* Classwork List */}
                <div style={{ marginTop: 32 }}>
                  {assignments.length === 0 ? (
                    <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px #324cdd11', background: '#fff', border: '1px solid #e9ecef' }}>
                      <CardBody className="text-center" style={{ padding: '2rem' }}>
                        <i className="ni ni-archive-2" style={{ fontSize: 48, color: '#ccc', marginBottom: 16 }} />
                        <h5 style={{ color: '#666', fontWeight: 600 }}>No classwork yet</h5>
                        <p style={{ color: '#888', fontSize: 14 }}>Create your first assignment, quiz, or material to get started.</p>
                      </CardBody>
                    </Card>
                  ) : (
                    assignments.map((assignment) => {
                      const authorUser = findUserByName(assignment.author || "Prof. Smith");
                      const avatarSrc = getAvatarForUser(authorUser);
                      const isEditing = editingClassworkId === assignment.id;
                      const isExpanded = expandedClasswork === assignment.id;
                      
                    return (
                        <Card key={assignment.id} className="mb-4" style={{ borderRadius: 12, boxShadow: '0 2px 8px #324cdd11', borderLeft: '4px solid #324cdd', background: '#fff', transition: 'box-shadow 0.2s, border-color 0.2s', padding: 0 }}>
                          <CardBody style={{ padding: '1rem 1.25rem' }}>
                            {/* Clickable Header */}
                            <div 
                              className="d-flex align-items-start justify-content-between" 
                              style={{ 
                                marginBottom: isExpanded ? 12 : 0, 
                                cursor: 'pointer',
                                padding: '8px 0',
                                borderRadius: 8,
                                transition: 'background-color 0.2s'
                              }}
                              onMouseOver={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                              onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                              onClick={() => setExpandedClasswork(expandedClasswork === assignment.id ? null : assignment.id)}
                            >
                              <div className="d-flex align-items-center" style={{ gap: 12 }}>
                                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginTop: -20 }}>
                                  <i className="ni ni-single-copy-04" style={{ fontSize: 18, color: '#666' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div style={{ fontWeight: 700, color: '#111', fontSize: 16 }}>{assignment.title}</div>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                      <img src={avatarSrc} alt="avatar" style={{ width: 16, height: 16, borderRadius: '50%', objectFit: 'cover' }} />
                                    </div>
                                    <small className="text-muted" style={{ fontSize: 12 }}>{assignment.author || "Prof. Smith"}</small>
                                    <small className="text-muted" style={{ fontSize: 12 }}>{formatRelativeTime(assignment.date)}</small>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                                    <Badge color="info" style={{ fontSize: 10, padding: '2px 6px' }}>{assignment.type}</Badge>
                                    {assignment.points && (
                                      <Badge color="success" style={{ fontSize: 10, padding: '2px 6px' }}>
                                        {assignment.points} pts
                                      </Badge>
                                    )}
                                    {assignment.dueDate && (
                                      <Badge color="warning" style={{ fontSize: 10, padding: '2px 6px' }}>
                                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="d-flex align-items-center" style={{ gap: 8 }}>
                                <Dropdown isOpen={assignmentDropdowns[assignment.id]} toggle={() => handleClassworkDropdownToggle(assignment.id)}>
                                  <DropdownToggle tag="span" style={{ cursor: 'pointer', padding: 4, border: 'none', background: 'none' }} onClick={e => e.stopPropagation()}>
                                    <FaEllipsisV size={14} />
                                  </DropdownToggle>
                                  <DropdownMenu right>
                                    <DropdownItem onClick={() => handleEditClasswork(assignment.id)}>Edit</DropdownItem>
                                    <DropdownItem onClick={() => handleDeleteClasswork(assignment.id)}>Delete</DropdownItem>
                                  </DropdownMenu>
                                </Dropdown>
                                <i 
                                  className={`ni ni-bold-down ${isExpanded ? 'ni-bold-up' : ''}`} 
                                  style={{ 
                                    fontSize: 16, 
                                    color: '#666', 
                                    transition: 'transform 0.2s',
                                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                    display: 'none'
                                  }} 
                                />
                              </div>
                            </div>
                            
                            {/* Expanded Content */}
                            {isExpanded && (
                              <>
                                {isEditing ? (
                                  <div style={{ marginBottom: 16 }}>
                                    <Form onSubmit={(e) => { e.preventDefault(); handleSaveEditClasswork(assignment.id); }}>
                                      <FormGroup className="mb-2">
                                    <Input
                                      type="text"
                                      name="title"
                                          value={editClassworkData.title}
                                          onChange={handleEditClassworkChange}
                                          placeholder="Classwork title"
                                          style={{ fontSize: 15, borderRadius: 8, border: '1px solid #bfcfff', background: '#fff', marginBottom: 8 }}
                                      required
                                    />
                                      </FormGroup>
                                <FormGroup className="mb-2">
                                  <Input
                                    type="textarea"
                                    name="details"
                                          value={editClassworkData.details}
                                          onChange={handleEditClassworkChange}
                                          placeholder="Add more details..."
                                          style={{ fontSize: 14, minHeight: 80, padding: 8, borderRadius: 8, border: '1px solid #bfcfff', background: '#fff' }}
                                  />
                                </FormGroup>
                                  <div className="d-flex" style={{ gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
                                    <FormGroup style={{ flex: 1, minWidth: 180, marginBottom: 0 }}>
                                      <Input
                                        type="date"
                                        name="dueDate"
                                            value={editClassworkData.dueDate}
                                            onChange={handleEditClassworkChange}
                                        placeholder="Due Date"
                                            style={{ fontSize: 14, borderRadius: 8, border: '1px solid #bfcfff', background: '#fff' }}
                                      />
                                    </FormGroup>
                                        <FormGroup style={{ flex: 1, minWidth: 180, marginBottom: 0 }}>
                                      <Input
                                        type="number"
                                        name="points"
                                            value={editClassworkData.points}
                                            onChange={handleEditClassworkChange}
                                        placeholder="Points"
                                            style={{ fontSize: 14, borderRadius: 8, border: '1px solid #bfcfff', background: '#fff' }}
                                      />
                                    </FormGroup>
                                  </div>
                                      <div className="d-flex justify-content-end" style={{ gap: 8 }}>
                                        <Button
                                          type="button"
                                          color="light"
                                          onClick={handleCancelEditClasswork}
                                          style={{ borderRadius: 8, fontSize: 14 }}
                                        >
                                    Cancel
                                  </Button>
                                        <Button
                                          type="submit"
                                          color="primary"
                                          style={{ borderRadius: 8, fontSize: 14 }}
                                        >
                                          Save
                                        </Button>
                              </div>
                            </Form>
                                  </div>
                          ) : (
                            <>
                                    {assignment.details && (
                                      <p className="mb-3" style={{ fontSize: 14, color: '#2d3748', lineHeight: 1.5 }}>{assignment.details}</p>
                                    )}
                                    
                                    {/* Attachments Section */}
                                    {assignment.attachments && assignment.attachments.length > 0 && (
                                      <div style={{ marginTop: 20, marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                                        {assignment.attachments.map((att, idx) => {
                                          const { preview, type, color } = getFileTypeIconOrPreview(att);
                                          const url = att.file ? URL.createObjectURL(att.file) : undefined;
                                          const isLink = att.type === "Link" || att.type === "YouTube" || att.type === "Google Drive";
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
                                    
                                    {/* Assigned Students Section */}
                                    {assignment.assignedStudents && assignment.assignedStudents.length > 0 && (
                                      <div style={{ marginBottom: 16 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                          <i className="ni ni-single-02" style={{ fontSize: 14, color: '#666' }} />
                                          <span style={{ fontWeight: 600, fontSize: 13, color: '#111' }}>Assigned to:</span>
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                          {assignment.assignedStudents.map((studentId) => {
                                            const student = students.find(s => s.id === studentId);
                                            return student ? (
                                              <Badge key={studentId} color="info" style={{ fontSize: 11, padding: '3px 8px' }}>
                                                {student.name}
                                              </Badge>
                                            ) : null;
                                        })}
                                      </div>
                                    </div>
                                  )}
                                    
                                    {/* Comments Section */}
                                    <div style={{ background: '#f8fafd', borderRadius: 8, marginTop: 16, padding: '12px 18px 10px', boxShadow: '0 1px 4px #324cdd11' }}>
                                      {assignment.comments && assignment.comments.length > 0 && (
                                      <div style={{ fontWeight: 600, fontSize: 13, color: '#111', marginBottom: 16 }}>Comments</div>
                                    )}
                                      
                                    {/* List comments */}
                                      {assignment.comments && assignment.comments.length > 0 && (
                                      <div style={{ marginBottom: 8 }}>
                                          {assignment.comments.map((c, idx) => {
                                            const commentUser = findUserByName(c.author);
                                            const commentAvatar = getAvatarForUser(commentUser);
                                            const isEditing = editingComment[assignment.id] === idx;
                                          const isOwn = c.author === "Prof. Smith";
                                            
                                          return (
                                            <div key={c.id || `${c.author}-${c.date}-${idx}`} className="d-flex align-items-start" style={{ marginBottom: 6, gap: 10, padding: '4px 0', borderBottom: '1px solid #e9ecef', fontSize: 13, color: '#2d3748', position: 'relative', alignItems: 'stretch', width: '100%' }}>
                                              <div style={{ width: 24, height: 24, minWidth: 24, minHeight: 24, maxWidth: 24, maxHeight: 24, borderRadius: '50%', background: '#e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                                                  <img src={commentAvatar} alt="avatar" style={{ width: 20, height: 20, minWidth: 20, minHeight: 20, maxWidth: 20, maxHeight: 20, borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
                                              </div>
                                              <div style={{ flex: 1, minWidth: 0, width: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                                                {/* Three-dot menu absolutely positioned at top right */}
                                                {isOwn && (
                                                  <div style={{ position: 'absolute', top: 0, right: 0, zIndex: 2 }}>
                                                      <Dropdown isOpen={commentDropdownOpen === `${assignment.id}-${idx}`} toggle={() => setCommentDropdownOpen(commentDropdownOpen === `${assignment.id}-${idx}` ? null : `${assignment.id}-${idx}`)}>
                                                      <DropdownToggle tag="span" style={{ cursor: 'pointer', padding: 0, border: 'none', background: 'none' }} onClick={e => e.stopPropagation()}>
                                                        <FaEllipsisV size={14} />
                                                      </DropdownToggle>
                                                      <DropdownMenu right onClick={e => e.stopPropagation()}>
                                                          <DropdownItem onClick={(e) => { e.stopPropagation(); handleEditComment(assignment.id, idx, c.text); setCommentDropdownOpen(null); }}>Edit</DropdownItem>
                                                          <DropdownItem onClick={(e) => { e.stopPropagation(); handleDeleteComment(assignment.id, idx); }}>Delete</DropdownItem>
                                                      </DropdownMenu>
                                                    </Dropdown>
                                                  </div>
                                                )}
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                                  <span style={{ fontWeight: 600 }}>{c.author}</span>
                                                    <span style={{ color: '#90A4AE', fontSize: 11, marginTop: 2 }}>{formatRelativeTime(c.date)}</span>
                                                </div>
                                                {isEditing ? (
                                                  <div style={{ width: '100%', minWidth: 0, overflowX: 'visible', display: 'flex', flexDirection: 'column' }}>
                                                    <input
                                                      type="text"
                                                      className="form-control"
                                                      style={{ fontSize: 13, borderRadius: 6, border: '1px solid #bfcfff', background: '#fff', height: '40px', marginTop: 6, maxWidth: '100%', boxSizing: 'border-box' }}
                                                      placeholder="Edit comment..."
                                                        value={editingCommentText[`${assignment.id}-${idx}`] || ""}
                                                        onChange={e => setEditingCommentText(prev => ({ ...prev, [`${assignment.id}-${idx}`]: e.target.value }))}
                                                        onKeyDown={e => { if (e.key === 'Enter') handleSaveEditComment(assignment.id, idx); }}
                                                      autoFocus
                                                    />
                                                    <div className="d-flex align-items-center comment-edit-btn-row" style={{ gap: 6, marginTop: 8, justifyContent: 'flex-end', width: '100%', marginBottom: 16, flexWrap: 'nowrap' }}>
                                                        <button className="btn btn-success btn-sm" style={{ fontSize: 13, borderRadius: 6, fontWeight: 600, padding: '4px 10px' }} onClick={e => { e.stopPropagation(); handleSaveEditComment(assignment.id, idx); }}>Save</button>
                                                        <button className="btn btn-secondary btn-sm" style={{ fontSize: 13, borderRadius: 6, fontWeight: 600, padding: '4px 10px' }} onClick={e => { e.stopPropagation(); handleCancelEditComment(assignment.id, idx); }}>Cancel</button>
                                                    </div>
                                                  </div>
                                                ) : (
                                                  <div style={{ marginLeft: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <span>{c.text}</span>
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}
                                      
                                    {/* Input for new comment */}
                                    <div className="d-flex comment-input-row" style={{ gap: 8, position: 'relative', marginTop: 16, marginBottom: 4 }}>
                                      <input
                                        type="text"
                                        className="form-control"
                                        style={{ fontSize: 13, borderRadius: 6, border: '1px solid #bfcfff', background: '#fff', height: '40px' }}
                                        placeholder="Add a comment..."
                                          value={commentInputs[assignment.id] || ""}
                                          onChange={e => setCommentInputs(inputs => ({ ...inputs, [assignment.id]: e.target.value }))}
                                          onKeyDown={e => { if (e.key === 'Enter') handlePostClassworkComment(assignment.id); }}
                                      />
                                      <button
                                          className="btn btn-primary btn-sm"
                                        style={{ fontSize: 18, borderRadius: 8, padding: '4px 14px', minWidth: '44px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                          onClick={() => handlePostClassworkComment(assignment.id)}
                                          disabled={!(commentInputs[assignment.id] && commentInputs[assignment.id].trim())}
                                      >
                                        <i className="ni ni-send" style={{ fontSize: 16 }} />
                                      </button>
                                    </div>
                                  </div>
                                  </>
                              )}
                            </>
                          )}
                        </CardBody>
                      </Card>
                    );
                    })
                  )}
                </div>
              </CardBody>
            </Card>
          </TabPane>
        </TabContent>
      </div>

      {/* Attachment Preview Modal */}
      <Modal isOpen={previewModalOpen} toggle={() => setPreviewModalOpen(false)} centered size="lg">
        <ModalHeader toggle={() => setPreviewModalOpen(false)}>
          {previewAttachment ? (previewAttachment.name || 'File Preview') : 'Preview'}
        </ModalHeader>
        <ModalBody>
          {previewAttachment && (
            <div>
              {previewAttachment.file && previewAttachment.file.type.startsWith('image/') ? (
                <img 
                  src={URL.createObjectURL(previewAttachment.file)} 
                  alt={previewAttachment.name} 
                  style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }}
                />
              ) : previewAttachment.file && previewAttachment.file.type.startsWith('video/') ? (
                <video 
                  controls 
                  style={{ width: '100%', maxHeight: '600px', borderRadius: '8px' }}
                >
                  <source src={URL.createObjectURL(previewAttachment.file)} type={previewAttachment.file.type} />
                  Your browser does not support the video tag.
                </video>
              ) : previewAttachment.file && previewAttachment.file.type.startsWith('audio/') ? (
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  padding: '40px 20px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '16px',
                  color: 'white'
                }}>
                  {/* Animated Disk */}
                  <div 
                    id="mp3-disk"
                    style={{
                      width: '200px',
                      height: '200px',
                      borderRadius: '50%',
                      background: 'conic-gradient(from 0deg, #333 0deg, #666 90deg, #333 180deg, #666 270deg, #333 360deg)',
                      border: '8px solid #fff',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                      marginBottom: '30px',
                      position: 'relative',
                      transition: 'transform 0.3s ease'
                    }}
                  >
                    {/* Disk Center */}
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: '#fff',
                      border: '3px solid #333',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: '#333'
                      }} />
                </div>
                    {/* Disk Grooves */}
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '160px',
                      height: '160px',
                      borderRadius: '50%',
                      background: 'repeating-conic-gradient(from 0deg, transparent 0deg, transparent 2deg, rgba(255,255,255,0.1) 2deg, rgba(255,255,255,0.1) 4deg)'
                    }} />
                  </div>
                  {/* Audio Player */}
                  <div style={{ width: '100%', maxWidth: '400px' }}>
                    <audio 
                      id="mp3-player"
                      controls 
                      style={{ 
                        width: '100%',
                        height: '50px',
                        borderRadius: '25px',
                        background: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        outline: 'none'
                      }}
                      onPlay={() => {
                        const disk = document.getElementById('mp3-disk');
                        if (disk) {
                          disk.style.animation = 'rotate 3s linear infinite';
                        }
                      }}
                      onPause={() => {
                        const disk = document.getElementById('mp3-disk');
                        if (disk) {
                          disk.style.animation = 'none';
                        }
                      }}
                      onEnded={() => {
                        const disk = document.getElementById('mp3-disk');
                        if (disk) {
                          disk.style.animation = 'none';
                        }
                      }}
                    >
                      <source src={URL.createObjectURL(previewAttachment.file)} type={previewAttachment.file.type} />
                      Your browser does not support the audio tag.
                    </audio>
                  </div>
                  {/* File Info - reverted to original style and position */}
                  <div style={{ 
                    marginTop: '20px', 
                    textAlign: 'center',
                    background: '#ffe4ec',
                    padding: '22px 24px 16px 24px',
                    borderRadius: '16px',
                    boxShadow: '0 2px 12px #fbb6ce44',
                    width: '100%',
                    maxWidth: '480px',
                    fontWeight: 500,
                    position: 'relative'
                  }}>
                    {/* Minimalist Music Note SVG */}
                    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: '8px' }}>
                      <circle cx="19" cy="19" r="19" fill="#fff"/>
                      <path d="M25 10V25.5C25 27.433 23.433 29 21.5 29C19.567 29 18 27.433 18 25.5C18 23.567 19.567 22 21.5 22C22.3284 22 23.0784 22.3358 23.5858 22.8787C23.8358 23.1287 24 23.4886 24 23.8787V13H14V25.5C14 27.433 12.433 29 10.5 29C8.567 29 7 27.433 7 25.5C7 23.567 8.567 22 10.5 22C11.3284 22 12.0784 22.3358 12.5858 22.8787C12.8358 23.1287 13 23.4886 13 23.8787V10C13 9.44772 13.4477 9 14 9H24C24.5523 9 25 9.44772 25 10Z" fill="#ff6f91"/>
                    </svg>
                    <div style={{ fontWeight: '600', fontSize: '18px', marginBottom: '6px', color: '#d72660' }}>
                      {previewAttachment.name}
                    </div>
                    <div style={{ fontSize: '15px', opacity: '0.92', color: '#a23e48' }}>
                      MP3 Audio File
                    </div>
                  </div>
                  {/* CSS Animation */}
                  <style>
                    {`
                      @keyframes rotate {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                      }
                      #mp3-disk:hover {
                        transform: scale(1.05);
                      }
                    `}
                  </style>
                </div>
              ) : previewAttachment.file && previewAttachment.file.type === 'application/pdf' ? (
                <div style={{ width: '100%', height: '600px', border: '1px solid #e9ecef', borderRadius: '8px' }}>
                  <iframe
                    src={`${URL.createObjectURL(previewAttachment.file)}#toolbar=1&navpanes=1&scrollbar=1`}
                    style={{ width: '100%', height: '100%', border: 'none', borderRadius: '8px' }}
                    title={previewAttachment.name}
                  />
                </div>
              ) : previewText ? (
                <div style={{ 
                  background: '#f8f9fa', 
                  padding: '20px', 
                  borderRadius: '8px', 
                  fontFamily: 'monospace', 
                  fontSize: '14px', 
                  whiteSpace: 'pre-wrap',
                  maxHeight: '500px',
                  overflowY: 'auto'
                }}>
                  {previewText}
                </div>
              ) : previewAttachment.file && isMicrosoftFile(previewAttachment.file.name) ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <div style={{ marginBottom: '20px' }}>
                    <i className="ni ni-single-copy-04" style={{ fontSize: '48px', color: '#007bff', marginBottom: '16px' }} />
                    <h5 style={{ color: '#333', marginBottom: '8px' }}>Microsoft Office File</h5>
                    <p style={{ color: '#666', marginBottom: '20px' }}>
                      {getMicrosoftFileType(previewAttachment.file.name)} files can be previewed using Microsoft Office Online or downloaded to view locally.
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Button 
                      color="primary" 
                      onClick={() => openMicrosoftOnline(previewAttachment.file)}
                      style={{ borderRadius: '8px' }}
                    >
                      <i className="ni ni-world-2" style={{ marginRight: '6px' }} />
                      Open in Office Online
                          </Button>
                    <Button 
                      color="secondary" 
                      onClick={() => {
                        const url = URL.createObjectURL(previewAttachment.file);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = previewAttachment.name;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      style={{ borderRadius: '8px' }}
                    >
                      <i className="ni ni-single-copy-04" style={{ marginRight: '6px' }} />
                      Download File
                  </Button>
                </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <i className="ni ni-single-copy-04" style={{ fontSize: '48px', color: '#ccc', marginBottom: '16px' }} />
                  <p style={{ color: '#666' }}>Preview not available for this file type.</p>
                  <Button 
                    color="primary" 
                    onClick={() => {
                      const url = URL.createObjectURL(previewAttachment.file);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = previewAttachment.name;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    Download File
                          </Button>
      </div>
              )}
        </div>
          )}
        </ModalBody>
      </Modal>

      {/* Classwork Creation Modals */}
      
      {/* Link Modal */}
      <Modal isOpen={showCreateLinkModal} toggle={() => setShowCreateLinkModal(false)} centered>
        <ModalHeader toggle={() => setShowCreateLinkModal(false)}>Add Link</ModalHeader>
        <ModalBody>
            <FormGroup>
            <Label>Link URL</Label>
            <Input
              type="url"
              value={createLinkInput}
              onChange={(e) => setCreateLinkInput(e.target.value)}
              placeholder="https://example.com"
              onKeyDown={(e) => { if (e.key === 'Enter') handleCreateAddLink(); }}
            />
            </FormGroup>
          </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setShowCreateLinkModal(false)}>Cancel</Button>
          <Button color="primary" onClick={handleCreateAddLink}>Add Link</Button>
          </ModalFooter>
      </Modal>

      {/* YouTube Modal */}
      <Modal isOpen={showCreateYouTubeModal} toggle={() => setShowCreateYouTubeModal(false)} centered>
        <ModalHeader toggle={() => setShowCreateYouTubeModal(false)}>Add YouTube Video</ModalHeader>
        <ModalBody>
            <FormGroup>
            <Label>YouTube URL or Video ID</Label>
            <Input
              type="text"
              value={createYouTubeInput}
              onChange={(e) => setCreateYouTubeInput(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=VIDEO_ID or VIDEO_ID"
              onKeyDown={(e) => { if (e.key === 'Enter') handleCreateAddYouTube(); }}
            />
            </FormGroup>
          </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setShowCreateYouTubeModal(false)}>Cancel</Button>
          <Button color="primary" onClick={handleCreateAddYouTube}>Add Video</Button>
          </ModalFooter>
      </Modal>

      {/* Google Drive Modal */}
      <Modal isOpen={showCreateDriveModal} toggle={() => setShowCreateDriveModal(false)} centered>
        <ModalHeader toggle={() => setShowCreateDriveModal(false)}>Add Google Drive File</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>Google Drive URL</Label>
            <Input
              type="url"
              value={createDriveInput}
              onChange={(e) => setCreateDriveInput(e.target.value)}
              placeholder="https://drive.google.com/file/d/..."
              onKeyDown={(e) => { if (e.key === 'Enter') handleCreateAddDrive(); }}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setShowCreateDriveModal(false)}>Cancel</Button>
          <Button color="primary" onClick={handleCreateAddDrive}>Add File</Button>
        </ModalFooter>
      </Modal>

      {/* Student Selection Modal */}
      <Modal isOpen={showCreateStudentSelectModal} toggle={() => setShowCreateStudentSelectModal(false)} centered size="lg" style={{ borderRadius: 20, maxWidth: 700 }} contentClassName="border-0">
        <div style={{ borderRadius: 20, background: '#fff', padding: 0, boxShadow: '0 8px 32px rgba(44,62,80,.12)' }}>
          <ModalHeader toggle={() => setShowCreateStudentSelectModal(false)} style={{ border: 'none', paddingBottom: 0, fontWeight: 700, fontSize: 18, background: 'transparent' }}>
            Who can view this announcement?
          </ModalHeader>
          <ModalBody style={{ padding: 0 }}>
            <div style={{ padding: 24, paddingTop: 12 }}>
              <div style={{ position: 'relative', width: '100%', marginBottom: 18 }}>
                <FaSearch style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#b0b7c3', fontSize: 16, pointerEvents: 'none' }} />
                <Input
                  placeholder="Search students..."
                  value={studentSearch || ''}
                  onChange={e => setStudentSearch(e.target.value)}
                  style={{
                    background: '#f7f8fa',
                    borderRadius: 8,
                    border: '1px solid #e9ecef',
                    fontSize: 15,
                    color: '#232b3b',
                    padding: '8px 14px 8px 40px',
                    boxShadow: '0 1px 2px rgba(44,62,80,0.03)',
                    minWidth: 0,
                    transition: 'border-color 0.2s, box-shadow 0.2s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#7b8cff';
                    e.target.style.boxShadow = '0 0 0 2px #e9eaff';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e9ecef';
                    e.target.style.boxShadow = '0 1px 2px rgba(44,62,80,0.03)';
                  }}
                  onMouseOver={(e) => {
                    e.target.style.borderColor = '#7b8cff';
                  }}
                  onMouseOut={(e) => {
                    if (e.target !== document.activeElement) {
                      e.target.style.borderColor = '#e9ecef';
                    }
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontWeight: 600, color: '#222', fontSize: 12 }}>
                  Students ({tempSelectedStudents.length})
                </span>
                {(() => {
                  const filtered = students.filter(s => !studentSearch || s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.email.toLowerCase().includes(studentSearch.toLowerCase()));
                  const allSelected = filtered.length > 0 && filtered.every(s => tempSelectedStudents.includes(s.id));
              return (
                    <button
                      type="button"
                      className="unselect-all-btn"
                      style={{ background: 'none', border: 'none', color: '#5e72e4', fontWeight: 500, fontSize: 12, cursor: 'pointer', padding: '1px 6px', margin: 0 }}
                  onClick={() => {
                        if (allSelected) {
                          setTempSelectedStudents(prev => prev.filter(id => !filtered.map(s => s.id).includes(id)));
                        } else {
                          setTempSelectedStudents(prev => Array.from(new Set([...prev, ...filtered.map(s => s.id)])));
                        }
                      }}
                    >
                      {allSelected ? 'Unselect All' : 'Select All'}
                    </button>
                  );
                })()}
              </div>
              <div style={{ maxHeight: 320, overflowY: 'auto', border: 'none', borderRadius: 12, background: '#f9fafd', padding: '0 16px 0 0', marginBottom: 8 }}>
                {students.filter(s => !studentSearch || s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.email.toLowerCase().includes(studentSearch.toLowerCase())).length === 0 ? (
                  <div className="text-center text-muted py-5">No students found</div>
                ) : (
                  students.filter(s => !studentSearch || s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.email.toLowerCase().includes(studentSearch.toLowerCase())).map((s) => {
                    const isSelected = tempSelectedStudents.includes(s.id);
                    return (
                      <div
                        key={s.id}
                        className={`student-list-row${isSelected ? ' selected' : ''}`}
                        style={{ display: 'flex', alignItems: 'center', padding: '6px 10px', borderRadius: 8, marginBottom: 2, cursor: 'pointer', background: isSelected ? '#eaf4fb' : 'transparent' }}
                        onClick={e => {
                          // Prevent toggling twice if checkbox is clicked
                          if (e.target.type === 'checkbox') return;
                    if (isSelected) {
                            setTempSelectedStudents(prev => prev.filter(id => id !== s.id));
                    } else {
                            setTempSelectedStudents(prev => [...prev, s.id]);
                    }
                  }}
                      >
                        <img
                          src={getAvatarForUser(s)}
                          alt={s.name}
                          style={{ width: 28, height: 28, borderRadius: '50%', marginRight: 10, objectFit: 'cover', border: '1px solid #e9ecef' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 15, color: '#2d3748' }}>{s.name}</div>
                          <div style={{ fontSize: 12, color: '#7b8a9b', fontWeight: 400 }}>{s.email}</div>
                    </div>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={e => {
                            if (e.target.checked) {
                              setTempSelectedStudents(prev => [...prev, s.id]);
                            } else {
                              setTempSelectedStudents(prev => prev.filter(id => id !== s.id));
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
                    <FaUserPlus size={14} style={{ marginBottom: 2 }} />
                    <div style={{ fontSize: 11, fontWeight: 500 }}>No students selected</div>
                </div>
                ) : (
                  tempSelectedStudents.map(id => {
                    const s = students.find(stu => stu.id === id);
                    return s ? (
                      <span key={id} className="student-pill" style={{ display: 'flex', alignItems: 'center', background: '#e9ecef', borderRadius: 9, padding: '1px 6px', fontSize: 10, fontWeight: 600, color: '#2d3748', minHeight: 22 }}>
                        <img src={getAvatarForUser(s)} alt={s.name} style={{ width: 14, height: 14, borderRadius: '50%', marginRight: 4, objectFit: 'cover', border: '1px solid #fff' }} />
                        <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginRight: 5, lineHeight: 1.1 }}>
                          <span style={{ fontWeight: 600, fontSize: 10, color: '#2d3748' }}>{s.name}</span>
                          <span style={{ color: '#7b8a9b', fontWeight: 400, fontSize: 9 }}>{s.email}</span>
                        </span>
                        <span style={{ flex: 1 }} />
                        <FaTimes
                          className="student-pill-x"
                          style={{ marginLeft: 2, cursor: 'pointer', color: pillRemoveHoverId === id ? '#e74c3c' : '#7b8a9b', fontSize: 11 }}
                          onClick={e => { e.stopPropagation(); setTempSelectedStudents(prev => prev.filter(sid => sid !== id)); }}
                          onMouseEnter={() => setPillRemoveHoverId(id)}
                          onMouseLeave={() => setPillRemoveHoverId(null)}
                        />
                      </span>
                    ) : null;
                  })
                )}
              </div>
          </div>
        </ModalBody>
        <ModalFooter>
            <Button color="secondary" onClick={() => setShowCreateStudentSelectModal(false)}>
              Cancel
            </Button>
            <Button color="primary" onClick={() => { setSelectedAnnouncementStudents(tempSelectedStudents); setShowStudentSelectModal(false); }}>
              Confirm
            </Button>
        </ModalFooter>
        </div>
      </Modal>

      {/* Cropping Modal */}
      <Modal isOpen={cropModalOpen} toggle={() => setCropModalOpen(false)} centered size="md">
        <ModalHeader toggle={() => setCropModalOpen(false)} style={{ border: 'none' }}>Crop Photo</ModalHeader>
        <ModalBody style={{ height: 400, position: 'relative', background: '#222' }}>
          {cropImage && (
            <Cropper
              image={cropImage}
              crop={crop}
              zoom={zoom}
              aspect={3.5/1}
              minZoom={minZoom}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              onMediaLoaded={mediaSize => {
                // Set initial crop area if not set
                if (!croppedAreaPixels) {
                  const width = mediaSize.width;
                  const height = width / (3.5 / 1);
                  setCroppedAreaPixels({
                    x: 0,
                    y: (mediaSize.height - height) / 2,
                    width,
                    height
                  });
                }
              }}
              cropShape="rect"
              showGrid={true}
              style={{ containerStyle: { borderRadius: 12 } }}
            />
          )}
        </ModalBody>
        <ModalFooter>
          <div style={{ flex: 1 }}>
            <label style={{ color: '#888', fontWeight: 600, marginRight: 8 }}>Zoom</label>
            <input type="range" min={minZoom} max={3} step={0.01} value={zoom} onChange={e => setZoom(Number(e.target.value))} style={{ width: 120, verticalAlign: 'middle' }} />
          </div>
          <Button color="primary" onClick={handleCropSave}>Save</Button>
          <Button color="secondary" onClick={() => setCropModalOpen(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>
      {/* Link Attachment Modal */}
      <Modal isOpen={showLinkModal} toggle={() => setShowLinkModal(false)} centered>
        <ModalHeader toggle={() => setShowLinkModal(false)} style={{ border: 'none' }}>Add Link</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="linkInput">Link URL</Label>
            <Input
              id="linkInput"
              type="text"
              value={linkInput}
              onChange={e => setLinkInput(e.target.value)}
              placeholder="Paste your link here"
              autoFocus
            />
            {linkError && <div style={{ color: 'red', marginTop: 6 }}>{linkError}</div>}
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setShowLinkModal(false)}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleAddLink}>
            Add Link
          </Button>
        </ModalFooter>
      </Modal>

      {/* Edit Link Attachment Modal */}
      <Modal isOpen={showEditLinkModal} toggle={() => setShowEditLinkModal(false)} centered>
        <ModalHeader toggle={() => setShowEditLinkModal(false)} style={{ border: 'none' }}>Add Link</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="editLinkInput">Link URL</Label>
            <Input
              id="editLinkInput"
              type="text"
              value={editLinkInput}
              onChange={e => setEditLinkInput(e.target.value)}
              placeholder="Paste your link here"
              autoFocus
            />
            {editLinkError && <div style={{ color: 'red', marginTop: 6 }}>{editLinkError}</div>}
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setShowEditLinkModal(false)}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleEditAddLink}>
            Add Link
          </Button>
        </ModalFooter>
      </Modal>

      {/* Edit YouTube Attachment Modal */}
      <Modal isOpen={showEditYouTubeModal} toggle={() => setShowEditYouTubeModal(false)} centered>
        <ModalHeader toggle={() => setShowEditYouTubeModal(false)} style={{ border: 'none' }}>Add YouTube Video</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="editYouTubeInput">YouTube URL</Label>
            <Input
              id="editYouTubeInput"
              type="text"
              value={editYouTubeInput}
              onChange={e => setEditYouTubeInput(e.target.value)}
              placeholder="Paste YouTube URL here"
              autoFocus
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setShowEditYouTubeModal(false)}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleEditAddYouTube}>
            Add Video
          </Button>
        </ModalFooter>
      </Modal>

      {/* Edit Google Drive Attachment Modal */}
      <Modal isOpen={showEditDriveModal} toggle={() => setShowEditDriveModal(false)} centered>
        <ModalHeader toggle={() => setShowEditDriveModal(false)} style={{ border: 'none' }}>Add Google Drive File</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="editDriveInput">Google Drive URL</Label>
            <Input
              id="editDriveInput"
              type="text"
              value={editDriveInput}
              onChange={e => setEditDriveInput(e.target.value)}
              placeholder="Paste Google Drive URL here"
              autoFocus
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setShowEditDriveModal(false)}>
            Cancel
          </Button>
          <Button color="primary" onClick={() => { alert("Google Drive integration coming soon!"); setShowEditDriveModal(false); }}>
            Add File
          </Button>
        </ModalFooter>
      </Modal>
      {/* Student Select Modal */}
      <Modal isOpen={showStudentSelectModal} toggle={() => setShowStudentSelectModal(false)} centered size="lg" style={{ borderRadius: 20, maxWidth: 700 }} contentClassName="border-0">
        <div style={{ borderRadius: 20, background: '#fff', padding: 0, boxShadow: '0 8px 32px rgba(44,62,80,.12)' }}>
          <ModalHeader toggle={() => setShowStudentSelectModal(false)} style={{ border: 'none', paddingBottom: 0, fontWeight: 700, fontSize: 18, background: 'transparent' }}>
            Who can view this announcement?
          </ModalHeader>
          <ModalBody style={{ padding: 0 }}>
            <div style={{ padding: 24, paddingTop: 12 }}>
              <div style={{ position: 'relative', width: '100%', marginBottom: 18 }}>
                <FaSearch style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#b0b7c3', fontSize: 16, pointerEvents: 'none' }} />
                <Input
                  placeholder="Search students..."
                  value={studentSearch || ''}
                  onChange={e => setStudentSearch(e.target.value)}
                  style={{
                    background: '#f7f8fa',
                    borderRadius: 8,
                    border: '1px solid #e9ecef',
                    fontSize: 15,
                    color: '#232b3b',
                    padding: '8px 14px 8px 40px',
                    boxShadow: '0 1px 2px rgba(44,62,80,0.03)',
                    minWidth: 0,
                    transition: 'border-color 0.2s, box-shadow 0.2s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#7b8cff';
                    e.target.style.boxShadow = '0 0 0 2px #e9eaff';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e9ecef';
                    e.target.style.boxShadow = '0 1px 2px rgba(44,62,80,0.03)';
                  }}
                  onMouseOver={(e) => {
                    e.target.style.borderColor = '#7b8cff';
                  }}
                  onMouseOut={(e) => {
                    if (e.target !== document.activeElement) {
                      e.target.style.borderColor = '#e9ecef';
                    }
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontWeight: 600, color: '#222', fontSize: 12 }}>
                  Students ({tempSelectedStudents.length})
                </span>
                {(() => {
                  const filtered = students.filter(s => !studentSearch || s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.email.toLowerCase().includes(studentSearch.toLowerCase()));
                  const allSelected = filtered.length > 0 && filtered.every(s => tempSelectedStudents.includes(s.id));
                  return (
                    <button
                      type="button"
                      className="unselect-all-btn"
                      style={{ background: 'none', border: 'none', color: '#5e72e4', fontWeight: 500, fontSize: 12, cursor: 'pointer', padding: '1px 6px', margin: 0 }}
                      onClick={() => {
                        if (allSelected) {
                          setTempSelectedStudents(prev => prev.filter(id => !filtered.map(s => s.id).includes(id)));
                        } else {
                          setTempSelectedStudents(prev => Array.from(new Set([...prev, ...filtered.map(s => s.id)])));
                        }
                      }}
                    >
                      {allSelected ? 'Unselect All' : 'Select All'}
                    </button>
                  );
                })()}
              </div>
              <div style={{ maxHeight: 320, overflowY: 'auto', border: 'none', borderRadius: 12, background: '#f9fafd', padding: '0 16px 0 0', marginBottom: 8 }}>
                {students.filter(s => !studentSearch || s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.email.toLowerCase().includes(studentSearch.toLowerCase())).length === 0 ? (
                  <div className="text-center text-muted py-5">No students found</div>
                ) : (
                  students.filter(s => !studentSearch || s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.email.toLowerCase().includes(studentSearch.toLowerCase())).map((s) => {
                    const isSelected = tempSelectedStudents.includes(s.id);
                    return (
                      <div
                        key={s.id}
                        className={`student-list-row${isSelected ? ' selected' : ''}`}
                        style={{ display: 'flex', alignItems: 'center', padding: '6px 10px', borderRadius: 8, marginBottom: 2, cursor: 'pointer', background: isSelected ? '#eaf4fb' : 'transparent' }}
                        onClick={e => {
                          // Prevent toggling twice if checkbox is clicked
                          if (e.target.type === 'checkbox') return;
                          if (isSelected) {
                            setTempSelectedStudents(prev => prev.filter(id => id !== s.id));
                          } else {
                            setTempSelectedStudents(prev => [...prev, s.id]);
                          }
                        }}
                      >
                        <img
                          src={getAvatarForUser(s)}
                          alt={s.name}
                          style={{ width: 28, height: 28, borderRadius: '50%', marginRight: 10, objectFit: 'cover', border: '1px solid #e9ecef' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 15, color: '#2d3748' }}>{s.name}</div>
                          <div style={{ fontSize: 12, color: '#7b8a9b', fontWeight: 400 }}>{s.email}</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={e => {
                            if (e.target.checked) {
                              setTempSelectedStudents(prev => [...prev, s.id]);
                            } else {
                              setTempSelectedStudents(prev => prev.filter(id => id !== s.id));
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
                    <FaUserPlus size={14} style={{ marginBottom: 2 }} />
                    <div style={{ fontSize: 11, fontWeight: 500 }}>No students selected</div>
                  </div>
                ) : (
                  tempSelectedStudents.map(id => {
                    const s = students.find(stu => stu.id === id);
                    return s ? (
                      <span key={id} className="student-pill" style={{ display: 'flex', alignItems: 'center', background: '#e9ecef', borderRadius: 9, padding: '1px 6px', fontSize: 10, fontWeight: 600, color: '#2d3748', minHeight: 22 }}>
                        <img src={getAvatarForUser(s)} alt={s.name} style={{ width: 14, height: 14, borderRadius: '50%', marginRight: 4, objectFit: 'cover', border: '1px solid #fff' }} />
                        <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginRight: 5, lineHeight: 1.1 }}>
                          <span style={{ fontWeight: 600, fontSize: 10, color: '#2d3748' }}>{s.name}</span>
                          <span style={{ color: '#7b8a9b', fontWeight: 400, fontSize: 9 }}>{s.email}</span>
                        </span>
                        <span style={{ flex: 1 }} />
                        <FaTimes
                          className="student-pill-x"
                          style={{ marginLeft: 2, cursor: 'pointer', color: pillRemoveHoverId === id ? '#e74c3c' : '#7b8a9b', fontSize: 11 }}
                          onClick={e => { e.stopPropagation(); setTempSelectedStudents(prev => prev.filter(sid => sid !== id)); }}
                          onMouseEnter={() => setPillRemoveHoverId(id)}
                          onMouseLeave={() => setPillRemoveHoverId(null)}
                        />
                      </span>
                    ) : null;
                  })
                )}
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => setShowStudentSelectModal(false)}>
              Cancel
            </Button>
            <Button color="primary" onClick={() => { setSelectedAnnouncementStudents(tempSelectedStudents); setShowStudentSelectModal(false); }}>
              Confirm
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      {/* Edit Student Select Modal */}
      <Modal isOpen={showEditStudentSelectModal} toggle={() => setShowEditStudentSelectModal(false)} centered size="lg" style={{ borderRadius: 20, maxWidth: 700 }} contentClassName="border-0">
        <div style={{ borderRadius: 20, background: '#fff', padding: 0, boxShadow: '0 8px 32px rgba(44,62,80,.12)' }}>
          <ModalHeader toggle={() => setShowEditStudentSelectModal(false)} style={{ border: 'none', paddingBottom: 0, fontWeight: 700, fontSize: 18, background: 'transparent' }}>
            Who can view this announcement?
          </ModalHeader>
          <ModalBody style={{ padding: 0 }}>
            <div style={{ padding: 24, paddingTop: 12 }}>
              <div style={{ position: 'relative', width: '100%', marginBottom: 18 }}>
                <FaSearch style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#b0b7c3', fontSize: 16, pointerEvents: 'none' }} />
                <Input
                  placeholder="Search students..."
                  value={studentSearch || ''}
                  onChange={e => setStudentSearch(e.target.value)}
                  style={{
                    background: '#f7f8fa',
                    borderRadius: 8,
                    border: '1px solid #e9ecef',
                    fontSize: 15,
                    color: '#232b3b',
                    padding: '8px 14px 8px 40px',
                    boxShadow: '0 1px 2px rgba(44,62,80,0.03)',
                    minWidth: 0,
                    transition: 'border-color 0.2s, box-shadow 0.2s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#7b8cff';
                    e.target.style.boxShadow = '0 0 0 2px #e9eaff';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e9ecef';
                    e.target.style.boxShadow = '0 1px 2px rgba(44,62,80,0.03)';
                  }}
                  onMouseOver={(e) => {
                    e.target.style.borderColor = '#7b8cff';
                  }}
                  onMouseOut={(e) => {
                    if (e.target !== document.activeElement) {
                      e.target.style.borderColor = '#e9ecef';
                    }
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontWeight: 600, color: '#222', fontSize: 12 }}>
                  Students ({tempSelectedStudents.length})
                </span>
                {(() => {
                  const filtered = students.filter(s => !studentSearch || s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.email.toLowerCase().includes(studentSearch.toLowerCase()));
                  const allSelected = filtered.length > 0 && filtered.every(s => tempSelectedStudents.includes(s.id));
                  return (
                    <button
                      type="button"
                      className="unselect-all-btn"
                      style={{ background: 'none', border: 'none', color: '#5e72e4', fontWeight: 500, fontSize: 12, cursor: 'pointer', padding: '1px 6px', margin: 0 }}
                      onClick={() => {
                        if (allSelected) {
                          setTempSelectedStudents(prev => prev.filter(id => !filtered.map(s => s.id).includes(id)));
                        } else {
                          setTempSelectedStudents(prev => Array.from(new Set([...prev, ...filtered.map(s => s.id)])));
                        }
                      }}
                    >
                      {allSelected ? 'Unselect All' : 'Select All'}
                    </button>
                  );
                })()}
              </div>
              <div style={{ maxHeight: 320, overflowY: 'auto', border: 'none', borderRadius: 12, background: '#f9fafd', padding: '0 16px 0 0', marginBottom: 8 }}>
                {students.filter(s => !studentSearch || s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.email.toLowerCase().includes(studentSearch.toLowerCase())).length === 0 ? (
                  <div className="text-center text-muted py-5">No students found</div>
                ) : (
                  students.filter(s => !studentSearch || s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.email.toLowerCase().includes(studentSearch.toLowerCase())).map((s) => {
                    const isSelected = tempSelectedStudents.includes(s.id);
                    return (
                      <div
                        key={s.id}
                        className={`student-list-row${isSelected ? ' selected' : ''}`}
                        style={{ display: 'flex', alignItems: 'center', padding: '6px 10px', borderRadius: 8, marginBottom: 2, cursor: 'pointer', background: isSelected ? '#eaf4fb' : 'transparent' }}
                        onClick={e => {
                          // Prevent toggling twice if checkbox is clicked
                          if (e.target.type === 'checkbox') return;
                          if (isSelected) {
                            setTempSelectedStudents(prev => prev.filter(id => id !== s.id));
                          } else {
                            setTempSelectedStudents(prev => [...prev, s.id]);
                          }
                        }}
                      >
                        <img
                          src={getAvatarForUser(s)}
                          alt={s.name}
                          style={{ width: 28, height: 28, borderRadius: '50%', marginRight: 10, objectFit: 'cover', border: '1px solid #e9ecef' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 15, color: '#2d3748' }}>{s.name}</div>
                          <div style={{ fontSize: 12, color: '#7b8a9b', fontWeight: 400 }}>{s.email}</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={e => {
                            if (e.target.checked) {
                              setTempSelectedStudents(prev => [...prev, s.id]);
                            } else {
                              setTempSelectedStudents(prev => prev.filter(id => id !== s.id));
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
                    <FaUserPlus size={14} style={{ marginBottom: 2 }} />
                    <div style={{ fontSize: 11, fontWeight: 500 }}>No students selected</div>
                  </div>
                ) : (
                  tempSelectedStudents.map(id => {
                    const s = students.find(stu => stu.id === id);
                    return s ? (
                      <span key={id} className="student-pill" style={{ display: 'flex', alignItems: 'center', background: '#e9ecef', borderRadius: 9, padding: '1px 6px', fontSize: 10, fontWeight: 600, color: '#2d3748', minHeight: 22 }}>
                        <img src={getAvatarForUser(s)} alt={s.name} style={{ width: 14, height: 14, borderRadius: '50%', marginRight: 4, objectFit: 'cover', border: '1px solid #fff' }} />
                        <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginRight: 5, lineHeight: 1.1 }}>
                          <span style={{ fontWeight: 600, fontSize: 10, color: '#2d3748' }}>{s.name}</span>
                          <span style={{ color: '#7b8a9b', fontWeight: 400, fontSize: 9 }}>{s.email}</span>
                        </span>
                        <span style={{ flex: 1 }} />
                        <FaTimes
                          className="student-pill-x"
                          style={{ marginLeft: 2, cursor: 'pointer', color: pillRemoveHoverId === id ? '#e74c3c' : '#7b8a9b', fontSize: 11 }}
                          onClick={e => { e.stopPropagation(); setTempSelectedStudents(prev => prev.filter(sid => sid !== id)); }}
                          onMouseEnter={() => setPillRemoveHoverId(id)}
                          onMouseLeave={() => setPillRemoveHoverId(null)}
                        />
                      </span>
                    ) : null;
                  })
                )}
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => setShowEditStudentSelectModal(false)}>
              Cancel
            </Button>
            <Button color="primary" onClick={() => { setEditSelectedStudents(tempSelectedStudents); setShowEditStudentSelectModal(false); }}>
              Confirm
            </Button>
          </ModalFooter>
        </div>
      </Modal>
    </div>
  );
};

export default ClassroomDetail; 