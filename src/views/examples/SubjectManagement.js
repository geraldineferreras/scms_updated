import React, { useState } from "react";
import {
  Card, CardBody, CardHeader, Table, Input, Row, Col, Button, Badge, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, InputGroup, InputGroupAddon, InputGroupText, Alert, Pagination, PaginationItem, PaginationLink
} from "reactstrap";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import Header from "components/Headers/Header.js";

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

const initialSubjects = [
  { id: 1, code: "CS101", name: "Object-Oriented Programming", date: getToday() },
  { id: 2, code: "DBMS201", name: "Database Management Systems", date: getToday() },
];

// Floating effect for content over header
const subjectManagementStyles = `
  .section-content-container {
    margin-top: -150px;
    z-index: 2;
    position: relative;
    margin-left: 32px;
    margin-right: 32px;
  }
  @media (max-width: 767.98px) {
    .section-content-container {
      margin-left: 8px;
      margin-right: 8px;
    }
  }
  .section-content-card {
    border-radius: 16px;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.10);
  }
`;

export default function SubjectManagement() {
  const [subjects, setSubjects] = useState(initialSubjects);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [formError, setFormError] = useState("");
  const [showToast, setShowToast] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [editSubject, setEditSubject] = useState(null);
  const [editName, setEditName] = useState("");
  const [editError, setEditError] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteSubject, setDeleteSubject] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtered and paginated subjects
  const filteredSubjects = subjects.filter(s =>
    s.code.toLowerCase().includes(search.toLowerCase()) ||
    s.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredSubjects.length / itemsPerPage);
  const paginatedSubjects = filteredSubjects.slice((currentPage-1)*itemsPerPage, currentPage*itemsPerPage);

  // Add subject
  const handleAdd = () => {
    setFormError("");
    if (!code.trim() || !name.trim()) {
      setFormError("Subject code and name are required.");
      return;
    }
    if (subjects.some(s => s.code.toLowerCase() === code.trim().toLowerCase())) {
      setFormError("Subject code must be unique.");
      return;
    }
    if (subjects.some(s => s.name.toLowerCase() === name.trim().toLowerCase())) {
      setFormError("Subject name must be unique.");
      return;
    }
    setSubjects([
      ...subjects,
      { id: subjects.length ? Math.max(...subjects.map(s => s.id)) + 1 : 1, code: code.trim(), name: name.trim(), date: getToday() }
    ]);
    setCode("");
    setName("");
    setShowToast("Subject added successfully.");
    setTimeout(() => setShowToast(""), 2000);
  };

  // Edit subject
  const openEdit = (subject) => {
    setEditSubject(subject);
    setEditName(subject.name);
    setEditError("");
    setEditModal(true);
  };
  const handleEditSave = () => {
    if (!editName.trim()) {
      setEditError("Subject name is required.");
      return;
    }
    if (subjects.some(s => s.name.toLowerCase() === editName.trim().toLowerCase() && s.id !== editSubject.id)) {
      setEditError("Subject name must be unique.");
      return;
    }
    setSubjects(subjects.map(s => s.id === editSubject.id ? { ...s, name: editName.trim() } : s));
    setEditModal(false);
    setShowToast("Subject updated successfully.");
    setTimeout(() => setShowToast(""), 2000);
  };

  // Delete subject
  const openDelete = (subject) => {
    setDeleteSubject(subject);
    setDeleteModal(true);
  };
  const handleDelete = () => {
    setSubjects(subjects.filter(s => s.id !== deleteSubject.id));
    setDeleteModal(false);
    setShowToast("Subject deleted successfully.");
    setTimeout(() => setShowToast(""), 2000);
  };

  // Pagination
  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <>
      <style>{subjectManagementStyles}</style>
      <Header showStats={false} />
      <div className="section-content-container">
        <Card className="shadow-sm rounded mb-4 section-content-card">
          <CardBody>
            {/* Add Subject Form */}
            <Row className="align-items-end mb-4">
              <Col md={5} xs={12} className="mb-2 mb-md-0">
                <Input
                  placeholder="e.g., CS101"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  maxLength={16}
                  className="form-control"
                  style={{ borderRadius: 8 }}
                />
                <small className="text-muted">Subject Code</small>
              </Col>
              <Col md={5} xs={12} className="mb-2 mb-md-0">
                <Input
                  placeholder="e.g., Object-Oriented Programming"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  maxLength={64}
                  className="form-control"
                  style={{ borderRadius: 8 }}
                />
                <small className="text-muted">Subject Name</small>
              </Col>
              <Col md={2} xs={12} className="text-md-right mt-2 mt-md-0">
                <Button color="primary" block onClick={handleAdd} style={{ borderRadius: 8, fontWeight: 600 }}>
                  Add Subject
                </Button>
              </Col>
            </Row>
            {formError && <Alert color="danger" className="py-2 mb-3">{formError}</Alert>}
            {showToast && <Alert color="success" className="py-2 mb-3">{showToast}</Alert>}
            {/* Search Bar */}
            <Row className="mb-3 align-items-center">
              <Col md={6} xs={12} className="mb-2 mb-md-0">
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText><FaSearch /></InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Search by subject code or name"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={6} xs={12} className="text-md-right mt-2 mt-md-0">
                <span className="text-muted" style={{ fontSize: 15 }}>
                  Total Subjects: <b>{filteredSubjects.length}</b>
                </span>
              </Col>
            </Row>
            {/* Subject Table */}
            <div className="table-responsive">
              <Table className="align-items-center table-striped table-hover" bordered>
                <thead className="thead-light">
                  <tr>
                    <th>#</th>
                    <th>Subject Code</th>
                    <th>Subject Name</th>
                    <th>Date Created</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedSubjects.length === 0 ? (
                    <tr><td colSpan={5} className="text-center text-muted">No subjects added yet.</td></tr>
                  ) : paginatedSubjects.map((s, idx) => (
                    <tr key={s.id}>
                      <td>{(currentPage-1)*itemsPerPage + idx + 1}</td>
                      <td>{s.code}</td>
                      <td>{s.name}</td>
                      <td>{s.date}</td>
                      <td>
                        <Button size="sm" color="outline-primary" className="mr-2" onClick={() => openEdit(s)}><FaEdit /></Button>
                        <Button size="sm" color="outline-danger" onClick={() => openDelete(s)}><FaTrash /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination className="justify-content-center mt-3">
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i} active={i+1 === currentPage}>
                    <PaginationLink onClick={() => handlePageChange(i+1)}>{i+1}</PaginationLink>
                  </PaginationItem>
                ))}
              </Pagination>
            )}
          </CardBody>
        </Card>
        {/* Edit Modal */}
        <Modal isOpen={editModal} toggle={() => setEditModal(false)} centered>
          <ModalHeader toggle={() => setEditModal(false)} style={{ fontWeight: 700, fontSize: 20 }}>Edit Subject</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label>Subject Code</Label>
              <Input value={editSubject?.code || ""} disabled className="form-control" />
            </FormGroup>
            <FormGroup>
              <Label>Subject Name</Label>
              <Input value={editName} onChange={e => setEditName(e.target.value)} />
            </FormGroup>
            {editError && <Alert color="danger" className="py-2">{editError}</Alert>}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={handleEditSave}>Save</Button>
            <Button color="secondary" onClick={() => setEditModal(false)}>Cancel</Button>
          </ModalFooter>
        </Modal>
        {/* Delete Modal */}
        <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)} centered>
          <ModalHeader toggle={() => setDeleteModal(false)} style={{ fontWeight: 700, fontSize: 20 }}>Delete Subject</ModalHeader>
          <ModalBody>
            Are you sure you want to delete this subject?
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={handleDelete}>Delete</Button>
            <Button color="secondary" onClick={() => setDeleteModal(false)}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    </>
  );
} 