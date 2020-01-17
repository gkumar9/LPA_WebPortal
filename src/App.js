import React from "react";
import Header from "./UI/Header/index.js";
import LoginForm from "./UI/Login/index.js";
import { Container, Row, Col } from "react-bootstrap";
import Login from "./Assets/login.png";
function App() {
  return (
    <div>
      <Header />
      <Container fluid style={{ width: "auto", margin: "1rem" }}>
        <Row>
          <Col lg="8">
            <center style={{'fontWeight':'500','fontSize':'18px'}}>Login to your account</center>
            <img
              src={Login}
              className="rounded mx-auto d-block img-fluid"
              alt="Login"
            />
          </Col>

          <Col>
            <LoginForm />
          </Col>
          <Col lg="1" />
        </Row>
      </Container>
    </div>
  );
}
export default App;
