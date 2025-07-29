import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Alert,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Badge,
  Spinner,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import Header from "components/Headers/Header.js";
import ApiService from "../../services/api.js";
import userDefault from "../../assets/img/theme/user-default.svg";
import { FaUser, FaTimes } from "react-icons/fa";

// Course options for dropdown
const courseOptions = [
  { value: "bsit", label: "BSIT" },
  { value: "bscs", label: "BSCS" },
  { value: "bsis", label: "BSIS" },
  { value: "act", label: "ACT" },
];

// Helper function to generate consistent avatars for students
const getStudentAvatar = (student) => {
  if (student && student.profile_pic) {
    return student.profile_pic;
  }
  if (student && student.profile_picture) {
    return student.profile_picture;
  }
  if (student && student.id) {
    const avatarUrls = [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    ];
    const index = student.id % avatarUrls.length;
    return avatarUrls[index];
  }
  return userDefault;
};

const EditSection = () => {
  const [course, setCourse] = useState("");
  const [sectionName, setSectionName] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [semester, setSemester] = useState("");
  const [adviser, setAdviser] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [studentModal, setStudentModal] = useState(false);
  const [studentSearch, setStudentSearch] = useState("");
  const [isStudentSearchFocused, setIsStudentSearchFocused] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [isLoadingTeachers, setIsLoadingTeachers] = useState(true);
  const [students, setStudents] = useState([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const adviserInputRef = useRef();

  // Helper function to get ordinal suffix
  const getOrdinalSuffix = (num) => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) {
      return num + "st";
    }
    if (j === 2 && k !== 12) {
      return num + "nd";
    }
    if (j === 3 && k !== 13) {
      return num + "rd";
    }
    return num + "th";
  };

  // Helper function to format year level with ordinal suffix
  const formatYearLevel = (year) => {
    if (!year) return "";
    const yearNum = year.replace(/[^0-9]/g, '');
    if (yearNum) {
      return getOrdinalSuffix(parseInt(yearNum));
    }
    return year;
  };

  // Auto-generate section name when course, year level, or section name changes
  useEffect(() => {
    if (course && yearLevel && sectionName) {
      const courseLabel = courseOptions.find(opt => opt.value === course)?.label || course.toUpperCase();
      const yearNum = yearLevel.replace(/[^0-9]/g, '');
      const sectionLetter = sectionName.trim().toUpperCase();
      const generatedName = `${courseLabel} ${yearNum}${sectionLetter}`;
      setSectionName(generatedName);
    }
  }, [course, yearLevel]);

  // Handle section name input - extract just the letter and regenerate full name
  const handleSectionNameChange = (e) => {
    const input = e.target.value;
    
    // If user is typing and we have course and year level, generate full name
    if (course && yearLevel && input.trim()) {
      const courseLabel = courseOptions.find(opt => opt.value === course)?.label || course.toUpperCase();
      const yearNum = yearLevel.replace(/[^0-9]/g, '');
      const sectionLetter = input.trim().toUpperCase();
      const generatedName = `${courseLabel} ${yearNum}${sectionLetter}`;
      setSectionName(generatedName);
    } else {
      // If we don't have course or year level, just set the input as is
      setSectionName(input);
    }
  };

  // Fetch teachers for advisers
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setIsLoadingTeachers(true);
        const response = await ApiService.getTeachers();
        
        // Handle different response structures
        const teachersData = response.data || response.data?.data || response || [];
        
        // Normalize teacher data
        const normalizedTeachers = teachersData.map(teacher => {
          return {
            ...teacher,
            id: teacher.id || teacher.user_id || teacher.userId || '',
            full_name: teacher.full_name || teacher.name || '',
            email: teacher.email || '',
            profile_pic: teacher.profile_pic || teacher.profileImageUrl || teacher.avatar || '',
          };
        });
        
        setTeachers(normalizedTeachers);
      } catch (error) {
        console.error('Failed to fetch teachers:', error);
      } finally {
        setIsLoadingTeachers(false);
      }
    };

    fetchTeachers();
  }, []);

  // Fetch students for selection
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoadingStudents(true);
        const response = await ApiService.getStudents();
        
        // Handle different response structures
        const studentsData = response.data || response.data?.data || response || [];
        
        // Normalize student data
        const normalizedStudents = studentsData.map(student => {
          return {
            ...student,
            id: student.id || student.user_id || student.userId || '',
            full_name: student.full_name || student.name || '',
            email: student.email || '',
            profile_pic: student.profile_pic || student.profileImageUrl || student.avatar || '',
            student_id: student.student_id || student.student_number || student.id || '',
          };
        });
        
        setStudents(normalizedStudents);
      } catch (error) {
        console.error('Failed to fetch students:', error);
      } finally {
        setIsLoadingStudents(false);
      }
    };

    fetchStudents();
  }, []);

  const handleStudentCheck = (id) => {
    setSelectedStudents(prev => 
      prev.includes(id) 
        ? prev.filter(sid => sid !== id)
        : [...prev, id]
    );
  };

  const removeStudent = (id) => setSelectedStudents(selectedStudents.filter(sid => sid !== id));

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setError(null);

      // For now, just show success message
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/admin/section-management');
      }, 2000);
      
    } catch (error) {
      console.error('Error updating section:', error);
      setError('Failed to update section. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const AdviserOption = (props) => (
    <div className="d-flex align-items-center">
      <img
        src={getStudentAvatar(props.data)}
        alt="Profile"
        className="rounded-circle mr-2"
        style={{ width: '24px', height: '24px' }}
      />
      <div>
        <div className="font-weight-bold">{props.data.full_name}</div>
        <small className="text-muted">{props.data.email}</small>
      </div>
    </div>
  );

  const AdviserSingleValue = (props) => (
    <div className="d-flex align-items-center">
      <img
        src={getStudentAvatar(props.data)}
        alt="Profile"
        className="rounded-circle mr-2"
        style={{ width: '24px', height: '24px' }}
      />
      <div>
        <div className="font-weight-bold">{props.data.full_name}</div>
        <small className="text-muted">{props.data.email}</small>
      </div>
    </div>
  );

  const CustomDropdownIndicator = (props) => (
    <div {...props.innerProps}>
      <i className="fas fa-chevron-down" />
    </div>
  );

  // Helper to get student avatar URL
  const getStudentAvatar = (student) => {
    if (student.profile_pic) {
      if (student.profile_pic.startsWith('uploads/')) {
        return `http://localhost/scms_new/${student.profile_pic}`;
      }
      return student.profile_pic;
    }
    return student.avatar || require('../../assets/img/theme/team-1-800x800.jpg');
  };

  return (
    <>
      <style>{`
        .section-content-container {
          margin-top: -150px;
          z-index: 2;
          position: relative;
        }
        .section-content-card {
          border-radius: 16px;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.10);
        }
        .transparent-header-section {
          background: transparent;
          border-radius: 16px;
          padding: 6rem 2rem 5rem 2rem;
          margin-bottom: 2rem;
          box-shadow: none;
        }
        .transparent-header-section h1 {
          color: #32325d;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .transparent-header-section p {
          color: #6c757d;
          margin-bottom: 0;
        }
        .section-preview {
          background: #f8f9fa;
          border: 1px solid #e3eaf3;
          border-radius: 8px;
          padding: 1rem;
          margin-top: 1rem;
          text-align: center;
        }
        .section-preview h6 {
          color: #525f7f;
          margin-bottom: 0.5rem;
        }
        .section-preview .section-name {
          font-size: 1.5rem;
          font-weight: 700;
          color: #5e72e4;
        }
        @media (max-width: 768px) {
          .transparent-header-section {
            padding: 1.25rem 1rem 1rem 1rem;
            text-align: center;
          }
          .transparent-header-section h1 {
            font-size: 1.5rem;
          }
        }
      `}</style>
      <Header showStats={false} />
      {/* Transparent Page Header */}
      <div className="transparent-header-section">
       
      </div>
      <Container className="section-content-container" fluid>
        <Row>
          <Col className="order-xl-1 mx-auto" xl="8" lg="8" md="10">
            <Card className="bg-secondary shadow border-0 section-content-card">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">Edit Section</h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                {error && (
                  <Alert color="danger" className="mb-4">
                    {error}
                  </Alert>
                )}
                
                {showSuccess && (
                  <Alert color="success" className="mb-4">
                    Section updated successfully! Redirecting...
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <h6 className="heading-small text-muted mb-4">Section Information</h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="course">Course</label>
                          <Input
                            type="select"
                            className="form-control-alternative"
                            id="course"
                            value={course}
                            onChange={e => setCourse(e.target.value)}
                            required
                          >
                            <option value="">Select Course</option>
                            {courseOptions.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="yearLevel">Year Level</label>
                          <Input
                            type="select"
                            className="form-control-alternative"
                            id="yearLevel"
                            value={yearLevel}
                            onChange={e => setYearLevel(e.target.value)}
                            required
                          >
                            <option value="">Select Year Level</option>
                            <option value="1st Year">1st Year</option>
                            <option value="2nd Year">2nd Year</option>
                            <option value="3rd Year">3rd Year</option>
                            <option value="4th Year">4th Year</option>
                          </Input>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="sectionName">Section Letter</label>
                          <Input
                            className="form-control-alternative"
                            type="text"
                            id="sectionName"
                            value={sectionName}
                            onChange={handleSectionNameChange}
                            placeholder="e.g. A, B, C, G"
                            maxLength="1"
                            required
                          />
                          <small className="form-text text-muted">
                            Just enter the section letter (A, B, C, G, etc.)
                          </small>
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="academicYear">Academic Year</label>
                          <Input
                            className="form-control-alternative"
                            type="text"
                            id="academicYear"
                            value={academicYear}
                            onChange={e => setAcademicYear(e.target.value)}
                            placeholder="e.g. 2024-2025"
                            required
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    
                    {/* Section Name Preview */}
                    {sectionName && course && yearLevel && (
                      <div className="section-preview">
                        <h6>Generated Section Name:</h6>
                        <div className="section-name">{sectionName}</div>
                      </div>
                    )}
                    
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="semester">Semester</label>
                          <Input
                            type="select"
                            className="form-control-alternative"
                            id="semester"
                            value={semester}
                            onChange={e => setSemester(e.target.value)}
                            required
                          >
                            <option value="">Select Semester</option>
                            <option value="1st Semester">1st Semester</option>
                            <option value="2nd Semester">2nd Semester</option>
                            <option value="Summer">Summer</option>
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="adviser">Adviser</label>
                          <Input
                            type="select"
                            className="form-control-alternative"
                            id="adviser"
                            value={adviser}
                            onChange={e => setAdviser(e.target.value)}
                            required
                          >
                            <option value="">Select Adviser...</option>
                            {teachers.map(teacher => (
                              <option key={teacher.id} value={teacher.id}>
                                {teacher.full_name} - {teacher.email}
                              </option>
                            ))}
                          </Input>
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>

                  <div className="pl-lg-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h6 className="heading-small text-muted mb-0">STUDENTS ({selectedStudents.length})</h6>
                      <Button
                        color="primary"
                        type="button"
                        onClick={() => setStudentModal(true)}
                        size="sm"
                      >
                        Add Students
                      </Button>
                    </div>
                    <div className="pl-lg-4">
                      {/* Show selected students as pills */}
                      <Row className="mb-3">
                        <Col>
                          <div style={{ minHeight: 70, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: selectedStudents.length === 0 ? 'center' : 'flex-start', justifyContent: 'center', background: '#f7f8fa', borderRadius: 8, padding: 8, border: '1px solid #e9ecef' }}>
                            {selectedStudents.length === 0 ? (
                              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#b0b7c3', fontSize: 11, minHeight: 30 }}>
                                <FaUser size={14} style={{ marginBottom: 2 }} />
                                <div style={{ fontSize: 11, fontWeight: 500 }}>No students selected</div>
                              </div>
                            ) : (
                              selectedStudents.map(id => {
                                const s = students.find(stu => stu.id === id);
                                return s ? (
                                  <span key={id} className="student-pill" style={{ display: 'flex', alignItems: 'center', background: '#e0e3ea', borderRadius: 10, padding: '0 4px 0 1px', fontSize: 9, fontWeight: 500 }}>
                                    <img src={getStudentAvatar(s)} alt={s.full_name} style={{ width: 13, height: 13, borderRadius: '50%', marginRight: 3, objectFit: 'cover', border: '1px solid #fff' }} />
                                    <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.1 }}>
                                      <span style={{ fontWeight: 700, fontSize: 9 }}>{s.full_name}</span>
                                      <span style={{ color: '#888', fontWeight: 400, fontSize: 8 }}>{s.email}</span>
                                    </span>
                                    <FaTimes className="student-pill-x" style={{ marginLeft: 8, cursor: 'pointer', color: '#5e72e4', fontSize: 10 }} onClick={() => removeStudent(id)} />
                                  </span>
                                ) : null;
                              })
                            )}
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>

                  {/* Student Selection Modal */}
                  <Modal isOpen={studentModal} toggle={() => setStudentModal(!studentModal)} size="md">
                    <ModalHeader toggle={() => setStudentModal(!studentModal)}>
                      Add Students to Section
                    </ModalHeader>
                    <ModalBody>
                      <div className="mb-3">
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text">
                              <i className="ni ni-zoom-split-in" />
                            </span>
                          </div>
                          <Input
                            placeholder="Search students..."
                            value={studentSearch}
                            onChange={(e) => setStudentSearch(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 className="mb-0">Students ({students.filter(student => 
                            student.full_name.toLowerCase().includes(studentSearch.toLowerCase()) ||
                            student.email.toLowerCase().includes(studentSearch.toLowerCase())
                          ).length})</h6>
                          <Button
                            color="link"
                            size="sm"
                            onClick={() => setSelectedStudents([])}
                          >
                            Unselect All
                          </Button>
                        </div>
                      </div>

                      <div className="student-list mb-4" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {students
                          .filter(student => 
                            student.full_name.toLowerCase().includes(studentSearch.toLowerCase()) ||
                            student.email.toLowerCase().includes(studentSearch.toLowerCase())
                          )
                          .map(student => (
                            <div
                              key={student.id}
                              className="d-flex align-items-center p-2 border-bottom"
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleStudentCheck(student.id)}
                            >
                              <img
                                src={getStudentAvatar(student)}
                                alt="Profile"
                                className="rounded-circle mr-3"
                                style={{ width: '35px', height: '35px', objectFit: 'cover' }}
                              />
                              <div className="flex-grow-1">
                                <div className="font-weight-bold">{student.full_name}</div>
                                <small className="text-muted">{student.email}</small>
                              </div>
                              {selectedStudents.includes(student.id) && (
                                <i className="ni ni-check-bold text-primary" style={{ fontSize: '1.2rem' }} />
                              )}
                            </div>
                          ))}
                      </div>

                      {/* Selected Students Display */}
                      <div className="border-top pt-3">
                        <h6 className="mb-3">Selected Students</h6>
                        <div style={{ minHeight: 60, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: selectedStudents.length === 0 ? 'center' : 'flex-start', justifyContent: 'center', background: '#f7f8fa', borderRadius: 8, padding: 8, border: '1px solid #e9ecef' }}>
                          {selectedStudents.length === 0 ? (
                            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#b0b7c3', fontSize: 11, minHeight: 30 }}>
                              <FaUser size={14} style={{ marginBottom: 2 }} />
                              <div style={{ fontSize: 11, fontWeight: 500 }}>No students selected</div>
                            </div>
                          ) : (
                            selectedStudents.map(id => {
                              const s = students.find(stu => stu.id === id);
                              return s ? (
                                <span key={id} className="student-pill" style={{ display: 'flex', alignItems: 'center', background: '#e0e3ea', borderRadius: 10, padding: '0 4px 0 1px', fontSize: 9, fontWeight: 500 }}>
                                  <img src={getStudentAvatar(s)} alt={s.full_name} style={{ width: 13, height: 13, borderRadius: '50%', marginRight: 3, objectFit: 'cover', border: '1px solid #fff' }} />
                                  <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.1 }}>
                                    <span style={{ fontWeight: 700, fontSize: 9 }}>{s.full_name}</span>
                                    <span style={{ color: '#888', fontWeight: 400, fontSize: 8 }}>{s.email}</span>
                                  </span>
                                  <FaTimes className="student-pill-x" style={{ marginLeft: 8, cursor: 'pointer', color: '#5e72e4', fontSize: 10 }} onClick={() => removeStudent(id)} />
                                </span>
                              ) : null;
                            })
                          )}
                        </div>
                      </div>
                    </ModalBody>
                    <ModalFooter>
                      <Button color="secondary" onClick={() => setStudentModal(!studentModal)}>
                        Done
                      </Button>
                    </ModalFooter>
                  </Modal>

                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                    <Button color="primary" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Updating..." : "Update Section"}
                    </Button>
                  </div>
                  {showSuccess && (
                    <div className="alert alert-success mt-3 mb-0 text-center">
                      Section updated successfully!
                    </div>
                  )}
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default EditSection;