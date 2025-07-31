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
/*eslint-disable*/
import React, { useState } from "react";
import { Link, NavLink as NavLinkRRD, useLocation } from "react-router-dom";
import { PropTypes } from "prop-types";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Collapse,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Media,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
} from "reactstrap";

var ps;

const StudentSidebar = (props) => {
  const [collapseOpen, setCollapseOpen] = useState();
  const [enrolledOpen, setEnrolledOpen] = useState(false);
  const location = useLocation();
  const activeRoute = (routeName) => {
    return props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };
  const toggleCollapse = () => {
    setCollapseOpen((data) => !data);
  };
  const closeCollapse = () => {
    setCollapseOpen(false);
  };
  // Only use studentModules for sidebar links
  const studentModules = [
    { name: "Dashboard", icon: "ni ni-tv-2 text-primary", path: "/index" },
    { name: "Join Class", icon: "ni ni-fat-add text-success", path: "/join-class" },
    { name: "Classroom", icon: "ni ni-hat-3 text-info", path: "/classroom" },
    { name: "Attendance", icon: "ni ni-check-bold text-green", path: "/attendance" },
    { name: "Excuse Letters", icon: "ni ni-single-copy-04 text-pink", path: "/excuse-letters" },
    { name: "Notifications", icon: "ni ni-notification-70 text-info", path: "/notifications" },
  ];

  // Mock enrolled classes (replace with real data/fetch in production)
  const enrolledClasses = [
    {
      id: 1,
      subject: "Object Oriented Programming",
      code: "B7P3R9",
      section: "BSIT 3A"
    },
    {
      id: 2,
      subject: "Data Structures and Algorithms",
      code: "A1C2D3",
      section: "BSIT 2B"
    },
    {
      id: 3,
      subject: "Database Management Systems",
      code: "X9Y8Z7",
      section: "BSIT 3C"
    },
    {
      id: 4,
      subject: "SAD SUBJECT",
      code: "M7AGZY",
      section: "BSIT 3C"
    },
    {
      id: 5,
      subject: "SAD 312",
      code: "5XHJE9",
      section: "BSIT 3C"
    }
  ];

  const createLinks = () => {
    // Insert Enrolled Classes dropdown after Classroom (not after Join Class)
    const links = [];
    studentModules.forEach((mod, idx) => {
      links.push(
        <NavItem key={mod.name}>
          <NavLink
            to={"/student" + mod.path}
            tag={NavLinkRRD}
            onClick={closeCollapse}
          >
            <i className={mod.icon} />
            {mod.name}
          </NavLink>
        </NavItem>
      );
      // After Classroom, insert Enrolled Classes dropdown
      if (mod.name === "Classroom") {
        links.push(
          <NavItem key="enrolled-classes">
            <div style={{ position: 'relative' }}>
              <Button
                color="link"
                className="nav-link d-flex align-items-center"
                style={{
                  padding: "0.75rem 1rem",
                  fontWeight: 400,
                  color: enrolledOpen ? "#2096ff" : "#525f7f",
                  fontSize: "0.93rem",
                  position: 'relative',
                  background: 'none',
                  border: 'none',
                  width: '100%',
                  textAlign: 'left',
                  cursor: 'pointer',
                  boxShadow: 'none'
                }}
                onClick={e => { e.preventDefault(); setEnrolledOpen(!enrolledOpen); }}
              >
                <i className="ni ni-books text-primary" style={{ marginLeft: '0.38rem', marginRight: '0.1rem', fontSize: 18, verticalAlign: 'middle', color: '#2096ff' }} />
                Enrolled Classes
                <i className={`fa fa-chevron-${enrolledOpen ? "down" : "right"}`} style={{ position: 'absolute', right: -8, fontSize: 13, color: "#8898aa" }} />
              </Button>
              {enrolledOpen && (
                <div style={{ marginLeft: 32 }}>
                  {/* To-Do module at the top */}
                  <NavItem key="todo-module">
                    <NavLink
                      to="/student/assigned/all"
                      tag={NavLinkRRD}
                      onClick={closeCollapse}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: location.pathname.startsWith('/student/assigned') ? '#e3f0ff' : '#f7fafd',
                        color: '#1976d2',
                        borderRadius: 24,
                        fontWeight: 600,
                        fontSize: 16,
                        padding: '8px 18px',
                        marginBottom: 8,
                        marginTop: 8,
                        width: '90%',
                        boxShadow: location.pathname.startsWith('/student/assigned') ? '0 2px 8px #1976d222' : 'none',
                        cursor: 'pointer',
                        textDecoration: 'none',
                        transition: 'background 0.2s',
                      }}
                      activeClassName="active"
                    >
                      <i className="ni ni-bullet-list-67" style={{ fontSize: 20, marginRight: 12, color: '#1976d2' }} />
                      To-do
                    </NavLink>
                  </NavItem>
                  {/* Enrolled classes list */}
                  {enrolledClasses.length === 0 ? (
                    <NavItem>
                      <span className="text-muted" style={{ padding: "0.5rem 1rem", display: "block" }}>No classes joined</span>
                    </NavItem>
                  ) : (
                    enrolledClasses.map(cls => (
                      <NavItem key={cls.id}>
                        <NavLink
                          to={`/student/classroom/${cls.code}`}
                          tag={NavLinkRRD}
                          onClick={closeCollapse}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "0.5rem 1rem",
                            fontSize: "0.93rem",
                            fontWeight: 400,
                            color: "#525f7f"
                          }}
                        >
                          <i className="ni ni-hat-3 mr-2 text-info" />
                          {cls.subject} <span className="text-muted" style={{ fontSize: "0.85em", marginLeft: 6 }}>({cls.section})</span>
                        </NavLink>
                      </NavItem>
                    ))
                  )}
                </div>
              )}
            </div>
          </NavItem>
        );
      }
    });
    return links;
  };
  const { bgColor, logo } = props;
  let navbarBrandProps;
  if (logo && logo.innerLink) {
    navbarBrandProps = {
      to: logo.innerLink,
      tag: Link,
    };
  } else if (logo && logo.outterLink) {
    navbarBrandProps = {
      href: logo.outterLink,
      target: "_blank",
    };
  }
  return (
    <Navbar
      className="navbar-vertical fixed-left navbar-light bg-white"
      expand="md"
      id="sidenav-main"
    >
      <Container fluid>
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleCollapse}
        >
          <span className="navbar-toggler-icon" />
        </button>
        {logo ? (
          <NavbarBrand className="pt-0" {...navbarBrandProps}>
            <img
              alt={logo.imgAlt}
              className="navbar-brand-img"
              src={logo.imgSrc}
            />
          </NavbarBrand>
        ) : null}
        <Nav className="align-items-center d-md-none">
          <UncontrolledDropdown nav>
            <DropdownToggle nav className="nav-link-icon">
              <i className="ni ni-bell-55" />
            </DropdownToggle>
            <DropdownMenu
              aria-labelledby="navbar-default_dropdown_1"
              className="dropdown-menu-arrow"
              right
            >
              <DropdownItem>Action</DropdownItem>
              <DropdownItem>Another action</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>Something else here</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <UncontrolledDropdown nav>
            <DropdownToggle nav>
              <Media className="align-items-center">
                <span className="avatar avatar-sm rounded-circle">
                  <img
                    alt="..."
                    src={require("../../assets/img/theme/team-1-800x800.jpg")}
                    style={{ 
                      width: '32px', 
                      height: '32px', 
                      objectFit: 'cover',
                      backgroundColor: '#f8f9fa',
                      border: '2px solid #e9ecef'
                    }}
                  />
                </span>
              </Media>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-arrow" right>
              <DropdownItem className="noti-title" header tag="div">
                <h6 className="text-overflow m-0">Welcome!</h6>
              </DropdownItem>
              <DropdownItem to="/student/user-profile" tag={Link}>
                <i className="ni ni-single-02" />
                <span>My profile</span>
              </DropdownItem>
              <DropdownItem to="/student/user-profile" tag={Link}>
                <i className="ni ni-settings-gear-65" />
                <span>Settings</span>
              </DropdownItem>
              <DropdownItem to="/student/user-profile" tag={Link}>
                <i className="ni ni-calendar-grid-58" />
                <span>Activity</span>
              </DropdownItem>
              <DropdownItem to="/student/user-profile" tag={Link}>
                <i className="ni ni-support-16" />
                <span>Support</span>
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem href="#pablo" onClick={(e) => e.preventDefault()}>
                <i className="ni ni-user-run" />
                <span>Logout</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
        <Collapse navbar isOpen={collapseOpen}>
          <div className="navbar-collapse-header d-md-none">
            <Row>
              {logo ? (
                <Col className="collapse-brand" xs="6">
                  {logo.innerLink ? (
                    <Link to={logo.innerLink}>
                      <img alt={logo.imgAlt} src={logo.imgSrc} />
                    </Link>
                  ) : (
                    <a href={logo.outterLink}>
                      <img alt={logo.imgAlt} src={logo.imgSrc} />
                    </a>
                  )}
                </Col>
              ) : null}
              <Col className="collapse-close" xs="6">
                <button
                  className="navbar-toggler"
                  type="button"
                  onClick={toggleCollapse}
                >
                  <span />
                  <span />
                </button>
              </Col>
            </Row>
          </div>
          <Nav navbar>{createLinks()}</Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
};

StudentSidebar.propTypes = {
  // ... existing code ...
};

export default StudentSidebar; 