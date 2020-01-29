import React, { Component } from "react";
import { Container, Row, Col, Tab, Nav } from "react-bootstrap";
import Header from "../Header/index";
import QATab from "./QAtab.js";
import ExamTab from "./Examtab.js";

class Dashboard extends Component {
  render() {
    return (
      <React.Fragment>
        <Header />
        <Container fluid style={{ width: "auto",background: "#EEEEEE" }}>
          <Tab.Container defaultActiveKey="first">
            <Row style={{ padding: "1em 0em", background: "#EEEEEE" }}>
              <Col lg="3"></Col>
              <Col
                lg="1.5"
                className="customtabcolor"
                style={{
                  margin: "0 2em"
                }}
              >
                <Nav.Link eventKey="first">
                  <span style={{ fontSize: "larger" }}>Q&A </span>
                </Nav.Link>
              </Col>
              <Col
                lg="1.5"
                style={{
                  padding: "0.3em 1.5em"
                }}
              >
                <Nav.Link eventKey="second">
                  <span style={{ fontSize: "larger", color: "dimgrey" }}>
                    Exams
                  </span>
                </Nav.Link>
              </Col>
              <Col></Col>
            </Row>

            <Tab.Content>
              <Tab.Pane eventKey="first">
                <QATab />
              </Tab.Pane>
              <Tab.Pane eventKey="second">
                <ExamTab />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Container>
      </React.Fragment>
    );
  }
}
export default Dashboard;
