import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import "./index.css";
function LoginForm() {
  const [validated, setValidated] = useState(false);

  const handleSubmit = event => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };

  return (
    <div className="loginForm">
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group controlId="validationCustom01">
          <Form.Label>Email address</Form.Label>
          <Form.Control required type="email" placeholder="name@example.com" />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="validationCustom02">
          <Form.Label>Password</Form.Label>
          <Form.Control required type="password" />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>

        <Button type="submit" variant="outline-primary loginButton">
          Login
        </Button>
      </Form>
    </div>
  );
}

export default LoginForm;
