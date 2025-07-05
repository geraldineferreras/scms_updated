import React, { useState } from "react";
import {
  Card, CardBody, CardHeader, Table, Input, Row, Col, Button, Badge, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, InputGroup, InputGroupAddon, InputGroupText, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Alert
} from "reactstrap";
import { FaSearch, FaLock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Header from "components/Headers/Header.js";

// Mock users
const mockUsers = [
  {
    id: 1,
    name: "Juan Dela Cruz",
    email: "juan.delacruz@school.com",
    role: "teacher",
    status: "active",
    avatar: require("../../assets/img/theme/team-1-800x800.jpg"),
    allowedModules: ["Dashboard", "Classroom", "Materials", "Assignments", "Attendance"]
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria.santos@school.com",
    role: "student",
    status: "active",
    avatar: require("../../assets/img/theme/team-2-800x800.jpg"),
    allowedModules: ["Dashboard", "Materials", "Assignments", "Grades"]
  },
  {
    id: 3,
    name: "Admin User",
    email: "admin@school.com",
    role: "admin",
    status: "active",
    avatar: require("../../assets/img/theme/team-3-800x800.jpg"),
    allowedModules: [
      "Dashboard", "User Management", "Section Management", "Subject Management", "Offerings Management", "Reports & Logs", "Access Control"
    ]
  },
  {
    id: 4,
    name: "Inactive Teacher",
    email: "inactive.teacher@school.com",
    role: "teacher",
    status: "inactive",
    avatar: require("../../assets/img/theme/team-4-800x800.jpg"),
    allowedModules: ["Dashboard"]
  }
];

// System modules
const systemModules = [
  { key: "Dashboard", desc: "Access to dashboard and overview widgets." },
  { key: "User Management", desc: "Manage user accounts and permissions." },
  { key: "Section Management", desc: "Manage sections." },
  { key: "Subject Management", desc: "Manage subjects." },
  { key: "Offerings Management", desc: "Manage offerings." },
  { key: "Reports & Logs", desc: "View reports and audit logs." },
  { key: "Access Control", desc: "Manage access control." },
  { key: "Classroom", desc: "View and manage classroom details." },
  { key: "Announcements", desc: "Post and view announcements." },
  { key: "Materials", desc: "Upload and access learning materials." },
  { key: "Assignments", desc: "Create and submit assignments." },
  { key: "Attendance", desc: "Record and view attendance." },
  { key: "Recitation & Grades", desc: "Manage and view grades." },
  { key: "Excuse Management", desc: "Submit and review excuse letters." },
  { key: "Notifications", desc: "Receive system notifications." }
];

// Define allowed modules per role
const roleModules = {
  admin: [
    "Dashboard",
    "User Management",
    "Section Management",
    "Subject Management",
    "Offerings Management",
    "Reports & Logs",
    "Access Control"
  ],
  teacher: [
    "Dashboard",
    "Classroom",
    "Announcements",
    "Materials",
    "Assignments",
    "Submissions",
    "Attendance",
    "Recitation & Grades",
    "Excuse Management"
  ],
  student: [
    "Dashboard",
    "Join Class",
    "Announcements",
    "Materials",
    "Assignments",
    "Submissions",
    "Attendance",
    "Grades",
    "Excuse Letters",
    "Notifications"
  ]
};

const roleBadge = (role) => {
  if (role === "admin") return <Badge color="primary">Admin</Badge>;
  if (role === "teacher") return <Badge color="success">Teacher</Badge>;
  if (role === "student") return <Badge color="warning">Student</Badge>;
  return <Badge color="secondary">Unknown</Badge>;
};
const statusBadge = (status) => (
  status === "active"
    ? <Badge color="success">Active</Badge>
    : <Badge color="secondary">Inactive</Badge>
);

// Floating effect for content over header
const accessControlStyles = `
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

export default function AccessControl() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [modal, setModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [moduleToggles, setModuleToggles] = useState([]);
  const [saveStatus, setSaveStatus] = useState(null); // { type: 'success'|'error', msg: string }
  const [modifiedUsers, setModifiedUsers] = useState([]);

  // Filter users
  const filteredUsers = mockUsers.filter(u =>
    (roleFilter === "" || u.role === roleFilter) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  // Open modal and set toggles
  const handleManageAccess = (user) => {
    setSelectedUser(user);
    setModuleToggles(systemModules.map(m => user.allowedModules.includes(m.key)));
    setModal(true);
    setSaveStatus(null);
  };

  // Toggle module access
  const handleToggle = (idx) => {
    setModuleToggles(toggles => toggles.map((t, i) => i === idx ? !t : t));
  };

  // Save changes
  const handleSave = () => {
    if (selectedUser.role === "admin") {
      setSaveStatus({ type: "error", msg: "Admin access is system-wide and cannot be changed." });
      return;
    }
    if (!moduleToggles.some(Boolean)) {
      setSaveStatus({ type: "error", msg: "This user will lose access to all modules." });
      return;
    }
    // Simulate save
    setSaveStatus({ type: "success", msg: `Access permissions updated for ${selectedUser.name}` });
    if (!modifiedUsers.includes(selectedUser.id)) {
      setModifiedUsers([...modifiedUsers, selectedUser.id]);
    }
    setTimeout(() => setModal(false), 1200);
  };

  // Cancel changes
  const handleCancel = () => {
    setModal(false);
    setSaveStatus(null);
  };

  // Count enabled modules
  const enabledCount = moduleToggles.filter(Boolean).length;

  return (
    <>
      <style>{accessControlStyles}</style>
      <Header showStats={false} />
      <div className="section-content-container">
        <Card className="shadow-sm rounded-lg section-content-card">
          <CardHeader style={{ background: "#fff", color: "#22336b", fontWeight: 700, fontSize: 22, letterSpacing: 1, borderRadius: "0.5rem 0.5rem 0 0" }}>
            Access Control
            <span className="float-right" style={{ fontSize: 16, fontWeight: 400 }}>
              {modifiedUsers.length > 0 && <Badge color="info">{modifiedUsers.length} user(s) with modified permissions</Badge>}
            </span>
          </CardHeader>
          <CardBody>
            <Row className="mb-3 align-items-center">
              <Col md={6} className="mb-2 mb-md-0">
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText><FaSearch /></InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={3} className="mb-2 mb-md-0">
                <Input type="select" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
                  <option value="">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="teacher">Teacher</option>
                  <option value="student">Student</option>
                </Input>
              </Col>
              <Col md={3} className="text-md-right">
                <span className="text-muted" style={{ fontSize: 15 }}>
                  Total Users: <b>{filteredUsers.length}</b>
                </span>
              </Col>
            </Row>
            <div className="table-responsive">
              <Table className="align-items-center table-flush table-hover" bordered>
                <thead className="thead-light">
                  <tr>
                    <th>Profile</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr><td colSpan={5} className="text-center text-muted">No users found.</td></tr>
                  ) : filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td className="d-flex align-items-center">
                        <img src={user.avatar} alt={user.name} style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover", marginRight: 12 }} />
                        <span style={{ fontWeight: 600 }}>{user.name}</span>
                      </td>
                      <td>{user.email}</td>
                      <td>{roleBadge(user.role)}</td>
                      <td>{statusBadge(user.status)}</td>
                      <td>
                        <Button color="info" size="sm" onClick={() => handleManageAccess(user)}>
                          <FaLock className="mr-1" /> Manage Access
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </CardBody>
        </Card>
      </div>
      {/* Manage Access Modal */}
      <Modal isOpen={modal} toggle={handleCancel} size="md" centered scrollable>
        <ModalHeader toggle={handleCancel} style={{ fontWeight: 700, fontSize: 20 }}>
          Manage Access
        </ModalHeader>
        <ModalBody style={{ paddingTop: 0 }}>
          {selectedUser && (
            <>
              <div className="mb-3">
                <div className="d-flex align-items-center mb-2">
                  <img src={selectedUser.avatar} alt={selectedUser.name} style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", marginRight: 16 }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 18 }}>{selectedUser.name}</div>
                    <div className="text-muted" style={{ fontSize: 15 }}>{selectedUser.email}</div>
                    <div className="mt-1">{roleBadge(selectedUser.role)}</div>
                  </div>
                </div>
              </div>
              <div className="mb-2" style={{ fontWeight: 600, fontSize: 16 }}>Module Access</div>
              <div style={{ maxHeight: 320, overflowY: "auto" }}>
                {(selectedUser ? systemModules.filter(mod => roleModules[selectedUser.role]?.includes(mod.key)) : []).map((mod, idx) => (
                  <div key={mod.key} className="d-flex align-items-center justify-content-between mb-2 p-2" style={{ background: idx % 2 === 0 ? "#f8fafd" : "#fff", borderRadius: 8 }}>
                    <div>
                      <span style={{ fontWeight: 500 }}>{mod.key}</span>
                      <span className="text-muted ml-2" style={{ fontSize: 13 }}>{mod.desc}</span>
                    </div>
                    <div>
                      <label className="switch mb-0">
                        <input
                          type="checkbox"
                          checked={moduleToggles[roleModules[selectedUser.role].indexOf(mod.key)] || false}
                          onChange={() => handleToggle(roleModules[selectedUser.role].indexOf(mod.key))}
                          disabled={selectedUser.role === "admin"}
                        />
                        <span className="slider round" style={{ background: moduleToggles[roleModules[selectedUser.role].indexOf(mod.key)] ? "#2dce89" : "#adb5bd" }}></span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              {saveStatus && (
                <Alert color={saveStatus.type === "success" ? "success" : "danger"} className="text-center py-2">
                  {saveStatus.msg}
                </Alert>
              )}
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSave} disabled={selectedUser && selectedUser.role === "admin"}>
            Save Changes
          </Button>
          <Button color="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Toggle Switch Styles */}
      <style>{`
        .switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
        }
        .switch input { display: none; }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0; left: 0; right: 0; bottom: 0;
          background: #adb5bd;
          transition: .4s;
          border-radius: 24px;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }
        input:checked + .slider {
          background: #2dce89;
        }
        input:checked + .slider:before {
          transform: translateX(20px);
        }
      `}</style>
    </>
  );
} 