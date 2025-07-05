/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useState, useMemo, useEffect } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Nav,
  NavItem,
  NavLink,
  Table,
  Pagination,
  PaginationItem,
  PaginationLink,
  Modal,
  ModalBody,
  ModalHeader,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import classnames from "classnames";
import Header from "components/Headers/Header.js";
import { useNavigate } from "react-router-dom";
import userDefault from "../../assets/img/theme/user-default.svg";

// Floating effect for content over header
const sectionManagementStyles = `
  .section-content-container {
    margin-top: -150px; /* Moved even higher */
    z-index: 2;
    position: relative;
  }
  .section-content-card {
    border-radius: 16px;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.10);
  }
`;

// Mock Data - Replace with your actual data fetching logic
const getMockData = () => ({
  teachers: [
    { id: 101, name: "Mr. Cruz", email: "cruz@dhvsu.edu.ph", avatar: require("../../assets/img/theme/team-1-800x800.jpg") },
    { id: 102, name: "Ms. Reyes", email: "reyes@dhvsu.edu.ph", avatar: require("../../assets/img/theme/team-2-800x800.jpg") },
    { id: 103, name: "Mr. Garcia", email: "garcia@dhvsu.edu.ph", avatar: require("../../assets/img/theme/team-3-800x800.jpg") },
    { id: 104, name: "Mrs. David", email: "david@dhvsu.edu.ph", avatar: require("../../assets/img/theme/team-4-800x800.jpg") },
  ],
  sections: [
    { id: 1, course: "bsit", year: "3rd Year", name: "BSIT 3A", adviserId: 101, enrolled: 9, ay: '2024-2025', semester: '1st Semester' },
    { id: 2, course: "bsit", year: "3rd Year", name: "BSIT 3B", adviserId: 102, enrolled: 5, ay: '2024-2025', semester: '1st Semester' },
    { id: 3, course: "bsit", year: "4th Year", name: "BSIT 4A", adviserId: 103, enrolled: 3, ay: '2024-2025', semester: '2nd Semester' },
    { id: 4, course: "bscs", year: "1st Year", name: "BSCS 1A", adviserId: 104, enrolled: 12, ay: '2024-2025', semester: '1st Semester' },
    { id: 5, course: "bsis", year: "2nd Year", name: "BSIS 2A", adviserId: 101, enrolled: 25, ay: '2024-2025', semester: '1st Semester' },
    { id: 6, course: "act", year: "1st Year", name: "ACT 1A", adviserId: 102, enrolled: 30, ay: '2024-2025', semester: '1st Semester' },
  ],
  courses: [
    { id: "bsit", abbr: "BSIT", name: "Info Tech" },
    { id: "bscs", abbr: "BSCS", name: "Computer Science" },
    { id: "bsis", abbr: "BSIS", name: "Info Systems" },
    { id: "act", abbr: "ACT", name: "Computer Technology" },
  ],
  students: [
    { id: 1, sectionId: 1, name: "John Doe", email: "2021305901@dhvsu.edu.ph", status: "active" },
    { id: 2, sectionId: 1, name: "Jane Smith", email: "2021305902@dhvsu.edu.ph", status: "active" },
    { id: 3, sectionId: 1, name: "Mike Johnson", email: "2021305903@dhvsu.edu.ph", status: "active" },
    { id: 4, sectionId: 2, name: "Sarah Wilson", email: "2021305904@dhvsu.edu.ph", status: "active" },
    { id: 5, sectionId: 2, name: "David Brown", email: "2021305905@dhvsu.edu.ph", status: "active" },
    { id: 6, sectionId: 3, name: "Emily Davis", email: "2021305906@dhvsu.edu.ph", status: "active" },
    { id: 7, sectionId: 4, name: "Robert Miller", email: "2021305907@dhvsu.edu.ph", status: "active" },
    { id: 8, sectionId: 4, name: "Lisa Garcia", email: "2021305908@dhvsu.edu.ph", status: "active" },
    { id: 9, sectionId: 4, name: "Chris Lee", email: "2021305909@dhvsu.edu.ph", status: "active" },
    { id: 10, sectionId: 5, name: "Karen White", email: "2021305910@dhvsu.edu.ph", status: "active" },
    { id: 11, sectionId: 5, name: "Alex Thompson", email: "2021305911@dhvsu.edu.ph", status: "active" },
    { id: 12, sectionId: 5, name: "Emma Davis", email: "2021305912@dhvsu.edu.ph", status: "active" },
    { id: 13, sectionId: 6, name: "James Wilson", email: "2021305913@dhvsu.edu.ph", status: "active" },
    { id: 14, sectionId: 6, name: "Sophia Turner", email: "2021305914@dhvsu.edu.ph", status: "active" },
    { id: 15, sectionId: 6, name: "Daniel Kim", email: "2021305915@dhvsu.edu.ph", status: "active" },
  ]
});

// Helper function to generate consistent avatars for students
const getAvatarForStudent = (student) => {
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

const SectionManagement = () => {
  const [sections, setSections] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCourseTab, setActiveCourseTab] = useState("bsit");
  const [viewMode, setViewMode] = useState("table");
  const [activeYear, setActiveYear] = useState(0);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  
  const { sections: mockSections, teachers, courses, students } = useMemo(() => getMockData(), []);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Student modal state
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [studentsModalSection, setStudentsModalSection] = useState(null);

  const navigate = useNavigate();

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Initialize sections with mock data
  useEffect(() => {
    setSections(mockSections);
  }, [mockSections]);

  // On mount, check localStorage for a new section and add it if present
  useEffect(() => {
    const stored = localStorage.getItem('newSection');
    if (stored) {
      const newSection = JSON.parse(stored);
      // Generate a new id
      const newSectionId = Math.max(0, ...mockSections.map(s => s.id)) + 1;
      
      // Create the section with all the details
      const sectionToAdd = {
        id: newSectionId,
        name: newSection.name,
        course: newSection.course,
        year: newSection.year,
        adviserId: newSection.adviser,
        adviserDetails: newSection.adviserDetails, // Save adviser details
        enrolled: newSection.enrolled || newSection.students?.length || 0,
        ay: newSection.academicYear || '2024-2025',
        semester: newSection.semester || '1st Semester',
        studentIds: newSection.students || [], // Save student IDs
        studentDetails: newSection.studentDetails || [], // Save full student details
      };
      
      // Add the new section to the sections array
      const updatedSections = [...mockSections, sectionToAdd];
      setSections(updatedSections);
      
      // Also add the students to the students array if they don't exist
      if (newSection.studentDetails && newSection.studentDetails.length > 0) {
        const newStudents = newSection.studentDetails.map((student, index) => ({
          ...student,
          sectionId: newSectionId,
          status: "active"
        }));
        // Note: In a real app, you'd update the students state here
        // For now, we'll use the studentDetails stored in the section
      }
      
      // Clear localStorage
      localStorage.removeItem('newSection');
      // Switch to the correct tab and reset filters
      setActiveCourseTab(newSection.course);
      setActiveYear(0);
      setSearchTerm("");
    }
  }, [mockSections]);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
    }
    return ' ↑';
  };

  const filteredAndSortedSections = useMemo(() => {
    let filtered = sections
      .filter(section => section.course === activeCourseTab)
      .filter(section => activeYear === 0 || section.year === ["All Years", "1st Year", "2nd Year", "3rd Year", "4th Year"][activeYear])
      .filter(section => section.name.toLowerCase().includes(searchTerm.toLowerCase()));

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [sections, activeCourseTab, activeYear, searchTerm, sortConfig]);

  // Calculate pagination info
  const totalItems = filteredAndSortedSections.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSections = filteredAndSortedSections.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  // Helper function to get students in a section
  const getStudentsForSection = (sectionId) => {
    const section = sections.find(s => s.id === sectionId);
    if (section && section.studentDetails) {
      // Return the actual selected students from the section
      return section.studentDetails.map((student, index) => ({
        ...student,
        id: student.id || index + 1,
        sectionId: sectionId,
        status: "active"
      }));
    }
    // Fallback to the original method for existing sections
    return students.filter(student => student.sectionId === sectionId);
  };

  // Modal for showing students in a section
  const renderStudentsModal = () => {
    if (!showStudentsModal || !studentsModalSection) return null;
    const studentsInSection = getStudentsForSection(studentsModalSection.id);
    // Use adviser details from section if available, otherwise fallback to teachers array
    const adviser = studentsModalSection.adviserDetails || teachers.find(t => t.id === studentsModalSection.adviserId);
    
    return (
      <Modal isOpen={showStudentsModal} toggle={() => setShowStudentsModal(false)} centered size="lg">
        <ModalHeader 
          toggle={() => setShowStudentsModal(false)}
          style={{
            background: '#eaf4fb',
            color: '#22336b',
            borderBottom: 'none',
            borderRadius: '0.375rem 0.375rem 0 0'
          }}
        >
          <div className="d-flex align-items-center">
            <div className="mr-3">
              <i className="ni ni-bullet-list-67" style={{ fontSize: '1.5rem', color: '#22336b' }} />
            </div>
            <div>
              <h5 className="mb-0 font-weight-bold" style={{ color: '#22336b' }}>{studentsModalSection.name}</h5>
              <small style={{ opacity: 0.9, color: '#22336b' }}>
                {studentsModalSection.year} • {studentsModalSection.ay} • {studentsModalSection.semester}
              </small>
            </div>
          </div>
        </ModalHeader>
        <ModalBody style={{ padding: '1.5rem' }}>
          {/* Section Info Card */}
          <div className="bg-light rounded-lg p-3 mb-4" style={{ background: '#fff', border: 'none', boxShadow: '0 1px 4px rgba(34,51,107,0.04)' }}>
            <div className="row">
              <div className="col-md-6">
                <div className="d-flex align-items-center mb-2">
                  <i className="ni ni-single-02 mr-2" style={{ color: '#4066b5', fontSize: '1.2rem' }} />
                  <span className="font-weight-bold" style={{ color: '#425466' }}>Adviser:</span>
                  <span className="ml-2" style={{ color: '#425466' }}>{adviser?.name || 'N/A'}</span>
                </div>
                <div className="d-flex align-items-center">
                  <i className="ni ni-email-83 mr-2" style={{ color: '#4a6fa5', fontSize: '1.2rem' }} />
                  <span className="font-weight-bold" style={{ color: '#425466' }}>Email:</span>
                  <span className="ml-2" style={{ color: '#425466' }}>{adviser?.email || 'N/A'}</span>
                </div>
              </div>
              <div className="col-md-6 text-md-right">
                <div className="d-flex align-items-center justify-content-md-end mb-2">
                  <i className="ni ni-badge mr-2" style={{ color: '#4066b5', fontSize: '1.2rem' }} />
                  <span className="font-weight-bold" style={{ color: '#425466' }}>Students:</span>
                  <span className="ml-2 badge badge-pill" style={{ background: '#eaf4fb', color: '#4066b5', fontWeight: 700, fontSize: '1rem', padding: '0.3em 0.9em' }}>
                    {studentsInSection.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Students List */}
          <div>
            <h6 className="text-uppercase text-muted font-weight-bold mb-2" style={{ fontSize: '0.95rem' }}>
              <i className="ni ni-single-02 mr-2" style={{ fontSize: '1rem' }} />
              Student List ({studentsInSection.length})
            </h6>
            
            {studentsInSection.length === 0 ? (
              <div className="text-center py-4">
                <div className="mb-2">
                  <i className="ni ni-single-02" style={{ fontSize: '2rem', color: '#dee2e6' }} />
                </div>
                <div className="text-muted small mb-0" style={{ fontSize: '0.95rem' }}>
                  No Students Assigned
                </div>
              </div>
            ) : (
              <div className="student-list-container" style={{ maxHeight: '260px', overflowY: 'auto', padding: '0 2px' }}>
                {studentsInSection.map((student, index) => (
                  <div 
                    key={student.id} 
                    className="student-item d-flex align-items-center mb-1 rounded-lg"
                    style={{
                      background: '#f8f9fa',
                      border: '1px solid #e9ecef',
                      padding: '6px 10px',
                      minHeight: 38,
                      fontSize: '0.97rem',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#e3f2fd';
                      e.currentTarget.style.borderColor = '#5e72e4';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#f8f9fa';
                      e.currentTarget.style.borderColor = '#e9ecef';
                    }}
                  >
                    <div className="position-relative mr-2">
                      <img 
                        src={getAvatarForStudent(student)} 
                        alt={student.name} 
                        style={{ 
                          width: 28, 
                          height: 28, 
                          borderRadius: '50%', 
                          objectFit: 'cover',
                          border: '1px solid #fff',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.07)'
                        }} 
                      />
                    </div>
                    <div className="flex-grow-1" style={{ minWidth: 0 }}>
                      <div className="d-flex align-items-center" style={{ fontSize: '0.97rem', fontWeight: 500, color: '#425466', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {student.name}
                        <span className="badge badge-primary badge-pill ml-2" style={{ fontSize: '0.65rem', fontWeight: 400 }}>Active</span>
                      </div>
                      <div className="d-flex align-items-center" style={{ fontSize: '0.85rem', color: '#7b8a9b' }}>
                        <i className="ni ni-email-83 mr-1 text-muted" style={{ fontSize: '0.8rem' }} />
                        <span className="text-muted small" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{student.email}</span>
                        <span style={{ marginLeft: 8, color: '#b0b7c3', fontSize: '0.8rem' }}>ID: {student.id.toString().padStart(4, '0')}</span>
                      </div>
                    </div>
                    <div className="text-right ml-2">
                      <span className="text-muted small">#{index + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ModalBody>
      </Modal>
    );
  };

  const currentCourseName = courses.find(c => c.id === activeCourseTab)?.name || "Sections";

  // Block view for sections
  const renderBlockView = () => (
    <Row className="px-3">
      {paginatedSections.map((section, idx) => {
        // Use adviser details from section if available, otherwise fallback to teachers array
        const adviser = section.adviserDetails || teachers.find(t => t.id === section.adviserId);
        // Calculate if this is the first, middle, or last block in a row (3 per row)
        const isFirstInRow = idx % 3 === 0;
        const isMiddleInRow = (idx + 1) % 3 === 2;
        const isLastInRow = (idx + 1) % 3 === 0 || idx === paginatedSections.length - 1;
        
        return (
          <Col key={section.id} lg="4" md="6" sm="12" className="mb-3">
            <Card
              className="shadow-sm position-relative"
              style={{
                cursor: 'pointer',
                border: '1.5px solid #e3eaf3',
                borderRadius: 16,
                background: '#fff',
                boxShadow: '0 2px 12px 0 rgba(64,102,181,0.06)',
                transition: 'box-shadow 0.2s, border-color 0.2s',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 6px 24px 0 rgba(64,102,181,0.13)';
                e.currentTarget.style.borderColor = '#b5c6d6';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = '0 2px 12px 0 rgba(64,102,181,0.06)';
                e.currentTarget.style.borderColor = '#e3eaf3';
              }}
              onClick={() => {
                setStudentsModalSection(section);
                setShowStudentsModal(true);
              }}
            >
              {/* Block Header */}
              <div style={{ background: '#eaf4fb', borderRadius: '12px 12px 0 0', padding: '12px 18px 8px 18px', minHeight: 54, display: 'flex', alignItems: 'flex-start', position: 'relative' }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', flex: 1 }}>
                  <i className="ni ni-bullet-list-67" style={{ color: '#22336b', fontSize: '1.05rem', marginTop: 2, marginRight: 10, minWidth: 18, textAlign: 'center' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                    <span className="font-weight-bold" style={{ color: '#22336b', fontSize: '0.81rem', lineHeight: 1.1 }}>{section.name}</span>
                    <span className="text-muted" style={{ color: '#22336b', fontSize: '0.69rem', marginTop: 2 }}>{section.year} • {section.ay} • {section.semester}</span>
                  </div>
                </div>
                {/* Three-dot menu */}
                <div style={{ position: 'absolute', top: 10, right: 14, zIndex: 2 }} onClick={e => e.stopPropagation()}>
                  <UncontrolledDropdown>
                    <DropdownToggle
                      color="link"
                      size="sm"
                      className="text-muted p-0 section-block-menu-toggle"
                      style={{ border: 'none', background: 'transparent', fontSize: '1.15rem', lineHeight: 1, borderRadius: '50%', transition: 'background 0.15s' }}
                      aria-label="Actions"
                    >
                      <i className="fa fa-ellipsis-h" />
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem
                        onClick={() => handleEditSection(section)}
                        className="d-flex align-items-center"
                      >
                        <i className="ni ni-settings-gear-65 mr-2"></i>
                        Edit Section
                      </DropdownItem>
                      <DropdownItem
                        onClick={() => handleDeleteSection(section)}
                        className="d-flex align-items-center text-danger"
                      >
                        <i className="fa fa-trash mr-2"></i>
                        Delete Section
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </div>
              </div>
              {/* Card Body */}
              <CardBody className="p-3" style={{ background: '#fff', borderRadius: '0 0 12px 12px' }}>
                <div className="mb-2 d-flex align-items-center" style={{gap: 10, marginLeft: 6, marginTop: 15}}>
                  <img src={adviser?.avatar} alt={adviser?.name} className="avatar avatar-sm rounded-circle" style={{width: 32, height: 32, objectFit: 'cover'}} />
                  <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                    <span className="font-weight-bold" style={{ color: '#425466', fontSize: '0.89rem', lineHeight: 1.1 }}>{adviser?.name || 'No Adviser'}</span>
                    <span className="text-muted" style={{ color: '#8b98a9', fontSize: '0.77rem', marginTop: 2 }}>{adviser?.email || 'No Email'}</span>
                  </div>
                </div>
                <div className="mb-2" style={{marginLeft: 6, marginTop: 8}}>
                  <span className="d-block" style={{ color: '#425466', fontSize: '0.93rem' }}>
                    <i className="ni ni-badge mr-1" style={{ color: '#4066B5' }}></i>
                    <span className="font-weight-bold">Students:</span>
                    <span className="font-weight-bold ml-1">{section.enrolled}</span>
                  </span>
                </div>
                {/* Three-dot menu with hover effect */}
                <style>{`
                  .section-block-menu-toggle:hover {
                    background: #d6e6fa !important;
                    border-radius: 50% !important;
                    cursor: pointer !important;
                    transition: background 0.18s;
                  }
                  .section-block-menu-toggle:hover i.fa-ellipsis-h {
                    color: #4066B5 !important;
                  }
                `}</style>
              </CardBody>
            </Card>
          </Col>
        );
      })}
    </Row>
  );

  // Add these handlers to fix ESLint errors
  function handleEditSection(section) {
    // TODO: Implement edit logic
    console.log('Edit section:', section);
  }

  function handleDeleteSection(section) {
    // TODO: Implement delete logic
    console.log('Delete section:', section);
  }

  return (
    <>
      <style>{sectionManagementStyles}</style>
      {!isMobile && <Header showStats={false} />}
      <Container className="section-content-container" fluid>
        <Row>
          <div className="col">
            <Card className="shadow section-content-card">
              {/* Tabs and View Mode Row */}
              <Row className="mb-4 align-items-center">
                <Col xs="12">
                  <div className="d-flex justify-content-between align-items-center">
                    <Nav tabs>
                      {courses.map(course => (
                        <NavItem key={course.id}>
                          <NavLink
                            className={classnames({ active: activeCourseTab === course.id })}
                            onClick={() => setActiveCourseTab(course.id)}
                            style={{
                              cursor: "pointer",
                              borderBottom: activeCourseTab === course.id ? "3px solid #5e72e4" : "none"
                            }}
                          >
                            {course.abbr}
                          </NavLink>
                        </NavItem>
                      ))}
                    </Nav>
                    <div className="btn-group" role="group" style={{ marginLeft: '1rem' }}>
                      <Button
                        color={viewMode === 'table' ? 'primary' : 'secondary'}
                        outline={viewMode !== 'table'}
                        size="sm"
                        onClick={() => setViewMode('table')}
                        className="mr-1"
                      >
                        <i className="ni ni-bullet-list-67 mr-1"></i>
                        Table
                      </Button>
                      <Button
                        color={viewMode === 'block' ? 'primary' : 'secondary'}
                        outline={viewMode !== 'block'}
                        size="sm"
                        onClick={() => setViewMode('block')}
                        style={{ marginRight: '5px' }}
                      >
                        <i className="ni ni-app mr-1"></i>
                        Block
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
              {/* Search and Filter Row */}
              <Row style={{ marginLeft: 0, marginRight: 0 }}>
                <Col md="12" className="pl-3 pr-3">
                  {/* Search bar in a single row with space to the right */}
                  <div className="d-flex align-items-center mb-2" style={{ width: '100%' }}>
                    <InputGroup className={isSearchFocused ? 'focused' : ''} style={{ width: '100%', marginBottom: '6px' }}>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="fas fa-search" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Search sections..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ minWidth: 0 }}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                      />
                    </InputGroup>
                  </div>
                  {/* Year filter buttons below search bar */}
                  <div className="d-flex justify-content-center">
                    <div className="btn-group mb-2" role="group" style={{ marginTop: '8px', marginBottom: '16px' }}>
                      {['All Years', '1st Year', '2nd Year', '3rd Year', '4th Year'].map((year, idx) => (
                        <Button
                          key={year}
                          color={activeYear === idx ? 'primary' : 'secondary'}
                          outline={false}
                          style={{
                            minWidth: '56px',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            border: 'none',
                            boxShadow: 'none',
                            background: activeYear === idx ? undefined : '#f6f9fc',
                            color: activeYear === idx ? '#fff' : '#4385B1',
                            marginRight: '7px',
                            padding: '3px 7px',
                            borderRadius: '0.375rem',
                            textAlign: 'center',
                            whiteSpace: 'nowrap'
                          }}
                          onClick={() => setActiveYear(idx)}
                        >
                          {year}
                        </Button>
                      ))}
                    </div>
                  </div>
                  {/* Course name and action buttons row below year filter */}
                  <div className="w-100 d-flex justify-content-between align-items-center" style={{ marginTop: '20px', marginBottom: '16px' }}>
                    <div style={{ fontWeight: 600, fontSize: '1.1rem', color: '#32325d' }}>
                      {currentCourseName} ({filteredAndSortedSections.length})
                    </div>
                    <div>
                      <Button color="info" outline className="mr-2" size="sm" style={{ padding: '3px 10px', fontSize: '0.75rem' }}>
                        <i className="ni ni-archive-2 mr-2" /> Export
                      </Button>
                      <Button color="primary" size="sm" style={{ padding: '3px 6px', fontSize: '0.75rem' }} onClick={() => navigate('/admin/create-section')}>
                        <i className="ni ni-fat-add" /> Add New Section
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
              {/* Table View */}
              <div style={{ marginTop: '0' }}>
                {viewMode === 'table' && (
                  <>
                    <Table className="align-items-center table-flush" responsive>
                      <thead className="thead-light">
                        <tr>
                          <th scope="col" onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                            SECTION NAME{getSortIndicator('name')}
                          </th>
                          <th scope="col" onClick={() => handleSort('year')} style={{ cursor: 'pointer' }}>
                            YEAR{getSortIndicator('year')}
                          </th>
                          <th scope="col" onClick={() => handleSort('adviserId')} style={{ cursor: 'pointer' }}>
                            ADVISER{getSortIndicator('adviserId')}
                          </th>
                          <th scope="col" onClick={() => handleSort('enrolled')} style={{ cursor: 'pointer' }}>
                            ENROLLED{getSortIndicator('enrolled')}
                          </th>
                          <th scope="col" onClick={() => handleSort('ay')} style={{ cursor: 'pointer' }}>
                            A.Y.{getSortIndicator('ay')}
                          </th>
                          <th scope="col" onClick={() => handleSort('semester')} style={{ cursor: 'pointer' }}>
                            SEMESTER{getSortIndicator('semester')}
                          </th>
                          <th scope="col">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedSections.map(section => {
                          // Use adviser details from section if available, otherwise fallback to teachers array
                          const adviser = section.adviserDetails || teachers.find(t => t.id === section.adviserId);
                          return (
                            <tr 
                              key={section.id}
                              style={{ cursor: 'pointer' }}
                              onClick={() => {
                                console.log('Row clicked', section);
                                setStudentsModalSection(section);
                                setShowStudentsModal(true);
                              }}
                            >
                              <td>{section.name}</td>
                              <td>{section.year}</td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <img src={adviser?.avatar} alt={adviser?.name} className="avatar avatar-sm rounded-circle mr-2" />
                                  <div>
                                    <div className="font-weight-bold">{adviser?.name}</div>
                                    <div className="text-muted small">{adviser?.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td>{section.enrolled}</td>
                              <td>{section.ay}</td>
                              <td>{section.semester}</td>
                              <td onClick={e => e.stopPropagation()}>
                                <Button
                                  color="primary"
                                  size="sm"
                                  className="mr-2"
                                  // onClick={() => handleEditSection(section.id)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  color="danger"
                                  size="sm"
                                  // onClick={() => handleDeleteSection(section.id)}
                                >
                                  Delete
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                    {/* Pagination UI */}
                    <div style={{height: '80px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                      <div className="d-flex flex-row align-items-center" style={{ marginLeft: '1.5rem' }}>
                        <span className="mr-2 text-muted small">Show</span>
                        <Input
                          className="custom-focus-effect"
                          type="select"
                          value={itemsPerPage}
                          onChange={handleItemsPerPageChange}
                          style={{ width: '80px', fontSize: '0.95rem', marginRight: '8px' }}
                        >
                          <option value={5}>5</option>
                          <option value={10}>10</option>
                          <option value={20}>20</option>
                          <option value={50}>50</option>
                        </Input>
                        <span className="text-muted small" style={{ whiteSpace: 'nowrap' }}>
                          of {totalItems} entries
                        </span>
                      </div>
                      <Pagination size="sm" className="mb-0 justify-content-end" style={{margin: 0, marginRight: '1.5rem'}}>
                        <PaginationItem disabled={currentPage === 1}>
                          <PaginationLink
                            previous
                            onClick={() => handlePageChange(currentPage - 1)}
                            style={{ cursor: currentPage === 1 ? 'default' : 'pointer' }}
                          />
                        </PaginationItem>
                        {currentPage > 2 && !isMobile && (
                          <PaginationItem>
                            <PaginationLink
                              onClick={() => handlePageChange(1)}
                              style={{ cursor: 'pointer', textAlign: 'center', minWidth: '28px', fontSize: '0.875rem' }}
                            >
                              1
                            </PaginationLink>
                          </PaginationItem>
                        )}
                        {currentPage > 3 && !isMobile && (
                          <PaginationItem disabled>
                            <PaginationLink style={{ textAlign: 'center', minWidth: '28px', fontSize: '0.875rem' }}>...</PaginationLink>
                          </PaginationItem>
                        )}
                        {currentPage > 1 && (
                          <PaginationItem>
                            <PaginationLink
                              onClick={() => handlePageChange(currentPage - 1)}
                              style={{ cursor: 'pointer', textAlign: 'center', minWidth: '28px', fontSize: '0.875rem' }}
                            >
                              {currentPage - 1}
                            </PaginationLink>
                          </PaginationItem>
                        )}
                        <PaginationItem active>
                          <PaginationLink style={{ textAlign: 'center', minWidth: '28px', fontSize: '0.875rem' }}>
                            {currentPage}
                          </PaginationLink>
                        </PaginationItem>
                        {currentPage < totalPages && (
                          <PaginationItem>
                            <PaginationLink
                              onClick={() => handlePageChange(currentPage + 1)}
                              style={{ cursor: 'pointer', textAlign: 'center', minWidth: '28px', fontSize: '0.875rem' }}
                            >
                              {currentPage + 1}
                            </PaginationLink>
                          </PaginationItem>
                        )}
                        {currentPage < totalPages - 2 && !isMobile && (
                          <PaginationItem disabled>
                            <PaginationLink style={{ textAlign: 'center', minWidth: '28px', fontSize: '0.875rem' }}>...</PaginationLink>
                          </PaginationItem>
                        )}
                        {currentPage < totalPages - 1 && !isMobile && (
                          <PaginationItem>
                            <PaginationLink
                              onClick={() => handlePageChange(totalPages)}
                              style={{ cursor: 'pointer', textAlign: 'center', minWidth: '28px', fontSize: '0.875rem' }}
                            >
                              {totalPages}
                            </PaginationLink>
                          </PaginationItem>
                        )}
                        <PaginationItem disabled={currentPage === totalPages}>
                          <PaginationLink
                            next
                            onClick={() => handlePageChange(currentPage + 1)}
                            style={{ cursor: currentPage === totalPages ? 'default' : 'pointer' }}
                          />
                        </PaginationItem>
                      </Pagination>
                    </div>
                  </>
                )}
                {viewMode === 'block' && renderBlockView()}
              </div>
            </Card>
          </div>
        </Row>
      </Container>
      {renderStudentsModal()}
    </>
  );
};

export default SectionManagement; 