import React, { Component } from "react";
import { Row, Col, Button, Form, Card } from "react-bootstrap";
// import Bucket from "@material-ui/icons/Https";
import Edit from "@material-ui/icons/Edit";
import { Link } from "react-router-dom";
import axios from "axios";
import "./index.css";
import LeftpanelExamtab from "./leftpanelExamtab.js";
import URL from "../../Assets/url";

class Examtab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listOfExam: [],
      selectedExamID: "",
      listOfSubject: [],
      selectedSubjectID: "",
      listOfChapter: [],
      selectedChapterID: "",
      selectedLanguage: "ENGLISH",
      listOfLanguage: ["ENGLISH", "HINDI"],
      searchbox: "",
      searchResultList: [],
      listOfType: ["Free", "Weekly", "Practise test", "Previous year paper"],
      selectedType: "Free"
    };
  }
  handlesearchWithFilter = () => {
    axios({
      method: "POST",
      url: URL.searchexam + "1",
      data: {
        authToken: "string",
        language: this.state.selectedLanguage,
        examId: this.state.selectedExamID,
        testId: "",
        sectionId: this.state.selectedChapterID,
        subjectId: this.state.selectedSubjectID,
        type: this.state.selectedType
      },
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => {
      // console.log(res.data.data.list);
      if (res.status === 200) {
        this.setState({ searchResultList: res.data.data.list });
      }
    });
  };
  clearSearchFromFilters = () => {
    this.setState({
      searchResultList: [],
      // listOfsearchselected: [],
      searchbox: ""
    });
  };
  handleTypeChange = e => {
    e.preventDefault();
    this.setState({ selectedType: e.target.value }, () => {
      // this.componentDidMount();
    });
  };
  handleSearchboxChange = e => {
    e.preventDefault();

    this.setState({ searchbox: e.target.value });
    if (e.target.value !== "") {
      axios({
        method: "POST",
        url: URL.searchexam + "1",
        data: {
          authToken: "string",
          language: this.state.selectedLanguage,
          examId: this.state.selectedExamID,
          testId: e.target.value,
          sectionId: this.state.selectedChapterID,
          subjectId: this.state.selectedSubjectID,
          type: this.state.selectedType
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
  componentDidMount() {
    axios({
      method: "POST",
      url: URL.fetchExam + this.state.selectedLanguage,
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
              listOfExam: res.data.data.list,
              selectedExamID:
                res.data.data.list.length > 0
                  ? res.data.data.list[0].exam.examId
                  : ""
            },
            () => {
              this.callApiForSubject();
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
  callApiForSubject = () => {
    if (this.state.selectedExamID !== "") {
      axios({
        method: "POST",
        url: URL.fetchSubjectForExam + this.state.selectedExamID,
        data: { authToken: "string" },
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          if (res.status === 200) {
            axios({
              method: "POST",
              url: URL.fetchSubject + this.state.selectedLanguage,
              data: { authToken: "string" },
              headers: {
                "Content-Type": "application/json"
              }
            }).then(response => {
              if (response.status === 200) {
                let tempsubjectlist = [];
                for (let i = 0; i < res.data.data.list.length; i++) {
                  for (let j = 0; j < response.data.data.list.length; j++) {
                    if (
                      response.data.data.list[j].subject.subjectId ===
                      res.data.data.list[i].subjectId
                    ) {
                      tempsubjectlist.push(response.data.data.list[j]);
                    }
                  }
                }
                // console.log(tempsubjectlist);
                this.setState(
                  {
                    listOfSubject: tempsubjectlist,
                    selectedSubjectID:
                      tempsubjectlist.length > 0
                        ? tempsubjectlist[0].subject.subjectId
                        : ""
                  },
                  () => {
                    this.callApiForChapter();
                  }
                );
              }
            });
          } else {
            alert("Unexpected code");
          }
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      console.log("(English)examid is blank. API not called. exam list");
      this.setState({
        listOfChapter: [],
        selectedChapterID: "",

        listOfSubject: [],
        selectedSubjectId: ""
      });
    }
  };
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
                // this.callApiForTopic();
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
        selectedChapterID: ""
      });
    }
  };
  handleExamChange = e => {
    e.preventDefault();

    this.setState(
      {
        selectedExamID: this.state.listOfExam[e.target.options.selectedIndex]
          .exam.examId
      },
      () => {
        this.callApiForSubject();
      }
    );
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
  render() {
    return (
      <Row style={{ height: "90vh" }}>
        <Col
          lg="3"
          style={{
            padding: "0em 2em",
            background: "#EEE"
          }}
        >
          <LeftpanelExamtab
            searchResultListLength={this.state.searchResultList.length}
            handlesearchWithFilter={this.handlesearchWithFilter}
            clearSearchFromFilters={this.clearSearchFromFilters}
            listOfSubject={this.state.listOfSubject}
            listOfChapter={this.state.listOfChapter}
            listOfExam={this.state.listOfExam}
            handleSubjectChange={this.handleSubjectChange}
            handleChapterChange={this.handleChapterChange}
            handleExamChange={this.handleExamChange}
            selectedSubjectID={this.state.selectedSubjectID}
            selectedChapterID={this.state.selectedChapterID}
            selectedExamID={this.state.selectedExamID}
            // tags={this.state.tags}
            // handleChangeTags={this.handleChangeTags}
            // difficulty={this.state.difficulty}
            // handleDifficultyRadio={this.handleDifficultyRadio}
            listOfLanguage={this.state.listOfLanguage}
            selectedLanguage={this.state.selectedLanguage}
            handleLanguageChange={this.handleLanguageChange}
            listOfType={this.state.listOfType}
            selectedType={this.state.selectedType}
            handleTypeChange={this.handleTypeChange}
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
              <Link to="/addexam" target="_self">
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
                  + Add Exam
                </Button>
              </Link>
              {/* </BrowserRouter> */}
            </Col>
            {/* <Col
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
                Add new and review prevoius exam.
                <br></br>
                Please select the filter on left for accessing best results.
              </p>
            </Col> */}
          </Row>

          <Row style={{ margin: "0em 0em" }}>
            <Col style={{ paddingLeft: "0em", paddingRight: "0em" }}>
              <Form className="searchform">
                <Form.Group controlId="formBasicSearch1">
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

          {/* {this.state.searchResultList.length > 0 && (
            <Row style={{ margin: "0 0em 1em" }}>
              <Col
                style={{ paddingLeft: "0.5em", paddingTop: "0.3em" }}
                lg="1.5"
              >
                <Form.Check
                  id="custom-switch"
                  label="Select all"
                 
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
          )} */}
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
              this.state.searchResultList.map((item,index) => {
                return (
                  <Row key={index} style={{ margin: "0.5em 0em" }}>
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
                            {/* <Form.Check inline type="checkbox" /> */}

                            <span>
                              <b>Id#</b>{" "}
                              <span style={{ color: "dimgrey" }}>
                                {item.testId}
                              </span>
                            </span>
                            <span
                              style={{
                                float: "right",
                                fontSize: "15px",
                                fontWeight: "600"
                              }}
                            >
                              <b>Year: </b>
                              {item.year},
                              <span style={{ color: "darkgreen" }}>
                                {" "}
                                {item.type}
                              </span>
                            </span>
                          </Card.Title>

                          <Card.Text>
                            {""}
                            {item.name}
                          </Card.Text>
                          <div style={{ float: "right" }}>
                            <Link
                              to={`/editexam/${item.testId}`}
                              target="_self"
                            >
                              <Button
                                title="Edit"
                                size="sm"
                                style={{
                                  borderRadius: "0",
                                  padding: ".15rem .15rem"
                                }}
                                variant="secondary"
                              >
                                {<Edit className="svg_icons" />}{" "}
                              </Button>
                            </Link>
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
    );
  }
}
export default Examtab;
