import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Button,
  FormGroup,
  Input,
  Table,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Alert,
} from "reactstrap";
import { FaQrcode, FaTable, FaCheckCircle, FaTimesCircle, FaUndo, FaUser, FaDownload, FaCalendarAlt } from "react-icons/fa";
import { QrReader } from "react-qr-reader";

const mockClasses = [
  { id: 1, name: "OOP - 3A" },
  { id: 2, name: "Data Structures - 2B" },
  { id: 3, name: "Web Development - 4A" },
];

const mockStudents = [
  { id: "2021001", name: "John Doe" },
  { id: "2021002", name: "Jane Smith" },
  { id: "2021003", name: "Mike Johnson" },
  { id: "2021305973", name: "ANJELA SOFIA G. SARMIENTO" },
];

const today = new Date().toISOString().slice(0, 10);

const initialAttendance = [
  // Example: { studentId: "2021001", name: "John Doe", timeIn: "08:05", status: "Present", notes: "" }
];

const statusColors = {
  Present: "success",
  Late: "warning",
  Absent: "danger",
};

const TeacherAttendance = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(today);
  const [attendance, setAttendance] = useState(initialAttendance);
  const [qrModal, setQrModal] = useState(false);
  const [manualTable, setManualTable] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanStatus, setScanStatus] = useState(null); // 'success' | 'error'
  const [lastScan, setLastScan] = useState(null);
  const [summary, setSummary] = useState({ Present: 0, Late: 0, Absent: 0 });

  // Simulate QR scan (for demo)
  const handleSimulateScan = () => {
    // Pick a random student
    const student = mockStudents[Math.floor(Math.random() * mockStudents.length)];
    const now = new Date();
    const timeIn = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    // Always mark as Present
    const status = "Present";
    const record = {
      studentId: student.id,
      name: student.name,
      timeIn,
      status,
      notes: "",
    };
    setAttendance(prev => {
      const filtered = prev.filter(a => a.studentId !== student.id);
      return [...filtered, record];
    });
    setScanResult({ ...record });
    setScanStatus("success");
    setLastScan({ ...record });
    setTimeout(() => setScanResult(null), 2500);
    updateSummary([...attendance.filter(a => a.studentId !== student.id), record]);
  };

  const handleUndoLast = () => {
    if (!lastScan) return;
    setAttendance(prev => prev.filter(a => a.studentId !== lastScan.studentId));
    setScanResult(null);
    setScanStatus(null);
    setLastScan(null);
    updateSummary(attendance.filter(a => a.studentId !== lastScan.studentId));
  };

  const handleStatusChange = (studentId, newStatus) => {
    setAttendance(prev => prev.map(a => a.studentId === studentId ? { ...a, status: newStatus } : a));
    updateSummary(attendance.map(a => a.studentId === studentId ? { ...a, status: newStatus } : a));
  };

  const handleNotesChange = (studentId, notes) => {
    setAttendance(prev => prev.map(a => a.studentId === studentId ? { ...a, notes } : a));
  };

  const updateSummary = (att) => {
    const summary = { Present: 0, Late: 0, Absent: 0 };
    att.forEach(a => { if (summary[a.status] !== undefined) summary[a.status]++; });
    setSummary(summary);
  };

  // Empty state
  const noAttendance = attendance.length === 0;

  function parseStudentQR(text) {
    // Example: "IDNo: 2021305973 Full Name: ANJELA SOFIA G. SARMIENTO Program: ..."
    const idMatch = text.match(/IDNo:\s*(\d+)/i);
    const nameMatch = text.match(/Full Name:\s*([A-Z.\s]+)/i);
    return {
      id: idMatch ? idMatch[1] : null,
      name: nameMatch ? nameMatch[1].trim() : null,
    };
  }

  const handleQrScan = (result, error) => {
    if (!!result) {
      const { id, name } = parseStudentQR(result?.text || "");
      if (!id) {
        setScanResult(null);
        setScanStatus("error");
        return;
      }
      // Find student by extracted ID
      const student = mockStudents.find(s => s.id === id);
      if (student) {
        const now = new Date();
        const timeIn = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const status = "Present";
        const record = {
          studentId: student.id,
          name: student.name,
          timeIn,
          status,
          notes: "",
        };
        setAttendance(prev => {
          const filtered = prev.filter(a => a.studentId !== student.id);
          return [...filtered, record];
        });
        setScanResult({ ...record });
        setScanStatus("success");
        setLastScan({ ...record });
        setTimeout(() => setScanResult(null), 2500);
        updateSummary([...attendance.filter(a => a.studentId !== student.id), record]);
      } else {
        setScanResult(null);
        setScanStatus("error");
      }
    }
  };

  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8"></div>
      <Container className="mt--7" fluid>
        <Card className="shadow">
          <CardHeader>
            <h2 className="mb-0">Attendance</h2>
            <p className="text-muted mb-0">Record and manage student attendance via QR code or manual entry.</p>
          </CardHeader>
          <CardBody>
            <Row className="mb-4 align-items-center g-2">
              <Col md={3} className="d-flex align-items-center">
                <FormGroup className="w-100">
                  <label className="form-control-label mb-2">Select Class</label>
                  <UncontrolledDropdown className="w-100">
                    <DropdownToggle
                      caret
                      color="primary"
                      className="w-100 text-left font-weight-bold shadow"
                      style={{ borderRadius: "8px", height: "44px", display: "flex", alignItems: "center" }}
                    >
                      {selectedClass ? mockClasses.find(c => c.id === parseInt(selectedClass))?.name : "Choose a class..."}
                    </DropdownToggle>
                    <DropdownMenu className="w-100">
                      {mockClasses.map(cls => (
                        <DropdownItem key={cls.id} onClick={() => setSelectedClass(cls.id.toString())}>
                          {cls.name}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </FormGroup>
              </Col>
              <Col md={3} className="d-flex align-items-center">
                <FormGroup className="w-100">
                  <label className="form-control-label mb-2">Date</label>
                  <Input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} style={{ height: "44px", borderRadius: "8px" }} />
                </FormGroup>
              </Col>
              <Col md={3} className="d-flex align-items-center">
                <Button
                  color="success"
                  className="w-100 font-weight-bold shadow"
                  style={{ height: "44px", borderRadius: "8px", whiteSpace: "nowrap" }}
                  onClick={() => setQrModal(true)}
                  disabled={!selectedClass}
                >
                  <FaQrcode className="mr-2" /> Start QR Scan
                </Button>
              </Col>
              <Col md={3} className="d-flex align-items-center">
                <Button
                  color="info"
                  className="w-100 font-weight-bold shadow"
                  style={{ height: "44px", borderRadius: "8px", whiteSpace: "nowrap" }}
                  onClick={() => setManualTable(true)}
                  disabled={!selectedClass}
                >
                  <FaTable className="mr-2" /> View Manual Attendance Table
                </Button>
              </Col>
            </Row>

            {/* Attendance Summary Widgets */}
            <Row className="mb-4">
              <Col md={2}>
                <Card className="shadow text-center">
                  <CardBody>
                    <h5 className="text-success mb-0">Present</h5>
                    <h2 className="text-success mb-0">{summary.Present}</h2>
                  </CardBody>
                </Card>
              </Col>
              <Col md={2}>
                <Card className="shadow text-center">
                  <CardBody>
                    <h5 className="text-warning mb-0">Late</h5>
                    <h2 className="text-warning mb-0">{summary.Late}</h2>
                  </CardBody>
                </Card>
              </Col>
              <Col md={2}>
                <Card className="shadow text-center">
                  <CardBody>
                    <h5 className="text-danger mb-0">Absent</h5>
                    <h2 className="text-danger mb-0">{summary.Absent}</h2>
                  </CardBody>
                </Card>
              </Col>
              <Col md={6} className="d-flex align-items-center justify-content-end">
                <Button color="secondary" className="font-weight-bold shadow" style={{ borderRadius: "8px" }}>
                  <FaDownload className="mr-2" /> Export Attendance
                </Button>
              </Col>
            </Row>

            {/* QR Scan Modal */}
            <Modal isOpen={qrModal} toggle={() => setQrModal(false)} size="lg" centered>
              <ModalHeader toggle={() => setQrModal(false)}>
                QR Code Attendance Scan
              </ModalHeader>
              <ModalBody>
                {/* Real camera preview with QR scanner */}
                <div className="text-center mb-4">
                  <div style={{ width: 320, height: 300, margin: '0 auto', borderRadius: 12, overflow: 'hidden', background: '#f5f6fa' }}>
                    <QrReader
                      constraints={{ facingMode: "environment" }}
                      onResult={handleQrScan}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>
                </div>
                {scanResult && (
                  <Alert color={scanStatus === "success" ? "success" : "danger"} className="text-center">
                    {scanStatus === "success" ? (
                      <>
                        <FaCheckCircle className="text-success mr-2" size={24} />
                        Attendance recorded for <b>{scanResult.name}</b> – {scanResult.timeIn}
                      </>
                    ) : (
                      <>
                        <FaTimesCircle className="text-danger mr-2" size={24} />
                        Scan failed. Please try again.
                      </>
                    )}
                  </Alert>
                )}
                {scanResult && scanStatus === "success" && (
                  <Card className="shadow mt-3 mb-2">
                    <CardBody className="d-flex align-items-center">
                      <div className="icon icon-shape bg-info text-white rounded-circle mr-3">
                        <FaUser size={32} />
                      </div>
                      <div>
                        <h4 className="mb-1">{scanResult.name}</h4>
                        <div className="mb-1">ID: {scanResult.studentId}</div>
                        <div className="mb-1">Time In: {scanResult.timeIn}</div>
                        <div className="mb-1">
                          Status: <Badge color={statusColors[scanResult.status]}>{scanResult.status}</Badge>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                )}
                <div className="d-flex justify-content-between mt-3">
                  <Button color="warning" onClick={handleUndoLast} disabled={!lastScan}>
                    <FaUndo className="mr-2" /> Undo Last
                  </Button>
                  <Button color="secondary" onClick={() => setQrModal(false)}>
                    Close
                  </Button>
                </div>
              </ModalBody>
            </Modal>

            {/* Manual Attendance Table (always visible for now) */}
            <Card className="shadow mt-4">
              <CardHeader>
                <Row className="align-items-center">
                  <Col>
                    <h3 className="mb-0">Attendance Log</h3>
                  </Col>
                  <Col className="text-right">
                    <Button color="info" size="sm" onClick={() => setManualTable(true)}>
                      <FaTable className="mr-2" /> Manual Edit
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                {noAttendance ? (
                  <Alert color="info" className="text-center">
                    No attendance records yet for this class today.<br />
                    Scan a QR code to begin recording attendance.
                  </Alert>
                ) : (
                  <div className="table-responsive">
                    <Table className="align-items-center table-flush">
                      <thead className="thead-light">
                        <tr>
                          <th>Student</th>
                          <th>Time In</th>
                          <th>Status</th>
                          <th>Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendance.map((a) => (
                          <tr key={a.studentId} className={`bg-${statusColors[a.status]}-light`}>
                            <td>
                              <b>{a.name}</b><br />
                              <small className="text-muted">ID: {a.studentId}</small>
                            </td>
                            <td>{a.timeIn}</td>
                            <td>
                              <UncontrolledDropdown>
                                <DropdownToggle caret color={statusColors[a.status]} size="sm">
                                  {a.status}
                                </DropdownToggle>
                                <DropdownMenu>
                                  {Object.keys(statusColors).map(status => (
                                    <DropdownItem key={status} onClick={() => handleStatusChange(a.studentId, status)}>
                                      {status}
                                    </DropdownItem>
                                  ))}
                                </DropdownMenu>
                              </UncontrolledDropdown>
                            </td>
                            <td>
                              <Input
                                type="text"
                                value={a.notes}
                                onChange={e => handleNotesChange(a.studentId, e.target.value)}
                                placeholder="Add notes..."
                                size="sm"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </CardBody>
            </Card>
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default TeacherAttendance;
