// npm install react-pdf@latest pdfjs-dist@latest
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardBody, Button, Badge, Nav, NavItem, NavLink, TabContent, TabPane, Table, Modal, ModalBody, Input } from "reactstrap";
import classnames from "classnames";
import { Document, Page, pdfjs } from 'react-pdf';
import QRGradingPanel from '../../components/QRGradingPanel';
pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.js`;

// Accepts prop: studentSubmissions (array of {id, studentName, avatar, status, score, file, isDraft})
const TaskDetail = () => {
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
  const [qrGradingMode, setQrGradingMode] = useState(false);

  // Provide fake/mock data if no prop is passed
  const mockSubmissions = [
    {
      id: 1,
      studentName: "Anjela Sarmiento",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      status: "Assigned",
      score: 95,
      file: {
        name: "Geraldine_Ferreras_Resume.pdf",
        preview: null,
        url: "https://resume.tiiny.site" // Replace with real resume PDF if available
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
    },
    {
      id: "2021305973",
      studentName: "ANJELA SOFIA G. SARMIENTO",
      avatar: "https://randomuser.me/api/portraits/women/6.jpg",
      status: "Assigned",
      score: undefined,
      file: null,
      isDraft: false,
      program: "Bachelor of Science in Information Technology"
    }
  ];

  // Load students for the classroom
  const [students, setStudents] = useState([]);
  // In the TaskDetail component, after finding foundClass in useEffect, store it in state for navigation
  const [classroomCode, setClassroomCode] = useState(null);
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

    // Find the classroom for this task
    let foundClass = null;
    for (const cls of teacherClasses) {
      const tasks = JSON.parse(localStorage.getItem(`classroom_tasks_${cls.code}`) || "[]");
      if (tasks.find(t => String(t.id) === String(taskId))) {
        foundClass = cls;
        break;
      }
    }
    if (foundClass) {
      // Try to load students for this classroom
      const studentsKey = `classroom_students_${foundClass.code}`;
      const loadedStudents = JSON.parse(localStorage.getItem(studentsKey) || "[]");
      setStudents(loadedStudents);
      setClassroomCode(foundClass.code);
    } else {
      setStudents([]);
      setClassroomCode(null);
    }
  }, [taskId]);

  // Local state for grades
  useEffect(() => {
    if (submissionsState.length === 0 && students.length > 0) {
      setSubmissionsState(students.map(s => ({ ...s })));
    }
    // Do not reset submissionsState on every students change
    // eslint-disable-next-line
  }, [students]);

  useEffect(() => {
    // Set default selected student (must not be conditional)
    if (students.length > 0 && !selectedStudentId) {
      setSelectedStudentId(students[0].id);
    }
    // Only run when submissions or selectedStudentId changes
    // eslint-disable-next-line
  }, [students, selectedStudentId]);

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
  const assignedStudentIds = task && Array.isArray(task.assignedStudents) ? task.assignedStudents : null;
  // Filter submissionsState to only assigned students if assignedStudentIds exists
  const filteredSubmissions = Array.isArray(assignedStudentIds)
    ? assignedStudentIds.length === 0
      ? []
      : submissionsState.filter(s => assignedStudentIds.map(String).includes(String(s.id)))
    : submissionsState;
  const selectedStudent = filteredSubmissions.find(s => s.id === selectedStudentId) || filteredSubmissions[0];

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

  // Handle grade submission from QRGradingPanel
  const handleQRGradeSubmit = ({ studentId, score, feedback, attachments, dateGraded }) => {
    setSubmissionsState(prev => prev.map(s => {
      if (String(s.id) === String(studentId)) {
        // Always update with the latest score, feedback, attachments, and dateGraded
        return {
          ...s,
          score: score !== "" ? Number(score) : undefined,
          feedback,
          attachments: attachments && attachments.length > 0 ? attachments : undefined,
          dateGraded
        };
      }
      return s;
    }));
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

  const turnedIn = filteredSubmissions.filter(s => s.status === 'Turned in').length;
  const assigned = filteredSubmissions.length;

  if (!task) {
    return (
      <div style={{ textAlign: 'center', color: '#888', fontWeight: 600, fontSize: 22, margin: '32px 0' }}>Task not found</div>
    );
  }

  return (
    <div style={outerStyle}>
      <div style={innerStyle}>
        {/* Tabs */}
        {task && task.title && (
          <h2 style={{ fontWeight: 700, textAlign: 'center', margin: '0 0 8px 0', fontSize: 28 }}>{task.title}</h2>
        )}
        <Nav tabs style={{ marginBottom: 0, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #324cdd11' }}>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 32, marginBottom: 24, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #324cdd11', padding: '18px 24px' }}>
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
                {/* QR Grading Toggle */}
                <span style={{ fontWeight: 500, fontSize: 15, marginLeft: 24 }}>
                  {qrGradingMode ? 'QR Grading' : 'Manual Grading'}
                </span>
                <span
                  onClick={() => setQrGradingMode(v => !v)}
                  style={{
                    display: 'inline-block',
                    width: 44,
                    height: 24,
                    borderRadius: 16,
                    background: qrGradingMode ? '#1976d2' : '#e0e0e0',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    verticalAlign: 'middle',
                  }}
                  tabIndex={0}
                  role="button"
                  aria-pressed={qrGradingMode}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: qrGradingMode ? 22 : 2,
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
              {/* Left: Student Table */}
              <div style={{ flex: 2, minWidth: 900, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #324cdd11', padding: 0, overflow: 'hidden', minHeight: 400 }}>
                <Table responsive hover style={{ background: '#fff', borderRadius: 8, fontSize: 15, margin: 0, minWidth: 900 }}>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Score</th>
                      <th>Attachment</th>
                      <th>Feedback</th>
                      <th>Date Graded</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubmissions.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', color: '#bbb', fontSize: 16 }}>
                          No students assigned to this task.
                        </td>
                      </tr>
                    ) : (
                      filteredSubmissions.map((s) => (
                        <tr
                          key={s.id}
                          onClick={!qrGradingMode ? () => setSelectedStudentId(s.id) : undefined}
                          style={{
                            background: !qrGradingMode && selectedStudentId === s.id ? '#e6f0ff' : undefined,
                            cursor: !qrGradingMode ? 'pointer' : 'default',
                            transition: 'background 0.15s',
                          }}
                        >
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <img src={s.avatar} alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%', marginRight: 8 }} />
                              <div>
                                <div style={{ fontWeight: 600, fontSize: 15 }}>{s.name || s.studentName}</div>
                                <div style={{ fontSize: 13, color: '#888' }}>{s.id}</div>
                              </div>
                            </div>
                          </td>
                          <td>{s.score !== undefined ? `${s.score}/${task && task.points ? task.points : 100}` : `--/${task && task.points ? task.points : 100}`}</td>
                          <td>
                            {qrGradingMode
                              ? (s.attachments && s.attachments.length > 0 ? s.attachments.map(a => a.name).join(', ') : '')
                              : (s.file && s.file.name ? s.file.name : '')}
                          </td>
                          <td>{s.feedback || ''}</td>
                          <td>{s.dateGraded || ''}</td>
                          <td>{/* Actions can be added here if needed */}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
              {/* Right: Submission Details */}
              {qrGradingMode ? (
                <QRGradingPanel student={selectedStudent} onGradeSubmit={handleQRGradeSubmit} />
              ) : (
                <div style={{ width: 340, maxHeight: 600, overflowY: 'auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #324cdd11', padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
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
              )}
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