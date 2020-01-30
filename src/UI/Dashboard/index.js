import React, {  useState } from "react";
import { Container, Row, Col, Tab, Nav } from "react-bootstrap";
import Header from "../Header/index";
import QATab from "./QAtab.js";
import ExamTab from "./Examtab.js";

function Dashboard() {
  // render() {
  const [key, setKey] = useState("first");

  const style = {
    textAlign: "center",
    background: "white",
    borderRadius: "2em",
    color:'black',
    padding: " 0.3em 2em",
    letterSpacing: "0.2em"
  };
  return (
    <React.Fragment>
      <Header />
      <Container fluid style={{ width: "auto", background: "#EEEEEE" }}>
        <Tab.Container activeKey={key} onSelect={key => setKey(key)}>
          <Row style={{ padding: "1em 0em" }}>
            <Col lg="3"></Col>
            <Col
              lg="1.5"
              // className="customtabcolor"
              style={{
                margin: "0 2em"
              }}
            >
              <Nav.Link
                eventKey="first"
                style={
                  key === "first"
                    ? style
                    : { color: "dimgrey", letterSpacing: "0.2em",padding: " 0.3em 2em" }
                }
              >
                <span style={{ fontSize: "larger" }}>Q&A </span>
              </Nav.Link>
            </Col>
            <Col
              lg="1.5"
              style={{
                padding: "0 "
              }}
            >
              <Nav.Link
                eventKey="second"
                style={
                  key === "second"
                    ? style
                    : { color: "dimgrey", letterSpacing: "0.2em",padding: " 0.3em 2em" }
                }
              >
                <span style={{ fontSize: "larger" }}>Exams</span>
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
  // }
}
export default Dashboard;
