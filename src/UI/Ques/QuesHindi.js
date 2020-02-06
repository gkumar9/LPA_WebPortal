import React, { Component } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
// import CKEditor from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import CKEditor from "ckeditor4-react";
import axios from "axios";
import URL from "../../Assets/url";
// import TagsInput from "react-tagsinput";
import ReactTags from "react-tag-autocomplete";
import Difficulty from "./difficulty.js";
// import "react-tagsinput/react-tagsinput.css";
import "./index.css";

class QuesHindi extends Component {
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
      // tags: [],
      difficulty: "",
      questionData: "",
      explanationData: "",
      listOfOptions: [
        { name: "Option A", content: "", weightage: null },
        { name: "Option B", content: "", weightage: null }
      ],
      letterchartcode: 67,
      tags: [],
      suggestions: [],
      apisugges: []
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
    let currentArrayOfOption = this.state.listOfOptions;
    let letterchartcode = 65;

    currentArrayOfOption.splice(index, 1);
    currentArrayOfOption = currentArrayOfOption.map(item => {
      let name = "Option " + String.fromCharCode(letterchartcode);
      letterchartcode++;
      return { name: name, content: item.content, weightage: item.weightage };
    });

    this.setState({
      listOfOptions: currentArrayOfOption,
      letterchartcode: letterchartcode
    });
  };
  handleDifficultyRadio = e => {
    e.preventDefault();
    this.setState({ difficulty: e.target.value });
  };
  // handleChangeTags = tags => {
  //   this.setState({ tags });
  // };
  componentDidMount() {
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
        url: URL.fetchChapter + this.state.selectedSubjectID + "/HINDI",
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
        "(Hindi)subjectid is blank. API not called. checksubject list"
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
        url: URL.fetchTopic + this.state.selectedChapterID + "/HINDI",
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
        "(Hindi)chapterid is blank.API not called. checkchapter list"
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
        url: URL.fetchSubTopic + this.state.selectedTopicID + "/HINDI",
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
      console.log("(Hindi)topicid is blank.API not called. checktopic list");
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
  saveHindidata = () => {
    console.log("questionId:", this.props.questionId);
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
      url:
        this.props.questionId === ""
          ? URL.createQuestion
          : URL.createQuestionNewVersion,
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
          language: "HINDI",
          options: this.state.listOfOptions,
          // questionVersionId: 0,
          solution: this.state.explanationData
        }
      },
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        console.log(res.data.data);
        if (res.status === 200) {
          alert("Success:", res.data.data);
          if (this.props.questionId === "") {
            alert("success in Hindi:", res.data.data);
            this.props.handleChange.bind(this, res.data.data.questionId);
            this.props.handleSelect();
          }
        } else {
          console.log("questionId exist");
        }
        // if (res.status === 200) {

        // }
      })
      .catch(e => {
        console.log(e);
        alert(e);
      });
  };
  render() {
    return (
      <div>
        <Row>
          <Col
            lg="3"
            style={{
              padding: "0em 3em",
              background: "#EEE",
              borderRight: "1px solid #cac2c2",
              boxShadow: "2px 2px 5px -2px rgba(0, 0, 0, 0.75)",
              zIndex: "88",
              position: "relative"
            }}
          >
            <div
              style={{
                width: "auto",
                margin: "2.5em 0em"
                // height: "0.5em"
              }}
            ></div>
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
              suggestions={this.state.suggestions}
              onAddition={this.onAddition}
              onDelete={this.onDelete}
              handleChangeTags={this.handleChangeTags}
              difficulty={this.state.difficulty}
              handleDifficultyRadio={this.handleDifficultyRadio}
            />
          </Col>

          <Col
            style={{
              background: "#EEEEEE",
              // height: "90vh",
              padding: "0em 4em"
            }}
          >
            <div style={{ margin: "2.5em 0em" }}>
              <RightpanelHindi
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
                saveHindidata={this.saveHindidata}
              />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
class RightpanelHindi extends Component {
  render() {
    return (
      <Form>
        <QuestionComp
          // ClassicEditor={ClassicEditor}
          handleQuestionEditor={this.props.handleQuestionEditor}
          questionData={this.props.questionData}
        />
        {this.props.listOfOptions &&
          this.props.listOfOptions.map((item, index) => {
            return (
              <React.Fragment key={index}>
                <Form.Group as={Row} style={{ marginTop: "2em" }}>
                  <Form.Label column sm="2" style={{ fontWeight: "600" }}>
                    {item.name}
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
                  {/* {this.props.listOfOptions.length === index + 1 && ( */}
                  <Col>
                    <Button
                      style={{ float: "right", color: "grey" }}
                      variant="link"
                      onClick={this.props.deleteOption.bind(this, index)}
                    >
                      X Delete
                    </Button>
                  </Col>
                  {/* )} */}
                </Form.Group>
                <div style={{ margin: "0.5em 0" }}>
                  <CKEditor
                    onBeforeLoad={CKEDITOR =>
                      (CKEDITOR.disableAutoInline = true)
                    }
                    config={{
                      height: 80
                      // placeholder: "Test description and instruction in English"
                    }}
                    data={item.content}
                    onChange={event => {
                      const data = event.editor.getData();
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
          <ExplanationComp
            handleExplanationEditor={this.props.handleExplanationEditor}
            explanationData={this.props.explanationData}
          />
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
            onClick={this.props.saveHindidata}
          >
            {this.props.questionId === "" || this.props.questionId === undefined
              ? "Save & move to English section"
              : "Save & finish"}
          </Button>
        </div>
      </Form>
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
        <Form.Group controlId="exampleForm.ControlSelect11">
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
        <Form.Group controlId="exampleForm.ControlSelect22">
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
        <Form.Group controlId="exampleForm.ControlSelect33">
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
        <Form.Group controlId="exampleForm.ControlSelect44">
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
        <Form.Group controlId="exampleForm.ControlInput11">
          <Form.Label
            style={{
              fontWeight: "600"
            }}
          >
            Tags
          </Form.Label>
          <ReactTags
            // style={{width:'100%'}}
            tags={this.props.tags}
            onInput={this.props.handleChangeTags}
            suggestions={this.props.suggestions}
            onDelete={this.props.onDelete.bind(this)}
            onAddition={this.props.onAddition.bind(this)}
          />
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlTextarea11">
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

function QuestionComp({ questionData, handleQuestionEditor }) {
  return (
    <Form.Group controlId="exampleForm.EControlInput33">
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
          onBeforeLoad={CKEDITOR => (CKEDITOR.disableAutoInline = true)}
          config={{
            height: 80
            // placeholder: "Test description and instruction in English"
          }}
          data={questionData}
          // onInit={editor => {
          //   // You can store the "editor" and use when it is needed.
          //   // console.log("Editor is ready to use!", editor);
          // }}
          onChange={event => {
            const data = event.editor.getData();
            // console.log(data)
            handleQuestionEditor(data);
            // console.log({
            //   event,
            //   editor,
            //   data
            // });
          }}
          // onBlur={(event, editor) => {
          //   console.log("Blur.", editor);
          // }}
          // onFocus={(event, editor) => {
          //   console.log("Focus.", editor);
          // }}
        />
      </div>
    </Form.Group>
  );
}
function ExplanationComp({ explanationData, handleExplanationEditor }) {
  return (
    <Form.Group controlId="exampleForm.EControlInput11">
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
          onBeforeLoad={CKEDITOR => (CKEDITOR.disableAutoInline = true)}
          config={{
            height: 80
            // placeholder: "Test description and instruction in English"
          }}
          data={explanationData}
          onInit={editor => {
            // You can store the "editor" and use when it is needed.
            // console.log("Editor is ready to use!", editor);
          }}
          onChange={(event, editor) => {
            const data = event.editor.getData();
            handleExplanationEditor(data);
          }}
          // onBlur={(event, editor) => {
          //   console.log("Blur.", editor);
          // }}
          // onFocus={(event, editor) => {
          //   console.log("Focus.", editor);
          // }}
        />
      </div>
    </Form.Group>
  );
}
export default QuesHindi;
