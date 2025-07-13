import React, { useState } from "react";
import { Row, Col, Button, Input, Badge } from "reactstrap";

const mockAssignment = {
  id: 7,
  title: "Activity 7",
  due: "Nov 29, 2024, 5:00 PM",
  posted: "Nov 11, 2024",
  teacher: "Christian S. Mallari",
  score: "45/50",
  description: "Draw and explain four levels of text encryption model; each level has different conditions or processes.",
  status: "Graded",
  files: [
    { name: "FERRERAS, Geral...", type: "PDF", preview: "https://via.placeholder.com/60x60?text=PDF" },
    { name: "Page 2.jpg", type: "Image", preview: "https://via.placeholder.com/60x60?text=IMG" },
    { name: "Page 1.jpg", type: "Image", preview: "https://via.placeholder.com/60x60?text=IMG" }
  ]
};

const AssignmentDetailStudent = () => {
  const [classComment, setClassComment] = useState("");
  const [privateComment, setPrivateComment] = useState("");
  return (
    <div style={{ background: "#f7fafd", minHeight: "100vh", padding: 32 }}>
      <Row style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Main Section */}
        <Col md={8} sm={12} style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#ffa726', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 18 }}>
              <i className="ni ni-single-copy-04" style={{ fontSize: 28, color: '#fff' }} />
            </div>
            <div style={{ fontWeight: 700, fontSize: 28 }}>{mockAssignment.title}</div>
            <div style={{ flex: 1 }} />
            <div style={{ color: '#888', fontSize: 15, fontWeight: 500 }}>Due {mockAssignment.due}</div>
            <i className="ni ni-button-power" style={{ fontSize: 20, color: '#888', marginLeft: 18, cursor: 'pointer', opacity: 0.3 }} />
          </div>
          <div style={{ color: '#666', fontSize: 16, marginBottom: 6 }}>{mockAssignment.teacher} • {mockAssignment.posted}</div>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>{mockAssignment.score}</div>
          <div style={{ borderTop: '1px solid #eee', margin: '18px 0' }} />
          <div style={{ fontSize: 16, color: '#444', marginBottom: 18 }}>{mockAssignment.description}</div>
          <div style={{ borderTop: '1px solid #eee', margin: '18px 0' }} />
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8, display: 'flex', alignItems: 'center' }}>
            <i className="ni ni-chat-round" style={{ fontSize: 18, marginRight: 8, color: '#888' }} /> Class comments
          </div>
          <Input
            type="text"
            placeholder="Add a class comment"
            value={classComment}
            onChange={e => setClassComment(e.target.value)}
            style={{ borderRadius: 8, fontSize: 15, padding: '10px 14px', background: '#f7fafd', border: '1px solid #e0e0e0', marginBottom: 8, maxWidth: 400 }}
          />
          <Button color="link" style={{ fontWeight: 500, fontSize: 15, color: '#1976d2', textDecoration: 'none', marginLeft: 8, marginTop: -2, padding: 0 }}>Add a class comment</Button>
        </Col>
        {/* Sidebar */}
        <Col md={4} sm={12}>
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px 0 rgba(44,62,80,.10)', padding: 24, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ fontWeight: 700, fontSize: 18, flex: 1 }}>Your work</div>
              <span style={{ color: '#888', fontWeight: 600, fontSize: 15 }}>{mockAssignment.status}</span>
            </div>
            {mockAssignment.files.map((file, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', background: '#fafbfc', borderRadius: 10, padding: '8px 12px', marginBottom: 10, border: '1px solid #eee' }}>
                <img src={file.preview} alt={file.name} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', marginRight: 12 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 120 }}>{file.name}</div>
                  <div style={{ color: '#888', fontSize: 13 }}>{file.type}</div>
                </div>
                <i className="ni ni-fat-remove" style={{ fontSize: 20, color: '#888', marginLeft: 10, cursor: 'pointer', opacity: 0.7 }} title="Remove" />
              </div>
            ))}
            <Button color="white" style={{ border: '1.5px solid #222', borderRadius: 24, fontWeight: 600, fontSize: 16, color: '#1976d2', width: '100%', margin: '12px 0' }}>
              <span style={{ fontSize: 22, marginRight: 8, color: '#1976d2' }}>+</span> Add or create
            </Button>
            <Button color="secondary" disabled style={{ borderRadius: 24, fontWeight: 600, fontSize: 16, width: '100%', margin: '8px 0 0 0', background: '#e0e0e0', color: '#888', border: 'none' }}>Resubmit</Button>
            <div style={{ color: '#888', fontSize: 13, marginTop: 10 }}>Work cannot be turned in after the due date</div>
          </div>
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px 0 rgba(44,62,80,.10)', padding: 20 }}>
            <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8, display: 'flex', alignItems: 'center' }}>
              <i className="ni ni-chat-round" style={{ fontSize: 18, marginRight: 8, color: '#888' }} /> Private comments
            </div>
            <Input
              type="text"
              placeholder="Add comment to Christian S. Mallari"
              value={privateComment}
              onChange={e => setPrivateComment(e.target.value)}
              style={{ borderRadius: 8, fontSize: 15, padding: '10px 14px', background: '#f7fafd', border: '1px solid #e0e0e0', marginBottom: 8 }}
            />
            <Button color="link" style={{ fontWeight: 500, fontSize: 15, color: '#1976d2', textDecoration: 'none', marginLeft: 0, marginTop: -2, padding: 0 }}>Add comment</Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AssignmentDetailStudent; 