import React, { Component } from "react";
import {
  Row,
  Col,
  Button,
  Form,
  Card,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import Edit from "@material-ui/icons/Edit";
import View from "@material-ui/icons/Visibility";
import FlagIcon from "@material-ui/icons/Flag";
import { Link } from "react-router-dom";
import axios from "axios";
import "./index.css";
import LeftpanelExamtab from "./leftpanelExamtab.js";
import URL from "../../Assets/url";
import BottomScrollListener from "react-bottom-scroll-listener";

class Examtab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listOfExam: [],
      selectedExamID: localStorage.getItem("selectedExamIDTest")
        ? parseInt(localStorage.getItem("selectedExamIDTest"))
        : 0,
      listOfSubject: [],
      selectedSubjectID: localStorage.getItem("selectedSubjectIDTest")
        ? parseInt(localStorage.getItem("selectedSubjectIDTest"))
        : 0,
      listOfChapter: [],
      selectedChapterID: localStorage.getItem("selectedChapterIDTest")
        ? parseInt(localStorage.getItem("selectedChapterIDTest"))
        : 0,
      selectedLanguage: localStorage.getItem("selectedLanguageTest")
        ? localStorage.getItem("selectedLanguageTest")
        : "ENGLISH",
      listOfLanguage: ["ENGLISH", "HINDI"],
      searchbox: localStorage.getItem("selectedsearchboxTest")
        ? parseInt(localStorage.getItem("selectedsearchboxTest"))
        : "",
      searchResultList: [],
      listOfType: ["Free", "Weekly", "Practise test", "Previous year paper"],
      selectedType: localStorage.getItem("selectedTypeTest")
        ? localStorage.getItem("selectedTypeTest")
        : "",
      hasMore: null,
      pageNo: 1,
      date: localStorage.getItem("selectedDateTest")
        ? new Date(localStorage.getItem("selectedDateTest"))
        : null,
      authorId: localStorage.getItem("selectedAuthorIDTest")
        ? parseInt(localStorage.getItem("selectedAuthorIDTest"))
        : 0,
      userId: localStorage.getItem("selectedUserIDTest")
        ? localStorage.getItem("selectedUserIDTest")
        : null,
    };
  }
  handleDateChange = (date) => {
    this.setState(
      {
        date: date,
      },
      () => {
        localStorage.setItem("selectedDateTest", date);
      }
    );
  };
  handleUserChange = (e) => {
    if (e.target.value === "") {
      localStorage.setItem("selectedUserIDTest", null);
      this.setState({
        userId: null,
      });
    } else {
      localStorage.setItem(
        "selectedUserIDTest",
        this.props.userList[e.target.options.selectedIndex].userId.toString()
      );
      this.setState({
        userId: this.props.userList[e.target.options.selectedIndex].userId,
      });
    }
  };
  handleAuthorChange = (e) => {
    if (e.target.value === "") {
      localStorage.setItem("selectedAuthorIDTest", "0");
      this.setState({
        authorId: 0,
      });
    } else {
      localStorage.setItem(
        "selectedAuthorIDTest",
        this.props.authorList[
          e.target.options.selectedIndex
        ].authorId.toString()
      );
      this.setState({
        authorId: this.props.authorList[e.target.options.selectedIndex]
          .authorId,
      });
    }
  };
  handlesearchWithFilter = () => {
    var Date = null;
    if (this.state.date !== null) {
      var Datetemp = this.state.date;

      var dd = Datetemp.getDate();
      var mm = Datetemp.getMonth() + 1; //January is 0!

      var yyyy = Datetemp.getFullYear();
      if (dd < 10) {
        dd = "0" + dd;
      }
      if (mm < 10) {
        mm = "0" + mm;
      }
      Date = yyyy + "-" + mm + "-" + dd;
    }
    axios({
      method: "POST",
      url: URL.searchexam + "1",
      data: {
        authToken: "string",
        authorId: this.state.authorId,
        userId: this.state.userId,
        language: this.state.selectedLanguage,
        date: Date,
        examId: this.state.selectedExamID ? this.state.selectedExamID : 0,
        testId: this.state.searchbox ? parseInt(this.state.searchbox) : 0,
        sectionId: this.state.selectedChapterID
          ? this.state.selectedChapterID
          : 0,
        subjectId: this.state.selectedSubjectID
          ? this.state.selectedSubjectID
          : 0,
        type: this.state.selectedType ? this.state.selectedType : null,
      },
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      // console.log(res.data.data.list);
      if (res.status === 200) {
        this.setState({
          searchResultList: res.data.data.list,
          pageNo: 2,
          hasMore: res.data.data.hasMore,
        });
      }
    });
  };
  clearSearchFromFilters = () => {
    localStorage.setItem("selectedExamIDTest", "0");
    localStorage.setItem("selectedSubjectIDTest", "0");
    localStorage.setItem("selectedChapterIDTest", "0");
    localStorage.setItem("selectedsearchboxTest", "");
    localStorage.setItem("selectedTypeTest", "");
    localStorage.setItem("selectedAuthorIDTest", "0");
    localStorage.setItem("selectedUserIDTest", null);
    localStorage.setItem("selectedDateTest", null);
    this.setState(
      {
        searchbox: "",
        authorId: 0,
        userId: null,
        date: null,
        selectedExamID: 0,
        listOfSubject: [],
        selectedSubjectID: 0,
        listOfChapter: [],
        selectedChapterID: 0,
        selectedType: "",
        pageNo: 1,
        hasMore: true,
      },
      () => {
        this.handlesearchWithFilter();
      }
    );
  };
  handleTypeChange = (e) => {
    e.preventDefault();
    localStorage.setItem("selectedTypeTest", e.target.value);
    this.setState({ selectedType: e.target.value }, () => {
      // this.componentDidMount();
    });
  };
  handleSearchboxChange = (e) => {
    e.preventDefault();

    this.setState({ searchbox: e.target.value, pageNo: 1 });
    localStorage.setItem("selectedsearchboxTest", e.target.value);
    if (e.target.value !== "") {
      axios({
        method: "POST",
        url: URL.searchexam + "1",
        data: {
          authToken: "string",
          language: this.state.selectedLanguage,
          // examId: this.state.selectedExamID ? this.state.selectedExamID : 0,
          testId: e.target.value ? parseInt(e.target.value) : 0,
          // sectionId: this.state.selectedChapterID
          //   ? this.state.selectedChapterID
          //   : 0,
          // subjectId: this.state.selectedSubjectID
          //   ? this.state.selectedSubjectID
          //   : 0,
          // type: this.state.selectedType ? this.state.selectedType : null,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        // console.log(res.data.data.list);
        if (res.status === 200) {
          this.setState({
            searchResultList: res.data.data.list,
            pageNo: this.state.pageNo + 1,
            hasMore: res.data.data.hasMore,
          });
        }
      });
    } else {
      this.setState({ searchResultList: [] });
    }
  };
  handleLanguageChange = (e) => {
    e.preventDefault();
    localStorage.setItem("selectedLanguageTest", e.target.value);
    this.setState(
      { selectedLanguage: e.target.value, pageNo: 1, hasMore: true },
      () => {
        this.componentDidMount();
      }
    );
  };
  componentDidMount() {
    axios({
      method: "POST",
      url: URL.fetchExam + this.state.selectedLanguage,
      data: { authToken: "string" },
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        // console.log(res.data.data);
        if (res.status === 200) {
          this.setState(
            {
              listOfExam: res.data.data.list,
              selectedExamID:
                localStorage.getItem("selectedExamIDTest") &&
                res.data.data.list.filter(
                  (itm) =>
                    itm.exam.examId ===
                    parseInt(localStorage.getItem("selectedExamIDTest"))
                ).length > 0
                  ? parseInt(localStorage.getItem("selectedExamIDTest"))
                  : 0,
              // selectedExamID:
              //   res.data.data.list.length > 0
              //     ? res.data.data.list[0].exam.examId
              //     : ""
            },
            () => {
              if (
                localStorage.getItem("selectedExamIDTest") &&
                parseInt(localStorage.getItem("selectedExamIDTest")) !== 0
              ) {
                localStorage.setItem(
                  "selectedExamIDTest",
                  localStorage.getItem("selectedExamIDTest") &&
                    res.data.data.list.filter(
                      (itm) =>
                        itm.exam.examId ===
                        parseInt(localStorage.getItem("selectedExamIDTest"))
                    ).length > 0
                    ? parseInt(
                        localStorage.getItem("selectedExamIDTest")
                      ).toString()
                    : "0"
                );
                this.callApiForSubject();
              }
              var Date = null;
              if (this.state.date !== null) {
                var Datetemp = this.state.date;

                var dd = Datetemp.getDate();
                var mm = Datetemp.getMonth() + 1; //January is 0!

                var yyyy = Datetemp.getFullYear();
                if (dd < 10) {
                  dd = "0" + dd;
                }
                if (mm < 10) {
                  mm = "0" + mm;
                }
                Date = yyyy + "-" + mm + "-" + dd;
              }
              axios({
                method: "POST",
                url: URL.searchexam + this.state.pageNo,
                data: {
                  authToken: "string",

                  authorId: this.state.authorId,
                  userId: this.state.userId,
                  language: this.state.selectedLanguage,
                  date: Date,
                  examId:
                    localStorage.getItem("selectedExamIDTest") &&
                    parseInt(localStorage.getItem("selectedExamIDTest")) !== 0
                      ? parseInt(localStorage.getItem("selectedExamIDTest"))
                      : 0,
                  testId: localStorage.getItem("selectedsearchboxTest")
                    ? parseInt(localStorage.getItem("selectedsearchboxTest"))
                    : 0,
                  sectionId:
                    localStorage.getItem("selectedChapterIDTest") &&
                    parseInt(localStorage.getItem("selectedChapterIDTest"))
                      ? parseInt(localStorage.getItem("selectedChapterIDTest"))
                      : 0,
                  subjectId:
                    localStorage.getItem("selectedSubjectIDTest") &&
                    parseInt(localStorage.getItem("selectedSubjectIDTest")) !==
                      0
                      ? parseInt(localStorage.getItem("selectedSubjectIDTest"))
                      : 0,
                  type: localStorage.getItem("selectedTypeTest")
                    ? localStorage.getItem("selectedTypeTest")
                    : null,
                },
                headers: {
                  "Content-Type": "application/json",
                },
              })
                .then((res) => {
                  // console.log(res.data.data.list);
                  if (res.status === 200) {
                    this.setState({
                      searchResultList: res.data.data.list,
                      pageNo: this.state.pageNo + 1,
                      hasMore: res.data.data.hasMore,
                    });
                  }
                })
                .catch((e) => {
                  alert(e);
                  // swal('Error', "No data found","error");
                });
              // this.callApiForSubject();
            }
          );
        } else {
          // swal('Error', "No data found","error");
          alert("Error");
        }
      })
      .catch((e) => {
        console.log(e);
        alert(e);
        // swal('Error', "No data found","error");
      });
  }
  callApiForSubject = () => {
    if (this.state.selectedExamID !== "") {
      axios({
        method: "POST",
        url: URL.fetchSubjectForExam + this.state.selectedExamID,
        data: { authToken: "string" },
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (res.status === 200) {
            axios({
              method: "POST",
              url: URL.fetchSubject + this.state.selectedLanguage,
              data: { authToken: "string" },
              headers: {
                "Content-Type": "application/json",
              },
            }).then((response) => {
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
                        ? localStorage.getItem("selectedSubjectIDTest") &&
                          tempsubjectlist.filter(
                            (itm) =>
                              itm.subject.subjectId ===
                              parseInt(
                                localStorage.getItem("selectedSubjectIDTest")
                              )
                          ).length > 0
                          ? parseInt(
                              localStorage.getItem("selectedSubjectIDTest")
                            )
                          : 0
                        : // : tempsubjectlist[0].subject.subjectId
                          0,
                    // tempsubjectlist.length > 0
                    //   ? tempsubjectlist[0].subject.subjectId
                    //   : 0
                  },
                  () => {
                    localStorage.setItem(
                      "selectedSubjectIDTest",
                      tempsubjectlist.length > 0
                        ? localStorage.getItem("selectedSubjectIDTest") &&
                          tempsubjectlist.filter(
                            (itm) =>
                              itm.subject.subjectId ===
                              parseInt(
                                localStorage.getItem("selectedSubjectIDTest")
                              )
                          ).length > 0
                          ? parseInt(
                              localStorage.getItem("selectedSubjectIDTest")
                            ).toString()
                          : "0"
                        : // : tempsubjectlist[0].subject.subjectId.toString()
                          "0"
                    );
                    this.callApiForChapter();
                  }
                );
              }
            });
          } else {
            alert("Unexpected code");
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      console.log("(English)examid is blank. API not called. exam list");
      localStorage.setItem("selectedSubjectIDTest", "0");
      localStorage.setItem("selectedChapterIDTest", "0");
      this.setState({
        listOfChapter: [],
        selectedChapterID: 0,

        listOfSubject: [],
        selectedSubjectID: 0,
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
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (res.status === 200) {
            this.setState(
              {
                listOfChapter: res.data.data.list,
                selectedChapterID:
                  res.data.data.list.length > 0
                    ? localStorage.getItem("selectedChapterIDTest") &&
                      res.data.data.list.filter(
                        (itm) =>
                          itm.subjectSection.sectionId ===
                          parseInt(
                            localStorage.getItem("selectedChapterIDTest")
                          )
                      ).length > 0
                      ? parseInt(localStorage.getItem("selectedChapterIDTest"))
                      : 0
                    : // : res.data.data.list[0].subjectSection.sectionId
                      0,
              },
              () => {
                localStorage.setItem(
                  "selectedChapterIDTest",
                  res.data.data.list.length > 0
                    ? localStorage.getItem("selectedChapterIDTest") &&
                      res.data.data.list.filter(
                        (itm) =>
                          itm.subjectSection.sectionId ===
                          parseInt(
                            localStorage.getItem("selectedChapterIDTest")
                          )
                      ).length > 0
                      ? parseInt(
                          localStorage.getItem("selectedChapterIDTest")
                        ).toString()
                      : "0"
                    : // : res.data.data.list[0].subjectSection.sectionId.toString()
                      "0"
                );
                // this.callApiForTopic();
              }
            );
          } else {
            alert("Unexpected code");
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      console.log(
        "(English)subjectid is blank. API not called. checksubject list"
      );
      localStorage.setItem("selectedChapterIDTest", "0");
      this.setState({
        listOfChapter: [],
        selectedChapterID: 0,
      });
    }
  };
  handleExamChange = (e) => {
    e.preventDefault();

    if (e.target.value === "") {
      localStorage.setItem("selectedExamIDTest", "0");
      this.setState(
        {
          selectedExamID: 0,
        },
        () => {
          this.callApiForSubject();
        }
      );
    } else {
      localStorage.setItem(
        "selectedExamIDTest",
        this.state.listOfExam[
          e.target.options.selectedIndex
        ].exam.examId.toString()
      );
      this.setState(
        {
          selectedExamID: this.state.listOfExam[e.target.options.selectedIndex]
            .exam.examId,
        },
        () => {
          this.callApiForSubject();
        }
      );
    }
  };
  handleSubjectChange = (e) => {
    e.preventDefault();
    if (e.target.value === "") {
      localStorage.setItem("selectedSubjectIDTest", "0");
      this.setState(
        {
          selectedSubjectID: 0,
        },
        () => {
          this.callApiForChapter();
        }
      );
    } else {
      localStorage.setItem(
        "selectedSubjectIDTest",
        this.state.listOfSubject[e.target.options.selectedIndex].subject
          .subjectId
      );
      this.setState(
        {
          selectedSubjectID: this.state.listOfSubject[
            e.target.options.selectedIndex
          ].subject.subjectId,
        },
        () => {
          this.callApiForChapter();
        }
      );
    }
  };
  handleChapterChange = (e) => {
    e.preventDefault();
    if (e.target.value === "") {
      localStorage.setItem("selectedChapterIDTest", "0");
      this.setState(
        {
          selectedChapterID: 0,
        },
        () => {
          // this.callApiForChapter();
        }
      );
    } else {
      localStorage.setItem(
        "selectedChapterIDTest",
        this.state.listOfChapter[
          e.target.options.selectedIndex
        ].subjectSection.sectionId.toString()
      );
      this.setState(
        {
          selectedChapterID: this.state.listOfChapter[
            e.target.options.selectedIndex
          ].subjectSection.sectionId,
        },
        () => {
          // this.callApiForTopic();
        }
      );
    }
  };
  handlePreviewTest = (testid) => {
    localStorage.setItem("TestPreviewId", JSON.stringify(testid));
    localStorage.setItem("TestPreviewLanguage", this.state.selectedLanguage);
    this.props.history.push({
      pathname: "/testpreview",
    });
  };
  callbackofendexam = () => {
    console.log("exam");
    if (this.state.hasMore) {
      axios({
        method: "POST",
        url: URL.searchexam + this.state.pageNo,
        data: {
          authToken: "string",
          language: this.state.selectedLanguage,
          examId: 0,
          testId: 0,
          sectionId: 0,
          subjectId: 0,
          type: null,
        },
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          // console.log(res.data.data.list);
          let currsearchResultList = this.state.searchResultList;
          if (res.status === 200) {
            this.setState({
              searchResultList: currsearchResultList.concat(res.data.data.list),
              pageNo: this.state.pageNo + 1,
              hasMore: res.data.data.hasMore,
            });
          }
        })
        .catch((e) => {
          alert(e);
          // swal('Error', "No data found","error");
        });
    }
  };
  render() {
    return (
      <Row style={{ height: "90vh" }}>
        <Col
          lg="3"
          style={{
            padding: "2.5em 2.5em",
            background: "#EEE",
            boxShadow: "rgba(0, 0, 0, 0.75) 2px 0px 4px -3px",
            zIndex: "88",
            position: "relative",
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
            listOfLanguage={this.state.listOfLanguage}
            selectedLanguage={this.state.selectedLanguage}
            handleLanguageChange={this.handleLanguageChange}
            listOfType={this.state.listOfType}
            selectedType={this.state.selectedType}
            handleTypeChange={this.handleTypeChange}
            authorList={this.props.authorList}
            userList={this.props.userList}
            userId={this.state.userId}
            authorId={this.state.authorId}
            handleAuthorChange={this.handleAuthorChange}
            handleUserChange={this.handleUserChange}
            date={this.state.date}
            handleDateChange={this.handleDateChange}
          />
        </Col>

        <Col
          style={{
            background: "#EEEEEE",
            padding: "0em 2.5em",
          }}
        >
          <Row style={{ margin: "2em 0em" }}>
            <Col lg="1.5">
              <Link
                target="_self"
                to={{
                  pathname: "/addexam",
                  // state: { authorList: this.props.authorList },
                }}
              >
                <Button
                  style={{
                    fontSize: "1em",
                    fontWeight: "700",
                    background: "#6AA3FF",
                    borderColor: "#6AA3FF",
                    borderRadius: "0",
                  }}
                >
                  {" "}
                  + Add Test
                </Button>
              </Link>
            </Col>
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
                      borderRadius: "0",
                    }}
                  />
                </Form.Group>
              </Form>
            </Col>
          </Row>
          <BottomScrollListener onBottom={this.callbackofendexam}>
            <div
              style={{
                marginBottom: "2em",
                padding: "0.4em",
              }}
            >
              {this.state.searchResultList.length > 0 ? (
                this.state.searchResultList.map((item, index) => {
                  return (
                    <Row
                      key={index}
                      style={{
                        margin: "1.5em 0em",
                      }}
                    >
                      <Col
                        style={{
                          paddingLeft: "0em",
                          paddingRight: "0em",
                        }}
                      >
                        <Card
                          style={{
                            background: "transparent",
                            borderColor: "transparent",
                          }}
                        >
                          <Card.Body style={{ padding: "0em" }}>
                            <Card.Title
                              style={{
                                fontSize: "medium",
                                marginBottom: "0.2em",
                              }}
                            >
                              <span>
                                <b>Id#</b>{" "}
                                <span style={{ color: "dimgrey" }}>
                                  {item.testId}
                                </span>
                              </span>
                              <span style={{ marginLeft: "2em" }}>
                                <OverlayTrigger
                                  placement="top"
                                  delay={{ show: 250, hide: 400 }}
                                  overlay={renderTooltip("Edit test")}
                                >
                                  <Link
                                    to={`/editexam/${item.testId}`}
                                    target="_self"
                                  >
                                    <Button
                                      size="sm"
                                      style={{
                                        borderRadius: "0",
                                        padding: ".15rem .15rem",
                                        background: "transparent",
                                        color: "rgb(106, 163, 255)",
                                        border: "none",
                                      }}
                                      variant="secondary"
                                    >
                                      {<Edit className="svg_icons" />}{" "}
                                    </Button>
                                  </Link>
                                </OverlayTrigger>

                                <OverlayTrigger
                                  placement="top"
                                  delay={{ show: 250, hide: 400 }}
                                  overlay={renderTooltip("Preview test")}
                                >
                                  <Button
                                    size="sm"
                                    style={{
                                      borderRadius: "0",
                                      marginLeft: "1em",
                                      padding: ".15rem .15rem",
                                      background: "transparent",
                                      color: "rgb(255, 137, 118)",
                                      border: "none",
                                    }}
                                    variant="secondary"
                                    onClick={this.handlePreviewTest.bind(
                                      this,
                                      item.testId
                                    )}
                                  >
                                    {<View className="svg_icons" />}{" "}
                                  </Button>
                                </OverlayTrigger>
                              </span>
                              <span
                                style={{
                                  float: "right",
                                  fontSize: "15px",
                                  fontWeight: "600",
                                }}
                              >
                                {item.active ? (
                                  <OverlayTrigger
                                    placement="top"
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={renderTooltip(
                                      "Test marked as Reviewed"
                                    )}
                                  >
                                    <span
                                      className="flagiconactive"
                                      style={{ marginRight: "1em" }}
                                    >
                                      {" "}
                                      <FlagIcon />
                                    </span>
                                  </OverlayTrigger>
                                ) : (
                                  <OverlayTrigger
                                    placement="top"
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={renderTooltip(
                                      "Test marked as Not-Reviewed"
                                    )}
                                  >
                                    <span
                                      className="flagiconnotactive"
                                      style={{ marginRight: "1em" }}
                                    >
                                      <FlagIcon />
                                    </span>
                                  </OverlayTrigger>
                                )}
                                <b>Tags: </b>
                                <span
                                  style={{
                                    color: "darkgreen",
                                    textTransform: "capitalize",
                                  }}
                                >
                                  {item.type.toLowerCase()}
                                </span>
                                {item.year && (
                                  <span>
                                    {", "}
                                    {item.year}
                                  </span>
                                )}
                              </span>
                            </Card.Title>

                            <Card.Text style={{ marginBottom: "0.5em" }}>
                              {""}
                              {item.name}
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  );
                })
              ) : (
                <Row style={{ margin: "0.5em 0em" }}>
                  <h5>No data found</h5>
                </Row>
              )}{" "}
            </div>
            {/* )} */}
          </BottomScrollListener>
        </Col>
      </Row>
    );
  }
}
function renderTooltip(name) {
  return <Tooltip>{name}</Tooltip>;
}
export default Examtab;
