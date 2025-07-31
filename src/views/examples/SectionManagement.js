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
  Alert,
  Spinner,
} from "reactstrap";
import classnames from "classnames";
import Header from "components/Headers/Header.js";
import { useNavigate } from "react-router-dom";
import userDefault from "../../assets/img/theme/user-default.svg";
import apiService from "../../services/api.js";

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

// Helper function to format section name with program and year
const formatSectionName = (sectionName, program, yearLevel) => {
  // Extract just the year number (1, 2, 3, 4) from year level
  const yearNumber = yearLevel.replace(/[^0-9]/g, '');
  // Extract just the section letter/name
  const sectionLetter = sectionName.trim();
  
  // Format: "BSIT 4A" or "BSCS 2B" etc. (uppercase program)
  return `${program.toUpperCase()} ${yearNumber}${sectionLetter}`;
};

// Helper function to format year level with ordinal suffix (without "Year")
const formatYearLevel = (yearLevel) => {
  if (!yearLevel) return '';
  
  // If it's already formatted (e.g., "1st Year"), extract just the ordinal part
  if (yearLevel.includes('st') || yearLevel.includes('nd') || yearLevel.includes('rd') || yearLevel.includes('th')) {
    // Remove "Year" if present
    return yearLevel.replace(' Year', '');
  }
  
  // If it's just a number, add ordinal suffix
  const yearNumber = yearLevel.replace(/[^0-9]/g, '');
  if (yearNumber) {
    const j = parseInt(yearNumber) % 10;
    const k = parseInt(yearNumber) % 100;
    let suffix;
    if (j === 1 && k !== 11) suffix = 'st';
    else if (j === 2 && k !== 12) suffix = 'nd';
    else if (j === 3 && k !== 13) suffix = 'rd';
    else suffix = 'th';
    return `${yearNumber}${suffix}`;
  }
  
  return yearLevel;
};

const SectionManagement = () => {
  const [sections, setSections] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCourseTab, setActiveCourseTab] = useState("bsit");
  const [viewMode, setViewMode] = useState("table");
  const [activeYear, setActiveYear] = useState(0);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Student modal state
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [studentsModalSection, setStudentsModalSection] = useState(null);
  const [sectionStudents, setSectionStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState(null);
  const [deletingSection, setDeletingSection] = useState(false);

  // Add state to track original sections for each course
  const [originalSections, setOriginalSections] = useState({});

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

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Refresh sections when component becomes visible (e.g., after navigation)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && !loading) {
        console.log('Page became visible, refreshing sections data...');
        loadSectionsForCourse(activeCourseTab);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [activeCourseTab, loading]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load sections for the active course tab
      const sectionsData = await apiService.getSectionsByCourse(activeCourseTab);
      
      console.log('Initial sections data received:', sectionsData);
      
      // Load supporting data (courses, teachers, students)
      const [coursesData, teachersData, studentsData] = await Promise.all([
        apiService.getCourses(),
        apiService.getAvailableTeachers(),
        apiService.getAvailableStudents()
      ]);

      // Validate and clean sections data
      const cleanSections = (sectionsData.data || sectionsData || []).map(section => {
        const rawName = section.name || section.section_name || 'Unnamed Section';
        const rawYear = section.year || section.year_level || '1st Year';
        const program = section.course || activeCourseTab;
        
        console.log(`Processing section: ${rawName}, year: ${rawYear}, program: ${program}`);
        
        return {
          id: section.id || Math.random(),
          name: formatSectionName(rawName, program, rawYear), // Format: "BSIT 4A"
          originalName: rawName, // Keep original for editing
          course: program,
          year: rawYear, // Keep original year format for filtering
          yearFormatted: formatYearLevel(rawYear), // Store formatted version for display
          originalYear: rawYear, // Keep original for editing
          adviserId: section.adviserId || section.adviser_id || null,
          adviserDetails: section.adviserDetails || section.adviser_details || null,
          enrolled: section.enrolled || section.student_count || 0,
          ay: section.ay || section.academic_year || '2024-2025',
          semester: section.semester || '1st Semester',
          ...section // Keep any other properties
        };
      });

      console.log(`Processed ${cleanSections.length} sections for initial load`);
      setSections(cleanSections);
      setTeachers(teachersData.data || teachersData || []);
      setCourses(coursesData.data || coursesData || []);
      setStudents(studentsData.data || studentsData || []);
    } catch (error) {
      console.error('Error loading initial data:', error);
      setError(error.message || 'Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load sections when course tab changes
  useEffect(() => {
    if (!loading) {
      loadSectionsForCourse(activeCourseTab);
    }
  }, [activeCourseTab]);

  // Load sections for a specific course
  const loadSectionsForCourse = async (course) => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      console.log(`Loading sections for course: ${course}`);
      
      const sectionsData = await apiService.getSectionsByCourse(course);
      console.log(`Raw sections data received for ${course}:`, sectionsData);
      
      // Validate and clean sections data
      const sectionsArray = sectionsData.data || sectionsData || [];
      console.log(`Sections array length: ${sectionsArray.length}`);
      console.log(`Sections array:`, sectionsArray);
      
      const cleanSections = sectionsArray.map(section => {
        console.log(`Processing section:`, section);
        const rawName = section.name || section.section_name || 'Unnamed Section';
        const rawYear = section.year || section.year_level || '1st Year';
        const program = section.course || course;
        
        // Log enrollment data specifically
        console.log(`Section ${section.id} enrollment data:`, {
          enrolled: section.enrolled,
          student_count: section.student_count,
          final_enrolled: section.enrolled || section.student_count || 0
        });
        
        const processedSection = {
          id: section.id || Math.random(),
          name: formatSectionName(rawName, program, rawYear), // Format: "BSIT 4A"
          originalName: rawName, // Keep original for editing
          course: program,
          year: rawYear, // Keep original year format for filtering
          yearFormatted: formatYearLevel(rawYear), // Store formatted version for display
          originalYear: rawYear, // Keep original for editing
          adviserId: section.adviserId || section.adviser_id || null,
          adviserDetails: section.adviserDetails || section.adviser_details || null,
          enrolled: section.enrolled || section.student_count || 0,
          ay: section.ay || section.academic_year || '2024-2025',
          semester: section.semester || '1st Semester',
          ...section // Keep any other properties
        };
        
        console.log(`Processed section:`, processedSection);
        return processedSection;
      });
      
      console.log(`Setting ${cleanSections.length} sections for course ${course}`);
      console.log(`Final clean sections:`, cleanSections);
      
      // Log enrollment counts for debugging
      cleanSections.forEach(section => {
        console.log(`Section "${section.name}": ${section.enrolled} students enrolled`);
      });
      
      setSections(cleanSections);
      
      // Store original sections for this course
      setOriginalSections(prev => ({
        ...prev,
        [course]: cleanSections
      }));
    } catch (error) {
      console.error('Error loading sections for course:', error);
      setError(error.message || 'Failed to load sections. Please try again.');
      setSections([]);
      // Also store empty array to prevent future API calls
      setOriginalSections(prev => ({
        ...prev,
        [course]: []
      }));
    } finally {
      setLoading(false);
    }
  };

  // Load sections when year filter changes
  useEffect(() => {
    if (!loading) {
      loadSectionsForYear(activeCourseTab, activeYear);
    }
  }, [activeYear, activeCourseTab]); // Removed originalSections from dependencies

  // Load sections for a specific year
  const loadSectionsForYear = async (course, yearIndex) => {
    try {
      setLoading(true);
      setError(null);
      console.log(`Loading sections for course: ${course}, yearIndex: ${yearIndex}`);
      
      const yearLevels = ['1st', '2nd', '3rd', '4th'];
      const yearLevel = yearLevels[yearIndex - 1]; // activeYear 0 is "All Years"
      
      if (yearLevel) {
        // Load specific year sections - use the same approach as "All Years" for ALL programs
        console.log(`Loading specific year: ${yearLevel} for program: ${course}`);
        
        // Use stored original sections if available, otherwise load from API
        let allSections = [];
        if (originalSections[course] && originalSections[course].length > 0) {
          console.log(`Using cached sections for ${course}`);
          allSections = originalSections[course];
        } else {
          console.log(`Loading all sections for ${course} to filter by year`);
          const sectionsData = await apiService.getSectionsByCourse(course);
          allSections = (sectionsData.data || sectionsData || []).map(section => {
            const rawName = section.name || section.section_name || 'Unnamed Section';
            const rawYear = section.year || section.year_level || '1st Year';
            const program = section.course || course;
            
            return {
              id: section.id || Math.random(),
              name: formatSectionName(rawName, program, rawYear), // Format: "BSIT 4A"
              originalName: rawName, // Keep original for editing
              course: program,
              year: rawYear, // Keep original year format for filtering
              yearFormatted: formatYearLevel(rawYear), // Store formatted version for display
              originalYear: rawYear, // Keep original for editing
              adviserId: section.adviserId || section.adviser_id || null,
              adviserDetails: section.adviserDetails || section.adviser_details || null,
              enrolled: section.enrolled || section.student_count || 0,
              ay: section.ay || section.academic_year || '2024-2025',
              semester: section.semester || '1st Semester',
              ...section // Keep any other properties
            };
          });
          
          // Store the sections for future use
          setOriginalSections(prev => ({
            ...prev,
            [course]: allSections
          }));
        }
        
        // Filter sections by year for ALL programs
        const yearFilter = yearLevel + ' Year';
        const yearFilterShort = yearLevel; // Just the ordinal (1st, 2nd, 3rd, 4th)
        
        console.log(`Filtering sections for year: ${yearLevel}`);
        console.log(`Year filter options: "${yearFilter}", "${yearFilterShort}"`);
        console.log(`Total sections to filter: ${allSections.length}`);
        
        const filteredSections = allSections.filter(section => {
          const sectionYear = section.year || section.year_level || '';
          const sectionYearFormatted = section.yearFormatted || formatYearLevel(sectionYear);
          
          const matches = sectionYear === yearFilter || 
                         sectionYear === yearFilterShort ||
                         sectionYearFormatted === yearFilterShort ||
                         sectionYear.includes(yearLevel) ||
                         sectionYearFormatted.includes(yearLevel);
          
          if (matches) {
            console.log(`Section "${section.name}" matches year filter:`, {
              originalYear: sectionYear,
              formattedYear: sectionYearFormatted,
              yearLevel: yearLevel
            });
          }
          
          return matches;
        });
        
        console.log(`Filtered ${filteredSections.length} sections for year ${yearLevel} in ${course}`);
        setSections(filteredSections);
      } else {
        // Load all sections for the course (when "All Years" is selected)
        console.log('Loading all sections for course');
        
        // Use stored original sections if available, otherwise load from API
        if (originalSections[course] && originalSections[course].length > 0) {
          console.log(`Restoring ${originalSections[course].length} original sections for ${course}`);
          setSections(originalSections[course]);
        } else {
          await loadSectionsForCourse(course);
        }
      }
    } catch (error) {
      console.error('Error loading sections for year:', error);
      setError(error.message || 'Failed to load sections. Please try again.');
      setSections([]);
      // Store empty array to prevent future API calls for this course
      setOriginalSections(prev => ({
        ...prev,
        [course]: []
      }));
    } finally {
      setLoading(false);
    }
  };

  // Reset year filter when course changes
  useEffect(() => {
    setActiveYear(0); // Reset to "All Years" when course changes
  }, [activeCourseTab]);

  // Load section students when modal opens
  const loadSectionStudents = async (sectionId) => {
    try {
      setLoadingStudents(true);
      // For now, return empty array since the endpoint might not exist
      setSectionStudents([]);
    } catch (error) {
      console.error('Error loading section students:', error);
      setSectionStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  // Handle section operations
  const handleEditSection = async (section) => {
    try {
      console.log('Editing section with data:', section);
      console.log('Section properties:', {
        id: section.id,
        name: section.name,
        course: section.course,
        year: section.year,
        originalYear: section.originalYear,
        yearFormatted: section.yearFormatted,
        ay: section.ay,
        semester: section.semester,
        adviserId: section.adviserId,
        adviserDetails: section.adviserDetails
      });
      navigate('/admin/edit-section', { state: { section } });
    } catch (error) {
      console.error('Error editing section:', error);
      setError('Failed to edit section. Please try again.');
    }
  };

  const handleDeleteSection = async (section) => {
    setSectionToDelete(section);
    setShowDeleteModal(true);
  };

  const confirmDeleteSection = async () => {
    if (!sectionToDelete) return;
    
    try {
      setDeletingSection(true);
      await apiService.deleteSection(sectionToDelete.id);
      setSections(prevSections => prevSections.filter(s => s.id !== sectionToDelete.id));
      setShowDeleteModal(false);
      setSectionToDelete(null);
      setDeletingSection(false);
      // Show success message
      setError(null);
      // You can add a success toast or alert here if needed
    } catch (error) {
      console.error('Error deleting section:', error);
      setError('Failed to delete section. Please try again.');
      setDeletingSection(false);
    }
  };

  const cancelDeleteSection = () => {
    setShowDeleteModal(false);
    setSectionToDelete(null);
    setDeletingSection(false);
  };

  const handleExportSections = async () => {
    try {
      // For now, show an alert since the export endpoint might not exist
      alert('Export functionality will be implemented when the backend endpoint is available.');
      // const exportData = await apiService.exportSections('csv');
      // const blob = new Blob([exportData], { type: 'text/csv' });
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = `sections_export_${new Date().toISOString().split('T')[0]}.csv`;
      // document.body.appendChild(a);
      // a.click();
      // window.URL.revokeObjectURL(url);
      // document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting sections:', error);
      setError('Failed to export sections. Please try again.');
    }
  };

  const handleShowStudents = async (section) => {
    setStudentsModalSection(section);
    setShowStudentsModal(true);
    await loadSectionStudents(section.id);
  };

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
    // Since we're now using server-side filtering, we only need to apply search and sorting
    let filtered = sections.filter(section => {
      // Add null checks to prevent errors
      if (!section || !section.name) return false;
      return section.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        // Handle nested objects (like adviserDetails)
        if (sortConfig.key === 'adviserId' && a.adviserDetails) {
          aValue = a.adviserDetails.name || '';
          bValue = b.adviserDetails?.name || '';
        }
        
        // Ensure values are strings for comparison
        aValue = String(aValue || '');
        bValue = String(bValue || '');
        
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [sections, searchTerm, sortConfig]);

  // Calculate pagination info
  const totalItems = (filteredAndSortedSections || []).length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSections = (filteredAndSortedSections || []).slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  // Helper function to get students in a section
  const getStudentsForSection = (sectionId) => {
    // Use the sectionStudents state for the modal
    if (showStudentsModal && studentsModalSection && studentsModalSection.id === sectionId) {
      return sectionStudents;
    }
    // Fallback to filtering students by sectionId
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
                  <div className="d-flex align-items-center ml-2">
                    {adviser?.profile_picture ? (
                      <img 
                        src={`${process.env.REACT_APP_API_BASE_URL.replace('/api', '')}/${adviser.profile_picture}`}
                        alt={adviser?.name || 'No Adviser'} 
                        className="rounded-circle mr-2"
                        style={{ width: '24px', height: '24px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    {!adviser?.profile_picture && (
                      <div 
                        className="rounded-circle mr-2 bg-secondary d-flex align-items-center justify-content-center"
                        style={{ width: '24px', height: '24px', fontSize: '10px', color: 'white' }}
                      >
                        {adviser?.name ? adviser.name.charAt(0).toUpperCase() : '?'}
                      </div>
                    )}
                    <span style={{ color: '#425466' }}>{adviser?.name || 'N/A'}</span>
                  </div>
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
            
            {loadingStudents ? (
              <div className="text-center py-4">
                <Spinner color="primary" size="sm" className="mr-2" />
                <span className="text-muted">Loading students...</span>
              </div>
            ) : studentsInSection.length === 0 ? (
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
              onClick={() => handleShowStudents(section)}
            >
              {/* Block Header */}
              <div style={{ background: '#eaf4fb', borderRadius: '12px 12px 0 0', padding: '12px 18px 8px 18px', minHeight: 54, display: 'flex', alignItems: 'flex-start', position: 'relative' }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', flex: 1 }}>
                  <i className="ni ni-bullet-list-67" style={{ color: '#22336b', fontSize: '1.05rem', marginTop: 2, marginRight: 10, minWidth: 18, textAlign: 'center' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                    <span className="font-weight-bold" style={{ color: '#22336b', fontSize: '0.81rem', lineHeight: 1.1 }}>{section.name || 'Unnamed Section'}</span>
                    <span className="text-muted" style={{ color: '#22336b', fontSize: '0.69rem', marginTop: 2 }}>{section.year || 'N/A'} • {section.ay || 'N/A'} • {section.semester || 'N/A'}</span>
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
                  {adviser?.profile_picture ? (
                    <img 
                      src={`${process.env.REACT_APP_API_BASE_URL.replace('/api', '')}/${adviser.profile_picture}`}
                      alt={adviser?.name || 'No Adviser'} 
                      className="avatar avatar-sm rounded-circle" 
                      style={{width: 32, height: 32, objectFit: 'cover'}} 
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  {!adviser?.profile_picture && (
                    <div 
                      className="avatar avatar-sm rounded-circle mr-2 bg-secondary d-flex align-items-center justify-content-center"
                      style={{ width: '32px', height: '32px', fontSize: '12px', color: 'white' }}
                    >
                      {adviser?.name ? adviser.name.charAt(0).toUpperCase() : '?'}
                    </div>
                  )}
                  <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                    <span className="font-weight-bold" style={{ color: '#425466', fontSize: '0.89rem', lineHeight: 1.1 }}>{adviser?.name || 'No Adviser'}</span>
                    <span className="text-muted" style={{ color: '#8b98a9', fontSize: '0.77rem', marginTop: 2 }}>{adviser?.email || 'No Email'}</span>
                  </div>
                </div>
                <div className="mb-2" style={{marginLeft: 6, marginTop: 8}}>
                  <span className="d-block" style={{ color: '#425466', fontSize: '0.93rem' }}>
                    <i className="ni ni-badge mr-1" style={{ color: '#4066B5' }}></i>
                    <span className="font-weight-bold">Students:</span>
                    <span className="font-weight-bold ml-1">{section.enrolled || 0}</span>
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

  return (
    <>
      <style>{sectionManagementStyles}</style>
      {!isMobile && <Header showStats={false} />}
      {/* Header Background */}
      <div className="header pb-6 pt-4 pt-md-7"></div>
      <Container className="section-content-container" fluid>
        <Row>
          <div className="col">
            <Card className="shadow section-content-card">
              {/* CORS Warning Banner */}
              {error && error.includes('Backend connection failed') && (
                <Alert color="warning" className="mb-3">
                  <div className="d-flex align-items-center">
                    <i className="ni ni-bell-55 mr-2" style={{ fontSize: '1.2rem' }} />
                    <div>
                      <strong>Demo Mode:</strong> Backend connection failed. Using demo data. 
                      Please fix CORS headers on your backend to connect to real data.
                      <br />
                      <small className="text-muted">
                        See <code>BACKEND_CORS_FIX.md</code> for detailed instructions.
                      </small>
                    </div>
                  </div>
                </Alert>
              )}
              
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
                      <Button 
                        color="secondary" 
                        outline 
                        className="mr-2" 
                        size="sm" 
                        style={{ padding: '3px 10px', fontSize: '0.75rem' }} 
                        onClick={() => loadSectionsForCourse(activeCourseTab)}
                        disabled={loading}
                      >
                        <i className={`ni ni-refresh ${loading ? 'fa-spin' : ''} mr-2`} /> 
                        {loading ? 'Loading...' : 'Refresh'}
                      </Button>
                      <Button color="info" outline className="mr-2" size="sm" style={{ padding: '3px 10px', fontSize: '0.75rem' }} onClick={handleExportSections}>
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
                {loading ? (
                  <div className="text-center py-5">
                    <Spinner color="primary" size="lg" className="mr-2" />
                    <span className="text-muted">Loading sections...</span>
                  </div>
                ) : error ? (
                  <Alert color="danger" className="text-center">
                    {error}
                  </Alert>
                ) : viewMode === 'table' ? (
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
                              onClick={() => handleShowStudents(section)}
                            >
                              <td>{section.name || 'Unnamed Section'}</td>
                              <td>{section.year || 'N/A'}</td>
                              <td>
                                <div className="d-flex align-items-center">
                                  {adviser?.profile_picture ? (
                                    <img 
                                      src={`${process.env.REACT_APP_API_BASE_URL.replace('/api', '')}/${adviser.profile_picture}`}
                                      alt={adviser?.name || 'No Adviser'} 
                                      className="avatar avatar-sm rounded-circle mr-2"
                                      style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                      }}
                                    />
                                  ) : null}
                                  {!adviser?.profile_picture && (
                                    <div 
                                      className="avatar avatar-sm rounded-circle mr-2 bg-secondary d-flex align-items-center justify-content-center"
                                      style={{ width: '32px', height: '32px', fontSize: '12px', color: 'white' }}
                                    >
                                      {adviser?.name ? adviser.name.charAt(0).toUpperCase() : '?'}
                                    </div>
                                  )}
                                  <div>
                                    <div className="font-weight-bold">{adviser?.name || 'No Adviser'}</div>
                                    <div className="text-muted small">{adviser?.email || 'No Email'}</div>
                                  </div>
                                </div>
                              </td>
                              <td>{section.enrolled || 0}</td>
                              <td>{section.ay || 'N/A'}</td>
                              <td>{section.semester || 'N/A'}</td>
                              <td onClick={e => e.stopPropagation()}>
                                <Button
                                  color="primary"
                                  size="sm"
                                  className="mr-2"
                                  onClick={() => handleEditSection(section)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  color="danger"
                                  size="sm"
                                  onClick={() => handleDeleteSection(section)}
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
                ) : (
                  renderBlockView()
                )}
              </div>
            </Card>
          </div>
        </Row>
      </Container>
      {renderStudentsModal()}
      
      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} toggle={cancelDeleteSection} centered>
        <ModalHeader toggle={cancelDeleteSection} className="border-0 pb-0">
          <div className="d-flex align-items-center">
            <div className="bg-danger rounded-circle d-flex align-items-center justify-content-center mr-3" style={{ width: '40px', height: '40px' }}>
              <i className="ni ni-fat-remove text-white" style={{ fontSize: '1.2rem' }}></i>
            </div>
            <div>
              <h4 className="mb-0 text-danger">Delete Section</h4>
              <p className="text-muted mb-0 small">This action cannot be undone</p>
            </div>
          </div>
        </ModalHeader>
        <ModalBody className="pt-3">
          <div className="text-center mb-4">
            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '80px', height: '80px' }}>
              <i className="ni ni-fat-remove text-danger" style={{ fontSize: '2.5rem' }}></i>
            </div>
            <h5 className="mb-2">Are you sure?</h5>
            <p className="text-muted mb-0">
              You are about to delete the section <strong>"{sectionToDelete?.name}"</strong>.
              <br />
              This will permanently remove the section and all associated data.
            </p>
          </div>
          
          <div className="d-flex justify-content-center gap-3">
            <Button
              color="secondary"
              outline
              onClick={cancelDeleteSection}
              disabled={deletingSection}
              style={{ minWidth: '120px' }}
            >
              Cancel
            </Button>
            <Button
              color="danger"
              onClick={confirmDeleteSection}
              disabled={deletingSection}
              style={{ minWidth: '120px' }}
            >
              {deletingSection ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <i className="ni ni-fat-remove mr-2"></i>
                  Delete Section
                </>
              )}
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default SectionManagement; 