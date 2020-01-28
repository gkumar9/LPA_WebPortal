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
      difficulty: "",
      selectedLanguage: "ENGLISH",
      listOfLanguage: ["ENGLISH", "HINDI"],
      searchbox: "",
      searchResultList: []
    };
  }
  handleSearchboxChange = e => {
    e.preventDefault();

    this.setState({ searchbox: e.target.value });
    if (e.target.value !== "") {
      axios({
        method: "POST",
        url: URL.searchquestion + "1",
        data: {
          authToken: "string",
          language: this.state.selectedLanguage,
          questionId: e.target.value,
          sectionId: this.state.selectedChapterID,
          subjectId: this.state.selectedSubjectID,
          subtopicId: this.state.selectedSubTopicID,
          topicId: this.state.selectedTopicID
        },
        headers: {
          "Content-Type": "application/json"
        }
      }).then(res => {
        console.log(res.data.data.list);
        if (res.status === 200) {
          this.setState({ searchResultList: res.data.data.list });
        }
      });
    } else {
      this.setState({ searchResultList: [] });
    }
  };
  handleLanguageChange = e => {
    e.preventDefault();
    this.setState({ selectedLanguage: e.target.value }, () => {
      this.componentDidMount();
    });
  };
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
      url: URL.fetchSubject + this.state.selectedLanguage,
      data: { authToken: "string" },
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        // console.log(res.data.data);
        if (res.status === 200) {
          this.setState(
            {
              listOfSubject: res.data.data.list,
              selectedSubjectID:
                res.data.data.list.length > 0
                  ? res.data.data.list[0].subject.subjectId
                  : ""
            },
            () => {
              this.callApiForChapter();
            }
          );
        } else {
          alert("Unexpected code");
        }
      })
      .catch(e => {
        console.log(e);
      });
  }
  callApiForChapter = () => {
    if (this.state.selectedSubjectID !== "") {
      axios({
        method: "POST",
        url:
          URL.fetchChapter +
          this.state.selectedSubjectID +
          "/" +
          this.state.selectedLanguage,
        data: { authToken: "string" },
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          if (res.status === 200) {
            this.setState(
              {
                listOfChapter: res.data.data.list,
                selectedChapterID:
                  res.data.data.list.length > 0
                    ? res.data.data.list[0].subjectSection.sectionId
                    : ""
              },
              () => {
                this.callApiForTopic();
              }
            );
          } else {
            alert("Unexpected code");
          }
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      console.log(
        "(English)subjectid is blank. API not called. checksubject list"
      );
      this.setState({
        listOfChapter: [],
        selectedChapterID: "",
        listOfTopic: [],
        selectedTopicID: "",
        listOfSubTopic: [],
        selectedSubTopicID: ""
      });
    }
  };
  callApiForTopic = () => {
    if (this.state.selectedChapterID !== "") {
      axios({
        method: "POST",
        url:
          URL.fetchTopic +
          this.state.selectedChapterID +
          "/" +
          this.state.selectedLanguage,
        data: { authToken: "string" },
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          // console.log(res.data.data);
          if (res.status === 200) {
            this.setState(
              {
                listOfTopic: res.data.data.list,
                selectedTopicID:
                  res.data.data.list.length > 0
                    ? res.data.data.list[0].subjectTopic.topicId
                    : ""
              },
              () => {
                this.callApiForSubTopic();
              }
            );
          } else {
            alert("Unexpected code");
          }
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      console.log(
        "(English)chapterid is blank.API not called. checkchapter list"
      );
      this.setState({
        listOfTopic: [],
        selectedTopicID: "",
        listOfSubTopic: [],
        selectedSubTopicID: ""
      });
    }
  };
  callApiForSubTopic = () => {
    if (this.state.selectedTopicID !== "") {
      axios({
        method: "POST",
        url:
          URL.fetchSubTopic +
          this.state.selectedTopicID +
          "/" +
          this.state.selectedLanguage,
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
              selectedSubTopicID:
                res.data.data.list.length > 0
                  ? res.data.data.list[0].subjectSubtopic.subtopicId
                  : ""
            });
          } else {
            alert("Unexpected code");
          }
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      console.log("(English)topicid is blank.API not called. checktopic list");
      this.setState({ listOfSubTopic: [], selectedSubTopicID: "" });
    }
  };
  handleSubjectChange = e => {
    e.preventDefault();

    this.setState(
      {
        selectedSubjectID: this.state.listOfSubject[
          e.target.options.selectedIndex
        ].subject.subjectId
      },
      () => {
        this.callApiForChapter();
      }
    );
  };
  handleChapterChange = e => {
    e.preventDefault();
    this.setState(
      {
        selectedChapterID: this.state.listOfChapter[
          e.target.options.selectedIndex
        ].subjectSection.sectionId
      },
      () => {
        this.callApiForTopic();
      }
    );
  };
  handleTopicChange = e => {
    e.preventDefault();
    this.setState(
      {
        selectedTopicID: this.state.listOfTopic[e.target.options.selectedIndex]
          .subjectTopic.topicId
      },
      () => {
        this.callApiForSubTopic();
      }
    );
  };
  handleSubTopicChange = e => {
    e.preventDefault();
    this.setState({
      selectedSubTopicID: this.state.listOfSubTopic[
        e.target.options.selectedIndex
      ].subjectSubtopic.subtopicId
    });
  };
  render() {
    return (
      <React.Fragment>
        <Header />
        <Container fluid style={{ width: "auto" }}>
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
                <Row style={{ height: "90vh" }}>
                  <Col
                    lg="3"
                    style={{
                      padding: "0em 2em",
                      background: "#EEE"
                    }}
                  >
                    <LeftPanelQuestion
                      listOfSubject={this.state.listOfSubject}
                      listOfChapter={this.state.listOfChapter}
                      listOfTopic={this.state.listOfTopic}
                      listOfSubTopic={this.state.listOfSubTopic}
                      handleSubjectChange={this.handleSubjectChange}
                      handleChapterChange={this.handleChapterChange}
                      handleTopicChange={this.handleTopicChange}
                      handleSubTopicChange={this.handleSubTopicChange}
                      selectedSubjectID={this.state.selectedSubjectID}
                      selectedChapterID={this.state.selectedChapterID}
                      selectedTopicID={this.state.selectedTopicID}
                      selectedSubTopicID={this.state.selectedSubTopicID}
                      tags={this.state.tags}
                      handleChangeTags={this.handleChangeTags}
                      difficulty={this.state.difficulty}
                      handleDifficultyRadio={this.handleDifficultyRadio}
                      listOfLanguage={this.state.listOfLanguage}
                      selectedLanguage={this.state.selectedLanguage}
                      handleLanguageChange={this.handleLanguageChange}
                    />
                  </Col>

                  <Col
                    style={{
                      background: "#EEEEEE",
                      // height: "90vh",
                      padding: "0em 2em"
                    }}
                  >
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
                          {/* Please select the filter on left for accessing best results. */}
                        </p>
                      </Col>
                    </Row>

                    <Row style={{ margin: "0em 0em" }}>
                      <Col style={{ paddingLeft: "0em", paddingRight: "0em" }}>
                        <Form className="searchform">
                          <Form.Group controlId="formBasicSearch">
                            <Form.Control
                              type="text"
                              value={this.state.searchbox}
                              onChange={this.handleSearchboxChange}
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

                    {this.state.searchResultList.length > 0 && (
                      <Row style={{ margin: "0 0em 1em" }}>
                        <Col
                          style={{ paddingLeft: "0.5em", paddingTop: "0.3em" }}
                          lg="1.5"
                        >
                          <Form.Check
                            // type="switch"
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

                        <Col style={{ paddingRight: "0em" }}>
                          <Button
                            variant="outline-light"
                            size="sm"
                            style={{
                              color: "black",
                              borderColor: "transparent"
                            }}
                          >
                            <Bucket className="svg_icons" /> Add to bucket
                          </Button>
                        </Col>
                        <Col lg="9" />
                      </Row>
                    )}
                    <div
                      style={{
                        height: "45vh",
                        overflow: "scroll",
                        // border: "1px solid lightgrey",
                        // background: "white",
                        padding: "0.4em"
                      }}
                    >
                      {this.state.searchResultList.length > 0 &&
                        this.state.searchResultList.map(item => {
                          return (
                            <Row style={{ margin: "0.5em 0em" }}>
                              <Col
                                style={{
                                  paddingLeft: "0em",
                                  paddingRight: "0em"
                                }}
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
                                          {item.questionId}
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
                                          Difficulty:{" "}
                                          {item.level === "EASY"
                                            ? item.level === "MILD"
                                              ? "++"
                                              : "+"
                                            : "+++"}
                                        </span>
                                        {/* <span style={{ color: "maroon" }}>
                                    {" "}
                                    2013 RSBSSB
                                  </span> */}
                                        ,
                                        <span style={{ color: "darkgreen" }}>
                                          {" "}
                                          {item.type}
                                        </span>
                                      </span>
                                    </Card.Title>

                                    <Card.Text>
                                      {""}
                                      {item.content}
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
                                  </Card.Body>
                                  {/* <hr /> */}
                                </Card>
                              </Col>
                            </Row>
                          );
                        })}{" "}
                    </div>
                  </Col>
                </Row>
              </Tab.Pane>
              <Tab.Pane eventKey="second">asdasdasd</Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Container>
      </React.Fragment>
    );
  }
}
export default Dashboard;
