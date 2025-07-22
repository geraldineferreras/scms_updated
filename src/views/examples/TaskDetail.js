// npm install react-pdf@latest pdfjs-dist@latest
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardBody, Button, Badge, Nav, NavItem, NavLink, TabContent, TabPane, Table, Modal, ModalBody, Input } from "reactstrap";
import classnames from "classnames";
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.js`;

// Accepts prop: studentSubmissions (array of {id, studentName, avatar, status, score, file, isDraft})
const TaskDetail = ({ studentSubmissions }) => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [activeTab, setActiveTab] = useState('instructions');
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [acceptingSubmissions, setAcceptingSubmissions] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFile, setModalFile] = useState(null);
  const [modalStudent, setModalStudent] = useState(null);
  const [submissionsState, setSubmissionsState] = useState([]);
  const [gradeInput, setGradeInput] = useState("");
  const [gradeSaved, setGradeSaved] = useState(false);
  const [pdfZoom, setPdfZoom] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Provide fake/mock data if no prop is passed
  const mockSubmissions = [
    {
      id: 1,
      studentName: "Geraldine Ferreras",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      status: "Assigned",
      score: 95,
      file: {
        name: "Geraldine_Ferreras_Resume.pdf",
        preview: null,
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" // Replace with real resume PDF if available
      },
      isDraft: true
    },
    {
      id: 2,
      studentName: "John Smith",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      status: "Turned in",
      score: 100,
      file: { name: "project_final.pdf", preview: null, url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
      isDraft: false
    },
    {
      id: 3,
      studentName: "Jane Doe",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg",
      status: "Assigned",
      score: undefined,
      file: null,
      isDraft: false
    },
    {
      id: 4,
      studentName: "Alex Lee",
      avatar: "https://randomuser.me/api/portraits/men/4.jpg",
      status: "Turned in",
      score: 88,
      file: { name: "alex_homework.docx", preview: null, url: "https://file-examples.com/wp-content/uploads/2017/02/file-sample_100kB.docx" },
      isDraft: false
    },
    {
      id: 5,
      studentName: "Maria Cruz",
      avatar: "https://randomuser.me/api/portraits/women/5.jpg",
      status: "Turned in",
      score: 92,
      file: {
        name: "sample_assignment.pdf",
        preview: null,
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
      },
      isDraft: false
    }
  ];

  // Use prop or fallback to mock data
  const submissions = studentSubmissions && studentSubmissions.length > 0 ? studentSubmissions : mockSubmissions;

  // Local state for grades
  useEffect(() => {
    setSubmissionsState(submissions.map(s => ({ ...s })));
  }, [studentSubmissions]);

  useEffect(() => {
    // Try to find the task in any classroom's localStorage
    const teacherClasses = JSON.parse(localStorage.getItem("teacherClasses") || "[]");
    let foundTask = null;
    for (const cls of teacherClasses) {
      const tasks = JSON.parse(localStorage.getItem(`classroom_tasks_${cls.code}`) || "[]");
      foundTask = tasks.find(t => String(t.id) === String(taskId));
      if (foundTask) break;
    }
    setTask(foundTask);
  }, [taskId]);

  // Set default selected student (must not be conditional)
  useEffect(() => {
    if (submissions.length > 0 && !selectedStudentId) {
      setSelectedStudentId(submissions[0].id);
    }
    // Only run when submissions or selectedStudentId changes
    // eslint-disable-next-line
  }, [submissions, selectedStudentId]);

  // Remove extra margins/paddings for a more compact, edge-to-edge look
  const outerStyle = {
    maxWidth: '100vw',
    minHeight: '100vh',
    margin: 0,
    padding: 0,
    background: '#f8fafc',
  };
  const innerStyle = {
    maxWidth: 1200,
    margin: '32px auto 0 auto',
    padding: 0,
  };

  // Get selected student from local state
  const selectedStudent = submissionsState.find(s => s.id === selectedStudentId) || submissionsState[0];

  // Helper: check file type
  const isImage = (file) => file && file.url && (file.url.endsWith('.jpg') || file.url.endsWith('.jpeg') || file.url.endsWith('.png') || file.url.endsWith('.gif') || file.url.endsWith('.webp'));
  const isPDF = (file) => file && file.url && file.url.endsWith('.pdf');

  // Open modal with file and student info
  const handleOpenModal = (file, student) => {
    setModalFile(file);
    setModalStudent(student);
    setGradeInput(student.score !== undefined ? student.score : "");
    setGradeSaved(false);
    setPdfZoom(1);
    setCurrentPage(1);
    setModalOpen(true);
  };

  // Save grade for student
  const handleSaveGrade = () => {
    setSubmissionsState(prev => prev.map(s =>
      s.id === modalStudent.id ? { ...s, score: gradeInput !== "" ? Number(gradeInput) : undefined } : s
    ));
    setGradeSaved(true);
    setTimeout(() => setGradeSaved(false), 1200);
  };

  // Modal content for file preview
  const renderModalContent = () => {
    if (!modalFile || !modalStudent) return null;
    return (
      <div style={{ display: 'flex', minHeight: '70vh', width: '100vw', maxWidth: '100vw' }}>
        {/* File preview */}
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '0', minWidth: 0, minHeight: 0, height: '70vh' }}>
          {isPDF(modalFile) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, justifyContent: 'center' }}>
              <Button color="primary" size="sm" style={{ fontWeight: 700, borderRadius: 16, padding: '2px 18px', background: '#6366f1', border: 'none' }} onClick={() => setPdfZoom(z => Math.max(0.5, z - 0.1))} disabled={pdfZoom <= 0.5}>-</Button>
              <span style={{ fontWeight: 600, fontSize: 18, color: '#6366f1', minWidth: 60, textAlign: 'center' }}>{Math.round(pdfZoom * 100)}%</span>
              <Button color="primary" size="sm" style={{ fontWeight: 700, borderRadius: 16, padding: '2px 18px', background: '#6366f1', border: 'none' }} onClick={() => setPdfZoom(z => Math.min(2, z + 0.1))} disabled={pdfZoom >= 2}>+</Button>
            </div>
          )}
          {isImage(modalFile) ? (
            <img src={modalFile.url} alt={modalFile.name} style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: 12, boxShadow: '0 2px 8px #324cdd22' }} />
          ) : isPDF(modalFile) ? (
            <div style={{ width: '100%', height: '68vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'auto', background: '#fff', borderRadius: 12 }}>
              <Document
                file={modalFile.url}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                loading={<div style={{ color: '#888', fontSize: 18, marginTop: 32 }}>Loading PDF...</div>}
                error={<div style={{ color: 'red', fontSize: 18, marginTop: 32 }}>Failed to load PDF.</div>}
              >
                <Page
                  pageNumber={currentPage}
                  scale={pdfZoom}
                  width={Math.min(900, window.innerWidth * 0.7)}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </Document>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10, justifyContent: 'center' }}>
                <Button color="primary" size="sm" style={{ fontWeight: 700, borderRadius: 16, padding: '2px 18px', background: '#6366f1', border: 'none' }} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage <= 1}>Prev</Button>
                <span style={{ fontWeight: 600, fontSize: 16, color: '#6366f1', minWidth: 60, textAlign: 'center' }}>{currentPage} / {numPages || 1}</span>
                <Button color="primary" size="sm" style={{ fontWeight: 700, borderRadius: 16, padding: '2px 18px', background: '#6366f1', border: 'none' }} onClick={() => setCurrentPage(p => Math.min(numPages || 1, p + 1))} disabled={currentPage >= (numPages || 1)}>Next</Button>
              </div>
            </div>
          ) : (
            <div style={{ color: '#888', fontSize: 18 }}>No preview available</div>
          )}
        </div>
        {/* Sidebar */}
        <div style={{ flex: 1, background: '#fff', borderLeft: '1.5px solid #e9ecef', padding: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 320, height: '70vh' }}>
          <img src={modalStudent.avatar} alt={modalStudent.studentName} style={{ width: 70, height: 70, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e9ecef', marginBottom: 18 }} />
          <div style={{ fontWeight: 700, fontSize: 24, marginBottom: 8 }}>{modalStudent.studentName}</div>
          <div style={{ color: '#888', fontWeight: 500, fontSize: 17, marginBottom: 18 }}>{modalStudent.isDraft ? 'Draft' : modalStudent.status}</div>
          {/* Grade input */}
          <div style={{ marginBottom: 18, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontWeight: 700, color: '#27ae60', fontSize: 22, marginBottom: 8 }}>Grading:</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Input
                type="number"
                min={0}
                max={100}
                value={gradeInput}
                onChange={e => setGradeInput(e.target.value)}
                style={{ width: 80, fontWeight: 700, fontSize: 20, color: '#27ae60', textAlign: 'center', borderRadius: 8, border: '1.5px solid #e9ecef', background: '#f8fafc' }}
              />
              <Button color="primary" size="sm" style={{ fontWeight: 700, fontSize: 16, borderRadius: 8, padding: '4px 18px' }} onClick={handleSaveGrade} disabled={gradeInput === "" || isNaN(Number(gradeInput))}>
                Save
              </Button>
              {gradeSaved && <span style={{ color: '#27ae60', fontWeight: 700, fontSize: 18, marginLeft: 6 }}>✔</span>}
            </div>
          </div>
          <div style={{ color: '#324cdd', fontWeight: 600, fontSize: 18, marginBottom: 12 }}>{modalFile.name}</div>
          <a href={modalFile.url} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', fontWeight: 500, fontSize: 16, textDecoration: 'underline' }}>Open in new tab</a>
        </div>
      </div>
    );
  };

  if (!task) {
    return (
      <div style={{ padding: 32, textAlign: "center" }}>
        <h3>Task not found</h3>
        <Button color="primary" onClick={() => navigate(-1)}>Back</Button>
      </div>
    );
  }

  const turnedIn = submissionsState.filter(s => s.status === 'Turned in').length;
  const assigned = submissionsState.length;

  return (
    <div style={outerStyle}>
      <div style={innerStyle}>
        {/* Instruction Section */}
        <div style={{ marginBottom: 16, background: '#f8fafc', borderRadius: 12, padding: '12px 20px', boxShadow: '0 2px 8px #324cdd11', fontSize: 16, fontWeight: 500, color: '#324cdd', letterSpacing: 0.5 }}>
          <span role="img" aria-label="info" style={{ marginRight: 10, fontSize: 20 }}>ℹ️</span>
          Click the tabs below to view the task instructions or see student submissions for this task.
        </div>
        <Button color="secondary" onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>Back</Button>
        {/* Tabs */}
        <Nav tabs style={{ marginBottom: 16, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #324cdd11' }}>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === 'instructions' })}
              onClick={() => setActiveTab('instructions')}
              style={{ cursor: 'pointer', fontWeight: 600, fontSize: 16 }}
            >
              Instructions
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === 'studentwork' })}
              onClick={() => setActiveTab('studentwork')}
              style={{ cursor: 'pointer', fontWeight: 600, fontSize: 16 }}
            >
              Student Work
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId="instructions">
            <Card style={{ borderRadius: 16, boxShadow: '0 2px 8px #324cdd11', border: '1.5px solid #e9ecef', background: '#fff', marginBottom: 24 }}>
              <CardBody>
                <h2 style={{ fontWeight: 700, fontSize: 28, color: '#232b3b', marginBottom: 12 }}>{task.title}</h2>
                <div style={{ fontSize: 16, color: '#232b3b', marginBottom: 16 }}>{task.text}</div>
                <div style={{ marginBottom: 16 }}>
                  <Badge color="info" style={{ marginRight: 8, textTransform: 'uppercase' }}>{task.type}</Badge>
                  <Badge color="warning" style={{ marginRight: 8 }}>{task.points} pts</Badge>
                  <Badge color="success">Due {task.dueDate}</Badge>
                </div>
                {task.attachments && task.attachments.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <h5>Attachments</h5>
                    <ul>
                      {task.attachments.map((att, idx) => (
                        <li key={idx}>
                          {att.name || att.url}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {task.comments && task.comments.length > 0 && (
                  <div style={{ marginTop: 24 }}>
                    <h5>Comments</h5>
                    <ul>
                      {task.comments.map((comment, idx) => (
                        <li key={idx}>
                          <strong>{comment.author}:</strong> {comment.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardBody>
            </Card>
          </TabPane>
          <TabPane tabId="studentwork">
            {/* Summary Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 32, marginBottom: 18, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #324cdd11', padding: '18px 24px' }}>
              <div style={{ fontWeight: 700, fontSize: 22 }}>{turnedIn}</div>
              <div style={{ color: '#888', fontWeight: 500, fontSize: 15, marginRight: 8 }}>Turned in</div>
              <div style={{ fontWeight: 700, fontSize: 22 }}>{assigned}</div>
              <div style={{ color: '#888', fontWeight: 500, fontSize: 15, marginRight: 8 }}>Assigned</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
                <span style={{ fontWeight: 500, fontSize: 15 }}>Accepting submissions</span>
                {/* Custom Switch */}
                <span
                  onClick={() => setAcceptingSubmissions(v => !v)}
                  style={{
                    display: 'inline-block',
                    width: 44,
                    height: 24,
                    borderRadius: 16,
                    background: acceptingSubmissions ? '#1976d2' : '#e0e0e0',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    verticalAlign: 'middle',
                  }}
                  tabIndex={0}
                  role="button"
                  aria-pressed={acceptingSubmissions}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: acceptingSubmissions ? 22 : 2,
                      top: 2,
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: '#fff',
                      boxShadow: '0 1px 4px #aaa',
                      transition: 'left 0.2s',
                      border: '1px solid #ccc',
                    }}
                  />
                </span>
              </div>
            </div>
            {/* Main Panel */}
            <div style={{ display: 'flex', gap: 32, minHeight: 400 }}>
              {/* Left: Student List */}
              <div style={{ width: 320, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #324cdd11', padding: 0, overflow: 'hidden', minHeight: 400 }}>
                <div style={{ borderBottom: '1px solid #e9ecef', padding: '18px 18px 10px 18px', fontWeight: 700, fontSize: 16, color: '#324cdd', background: '#f8fafc' }}>All students</div>
                <div style={{ maxHeight: 420, overflowY: 'auto' }}>
                  {submissionsState.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => setSelectedStudentId(s.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', cursor: 'pointer', background: selectedStudent && selectedStudent.id === s.id ? '#e6f0ff' : '#fff', borderBottom: '1px solid #f3f3f3', transition: 'background 0.15s',
                      }}
                    >
                      <img src={s.avatar} alt={s.studentName} style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e9ecef' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 15 }}>{s.studentName}</div>
                        <div style={{ fontSize: 13, color: s.isDraft ? '#27ae60' : '#888', fontWeight: 500 }}>
                          {s.isDraft ? 'Draft' : s.status}
                        </div>
                      </div>
                      {s.score !== undefined && (
                        <div style={{ fontWeight: 700, color: '#27ae60', fontSize: 16 }}>{s.score}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {/* Right: Submission Details */}
              <div style={{ flex: 1, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #324cdd11', padding: 32, minHeight: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {selectedStudent ? (
                  <>
                    <img src={selectedStudent.avatar} alt={selectedStudent.studentName} style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e9ecef', marginBottom: 12 }} />
                    <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 6 }}>{selectedStudent.studentName}</div>
                    <div style={{ color: '#888', fontWeight: 500, fontSize: 15, marginBottom: 12 }}>{selectedStudent.isDraft ? 'Draft' : selectedStudent.status}</div>
                    {selectedStudent.score !== undefined && (
                      <div style={{ fontWeight: 700, color: '#27ae60', fontSize: 18, marginBottom: 12 }}>Score: {selectedStudent.score}</div>
                    )}
                    {selectedStudent.file ? (
                      <div style={{ marginTop: 12, marginBottom: 12, textAlign: 'center' }}>
                        {selectedStudent.file.preview ? (
                          <img
                            src={selectedStudent.file.preview}
                            alt="preview"
                            style={{ width: 180, height: 120, objectFit: 'cover', borderRadius: 8, border: '1.5px solid #e9ecef', marginBottom: 8, cursor: 'pointer' }}
                            onClick={() => handleOpenModal(selectedStudent.file, selectedStudent)}
                          />
                        ) : (
                          <div
                            style={{ color: '#1976d2', fontSize: 15, marginBottom: 8, textDecoration: 'underline', cursor: 'pointer', display: 'inline-block' }}
                            onClick={() => handleOpenModal(selectedStudent.file, selectedStudent)}
                          >
                            {selectedStudent.file.name}
                          </div>
                        )}
                        <div style={{ color: '#888', fontSize: 14 }}>{selectedStudent.file.name}</div>
                      </div>
                    ) : (
                      <div style={{ color: '#bbb', fontSize: 16, marginTop: 24 }}>No file submitted</div>
                    )}
                  </>
                ) : (
                  <div style={{ color: '#bbb', fontSize: 18 }}>No student selected</div>
                )}
              </div>
            </div>
            {/* Modal for file preview */}
            <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)} size="xl" centered style={{ maxWidth: '98vw', width: '98vw' }} contentClassName="p-0" backdropClassName="modal-backdrop-blur">
              <ModalBody style={{ padding: 0, borderRadius: 16, overflow: 'hidden', minHeight: '70vh', height: '70vh', maxHeight: '90vh', width: '100vw', maxWidth: '100vw' }}>
                <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
                  {renderModalContent()}
                  <Button color="secondary" onClick={() => setModalOpen(false)} style={{ position: 'absolute', top: 18, right: 24, zIndex: 10, borderRadius: 20, fontWeight: 700, fontSize: 24, padding: '2px 20px', background: '#fff', color: '#222', border: 'none', boxShadow: '0 2px 8px #324cdd22' }}>×</Button>
                </div>
              </ModalBody>
            </Modal>
          </TabPane>
        </TabContent>
      </div>
    </div>
  );
};

export default TaskDetail; 