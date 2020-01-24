import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import LoginImage from "./../../Assets/login.png";
import Header from "../Header/index";

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
function Login() {
  return (
    
    <React.Fragment>  
    <Header/>
    <Container fluid style={{ width: "auto", margin: "1rem" }}>
      <Row>
        <Col lg="8">
          <center style={{ fontWeight: "500", fontSize: "18px" }}>
            Login to your account
          </center>
          <img
            src={LoginImage}
            className="rounded mx-auto d-block img-fluid"
            alt="Login"
          />
        </Col>

        <Col>
          <LoginForm />
        </Col>
        <Col lg="1" />
      </Row>
    </Container></React.Fragment>
  );
}

export default Login;
