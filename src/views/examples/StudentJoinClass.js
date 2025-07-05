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

export default function StudentJoinClass() {
  const [classCode, setClassCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  React.useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const validateCode = (code) => /^[a-z0-9]{6,10}$/.test(code);

  const handleInput = (e) => {
    let val = e.target.value.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
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
      setError("Class code must be 6–10 alphanumeric characters (lowercase).");
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
    <>
      <div className="header bg-gradient-info pb-6 pt-5 pt-md-7" />
      <div className="container mt--7">
        {/* Centered Form Card */}
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            <Card className="shadow-sm rounded p-0 animate__animated animate__fadeIn">
              <CardBody className="p-4">
                {error && <Alert color="danger" fade>{error}</Alert>}
                {success && <Alert color="success" fade>{success}</Alert>}
                <Form onSubmit={handleSubmit} autoComplete="off">
                  <FormGroup>
                    <Label htmlFor="classCode">Class Code</Label>
                    <Input
                      id="classCode"
                      name="classCode"
                      type="text"
                      placeholder="e.g., b7p3r9"
                      value={classCode}
                      onChange={handleInput}
                      autoFocus
                      innerRef={inputRef}
                      maxLength={10}
                      minLength={6}
                      required
                      className={error ? "is-invalid" : ""}
                    />
                    <small className="form-text text-muted">
                      6–10 lowercase letters or numbers. Example: <b>b7p3r9</b>
                    </small>
                  </FormGroup>
                  <Button
                    color="primary"
                    type="submit"
                    className="w-100 mt-2"
                    disabled={loading}
                    style={{ fontWeight: 600, fontSize: 17 }}
                  >
                    {loading ? <Spinner size="sm" className="me-2" /> : null}
                    Join Class
                  </Button>
                  <Button
                    type="button"
                    color="link"
                    className="d-block w-100 text-center mt-2"
                    onClick={() => (window.location.href = "/student/index")}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </Form>
              </CardBody>
            </Card>
            {/* Optional: Recent Activity */}
            <div className="text-center mt-4">
              <div className="text-muted small mb-1">
                Last joined: <b>OOP – BSIT 3A</b> on June 26, 2025
              </div>
              <a href="/student/index#my-classes" className="btn btn-link p-0">View My Classes</a>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
} 