import React, { useState } from "react";
import {
  Card, CardBody, CardHeader, Table, Input, Row, Col, Button, Badge, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, InputGroup, InputGroupAddon, InputGroupText, Alert, Pagination, PaginationItem, PaginationLink
} from "reactstrap";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import Header from "components/Headers/Header.js";

// Floating effect for content over header
const offeringsManagementStyles = `
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

// Mock data
const mockSubjects = [
  { id: 1, code: "CS101", name: "Object-Oriented Programming" },
  { id: 2, code: "DBMS201", name: "Database Management Systems" },
  { id: 3, code: "MATH301", name: "Discrete Mathematics" },
];
const mockTeachers = [
  { id: 1, name: "Juan Dela Cruz" },
  { id: 2, name: "Maria Santos" },
  { id: 3, name: "Emily Johnson" },
];
const mockSections = [
  { id: 1, name: "BSIT 3A" },
  { id: 2, name: "BSCS 2B" },
  { id: 3, name: "BSIT 1C" },
];
const getToday = () => new Date().toISOString().slice(0, 10);
const initialOfferings = [
  { id: 1, subjectId: 1, teacherId: 1, sectionId: 1, semester: "1st", schoolYear: "2024-2025", date: getToday() },
  { id: 2, subjectId: 2, teacherId: 2, sectionId: 2, semester: "2nd", schoolYear: "2024-2025", date: getToday() },
];

export default function OfferingsManagement() {
  const [offerings, setOfferings] = useState(initialOfferings);
  const [subject, setSubject] = useState("");
  const [teacher, setTeacher] = useState("");
  const [section, setSection] = useState("");
  const [semester, setSemester] = useState("");
  const [schoolYear, setSchoolYear] = useState("");
  const [formError, setFormError] = useState("");
  const [showToast, setShowToast] = useState("");
  const [search, setSearch] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [editOffering, setEditOffering] = useState(null);
  const [editFields, setEditFields] = useState({ subject: "", teacher: "", section: "", semester: "", schoolYear: "" });
  const [editError, setEditError] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteOffering, setDeleteOffering] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtered and paginated offerings
  const filteredOfferings = offerings.filter(o => {
    const subj = mockSubjects.find(s => s.id === o.subjectId)?.name || "";
    const teach = mockTeachers.find(t => t.id === o.teacherId)?.name || "";
    const sect = mockSections.find(s => s.id === o.sectionId)?.name || "";
    return (
      subj.toLowerCase().includes(search.toLowerCase()) ||
      teach.toLowerCase().includes(search.toLowerCase()) ||
      sect.toLowerCase().includes(search.toLowerCase())
    );
  });
  const totalPages = Math.ceil(filteredOfferings.length / itemsPerPage);
  const paginatedOfferings = filteredOfferings.slice((currentPage-1)*itemsPerPage, currentPage*itemsPerPage);

  // Add offering
  const handleAdd = () => {
    setFormError("");
    if (!subject || !teacher || !section || !semester || !schoolYear) {
      setFormError("All fields are required.");
      return;
    }
    // Prevent duplicate assignment
    if (offerings.some(o => o.subjectId === Number(subject) && o.sectionId === Number(section) && o.semester === semester && o.schoolYear === schoolYear)) {
      setFormError("This subject is already assigned to this section for the selected term.");
      return;
    }
    setOfferings([
      ...offerings,
      {
        id: offerings.length ? Math.max(...offerings.map(o => o.id)) + 1 : 1,
        subjectId: Number(subject),
        teacherId: Number(teacher),
        sectionId: Number(section),
        semester,
        schoolYear,
        date: getToday()
      }
    ]);
    setSubject(""); setTeacher(""); setSection(""); setSemester(""); setSchoolYear("");
    setShowToast("Subject offering successfully created.");
    setTimeout(() => setShowToast(""), 2000);
  };

  // Edit offering
  const openEdit = (offering) => {
    setEditOffering(offering);
    setEditFields({
      subject: offering.subjectId.toString(),
      teacher: offering.teacherId.toString(),
      section: offering.sectionId.toString(),
      semester: offering.semester,
      schoolYear: offering.schoolYear
    });
    setEditError("");
    setEditModal(true);
  };
  const handleEditSave = () => {
    if (!editFields.subject || !editFields.teacher || !editFields.section || !editFields.semester || !editFields.schoolYear) {
      setEditError("All fields are required.");
      return;
    }
    // Prevent duplicate assignment (except for the current one)
    if (offerings.some(o => o.id !== editOffering.id && o.subjectId === Number(editFields.subject) && o.sectionId === Number(editFields.section) && o.semester === editFields.semester && o.schoolYear === editFields.schoolYear)) {
      setEditError("This subject is already assigned to this section for the selected term.");
      return;
    }
    setOfferings(offerings.map(o => o.id === editOffering.id ? {
      ...o,
      subjectId: Number(editFields.subject),
      teacherId: Number(editFields.teacher),
      sectionId: Number(editFields.section),
      semester: editFields.semester,
      schoolYear: editFields.schoolYear
    } : o));
    setEditModal(false);
    setShowToast("Offering updated successfully.");
    setTimeout(() => setShowToast(""), 2000);
  };

  // Delete offering
  const openDelete = (offering) => {
    setDeleteOffering(offering);
    setDeleteModal(true);
  };
  const handleDelete = () => {
    setOfferings(offerings.filter(o => o.id !== deleteOffering.id));
    setDeleteModal(false);
    setShowToast("Offering deleted.");
    setTimeout(() => setShowToast(""), 2000);
  };

  // Pagination
  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <>
      <style>{offeringsManagementStyles}</style>
      <Header showStats={false} />
      {/* Header Background */}
      <div className="header pb-6 pt-4 pt-md-7"></div>
      <div className="section-content-container">
        <Card className="shadow-sm rounded mb-4 section-content-card">
          <CardBody>
            {/* Assignment Form */}
            <Row className="align-items-end mb-4">
              <Col md={3} xs={12} className="mb-2 mb-md-0">
                <Label>Subject</Label>
                <Input type="select" value={subject} onChange={e => setSubject(e.target.value)}>
                  <option value="">Select Subject</option>
                  {mockSubjects.map(s => (
                    <option key={s.id} value={s.id}>{s.code} – {s.name}</option>
                  ))}
                </Input>
              </Col>
              <Col md={3} xs={12} className="mb-2 mb-md-0">
                <Label>Teacher</Label>
                <Input type="select" value={teacher} onChange={e => setTeacher(e.target.value)}>
                  <option value="">Select Teacher</option>
                  {mockTeachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </Input>
              </Col>
              <Col md={2} xs={12} className="mb-2 mb-md-0">
                <Label>Section</Label>
                <Input type="select" value={section} onChange={e => setSection(e.target.value)}>
                  <option value="">Select Section</option>
                  {mockSections.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </Input>
              </Col>
              <Col md={2} xs={6} className="mb-2 mb-md-0">
                <Label>Semester</Label>
                <Input type="select" value={semester} onChange={e => setSemester(e.target.value)}>
                  <option value="">Select Semester</option>
                  <option value="1st">1st</option>
                  <option value="2nd">2nd</option>
                </Input>
              </Col>
              <Col md={2} xs={6} className="mb-2 mb-md-0">
                <Label>School Year</Label>
                <Input
                  placeholder="2024-2025"
                  value={schoolYear}
                  onChange={e => setSchoolYear(e.target.value)}
                  maxLength={9}
                />
              </Col>
              <Col md={12} className="text-md-right mt-3 mt-md-0">
                <Button color="primary" onClick={handleAdd} style={{ borderRadius: 8, fontWeight: 600, minWidth: 180 }}>
                  Assign Offering
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
                    placeholder="Search by subject, teacher, or section"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={6} xs={12} className="text-md-right mt-2 mt-md-0">
                <span className="text-muted" style={{ fontSize: 15 }}>
                  Total Offerings: <b>{filteredOfferings.length}</b>
                </span>
              </Col>
            </Row>
            {/* Offerings Table */}
            <div className="table-responsive">
              <Table className="align-items-center table-striped table-hover" bordered>
                <thead className="thead-light">
                  <tr>
                    <th>#</th>
                    <th>Subject</th>
                    <th>Teacher</th>
                    <th>Section</th>
                    <th>Semester</th>
                    <th>School Year</th>
                    <th>Date Created</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOfferings.length === 0 ? (
                    <tr><td colSpan={8} className="text-center text-muted">No offerings yet.</td></tr>
                  ) : paginatedOfferings.map((o, idx) => (
                    <tr key={o.id}>
                      <td>{(currentPage-1)*itemsPerPage + idx + 1}</td>
                      <td>{mockSubjects.find(s => s.id === o.subjectId)?.name || ""}</td>
                      <td>{mockTeachers.find(t => t.id === o.teacherId)?.name || ""}</td>
                      <td>{mockSections.find(s => s.id === o.sectionId)?.name || ""}</td>
                      <td><Badge color="primary" pill>{o.semester}</Badge></td>
                      <td><Badge color="info" pill>{o.schoolYear}</Badge></td>
                      <td>{o.date}</td>
                      <td>
                        <Button size="sm" color="outline-primary" className="mr-2" onClick={() => openEdit(o)}><FaEdit /></Button>
                        <Button size="sm" color="outline-danger" onClick={() => openDelete(o)}><FaTrash /></Button>
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
          <ModalHeader toggle={() => setEditModal(false)} style={{ fontWeight: 700, fontSize: 20 }}>Edit Offering</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label>Subject</Label>
              <Input type="select" value={editFields.subject} onChange={e => setEditFields(f => ({ ...f, subject: e.target.value }))}>
                <option value="">Select Subject</option>
                {mockSubjects.map(s => (
                  <option key={s.id} value={s.id}>{s.code} – {s.name}</option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label>Teacher</Label>
              <Input type="select" value={editFields.teacher} onChange={e => setEditFields(f => ({ ...f, teacher: e.target.value }))}>
                <option value="">Select Teacher</option>
                {mockTeachers.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label>Section</Label>
              <Input type="select" value={editFields.section} onChange={e => setEditFields(f => ({ ...f, section: e.target.value }))}>
                <option value="">Select Section</option>
                {mockSections.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label>Semester</Label>
              <Input type="select" value={editFields.semester} onChange={e => setEditFields(f => ({ ...f, semester: e.target.value }))}>
                <option value="">Select Semester</option>
                <option value="1st">1st</option>
                <option value="2nd">2nd</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label>School Year</Label>
              <Input value={editFields.schoolYear} onChange={e => setEditFields(f => ({ ...f, schoolYear: e.target.value }))} placeholder="2024-2025" maxLength={9} />
            </FormGroup>
            {editError && <Alert color="danger" className="py-2">{editError}</Alert>}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={handleEditSave}>Save Changes</Button>
            <Button color="secondary" onClick={() => setEditModal(false)}>Cancel</Button>
          </ModalFooter>
        </Modal>
        {/* Delete Modal */}
        <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)} centered>
          <ModalHeader toggle={() => setDeleteModal(false)} style={{ fontWeight: 700, fontSize: 20 }}>Delete Offering</ModalHeader>
          <ModalBody>
            Are you sure you want to delete this subject offering?
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