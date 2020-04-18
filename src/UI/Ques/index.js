import React, { Component } from "react";
import { Button, Container, Tab, Nav, Row, Col } from "react-bootstrap";
import Header from "../Header/index"; // If using WebPack and style-loader.
import "./index.css";
import EnglishHQuesTab from "./QuesEnglish.js";
import HindiQuesTab from "./QuesHindi.js";
import axios from "axios";
import URL from "../../Assets/url";
const style = {
  textAlign: "center",
  background: "white",
  borderRadius: "2em",
  color: "black",
  padding: " 0.3em 2em",
  letterSpacing: "0.2em",
};
class Ques extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionId: 0,
      activetab: "english",

      listOfSubjectEnglish: [],
      listOfSubjectHindi: [],
      selectedSubjectID: 0,

      listOfChapterEnglish: [],
      listOfChapterHindi: [],
      selectedChapterID: 0,

      listOfTopicEnglish: [],
      listOfTopicHindi: [],
      selectedTopicID: 0,

      listOfSubTopicEnglish: [],
      listOfSubTopicHindi: [],
      selectedSubTopicID: 0,

      difficulty: "+",
      tags: [],
      suggestions: [],
      apisugges: [],
      authorList: [],
      selectedAuthorId: 0,
    };
  }

  handleSelect = () => {
    let activetab = this.state.activetab;
    if (activetab === "english") {
      this.setState({ activetab: "hindi" });
    } else {
      this.setState({ activetab: "english" });
    }
  };

  handleChange = (data) => {
    if (data && this.state.questionId === 0) {
      this.setState({ questionId: data });
    } else if (data) {
      this.setState({ questionId: 0 });
    }
  };

  handlereset = () => {
    this.setState({ questionId: 0 });
    this.handleSelect();
  };
  onDelete = (i) => {
    // e.preventDefault()
    const tags = this.state.tags.slice(0);
    tags.splice(i, 1);
    this.setState({ tags });
  };
  onAddition = (tag) => {
    // e.preventDefault()
    const tags = [].concat(this.state.tags, tag);
    let suggestions = this.state.apisugges;
    // let tempapisugges = this.state.apisugges;
    this.setState({ tags, suggestions });
  };
  handleDifficultyRadio = (e) => {
    e.preventDefault();
    this.setState({ difficulty: e.target.value });
  };
  handleChangeTags = (tags) => {
    // console.log(tags);
    let tempsugg = this.state.suggestions;
    let tempapisugges = this.state.apisugges;
    // console.log("apisugges", tempapisugges);
    // tempsugg=tempsugg.filter((item)=>item.id!==999)
    tempsugg.push({ id: null, name: tags });
    this.setState({ suggestions: tempsugg }, () => {
      if (tags) {
        axios({
          method: "POST",
          url: URL.tagsearch + tags,
          data: { authToken: "string" },
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => {
          if (res.status === 200) {
            if (res.data.data.list.length > 0) {
              let temp = res.data.data.list.map((item) => {
                return { id: item.tagId, name: item.tag };
              });
              tempsugg = temp;
              tempsugg = tempsugg.concat(tempapisugges);
              // eslint-disable-next-line array-callback-return
              tempsugg = tempsugg.filter(function (a) {
                var key = a.id + "|" + a.name;
                if (!this[key]) {
                  this[key] = true;
                  return true;
                }
              }, Object.create(null));
              tempapisugges = tempapisugges.concat(temp);
              // eslint-disable-next-line array-callback-return
              let result = tempapisugges.filter(function (a) {
                var key = a.id + "|" + a.name;
                if (!this[key]) {
                  this[key] = true;
                  return true;
                }
              }, Object.create(null));
              tempsugg.push({ id: null, name: tags });
              this.setState({ suggestions: tempsugg, apisugges: result });
              // console.log(tempsugg);
            } else {
              // console.log(tempsugg);
            }
          }
        });
      }
    });

    // console.log(tempsugg)
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
        this.setState({
          authorList: res.data.data.list,
          selectedAuthorId: localStorage.getItem("addquesAuthorID")
            ? parseInt(localStorage.getItem("addquesAuthorID"))
            : 0,
        });
      })
      .catch((e) => {
        console.log(e);
      });
    axios({
      method: "POST",
      url: URL.fetchSubject + "ENGLISH",
      data: { authToken: "string" },
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          this.setState(
            {
              listOfSubjectEnglish: res.data.data.list,
              selectedSubjectID: localStorage.getItem("addquesSubjectID")
                ? parseInt(localStorage.getItem("addquesSubjectID"))
                : // : res.data.data.list.length > 0
                  // ? res.data.data.list[0].subject.subjectId
                  0,
            },
            () => {
              // localStorage.setItem("addquesSubjectID", "0");

              this.callApiForChapter();
            }
          );
        } else {
          alert("Unexpected code");
        }
      })
      .catch((e) => {
        console.log(e);
        // swal( e, "error");
      });
    //Hindi
    axios({
      method: "POST",
      url: URL.fetchSubject + "HINDI",
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
              listOfSubjectHindi: res.data.data.list,
              // selectedSubjectID:
              //   res.data.data.list.length > 0
              //     ? res.data.data.list[0].subject.subjectId
              //     : 0
            },
            () => {
              // this.callApiForChapterHindi();
            }
          );
        } else {
          alert("Unexpected code");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }
  callApiForChapter = () => {
    if (this.state.selectedSubjectID !== 0) {
      axios({
        method: "POST",
        url: URL.fetchChapter + this.state.selectedSubjectID + "/ENGLISH",
        data: { authToken: "string" },
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (res.status === 200) {
            this.setState(
              {
                listOfChapterEnglish: res.data.data.list,

                selectedChapterID: localStorage.getItem("addquesChapterID")
                  ? parseInt(localStorage.getItem("addquesChapterID"))
                  : // : res.data.data.list.length > 0
                    // ? res.data.data.list[0].subjectSection.sectionId
                    0,
              },
              () => {
                this.callApiForChapterHindi();
                this.callApiForTopic();
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
      // console.log(
      //   "(English)subjectid is blank. API not called. checksubject list"
      // );
      // localStorage.setItem("addquesSubjectID", "0");
      localStorage.setItem("addquesChapterID", "0");
      localStorage.setItem("addquesTopicID", "0");
      localStorage.setItem("addquesSubTopicID", "0");
      this.setState({
        listOfChapterEnglish: [],
        selectedChapterID: 0,
        listOfTopicEnglish: [],
        selectedTopicID: 0,
        listOfSubTopicEnglish: [],
        selectedSubTopicID: 0,
        listOfChapterHindi: [],
        // selectedChapterID: 0,
        listOfTopicHindi: [],
        // selectedTopicID: 0,
        listOfSubTopicHindi: [],
      });
    }
  };
  callApiForChapterHindi = () => {
    if (this.state.selectedSubjectID !== "") {
      axios({
        method: "POST",
        url: URL.fetchChapter + this.state.selectedSubjectID + "/HINDI",
        data: { authToken: "string" },
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (res.status === 200) {
            this.setState(
              {
                listOfChapterHindi: res.data.data.list,
                // selectedChapterID:
                //   res.data.data.list.length > 0
                //     ? res.data.data.list[0].subjectSection.sectionId
                //     : 0
              },
              () => {
                // this.callApiForTopicHindi();
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
      // console.log(
      //   "(Hindi)subjectid is blank. API not called. checksubject list"
      // );
      localStorage.setItem("addquesChapterID", "0");
      localStorage.setItem("addquesTopicID", "0");
      localStorage.setItem("addquesSubTopicID", "0");
      this.setState({
        listOfChapterHindi: [],
        selectedChapterID: 0,
        listOfTopicHindi: [],
        selectedTopicID: 0,
        listOfSubTopicHindi: [],
        selectedSubTopicID: 0,
      });
    }
  };
  callApiForTopic = () => {
    if (this.state.selectedChapterID !== 0) {
      axios({
        method: "POST",
        url: URL.fetchTopic + this.state.selectedChapterID + "/ENGLISH",
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
                listOfTopicEnglish: res.data.data.list,

                selectedTopicID: localStorage.getItem("addquesTopicID")
                  ? parseInt(localStorage.getItem("addquesTopicID"))
                  : // : res.data.data.list.length > 0
                    // ? res.data.data.list[0].subjectTopic.topicId
                    0,
              },
              () => {
                this.callApiForTopicHindi();
                this.callApiForSubTopic();
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
      // console.log(
      //   "(English)chapterid is blank.API not called. checkchapter list"
      // );
      // localStorage.setItem("addquesChapterID", "0");
      localStorage.setItem("addquesTopicID", "0");
      localStorage.setItem("addquesSubTopicID", "0");
      this.setState({
        listOfTopicEnglish: [],
        selectedTopicID: 0,
        listOfSubTopicEnglish: [],
        // selectedSubTopicID: 0,
        listOfTopicHindi: [],
        // selectedTopicID: 0,
        listOfSubTopicHindi: [],
      });
    }
  };
  callApiForTopicHindi = () => {
    if (this.state.selectedChapterID !== "") {
      axios({
        method: "POST",
        url: URL.fetchTopic + this.state.selectedChapterID + "/HINDI",
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
                listOfTopicHindi: res.data.data.list,
                // selectedTopicID:
                //   res.data.data.list.length > 0
                //     ? res.data.data.list[0].subjectTopic.topicId
                //     : 0
              },
              () => {
                // this.callApiForSubTopicHindi();
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
      // console.log(
      //   "(Hindi)chapterid is blank.API not called. checkchapter list"
      // );
      localStorage.setItem("addquesTopicID", "0");
      localStorage.setItem("addquesSubTopicID", "0");
      this.setState({
        listOfTopicHindi: [],
        selectedTopicID: 0,
        listOfSubTopicHindi: [],
        selectedSubTopicID: 0,
        // listOfSubTopicHindi: [],
      });
    }
  };
  callApiForSubTopic = () => {
    if (this.state.selectedTopicID !== "") {
      axios({
        method: "POST",
        url: URL.fetchSubTopic + this.state.selectedTopicID + "/ENGLISH",
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
                listOfSubTopicEnglish: res.data.data.list,

                selectedSubTopicID: localStorage.getItem("addquesSubTopicID")
                  ? parseInt(localStorage.getItem("addquesSubTopicID"))
                  : // : res.data.data.list.length > 0
                    // ? res.data.data.list[0].subjectSubtopic.subtopicId
                    0,
              },
              () => {
                this.callApiForSubTopicHindi();
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
      // console.log("(English)topicid is blank.API not called. checktopic list");
      // localStorage.setItem("addquesTopicID", "0");
      localStorage.setItem("addquesSubTopicID", "0");
      this.setState({
        listOfSubTopicEnglish: [],
        listOfSubTopicHindi: [],
        selectedSubTopicID: 0,
      });
    }
  };
  callApiForSubTopicHindi = () => {
    if (this.state.selectedTopicID !== "") {
      axios({
        method: "POST",
        url: URL.fetchSubTopic + this.state.selectedTopicID + "/HINDI",
        data: { authToken: "string" },
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          // console.log(res.data.data);
          if (res.status === 200) {
            this.setState({
              listOfSubTopicHindi: res.data.data.list,
              // selectedSubTopicID:
              //   res.data.data.list.length > 0
              //     ? res.data.data.list[0].subjectSubtopic.subtopicId
              //     : 0
            });
          } else {
            alert("Unexpected code");
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      console.log("(Hindi)topicid is blank.API not called. checktopic list");
      this.setState({ listOfSubTopicHindi: [], selectedSubTopicID: 0 });
    }
  };
  handleSubjectChange = (e) => {
    console.log(e.target.value);
    if (e.target.value === "") {
      localStorage.setItem("addquesSubjectID", "0");
      this.setState(
        {
          selectedSubjectID: 0,
        },
        () => {
          this.callApiForChapter();
        }
      );
    } else {
      if (
        e.target.value.split("").filter(function (char) {
          var charCode = char.charCodeAt();
          return charCode >= 2309 && charCode <= 2361;
        }).length > 0
      ) {
        this.setState(
          {
            selectedSubjectID: this.state.listOfSubjectHindi[
              e.target.options.selectedIndex
            ].subject.subjectId,
          },
          () => {
            this.callApiForChapter();
          }
        );
        localStorage.setItem(
          "addquesSubjectID",
          this.state.listOfSubjectHindi[e.target.options.selectedIndex].subject
            .subjectId
        );
      } else {
        this.setState(
          {
            selectedSubjectID: this.state.listOfSubjectEnglish[
              e.target.options.selectedIndex
            ].subject.subjectId,
          },
          () => {
            this.callApiForChapter();
          }
        );
        localStorage.setItem(
          "addquesSubjectID",
          this.state.listOfSubjectEnglish[e.target.options.selectedIndex]
            .subject.subjectId
        );
      }
    }
  };
  handleChapterChange = (e) => {
    // e.preventDefault();
    // console.log( e.target.value)
    if (e.target.value === "") {
      localStorage.setItem("addquesChapterID", "0");
      this.setState(
        {
          selectedChapterID: 0,
        },
        () => {
          this.callApiForTopic();
        }
      );
    } else {
      if (
        e.target.value.split("").filter(function (char) {
          var charCode = char.charCodeAt();
          return charCode >= 2309 && charCode <= 2361;
        }).length > 0
      ) {
        // console.log('hindi')
        this.setState(
          {
            selectedChapterID: this.state.listOfChapterHindi[
              e.target.options.selectedIndex
            ].subjectSection.sectionId,
          },
          () => {
            this.callApiForTopic();
          }
        );
        localStorage.setItem(
          "addquesChapterID",
          this.state.listOfChapterHindi[e.target.options.selectedIndex]
            .subjectSection.sectionId
        );
      } else {
        // console.log('english')
        this.setState(
          {
            selectedChapterID: this.state.listOfChapterEnglish[
              e.target.options.selectedIndex
            ].subjectSection.sectionId,
          },
          () => {
            this.callApiForTopic();
          }
        );
        localStorage.setItem(
          "addquesChapterID",
          this.state.listOfChapterEnglish[e.target.options.selectedIndex]
            .subjectSection.sectionId
        );
      }
    }
  };
  handleTopicChange = (e) => {
    // e.preventDefault();

    if (e.target.value === "") {
      localStorage.setItem("addquesTopicID", "0");
      this.setState(
        {
          selectedTopicID: 0,
        },
        () => {
          this.callApiForSubTopic();
        }
      );
    } else {
      if (
        e.target.value.split("").filter(function (char) {
          var charCode = char.charCodeAt();
          return charCode >= 2309 && charCode <= 2361;
        }).length > 0
      ) {
        this.setState(
          {
            selectedTopicID: this.state.listOfTopicHindi[
              e.target.options.selectedIndex
            ].subjectTopic.topicId,
          },
          () => {
            this.callApiForSubTopic();
          }
        );
        localStorage.setItem(
          "addquesTopicID",
          this.state.listOfTopicHindi[e.target.options.selectedIndex]
            .subjectTopic.topicId
        );
      } else {
        this.setState(
          {
            selectedTopicID: this.state.listOfTopicEnglish[
              e.target.options.selectedIndex
            ].subjectTopic.topicId,
          },
          () => {
            this.callApiForSubTopic();
          }
        );
        localStorage.setItem(
          "addquesTopicID",
          this.state.listOfTopicEnglish[e.target.options.selectedIndex]
            .subjectTopic.topicId
        );
      }
    }
  };
  handleSubTopicChange = (e) => {
    // e.preventDefault();
    if (e.target.value === "") {
      localStorage.setItem("addquesSubTopicID", "0");
      this.setState({
        selectedSubTopicID: 0,
      });
    } else {
      if (
        e.target.value.split("").filter(function (char) {
          var charCode = char.charCodeAt();
          return charCode >= 2309 && charCode <= 2361;
        }).length > 0
      ) {
        this.setState(
          {
            selectedSubTopicID: this.state.listOfSubTopicHindi[
              e.target.options.selectedIndex
            ].subjectSubtopic.subtopicId,
          },
          () => {}
        );
        localStorage.setItem(
          "addquesSubTopicID",
          this.state.listOfSubTopicHindi[e.target.options.selectedIndex]
            .subjectSubtopic.subtopicId
        );
      } else {
        this.setState(
          {
            selectedSubTopicID: this.state.listOfSubTopicEnglish[
              e.target.options.selectedIndex
            ].subjectSubtopic.subtopicId,
          },
          () => {}
        );
        localStorage.setItem(
          "addquesSubTopicID",
          this.state.listOfSubTopicEnglish[e.target.options.selectedIndex]
            .subjectSubtopic.subtopicId
        );
      }
    }
  };
  handleAuthorChange = (e) => {
    // e.preventDefault();
    if (e.target.value === "") {
      localStorage.setItem("addquesAuthorID", "0");
      this.setState({
        selectedAuthorId: 0,
      });
    } else {
      this.setState(
        {
          selectedAuthorId: this.state.authorList[
            e.target.options.selectedIndex
          ].authorId,
        },
        () => {}
      );
      localStorage.setItem(
        "addquesAuthorID",
        this.state.authorList[
          e.target.options.selectedIndex
        ].authorId.toString()
      );
    }
  };
  render() {
    return (
      <React.Fragment>
        <Header props={this.props} />
        <Container fluid style={{ width: "auto", background: "#EEEEEE" }}>
          <Tab.Container
            activeKey={this.state.activetab}
            onSelect={(key) => this.handleSelect(key)}
          >
            <Row
              style={{
                padding: "1em 0em",
                borderBottom: "1px solid #cac2c2",
                boxShadow: "-1px 3px 4px -5px rgba(0, 0, 0, 0.75)",
                zIndex: "99",
                position: "relative",
              }}
            >
              {/* <Col lg="3"></Col> */}
              <Col
                lg="1.5"
                // className="customtabcolor"
                style={{
                  margin: "0px 0em 0em 3em",
                }}
              >
                <Nav.Link
                  eventKey="english"
                  style={
                    this.state.activetab === "english"
                      ? style
                      : {
                          color: "dimgrey",
                          letterSpacing: "0.2em",
                          padding: " 0.3em 2em",
                        }
                  }
                >
                  <span style={{ fontSize: "larger" }}>English </span>
                </Nav.Link>
              </Col>
              <Col
                lg="1.5"
                style={{
                  padding: "0 ",
                }}
              >
                <Nav.Link
                  eventKey="hindi"
                  style={
                    this.state.activetab === "hindi"
                      ? style
                      : {
                          color: "dimgrey",
                          letterSpacing: "0.2em",
                          padding: " 0.3em 2em",
                        }
                  }
                >
                  <span style={{ fontSize: "larger" }}>Hindi</span>
                </Nav.Link>
              </Col>
              <Col>
                {this.state.questionId !== 0 && this.state.questionId && (
                  <Button
                    onClick={this.handlereset}
                    style={{
                      float: "right",
                      fontSize: "1em",
                      fontWeight: "500",
                      background: "#dad8d8",
                      borderColor: "#dad8d8",
                      borderRadius: "0",
                      marginRight: "3em",
                      color: " #676767",
                    }}
                  >
                    {" "}
                    Skip version
                  </Button>
                )}
              </Col>
            </Row>
            <Tab.Content>
              <Tab.Pane eventKey="english">
                <EnglishHQuesTab
                  questionId={this.state.questionId}
                  handleChange={this.handleChange}
                  handleSelect={this.handleSelect}
                  selectedSubjectID={this.state.selectedSubjectID}
                  selectedChapterID={this.state.selectedChapterID}
                  selectedTopicID={this.state.selectedTopicID}
                  selectedSubTopicID={this.state.selectedSubTopicID}
                  listOfChapter={this.state.listOfChapterEnglish}
                  listOfSubTopic={this.state.listOfSubTopicEnglish}
                  listOfTopic={this.state.listOfTopicEnglish}
                  listOfSubject={this.state.listOfSubjectEnglish}
                  handleChapterChange={this.handleChapterChange}
                  handleSubTopicChange={this.handleSubTopicChange}
                  handleTopicChange={this.handleTopicChange}
                  handleSubjectChange={this.handleSubjectChange}
                  handleChangeTags={this.handleChangeTags}
                  handleDifficultyRadio={this.handleDifficultyRadio}
                  onAddition={this.onAddition}
                  onDelete={this.onDelete}
                  tags={this.state.tags}
                  suggestions={this.state.suggestions}
                  difficulty={this.state.difficulty}
                  selectedAuthorId={this.state.selectedAuthorId}
                  authorList={this.state.authorList}
                  handleAuthorChange={this.handleAuthorChange}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="hindi">
                <HindiQuesTab
                  questionId={this.state.questionId}
                  handleChange={this.handleChange}
                  handleSelect={this.handleSelect}
                  selectedSubjectID={this.state.selectedSubjectID}
                  selectedChapterID={this.state.selectedChapterID}
                  selectedTopicID={this.state.selectedTopicID}
                  selectedSubTopicID={this.state.selectedSubTopicID}
                  listOfChapter={this.state.listOfChapterHindi}
                  listOfSubTopic={this.state.listOfSubTopicHindi}
                  listOfTopic={this.state.listOfTopicHindi}
                  listOfSubject={this.state.listOfSubjectHindi}
                  handleChapterChange={this.handleChapterChange}
                  handleSubTopicChange={this.handleSubTopicChange}
                  handleTopicChange={this.handleTopicChange}
                  handleSubjectChange={this.handleSubjectChange}
                  handleChangeTags={this.handleChangeTags}
                  handleDifficultyRadio={this.handleDifficultyRadio}
                  onAddition={this.onAddition}
                  onDelete={this.onDelete}
                  tags={this.state.tags}
                  suggestions={this.state.suggestions}
                  difficulty={this.state.difficulty}
                  selectedAuthorId={this.state.selectedAuthorId}
                  authorList={this.state.authorList}
                  handleAuthorChange={this.handleAuthorChange}
                />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Container>
      </React.Fragment>
    );
  }
}
export default Ques;
