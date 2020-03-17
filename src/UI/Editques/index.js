import React, { Component } from "react";
import { Tab, Container, Row, Col, Nav } from "react-bootstrap";
import Header from "../Header/index";
import axios from "axios";
import URL from "../../Assets/url";
import EditComponent from "./editcomponent.js";
import swal from "sweetalert";

const style = {
  textAlign: "center",
  background: "white",
  borderRadius: "2em",
  color: "black",
  padding: " 0.3em 2em",
  letterSpacing: "0.2em"
};
class Editques extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      // tags: [],
      difficulty: "+",
      tags: [],
      suggestions: [],
      apisugges: [],

      questionId: this.props.match.params.id,
      fetchedData: null,
      activetab: this.props.match.params.lang
    };
  }
  onDelete = i => {
    // e.preventDefault()
    const tags = this.state.tags.slice(0);
    tags.splice(i, 1);
    this.setState({ tags });
  };

  onAddition = tag => {
    // e.preventDefault()
    const tags = [].concat(this.state.tags, tag);
    let suggestions = this.state.apisugges;
    // let tempapisugges = this.state.apisugges;
    this.setState({ tags, suggestions });
  };
  handleChangeTags = tags => {
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
            "Content-Type": "application/json"
          }
        }).then(res => {
          if (res.status === 200) {
            if (res.data.data.list.length > 0) {
              let temp = res.data.data.list.map(item => {
                return { id: item.tagId, name: item.tag };
              });
              tempsugg = temp;
              tempsugg = tempsugg.concat(tempapisugges);
              // eslint-disable-next-line array-callback-return
              tempsugg = tempsugg.filter(function(a) {
                var key = a.id + "|" + a.name;
                if (!this[key]) {
                  this[key] = true;
                  return true;
                }
              }, Object.create(null));
              tempapisugges = tempapisugges.concat(temp);
              // eslint-disable-next-line array-callback-return
              let result = tempapisugges.filter(function(a) {
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
  handleSelect = () => {
    let activetab = this.state.activetab;
    if (activetab === "ENGLISH") {
      this.setState({ activetab: "HINDI" });
    } else {
      this.setState({ activetab: "ENGLISH" });
    }
  };
  handleDifficultyRadio = e => {
    e.preventDefault();
    this.setState({ difficulty: e.target.value });
  };
  componentDidMount() {
    // console.log(this.props.match.params.lang)
    if (
      JSON.parse(localStorage.getItem("editquesdata")) &&
      JSON.parse(localStorage.getItem("editquesdata")) !== null
    ) {
      let difficultyvalue;
      switch (JSON.parse(localStorage.getItem("editquesdata")).level) {
        case "EASY":
          difficultyvalue = "+";
          break;
        case "MILD":
          difficultyvalue = "++";
          break;
        case "ADVANCE":
          difficultyvalue = "+++";
          break;
        default:
          break;
      }
      this.setState(
        {
          fetchedData: JSON.parse(localStorage.getItem("editquesdata")),
          tags: JSON.parse(localStorage.getItem("editquesdata")).tags.map(
            item => {
              return { id: item.tagId, name: item.tag };
            }
          ),
          difficulty: difficultyvalue
        },
        () => {
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
                let templist = res.data.data.list.filter(
                  item =>
                    item.subject.subjectId === this.state.fetchedData.subjectId
                );
                if (templist.length > 0) {
                  this.setState(
                    {
                      listOfSubjectEnglish: res.data.data.list,
                      selectedSubjectID:
                        res.data.data.list.length > 0
                          ? this.state.fetchedData.subjectId
                          : ""
                    },
                    () => {
                      this.callApiForChapter();
                    }
                  );
                } else {
                  this.setState(
                    {
                      listOfSubjectEnglish: res.data.data.list,
                      selectedSubjectID:
                        res.data.data.list.length > 0
                          ? res.data.data.list[0].subject.subjectId
                          : ""
                    },
                    () => {
                      this.callApiForChapter();
                    }
                  );
                }
              } else {
                alert("Unexpected code");
              }
            })
            .catch(e => {
              console.log(e);
              alert(e);
            });
          //Hindi
          axios({
            method: "POST",
            url: URL.fetchSubject + "HINDI",
            data: { authToken: "string" },
            headers: {
              "Content-Type": "application/json"
            }
          })
            .then(res => {
              // console.log(res.data.data);

              if (res.status === 200) {
                let templist = res.data.data.list.filter(
                  item =>
                    item.subject.subjectId === this.state.fetchedData.subjectId
                );
                if (templist.length > 0) {
                  this.setState(
                    {
                      listOfSubjectHindi: res.data.data.list
                      // selectedSubjectID:
                      //   res.data.data.list.length > 0
                      //     ? this.state.fetchedData.subjectId
                      //     : ""
                    },
                    () => {
                      // this.callApiForChapter();
                    }
                  );
                } else {
                  this.setState(
                    {
                      listOfSubjectHindi: res.data.data.list
                      // selectedSubjectID:
                      //   res.data.data.list.length > 0
                      //     ? res.data.data.list[0].subject.subjectId
                      //     : ""
                    },
                    () => {
                      // this.callApiForChapter();
                    }
                  );
                }
              } else {
                alert("Unexpected code");
              }
            })
            .catch(e => {
              console.log(e);
              alert(e);
            });
        }
      );
    } else {
      // alert("No Data found");
      axios({
        method: "POST",
        url: URL.geteditques + this.state.questionId,
        data: { authToken: "string" },
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          console.log(res.data.data.question);
          if (res.status === 200) {
            let difficultyvalue;
            switch (res.data.data.question.level) {
              case "EASY":
                difficultyvalue = "+";
                break;
              case "MILD":
                difficultyvalue = "++";
                break;
              case "ADVANCE":
                difficultyvalue = "+++";
                break;
              default:
                break;
            }
            localStorage.setItem(
              "editquesdata",
              JSON.stringify(res.data.data.question)
            );
            this.setState(
              {
                fetchedData: res.data.data.question,
                tags: res.data.data.question.tags.map(item => {
                  return { id: item.tagId, name: item.tag };
                }),
                difficulty: difficultyvalue
              },
              () => {
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
                      let templist = res.data.data.list.filter(
                        item =>
                          item.subject.subjectId ===
                          this.state.fetchedData.subjectId
                      );
                      if (templist.length > 0) {
                        this.setState(
                          {
                            listOfSubjectEnglish: res.data.data.list,
                            selectedSubjectID:
                              res.data.data.list.length > 0
                                ? this.state.fetchedData.subjectId
                                : ""
                          },
                          () => {
                            this.callApiForChapter();
                          }
                        );
                      } else {
                        this.setState(
                          {
                            listOfSubjectEnglish: res.data.data.list,
                            selectedSubjectID:
                              res.data.data.list.length > 0
                                ? res.data.data.list[0].subject.subjectId
                                : ""
                          },
                          () => {
                            this.callApiForChapter();
                          }
                        );
                      }
                    } else {
                      alert("Unexpected code");
                    }
                  })
                  .catch(e => {
                    console.log(e);
                    alert(e);
                  });
                //Hindi
                axios({
                  method: "POST",
                  url: URL.fetchSubject + "HINDI",
                  data: { authToken: "string" },
                  headers: {
                    "Content-Type": "application/json"
                  }
                })
                  .then(res => {
                    // console.log(res.data.data);

                    if (res.status === 200) {
                      let templist = res.data.data.list.filter(
                        item =>
                          item.subject.subjectId ===
                          this.state.fetchedData.subjectId
                      );
                      if (templist.length > 0) {
                        this.setState(
                          {
                            listOfSubjectHindi: res.data.data.list
                            // selectedSubjectID:
                            //   res.data.data.list.length > 0
                            //     ? this.state.fetchedData.subjectId
                            //     : ""
                          },
                          () => {
                            // this.callApiForChapter();
                          }
                        );
                      } else {
                        this.setState(
                          {
                            listOfSubjectHindi: res.data.data.list
                            // selectedSubjectID:
                            //   res.data.data.list.length > 0
                            //     ? res.data.data.list[0].subject.subjectId
                            //     : ""
                          },
                          () => {
                            // this.callApiForChapter();
                          }
                        );
                      }
                    } else {
                      alert("Unexpected code");
                    }
                  })
                  .catch(e => {
                    console.log(e);
                    alert(e);
                  });
              }
            );
          } else {
            swal("Error", "No data found", "error");
            // alert(e);
            this.props.history.push({
              pathname: "/"
            });
          }
        })
        .catch(e => {
          // swal('Error', "No data found","error");
          alert(e);
          this.props.history.push({
            pathname: "/"
          });
        });
    }
  }
  callApiForChapter = () => {
    if (this.state.selectedSubjectID !== "") {
      axios({
        method: "POST",
        url: URL.fetchChapter + this.state.selectedSubjectID + "/ENGLISH",
        data: { authToken: "string" },
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          if (res.status === 200) {
            let templist = res.data.data.list.filter(
              item =>
                item.subjectSection.sectionId ===
                this.state.fetchedData.sectionId
            );
            if (templist.length > 0) {
              this.setState(
                {
                  listOfChapterEnglish: res.data.data.list,
                  selectedChapterID:
                    res.data.data.list.length > 0
                      ? this.state.fetchedData.sectionId
                      : ""
                },
                () => {
                  this.callApiForChapterHindi();
                  this.callApiForTopic();
                }
              );
            } else {
              this.setState(
                {
                  listOfChapterEnglish: res.data.data.list,
                  selectedChapterID:
                    res.data.data.list.length > 0
                      ? res.data.data.list[0].subjectSection.sectionId
                      : ""
                },
                () => {
                  this.callApiForChapterHindi();
                  this.callApiForTopic();
                }
              );
            }
          } else {
            alert("Unexpected code");
          }
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      // console.log(
      //   "(English)subjectid is blank. API not called. checksubject list"
      // );
      this.setState({
        listOfChapterEnglish: [],
        selectedChapterID: 0,
        listOfTopicEnglish: [],
        selectedTopicID: 0,
        listOfSubTopicEnglish: [],
        selectedSubTopicID: 0,
        listOfChapterHindi: [],

        listOfTopicHindi: [],

        listOfSubTopicHindi: []
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
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          if (res.status === 200) {
            let templist = res.data.data.list.filter(
              item =>
                item.subjectSection.sectionId ===
                this.state.fetchedData.sectionId
            );
            if (templist.length > 0) {
              this.setState(
                {
                  listOfChapterHindi: res.data.data.list
                  // selectedChapterID:
                  //   res.data.data.list.length > 0
                  //     ? this.state.fetchedData.sectionId
                  //     : ""
                },
                () => {
                  // this.callApiForTopic();
                }
              );
            } else {
              this.setState(
                {
                  listOfChapterHindi: res.data.data.list
                  // selectedChapterID:
                  //   res.data.data.list.length > 0
                  //     ? res.data.data.list[0].subjectSection.sectionId
                  //     : ""
                },
                () => {
                  // this.callApiForTopic();
                }
              );
            }
          } else {
            alert("Unexpected code");
          }
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      // console.log(
      //   "(English)subjectid is blank. API not called. checksubject list"
      // );
      this.setState({
        listOfChapterHindi: [],
        selectedChapterID: 0,
        listOfTopicHindi: [],
        selectedTopicID: 0,
        listOfSubTopicHindi: [],
        selectedSubTopicID: 0
      });
    }
  };
  callApiForTopic = () => {
    if (this.state.selectedChapterID !== "") {
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
            let templist = res.data.data.list.filter(
              item =>
                item.subjectTopic.topicId === this.state.fetchedData.topicId
            );
            if (templist.length > 0) {
              this.setState(
                {
                  listOfTopicEnglish: res.data.data.list,
                  selectedTopicID:
                    res.data.data.list.length > 0
                      ? this.state.fetchedData.topicId
                      : ""
                },
                () => {
                  this.callApiForTopicHindi();
                  this.callApiForSubTopic();
                }
              );
            } else {
              this.setState(
                {
                  listOfTopicEnglish: res.data.data.list
                  // selectedTopicID:
                  //   res.data.data.list.length > 0
                  //     ? res.data.data.list[0].subjectTopic.topicId
                  //     : ""
                },
                () => {
                  this.callApiForTopicHindi();
                  this.callApiForSubTopic();
                }
              );
            }
          } else {
            alert("Unexpected code");
          }
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      // console.log(
      //   "(English)chapterid is blank.API not called. checkchapter list"
      // );
      this.setState({
        listOfTopicEnglish: [],
        listOfTopicHindi: [],
        selectedTopicID: 0,
        listOfSubTopicEnglish: [],
        listOfSubTopicHindi: [],
        selectedSubTopicID: 0
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
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          // console.log(res.data.data);
          if (res.status === 200) {
            let templist = res.data.data.list.filter(
              item =>
                item.subjectTopic.topicId === this.state.fetchedData.topicId
            );
            if (templist.length > 0) {
              this.setState(
                {
                  listOfTopicHindi: res.data.data.list
                  // selectedTopicID:
                  //   res.data.data.list.length > 0
                  //     ? this.state.fetchedData.topicId
                  //     : ""
                },
                () => {
                  // this.callApiForSubTopic();
                }
              );
            } else {
              this.setState(
                {
                  listOfTopicHindi: res.data.data.list
                  // selectedTopicID:
                  //   res.data.data.list.length > 0
                  //     ? res.data.data.list[0].subjectTopic.topicId
                  //     : ""
                },
                () => {
                  // this.callApiForSubTopic();
                }
              );
            }
          } else {
            alert("Unexpected code");
          }
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      // console.log(
      //   "(English)chapterid is blank.API not called. checkchapter list"
      // );
      this.setState({
        listOfTopicHindi: [],
        selectedTopicID: 0,
        listOfSubTopicHindi: [],
        selectedSubTopicID: 0
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
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          // console.log(res.data.data);
          if (res.status === 200) {
            let templist = res.data.data.list.filter(
              item =>
                item.subjectSubtopic.subtopicId ===
                this.state.fetchedData.subtopicId
            );
            if (templist.length > 0) {
              this.setState(
                {
                  listOfSubTopicEnglish: res.data.data.list,
                  selectedSubTopicID:
                    res.data.data.list.length > 0
                      ? this.state.fetchedData.subtopicId
                      : ""
                },
                () => {
                  this.callApiForSubTopicHindi();
                }
              );
            } else {
              this.setState(
                {
                  listOfSubTopicEnglish: res.data.data.list,
                  selectedSubTopicID:
                    res.data.data.list.length > 0
                      ? res.data.data.list[0].subjectSubtopic.subtopicId
                      : ""
                },
                () => {
                  this.callApiForSubTopicHindi();
                }
              );
            }
          } else {
            alert("Unexpected code");
          }
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      // console.log("(English)topicid is blank.API not called. checktopic list");
      this.setState({
        listOfSubTopicEnglish: [],
        listOfSubTopicHindi: [],
        selectedSubTopicID: 0
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
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          // console.log(res.data.data);
          if (res.status === 200) {
            let templist = res.data.data.list.filter(
              item =>
                item.subjectSubtopic.subtopicId ===
                this.state.fetchedData.subtopicId
            );
            if (templist.length > 0) {
              this.setState({
                listOfSubTopicHindi: res.data.data.list
                // selectedSubTopicID:
                //   res.data.data.list.length > 0
                //     ? this.state.fetchedData.subtopicId
                //     : ""
              });
            } else {
              this.setState({
                listOfSubTopicHindi: res.data.data.list
                // selectedSubTopicID:
                //   res.data.data.list.length > 0
                //     ? res.data.data.list[0].subjectSubtopic.subtopicId
                //     : ""
              });
            }
          } else {
            alert("Unexpected code");
          }
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      // console.log("(English)topicid is blank.API not called. checktopic list");
      this.setState({ listOfSubTopicHindi: [], selectedSubTopicID: 0 });
    }
  };
  handleSubjectChange = e => {
    e.preventDefault();
    if (
      e.target.value.split("").filter(function(char) {
        var charCode = char.charCodeAt();
        return charCode >= 2309 && charCode <= 2361;
      }).length > 0
    ) {
      this.setState(
        {
          selectedSubjectID: this.state.listOfSubjectHindi[
            e.target.options.selectedIndex
          ].subject.subjectId
        },
        () => {
          this.callApiForChapter();
        }
      );
    } else {
      this.setState(
        {
          selectedSubjectID: this.state.listOfSubjectEnglish[
            e.target.options.selectedIndex
          ].subject.subjectId
        },
        () => {
          this.callApiForChapter();
        }
      );
    }
  };
  handleChapterChange = e => {
    e.preventDefault();
    // console.log( e.target.value)
    if (
      e.target.value.split("").filter(function(char) {
        var charCode = char.charCodeAt();
        return charCode >= 2309 && charCode <= 2361;
      }).length > 0
    ) {
      // console.log('hindi')
      this.setState(
        {
          selectedChapterID: this.state.listOfChapterHindi[
            e.target.options.selectedIndex
          ].subjectSection.sectionId
        },
        () => {
          this.callApiForTopic();
        }
      );
    } else {
      // console.log('english')
      this.setState(
        {
          selectedChapterID: this.state.listOfChapterEnglish[
            e.target.options.selectedIndex
          ].subjectSection.sectionId
        },
        () => {
          this.callApiForTopic();
        }
      );
    }
  };
  handleTopicChange = e => {
    e.preventDefault();
    if (
      e.target.value.split("").filter(function(char) {
        var charCode = char.charCodeAt();
        return charCode >= 2309 && charCode <= 2361;
      }).length > 0
    ) {
      this.setState(
        {
          selectedTopicID: this.state.listOfTopicHindi[
            e.target.options.selectedIndex
          ].subjectTopic.topicId
        },
        () => {
          this.callApiForSubTopic();
        }
      );
    } else {
      this.setState(
        {
          selectedTopicID: this.state.listOfTopicEnglish[
            e.target.options.selectedIndex
          ].subjectTopic.topicId
        },
        () => {
          this.callApiForSubTopic();
        }
      );
    }
  };
  handleSubTopicChange = e => {
    e.preventDefault();
    if (
      e.target.value.split("").filter(function(char) {
        var charCode = char.charCodeAt();
        return charCode >= 2309 && charCode <= 2361;
      }).length > 0
    ) {
      this.setState({
        selectedSubTopicID: this.state.listOfSubTopicHindi[
          e.target.options.selectedIndex
        ].subjectSubtopic.subtopicId
      });
    } else {
      this.setState({
        selectedSubTopicID: this.state.listOfSubTopicEnglish[
          e.target.options.selectedIndex
        ].subjectSubtopic.subtopicId
      });
    }
  };
  render() {
    return (
      <React.Fragment>
        <Header props={this.props} />
        <Container
          fluid
          style={{ width: "auto", background: "#EEEEEE", padding: "0" }}
        >
          <Tab.Container
            activeKey={this.state.activetab}
            onSelect={key => this.handleSelect(key)}
          >
            <Row
              style={{
                margin: "0",
                padding: "1em 0em",
                borderBottom: "1px solid #cac2c2",
                boxShadow: "-1px 3px 4px -5px rgba(0, 0, 0, 0.75)",
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
                  eventKey="ENGLISH"
                  style={
                    this.state.activetab === "ENGLISH"
                      ? style
                      : {
                          color: "dimgrey",
                          letterSpacing: "0.2em",
                          padding: " 0.3em 2em"
                        }
                  }
                >
                  <span style={{ fontSize: "larger" }}>English </span>
                </Nav.Link>
              </Col>
              <Col
                lg="1.5"
                style={{
                  padding: "0 "
                }}
              >
                <Nav.Link
                  eventKey="HINDI"
                  style={
                    this.state.activetab === "HINDI"
                      ? style
                      : {
                          color: "dimgrey",
                          letterSpacing: "0.2em",
                          padding: " 0.3em 2em"
                        }
                  }
                >
                  <span style={{ fontSize: "larger" }}>Hindi</span>
                </Nav.Link>
              </Col>
              <Col>
                <h6
                  style={{
                    float: "right",
                    marginTop: "0.5em",
                    marginRight: "1em",
                    textAlign: "right"
                  }}
                >
                  Editing question Id: #{this.state.questionId}
                  <br />
                  {this.state.fetchedData &&
                    this.state.fetchedData.questionVersions.filter(
                      item => item.language === this.state.activetab
                    ).length === 0 && (
                      <small
                        style={{
                          marginBottom: "-0.9em",
                          float: "right",
                          fontSize: "0.7em",
                          color: "dimgrey"
                        }}
                      >
                        <sup>*</sup>You are adding new version to this Id
                      </small>
                    )}
                </h6>
              </Col>
            </Row>
            <Tab.Content>
              <Tab.Pane eventKey="ENGLISH">
                {this.state.fetchedData && (
                  <EditComponent
                    questionId={this.state.questionId}
                    fetchedData={this.state.fetchedData}
                    match={this.props.match}
                    lang="ENGLISH"
                    listOfSubject={this.state.listOfSubjectEnglish}
                    listOfChapter={this.state.listOfChapterEnglish}
                    listOfTopic={this.state.listOfTopicEnglish}
                    listOfSubTopic={this.state.listOfSubTopicEnglish}
                    handleSubjectChange={this.handleSubjectChange}
                    handleChapterChange={this.handleChapterChange}
                    handleTopicChange={this.handleTopicChange}
                    handleSubTopicChange={this.handleSubTopicChange}
                    selectedSubjectID={this.state.selectedSubjectID}
                    selectedChapterID={this.state.selectedChapterID}
                    selectedTopicID={this.state.selectedTopicID}
                    selectedSubTopicID={this.state.selectedSubTopicID}
                    tags={this.state.tags}
                    suggestions={this.state.suggestions}
                    onAddition={this.onAddition}
                    onDelete={this.onDelete}
                    handleChangeTags={this.handleChangeTags}
                    difficulty={this.state.difficulty}
                    handleDifficultyRadio={this.handleDifficultyRadio}
                  />
                )}
              </Tab.Pane>
              <Tab.Pane eventKey="HINDI">
                {this.state.fetchedData && (
                  <EditComponent
                    questionId={this.state.questionId}
                    fetchedData={this.state.fetchedData}
                    match={this.props.match}
                    lang="HINDI"
                    listOfSubject={this.state.listOfSubjectHindi}
                    listOfChapter={this.state.listOfChapterHindi}
                    listOfTopic={this.state.listOfTopicHindi}
                    listOfSubTopic={this.state.listOfSubTopicHindi}
                    handleSubjectChange={this.handleSubjectChange}
                    handleChapterChange={this.handleChapterChange}
                    handleTopicChange={this.handleTopicChange}
                    handleSubTopicChange={this.handleSubTopicChange}
                    selectedSubjectID={this.state.selectedSubjectID}
                    selectedChapterID={this.state.selectedChapterID}
                    selectedTopicID={this.state.selectedTopicID}
                    selectedSubTopicID={this.state.selectedSubTopicID}
                    tags={this.state.tags}
                    suggestions={this.state.suggestions}
                    onAddition={this.onAddition}
                    onDelete={this.onDelete}
                    handleChangeTags={this.handleChangeTags}
                    difficulty={this.state.difficulty}
                    handleDifficultyRadio={this.handleDifficultyRadio}
                  />
                )}
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Container>
      </React.Fragment>
    );
  }
}

export default Editques;
