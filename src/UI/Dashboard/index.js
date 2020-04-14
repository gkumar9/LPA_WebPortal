import React, { Component } from "react";
import { Container, Row, Col, Tab, Nav } from "react-bootstrap";
import Header from "../Header/index";
import QATab from "./QAtab.js";
import ExamTab from "./Examtab.js";
import URL from "../../Assets/url";
import axios from "axios";
const style = {
  textAlign: "center",
  background: "white",
  borderRadius: "2em",
  color: "black",
  padding: " 0.3em 2em",
  letterSpacing: "0.2em",
};
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key: localStorage.getItem("DashboardTabKey")
        ? localStorage.getItem("DashboardTabKey")
        : "first",
      authorList: [],
      userList: [],
    };
  }
  setKey = (key) => {
    this.setState(
      {
        key: key,
      },
      () => {
        localStorage.setItem("DashboardTabKey", key);
      }
    );
  };
  componentDidMount() {
    axios({
      method: "POST",
      url: URL.authorlist,
      data: { authToken: "string" },
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          this.setState({
            authorList: res.data.data.list,
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
    axios({
      method: "POST",
      url: URL.userlist,
      data: { authToken: "string" },
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          this.setState({
            userList: res.data.data.list,
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    return (
      <React.Fragment>
        <Header props={this.props} />
        <Container fluid style={{ width: "auto", background: "#EEEEEE" }}>
          <Tab.Container
            activeKey={this.state.key}
            onSelect={(key) => this.setKey(key)}
          >
            <Row
              style={{
                padding: "1em 0em",
                boxShadow: "-1px 3px 4px -4px rgba(0, 0, 0, 0.75)",
                zIndex: "99",
                position: "relative",
              }}
            >
              <Col
                lg="1.5"
                style={{
                  margin: "0px 0em 0em 3em",
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
                          padding: " 0.3em 2em",
                        }
                  }
                >
                  <span style={{ fontSize: "larger" }}>Q&A </span>
                </Nav.Link>
              </Col>
              <Col
                lg="1.5"
                style={{
                  padding: "0 ",
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
                          padding: " 0.3em 2em",
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
                <QATab
                  history={this.props.history}
                  authorList={this.state.authorList}
                  userList={this.state.userList}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="second">
                <ExamTab
                  history={this.props.history}
                  authorList={this.state.authorList}
                  userList={this.state.userList}
                />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Container>
      </React.Fragment>
    );
  }
}
export default Dashboard;
