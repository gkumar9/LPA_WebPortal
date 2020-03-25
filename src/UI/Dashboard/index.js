import React, { Component } from "react";
import { Container, Row, Col, Tab, Nav } from "react-bootstrap";
import Header from "../Header/index";
import QATab from "./QAtab.js";
import ExamTab from "./Examtab.js";
const style = {
  textAlign: "center",
  background: "white",
  borderRadius: "2em",
  color: "black",
  padding: " 0.3em 2em",
  letterSpacing: "0.2em"
};
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key: localStorage.getItem("DashboardTabKey")
        ? localStorage.getItem("DashboardTabKey")
        : "first"
    };
  }
  setKey = key => {
    this.setState(
      {
        key: key
      },
      () => {
        localStorage.setItem("DashboardTabKey", key);
      }
    );
  };

  render() {
    return (
      <React.Fragment>
        <Header props={this.props} />
        <Container fluid style={{ width: "auto", background: "#EEEEEE" }}>
          <Tab.Container
            activeKey={this.state.key}
            onSelect={key => this.setKey(key)}
          >
            <Row
              style={{
                padding: "1em 0em",
                boxShadow: "-1px 3px 4px -4px rgba(0, 0, 0, 0.75)",
                zIndex: "99",
                position: "relative"
              }}
            >
              <Col
                lg="1.5"
                style={{
                  margin: "0px 0em 0em 3em"
                }}
              >
                <Nav.Link
                  eventKey="first"
                  style={
                    this.state.key === "first"
                      ? style
                      : {
                          color: "dimgrey",
                          letterSpacing: "0.2em",
                          padding: " 0.3em 2em"
                        }
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
                    this.state.key === "second"
                      ? style
                      : {
                          color: "dimgrey",
                          letterSpacing: "0.2em",
                          padding: " 0.3em 2em"
                        }
                  }
                >
                  <span style={{ fontSize: "larger" }}>Tests</span>
                </Nav.Link>
              </Col>
              <Col></Col>
            </Row>

            <Tab.Content>
              <Tab.Pane eventKey="first">
                <QATab history={this.props.history} />
              </Tab.Pane>
              <Tab.Pane eventKey="second">
                <ExamTab history={this.props.history} />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Container>
      </React.Fragment>
    );
  }
}
export default Dashboard;
