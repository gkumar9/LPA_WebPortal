import React, { Component } from "react";
import { Row, Col, Button, Form, Card } from "react-bootstrap";
import Bucket from "@material-ui/icons/Https";
import Edit from "@material-ui/icons/Edit";
import View from "@material-ui/icons/Visibility";
import { Link } from "react-router-dom";
import axios from "axios";
import "./index.css";
import LeftPanelQuestion from "./leftpanelQAtab.js";
import URL from "../../Assets/url";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { withRouter } from "react-router-dom";

class QAtab extends Component {
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
      selectedLanguage: "ENGLISH",
      listOfLanguage: ["ENGLISH", "HINDI"],
      searchbox: "",
      searchResultList: [],
      listOfselectedPreview: [],
      isLoading: false,
      listOfsearchselected: [],
      searchSelectAll: false
    };
  }
  handleAddToBucket = () => {
    let tempsearchlistselected = this.state.listOfsearchselected.filter(
      item => item.status === true
    );
    tempsearchlistselected.map(item => {
      // console.log(item);
      
      return (this.onAddpreviewdata(item.id));
    });
  };
  handleSelectAllCheck = e => {
    if (e.target.checked) {
      let tempsearchlist = this.state.listOfsearchselected.map(item => {
        item.status = true;
        return item;
      });
      this.setState({
        searchSelectAll: e.target.checked,
        listOfsearchselected: tempsearchlist
      });
    } else {
      let tempsearchlist = this.state.listOfsearchselected.map(item => {
        item.status = false;
        return item;
      });
      this.setState({
        searchSelectAll: e.target.checked,
        listOfsearchselected: tempsearchlist
      });
    }
  };

  OnPreviewClick = () => {
    localStorage.setItem(
      "Previewdata",
      JSON.stringify(this.state.listOfselectedPreview)
    );
    localStorage.setItem("previewLanguage", this.state.selectedLanguage);
    this.props.history.push({
      pathname: "/quespreview",
      state: {
        data: this.state.listOfselectedPreview
      }
    });
  };

  onAddpreviewdata = id => {
    this.setState({ isLoading: true }, () => {
      let filterchecktemp = this.state.listOfselectedPreview.filter(
        item => item.questionId === id
      );
      if (filterchecktemp.length > 0) {
        // console.log('>0')
        let templist = this.state.listOfselectedPreview;
        templist = templist.filter(obj => obj.questionId !== id);
        console.log(templist);
        this.setState(
          {
            listOfselectedPreview: templist,
            isLoading: false
          },
          () => {
            localStorage.setItem("Previewdata", JSON.stringify(templist));
          }
        );
      } else {
        // console.log('<')
        axios({
          method: "POST",
          url: URL.geteditques + id,
          data: { authToken: "string" },
          headers: {
            "Content-Type": "application/json"
          }
        })
          .then(res => {
            if (res.status === 200) {
              let temppreviewlist = this.state.listOfselectedPreview;
              temppreviewlist.push(res.data.data.question);
              // let tempsearchlist = this.state.listOfsearchselected;
              // tempsearchlist[index].status = !tempsearchlist[index].status;
              this.setState(
                {
                  listOfselectedPreview: temppreviewlist,
                  // listOfsearchselected:tempsearchlist,
                  isLoading: false
                },
                () => {
                  localStorage.setItem(
                    "Previewdata",
                    JSON.stringify(temppreviewlist)
                  );
                }
              );
            } else {
              this.setState({ isLoading: false }, () => {
                alert("Data not found");
              });
            }
          })
          .catch(e => {
            this.setState({ isLoading: false }, () => {
              alert("Error found");
            });
          });
      }
    });
  };
  handleSearchboxChange = e => {
    e.preventDefault();
    console.log(e.target.value);
    this.setState({ searchbox: e.target.value });
    if (e.target.value !== "") {
      axios({
        method: "POST",
        url: URL.searchquestion + "1",
        data: {
          authToken: "string",
          language: this.state.selectedLanguage,
          questionId: e.target.value,
          sectionId: this.state.selectedChapterID
            ? this.state.selectedChapterID
            : null,
          subjectId: this.state.selectedSubjectID
            ? this.state.selectedSubjectID
            : null,
          subtopicId: this.state.selectedSubTopicID
            ? this.state.selectedSubTopicID
            : null,
          topicId: this.state.selectedTopicID
            ? this.state.selectedTopicID
            : null
        },
        headers: {
          "Content-Type": "application/json"
        }
      }).then(res => {
        // console.log(res.data.data.list);
        if (res.status === 200) {
          let templist = res.data.data.list.map(item => {
            let filtertemplist = this.state.listOfselectedPreview.filter(
              obj => obj.questionId === item.questionId
            );
            if (filtertemplist.length > 0) {
              return { id: item.questionId, status: true };
            } else {
              return { id: item.questionId, status: false };
            }
          });
          // console.log(templist);
          this.setState({
            searchResultList: res.data.data.list,
            listOfsearchselected: templist
          });
        }
      });
    } else {
      this.setState({ searchResultList: [], listOfsearchselected: [] });
    }
  };
  handlesearchWithFilter = () => {
    axios({
      method: "POST",
      url: URL.searchquestion + "1",
      data: {
        authToken: "string",
        language: this.state.selectedLanguage,
        questionId: this.state.selected,
        sectionId: this.state.selectedChapterID,
        subjectId: this.state.selectedSubjectID,
        subtopicId: this.state.selectedSubTopicID,
        topicId: this.state.selectedTopicID
      },
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => {
      // console.log(res.data.data.list);
      if (res.status === 200) {
        let templist = res.data.data.list.map(item => {
          let filtertemplist = this.state.listOfselectedPreview.filter(
            obj => obj.questionId === item.questionId
          );
          if (filtertemplist.length > 0) {
            return { id: item.questionId, status: true };
          } else {
            return { id: item.questionId, status: false };
          }
        });
        // console.log(templist);
        this.setState({
          searchResultList: res.data.data.list,
          listOfsearchselected: templist
        });
      }
    });
  };
  clearSearchFromFilters = () => {
    this.setState(
      {
        // searchResultList: [],
        // listOfsearchselected: [],
        searchbox: "",
        listOfChapter: [],
        selectedChapterID: "",
        // listOfSubject:[],
        selectedSubjectID: "",
        listOfTopic: [],
        selectedTopicID: "",
        listOfSubTopic: [],
        selectedSubTopicID: ""
      },
      () => {
        this.handlesearchWithFilter();
      }
    );
  };
  handleLanguageChange = e => {
    e.preventDefault();
    this.setState({ selectedLanguage: e.target.value }, () => {
      this.componentDidMount();
    });
  };
  componentDidMount() {
    let templistOfselectedPreview =
      localStorage.getItem("Previewdata") !== null &&
      localStorage.getItem("Previewdata") !== ""
        ? JSON.parse(localStorage.getItem("Previewdata"))
        : [];

    this.setState(
      { isLoading: false, listOfselectedPreview: templistOfselectedPreview },
      () => {
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
                  selectedSubjectID: "",
                  isLoading: false
                },
                () => {
                  axios({
                    method: "POST",
                    url: URL.searchquestion + "1",
                    data: {
                      authToken: "string",
                      language: this.state.selectedLanguage,
                      questionId: null,
                      sectionId: null,
                      subjectId: null,
                      subtopicId: null,
                      topicId: null
                    },
                    headers: {
                      "Content-Type": "application/json"
                    }
                  })
                    .then(res => {
                      // console.log(res.data.data.list);
                      if (res.status === 200) {
                        let templist = res.data.data.list.map(item => {
                          let filtertemplist = this.state.listOfselectedPreview.filter(
                            obj => obj.questionId === item.questionId
                          );
                          if (filtertemplist.length > 0) {
                            return { id: item.questionId, status: true };
                          } else {
                            return { id: item.questionId, status: false };
                          }
                        });
                        // console.log(templist);
                        this.setState({
                          searchResultList: res.data.data.list,
                          listOfsearchselected: templist
                        });
                      }
                    })
                    .catch(e => {
                      alert(e);
                    });
                }
              );
            } else {
              alert("Unexpected code");
              this.setState({ isLoading: false });
            }
          })
          .catch(e => {
            console.log(e);
            alert(e);
            this.setState({ isLoading: false });
          });
      }
    );
  }
  callApiForChapter = () => {
    // console.log(this.state.selectedSubjectID);
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
          alert(e);
          this.setState({ isLoading: false });
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
        selectedSubTopicID: "",
        isLoading: false
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
          alert(e);
          this.setState({ isLoading: false });
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
          alert(e);
          this.setState({ isLoading: false });
        });
    } else {
      console.log("(English)topicid is blank.API not called. checktopic list");
      this.setState({ listOfSubTopic: [], selectedSubTopicID: "" });
    }
  };
  handleSubjectChange = e => {
    e.preventDefault();
    // console.log(e.target.value)
    if (e.target.value === "") {
      this.setState(
        {
          selectedSubjectID: ""
        },
        () => {
          this.callApiForChapter();
        }
      );
    } else {
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
    }
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
  handleInputChangeCheckboxlistsearch = (index, e) => {
    let tempsearchlist = this.state.listOfsearchselected;
    tempsearchlist[index].status = e.target.checked;
    this.setState({ listOfsearchselected: tempsearchlist });
  };
  render() {
    return (
      <React.Fragment>
        {this.state.isLoading ? (
          <center>
            <Loader
              type="TailSpin"
              color="#00BFFF"
              height={120}
              width={250}
              // timeout={3000} //3 secs
            />
          </center>
        ) : (
          <Row style={{ height: "90vh" }}>
            <Col
              lg="3"
              style={{
                padding: "2.5em 3em",
                background: "#EEE",
                // borderRight: "1px solid #cac2c2",
                boxShadow: "rgba(0, 0, 0, 0.75) 2px 0px 4px -3px",
                zIndex: "88",
                position: "relative",
                // margin: "2em 0em"
              }}
            >
              <LeftPanelQuestion
                searchResultListLength={this.state.searchResultList.length}
                handlesearchWithFilter={this.handlesearchWithFilter}
                clearSearchFromFilters={this.clearSearchFromFilters}
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
                listOfLanguage={this.state.listOfLanguage}
                selectedlanguage={this.state.selectedLanguage}
                handleLanguageChange={this.handleLanguageChange}
              />
            </Col>
            <Col
              style={{
                background: "#EEEEEE",
                // height: "90vh",
                padding: "0em 4em"
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
                      + Add Question
                    </Button>
                  </Link>
                  {/* </BrowserRouter> */}
                </Col>
                <Col>
                  <Button
                    onClick={this.OnPreviewClick}
                    style={{
                      fontSize: "1em",
                      fontWeight: "700",
                      background: "#FF8976",
                      borderColor: "#FF8976",
                      borderRadius: "0",
                      float: "right"
                    }}
                  >
                    {" "}
                    <View className="svg_icons" /> Bucket
                  </Button>
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
                Add new and review prevoius question and answers.
                <br></br>
                Please select the filter on left for accessing best results.
              </p>
            </Col> */}
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
                      id="custom-switch"
                      label="Select all"
                      checked={this.state.searchSelectAll}
                      onChange={this.handleSelectAllCheck}
                    />
                  </Col>

                  <Col style={{ paddingRight: "0em" }}>
                    <Button
                      onClick={this.handleAddToBucket}
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
                  <Col lg="6" />
                </Row>
              )}
              <div
                style={{
                  // height: "45vh",
                  overflow: "scroll",
                  // border: "1px solid lightgrey",
                  // background: "white",
                  padding: "0.4em"
                }}
              >
                {this.state.searchResultList.length > 0 &&
                  this.state.searchResultList.map((item, index) => {
                    return (
                      <Row
                        key={item.questionId}
                        style={{
                          margin: "1.5em 0em"
                          // borderTop: "1px #c2c2c2 solid",
                          // borderBottom: "1px #c2c2c2 solid"
                        }}
                      >
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
                            <Card.Body
                              style={{ padding: "0", margin: "0.5em 0" }}
                            >
                              <Card.Title style={{ fontSize: "medium" }}>
                                <Form.Check
                                  inline
                                  type="checkbox"
                                  checked={
                                    this.state.listOfsearchselected[index]
                                      .status
                                  }
                                  onChange={this.handleInputChangeCheckboxlistsearch.bind(
                                    this,
                                    index
                                  )}
                                />

                                <span>
                                  <b>Id#</b>{" "}
                                  <span style={{ color: "dimgrey" }}>
                                    {item.questionId}
                                  </span>
                                </span>
                                <span style={{ marginLeft: "1em" }}>
                                  <Button
                                    title={
                                      this.state.listOfselectedPreview.filter(
                                        objj =>
                                          objj.questionId === item.questionId
                                      ).length > 0
                                        ? "Added to bucket"
                                        : "Add to bucket"
                                    }
                                    size="sm"
                                    style={
                                      this.state.listOfselectedPreview.filter(
                                        objj =>
                                          objj.questionId === item.questionId
                                      ).length > 0
                                        ? {
                                            background: "transparent",
                                            borderRadius: "0",
                                            padding: ".15rem .15rem",
                                            border: "none",
                                            color: "#FF8976"
                                          }
                                        : {
                                            borderRadius: "0",
                                            padding: ".15rem .15rem",
                                            background: "transparent",
                                            border: "none",
                                            color: "grey"
                                          }
                                    }
                                    onClick={this.onAddpreviewdata.bind(
                                      this,
                                      item.questionId
                                    )}
                                    variant="primary"
                                  >
                                    {<Bucket className="svg_icons" />}{" "}
                                  </Button>
                                  <Link
                                    to={`/editques/${this.state.selectedLanguage}/${item.questionId}`}
                                    target="_self"
                                  >
                                    <Button
                                      title="Edit"
                                      size="sm"
                                      style={{
                                        borderRadius: "0",
                                        marginLeft: "1em",
                                        padding: ".15rem .15rem",
                                        background: "transparent",
                                        color: "red",
                                        border: "none"
                                      }}
                                      variant="secondary"

                                      // onClick={this.handleQAEdit.bind(this,item.questionId)}
                                    >
                                      {<Edit className="svg_icons" />}{" "}
                                    </Button>
                                  </Link>
                                </span>
                                <span
                                  style={{
                                    float: "right",
                                    fontSize: "15px",
                                    fontWeight: "600"
                                  }}
                                >
                                  <b>Tags: </b>
                                  <span style={{ color: "#1D4B7F" }}>
                                    Difficulty:{" "}
                                    {item.level === "EASY"
                                      ? item.level === "MILD"
                                        ? "++"
                                        : "+"
                                      : item.level === "MILD"
                                      ? "++"
                                      : "+++"}
                                  </span>
                                  ,
                                  <span
                                    style={{
                                      color: "darkgreen",
                                      textTransform: "lowercase"
                                    }}
                                  >
                                    {" "}
                                    {item.type}
                                  </span>
                                </span>
                              </Card.Title>

                              <Card.Text style={{ marginBottom: "0.5em" }}>
                                {""}
                                {item.content.replace(/<\/?[^>]+(>|$)/g, "")}
                              </Card.Text>
                              {/* <div style={{ float: "right" }}>
                                <Button
                                  title={
                                    this.state.listOfselectedPreview.filter(
                                      objj =>
                                        objj.questionId === item.questionId
                                    ).length > 0
                                      ? "Added to bucket"
                                      : "Add to bucket"
                                  }
                                  size="sm"
                                  style={
                                    this.state.listOfselectedPreview.filter(
                                      objj =>
                                        objj.questionId === item.questionId
                                    ).length > 0
                                      ? {
                                          background: "green",
                                          borderRadius: "0",
                                          padding: ".15rem .15rem"
                                        }
                                      : {
                                          borderRadius: "0",
                                          padding: ".15rem .15rem"
                                        }
                                  }
                                  onClick={this.onAddpreviewdata.bind(
                                    this,
                                    item.questionId
                                  )}
                                  variant="primary"
                                >
                                  {<Bucket className="svg_icons" />}{" "}
                                </Button>
                                <Link
                                  to={`/editques/${this.state.selectedLanguage}/${item.questionId}`}
                                  target="_self"
                                >
                                  <Button
                                    title="Edit"
                                    size="sm"
                                    style={{
                                      borderRadius: "0",
                                      marginLeft: "1em",
                                      padding: ".15rem .15rem"
                                    }}
                                    variant="secondary"

                                    // onClick={this.handleQAEdit.bind(this,item.questionId)}
                                  >
                                    {<Edit className="svg_icons" />}{" "}
                                  </Button>
                                </Link>
                              </div> */}
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
        )}
      </React.Fragment>
    );
  }
}
export default withRouter(QAtab);
