import React, { useState } from "react";
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

const ClassroomDetailStudent = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("stream");
  const [announcement, setAnnouncement] = useState("");
  const [expandedId, setExpandedId] = useState(7);
  const [gradeFilter, setGradeFilter] = useState("All");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [expandedGradeId, setExpandedGradeId] = useState(7);
  const currentClass = mockClasses.find(cls => cls.code === code) || mockClasses[0];

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
        <div style={{ maxWidth: 1100, margin: '24px auto 0' }}>
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px 0 rgba(44,62,80,.06)', padding: 32, marginBottom: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 20, color: '#2096ff', marginBottom: 12, display: 'flex', alignItems: 'center' }}>
              <i className="ni ni-chat-round" style={{ fontSize: 22, marginRight: 8 }} /> Stream
            </div>
            <Input
              type="textarea"
              placeholder="Share an announcement with your class..."
              style={{ borderRadius: 12, fontSize: 16, padding: '16px 18px', minHeight: 56, marginBottom: 12, background: '#f7fafd', border: '1px solid #e0e0e0' }}
              value={announcement}
              onChange={e => setAnnouncement(e.target.value)}
            />
            <Button color="primary" style={{ fontWeight: 600, borderRadius: 8, minWidth: 100, fontSize: 13 }}>Post</Button>
          </div>
          {mockPosts.map(post => (
            <div key={post.id} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px 0 rgba(44,62,80,.06)', padding: 28, marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                <img src={post.author.avatar} alt="avatar" style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', marginRight: 14 }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{post.author.name}</div>
                  <div style={{ color: '#888', fontSize: 13 }}>{post.date}</div>
                </div>
              </div>
              <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 6 }}>{post.title}</div>
              <div style={{ color: '#444', fontSize: 15, marginBottom: 12 }}>{post.content}</div>
              <Input
                type="text"
                placeholder="Add a comment..."
                style={{ borderRadius: 8, fontSize: 14, padding: '10px 14px', background: '#f7fafd', border: '1px solid #e0e0e0', marginBottom: 0, maxWidth: 400 }}
              />
              <Button color="link" style={{ fontWeight: 500, fontSize: 14, color: '#1976d2', textDecoration: 'none', marginLeft: 8, marginTop: -2 }}>Post</Button>
            </div>
          ))}
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
    </div>
  );
};

export default ClassroomDetailStudent; 