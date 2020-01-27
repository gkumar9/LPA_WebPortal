import React, { Component } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import Header from "../Header/index";
import Back from "@material-ui/icons/ArrowBack";
import { styled } from "@material-ui/styles";
import { Tabs } from "@yazanaabed/react-tabs";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from "axios";
import URL from "../../Assets/url";
import TagsInput from "react-tagsinput";
import Difficulty from "./difficulty.js";
import "react-tagsinput/react-tagsinput.css"; // If using WebPack and style-loader.
import "./index.css";

const MyBack = styled(Back)({
  color: "dimgrey",
  marginTop: "-0.2em",
  width: "1em"
});
class Ques extends Component {
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
      listOfOptions: [
        { name: "Option A", content: "", weightage: null },
        { name: "Option B", content: "", weightage: null }
      ],
      letterchartcode: 67
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
  handleQuestionEditor = data => {
    this.setState({ questionData: data });
  };
  handleExplanationEditor = data => {
    this.setState({ explanationData: data });
  };
  handleOptioncontentchange = (index, data) => {
    // let currentCharCode = this.state.letterchartcode;
    // let name = "Option " + String.fromCharCode(currentCharCode);
    console.log(index, data);
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
  saveEnglishdata = () => {
    axios({
      method: "POST",
      url: URL.createQuestion,
      data: {
        authToken: "string",
        // difficulty: this.state.difficulty,
        difficulty: "MILD",
        // questionId: 0,
        sectionId: 0,
        subjectId: this.state.selectedSubjectID,
        subtopicId: 0,
        tags: this.state.tags,
        topicId: 0,
        type: "SINGLE_CHOICE",
        version: {
          content: this.state.questionData,
          language: "ENGLISH",
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
      })
      .catch(e => {
        console.log(e);
      });
  };
  render() {
    return (
      <React.Fragment>
        <Header />
        <div
          style={{
            boxShadow: "0px 3px 5px lightgrey",
            width: "auto",
            height: "4.5em",
            padding: "1em 3em"
          }}
        >
          <Button
            variant="light"
            style={{ background: "transparent", border: "transparent" }}
          >
            <MyBack />
            <span
              style={{ marginLeft: "1em", fontSize: "1.2em", color: "dimgrey" }}
            >
              Back to dashboard
            </span>
          </Button>
        </div>
        <Container
          fluid
          style={{ width: "auto", background: "#EEEEEE", padding: "0.5em 3em" }}
        >
          <Row style={{ height: "auto" }}>
            <Col lg="3">
              <div
                style={{
                  width: "auto",
                  height: "0.5em"
                }}
              ></div>
              <LeftPanel
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
            <Col lg="1"></Col>
            <Col>
              <div>
                <Tabs
                  activeTab={{
                    id: "tab1"
                  }}
                >
                  <Tabs.Tab id="tab1" title="English">
                    <div style={{ padding: "20px 0" }}>
                      <RightpanelEnglish
                        handleQuestionEditor={this.handleQuestionEditor}
                        questionData={this.state.questionData}
                        handleExplanationEditor={this.handleExplanationEditor}
                        explanationData={this.state.explanationData}
                        listOfOptions={this.state.listOfOptions}
                        letterchartcode={this.state.letterchartcode}
                        handleOptioncontentchange={
                          this.handleOptioncontentchange
                        }
                        handleOptionWeightageChange={
                          this.handleOptionWeightageChange
                        }
                        addoptionfn={this.addoptionfn}
                        deleteOption={this.deleteOption}
                        saveEnglishdata={this.saveEnglishdata}
                      />
                    </div>
                  </Tabs.Tab>
                  <Tabs.Tab id="tab2" title="Hindi">
                    <div style={{ padding: 10 }}>This is tab 2</div>
                  </Tabs.Tab>
                </Tabs>
              </div>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}
class RightpanelEnglish extends Component {
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
                      value={item.weightage}
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
              borderColor: "#3F5FBB"
            }}
            onClick={this.props.saveEnglishdata}
          >
            Save & move to Hindi section
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
    let currentvaluechapter = this.props.listOfChapter.filter(
      item => item.subjectSection.sectionId === this.props.selectedChapterID
    )[0];
    let currentvaluetopic = this.props.listOfTopic.filter(
      item => item.subjectTopic.topicId === this.props.selectedTopicID
    )[0];
    let currentvaluesubtopic = this.props.listOfSubTopic.filter(
      item => item.subjectSubtopic.subtopicId === this.props.selectedSubTopicID
    )[0];
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
          // onInit={editor => {
          //   // You can store the "editor" and use when it is needed.
          //   // console.log("Editor is ready to use!", editor);
          // }}
          onChange={(event, editor) => {
            const data = editor.getData();
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
export default Ques;
