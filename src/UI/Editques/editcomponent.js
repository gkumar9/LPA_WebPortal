import React, { Component } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
// import TagsInput from "react-tagsinput";
import Difficulty from "./difficulty.js";
// import CKEditor from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import CKEditor from "ckeditor4-react";
// import { Pramukhime } from "./../../Assets/pramukhime/plugin";
import axios from "axios";
// import "react-tagsinput/react-tagsinput.css"; // If using WebPack and style-loader.
import "./index.css";
import URL from "../../Assets/url";
import ReactTags from "react-tag-autocomplete";
import swal from "sweetalert";

class EditComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionData: " ",
      explanationData: " ",
      listOfOptions: [],
      letterchartcode: 65
    };
  }
  addoptionfn = () => {
    let currentCharCode = this.state.letterchartcode;
    let name = "Option " + String.fromCharCode(currentCharCode);
    let currentArrayOfOption = this.state.listOfOptions;
    currentArrayOfOption.push({ name: name, content: "", weightage: 0 });
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
    let converttags = this.props.fetchedData.tags.map(item => {
      return { id: item.tagId, name: item.tag };
    });
    if (
      this.props.fetchedData.questionVersions.filter(
        item => item.language === this.props.lang
      ).length > 0
    ) {
      this.setState({
        difficulty: difficultyvalue,
        questionData: this.props.fetchedData.questionVersions.filter(
          item => item.language === this.props.lang
        )[0].content,
        explanationData: this.props.fetchedData.questionVersions.filter(
          item => item.language === this.props.lang
        )[0].solution,
        listOfOptions: this.props.fetchedData.questionVersions.filter(
          item => item.language === this.props.lang
        )[0].options,
        letterchartcode:
          this.props.fetchedData.questionVersions.filter(
            item => item.language === this.props.lang
          )[0].options.length + 65,
        tags: converttags
      });
    } else {
      this.setState({
        difficulty: difficultyvalue,
        // questionData: "",
        // explanationData: "",
        listOfOptions: [
          { name: "Option A", content: "", weightage: 0 },
          { name: "Option B", content: "", weightage: 0 }
        ],
        letterchartcode: 67,
        tags: converttags
      });
    }
  }
  handleQuestionEditor = data => {
    this.setState({ questionData: data });
  };
  handleExplanationEditor = data => {
    // console.log(data);
    this.setState({ explanationData: data });
  };
  handleOptioncontentchange = (index, data) => {
    // e.preventDefault();
    // console.log('in fn')
    // let currentCharCode = this.state.letterchartcode;
    // let name = "Option " + String.fromCharCode(currentCharCode);
    // console.log(this.state.listOfOptions[index], data);
    let currentArrayOfOption = this.state.listOfOptions;
    currentArrayOfOption[index].content = data;
    this.setState({
      listOfOptions: currentArrayOfOption
    });
  };
  handleOptionWeightageChange = (index, e) => {
    e.preventDefault();
    // console.log(index,e);
    let currentArrayOfOption = this.state.listOfOptions;
    currentArrayOfOption[index].weightage = parseInt(e.target.value);
    this.setState({
      listOfOptions: currentArrayOfOption
    });
  };
  savedata = () => {
    let difficultyvalue;
    switch (this.props.difficulty) {
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
    let converttags = this.props.tags.map(item => {
      return { tagId: item.id, tag: item.name };
    });
    console.log(this.state.listOfOptions);
    axios({
      method: "POST",
      url: URL.updateExistingQuestionVersion,
      data: {
        authToken: "string",
        difficulty: difficultyvalue,
        questionId: this.props.questionId,
        sectionId: this.props.selectedChapterID,
        subjectId: this.props.selectedSubjectID,
        subtopicId: this.props.selectedSubTopicID,
        tags: converttags,
        topicId: this.props.selectedTopicID,
        type: "SINGLE_CHOICE",
        version: {
          content: this.state.questionData,
          language: this.props.fetchedData.questionVersions.filter(
            item => item.language === this.props.lang
          )[0].language,
          options: this.state.listOfOptions,
          questionVersionId: this.props.fetchedData.questionVersions.filter(
            item => item.language === this.props.lang
          )[0].questionVersionId,
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
          // alert("success", res.data.data);
          swal("Success", `Data updated`, "success");
          // let data = JSON.parse(localStorage.getItem("Previewdata"));
          // let finditem = data.filter(
          //   item => item.questionId === this.props.questionId
          // );
          // if (finditem.length > 0) {
          // }
          localStorage.setItem("editquesdata", null);
        }
      })
      .catch(e => {
        console.log(e);
        alert(e);
      });
  };
  savedatanewversion = () => {
    let difficultyvalue;
    switch (this.props.difficulty) {
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
    let converttags = this.props.tags.map(item => {
      return { tagId: item.id, tag: item.name };
    });
    console.log(this.props.selectedTopicID);
    axios({
      method: "POST",
      url: URL.createQuestionNewVersion,
      data: {
        authToken: "string",
        difficulty: difficultyvalue,
        questionId: this.props.questionId,
        sectionId: this.props.selectedChapterID,
        subjectId: this.props.selectedSubjectID,
        subtopicId: this.props.selectedSubTopicID,
        tags: converttags,
        topicId: this.props.selectedTopicID,
        type: "SINGLE_CHOICE",
        version: {
          content: this.state.questionData,
          language: this.props.lang,
          options: this.state.listOfOptions,
          // questionVersionId: this.props.fetchedData.questionVersions.filter(
          //   item => item.language === this.props.lang
          // )[0].questionVersionId,
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
          // alert("success", res.data.data);
          swal("Success", `Data updated`, "success");
          // let data = JSON.parse(localStorage.getItem("Previewdata"));
          // console.log(data);
          localStorage.setItem("editquesdata", null);
        }
      })
      .catch(e => {
        console.log(e);
        alert(e);
      });
  };
  render() {
    return (
      <div>
        {this.props.fetchedData.questionVersions.filter(
          item => item.language === this.props.lang
        ).length > 0 ? (
          <Row noGutters={true}>
            <Col
              lg="3"
              style={{
                padding: "2.5em 3em",
                background: "#EEE",
                boxShadow: "rgba(0, 0, 0, 0.75) 2px 0px 4px -4px",
                zIndex: "88",
                position: "relative"
              }}
            >
              <div
                style={{
                  width: "auto"
                }}
              >
                <LeftPanel
                  listOfSubject={this.props.listOfSubject}
                  listOfChapter={this.props.listOfChapter}
                  listOfTopic={this.props.listOfTopic}
                  listOfSubTopic={this.props.listOfSubTopic}
                  handleSubjectChange={this.props.handleSubjectChange}
                  handleChapterChange={this.props.handleChapterChange}
                  handleTopicChange={this.props.handleTopicChange}
                  handleSubTopicChange={this.props.handleSubTopicChange}
                  selectedSubjectID={this.props.selectedSubjectID}
                  selectedChapterID={this.props.selectedChapterID}
                  selectedTopicID={this.props.selectedTopicID}
                  selectedSubTopicID={this.props.selectedSubTopicID}
                  tags={this.props.tags}
                  suggestions={this.props.suggestions}
                  onAddition={this.props.onAddition}
                  onDelete={this.props.onDelete}
                  handleChangeTags={this.props.handleChangeTags}
                  difficulty={this.props.difficulty}
                  handleDifficultyRadio={this.props.handleDifficultyRadio}
                />
              </div>
            </Col>
            <Col style={{ background: "#EEEEEE", padding: "0em 4em" }}>
              <div style={{ margin: "2.5em 0em" }}>
                <Rightpanel
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
          </Row>
        ) : (
          <Row noGutters={true}>
            <Col
              lg="3"
              style={{
                padding: "2.5em 3em",
                background: "#EEE",
                boxShadow: "rgba(0, 0, 0, 0.75) 2px 0px 4px -4px",
                zIndex: "88",
                position: "relative"
              }}
            >
              <div
                style={{
                  width: "auto"
                }}
              >
                <LeftPanel
                  listOfSubject={this.props.listOfSubject}
                  listOfChapter={this.props.listOfChapter}
                  listOfTopic={this.props.listOfTopic}
                  listOfSubTopic={this.props.listOfSubTopic}
                  handleSubjectChange={this.props.handleSubjectChange}
                  handleChapterChange={this.props.handleChapterChange}
                  handleTopicChange={this.props.handleTopicChange}
                  handleSubTopicChange={this.props.handleSubTopicChange}
                  selectedSubjectID={this.props.selectedSubjectID}
                  selectedChapterID={this.props.selectedChapterID}
                  selectedTopicID={this.props.selectedTopicID}
                  selectedSubTopicID={this.props.selectedSubTopicID}
                  tags={this.props.tags}
                  suggestions={this.props.suggestions}
                  onAddition={this.props.onAddition}
                  onDelete={this.props.onDelete}
                  handleChangeTags={this.props.handleChangeTags}
                  difficulty={this.props.difficulty}
                  handleDifficultyRadio={this.props.handleDifficultyRadio}
                />
              </div>
            </Col>
            <Col style={{ background: "#EEEEEE", padding: "0em 4em" }}>
              <div style={{ margin: "2.5em 0em" }}>
                <RightpanelNewVersion
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
                  savedata={this.savedatanewversion}
                />
              </div>
            </Col>
          </Row>
        )}
      </div>
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
    // console.log(currentvaluechapter,this.props.listOfChapter)
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
        <Form.Group>
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
        <Form.Group>
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
        <Form.Group>
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
        <Form.Group>
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
        <Form.Group>
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
        <Form.Group>
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
class Rightpanel extends Component {
  render() {
    // console.log(this.props.questionData);
    return (
      <Form>
        {/* {this.props.questionData && ( */}
        <QuestionComp
          // ClassicEditor={ClassicEditor}
          handleQuestionEditor={this.props.handleQuestionEditor}
          questionData={this.props.questionData}
        />
        {/* )} */}
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
                      // disabled
                      style={{ borderRadius: "0", background: "#f9f9f9" }}
                      type="number"
                      value={item.weightage || 0}
                      onChange={this.props.handleOptionWeightageChange.bind(
                        this,
                        index
                      )}
                      placeholder="weightage"
                    />
                  </Col>
                  {/* {this.props.listOfOptions.length === index + 1 && (
                    <Col>
                      <Button
                        style={{ float: "right", color: "grey" }}
                        variant="link"
                        onClick={this.props.deleteOption.bind(this, index)}
                      >
                        X Delete
                      </Button>
                    </Col>
                  )} */}
                </Form.Group>
                <div style={{ margin: "0.5em 0" }}>
                  <CKEditor
                    onBeforeLoad={CKEDITOR =>
                      (CKEDITOR.disableAutoInline = true)
                    }
                    onFocus={event => {
                      // let data = event.editor.getData();
                      // console.log('focus')
                      event.editor.insertHtml( ' ' );
                      this.props.handleOptioncontentchange(
                        index,
                        event.editor.getData()
                      );
                    }}
                    config={{
                      height: 80

                      // placeholder: "Test description and instruction in English"
                    }}
                    data={item.content}
                    onChange={event => {
                      // let data = editor.getData();
                      // console.log('change')
                      this.props.handleOptioncontentchange(
                        index,
                        event.editor.getData()
                      );
                    }}
                  />
                </div>
              </React.Fragment>
            );
          })}
        <Row>
          <Col lg="10"></Col>
          <Col>
            {/* <Button
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
            </Button> */}
          </Col>
        </Row>
        <div style={{ margin: "2em 0" }}>
          {/* {this.props.explanationData && ( */}
          <ExplanationComp
            handleExplanationEditor={this.props.handleExplanationEditor}
            explanationData={this.props.explanationData}
          />
          {/* )} */}
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
    <Form.Group>
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
            // font_defaultLabel: "lato",
            // fontSize_sizes: "16/16px;24/24px;48/48px;",
            // font_style: {
            //   element: "p",
            //   styles: { "font-size": "18px" },
            //   overrides: [{ element: "font", attributes: { face: null } }]
            // }
            // placeholder: "Test description and instruction in English"
          }}
          onFocus={event => {
            event.editor.insertHtml( ' ' );
            let data = event.editor.getData();
            // console.log('focus',data)
            handleQuestionEditor(data);
          }}
          data={questionData}
          //   config={{
          //     plugins: [Pramukhime]
          //   }}
          onChange={event => {
            let data = event.editor.getData();

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
    <Form.Group>
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
          // onBlur={event=>{
          //   console.log('blur',event)
          // }}
          onFocus={event => {
            event.editor.insertHtml( ' ' );
            let data = event.editor.getData();

            handleExplanationEditor(data);
          }}
          data={explanationData}
          onChange={event => {
            let data = event.editor.getData();
            handleExplanationEditor(data);
          }}
        />
      </div>
    </Form.Group>
  );
}
class RightpanelNewVersion extends Component {
  render() {
    // console.log(this.props.questionData);
    return (
      <Form>
        {/* {this.props.questionData && ( */}
        <QuestionComp
          // ClassicEditor={ClassicEditor}
          handleQuestionEditor={this.props.handleQuestionEditor}
          questionData={this.props.questionData}
        />
        {/* )} */}
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
                      // disabled
                      style={{ borderRadius: "0", background: "#f9f9f9" }}
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
                    onFocus={event => {
                      // let data = event.editor.getData();
                      // console.log('focus')
                      event.editor.insertHtml( ' ' );
                      this.props.handleOptioncontentchange(
                        index,
                        event.editor.getData()
                      );
                    }}
                    data={item.content}
                    onChange={event => {
                      // let data = editor.getData();
                      // console.log('change')
                      this.props.handleOptioncontentchange(
                        index,
                        event.editor.getData()
                      );
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
          {/* {this.props.explanationData && ( */}
          <ExplanationComp
            handleExplanationEditor={this.props.handleExplanationEditor}
            explanationData={this.props.explanationData}
          />
          {/* )} */}
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
export default EditComponent;
