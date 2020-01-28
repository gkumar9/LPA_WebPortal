import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Card,
  Tab,
  Nav
} from "react-bootstrap";
import Bucket from "@material-ui/icons/Https";
import Edit from "@material-ui/icons/Edit";
import Header from "../Header/index";
import { Link } from "react-router-dom";
import axios from "axios";
import "./index.css";
import LeftPanelQuestion from "./leftpanel.js";
import URL from "../../Assets/url";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listOfSubject: [],
      selectedSubjectID: "",
      listOfChapter: [],
      selectedChapterID: "",
      listOfTopic: [],
      selectedTopicID: "",
      listOfSubTopic: [],
      selectedSubTopicID: "",
      tags: [],
      difficulty: ""
    };
  }
  handleDifficultyRadio = e => {
    e.preventDefault();
    this.setState({ difficulty: e.target.value });
  };
  handleChangeTags = tags => {
    this.setState({ tags });
  };
  componentDidMount() {
    axios({
      method: "POST",
      url: URL.fetchSubject + "ENGLISH",
      data: { authToken: "string" },
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        // console.log(res.data.data);
        if (res.status === 200) {
          this.setState({
            listOfSubject: res.data.data.list,
            selectedSubjectID: res.data.data.list[0].subject.subjectId
          });
          this.callApiForChapter();
        } else {
          alert("Unexpected code");
        }
      })
      .catch(e => {
        console.log(e);
      });
  }
  callApiForChapter = () => {
    axios({
      method: "POST",
      url: URL.fetchChapter + this.state.selectedSubjectID + "/ENGLISH",
      data: { authToken: "string" },
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        // console.log(res.data.data);
        if (res.status === 200) {
          this.setState({
            listOfChapter: res.data.data.list,
            selectedChapterID: res.data.data.list[0].subjectSection.sectionId
          });
          this.callApiForTopic();
        } else {
          alert("Unexpected code");
        }
      })
      .catch(e => {
        console.log(e);
      });
  };
  callApiForTopic = () => {
    axios({
      method: "POST",
      url: URL.fetchTopic + this.state.selectedChapterID + "/ENGLISH",
      data: { authToken: "string" },
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        // console.log(res.data.data);
        if (res.status === 200) {
          this.setState({
            listOfTopic: res.data.data.list,
            selectedTopicID: res.data.data.list[0].subjectTopic.topicId
          });
          this.callApiForSubTopic();
        } else {
          alert("Unexpected code");
        }
      })
      .catch(e => {
        console.log(e);
      });
  };
  callApiForSubTopic = () => {
    axios({
      method: "POST",
      url: URL.fetchSubTopic + this.state.selectedTopicID + "/ENGLISH",
      data: { authToken: "string" },
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        // console.log(res.data.data);
        if (res.status === 200) {
          this.setState({
            listOfSubTopic: res.data.data.list,
            selectedSubTopicID: res.data.data.list[0].subjectSubtopic.subtopicId
          });
        } else {
          alert("Unexpected code");
        }
      })
      .catch(e => {
        console.log(e);
      });
  };
  handleSubjectChange = e => {
    e.preventDefault();
    this.setState({
      selectedSubjectID: this.state.listOfSubject[
        e.target.options.selectedIndex
      ].subject.subjectId
    });
  };
  render() {
    return (
      <React.Fragment>
        <Header />
        <Container fluid style={{ width: "auto" }}>
          <Row style={{ height: "90vh" }}>
            <Col
              lg="3"
              style={{
                padding: "6em 2em",
                background: "#EEEEEE",
                // background: "white",
                // height: "90vh",
                // paddingLeft: "0em",
                // paddingRight: "0em"
              }}
            >
              {/* <GmailTreeView /> */}
              <LeftPanelQuestion
                listOfSubject={this.state.listOfSubject}
                listOfChapter={this.state.listOfChapter}
                listOfTopic={this.state.listOfTopic}
                listOfSubTopic={this.state.listOfSubTopic}
                handleSubjectChange={this.handleSubjectChange}
                selectedSubjectID={this.state.selectedSubjectID}
                selectedChapterID={this.state.selectedChapterID}
                selectedTopicID={this.state.selectedTopicID}
                selectedSubTopicID={this.state.selectedSubTopicID}
                tags={this.state.tags}
                handleChangeTags={this.handleChangeTags}
                difficulty={this.state.difficulty}
                handleDifficultyRadio={this.handleDifficultyRadio}
              />
            </Col>

            <Col
              style={{
                background: "#EEEEEE",
                // height: "90vh",
                padding: "0em 2em"
              }}
            >
              <Tab.Container defaultActiveKey="first">
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
                    <Nav.Link eventKey="first">
                      <span style={{ fontSize: "larger" }}>Q&A </span>
                    </Nav.Link>
                  </Col>
                  <Col
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
                </Row>
                <Tab.Content>
                  <Tab.Pane eventKey="first">
                    <Row style={{ margin: "2em 0em" }}>
                      <Col lg="1.5">
                        {/* <BrowserRouter> */}
                        <Link to="/addques" target="_self">
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
                        </Link>
                        {/* </BrowserRouter> */}
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
                          Add new and review prevoius question and answers.
                          <br></br>
                          Please select the folder you want to access before
                          taking any actions.
                        </p>
                      </Col>
                    </Row>

                    <Row style={{ margin: "0em 0em" }}>
                      <Col style={{ paddingLeft: "0em", paddingRight: "0em" }}>
                        <Form className="searchform">
                          <Form.Group controlId="formBasicSearch">
                            <Form.Control
                              type="text"
                              placeholder="&#128269;  Search a question with id number"
                              style={{
                                padding: "1.5em 2em",
                                borderRadius: "0"
                              }}
                            />
                          </Form.Group>
                        </Form>
                      </Col>
                    </Row>

                    <Row style={{ margin: "0 0em 1em" }}>
                      <Col style={{ paddingLeft: "0.5em" }} lg="1.5">
                        <Form.Check
                          type="switch"
                          id="custom-switch"
                          label="Select all"
                          // label={
                          //   <Button variant="outline-primary" size="sm">
                          //     Add to bucket
                          //   </Button>
                          // }
                          // label={
                          //   <Button variant="outline-dark" size="sm">
                          //     <Bucket className="svg_icons" /> Add to bucket
                          //   </Button>
                          // }
                        />
                      </Col>
                      <Col lg="9" />
                      <Col style={{ paddingRight: "0em" }}>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          // style={{ float: "right" }}
                        >
                          <Bucket className="svg_icons" /> Add to bucket
                        </Button>
                      </Col>
                    </Row>
                    <div
                      style={{
                        height: "45vh",
                        overflow: "scroll",
                        // border: "1px solid lightgrey",
                        // background: "white",
                        padding: "0.4em"
                      }}
                    >
                      <Row style={{ margin: "0.5em 0em" }}>
                        <Col
                          style={{ paddingLeft: "0em", paddingRight: "0em" }}
                        >
                          <Card
                            style={{
                              background: "transparent",
                              borderColor: "transparent"
                            }}
                          >
                            <Card.Body style={{ padding: "0em" }}>
                              <Card.Title style={{ fontSize: "medium" }}>
                                <Form.Check inline type="checkbox" />

                                <span>
                                  <b>Id#</b>{" "}
                                  <span style={{ color: "dimgrey" }}>
                                    ABCD76{" "}
                                  </span>
                                </span>
                                <span
                                  style={{
                                    float: "right",
                                    fontSize: "15px",
                                    fontWeight: "600"
                                  }}
                                >
                                  <b>Tags: </b>
                                  <span style={{ color: "blue" }}>
                                    Difficulty: ++
                                  </span>
                                  ,
                                  <span style={{ color: "maroon" }}>
                                    {" "}
                                    2013 RSBSSB
                                  </span>
                                  ,
                                  <span style={{ color: "darkgreen" }}>
                                    {" "}
                                    Single option obj
                                  </span>
                                </span>
                              </Card.Title>

                              <Card.Text>
                                A coin is thrown 3 times. What is the
                                probability that atleast one head is obtained ?
                              </Card.Text>
                              <div style={{ float: "right" }}>
                                <Button
                                  title="Add to bucket"
                                  size="sm"
                                  style={{
                                    borderRadius: "0"
                                  }}
                                  variant="primary"
                                >
                                  {<Bucket />}{" "}
                                </Button>
                                <Button
                                  title="Edit"
                                  size="sm"
                                  style={{
                                    borderRadius: "0",
                                    marginLeft: "1em"
                                  }}
                                  variant="secondary"
                                >
                                  {<Edit />}{" "}
                                </Button>
                              </div>
                              {/* <Card.Link style={{float:'right'}} href="#">Card Link</Card.Link>
                  <Card.Link style={{float:'right'}}href="#">Another Link</Card.Link> */}
                            </Card.Body>
                            <hr />
                          </Card>
                        </Col>
                      </Row>
                      <Row style={{ margin: "0.5em 0em" }}>
                        <Col
                          style={{ paddingLeft: "0em", paddingRight: "0em" }}
                        >
                          <Card
                            style={{
                              background: "transparent",
                              borderColor: "transparent"
                            }}
                          >
                            <Card.Body style={{ padding: "0em" }}>
                              <Card.Title style={{ fontSize: "medium" }}>
                                <Form.Check inline type="checkbox" />

                                <span>
                                  <b>Id#</b>{" "}
                                  <span style={{ color: "dimgrey" }}>
                                    ABCD76{" "}
                                  </span>
                                </span>
                                <span
                                  style={{
                                    float: "right",
                                    fontSize: "15px",
                                    fontWeight: "600"
                                  }}
                                >
                                  <b>Tags: </b>
                                  <span style={{ color: "blue" }}>
                                    Difficulty: ++
                                  </span>
                                  ,
                                  <span style={{ color: "maroon" }}>
                                    {" "}
                                    2013 RSBSSB
                                  </span>
                                  ,
                                  <span style={{ color: "darkgreen" }}>
                                    {" "}
                                    Single option obj
                                  </span>
                                </span>
                              </Card.Title>

                              <Card.Text>
                                A coin is thrown 3 times. What is the
                                probability that atleast one head is obtained ?
                              </Card.Text>
                              <div style={{ float: "right" }}>
                                <Button
                                  title="Add to bucket"
                                  size="sm"
                                  style={{
                                    borderRadius: "0"
                                  }}
                                  variant="primary"
                                >
                                  {<Bucket />}{" "}
                                </Button>
                                <Button
                                  title="Edit"
                                  size="sm"
                                  style={{
                                    borderRadius: "0",
                                    marginLeft: "1em"
                                  }}
                                  variant="secondary"
                                >
                                  {<Edit />}{" "}
                                </Button>
                              </div>
                              {/* <Card.Link style={{float:'right'}} href="#">Card Link</Card.Link>
                  <Card.Link style={{float:'right'}}href="#">Another Link</Card.Link> */}
                            </Card.Body>
                            <hr />
                          </Card>
                        </Col>
                      </Row>
                      <Row style={{ margin: "0.5em 0em" }}>
                        <Col
                          style={{ paddingLeft: "0em", paddingRight: "0em" }}
                        >
                          <Card
                            style={{
                              background: "transparent",
                              borderColor: "transparent"
                            }}
                          >
                            <Card.Body style={{ padding: "0em" }}>
                              <Card.Title style={{ fontSize: "medium" }}>
                                <Form.Check inline type="checkbox" />

                                <span>
                                  <b>Id#</b>{" "}
                                  <span style={{ color: "dimgrey" }}>
                                    ABCD76{" "}
                                  </span>
                                </span>
                                <span
                                  style={{
                                    float: "right",
                                    fontSize: "15px",
                                    fontWeight: "600"
                                  }}
                                >
                                  <b>Tags: </b>
                                  <span style={{ color: "blue" }}>
                                    Difficulty: ++
                                  </span>
                                  ,
                                  <span style={{ color: "maroon" }}>
                                    {" "}
                                    2013 RSBSSB
                                  </span>
                                  ,
                                  <span style={{ color: "darkgreen" }}>
                                    {" "}
                                    Single option obj
                                  </span>
                                </span>
                              </Card.Title>

                              <Card.Text>
                                A coin is thrown 3 times. What is the
                                probability that atleast one head is obtained ?
                              </Card.Text>
                              <div style={{ float: "right" }}>
                                <Button
                                  title="Add to bucket"
                                  size="sm"
                                  style={{
                                    borderRadius: "0"
                                  }}
                                  variant="primary"
                                >
                                  {<Bucket />}{" "}
                                </Button>
                                <Button
                                  title="Edit"
                                  size="sm"
                                  style={{
                                    borderRadius: "0",
                                    marginLeft: "1em"
                                  }}
                                  variant="secondary"
                                >
                                  {<Edit />}{" "}
                                </Button>
                              </div>
                              {/* <Card.Link style={{float:'right'}} href="#">Card Link</Card.Link>
                  <Card.Link style={{float:'right'}}href="#">Another Link</Card.Link> */}
                            </Card.Body>
                            <hr />
                          </Card>
                        </Col>
                      </Row>
                      <Row style={{ margin: "0.5em 0em" }}>
                        <Col
                          style={{ paddingLeft: "0em", paddingRight: "0em" }}
                        >
                          <Card
                            style={{
                              background: "transparent",
                              borderColor: "transparent"
                            }}
                          >
                            <Card.Body style={{ padding: "0em" }}>
                              <Card.Title style={{ fontSize: "medium" }}>
                                <Form.Check inline type="checkbox" />

                                <span>
                                  <b>Id#</b>{" "}
                                  <span style={{ color: "dimgrey" }}>
                                    ABCD76{" "}
                                  </span>
                                </span>
                                <span
                                  style={{
                                    float: "right",
                                    fontSize: "15px",
                                    fontWeight: "600"
                                  }}
                                >
                                  <b>Tags: </b>
                                  <span style={{ color: "blue" }}>
                                    Difficulty: ++
                                  </span>
                                  ,
                                  <span style={{ color: "maroon" }}>
                                    {" "}
                                    2013 RSBSSB
                                  </span>
                                  ,
                                  <span style={{ color: "darkgreen" }}>
                                    {" "}
                                    Single option obj
                                  </span>
                                </span>
                              </Card.Title>

                              <Card.Text>
                                A coin is thrown 3 times. What is the
                                probability that atleast one head is obtained ?
                              </Card.Text>
                              <div style={{ float: "right" }}>
                                <Button
                                  title="Add to bucket"
                                  size="sm"
                                  style={{
                                    borderRadius: "0"
                                  }}
                                  variant="primary"
                                >
                                  {<Bucket />}{" "}
                                </Button>
                                <Button
                                  title="Edit"
                                  size="sm"
                                  style={{
                                    borderRadius: "0",
                                    marginLeft: "1em"
                                  }}
                                  variant="secondary"
                                >
                                  {<Edit />}{" "}
                                </Button>
                              </div>
                              {/* <Card.Link style={{float:'right'}} href="#">Card Link</Card.Link>
                  <Card.Link style={{float:'right'}}href="#">Another Link</Card.Link> */}
                            </Card.Body>
                            <hr />
                          </Card>
                        </Col>
                      </Row>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="second">asdasdasd</Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}
export default Dashboard;
