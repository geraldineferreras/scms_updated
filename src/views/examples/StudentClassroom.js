import React from "react";
import { Card, CardBody, Button, Row, Col, Badge, Input } from "reactstrap";
import { useNavigate } from "react-router-dom";

// Mock data for enrolled classes
const enrolledClasses = [
  {
    id: 1,
    name: "Object Oriented Programming",
    section: "BSIT 3A",
    subject: "Object Oriented Programming",
    code: "B7P3R9",
    semester: "1ST SEMESTER",
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
    semester: "1ST SEMESTER",
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
    semester: "1ST SEMESTER",
    schoolYear: "2024-2025",
    studentCount: 28,
    theme: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
  },
  {
    id: 4,
    name: "SAD SUBJECT",
    section: "BSIT 3C",
    subject: "SAD SUBJECT",
    code: "M7AGZY",
    semester: "1ST SEMESTER",
    schoolYear: "2024-2025",
    studentCount: 0,
    theme: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)"
  },
  {
    id: 5,
    name: "SAD 312",
    section: "BSIT 3C",
    subject: "SAD 312",
    code: "5XHJE9",
    semester: "1ST SEMESTER",
    schoolYear: "2024-2025",
    studentCount: 0,
    theme: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)"
  }
];

const bookIcon = (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="12" fill="none" />
    <path d="M14 16C14 14.8954 14.8954 14 16 14H32C33.1046 14 34 14.8954 34 16V34C34 35.1046 33.1046 36 32 36H16C14.8954 36 14 35.1046 14 34V16Z" fill="#fff" fillOpacity="0.15"/>
    <rect x="18" y="20" width="12" height="2.5" rx="1.25" fill="#fff" fillOpacity="0.7"/>
    <rect x="18" y="25" width="12" height="2.5" rx="1.25" fill="#fff" fillOpacity="0.7"/>
  </svg>
);

const colorThemes = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)"
];

const StudentClassroom = () => {
  const navigate = useNavigate();
  return (
    <div style={{ background: "#f7fafd", minHeight: "100vh" }}>
      <div className="container py-4">
        <Row>
          {enrolledClasses.map((cls, idx) => (
            <Col key={cls.id} xl={4} md={6} sm={12} className="mb-4">
              <Card
                style={{ borderRadius: 20, boxShadow: '0 2px 16px 0 rgba(44,62,80,.08)', border: 'none', overflow: 'hidden', cursor: 'pointer' }}
                onClick={() => navigate(`/student/classroom/${cls.code}`)}
              >
                <div style={{ background: cls.theme || colorThemes[idx % colorThemes.length], height: 90, borderTopLeftRadius: 20, borderTopRightRadius: 20, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Badge color="light" style={{ position: 'absolute', top: 14, left: 18, fontWeight: 600, fontSize: 13, color: '#555', borderRadius: 8, padding: '4px 12px' }}>{cls.studentCount} STUDENTS</Badge>
                  <div style={{ opacity: 0.7 }}>{bookIcon}</div>
                </div>
                <CardBody style={{ background: '#fff', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
                  <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 2 }}>{cls.subject}</div>
                  <div style={{ color: '#888', fontSize: 15, marginBottom: 8 }}>{cls.section}</div>
                  <div className="mb-2">
                    <Badge color="primary" style={{ marginRight: 6, fontWeight: 500, fontSize: 13, background: '#e6e8ff', color: '#5e72e4' }}>{cls.semester}</Badge>
                    <Badge color="info" style={{ fontWeight: 500, fontSize: 13, background: '#e0f7fa', color: '#2096ff' }}>{cls.schoolYear}</Badge>
                  </div>
                  <div style={{ color: '#666', fontSize: 15, marginBottom: 10 }}>Class Code: <span style={{ fontWeight: 700, letterSpacing: 1 }}>{cls.code}</span></div>
                  <Button color="primary" style={{ borderRadius: 8, fontWeight: 600, fontSize: 15, minWidth: 110 }} onClick={e => { e.stopPropagation(); navigate(`/student/classroom/${cls.code}`); }}>View Class</Button>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default StudentClassroom; 