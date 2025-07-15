import React, { useState, useEffect, useRef } from "react";
import {
  Container, Row, Col, Card, CardHeader, CardBody, Button, Nav, NavItem, NavLink, Form, FormGroup, Label, Input, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Collapse, Table, UncontrolledDropdown
} from "reactstrap";
import { FaPlus, FaEllipsisV, FaEdit, FaTrash, FaPaperclip, FaQrcode } from "react-icons/fa";
import { QrReader } from "react-qr-reader";

const TABS = [
  { key: "split", label: "Split View" },
  { key: "input", label: "Input Panel" },
  { key: "table", label: "Grade Table" },
];

const gradingTypes = [
  "Assignment", "Activity", "Recitation", "Quiz", "Exam", "Performance Task", "Project"
];

// Mock data for classes and students
const mockStudents = [
  { id: "2021305973", name: "ANJELA SOFIA G. SARMIENTO", avatar: require("../../assets/img/theme/team-1-800x800.jpg"), classId: 1 },
  { id: "2021305974", name: "JUAN DELA CRUZ", avatar: require("../../assets/img/theme/team-2-800x800.jpg"), classId: 1 },
  { id: "2021305975", name: "MARIA CLARA", avatar: require("../../assets/img/theme/team-3-800x800.jpg"), classId: 2 },
];

const initialAssessmentForm = {
  classId: "",
  gradingType: gradingTypes[0],
  title: "",
  points: "",
};

const TeacherFastGrade = () => {
  const [activeTab, setActiveTab] = useState("split");
  const [assessmentForm, setAssessmentForm] = useState(initialAssessmentForm);
  const [assessments, setAssessments] = useState([]);
  const [activeAssessment, setActiveAssessment] = useState(null);
  const [editAssessmentId, setEditAssessmentId] = useState(null);
  const [editAssessmentForm, setEditAssessmentForm] = useState(initialAssessmentForm);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [collapseOpen, setCollapseOpen] = useState({});
  const [classrooms, setClassrooms] = useState([]);
  const [scannerOn, setScannerOn] = useState(false);
  const [scannerResult, setScannerResult] = useState(null);
  const [scannerStatus, setScannerStatus] = useState(null); // 'success' | 'error' | null
  const [scannerMessage, setScannerMessage] = useState("");
  const [audioType, setAudioType] = useState("female");
  const audioRef = useRef();

  useEffect(() => {
    // Load classrooms from localStorage
    const saved = localStorage.getItem("teacherClasses");
    if (saved) {
      setClassrooms(JSON.parse(saved));
    } else {
      setClassrooms([]);
    }
  }, []);

  // Grade table mock state
  const [grades, setGrades] = useState({}); // { assessmentId: [ { studentId, score, ... } ] }

  // Assessment creation handlers
  const handleAssessmentFormChange = e => {
    const { name, value } = e.target;
    setAssessmentForm(f => ({ ...f, [name]: value }));
  };
  const handleCreateAssessment = () => {
    if (!assessmentForm.classId || !assessmentForm.title || !assessmentForm.points) return;
    const newAssessment = {
      ...assessmentForm,
      id: Date.now(),
      created: new Date(),
    };
    setAssessments(a => [newAssessment, ...a]);
    setAssessmentForm(initialAssessmentForm);
    setCollapseOpen(c => ({ ...c, [newAssessment.id]: true }));
  };
  // Edit/delete assessment
  const handleEditAssessment = (id) => {
    const assessment = assessments.find(a => a.id === id);
    setEditAssessmentId(id);
    setEditAssessmentForm({ ...assessment });
  };
  const handleSaveEditAssessment = () => {
    setAssessments(a => a.map(ass => ass.id === editAssessmentId ? { ...editAssessmentForm } : ass));
    setEditAssessmentId(null);
  };
  const handleCancelEditAssessment = () => setEditAssessmentId(null);
  const handleDeleteAssessment = (id) => {
    setAssessments(a => a.filter(ass => ass.id !== id));
    setEditAssessmentId(null);
  };
  // Collapse toggle
  const handleToggleCollapse = (id) => {
    setCollapseOpen(c => ({ ...c, [id]: !c[id] }));
    setActiveAssessment(id);
  };
  // Dropdown toggle
  const handleDropdownToggle = (id) => {
    setDropdownOpen(d => ({ ...d, [id]: !d[id] }));
  };

  // Play audio notification
  const playAudio = (type) => {
    if (audioRef.current) {
      audioRef.current.src = type === "male" ? "/grading-success-male.mp3" : "/grading-success-female.mp3";
      audioRef.current.play();
    }
  };

  // Handle QR scan
  const handleScan = (data) => {
    if (!data) return;
    // Parse QR code: expect format 'IDNo: 2021305973\nFull Name: ...\nProgram: ...'
    const idMatch = data.match(/IDNo:\s*(\d{10})/);
    const nameMatch = data.match(/Full Name:\s*([A-Z .]+)/i);
    if (!idMatch) {
      setScannerStatus("error");
      setScannerMessage("Invalid QR code format.");
      setScannerResult(null);
      return;
    }
    const studentId = idMatch[1];
    // Find student in class
    const assessment = assessments.find(a => collapseOpen[a.id]);
    if (!assessment) return;
    // For demo, use mockStudents; in real, fetch from class list
    const student = mockStudents.find(s => s.id === studentId && s.classId === Number(assessment.classId));
    if (!student) {
      setScannerStatus("error");
      setScannerMessage("This student is not enrolled in this class.");
      setScannerResult(null);
      return;
    }
    // Check if already graded (for demo, always false)
    // TODO: Check grades[assessment.id] for studentId
    setScannerStatus("success");
    setScannerMessage("Student found: " + student.name);
    setScannerResult(student);
    playAudio(audioType);
  };
  const handleError = (err) => {
    setScannerStatus("error");
    setScannerMessage("QR scanner error.");
  };

  // Render assessment card header
  const renderAssessmentHeader = (assessment) => (
    <div className="d-flex align-items-center justify-content-between w-100">
      <div className="d-flex align-items-center">
        <FaQrcode style={{ fontSize: 28, color: '#17a2b8', marginRight: 12 }} />
        <div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{assessment.title}</div>
          <div style={{ fontSize: 12, color: '#888' }}>{assessment.gradingType} &bull; {assessment.points} pts</div>
        </div>
      </div>
      <div>
        <UncontrolledDropdown>
          <DropdownToggle tag="span" style={{ cursor: 'pointer' }}>
            <FaEllipsisV />
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem onClick={() => handleEditAssessment(assessment.id)}><FaEdit className="mr-2" />Edit</DropdownItem>
            <DropdownItem onClick={() => handleDeleteAssessment(assessment.id)}><FaTrash className="mr-2" />Delete</DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    </div>
  );

  // Render assessment card body (split view)
  const renderAssessmentBody = (assessment) => (
    <Row>
      <Col md="3" style={{ minWidth: 220, maxWidth: 260 }}>
        {/* Input Panel Placeholder */}
        <Card className="mb-3" style={{ minHeight: 320, background: '#f8fafd', borderRadius: 12, boxShadow: '0 2px 8px #e9ecef' }}>
          <CardBody style={{ fontSize: 15 }}>
            <div className="mb-2">
              <Label className="font-weight-bold" style={{ fontSize: 15 }}>Audio Notification</Label>
              <Input type="select" value={audioType} onChange={e => setAudioType(e.target.value)} bsSize="md" style={{ fontSize: 15 }}>
                <option value="female">Female</option>
                <option value="male">Male</option>
              </Input>
            </div>
            <div className="mb-2">
              <Button color={scannerOn ? "danger" : "info"} outline block style={{ borderRadius: 10, fontWeight: 600, fontSize: 15, padding: '8px 0' }} size="md" onClick={() => setScannerOn(on => !on)}>
                <FaQrcode className="mr-2" style={{ fontSize: 18 }} />{scannerOn ? "Turn Off QR Scanner" : "Turn On QR Scanner"}
              </Button>
              <div className="text-center mt-2" style={{ height: 140 }}>
                <div style={{ width: 120, height: 120, border: scannerStatus === 'success' ? '3px solid #28a745' : scannerStatus === 'error' ? '3px solid #dc3545' : '3px solid #17a2b8', borderRadius: 8, margin: '0 auto', position: 'relative', transition: 'border 0.2s' }}>
                  {scannerOn && (
                    <QrReader
                      delay={300}
                      onError={handleError}
                      onScan={handleScan}
                      style={{ width: '100%', height: '100%' }}
                    />
                  )}
                  {/* Brackets (corners) */}
                  <div style={{ position: 'absolute', top: -3, left: -3, width: 16, height: 16, borderTop: scannerStatus === 'success' ? '3px solid #28a745' : scannerStatus === 'error' ? '3px solid #dc3545' : '3px solid #17a2b8', borderLeft: scannerStatus === 'success' ? '3px solid #28a745' : scannerStatus === 'error' ? '3px solid #dc3545' : '3px solid #17a2b8' }} />
                  <div style={{ position: 'absolute', top: -3, right: -3, width: 16, height: 16, borderTop: scannerStatus === 'success' ? '3px solid #28a745' : scannerStatus === 'error' ? '3px solid #dc3545' : '3px solid #17a2b8', borderRight: scannerStatus === 'success' ? '3px solid #28a745' : scannerStatus === 'error' ? '3px solid #dc3545' : '3px solid #17a2b8' }} />
                  <div style={{ position: 'absolute', bottom: -3, left: -3, width: 16, height: 16, borderBottom: scannerStatus === 'success' ? '3px solid #28a745' : scannerStatus === 'error' ? '3px solid #dc3545' : '3px solid #17a2b8', borderLeft: scannerStatus === 'success' ? '3px solid #28a745' : scannerStatus === 'error' ? '3px solid #dc3545' : '3px solid #17a2b8' }} />
                  <div style={{ position: 'absolute', bottom: -3, right: -3, width: 16, height: 16, borderBottom: scannerStatus === 'success' ? '3px solid #28a745' : scannerStatus === 'error' ? '3px solid #dc3545' : '3px solid #17a2b8', borderRight: scannerStatus === 'success' ? '3px solid #28a745' : scannerStatus === 'error' ? '3px solid #dc3545' : '3px solid #17a2b8' }} />
                </div>
              </div>
              {scannerMessage && (
                <div className="mt-2" style={{ color: scannerStatus === 'success' ? '#28a745' : '#dc3545', fontWeight: 600, fontSize: 14 }}>{scannerMessage}</div>
              )}
              <audio ref={audioRef} style={{ display: 'none' }} />
              {scannerResult && (
                <div className="mt-2 p-2" style={{ background: '#f6fff6', borderRadius: 8, border: '1px solid #28a745' }}>
                  <div className="d-flex align-items-center">
                    <img src={scannerResult.avatar} alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%', marginRight: 10 }} />
                    <div>
                      <div style={{ fontWeight: 600 }}>{scannerResult.name}</div>
                      <div style={{ fontSize: 13, color: '#888' }}>{scannerResult.id}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="mb-2">
              <Label className="font-weight-bold" style={{ fontSize: 15 }}>Score</Label>
              <Input type="number" min="0" max={assessment.points} placeholder={`Enter score (out of ${assessment.points})`} bsSize="md" style={{ fontSize: 15 }} />
            </div>
            <div className="mb-2">
              <Label className="font-weight-bold" style={{ fontSize: 15 }}>Attachment</Label>
              <Button color="secondary" outline size="md" style={{ borderRadius: 10, fontWeight: 600, fontSize: 15, padding: '2px 8px' }}>
                <FaPaperclip className="mr-1" style={{ fontSize: 15 }} />
              </Button>
              <Dropdown isOpen={false} toggle={() => {}} style={{ display: 'inline-block', marginLeft: 8 }}>
                <DropdownToggle color="secondary" size="md" style={{ borderRadius: 10, fontWeight: 600, fontSize: 15 }}>
                  Scan Paper
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem>Camera Scanner (Modal)</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
            <div className="mb-2">
              <Label className="font-weight-bold" style={{ fontSize: 15 }}>Feedback</Label>
              <Input type="textarea" rows={2} placeholder="Optional feedback..." bsSize="md" style={{ fontSize: 15 }} />
              <Button color="info" outline size="md" className="mt-2" style={{ borderRadius: 10, fontWeight: 600, fontSize: 15, padding: '2px 8px' }}>
                Audio Feedback
              </Button>
            </div>
          </CardBody>
        </Card>
      </Col>
      <Col md="9">
        {/* Grade Table Placeholder */}
        <Card className="mb-3" style={{ borderRadius: 12, boxShadow: '0 2px 8px #e9ecef' }}>
          <CardBody style={{ fontSize: 15 }}>
            <Table responsive hover style={{ background: '#fff', borderRadius: 8, fontSize: 15 }}>
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
                {/* Example row, replace with dynamic data */}
                {mockStudents.filter(s => s.classId === Number(assessment.classId)).map(student => (
                  <tr key={student.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img src={student.avatar} alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%', marginRight: 8 }} />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 15 }}>{student.name}</div>
                          <div style={{ fontSize: 13, color: '#888' }}>{student.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>--/--</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                      <Button color="link" size="md" style={{ fontSize: 15, padding: '2px 6px' }}><FaEdit /></Button>
                      <Button color="link" size="md" style={{ fontSize: 15, padding: '2px 6px' }}><FaTrash /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );

  // Main render
  return (
    <Container fluid className="pt-4">
      {/* Assessment creation form */}
      <Card className="mb-4" style={{ borderRadius: 12, boxShadow: '0 2px 8px #e9ecef' }}>
        <CardBody>
          <Form inline className="d-flex flex-wrap align-items-end" style={{ gap: 10, fontSize: 13 }}>
            <FormGroup className="mb-2">
              <Label for="classId" className="mr-2 font-weight-bold" style={{ fontSize: 13 }}>Class</Label>
              <Input
                type="select"
                name="classId"
                id="classId"
                value={assessmentForm.classId}
                onChange={handleAssessmentFormChange}
                style={{ minWidth: 120, fontSize: 13 }}
                bsSize="sm"
              >
                <option value="">Select Class</option>
                {classrooms.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.subject ? `${cls.subject} (${cls.section})` : cls.name}</option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup className="mb-2">
              <Label for="gradingType" className="mr-2 font-weight-bold" style={{ fontSize: 13 }}>Type</Label>
              <Input
                type="select"
                name="gradingType"
                id="gradingType"
                value={assessmentForm.gradingType}
                onChange={handleAssessmentFormChange}
                style={{ minWidth: 120, fontSize: 13 }}
                bsSize="sm"
              >
                {gradingTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup className="mb-2">
              <Label for="title" className="mr-2 font-weight-bold" style={{ fontSize: 13 }}>Title</Label>
              <Input
                type="text"
                name="title"
                id="title"
                value={assessmentForm.title}
                onChange={handleAssessmentFormChange}
                placeholder="Assessment Title"
                style={{ minWidth: 140, fontSize: 13 }}
                bsSize="sm"
              />
            </FormGroup>
            <FormGroup className="mb-2">
              <Label for="points" className="mr-2 font-weight-bold" style={{ fontSize: 13 }}>Total Points</Label>
              <Input
                type="number"
                name="points"
                id="points"
                value={assessmentForm.points}
                onChange={handleAssessmentFormChange}
                placeholder="Points"
                min="1"
                style={{ width: 80, fontSize: 13 }}
                bsSize="sm"
              />
            </FormGroup>
            <Button color="primary" className="mb-2" onClick={handleCreateAssessment} style={{ borderRadius: 10, fontWeight: 700, minWidth: 90, fontSize: 13, padding: '4px 12px' }} size="sm">
              <FaPlus className="mr-2" style={{ fontSize: 13 }} />Create
            </Button>
          </Form>
        </CardBody>
      </Card>

      {/* Assessment cards */}
      {assessments.map(assessment => (
        <Card key={assessment.id} className="mb-3" style={{ borderRadius: 12, boxShadow: '0 2px 8px #e9ecef' }}>
          <CardHeader style={{ cursor: 'pointer', background: '#f7fafd', fontSize: 13 }} onClick={() => handleToggleCollapse(assessment.id)}>
            {editAssessmentId === assessment.id ? (
              <Form inline className="d-flex flex-wrap align-items-end" style={{ gap: 10, fontSize: 13 }}>
                <FormGroup className="mb-2">
                  <Input
                    type="text"
                    name="title"
                    value={editAssessmentForm.title}
                    onChange={e => setEditAssessmentForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="Assessment Title"
                    style={{ minWidth: 140, fontSize: 13 }}
                    bsSize="sm"
                  />
                </FormGroup>
                <FormGroup className="mb-2">
                  <Input
                    type="number"
                    name="points"
                    value={editAssessmentForm.points}
                    onChange={e => setEditAssessmentForm(f => ({ ...f, points: e.target.value }))}
                    placeholder="Points"
                    min="1"
                    style={{ width: 80, fontSize: 13 }}
                    bsSize="sm"
                  />
                </FormGroup>
                <Button
                  className="mb-2"
                  onClick={handleSaveEditAssessment}
                  style={{
                    borderRadius: 10,
                    fontWeight: 700,
                    minWidth: 70,
                    fontSize: 15,
                    padding: '4px 10px',
                    background: '#2DCE89',
                    color: '#fff',
                    border: 'none',
                    boxShadow: '0 2px 8px #e9ecef',
                  }}
                  size="md"
                >
                  Save
                </Button>
                <Button color="secondary" className="mb-2" onClick={handleCancelEditAssessment} style={{ borderRadius: 10, fontWeight: 700, minWidth: 70, fontSize: 13, padding: '4px 10px' }} size="sm">Cancel</Button>
              </Form>
            ) : (
              renderAssessmentHeader(assessment)
            )}
          </CardHeader>
          <Collapse isOpen={!!collapseOpen[assessment.id]}>
            <CardBody style={{ background: '#fafdff', fontSize: 13 }}>
              {/* Tab system logic */}
              {activeTab === "split" && renderAssessmentBody(assessment)}
              {activeTab === "input" && (
                <Row>
                  <Col md="3" style={{ minWidth: 220, maxWidth: 260 }}>{renderAssessmentBody(assessment).props.children[0]}</Col>
                </Row>
              )}
              {activeTab === "table" && (
                <Row>
                  <Col md="12">{renderAssessmentBody(assessment).props.children[1]}</Col>
                </Row>
              )}
            </CardBody>
          </Collapse>
        </Card>
      ))}
    </Container>
  );
};

export default TeacherFastGrade; 