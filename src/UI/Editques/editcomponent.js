import React, { Component } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import TagsInput from "react-tagsinput";
import Difficulty from "./difficulty.js";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import { Pramukhime } from "./../../Assets/pramukhime/plugin";
import axios from "axios";
import "react-tagsinput/react-tagsinput.css"; // If using WebPack and style-loader.
import "./index.css";
import URL from "../../Assets/url";

class EditComponent extends Component {
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
      questionData: "",
      explanationData: "",
      listOfOptions: [],
      letterchartcode: 65
    };
  }
  addoptionfn = () => {
    let currentCharCode = this.state.letterchartcode;
    let name = "Option " + String.fromCharCode(currentCharCode);
    let currentArrayOfOption = this.state.listOfOptions;
    currentArrayOfOption.push({ name: name, content: "", weightage: null });
    this.setState({
      listOfOptions: currentArrayOfOption,
      letterchartcode: currentCharCode + 1
    });
  };
  deleteOption = index => {
    let currentCharCode = this.state.letterchartcode;
    let currentArrayOfOption = this.state.listOfOptions;
    currentArrayOfOption.pop(index);
    this.setState({
      listOfOptions: currentArrayOfOption,
      letterchartcode: currentCharCode - 1
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
    let difficultyvalue;
    switch (this.props.fetchedData.level) {
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

    this.setState({
      difficulty: difficultyvalue,
      questionData: this.props.fetchedData.questionVersions[0].content,
      explanationData: this.props.fetchedData.questionVersions[0].solution,
      listOfOptions: this.props.fetchedData.questionVersions[0].options,
      letterchartcode:
        this.props.fetchedData.questionVersions[0].options.length + 65
    });
    axios({
      method: "POST",
      url:
        URL.fetchSubject + this.props.fetchedData.questionVersions[0].language,
      data: { authToken: "string" },
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        // console.log(res.data.data);

        if (res.status === 200) {
          let templist = res.data.data.list.filter(
            item => item.subject.subjectId === this.props.fetchedData.subjectId
          );
          if (templist.length > 0) {
            this.setState(
              {
                listOfSubject: res.data.data.list,
                selectedSubjectID:
                  res.data.data.list.length > 0
                    ? this.props.fetchedData.subjectId
                    : ""
              },
              () => {
                this.callApiForChapter();
              }
            );
          } else {
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
          }
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
          this.props.fetchedData.questionVersions[0].language,
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
                this.props.fetchedData.sectionId
            );
            if (templist.length > 0) {
              this.setState(
                {
                  listOfChapter: res.data.data.list,
                  selectedChapterID:
                    res.data.data.list.length > 0
                      ? this.props.fetchedData.sectionId
                      : ""
                },
                () => {
                  this.callApiForTopic();
                }
              );
            } else {
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
            }
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
          this.props.fetchedData.questionVersions[0].language,
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
                item.subjectTopic.topicId === this.props.fetchedData.topicId
            );
            if (templist.length > 0) {
              this.setState(
                {
                  listOfTopic: res.data.data.list,
                  selectedTopicID:
                    res.data.data.list.length > 0
                      ? this.props.fetchedData.topicId
                      : ""
                },
                () => {
                  this.callApiForSubTopic();
                }
              );
            } else {
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
            }
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
          this.props.fetchedData.questionVersions[0].language,
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
                this.props.fetchedData.subtopicId
            );
            if (templist.length > 0) {
              this.setState({
                listOfSubTopic: res.data.data.list,
                selectedSubTopicID:
                  res.data.data.list.length > 0
                    ? this.props.fetchedData.subtopicId
                    : ""
              });
            } else {
              this.setState({
                listOfSubTopic: res.data.data.list,
                selectedSubTopicID:
                  res.data.data.list.length > 0
                    ? res.data.data.list[0].subjectSubtopic.subtopicId
                    : ""
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
  handleQuestionEditor = data => {
    this.setState({ questionData: data });
  };
  handleExplanationEditor = data => {
    this.setState({ explanationData: data });
  };
  handleOptioncontentchange = (index, data) => {
    // let currentCharCode = this.state.letterchartcode;
    // let name = "Option " + String.fromCharCode(currentCharCode);
    // console.log(index, data);
    let currentArrayOfOption = this.state.listOfOptions;
    currentArrayOfOption[index].content = data;
    this.setState({
      listOfOptions: currentArrayOfOption
    });
  };
  handleOptionWeightageChange = (index, e) => {
    e.preventDefault();
    // console.log(typeof parseInt(e.target.value));
    let currentArrayOfOption = this.state.listOfOptions;
    currentArrayOfOption[index].weightage = parseInt(e.target.value);
    this.setState({
      listOfOptions: currentArrayOfOption
    });
  };
  savedata = () => {
    let difficultyvalue;
    switch (this.state.difficulty) {
      case "+":
        difficultyvalue = "EASY";
        break;
      case "++":
        difficultyvalue = "MILD";
        break;
      case "+++":
        difficultyvalue = "ADVANCE";
        break;
      default:
        break;
    }
    axios({
      method: "POST",
      url: URL.updateExistingQuestionVersion,
      data: {
        authToken: "string",
        difficulty: difficultyvalue,
        questionId: this.props.questionId,
        sectionId: this.state.selectedChapterID,
        subjectId: this.state.selectedSubjectID,
        subtopicId: this.state.selectedSubTopicID,
        tags: this.state.tags,
        topicId: this.state.selectedTopicID,
        type: "SINGLE_CHOICE",
        version: {
          content: this.state.questionData,
          language: this.props.fetchedData.questionVersions[0].language,
          options: this.state.listOfOptions,
          questionVersionId: this.props.fetchedData.questionVersions[0]
            .questionVersionId,
          solution: this.state.explanationData
        }
      },
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (res.status === 200) {
          console.log(res.data.data);
          alert("success", res.data.data);
        }
      })
      .catch(e => {
        console.log(e);
      });
  };
  render() {
    return (
      //   <Container>
      <div style={{ padding: "20px 0", margin: "0 1em" }}>
        <Row>
          <Col lg="3">
            <div
              style={{
                width: "auto"
                //   height: "0.5em"
              }}
            >
              <LeftPanel
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
              />
            </div>
          </Col>
          <Col lg="1"></Col>
          <Col>
            <div>
              <RightpanelEnglish
                handleQuestionEditor={this.handleQuestionEditor}
                questionData={this.state.questionData}
                handleExplanationEditor={this.handleExplanationEditor}
                explanationData={this.state.explanationData}
                listOfOptions={this.state.listOfOptions}
                letterchartcode={this.state.letterchartcode}
                handleOptioncontentchange={this.handleOptioncontentchange}
                handleOptionWeightageChange={this.handleOptionWeightageChange}
                addoptionfn={this.addoptionfn}
                deleteOption={this.deleteOption}
                savedata={this.savedata}
              />
            </div>
          </Col>
          <Col lg="1"></Col>
        </Row>
      </div>
      //   </Container>
    );
  }
}

class LeftPanel extends Component {
  render() {
    let currentvaluesubject = this.props.listOfSubject.filter(
      item => item.subject.subjectId === this.props.selectedSubjectID
    )[0];
    currentvaluesubject = currentvaluesubject
      ? currentvaluesubject.subjectName
      : "";
    let currentvaluechapter = this.props.listOfChapter.filter(
      item => item.subjectSection.sectionId === this.props.selectedChapterID
    )[0];
    currentvaluechapter = currentvaluechapter
      ? currentvaluechapter.sectionName
      : "";

    let currentvaluetopic = this.props.listOfTopic.filter(
      item => item.subjectTopic.topicId === this.props.selectedTopicID
    )[0];
    currentvaluetopic = currentvaluetopic ? currentvaluetopic.title : "";
    let currentvaluesubtopic = this.props.listOfSubTopic.filter(
      item => item.subjectSubtopic.subtopicId === this.props.selectedSubTopicID
    )[0];
    currentvaluesubtopic = currentvaluesubtopic
      ? currentvaluesubtopic.title
      : "";
    return (
      <Form>
        <Form.Group controlId="exampleForm.ControlSelect1">
          <Form.Label
            style={{
              fontWeight: "600"
            }}
          >
            Subject
          </Form.Label>
          <Form.Control
            style={{ borderRadius: "0" }}
            size="sm"
            as="select"
            // defaultValue=""
            onChange={this.props.handleSubjectChange}
            value={currentvaluesubject}
          >
            {this.props.listOfSubject &&
              this.props.listOfSubject.map((item, index) => {
                return (
                  <option key={index} value={item.subjectName}>
                    {item.subjectName}
                  </option>
                );
              })}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlSelect2">
          <Form.Label
            style={{
              fontWeight: "600"
            }}
          >
            Chapter
          </Form.Label>
          <Form.Control
            style={{ borderRadius: "0" }}
            size="sm"
            as="select"
            value={currentvaluechapter}
            onChange={this.props.handleChapterChange}
          >
            {this.props.listOfChapter &&
              this.props.listOfChapter.map((item, index) => {
                return (
                  <option key={index} value={item.sectionName}>
                    {item.sectionName}
                  </option>
                );
              })}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlSelect3">
          <Form.Label
            style={{
              fontWeight: "600"
            }}
          >
            Topic
          </Form.Label>
          <Form.Control
            style={{ borderRadius: "0" }}
            size="sm"
            as="select"
            value={currentvaluetopic}
            onChange={this.props.handleTopicChange}
          >
            {this.props.listOfTopic &&
              this.props.listOfTopic.map((item, index) => {
                return (
                  <option key={index} value={item.title}>
                    {item.title}
                  </option>
                );
              })}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlSelect4">
          <Form.Label
            style={{
              fontWeight: "600"
            }}
          >
            Sub-topic
          </Form.Label>
          <Form.Control
            style={{ borderRadius: "0" }}
            size="sm"
            as="select"
            value={currentvaluesubtopic}
            onChange={this.props.handleSubTopicChange}
          >
            {this.props.listOfSubTopic &&
              this.props.listOfSubTopic.map((item, index) => {
                return (
                  <option key={index} value={item.title}>
                    {item.title}
                  </option>
                );
              })}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlInput1">
          <Form.Label
            style={{
              fontWeight: "600"
            }}
          >
            Tags
          </Form.Label>
          <TagsInput
            value={this.props.tags}
            onChange={this.props.handleChangeTags}
          />
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlTextarea1">
          <Form.Label
            style={{
              fontWeight: "600"
            }}
          >
            Difficulty
          </Form.Label>
          <br />
          <Difficulty
            difficulty={this.props.difficulty}
            handleDifficultyRadio={this.props.handleDifficultyRadio}
          />
        </Form.Group>
      </Form>
    );
  }
}
class RightpanelEnglish extends Component {
  render() {
    // console.log(this.props.questionData);
    return (
      <Form>
        {this.props.questionData && (
          <QuestionComp
            // ClassicEditor={ClassicEditor}
            handleQuestionEditor={this.props.handleQuestionEditor}
            questionData={this.props.questionData}
          />
        )}
        {this.props.listOfOptions &&
          this.props.listOfOptions.map((item, index) => {
            return (
              <React.Fragment key={index}>
                <Form.Group as={Row} style={{ marginTop: "2em" }}>
                  <Form.Label column sm="2" style={{ fontWeight: "600" }}>
                    {"Option " + String.fromCharCode(65 + index)}
                  </Form.Label>
                  <Col sm="2">
                    <Form.Control
                      style={{ borderRadius: "0", background: "lightgrey" }}
                      type="number"
                      value={item.weightage || 0}
                      onChange={this.props.handleOptionWeightageChange.bind(
                        this,
                        index
                      )}
                      placeholder="weightage"
                    />
                  </Col>
                  {this.props.listOfOptions.length === index + 1 && (
                    <Col>
                      <Button
                        style={{ float: "right", color: "grey" }}
                        variant="link"
                        onClick={this.props.deleteOption.bind(this, index)}
                      >
                        X Delete
                      </Button>
                    </Col>
                  )}
                </Form.Group>
                <div style={{ margin: "0.5em 0" }}>
                  <CKEditor
                    editor={ClassicEditor}
                    data={item.content}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      this.props.handleOptioncontentchange(index, data);
                    }}
                  />
                </div>
              </React.Fragment>
            );
          })}
        <Row>
          <Col lg="10"></Col>
          <Col>
            <Button
              onClick={this.props.addoptionfn}
              varirant="info"
              style={{
                fontSize: "0.8em",
                fontWeight: "700",
                background: "#FF8976",
                borderColor: "#FF8976",
                borderRadius: "0",
                float: "right"
              }}
            >
              {" "}
              + Add Option
            </Button>
          </Col>
        </Row>
        <div style={{ margin: "2em 0" }}>
          {this.props.explanationData && (
            <ExplanationComp
              handleExplanationEditor={this.props.handleExplanationEditor}
              explanationData={this.props.explanationData}
            />
          )}
        </div>

        <div style={{ margin: "1em 0", textAlign: "center" }}>
          <Button
            style={{
              borderRadius: "0",
              background: "#3F5FBB",
              borderColor: "#3F5FBB",
              padding: "0.6em 2.5em",
              fontSize: "1.1em",
              fontWeight: "600"
            }}
            onClick={this.props.savedata}
          >
            Update data
          </Button>
        </div>
      </Form>
    );
  }
}
function QuestionComp({ questionData, handleQuestionEditor }) {
  return (
    <Form.Group controlId="exampleForm.EControlInput3">
      <Form.Label
        style={{
          fontWeight: "600"
        }}
      >
        Question
      </Form.Label>
      <div
        style={{
          margin: "0.5em 0"
        }}
      >
        <CKEditor
          editor={ClassicEditor}
          data={questionData}
          //   config={{
          //     plugins: [Pramukhime]
          //   }}
          onChange={(event, editor) => {
            const data = editor.getData();

            handleQuestionEditor(data);
          }}
        />
      </div>
    </Form.Group>
  );
}
function ExplanationComp({ explanationData, handleExplanationEditor }) {
  //   console.log(explanationData);
  return (
    <Form.Group controlId="exampleForm.EControlInput1">
      <Form.Label
        style={{
          fontWeight: "600"
        }}
      >
        Explanation
      </Form.Label>
      <div
        style={{
          margin: "0.5em 0"
        }}
      >
        <CKEditor
          editor={ClassicEditor}
          data={explanationData}
          onInit={editor => {
            // You can store the "editor" and use when it is needed.
            // console.log("Editor is ready to use!", editor);
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            handleExplanationEditor(data);
          }}
        />
      </div>
    </Form.Group>
  );
}
export default EditComponent;
