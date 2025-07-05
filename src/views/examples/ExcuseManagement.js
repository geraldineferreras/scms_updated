import React, { useState } from "react";
import {
  Card, CardHeader, CardBody, Row, Col, Button, FormGroup, Input, Table, Badge, Modal, ModalHeader, ModalBody, ModalFooter, Alert
} from "reactstrap";
import { FaCheck, FaTimes, FaEye, FaSearch, FaFileImage } from "react-icons/fa";

const mockClasses = [
  { id: 1, name: "BSIT 3A" },
  { id: 2, name: "BSCS 2B" },
];
const mockExcuses = [
  {
    id: 1,
    student: { id: "2021305973", name: "ANJELA SOFIA G. SARMIENTO" },
    classId: 1,
    date: "2024-06-10",
    reason: "Fever and flu, unable to attend class.",
    attachment: "https://via.placeholder.com/100x100.png?text=Medical+Cert",
    status: "Pending",
  },
  {
    id: 2,
    student: { id: "2021002", name: "Jane Smith" },
    classId: 1,
    date: "2024-06-09",
    reason: "Family emergency.",
    attachment: "https://via.placeholder.com/100x100.png?text=Document",
    status: "Approved",
  },
  {
    id: 3,
    student: { id: "2021003", name: "Mike Johnson" },
    classId: 2,
    date: "2024-06-08",
    reason: "Transportation issues.",
    attachment: "https://via.placeholder.com/100x100.png?text=Note",
    status: "Rejected",
  },
];
const statusColors = {
  Pending: "warning",
  Approved: "success",
  Rejected: "danger",
};

const ExcuseManagement = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [detailModal, setDetailModal] = useState({ open: false, excuse: null });
  const [confirmModal, setConfirmModal] = useState({ open: false, excuse: null, action: null });
  const [excuses, setExcuses] = useState(mockExcuses);
  const [error, setError] = useState("");

  // Filter logic
  const filteredExcuses = excuses.filter(e => {
    if (selectedClass && e.classId !== Number(selectedClass)) return false;
    if (statusFilter !== "All" && e.status !== statusFilter) return false;
    if (dateFrom && e.date < dateFrom) return false;
    if (dateTo && e.date > dateTo) return false;
    if (search && !(
      e.student.name.toLowerCase().includes(search.toLowerCase()) ||
      e.student.id.includes(search)
    )) return false;
    return true;
  });

  // Approve/Reject logic
  const handleReview = (excuse, action) => {
    setConfirmModal({ open: true, excuse, action });
  };
  const confirmReview = () => {
    if (!confirmModal.excuse) return;
    setExcuses(excuses.map(e =>
      e.id === confirmModal.excuse.id ? { ...e, status: confirmModal.action === "approve" ? "Approved" : "Rejected" } : e
    ));
    setConfirmModal({ open: false, excuse: null, action: null });
  };

  // Table row highlight
  const getRowClass = (status) => status === "Pending" ? "bg-warning-light" : "";

  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8"></div>
      <div className="container mt--7">
        <Card className="shadow mb-4">
          <CardBody>
            <Row className="align-items-end mb-3">
              <Col md={3}>
                <FormGroup>
                  <label>Select Class</label>
                  <Input type="select" value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
                    <option value="">Choose...</option>
                    {mockClasses.map(cls => (
                      <option key={cls.id} value={cls.id}>{cls.name}</option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col md={2}>
                <FormGroup>
                  <label>From</label>
                  <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
                </FormGroup>
              </Col>
              <Col md={2}>
                <FormGroup>
                  <label>To</label>
                  <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
                </FormGroup>
              </Col>
              <Col md={2}>
                <FormGroup>
                  <label>Status</label>
                  <Input type="select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                    <option>All</option>
                    <option>Pending</option>
                    <option>Approved</option>
                    <option>Rejected</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md={3}>
                <FormGroup>
                  <label>Search</label>
                  <Input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by name or ID..."
                  />
                </FormGroup>
              </Col>
            </Row>
            <div className="table-responsive">
              <Table className="align-items-center table-hover table-striped">
                <thead className="thead-light">
                  <tr>
                    <th>Student</th>
                    <th>Date of Absence</th>
                    <th>Reason</th>
                    <th>Attachment</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExcuses.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center text-muted">
                        {selectedClass === "" ? "Select a class to view submitted excuse letters." : "No excuse submissions for this class yet."}
                      </td>
                    </tr>
                  ) : (
                    filteredExcuses.map(e => (
                      <tr key={e.id} className={getRowClass(e.status)}>
                        <td>
                          <b>{e.student.name}</b><br />
                          <small className="text-muted">ID: {e.student.id}</small>
                        </td>
                        <td>{e.date}</td>
                        <td>
                          <span style={{ cursor: "pointer", color: "#007bff" }} onClick={() => setDetailModal({ open: true, excuse: e })}>
                            {e.reason.length > 30 ? e.reason.slice(0, 30) + "..." : e.reason}
                          </span>
                        </td>
                        <td>
                          <Button color="link" onClick={() => setDetailModal({ open: true, excuse: e })}>
                            <FaFileImage /> View
                          </Button>
                        </td>
                        <td>
                          <Badge color={statusColors[e.status]}>{e.status}</Badge>
                        </td>
                        <td>
                          {e.status === "Pending" && (
                            <>
                              <Button color="success" size="sm" className="mr-1" onClick={() => handleReview(e, "approve")}> <FaCheck /> Approve</Button>
                              <Button color="danger" size="sm" onClick={() => handleReview(e, "reject")}> <FaTimes /> Reject</Button>
                            </>
                          )}
                          <Button color="primary" outline size="sm" className="ml-1" onClick={() => setDetailModal({ open: true, excuse: e })}><FaEye /> View</Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </CardBody>
        </Card>

        {/* Excuse Detail Modal */}
        <Modal isOpen={detailModal.open} toggle={() => setDetailModal({ open: false, excuse: null })} size="md" centered>
          <ModalHeader toggle={() => setDetailModal({ open: false, excuse: null })}>Excuse Details</ModalHeader>
          <ModalBody>
            {detailModal.excuse && (
              <>
                <Row className="mb-2">
                  <Col md={6}><b>Name:</b> {detailModal.excuse.student.name}</Col>
                  <Col md={6}><b>ID:</b> {detailModal.excuse.student.id}</Col>
                </Row>
                <Row className="mb-2">
                  <Col md={6}><b>Class:</b> {mockClasses.find(c => c.id === detailModal.excuse.classId)?.name}</Col>
                  <Col md={6}><b>Date:</b> {detailModal.excuse.date}</Col>
                </Row>
                <Row className="mb-2">
                  <Col md={12}><b>Reason:</b><br />{detailModal.excuse.reason}</Col>
                </Row>
                <Row className="mb-2">
                  <Col md={12} className="text-center">
                    <img
                      src={detailModal.excuse.attachment}
                      alt="Attachment"
                      style={{ maxWidth: "100%", maxHeight: 250, cursor: "zoom-in", borderRadius: 8 }}
                      onClick={e => window.open(detailModal.excuse.attachment, "_blank")}
                    />
                  </Col>
                </Row>
                {detailModal.excuse.status === "Pending" && (
                  <Row className="mt-3">
                    <Col className="text-center">
                      <Button color="success" className="mr-2" onClick={() => handleReview(detailModal.excuse, "approve")}>Approve</Button>
                      <Button color="danger" onClick={() => handleReview(detailModal.excuse, "reject")}>Reject</Button>
                    </Col>
                  </Row>
                )}
              </>
            )}
          </ModalBody>
        </Modal>

        {/* Approve/Reject Confirmation Modal */}
        <Modal isOpen={confirmModal.open} toggle={() => setConfirmModal({ open: false, excuse: null, action: null })} centered>
          <ModalHeader toggle={() => setConfirmModal({ open: false, excuse: null, action: null })}>
            {confirmModal.action === "approve" ? "Approve Excuse" : "Reject Excuse"}
          </ModalHeader>
          <ModalBody>
            Are you sure you want to {confirmModal.action} this excuse letter?
          </ModalBody>
          <ModalFooter>
            <Button color={confirmModal.action === "approve" ? "success" : "danger"} onClick={confirmReview}>
              Yes, {confirmModal.action === "approve" ? "Approve" : "Reject"}
            </Button>
            <Button color="secondary" onClick={() => setConfirmModal({ open: false, excuse: null, action: null })}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    </>
  );
};

export default ExcuseManagement; 