import React, { useState, useRef } from "react";
import {
  Card,
  CardBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
  Spinner,
  Row,
  Col
} from "reactstrap";

const defaultAvatar = require("../../assets/img/theme/user-default.svg");

export default function StudentJoinClass() {
  const [classCode, setClassCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  // Get user info from localStorage
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("scms_logged_in_user"));
  } catch (e) {
    user = null;
  }
  const userName = user?.full_name || user?.name || "Student User";
  const userEmail = user?.email || "student@email.com";
  const userAvatar = user?.profile_pic || defaultAvatar;

  React.useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const validateCode = (code) => /^[a-zA-Z0-9]{5,8}$/.test(code);

  const handleInput = (e) => {
    let val = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
    setClassCode(val);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!classCode) {
      setError("Class code is required.");
      return;
    }
    if (!validateCode(classCode)) {
      setError("Class code must be 5–8 alphanumeric characters, no spaces or symbols.");
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      if (classCode === "b7p3r9") {
        setSuccess("You've successfully joined Object-Oriented Programming – BSIT 3A.");
        setTimeout(() => {
          window.location.href = "/student/index#my-classes";
        }, 2000);
      } else if (classCode === "oop321") {
        setError("You are already enrolled in this class.");
      } else {
        setError("Invalid class code or you are already enrolled.");
      }
    }, 1200);
  };

  return (
    <div className="container mt-5 mb-5" style={{ maxWidth: 480 }}>
      <h3 className="mb-4" style={{ fontWeight: 600, fontSize: 20 }}>Join class</h3>
      <Card className="mb-4" style={{ borderRadius: 12, border: '1px solid #e0e0e0' }}>
        <CardBody className="d-flex align-items-center" style={{ padding: 24 }}>
          <img
            src={userAvatar}
            alt="avatar"
            style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", marginRight: 20, border: '1px solid #e0e0e0' }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 15 }}>{userName}</div>
            <div style={{ color: '#666', fontSize: 13 }}>{userEmail}</div>
          </div>
          <Button color="secondary" outline style={{ borderRadius: 24, fontWeight: 500, fontSize: 13, padding: '6px 18px' }} onClick={() => window.location.href = '/auth/login'}>
            Switch account
          </Button>
        </CardBody>
      </Card>
      <Card className="mb-4" style={{ borderRadius: 12, border: '1px solid #e0e0e0' }}>
        <CardBody style={{ padding: 24 }}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>Class code</div>
          <div style={{ color: '#666', fontSize: 13, marginBottom: 18 }}>Ask your teacher for the class code, then enter it here.</div>
          {error && <Alert color="danger" fade>{error}</Alert>}
          {success && <Alert color="success" fade>{success}</Alert>}
          <Form onSubmit={handleSubmit} autoComplete="off">
            <FormGroup>
              <Input
                id="classCode"
                name="classCode"
                type="text"
                placeholder="Class code"
                value={classCode}
                onChange={handleInput}
                autoFocus
                innerRef={inputRef}
                maxLength={8}
                minLength={5}
                required
                style={{ fontSize: 16, padding: '14px 16px', borderRadius: 8, border: '1px solid #bdbdbd', marginBottom: 0 }}
                className={error ? "is-invalid" : ""}
              />
            </FormGroup>
            <div className="d-flex justify-content-end mt-3">
              <Button
                type="button"
                color="link"
                style={{ fontWeight: 500, fontSize: 14, color: '#1976d2', textDecoration: 'none' }}
                onClick={() => (window.location.href = "/student/index")}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                type="submit"
                style={{ fontWeight: 600, fontSize: 14, borderRadius: 8, marginLeft: 8, minWidth: 80 }}
                disabled={loading}
              >
                {loading ? <Spinner size="sm" className="me-2" /> : null}
                Join
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
      <div className="mb-2" style={{ color: '#222', fontWeight: 500, fontSize: 13 }}>To sign in with a class code</div>
      <ul style={{ color: '#444', fontSize: 13, marginBottom: 8, paddingLeft: 22 }}>
        <li>Use an authorized account</li>
        <li>Use a class code with 5-8 letters or numbers, and no spaces or symbols</li>
      </ul>
    </div>
  );
} 