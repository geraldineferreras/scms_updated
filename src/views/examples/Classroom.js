import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Button,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Badge,
  Toast,
  ToastHeader,
  ToastBody
} from "reactstrap";
import "./Classroom.css";
import { useNavigate } from "react-router-dom";

function generateCode() {
  // Generate a more readable 6-character code
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Enhanced initial classes with more realistic data
const initialClasses = [
  {
    id: 1,
    name: "Object Oriented Programming",
    section: "BSIT 3A",
    subject: "Object Oriented Programming",
    code: "B7P3R9",
    semester: "1st Semester",
    schoolYear: "2024-2025",
    studentCount: 35,
    theme: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  },
  {
    id: 2,
    name: "Data Structures and Algorithms",
    section: "BSIT 2B", 
    subject: "Data Structures and Algorithms",
    code: "A1C2D3",
    semester: "1st Semester",
    schoolYear: "2024-2025",
    studentCount: 42,
    theme: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
  },
  {
    id: 3,
    name: "Database Management Systems",
    section: "BSIT 3C",
    subject: "Database Management Systems", 
    code: "X9Y8Z7",
    semester: "1st Semester",
    schoolYear: "2024-2025",
    studentCount: 28,
    theme: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
  }
];

const Classroom = () => {
  const [classes, setClasses] = useState(() => {
    // Load from localStorage or use initial data
    const saved = localStorage.getItem("teacherClasses");
    return saved ? JSON.parse(saved) : initialClasses;
  });
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ 
    name: "", 
    section: "", 
    subject: "", 
    semester: "",
    schoolYear: ""
  });
  const [showToast, setShowToast] = useState(false);
  const [newlyCreatedClass, setNewlyCreatedClass] = useState(null);
  const navigate = useNavigate();

  // Save classes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("teacherClasses", JSON.stringify(classes));
  }, [classes]);

  const toggleModal = () => setModal(!modal);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddClass = e => {
    e.preventDefault();
    if (form.subject && form.section && form.semester && form.schoolYear) {
      const newClass = {
        id: Date.now(),
        name: form.name || form.subject, // Use custom name if provided, otherwise use subject
        section: form.section,
        subject: form.subject,
        semester: form.semester,
        schoolYear: form.schoolYear,
        code: generateCode(),
        studentCount: 0,
        theme: getRandomTheme()
      };
      
      setClasses([...classes, newClass]);
      setNewlyCreatedClass(newClass);
      setForm({ name: "", section: "", subject: "", semester: "", schoolYear: "" });
      setModal(false);
      setShowToast(true);
      
      // Hide highlight after 3 seconds
      setTimeout(() => {
        setNewlyCreatedClass(null);
      }, 3000);
    }
  };

  const handleCardClick = (code) => {
    navigate(`/teacher/classroom/${code}`);
  };

  const getRandomTheme = () => {
    const themes = [
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", 
      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
      "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"
    ];
    return themes[Math.floor(Math.random() * themes.length)];
  };

  return (
    <div>
      {/* <Header compact /> */}
      
      {/* Main Container */}
      <div className="container mt-4">
        
        {/* Header Section with Blue Gradient */}
        <div className="bg-gradient-primary text-white p-4 rounded mb-4" 
             style={{
               background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
               borderRadius: "16px",
               boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)"
             }}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="mb-2" style={{ fontWeight: 700, fontSize: "2.5rem" }}>
                My Classrooms
              </h1>
              <p className="mb-0" style={{ fontSize: "1.1rem", opacity: 0.9 }}>
                Manage your classes, materials, students, and activities in one place.
              </p>
            </div>
            <Button 
              color="light" 
              size="lg" 
              onClick={toggleModal}
              style={{ 
                borderRadius: "12px", 
                fontWeight: 600, 
                fontSize: "1rem",
                padding: "12px 24px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.1)"
              }}
            >
              <i className="ni ni-fat-add mr-2"></i>
              Create Class
            </Button>
          </div>
        </div>

        {/* Class Cards Grid */}
        <Row className="g-4">
          {classes.map((cls, idx) => (
            <Col lg="4" md="6" sm="12" key={cls.id} className="mb-4">
              <Card 
                className={`shadow-sm h-100 ${newlyCreatedClass?.id === cls.id ? 'border-primary border-3' : ''}`}
                style={{ 
                  borderRadius: "16px", 
                  cursor: "pointer", 
                  transition: "all 0.3s ease",
                  transform: newlyCreatedClass?.id === cls.id ? "scale(1.02)" : "scale(1)",
                  border: newlyCreatedClass?.id === cls.id ? "3px solid #007bff" : "1px solid #e9ecef",
                  background: `linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)), ${cls.theme}`,
                }}
                onClick={() => handleCardClick(cls.code)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = newlyCreatedClass?.id === cls.id ? "scale(1.02)" : "scale(1)";
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)";
                }}
              >
                <div 
                  className="card-img-top" 
                  style={{
                    height: "120px",
                    background: cls.theme,
                    borderRadius: "16px 16px 0 0",
                    position: "relative",
                    overflow: "hidden"
                  }}
                >
                  <div className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center">
                    <i className="ni ni-books text-white" style={{ fontSize: "3rem", opacity: 0.8 }}></i>
                  </div>
                  <div className="position-absolute top-0 end-0 m-3">
                    <Badge color="light" className="text-dark">
                      {cls.studentCount} students
                    </Badge>
                  </div>
                </div>
                
                <CardBody className="p-4">
                  <h5 className="card-title font-weight-bold mb-2" style={{ color: "#2d3748" }}>
                    {cls.name}
                  </h5>
                  <p className="text-muted mb-2" style={{ fontSize: "0.9rem" }}>
                    {cls.section}
                  </p>
                  <div className="mb-3">
                    <Badge color="primary" className="me-2">
                      {cls.semester}
                    </Badge>
                    <Badge color="info">
                      {cls.schoolYear}
                    </Badge>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <small className="text-muted">
                      Class Code: <strong>{cls.code}</strong>
                    </small>
                    <Button 
                      color="primary" 
                      size="sm" 
                      style={{ borderRadius: "8px" }}
                    >
                      View Class
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Empty State */}
        {classes.length === 0 && (
          <div className="text-center py-5">
            <i className="ni ni-books text-muted" style={{ fontSize: "4rem" }}></i>
            <h4 className="mt-3 text-muted">No classes yet</h4>
            <p className="text-muted">Create your first class to get started</p>
            <Button color="primary" size="lg" onClick={toggleModal}>
              <i className="ni ni-fat-add mr-2"></i>
              Create Your First Class
            </Button>
          </div>
        )}
      </div>

      {/* Create Class Modal */}
      <Modal isOpen={modal} toggle={toggleModal} size="lg" style={{ marginLeft: 'auto', marginRight: 180, marginTop: 80, alignItems: 'flex-start' }}>
        <ModalHeader toggle={toggleModal} style={{ border: "none", paddingBottom: "0" }}>
          <h4 className="mb-0">Create New Class</h4>
        </ModalHeader>
        <Form onSubmit={handleAddClass}>
          <ModalBody>
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label for="subject" className="font-weight-bold">Subject *</Label>
                  <Input
                    type="select"
                    name="subject"
                    id="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    style={{ borderRadius: "8px" }}
                  >
                    <option value="">Select subject</option>
                    <option>Object Oriented Programming</option>
                    <option>Data Structures and Algorithms</option>
                    <option>Database Management Systems</option>
                    <option>Web Development</option>
                    <option>Software Engineering</option>
                  </Input>
                  <small className="text-muted">
                    Select the subject for this class
                  </small>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="section" className="font-weight-bold">Section *</Label>
                  <Input
                    type="select"
                    name="section"
                    id="section"
                    value={form.section}
                    onChange={handleChange}
                    required
                    style={{ borderRadius: "8px" }}
                  >
                    <option value="">Select section</option>
                    <option>BSIT 3A</option>
                    <option>BSIT 2B</option>
                    <option>BSIT 3C</option>
                    <option>BSCS 2B</option>
                    <option>BSCS 1A</option>
                  </Input>
                  <small className="text-muted">
                    Select the section (e.g., BSIT 3A, BSCS 2B)
                  </small>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label for="semester" className="font-weight-bold">Semester *</Label>
                  <Input
                    type="select"
                    name="semester"
                    id="semester"
                    value={form.semester}
                    onChange={handleChange}
                    required
                    style={{ borderRadius: "8px" }}
                  >
                    <option value="">Select semester</option>
                    <option>1st Semester</option>
                    <option>2nd Semester</option>
                    <option>Summer</option>
                  </Input>
                  <small className="text-muted">
                    Select the semester
                  </small>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="schoolYear" className="font-weight-bold">School Year *</Label>
                  <Input
                    type="select"
                    name="schoolYear"
                    id="schoolYear"
                    value={form.schoolYear}
                    onChange={handleChange}
                    required
                    style={{ borderRadius: "8px" }}
                  >
                    <option value="">Select school year</option>
                    <option>2023-2024</option>
                    <option>2024-2025</option>
                    <option>2025-2026</option>
                  </Input>
                  <small className="text-muted">
                    Select the school year
                  </small>
                </FormGroup>
              </Col>
            </Row>
            <FormGroup>
              <Label for="name" className="font-weight-bold">Custom Class Title (Optional)</Label>
              <Input
                name="name"
                id="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Leave blank to use subject name"
                style={{ borderRadius: "8px" }}
              />
              <small className="text-muted">
                If left blank, the subject name will be used as the class title
              </small>
            </FormGroup>
          </ModalBody>
          <ModalFooter style={{ border: "none", paddingTop: "0" }}>
            <Button color="secondary" onClick={toggleModal} style={{ borderRadius: "8px" }}>
              Cancel
            </Button>
            <Button 
              color="primary" 
              type="submit" 
              style={{ borderRadius: "8px" }}
              disabled={!form.subject || !form.section || !form.semester || !form.schoolYear}
            >
              Create Class
            </Button>
          </ModalFooter>
        </Form>
      </Modal>

      {/* Success Toast */}
      <div style={{ position: "fixed", top: "20px", right: "20px", zIndex: 9999 }}>
        <Toast isOpen={showToast} style={{ borderRadius: "12px" }}>
          <ToastHeader 
            icon="success" 
            toggle={() => setShowToast(false)}
            style={{ border: "none", background: "#d4edda", color: "#155724" }}
          >
            Success!
          </ToastHeader>
          <ToastBody style={{ background: "#d4edda", color: "#155724" }}>
            Classroom created successfully!
          </ToastBody>
        </Toast>
      </div>
    </div>
  );
};

export default Classroom;
