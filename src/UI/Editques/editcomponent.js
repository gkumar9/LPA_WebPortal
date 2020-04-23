import React, { Component } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import Difficulty from "./difficulty.js";
import CKEditor from "ckeditor4-react";
import axios from "axios"; // If using WebPack and style-loader.
import "./index.css";
import URL from "../../Assets/url";
import ReactTags from "react-tag-autocomplete";
import swal from "sweetalert";

class EditComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionData:
        this.props.fetchedData.questionVersions.filter(
          (item) => item.language === this.props.lang
        ).length > 0
          ? this.props.fetchedData.questionVersions.filter(
              (item) => item.language === this.props.lang
            )[0].content
          : " ",
      explanationData:
        this.props.fetchedData.questionVersions.filter(
          (item) => item.language === this.props.lang
        ).length > 0
          ? this.props.fetchedData.questionVersions.filter(
              (item) => item.language === this.props.lang
            )[0].solution
          : " ",
      listOfOptions: [],
      letterchartcode: 65,
    };
    this.myRefQuestionHindi = React.createRef();
    this.myRefQuestionHindiNew = React.createRef();
    this.myRefQuestionEnglish = React.createRef();
    this.myRefQuestionEnglishNew = React.createRef();
    this.myRefExplanationHindi = React.createRef();
    this.myRefExplanationHindiNew = React.createRef();
    this.myRefExplanationEnglish = React.createRef();
    this.myRefExplanationEnglishNew = React.createRef();
    this.refsArrayHindi = [];
    this.refsArrayHindiNew = [];
    this.refsArrayEnglish = [];
    this.refsArrayEnglishNew = [];
    window.EditComponent = this;
  }
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
  deleteOption = (index, lang) => {
    let currentArrayOfOption;
    if (lang === "ENGLISH") {
      let tempoption = this.state.listOfOptions.map((item, index) => {
        return {
          name: item.name,
          content: this.refsArrayEnglishNew[index].editor.getData(),
          weightage: item.weightage,
        };
      });
      currentArrayOfOption = tempoption;
      this.refsArrayEnglishNew.splice(index, 1);
    } else {
      let tempoption = this.state.listOfOptions.map((item, index) => {
        return {
          name: item.name,
          content: this.refsArrayHindiNew[index].editor.getData(),
          weightage: item.weightage,
        };
      });
      currentArrayOfOption = tempoption;
      this.refsArrayHindiNew.splice(index, 1);
    }
    // let currentArrayOfOption = this.state.listOfOptions;
    let letterchartcode = 65;

    currentArrayOfOption.splice(index, 1);
    currentArrayOfOption = currentArrayOfOption.map((item) => {
      let name = "Option " + String.fromCharCode(letterchartcode);
      letterchartcode++;
      return { name: name, content: item.content, weightage: item.weightage };
    });

    this.setState({
      listOfOptions: currentArrayOfOption,
      letterchartcode: letterchartcode,
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
    let converttags = this.props.fetchedData.tags.map((item) => {
      return { id: item.tagId, name: item.tag };
    });
    if (
      this.props.fetchedData.questionVersions.filter(
        (item) => item.language === this.props.lang
      ).length > 0
    ) {
      this.setState({
        difficulty: difficultyvalue,
        // authorId:this.props.fetchedData.questionVersions.filter(
        //   (item) => item.language === this.props.lang
        // )[0].authorId,
        questionData: this.props.fetchedData.questionVersions.filter(
          (item) => item.language === this.props.lang
        )[0].content,
        explanationData: this.props.fetchedData.questionVersions.filter(
          (item) => item.language === this.props.lang
        )[0].solution,
        listOfOptions: this.props.fetchedData.questionVersions.filter(
          (item) => item.language === this.props.lang
        )[0].options,
        letterchartcode:
          this.props.fetchedData.questionVersions.filter(
            (item) => item.language === this.props.lang
          )[0].options.length + 65,
        tags: converttags,
      });
    } else {
      this.setState({
        difficulty: difficultyvalue,
        listOfOptions: [
          { name: "Option A", content: " ", weightage: 0 },
          { name: "Option B", content: " ", weightage: 0 },
          { name: "Option C", content: " ", weightage: 0 },
          { name: "Option D", content: " ", weightage: 0 },
        ],
        letterchartcode: 69,
        tags: converttags,
      });
    }
  }
  handleOptioncontentchange = (index, data) => {
    let currentArrayOfOption = this.state.listOfOptions;
    currentArrayOfOption[index].content = data;
    this.setState({
      listOfOptions: currentArrayOfOption,
    });
  };
  handleOptionWeightageChange = (index, e) => {
    let currentArrayOfOption = this.state.listOfOptions;
    currentArrayOfOption[index].weightage = e.target.value
      ? parseInt(e.target.value)
      : "";
    this.setState({
      listOfOptions: currentArrayOfOption,
    });
  };
  savedata = () => {
    const questionEnglish = this.myRefQuestionEnglish.current;
    const solutionEnglish = this.myRefExplanationEnglish.current;
    let tempoptionEnglish =
      this.refsArrayEnglish.length > 0 &&
      this.state.listOfOptions.map((item, index) => {
        return {
          optionId: item.optionId,
          name: item.name,
          content: this.refsArrayEnglish[index].editor.getData(),
          weightage: item.weightage,
        };
      });
    const questionHindi = this.myRefQuestionHindi.current;
    const solutionHindi = this.myRefExplanationHindi.current;
    let tempoptionHindi =
      this.refsArrayHindi.length > 0 &&
      this.state.listOfOptions.map((item, index) => {
        return {
          optionId: item.optionId,
          name: item.name,
          content: this.refsArrayHindi[index].editor.getData(),
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
      return { tagId: item.id, tag: item.name };
    });
    axios({
      method: "POST",
      url: URL.updateExistingQuestionVersion,
      data: {
        authToken: "string",
        difficulty: difficultyvalue,
        authorId: this.props.selectedAuthorId,
        authorName:
          this.props.authorList.filter(
            (item) => item.authorId === this.props.selectedAuthorId
          ).length > 0
            ? this.props.authorList.filter(
                (item) => item.authorId === this.props.selectedAuthorId
              )[0].authorName
            : null,
        questionId: parseInt(this.props.questionId),
        sectionId: this.props.selectedChapterID,
        subjectId: this.props.selectedSubjectID,
        subtopicId: this.props.selectedSubTopicID,
        tags: converttags,
        topicId: this.props.selectedTopicID,
        type: "SINGLE_CHOICE",
        version: {
          content:
            this.props.fetchedData.questionVersions.filter(
              (item) => item.language === this.props.lang
            )[0].language === "ENGLISH"
              ? questionEnglish.editor.getData()
              : questionHindi.editor.getData(),
          language: this.props.fetchedData.questionVersions.filter(
            (item) => item.language === this.props.lang
          )[0].language,
          options:
            this.props.fetchedData.questionVersions.filter(
              (item) => item.language === this.props.lang
            )[0].language === "ENGLISH"
              ? tempoptionEnglish
              : tempoptionHindi,
          questionVersionId: parseInt(
            this.props.fetchedData.questionVersions.filter(
              (item) => item.language === this.props.lang
            )[0].questionVersionId
          ),
          solution:
            this.props.fetchedData.questionVersions.filter(
              (item) => item.language === this.props.lang
            )[0].language === "ENGLISH"
              ? solutionEnglish.editor.getData()
              : solutionHindi.editor.getData(),
        },
      },
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          // console.log(res.data.data);
          swal("Success", `Data updated`, "success");
          localStorage.setItem("editquesdata", null);
        }
      })
      .catch((e) => {
        console.log(e);
        alert(e);
      });
  };
  savedatanewversion = () => {
    let question, solution, tempoption;
    // questionHindi,
    // solutionHindi,
    // tempoptionHindi;
    if (this.props.lang === "ENGLISH") {
      question = this.myRefQuestionEnglishNew.current;
      solution = this.myRefExplanationEnglishNew.current;
      tempoption =
        this.refsArrayEnglishNew.length > 0 &&
        this.state.listOfOptions.map((item, index) => {
          return {
            name: item.name,
            content: this.refsArrayEnglishNew[index].editor.getData(),
            weightage: item.weightage,
          };
        });
    } else {
      question = this.myRefQuestionHindiNew.current;
      solution = this.myRefExplanationHindiNew.current;
      tempoption =
        this.refsArrayHindiNew.length > 0 &&
        this.state.listOfOptions.map((item, index) => {
          return {
            name: item.name,
            content: this.refsArrayHindiNew[index].editor.getData(),
            weightage: item.weightage,
          };
        });
    }

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
      return { tagId: item.id, tag: item.name };
    });
    axios({
      method: "POST",
      url: URL.createQuestionNewVersion,
      data: {
        authToken: "string",
        difficulty: difficultyvalue,
        authorId: this.props.selectedAuthorId,
        authorName:
          this.props.authorList.filter(
            (item) => item.authorId === this.props.selectedAuthorId
          ).length > 0
            ? this.props.authorList.filter(
                (item) => item.authorId === this.props.selectedAuthorId
              )[0].authorName
            : null,
        questionId: this.props.questionId,
        sectionId: this.props.selectedChapterID,
        subjectId: this.props.selectedSubjectID,
        subtopicId: this.props.selectedSubTopicID,
        tags: converttags,
        topicId: this.props.selectedTopicID,
        type: "SINGLE_CHOICE",
        version: {
          content: question.editor.getData(),
          language: this.props.lang,
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
          console.log(res.data.data);
          // alert("success", res.data.data);
          swal("Success", `Data updated`, "success");
          // let data = JSON.parse(localStorage.getItem("Previewdata"));
          // console.log(data);
          localStorage.setItem("editquesdata", null);
        }
      })
      .catch((e) => {
        console.log(e);
        alert(e);
      });
  };
  render() {
    return (
      <div>
        {this.props.fetchedData.questionVersions.filter(
          (item) => item.language === this.props.lang
        ).length > 0 ? (
          <Row noGutters={true}>
            <Col
              lg="3"
              style={{
                padding: "2.5em 3em",
                background: "#EEE",
                boxShadow: "rgba(0, 0, 0, 0.75) 2px 0px 4px -4px",
                zIndex: "88",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: "auto",
                }}
              >
                <LeftPanel
                  fetchedData={this.props.fetchedData}
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
              </div>
            </Col>
            <Col style={{ background: "#EEEEEE", padding: "0em 4em" }}>
              <div style={{ margin: "2.5em 0em" }}>
                <Rightpanel
                  fetchedData={this.props.fetchedData}
                  myRefQuestionHindi={this.myRefQuestionHindi}
                  myRefQuestionEnglish={this.myRefQuestionEnglish}
                  myRefExplanationHindi={this.myRefExplanationHindi}
                  myRefExplanationEnglish={this.myRefExplanationEnglish}
                  refsArrayHindi={this.refsArrayHindi}
                  refsArrayEnglish={this.refsArrayEnglish}
                  questionData={this.state.questionData}
                  explanationData={this.state.explanationData}
                  listOfOptions={this.state.listOfOptions}
                  letterchartcode={this.state.letterchartcode}
                  handleOptionWeightageChange={this.handleOptionWeightageChange}
                  addoptionfn={this.addoptionfn}
                  deleteOption={this.deleteOption}
                  savedata={this.savedata}
                  lang={this.props.lang}
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
                position: "relative",
              }}
            >
              <div
                style={{
                  width: "auto",
                }}
              >
                <LeftPanel
                  fetchedData={this.props.fetchedData}
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
              </div>
            </Col>
            <Col style={{ background: "#EEEEEE", padding: "0em 4em" }}>
              <div style={{ margin: "2.5em 0em" }}>
                <RightpanelNewVersion
                  fetchedData={this.props.fetchedData}
                  myRefQuestionHindiNew={this.myRefQuestionHindiNew}
                  myRefQuestionEnglishNew={this.myRefQuestionEnglishNew}
                  myRefExplanationHindiNew={this.myRefExplanationHindiNew}
                  myRefExplanationEnglishNew={this.myRefExplanationEnglishNew}
                  refsArrayHindiNew={this.refsArrayHindiNew}
                  refsArrayEnglishNew={this.refsArrayEnglishNew}
                  questionData={this.state.questionData}
                  explanationData={this.state.explanationData}
                  listOfOptions={this.state.listOfOptions}
                  letterchartcode={this.state.letterchartcode}
                  handleOptioncontentchange={this.handleOptioncontentchange}
                  handleOptionWeightageChange={this.handleOptionWeightageChange}
                  addoptionfn={this.addoptionfn}
                  deleteOption={this.deleteOption}
                  savedata={this.savedatanewversion}
                  lang={this.props.lang}
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
    // console.log(currentvaluechapter,this.props.listOfChapter)
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
      <React.Fragment>
        {this.props.fetchedData.verified ? (
          <Form>
            <Form.Group controlId="exampleForm.ControlSelectauthoreditques">
              <Form.Label
                style={{
                  fontWeight: "600",
                }}
              >
                Authors
              </Form.Label>
              <Form.Control
                disabled
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

            <Form.Group>
              <Form.Label
                style={{
                  fontWeight: "600",
                }}
              >
                Subject
              </Form.Label>
              <Form.Control
                disabled
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
                  fontWeight: "600",
                }}
              >
                Chapter
              </Form.Label>
              <Form.Control
                disabled
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
                  fontWeight: "600",
                }}
              >
                Topic
              </Form.Label>
              <Form.Control
                disabled
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
                  fontWeight: "600",
                }}
              >
                Sub-topic
              </Form.Label>
              <Form.Control
                disabled
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
                  fontWeight: "600",
                }}
              >
                Tags
              </Form.Label>
              <ReactTags
                // disabled
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
                  fontWeight: "600",
                }}
              >
                Difficulty
              </Form.Label>
              <br />
              <Difficulty
                verified={true}
                difficulty={this.props.difficulty}
                handleDifficultyRadio={this.props.handleDifficultyRadio}
              />
            </Form.Group>
          </Form>
        ) : (
          <Form>
            <Form.Group controlId="exampleForm.ControlSelectauthoreditques">
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

            <Form.Group>
              <Form.Label
                style={{
                  fontWeight: "600",
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
                  fontWeight: "600",
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
                  fontWeight: "600",
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
                  fontWeight: "600",
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
                  fontWeight: "600",
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
        )}
      </React.Fragment>
    );
  }
}
class Rightpanel extends Component {
  render() {
    return (
      <React.Fragment>
        {this.props.fetchedData.verified ? (
          <Form>
            <QuestionComp
              verified={true}
              lang={this.props.lang}
              myRefQuestionHindi={this.props.myRefQuestionHindi}
              myRefQuestionEnglish={this.props.myRefQuestionEnglish}
              // handleQuestionEditor={this.props.handleQuestionEditor}
              questionData={this.props.questionData}
            />

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
                          disabled
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
                      {this.props.lang === "HINDI" ? (
                        <CKEditor
                          readOnly={true}
                          onBeforeLoad={(CKEDITOR) =>
                            (CKEDITOR.disableAutoInline = true)
                          }
                          ref={(ref) => {
                            // Callback refs are preferable when
                            // dealing with dynamic refs
                            this.props.refsArrayHindi[index] = ref;
                          }}
                          onFocus={(event) => {
                            window.hook(event.editor.document.$.body);
                            // let data = event.editor.getData();
                            // console.log('focus')
                            // event.editor.insertHtml(" ");
                            // this.props.handleOptioncontentchange(
                            //   index,
                            //   event.editor.getData()
                            // );
                            // installKeyupOption(index, event.editor);
                          }}
                          config={{
                            height: 100,

                            // placeholder: "Test description and instruction in English"
                          }}
                          data={item.content}
                          // onChange={event => {
                          //   // let data = editor.getData();
                          //   // console.log('change')
                          //   this.props.handleOptioncontentchange(
                          //     index,
                          //     event.editor.getData()
                          //   );
                          // }}
                        />
                      ) : (
                        <CKEditor
                          readOnly={true}
                          onBeforeLoad={(CKEDITOR) =>
                            (CKEDITOR.disableAutoInline = true)
                          }
                          ref={(ref) => {
                            // Callback refs are preferable when
                            // dealing with dynamic refs

                            this.props.refsArrayEnglish[index] = ref;
                            return true;
                          }}
                          // onFocus={event => {
                          //   // let data = event.editor.getData();
                          //   // console.log('focus')
                          //   event.editor.insertHtml(" ");
                          //   this.props.handleOptioncontentchange(
                          //     index,
                          //     event.editor.getData()
                          //   );
                          // }}
                          config={{
                            height: 100,

                            // placeholder: "Test description and instruction in English"
                          }}
                          data={item.content}
                          // onChange={event => {
                          //   // let data = editor.getData();
                          //   // console.log('change')
                          //   this.props.handleOptioncontentchange(
                          //     index,
                          //     event.editor.getData()
                          //   );
                          // }}
                        />
                      )}
                    </div>
                  </React.Fragment>
                );
              })}
            <Row>
              <Col lg="10"></Col>
              <Col></Col>
            </Row>
            <div style={{ margin: "2em 0" }}>
              <ExplanationComp
                verified={true}
                lang={this.props.lang}
                // handleExplanationEditor={this.props.handleExplanationEditor}
                explanationData={this.props.explanationData}
                myRefExplanationHindi={this.props.myRefExplanationHindi}
                myRefExplanationEnglish={this.props.myRefExplanationEnglish}
              />
            </div>

            <div style={{ margin: "1em 0", textAlign: "center" }}>
              {/* <Button
                style={{
                  borderRadius: "0",
                  background: "#3F5FBB",
                  borderColor: "#3F5FBB",
                  padding: "0.6em 2.5em",
                  fontSize: "1.1em",
                  fontWeight: "600",
                }}
                onClick={this.props.savedata}
              >
                Update data
              </Button> */}
            </div>
          </Form>
        ) : (
          <Form>
            <QuestionComp
              lang={this.props.lang}
              myRefQuestionHindi={this.props.myRefQuestionHindi}
              myRefQuestionEnglish={this.props.myRefQuestionEnglish}
              // handleQuestionEditor={this.props.handleQuestionEditor}
              questionData={this.props.questionData}
            />

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
                          value={item.weightage}
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
                      {this.props.lang === "HINDI" ? (
                        <CKEditor
                          onBeforeLoad={(CKEDITOR) =>
                            (CKEDITOR.disableAutoInline = true)
                          }
                          ref={(ref) => {
                            // Callback refs are preferable when
                            // dealing with dynamic refs
                            this.props.refsArrayHindi[index] = ref;
                          }}
                          onFocus={(event) => {
                            window.hook(event.editor.document.$.body);
                            // let data = event.editor.getData();
                            // console.log('focus')
                            // event.editor.insertHtml(" ");
                            // this.props.handleOptioncontentchange(
                            //   index,
                            //   event.editor.getData()
                            // );
                            // installKeyupOption(index, event.editor);
                          }}
                          config={{
                            height: 100,

                            // placeholder: "Test description and instruction in English"
                          }}
                          data={item.content}
                          // onChange={event => {
                          //   // let data = editor.getData();
                          //   // console.log('change')
                          //   this.props.handleOptioncontentchange(
                          //     index,
                          //     event.editor.getData()
                          //   );
                          // }}
                        />
                      ) : (
                        <CKEditor
                          onBeforeLoad={(CKEDITOR) =>
                            (CKEDITOR.disableAutoInline = true)
                          }
                          ref={(ref) => {
                            // Callback refs are preferable when
                            // dealing with dynamic refs

                            this.props.refsArrayEnglish[index] = ref;
                            return true;
                          }}
                          // onFocus={event => {
                          //   // let data = event.editor.getData();
                          //   // console.log('focus')
                          //   event.editor.insertHtml(" ");
                          //   this.props.handleOptioncontentchange(
                          //     index,
                          //     event.editor.getData()
                          //   );
                          // }}
                          config={{
                            height: 100,

                            // placeholder: "Test description and instruction in English"
                          }}
                          data={item.content}
                          // onChange={event => {
                          //   // let data = editor.getData();
                          //   // console.log('change')
                          //   this.props.handleOptioncontentchange(
                          //     index,
                          //     event.editor.getData()
                          //   );
                          // }}
                        />
                      )}
                    </div>
                  </React.Fragment>
                );
              })}
            <Row>
              <Col lg="10"></Col>
              <Col></Col>
            </Row>
            <div style={{ margin: "2em 0" }}>
              <ExplanationComp
                lang={this.props.lang}
                // handleExplanationEditor={this.props.handleExplanationEditor}
                explanationData={this.props.explanationData}
                myRefExplanationHindi={this.props.myRefExplanationHindi}
                myRefExplanationEnglish={this.props.myRefExplanationEnglish}
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
                onClick={this.props.savedata}
              >
                Update data
              </Button>
            </div>
          </Form>
        )}
      </React.Fragment>
    );
  }
}

function QuestionComp({
  verified,
  lang,
  myRefQuestionHindi,
  myRefQuestionEnglish,
  questionData,
}) {
  // console.log(questionData);
  return (
    <React.Fragment>
      {verified ? (
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
            {lang === "HINDI" ? (
              <div>
                <select
                  id="txtLanguage"
                  className="selectpicker"
                  onChange={window.setLang}
                  style={{ display: "none" }}
                >
                  <option value="0">English</option>
                  <option value="1">Devnagari</option>
                </select>

                <select
                  id="txtKeyboard"
                  className="selectpicker"
                  onChange={window.changeKB}
                  style={{ display: "none" }}
                >
                  <option value="Phonetic">Phonetic</option>
                  <option value="Ramington">Ramington</option>
                </select>
                <CKEditor
                  readOnly={true}
                  onBeforeLoad={(CKEDITOR) =>
                    (CKEDITOR.disableAutoInline = true)
                  }
                  config={{
                    height: 100,
                  }}
                  ref={myRefQuestionHindi}
                  onFocus={(event) => {
                    window.hook(event.editor.document.$.body);
                  }}
                  oninstanceReady={(event) => {
                    var a = document.getElementById("txtLanguage");
                    a.selectedIndex = 1;
                    window.setLang();
                    var b = document.getElementById("txtKeyboard");
                    b.selectedIndex = 1;
                    window.changeKB();
                  }}
                  data={questionData}
                />
              </div>
            ) : (
              <CKEditor
                readOnly={true}
                onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)}
                config={{
                  height: 100,
                }}
                ref={myRefQuestionEnglish}
                data={questionData}
              />
            )}
          </div>
        </Form.Group>
      ) : (
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
            {lang === "HINDI" ? (
              <div>
                <select
                  id="txtLanguage"
                  className="selectpicker"
                  onChange={window.setLang}
                  style={{ display: "none" }}
                >
                  <option value="0">English</option>
                  <option value="1">Devnagari</option>
                </select>

                <select
                  id="txtKeyboard"
                  className="selectpicker"
                  onChange={window.changeKB}
                  style={{ display: "none" }}
                >
                  <option value="Phonetic">Phonetic</option>
                  <option value="Ramington">Ramington</option>
                </select>
                <CKEditor
                  onBeforeLoad={(CKEDITOR) =>
                    (CKEDITOR.disableAutoInline = true)
                  }
                  config={{
                    height: 100,
                  }}
                  ref={myRefQuestionHindi}
                  onFocus={(event) => {
                    window.hook(event.editor.document.$.body);
                  }}
                  oninstanceReady={(event) => {
                    var a = document.getElementById("txtLanguage");
                    a.selectedIndex = 1;
                    window.setLang();
                    var b = document.getElementById("txtKeyboard");
                    b.selectedIndex = 1;
                    window.changeKB();
                  }}
                  data={questionData}
                />
              </div>
            ) : (
              <CKEditor
                onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)}
                config={{
                  height: 100,
                }}
                ref={myRefQuestionEnglish}
                data={questionData}
              />
            )}
          </div>
        </Form.Group>
      )}
    </React.Fragment>
  );
}
function ExplanationComp({
  verified,
  lang,
  myRefExplanationHindi,
  myRefExplanationEnglish,
  explanationData,
}) {
  return (
    <React.Fragment>
      {verified ? (
        <Form.Group>
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
            {lang === "HINDI" ? (
              <CKEditor
                readOnly={true}
                onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)}
                config={{
                  height: 100,
                }}
                ref={myRefExplanationHindi}
                onFocus={(event) => {
                  window.hook(event.editor.document.$.body);
                }}
                data={explanationData}
              />
            ) : (
              <CKEditor
                readOnly={true}
                onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)}
                config={{
                  height: 100,
                }}
                ref={myRefExplanationEnglish}
                data={explanationData}
              />
            )}
          </div>
        </Form.Group>
      ) : (
        <Form.Group>
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
            {lang === "HINDI" ? (
              <CKEditor
                onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)}
                config={{
                  height: 100,
                }}
                ref={myRefExplanationHindi}
                onFocus={(event) => {
                  window.hook(event.editor.document.$.body);
                }}
                data={explanationData}
              />
            ) : (
              <CKEditor
                onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)}
                config={{
                  height: 100,
                }}
                ref={myRefExplanationEnglish}
                data={explanationData}
              />
            )}
          </div>
        </Form.Group>
      )}
    </React.Fragment>
  );
}
class RightpanelNewVersion extends Component {
  render() {
    return (
      <React.Fragment>
        {this.props.fetchedData.verified ? (
          <Form>
            <QuestionComp
             verified={true}
              lang={this.props.lang}
              myRefQuestionHindi={this.props.myRefQuestionHindiNew}
              myRefQuestionEnglish={this.props.myRefQuestionEnglishNew}
              questionData={this.props.questionData}
            />
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
                          disabled
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
                        {/* <Button
                          style={{ float: "right", color: "grey" }}
                          variant="link"
                          onClick={this.props.deleteOption.bind(
                            this,
                            index,
                            this.props.lang
                          )}
                        >
                          X Delete
                        </Button> */}
                      </Col>
                    </Form.Group>
                    <div style={{ margin: "0.5em 0" }}>
                      {this.props.lang === "HINDI" ? (
                        <CKEditor
                        readOnly={true}
                          onBeforeLoad={(CKEDITOR) =>
                            (CKEDITOR.disableAutoInline = true)
                          }
                          ref={(ref) => {
                            // Callback refs are preferable when
                            // dealing with dynamic refs

                            this.props.refsArrayHindiNew[index] = ref;
                            return true;
                          }}
                          onFocus={(event) => {
                            window.hook(event.editor.document.$.body);
                            this.props.handleOptioncontentchange(
                              index,
                              event.editor.getData()
                            );
                            // let data = event.editor.getData();
                            // console.log('focus')
                            // event.editor.insertHtml(" ");
                            // this.props.handleOptioncontentchange(
                            //   index,
                            //   event.editor.getData()
                            // );
                            // installKeyupOption(index, event.editor);
                          }}
                          config={{
                            height: 100,

                            // placeholder: "Test description and instruction in English"
                          }}
                          data={item.content}
                          onChange={(event) => {
                            // let data = editor.getData();
                            // console.log('change')
                            this.props.handleOptioncontentchange(
                              index,
                              event.editor.getData()
                            );
                          }}
                        />
                      ) : (
                        <CKEditor
                        readOnly={true}
                          onBeforeLoad={(CKEDITOR) =>
                            (CKEDITOR.disableAutoInline = true)
                          }
                          ref={(ref) => {
                            // Callback refs are preferable when
                            // dealing with dynamic refs

                            this.props.refsArrayEnglishNew[index] = ref;
                            return true;
                          }}
                          onFocus={(event) => {
                            // let data = event.editor.getData();
                            // console.log('focus')
                            this.props.handleOptioncontentchange(
                              index,
                              event.editor.getData()
                            );
                          }}
                          config={{
                            height: 100,
                          }}
                          data={item.content}
                          onChange={(event) => {
                            this.props.handleOptioncontentchange(
                              index,
                              event.editor.getData()
                            );
                          }}
                        />
                      )}
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
                    float: "right",
                  }}
                >
                  {" "}
                  + Add Option
                </Button> */}
              </Col>
            </Row>
            <div style={{ margin: "2em 0" }}>
              <ExplanationComp
               verified={true}
                lang={this.props.lang}
                myRefExplanationHindi={this.props.myRefExplanationHindiNew}
                myRefExplanationEnglish={this.props.myRefExplanationEnglishNew}
                explanationData={this.props.explanationData}
              />
            </div>

            <div style={{ margin: "1em 0", textAlign: "center" }}>
              {/* <Button
                style={{
                  borderRadius: "0",
                  background: "#3F5FBB",
                  borderColor: "#3F5FBB",
                  padding: "0.6em 2.5em",
                  fontSize: "1.1em",
                  fontWeight: "600",
                }}
                onClick={this.props.savedata}
              >
                Update data
              </Button> */}
            </div>
          </Form>
        ) : (
          <Form>
            <QuestionComp
              lang={this.props.lang}
              myRefQuestionHindi={this.props.myRefQuestionHindiNew}
              myRefQuestionEnglish={this.props.myRefQuestionEnglishNew}
              questionData={this.props.questionData}
            />
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
                          style={{ float: "right", color: "grey" }}
                          variant="link"
                          onClick={this.props.deleteOption.bind(
                            this,
                            index,
                            this.props.lang
                          )}
                        >
                          X Delete
                        </Button>
                      </Col>
                    </Form.Group>
                    <div style={{ margin: "0.5em 0" }}>
                      {this.props.lang === "HINDI" ? (
                        <CKEditor
                          onBeforeLoad={(CKEDITOR) =>
                            (CKEDITOR.disableAutoInline = true)
                          }
                          ref={(ref) => {
                            // Callback refs are preferable when
                            // dealing with dynamic refs

                            this.props.refsArrayHindiNew[index] = ref;
                            return true;
                          }}
                          onFocus={(event) => {
                            window.hook(event.editor.document.$.body);
                            this.props.handleOptioncontentchange(
                              index,
                              event.editor.getData()
                            );
                            // let data = event.editor.getData();
                            // console.log('focus')
                            // event.editor.insertHtml(" ");
                            // this.props.handleOptioncontentchange(
                            //   index,
                            //   event.editor.getData()
                            // );
                            // installKeyupOption(index, event.editor);
                          }}
                          config={{
                            height: 100,

                            // placeholder: "Test description and instruction in English"
                          }}
                          data={item.content}
                          onChange={(event) => {
                            // let data = editor.getData();
                            // console.log('change')
                            this.props.handleOptioncontentchange(
                              index,
                              event.editor.getData()
                            );
                          }}
                        />
                      ) : (
                        <CKEditor
                          onBeforeLoad={(CKEDITOR) =>
                            (CKEDITOR.disableAutoInline = true)
                          }
                          ref={(ref) => {
                            // Callback refs are preferable when
                            // dealing with dynamic refs

                            this.props.refsArrayEnglishNew[index] = ref;
                            return true;
                          }}
                          onFocus={(event) => {
                            // let data = event.editor.getData();
                            // console.log('focus')
                            this.props.handleOptioncontentchange(
                              index,
                              event.editor.getData()
                            );
                          }}
                          config={{
                            height: 100,
                          }}
                          data={item.content}
                          onChange={(event) => {
                            this.props.handleOptioncontentchange(
                              index,
                              event.editor.getData()
                            );
                          }}
                        />
                      )}
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
                lang={this.props.lang}
                myRefExplanationHindi={this.props.myRefExplanationHindiNew}
                myRefExplanationEnglish={this.props.myRefExplanationEnglishNew}
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
                  fontWeight: "600",
                }}
                onClick={this.props.savedata}
              >
                Update data
              </Button>
            </div>
          </Form>
        )}
      </React.Fragment>
    );
  }
}

export default EditComponent;
