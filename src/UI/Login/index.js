import React, { Component } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import LoginImage from "./../../Assets/login.png";
import Header from "../Header/headerlogin";
import { withRouter } from "react-router-dom";
import firebase from "./../../firebaseApp.js";

import "./index.css";
class LoginForm extends Component {
  constructor() {
    super();
    this.state = { validated: false };
  }
  Submit = event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.setState({ validated: true });
    this.props.handleSubmit();
  };

  render() {
    return (
      <div className="loginForm">
        <Form
          noValidate
          validated={this.state.validated}
          onSubmit={this.Submit}
        >
          <Form.Group controlId="validationCustom01">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              required
              type="email"
              placeholder="name@example.com"
              value={this.props.email}
              onChange={this.props.handleChange("email")}
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="validationCustom02">
            <Form.Label>Password</Form.Label>
            <Form.Control
              required
              type="password"
              value={this.props.password}
              onChange={this.props.handleChange("password")}
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>

          <Button type="submit" variant="outline-primary loginButton" style={{marginTop:'0.5em'}}>
            Login
          </Button>
        </Form>
      </div>
    );
  }
}
class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      error: null,
      loading:false
    };
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged(authenticated => {
      authenticated ? this.props.history.push("/") : console.log('not authenticated');
    });
  }

  handleSubmit = () => {
    const { email, password } = this.state;
    this.setState({ loading: 'Please wait ...' });
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((user ,res)=> {
        console.log('user and res',user,res);
        this.props.history.push("/");
      })
      .catch(error => {
        this.setState({ error: error ,loading: null});
      });
  };

  handleChange = key => e => {
    this.setState({ [key]: e.target.value });
  };
  render() {
    return (
      <React.Fragment>
        <Header />
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
              {this.state.error ? (
                <Container>
                  <div>
                    <h5>{this.state.error.message}</h5>
                  </div>
                </Container>
              ) : null}
              <LoginForm
                email={this.state.email}
                password={this.state.password}
                handleChange={this.handleChange}
                handleSubmit={this.handleSubmit}
              />
              {this.state.loading ? (
                <Container>
                  <div>
                    <h5>{this.state.loading}</h5>
                  </div>
                </Container>
              ) : null}
            </Col>
            <Col lg="1" />
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

export default withRouter(Login);
