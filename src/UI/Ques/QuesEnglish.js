import React, { Component } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import CKEditor from "ckeditor4-react";
import axios from "axios";
import URL from "../../Assets/url";
import Difficulty from "./difficulty.js";
import "./index.css";
import ReactTags from "react-tag-autocomplete";
import swal from "sweetalert";
class QuesEnglish extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listOfOptions: [
        { name: "Option A", content: "", weightage: 0 },
        { name: "Option B", content: "", weightage: 0 },
        { name: "Option C", content: "", weightage: 0 },
        { name: "Option D", content: "", weightage: 0 },
      ],
      letterchartcode: 69,
      questiondata: "",
      explanationdata: "",
    };
    this.myRefQuestionEnglish = React.createRef();
    this.myRefExplanationEnglish = React.createRef();
    this.refsArrayEnglish = [];
  }
  handlequestioncontentchange = (data) => {
    this.setState({
      questiondata: data,
    });
  };
  handleexplanationcontentchange = (data) => {
    this.setState({ explanationdata: data });
  };
  addoptionfn = () => {
    let currentCharCode = this.state.letterchartcode;
    let name = "Option " + String.fromCharCode(currentCharCode);
    let currentArrayOfOption = this.state.listOfOptions;
    currentArrayOfOption.push({ name: name, content: "", weightage: 0 });
    this.setState({
      listOfOptions: currentArrayOfOption,
      letterchartcode: currentCharCode + 1,
    });
  };
  deleteOption = (index) => {
    let tempoption = this.state.listOfOptions.map((item, index) => {
      return {
        name: item.name,
        content: this.refsArrayEnglish[index].editor.getData(),
        weightage: item.weightage,
      };
    });
    let currentArrayOfOption = tempoption;
    let letterchartcode = 65;
    this.refsArrayEnglish.splice(index, 1);
    currentArrayOfOption.splice(index, 1);
    currentArrayOfOption = currentArrayOfOption.map((item, index) => {
      let name = "Option " + String.fromCharCode(letterchartcode);
      letterchartcode++;
      return { name: name, content: item.content, weightage: item.weightage };
    });
    // this.refsArrayEnglish = [];
    this.setState({
      listOfOptions: currentArrayOfOption,
      letterchartcode: letterchartcode,
    });
  };
  handleOptioncontentchange = (index, data) => {
    let currentArrayOfOption = this.state.listOfOptions;
    currentArrayOfOption[index].content = data;
    this.setState({
      listOfOptions: currentArrayOfOption,
    });
  };
  handleOptionWeightageChange = (index, e) => {
    // e.preventDefault();
    // console.log(typeof parseInt(e.target.value));
    let currentArrayOfOption = this.state.listOfOptions;
    currentArrayOfOption[index].weightage = e.target.value
      ? parseInt(e.target.value)
      : "";
    // currentArrayOfOption[index].weightage = parseInt(e.target.value);
    this.setState({
      listOfOptions: currentArrayOfOption,
    });
  };
  saveEnglishdata = () => {
    const question = this.myRefQuestionEnglish.current;
    const solution = this.myRefExplanationEnglish.current;
    let tempoption = this.state.listOfOptions.map((item, index) => {
      return {
        name: item.name,
        content: this.refsArrayEnglish[index].editor.getData(),
        weightage: item.weightage,
      };
    });
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
    let converttags = this.props.tags.map((item) => {
      return { tagId: item.id ? item.id : 0, tag: item.name };
    });

    axios({
      method: "POST",
      url:
        this.props.questionId === 0
          ? URL.createQuestion
          : URL.createQuestionNewVersion,
      data: {
        authToken: "string",
        difficulty: difficultyvalue ? difficultyvalue : "EASY",
        questionId: this.props.questionId,
        authorId: this.props.selectedAuthorId,
        authorName:
          this.props.authorList.filter(
            (item) => item.authorId === this.props.selectedAuthorId
          ).length > 0
            ? this.props.authorList.filter(
                (item) => item.authorId === this.props.selectedAuthorId
              )[0].authorName
            : null,
        sectionId: this.props.selectedChapterID,
        subjectId: this.props.selectedSubjectID,
        subtopicId: this.props.selectedSubTopicID,
        tags: converttags,
        topicId: this.props.selectedTopicID,
        type: "SINGLE_CHOICE",
        version: {
          content: question.editor.getData(),
          language: "ENGLISH",
          options: tempoption,
          solution: solution.editor.getData(),
        },
      },
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          if (this.props.questionId === 0) {
            swal(
              "Success",
              `Added new Question, Id:${res.data.data.questionId}`,
              "success"
            );
          } else {
            swal(
              "Success",
              `Added new Version of Question, Id:${res.data.data.questionId}`,
              "success"
            );
          }

          this.props.handleChange(res.data.data.questionId);
          this.props.handleSelect();
          this.setState(
            {
              listOfOptions: [
                { name: "Option A", content: "", weightage: 0 },
                { name: "Option B", content: "", weightage: 0 },
                { name: "Option C", content: "", weightage: 0 },
                { name: "Option D", content: "", weightage: 0 },
              ],
              letterchartcode: 69,
              questiondata: "",
              explanationdata: "",
            },
            () => {
              this.refsArrayEnglish = [];
            }
          );
        } else {
          swal(`Status Code:${res.status}`, "error");
        }
      })
      .catch((e) => {
        console.log(e);
        swal(e, "error");
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
              boxShadow: "rgba(0, 0, 0, 0.75) 2px 0px 4px -4px",
              zIndex: "88",
              position: "relative",
            }}
          >
            <div
              style={{
                width: "auto",
                margin: "2.5em 0em",
              }}
            ></div>
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
              selectedAuthorId={this.props.selectedAuthorId}
              authorList={this.props.authorList}
              handleAuthorChange={this.props.handleAuthorChange}
            />
          </Col>
          <Col
            style={{
              background: "#EEEEEE",
              padding: "0em 4em",
            }}
          >
            <div style={{ margin: "2.5em 0em" }}>
              <RightpanelEnglish
                myRefQuestionEnglish={this.myRefQuestionEnglish}
                myRefExplanationEnglish={this.myRefExplanationEnglish}
                refsArrayEnglish={this.refsArrayEnglish}
                listOfOptions={this.state.listOfOptions}
                letterchartcode={this.state.letterchartcode}
                handleOptionWeightageChange={this.handleOptionWeightageChange}
                addoptionfn={this.addoptionfn}
                deleteOption={this.deleteOption}
                saveEnglishdata={this.saveEnglishdata}
                handleOptioncontentchange={this.handleOptioncontentchange}
                explanationdata={this.state.explanationdata}
                questiondata={this.state.questiondata}
                handlequestioncontentchange={this.handlequestioncontentchange}
                handleexplanationcontentchange={
                  this.handleexplanationcontentchange
                }
              />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
class RightpanelEnglish extends Component {
  render() {
    return (
      <Form>
        <QuestionComp
          myRefQuestionEnglish={this.props.myRefQuestionEnglish}
          questiondata={this.props.questiondata}
          handlequestioncontentchange={this.props.handlequestioncontentchange}
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
                      style={{ borderRadius: "0", background: "#f9f9f9" }}
                      type="number"
                      value={item.weightage}
                      onChange={this.props.handleOptionWeightageChange.bind(
                        this,
                        index
                      )}
                      placeholder="weightage"
                    />
                  </Col>
                  <Col>
                    <Button
                      tabIndex="-1"
                      style={{ float: "right", color: "grey" }}
                      variant="link"
                      onClick={this.props.deleteOption.bind(this, index)}
                    >
                      X Delete
                    </Button>
                  </Col>
                </Form.Group>
                <div style={{ margin: "0.5em 0" }}>
                  <CKEditor
                    ref={(ref) => {
                      // Callback refs are preferable when
                      // dealing with dynamic refs
                      // console.log(ref)
                      // this.props.refsArrayEnglish[index] = null;
                      this.props.refsArrayEnglish[index] = ref;
                      return true;
                    }}
                    onBeforeLoad={(CKEDITOR) => {
                      CKEDITOR.disableAutoInline = true;
                    }}
                    config={{
                      height: 100,
                    }}
                    data={item.content}
                    onFocus={(event) => {
                      // event.editor.insertHtml(" ");
                      const data = event.editor.getData();
                      this.props.handleOptioncontentchange(index, data);
                    }}
                    onChange={(event) => {
                      let data = event.editor.getData();
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
                float: "right",
              }}
            >
              {" "}
              + Add Option
            </Button>
          </Col>
        </Row>
        <div style={{ margin: "2em 0" }}>
          <ExplanationComp
            myRefExplanationEnglish={this.props.myRefExplanationEnglish}
            explanationdata={this.props.explanationdata}
            handleexplanationcontentchange={
              this.props.handleexplanationcontentchange
            }
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
              fontWeight: "600",
            }}
            onClick={this.props.saveEnglishdata}
          >
            {this.props.questionId === 0 || this.props.questionId === undefined
              ? "Save & move to Hindi section"
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
      (item) => item.subject.subjectId === this.props.selectedSubjectID
    )[0];
    currentvaluesubject = currentvaluesubject
      ? currentvaluesubject.subjectName
      : "";
    let currentvaluechapter = this.props.listOfChapter.filter(
      (item) => item.subjectSection.sectionId === this.props.selectedChapterID
    )[0];
    currentvaluechapter = currentvaluechapter
      ? currentvaluechapter.sectionName
      : "";

    let currentvaluetopic = this.props.listOfTopic.filter(
      (item) => item.subjectTopic.topicId === this.props.selectedTopicID
    )[0];
    currentvaluetopic = currentvaluetopic ? currentvaluetopic.title : "";
    let currentvaluesubtopic = this.props.listOfSubTopic.filter(
      (item) =>
        item.subjectSubtopic.subtopicId === this.props.selectedSubTopicID
    )[0];
    currentvaluesubtopic = currentvaluesubtopic
      ? currentvaluesubtopic.title
      : "";
    let currentvalueauthor = this.props.authorList.filter(
      (item) => item.authorId === this.props.selectedAuthorId
    )[0];
    currentvalueauthor = currentvalueauthor
      ? currentvalueauthor.authorName
      : "";
    return (
      <Form>
        <Form.Group controlId="exampleForm.ControlSelectauthoraddques">
          <Form.Label
            style={{
              fontWeight: "600",
            }}
          >
            Authors
          </Form.Label>
          <Form.Control
            style={
              currentvalueauthor !== ""
                ? { borderRadius: "0" }
                : { borderRadius: "0", color: "#a3a2a2" }
            }
            size="sm"
            as="select"
            // defaultValue=""
            onChange={this.props.handleAuthorChange}
            value={currentvalueauthor}
          >
            {this.props.authorList &&
              this.props.authorList.map((item, index) => {
                return (
                  <option key={index} value={item.authorName}>
                    {item.authorName}
                  </option>
                );
              })}
            <option key="" value="">
              Select
            </option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlSelect1">
          <Form.Label
            style={{
              fontWeight: "600",
            }}
          >
            Subject
          </Form.Label>
          <Form.Control
            // style={{ borderRadius: "0" }}
            style={
              currentvaluesubject !== ""
                ? { borderRadius: "0" }
                : { borderRadius: "0", color: "#a3a2a2" }
            }
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
            <option key="" value="">
              Select
            </option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlSelect2">
          <Form.Label
            style={{
              fontWeight: "600",
            }}
          >
            Chapter
          </Form.Label>
          <Form.Control
            style={
              currentvaluechapter !== ""
                ? { borderRadius: "0" }
                : { borderRadius: "0", color: "#a3a2a2" }
            }
            // style={{ borderRadius: "0" }}
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
            <option key="" value="">
              Select
            </option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlSelect3">
          <Form.Label
            style={{
              fontWeight: "600",
            }}
          >
            Topic
          </Form.Label>
          <Form.Control
            // style={{ borderRadius: "0" }}
            style={
              currentvaluetopic !== ""
                ? { borderRadius: "0" }
                : { borderRadius: "0", color: "#a3a2a2" }
            }
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
            <option key="" value="">
              Select
            </option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlSelect4">
          <Form.Label
            style={{
              fontWeight: "600",
            }}
          >
            Sub-topic
          </Form.Label>
          <Form.Control
            style={
              currentvaluesubtopic !== ""
                ? { borderRadius: "0" }
                : { borderRadius: "0", color: "#a3a2a2" }
            }
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
            <option key="" value="">
              Select
            </option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlInput1">
          <Form.Label
            style={{
              fontWeight: "600",
            }}
          >
            Tags
          </Form.Label>
          <ReactTags
            tags={this.props.tags}
            onInput={this.props.handleChangeTags}
            suggestions={this.props.suggestions}
            onDelete={this.props.onDelete.bind(this)}
            onAddition={this.props.onAddition.bind(this)}
          />
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlTextarea1">
          <Form.Label
            style={{
              fontWeight: "600",
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

function QuestionComp({
  myRefQuestionEnglish,
  questiondata,
  handlequestioncontentchange,
}) {
  return (
    <Form.Group>
      <Form.Label
        style={{
          fontWeight: "600",
        }}
      >
        Question
      </Form.Label>
      <div
        style={{
          margin: "0.5em 0",
        }}
      >
        <CKEditor
          ref={myRefQuestionEnglish}
          onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)}
          config={{
            height: 100,
            // plugins: "BasicStyles",
          }}
          data={questiondata}
          onChange={(event) => {
            handlequestioncontentchange(event.editor.getData());
          }}
        />
      </div>
    </Form.Group>
  );
}

function ExplanationComp({
  myRefExplanationEnglish,
  explanationdata,
  handleexplanationcontentchange,
}) {
  return (
    <Form.Group controlId="exampleForm.EControlInput1">
      <Form.Label
        style={{
          fontWeight: "600",
        }}
      >
        Explanation
      </Form.Label>
      <div
        style={{
          margin: "0.5em 0",
        }}
      >
        <CKEditor
          ref={myRefExplanationEnglish}
          onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)}
          config={{
            height: 100,
          }}
          data={explanationdata}
          onChange={(event) => {
            handleexplanationcontentchange(event.editor.getData());
          }}
        />
      </div>
    </Form.Group>
  );
}
export default QuesEnglish;
