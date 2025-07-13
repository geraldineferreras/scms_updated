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
import { useState } from "react";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
  CardTitle,
  CardText,
  Input,
  Media,
  Badge,
  ListGroup,
  ListGroupItem,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from "reactstrap";
import { FaBook, FaClipboardList, FaCheckCircle, FaGraduationCap, FaBell, FaUserCheck, FaPlus, FaEnvelope, FaCalendarAlt, FaArrowUp, FaArrowDown, FaSearch } from "react-icons/fa";

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
} from "variables/charts.js";

import Header from "components/Headers/Header.js";

const mockTeacher = {
  name: "Jessica Jones",
  photo: require("../assets/img/theme/team-4-800x800.jpg"),
  semester: "1st Semester",
  year: "2023-2024"
};
const mockStats = {
  totalClasses: 4,
  totalStudents: 120,
  attendanceToday: 2,
  pendingExcuses: 3,
  gradedAssignments: 8,
  ungradedAssignments: 2
};
const mockClasses = [
  { id: 1, name: "OOP", section: "3A", subject: "Object Oriented Programming", code: "b7p3r9" },
  { id: 2, name: "Data Structures", section: "2B", subject: "Data Structures", code: "a1c2d3" },
  { id: 3, name: "Web Dev", section: "1C", subject: "Web Development", code: "z8y7x6" },
  { id: 4, name: "Discrete Math", section: "4D", subject: "Discrete Mathematics", code: "d4m4th" }
];
const mockAttendance = [
  { id: 1, class: "OOP - 3A", time: "8:00 AM", status: "Not Started" },
  { id: 2, class: "Web Dev - 1C", time: "10:00 AM", status: "Ongoing" }
];
const mockAnnouncements = [
  { id: 1, title: "Welcome to OOP!", date: "2024-06-01" },
  { id: 2, title: "Assignment 1 Posted", date: "2024-06-02" }
];
const mockPendingTasks = [
  { id: 1, type: "Assignment", desc: "Grade Assignment 1 (OOP - 3A)" },
  { id: 2, type: "Excuse Letter", desc: "Review Excuse (Web Dev - 1C)" },
  { id: 3, type: "Attendance", desc: "Mark attendance (Data Structures - 2B)" }
];
const quickActions = [
  { icon: "ni ni-fat-add text-success", label: "Create a Class" },
  { icon: "ni ni-bell-55 text-info", label: "Post Announcement" },
  { icon: "ni ni-archive-2 text-orange", label: "Upload Material" },
  { icon: "ni ni-bullet-list-67 text-red", label: "Create Assignment" },
  { icon: "ni ni-chart-bar-32 text-yellow", label: "Record Grades" }
];

const studentName = "Alex Thompson";
const summary = [
  {
    label: "Total Classes",
    value: 5,
    icon: <FaBook />, 
    color: "#2096ff",
    trend: { up: true, value: "3.2%", text: "Since last month" }
  },
  {
    label: "Assignments Due",
    value: 2,
    icon: <FaClipboardList />, 
    color: "#2dce89",
    trend: { up: false, value: "-1.1%", text: "Since last week" }
  },
  {
    label: "Attendance",
    value: "92%",
    icon: <FaCheckCircle />, 
    color: "#11cdef",
    trend: { up: true, value: "1.5%", text: "Since last month" }
  },
  {
    label: "Recent Grades",
    value: "89% Avg",
    icon: <FaGraduationCap />, 
    color: "#5e72e4",
    trend: { up: true, value: "0.8%", text: "Since last week" }
  }
];
const myClasses = [
  { id: 1, subject: "Object-Oriented Programming", code: "b7p3r9", teacher: "Mr. Cruz", section: "BSIT 3A" },
  { id: 2, subject: "Database Management Systems", code: "a1c2d3", teacher: "Ms. Santos", section: "BSCS 2B" },
  { id: 3, subject: "Web Development", code: "z8y7x6", teacher: "Mr. Lee", section: "BSIT 1C" },
  { id: 4, subject: "Discrete Mathematics", code: "d4m4th", teacher: "Ms. Garcia", section: "BSIT 4D" },
  { id: 5, subject: "Software Engineering", code: "s0fteng", teacher: "Dr. Smith", section: "BSIT 3A" }
];
const announcements = [
  { id: 1, class: "Object-Oriented Programming", date: "2024-07-01", content: "Quiz 2 will be held on Friday. Please review chapters 3 and 4.", isNew: true },
  { id: 2, class: "Database Management Systems", date: "2024-06-29", content: "Project proposal deadline extended to July 5.", isNew: false },
  { id: 3, class: "Web Development", date: "2024-06-28", content: "Lab 3 results are now posted. Check your grades.", isNew: false }
];
const quickLinks = [
  { icon: <FaGraduationCap />, label: "View Grades", href: "/student/grades" },
  { icon: <FaEnvelope />, label: "Submit Excuse Letter", href: "/student/excuse-letters" },
  { icon: <FaPlus />, label: "Join a Class", href: "/student/join-class" },
  { icon: <FaUserCheck />, label: "My Attendance", href: "/student/attendance" },
  { icon: <FaBell />, label: "Notifications", href: "/student/notifications" }
];

function getCurrentDateTime() {
  const now = new Date();
  return now.toLocaleString();
}

// Mock chart (static SVG line chart)
function TrendChart() {
  return (
    <svg width="100%" height="160" viewBox="0 0 400 160">
      <rect x="0" y="0" width="400" height="160" rx="16" fill="#232b4d" />
      <polyline
        fill="none"
        stroke="#5e72e4"
        strokeWidth="4"
        points="20,140 70,120 120,100 170,110 220,80 270,60 320,40 380,30"
      />
      <text x="30" y="30" fill="#fff" fontSize="18" fontWeight="bold">Attendance Trend</text>
    </svg>
  );
}

const Index = (props) => {
  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");
  const user = JSON.parse(localStorage.getItem("scms_logged_in_user") || "null");

  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    setChartExample1Data("data" + index);
  };

  // Admin dashboard (default Argon)
  if (user && user.role === "admin") {
    return (
      <>
        <Header />
        {/* Blue Header Background */}
        <div className="header bg-gradient-info pb-8 pt-5 pt-md-9"></div>
        {/* Page content */}
        <Container className="mt--9" fluid>
          <Row>
            <Col className="mb-5 mb-xl-0" xl="8">
              <Card className="bg-gradient-default shadow">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-light ls-1 mb-1">
                        Overview
                      </h6>
                      <h2 className="text-white mb-0">Sales value</h2>
                    </div>
                    <div className="col">
                      <Nav className="justify-content-end" pills>
                        <NavItem>
                          <NavLink
                            className={classnames("py-2 px-3", {
                              active: activeNav === 1,
                            })}
                            href="#pablo"
                            onClick={(e) => toggleNavs(e, 1)}
                          >
                            <span className="d-none d-md-block">Month</span>
                            <span className="d-md-none">M</span>
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={classnames("py-2 px-3", {
                              active: activeNav === 2,
                            })}
                            data-toggle="tab"
                            href="#pablo"
                            onClick={(e) => toggleNavs(e, 2)}
                          >
                            <span className="d-none d-md-block">Week</span>
                            <span className="d-md-none">W</span>
                          </NavLink>
                        </NavItem>
                      </Nav>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  {/* Chart */}
                  <div className="chart">
                    <Line
                      data={chartExample1[chartExample1Data]}
                      options={chartExample1.options}
                      getDatasetAtEvent={(e) => console.log(e)}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl="4">
              <Card className="shadow">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted ls-1 mb-1">
                        Performance
                      </h6>
                      <h2 className="mb-0">Total orders</h2>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  {/* Chart */}
                  <div className="chart">
                    <Bar
                      data={chartExample2.data}
                      options={chartExample2.options}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row className="mt-5">
            <Col className="mb-5 mb-xl-0" xl="8">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row className="align-items-center">
                    <div className="col">
                      <h3 className="mb-0">Page visits</h3>
                    </div>
                    <div className="col text-right">
                      <Button
                        color="primary"
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                        size="sm"
                      >
                        See all
                      </Button>
                    </div>
                  </Row>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Page name</th>
                      <th scope="col">Visitors</th>
                      <th scope="col">Unique users</th>
                      <th scope="col">Bounce rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">/argon/</th>
                      <td>4,569</td>
                      <td>340</td>
                      <td>
                        <i className="fas fa-arrow-up text-success mr-3" /> 46,53%
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">/argon/index.html</th>
                      <td>3,985</td>
                      <td>319</td>
                      <td>
                        <i className="fas fa-arrow-down text-warning mr-3" />{" "}
                        46,53%
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">/argon/charts.html</th>
                      <td>3,513</td>
                      <td>294</td>
                      <td>
                        <i className="fas fa-arrow-down text-warning mr-3" />{" "}
                        36,49%
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">/argon/tables.html</th>
                      <td>2,050</td>
                      <td>147</td>
                      <td>
                        <i className="fas fa-arrow-up text-success mr-3" /> 50,87%
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">/argon/profile.html</th>
                      <td>1,795</td>
                      <td>190</td>
                      <td>
                        <i className="fas fa-arrow-down text-danger mr-3" />{" "}
                        46,53%
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Card>
            </Col>
            <Col xl="4">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row className="align-items-center">
                    <div className="col">
                      <h3 className="mb-0">Social traffic</h3>
                    </div>
                    <div className="col text-right">
                      <Button
                        color="primary"
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                        size="sm"
                      >
                        See all
                      </Button>
                    </div>
                  </Row>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Referral</th>
                      <th scope="col">Visitors</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">Facebook</th>
                      <td>1,480</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="mr-2">60%</span>
                          <div>
                            <Progress
                              max="100"
                              value="60"
                              barClassName="bg-gradient-danger"
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Facebook</th>
                      <td>5,480</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="mr-2">70%</span>
                          <div>
                            <Progress
                              max="100"
                              value="70"
                              barClassName="bg-gradient-success"
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Google</th>
                      <td>4,807</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="mr-2">80%</span>
                          <div>
                            <Progress max="100" value="80" />
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Instagram</th>
                      <td>3,678</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="mr-2">75%</span>
                          <div>
                            <Progress
                              max="100"
                              value="75"
                              barClassName="bg-gradient-info"
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">twitter</th>
                      <td>2,645</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="mr-2">30%</span>
                          <div>
                            <Progress
                              max="100"
                              value="30"
                              barClassName="bg-gradient-warning"
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }

  // Teacher dashboard
  if (user && user.role === "teacher") {
    return (
      <>
        {/* Argon-style header without personal info */}
        <div className="header bg-gradient-info pb-8 pt-5 pt-md-9"></div>
        <Container className="mt--9" fluid>
          {/* Overview Cards */}
          <Row>
            {[
              { label: "Total Classes", value: mockStats.totalClasses, icon: "ni ni-books text-primary" },
              { label: "Total Students", value: mockStats.totalStudents, icon: "ni ni-hat-3 text-info" },
              { label: "Attendance Today", value: mockStats.attendanceToday, icon: "ni ni-check-bold text-success" },
              { label: "Pending Excuses", value: mockStats.pendingExcuses, icon: "ni ni-single-copy-04 text-warning" },
              { label: "Graded", value: mockStats.gradedAssignments, icon: "ni ni-check-bold text-success" },
              { label: "Ungraded", value: mockStats.ungradedAssignments, icon: "ni ni-time-alarm text-danger" }
            ].map((stat, idx) => (
              <Col lg="2" md="4" sm="6" xs="12" className="mb-4" key={idx}>
                <Card className="shadow d-flex align-items-center justify-content-center" style={{ minHeight: 110 }}>
                  <CardBody className="w-100 d-flex flex-column align-items-center justify-content-center p-3">
                    <div className="mb-2"><i className={stat.icon} style={{ fontSize: 28 }}></i></div>
                    <div className="text-uppercase text-muted font-weight-bold small text-center">{stat.label}</div>
                    <h2 className="mb-0 text-center">{stat.value}</h2>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
          {/* My Classes & Quick Actions */}
          <Row>
            <Col lg="8" className="mb-4">
              <Card className="shadow" style={{ minHeight: 420 }}>
                <CardHeader>
                  <h3 className="mb-0">My Classes</h3>
                </CardHeader>
                <CardBody>
                  <Row>
                    {mockClasses.map(cls => (
                      <Col md="6" key={cls.id} className="mb-3">
                        <Card className="border">
                          <CardBody>
                            <h5>{cls.subject} <span className="text-muted">({cls.section})</span></h5>
                            <div className="mb-2"><strong>Class Code:</strong> <span className="text-primary font-weight-bold">{cls.code}</span></div>
                            <Button color="primary" size="sm">View Class</Button>
                          </CardBody>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col lg="4" className="mb-4">
              <Card className="shadow" style={{ minHeight: 420 }}>
                <CardHeader>
                  <h3 className="mb-0">Quick Actions</h3>
                </CardHeader>
                <CardBody>
                  <Row>
                    {quickActions.map((action, idx) => (
                      <Col xs="12" className="mb-2" key={idx}>
                        <Button color="secondary" className="w-100 text-left">
                          <i className={action.icon + " mr-2"}></i> {action.label}
                        </Button>
                      </Col>
                    ))}
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
          {/* Today's Attendance, Announcements, Pending Tasks */}
          <Row>
            <Col lg="4" className="mb-4">
              <Card className="shadow" style={{ minHeight: 320 }}>
                <CardHeader>
                  <h3 className="mb-0">Today's Attendance</h3>
                </CardHeader>
                <CardBody>
                  {mockAttendance.map(att => (
                    <div key={att.id} className="mb-3">
                      <div><strong>{att.class}</strong> <span className="text-muted">({att.time})</span></div>
                      <div>Status: <span className="font-weight-bold">{att.status}</span></div>
                      <Button color="info" size="sm" className="mr-2">Start Session</Button>
                      <Button color="success" size="sm">Scan QR</Button>
                    </div>
                  ))}
                </CardBody>
              </Card>
            </Col>
            <Col lg="4" className="mb-4">
              <Card className="shadow" style={{ minHeight: 320 }}>
                <CardHeader className="d-flex justify-content-between align-items-center">
                  <h3 className="mb-0">Recent Announcements</h3>
                  <Button color="info" size="sm">+ New</Button>
                </CardHeader>
                <CardBody>
                  {mockAnnouncements.map(ann => (
                    <div key={ann.id} className="mb-2">
                      <div className="font-weight-bold">{ann.title}</div>
                      <div className="text-muted small">{ann.date}</div>
                    </div>
                  ))}
                </CardBody>
              </Card>
            </Col>
            <Col lg="4" className="mb-4">
              <Card className="shadow" style={{ minHeight: 320 }}>
                <CardHeader>
                  <h3 className="mb-0">Pending Tasks</h3>
                </CardHeader>
                <CardBody>
                  {mockPendingTasks.map(task => (
                    <div key={task.id} className="mb-2">
                      <span className="badge badge-pill badge-primary mr-2">{task.type}</span>
                      {task.desc}
                    </div>
                  ))}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }

  // Student dashboard
  if (user && user.role === "student") {
    return (
      <div className="container-fluid p-0" style={{ position: 'relative' }}>
        {/* Blue Gradient Header Background */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100vw',
          height: 180,
          background: 'linear-gradient(90deg, #1cb5e0 0%, #2096ff 100%)',
          zIndex: 1
        }} />
        {/* Spacer to push content below header */}
        <div style={{ height: 180, width: '100%' }} />
        {/* Dashboard Content */}
        <div style={{ position: 'relative', zIndex: 2, marginTop: -110, marginLeft: 0, marginRight: 0, paddingLeft: 0, paddingRight: 0 }}>
          {/* Summary Cards */}
          <Row className="mb-4" style={{ gap: 0, marginLeft: 0, marginRight: 0 }}>
            {summary.map((card, idx) => (
              <Col key={idx} xl={3} md={6} xs={12} className="mb-4">
                <Card className="shadow-sm rounded-lg h-100" style={{ border: 'none' }}>
                  <CardBody className="d-flex align-items-center justify-content-between" style={{ minHeight: 110 }}>
                    <div>
                      <div className="text-uppercase text-muted mb-1" style={{ fontSize: 13, fontWeight: 700 }}>{card.label}</div>
                      <div style={{ fontSize: 28, fontWeight: 700, color: '#232b4d' }}>{card.value}</div>
                      <div className="d-flex align-items-center" style={{ fontSize: 13, fontWeight: 500 }}>
                        {card.trend.up ? <FaArrowUp color="#2dce89" className="mr-1" /> : <FaArrowDown color="#f5365c" className="mr-1" />}
                        <span style={{ color: card.trend.up ? '#2dce89' : '#f5365c' }}>{card.trend.value}</span>
                        <span className="ml-2 text-muted">{card.trend.text}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: 38, background: card.color + '22', color: card.color, borderRadius: 12, padding: 12 }}>
                      {card.icon}
                    </div>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
          {/* Chart + Announcements/Quick Access */}
          <Row className="mb-4">
            <Col xl={8} md={7} xs={12} className="mb-4">
              <Card className="shadow-sm rounded-lg h-100" style={{ border: 'none', background: '#232b4d' }}>
                <CardBody>
                  <div className="text-white text-uppercase mb-2" style={{ fontWeight: 700, fontSize: 15 }}>Overview</div>
                  <div className="text-white mb-3" style={{ fontWeight: 700, fontSize: 22 }}>Attendance Trend</div>
                  <TrendChart />
                </CardBody>
              </Card>
            </Col>
            <Col xl={4} md={5} xs={12} className="mb-4">
              <Card className="shadow-sm rounded-lg h-100" style={{ border: 'none' }}>
                <CardHeader className="bg-white border-0" style={{ fontWeight: 700, fontSize: 18 }}>Quick Access</CardHeader>
                <CardBody>
                  <Row>
                    {quickLinks.map((q, i) => (
                      <Col md={12} xs={6} key={i} className="mb-3 text-center">
                        <Button color="primary" outline block href={q.href} style={{ borderRadius: 10, fontWeight: 600, fontSize: 15, padding: '12px 0' }}>
                          <div style={{ fontSize: 22, marginBottom: 4 }}>{q.icon}</div>
                          <div>{q.label}</div>
                        </Button>
                      </Col>
                    ))}
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
          {/* My Classes + Announcements Feed */}
          <Row className="mb-4">
            <Col xl={7} md={6} xs={12} className="mb-4">
              <Card className="shadow-sm rounded-lg h-100" style={{ border: 'none' }}>
                <CardHeader className="bg-white border-0 d-flex justify-content-between align-items-center" style={{ fontWeight: 700, fontSize: 18 }}>
                  My Classes
                  <Button color="link" size="sm" style={{ color: '#2096ff', fontWeight: 600 }} href="#">See all</Button>
                </CardHeader>
                <CardBody style={{ paddingTop: 0 }}>
                  {myClasses.length === 0 ? (
                    <div className="text-center text-muted">You haven't joined any classes</div>
                  ) : (
                    <Table responsive borderless className="align-items-center">
                      <thead>
                        <tr>
                          <th>Subject</th>
                          <th>Code</th>
                          <th>Teacher</th>
                          <th>Section</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {myClasses.map(cls => (
                          <tr key={cls.id}>
                            <td className="font-weight-bold text-capitalize">{cls.subject}</td>
                            <td><span className="text-primary font-weight-bold">{cls.code}</span></td>
                            <td>{cls.teacher}</td>
                            <td>{cls.section}</td>
                            <td><Button color="primary" size="sm" href={`/student/classroom?code=${cls.code}`}>View</Button></td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </CardBody>
              </Card>
            </Col>
            <Col xl={5} md={6} xs={12} className="mb-4">
              <Card className="shadow-sm rounded-lg h-100" style={{ border: 'none' }}>
                <CardHeader className="bg-white border-0 d-flex justify-content-between align-items-center" style={{ fontWeight: 700, fontSize: 18 }}>
                  Latest Announcements
                  <Button color="link" size="sm" style={{ color: '#2096ff', fontWeight: 600 }} href="#">See all</Button>
                </CardHeader>
                <CardBody style={{ maxHeight: 320, overflowY: 'auto', paddingTop: 0 }}>
                  {announcements.length === 0 ? (
                    <div className="text-center text-muted">No announcements yet</div>
                  ) : (
                    <ListGroup flush>
                      {announcements.map(a => (
                        <ListGroupItem key={a.id} className="d-flex align-items-start justify-content-between" style={{ borderLeft: a.isNew ? '4px solid #2096ff' : '4px solid #e9ecef', background: a.isNew ? '#f3f8ff' : '#fff' }}>
                          <div>
                            <div className="font-weight-bold text-primary" style={{ fontSize: 16 }}>{a.class}</div>
                            <div className="text-muted small mb-1"><FaCalendarAlt className="mr-1" /> {a.date}</div>
                            <div style={{ fontSize: 15 }}>{a.content.length > 80 ? a.content.slice(0, 80) + '...' : a.content}</div>
                          </div>
                          <div className="ml-3 d-flex flex-column align-items-end">
                            {a.isNew && <Badge color="info" pill className="mb-2">NEW</Badge>}
                            <Button color="link" size="sm" style={{ color: '#2096ff', fontWeight: 600 }} href="#">View</Button>
                          </div>
                        </ListGroupItem>
                      ))}
                    </ListGroup>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    );
  }

  // Default (not logged in or unknown role)
  return (
    <div className="py-5 text-center">
      <h2>Welcome!</h2>
      <p>Please log in to view your dashboard.</p>
    </div>
  );
};

export default Index;
