import React from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import GmailTreeView from "./tree.js";
import "./index.css";
function Dashboard() {
  return (
    <Container fluid style={{ width: "auto" }}>
      <Row>
        <Col
          lg="3"
          style={{
            background: "white",
            height: "90vh",
            paddingLeft: "0em",
            paddingRight: "0em"
          }}
        >
          <GmailTreeView />
        </Col>

        <Col
          style={{ background: "#EEEEEE", height: "90vh", padding: "2.5em" }}
        >
          <Row style={{ margin: "2em 0em" }}>
            <Col
              lg="1.5"
              style={{
                background: "white",
                borderRadius: "2em",
                padding: "0.3em 1.5em",
                letterSpacing: "0.2em"
              }}
            >
              <span style={{ fontSize: "larger" }}>Q&A </span>
            </Col>
            <Col
              style={{
                padding: "0.3em 1.5em"
              }}
            >
              <span style={{ fontSize: "larger", color: "dimgrey" }}>
                Exams
              </span>
            </Col>
          </Row>

          <Row style={{ margin: "2em 0em" }}>
            <Col lg="1.5">
              <Button
                style={{
                  fontSize: "1em",
                  fontWeight: "700",
                  background: "#6AA3FF",
                  borderColor: "#6AA3FF",
                  borderRadius: "0"
                }}
              >
                {" "}
                + Add
              </Button>
            </Col>
            <Col
              style={{
                padding: "0.2em 1.5em"
              }}
            >
              <p
                style={{
                  lineHeight: "1em",
                  color: "dimgrey",
                  fontWeight: "400"
                }}
              >
                Add new and review prevoius question and answers.<br></br>Please
                select the folder you want to access before taking any actions.
              </p>
            </Col>
          </Row>

          <Row style={{ margin: "2em 0em" }}>
            <Col style={{ paddingLeft: "0em", paddingRight: "0em" }}>
              <Form className="searchform">
                <Form.Group controlId="formBasicSearch">
                  <Form.Control
                    type="text"
                    placeholder="&#128269;  Search a question with id number"
                    style={{ padding: "1.5em 2em", borderRadius: "0" }}
                  />
                </Form.Group>
              </Form>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
export default Dashboard;
