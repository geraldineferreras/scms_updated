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
  const [refreshKey, setRefreshKey] = useState(0);

  // Save classes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("teacherClasses", JSON.stringify(classes));
  }, [classes]);

  // Force re-render on window focus to update themes
  useEffect(() => {
    const handleFocus = () => {
      setRefreshKey(prev => prev + 1);
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

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
        <div className="p-4 rounded mb-4 text-dark position-relative" 
             style={{
               background: `#f5f7fa url("data:image/svg+xml,%3Csvg width='600' height='200' viewBox='0 0 600 200' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='120' y='30' width='300' height='70' rx='4' fill='%23343c43' stroke='%23444b5a' stroke-width='4'/%3E%3Crect x='180' y='110' width='60' height='20' rx='3' fill='%23586a75'/%3E%3Crect x='140' y='140' width='50' height='16' rx='3' fill='%23b0bec5'/%3E%3Crect x='250' y='140' width='50' height='16' rx='3' fill='%23b0bec5'/%3E%3Crect x='360' y='140' width='50' height='16' rx='3' fill='%23b0bec5'/%3E%3Crect x='150' y='150' width='30' height='8' rx='2' fill='%238ecae6'/%3E%3Crect x='260' y='150' width='30' height='8' rx='2' fill='%238ecae6'/%3E%3Crect x='370' y='150' width='30' height='8' rx='2' fill='%238ecae6'/%3E%3Crect x='200' y='120' width='10' height='20' rx='2' fill='%23b0bec5'/%3E%3Crect x='310' y='120' width='10' height='20' rx='2' fill='%23b0bec5'/%3E%3Crect x='420' y='120' width='10' height='20' rx='2' fill='%23b0bec5'/%3E%3Cellipse cx='175' cy='158' rx='10' ry='12' fill='%238ecae6'/%3E%3Crect x='170' y='155' width='10' height='10' rx='2' fill='%238ecae6'/%3E%3Crect x='380' y='145' width='15' height='5' rx='1' fill='%23444b5a'/%3E%3Crect x='390' y='145' width='10' height='5' rx='1' fill='%238ecae6'/%3E%3Crect x='390' y='135' width='10' height='5' rx='1' fill='%23b0bec5'/%3E%3Crect x='110' y='60' width='40' height='6' rx='2' fill='%23b0bec5'/%3E%3Crect x='450' y='60' width='40' height='6' rx='2' fill='%23b0bec5'/%3E%3Ccircle cx='100' cy='40' r='16' fill='%23fff' stroke='%23b0bec5' stroke-width='2'/%3E%3Cpath d='M100 40 L100 48' stroke='%23444b5a' stroke-width='2'/%3E%3Cpath d='M100 40 L108 40' stroke='%23444b5a' stroke-width='2'/%3E%3Crect x='80' y='80' width='30' height='6' rx='2' fill='%23b0bec5'/%3E%3Crect x='490' y='80' width='30' height='6' rx='2' fill='%23b0bec5'/%3E%3Crect x='500' y='100' width='40' height='30' rx='3' fill='%23ececec' stroke='%23b0bec5' stroke-width='2'/%3E%3Crect x='510' y='110' width='20' height='5' rx='1' fill='%238ecae6'/%3E%3Crect x='510' y='120' width='20' height='5' rx='1' fill='%23b0bec5'/%3E%3Cellipse cx='540' cy='170' rx='18' ry='10' fill='%238ecae6'/%3E%3Crect x='530' y='160' width='10' height='20' rx='3' fill='%23444b5a'/%3E%3Crect x='540' y='160' width='10' height='20' rx='3' fill='%234caf50'/%3E%3Crect x='550' y='160' width='10' height='20' rx='3' fill='%238ecae6'/%3E%3Cpath d='M140 50 L200 50' stroke='%23b0bec5' stroke-width='2'/%3E%3Cpath d='M200 50 L200 80' stroke='%23b0bec5' stroke-width='2'/%3E%3Crect x='320' y='110' width='60' height='20' rx='3' fill='%23586a75'/%3E%3Crect x='340' y='120' width='20' height='10' rx='2' fill='%23b0bec5'/%3E%3Crect x='350' y='130' width='10' height='5' rx='1' fill='%238ecae6'/%3E%3C!-- Left corner books --%3E%3Crect x='20' y='170' width='18' height='8' rx='2' fill='%23b0bec5'/%3E%3Crect x='40' y='172' width='14' height='6' rx='2' fill='%238ecae6'/%3E%3Crect x='58' y='168' width='10' height='10' rx='2' fill='%23f9dc5c'/%3E%3C!-- Left corner plant --%3E%3Cellipse cx='35' cy='192' rx='12' ry='5' fill='%238ecae6'/%3E%3Crect x='30' y='180' width='10' height='15' rx='2' fill='%234caf50'/%3E%3C/svg%3E") no-repeat right center / 540px auto`,
               borderRadius: "16px",
               boxShadow: "0 8px 32px rgba(173, 181, 189, 0.3)"
             }}>
          {/* Overlay for focus */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(255,255,255,0.5)',
            borderRadius: '16px',
            zIndex: 1
          }} />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="mb-2" style={{ fontWeight: 700, fontSize: "2.5rem", textShadow: "2px 2px 4px rgba(0,0,0,0.1)" }}>
                  My Classrooms
                </h1>
                <p className="mb-0" style={{ fontSize: "1.1rem", opacity: 0.9 }}>
                  Manage your classes, materials, students, and activities in one place.
                </p>
              </div>
              <Button 
                color="primary" 
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
        </div>

        {/* Class Cards Grid */}
        <Row className="g-4" key={refreshKey}>
          {classes.map((cls, idx) => {
            // Get theme from localStorage if available
            let themeKey = `classroom_theme_${cls.code}`;
            let theme = localStorage.getItem(themeKey) || cls.theme;
            if (theme && theme.startsWith('data:image')) {
              theme = `url('${theme}')`;
            }
            // Debug logging
            if (!localStorage.getItem(themeKey)) {
              console.log(`No theme found for key: ${themeKey}, cls.code: ${cls.code}`);
              Object.keys(localStorage).filter(k => k.startsWith('classroom_theme_')).forEach(k => {
                console.log('Theme key in localStorage:', k, 'value:', localStorage.getItem(k));
              });
            }
            return (
              <Col lg="4" md="6" sm="12" key={cls.id} className="mb-4">
                <Card 
                  className={`shadow-sm h-100 ${newlyCreatedClass?.id === cls.id ? 'border-primary border-3' : ''}`}
                  style={{ 
                    borderRadius: "16px", 
                    cursor: "pointer", 
                    transition: "all 0.3s ease",
                    transform: newlyCreatedClass?.id === cls.id ? "scale(1.02)" : "scale(1)",
                    border: newlyCreatedClass?.id === cls.id ? "3px solid #007bff" : "1px solid #e9ecef",
                    background: `linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)), ${theme}`,
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
                    background: theme,
                    borderRadius: "16px 16px 0 0",
                    position: "relative",
                    overflow: "hidden",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat"
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
                
                <CardBody className="p-4" style={{ background: '#fff', borderRadius: '12px' }}>
                  <h5 className="card-title font-weight-bold mb-2" style={{ color: "#2d3748" }}>
                    {cls.name}
                  </h5>
                  <p className="text-muted mb-2" style={{ fontSize: "0.9rem" }}>
                    {cls.section}
                  </p>
                  <div className="mb-3">
                    <Badge color="primary" style={{ marginRight: 8 }}>
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
          );
        })}
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
