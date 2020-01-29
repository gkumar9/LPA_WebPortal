import React, { Component } from "react";
import { Form } from "react-bootstrap";
// import Difficulty from '../Ques/difficulty'
// import TagsInput from "react-tagsinput";

class LeftPanelExamtab extends Component {
  render() {
    let currentvalueexam = this.props.listOfExam.filter(
      item => item.exam.examId === this.props.selectedExamID
    )[0];
    currentvalueexam = currentvalueexam ? currentvalueexam.name : "";
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

    // let currentvaluetopic = this.props.listOfTopic.filter(
    //   item => item.subjectTopic.topicId === this.props.selectedTopicID
    // )[0];
    // currentvaluetopic = currentvaluetopic ? currentvaluetopic.title : "";
    // let currentvaluesubtopic = this.props.listOfSubTopic.filter(
    //   item => item.subjectSubtopic.subtopicId === this.props.selectedSubTopicID
    // )[0];
    // currentvaluesubtopic = currentvaluesubtopic
    //   ? currentvaluesubtopic.title
    //   : "";
    return (
      <Form>
        <Form.Group controlId="exampleForm.ControlSelect000">
          <Form.Label
            style={{
              fontWeight: "600"
            }}
          >
            Language
          </Form.Label>
          <Form.Control
            style={{ borderRadius: "0" }}
            size="sm"
            as="select"
            // defaultValue=""
            onChange={this.props.handleLanguageChange}
            value={this.props.selectedlanguage}
          >
            {this.props.listOfLanguage &&
              this.props.listOfLanguage.map((item, index) => {
                return (
                  <option key={index} value={item}>
                    {item}
                  </option>
                );
              })}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlSelect1111">
          <Form.Label
            style={{
              fontWeight: "600"
            }}
          >
            Exam
          </Form.Label>
          <Form.Control
            style={{ borderRadius: "0" }}
            size="sm"
            as="select"
            // defaultValue=""
            onChange={this.props.handleExamChange}
            value={currentvalueexam}
          >
            {this.props.listOfExam &&
              this.props.listOfExam.map((item, index) => {
                return (
                  <option key={index} value={item.name}>
                    {item.name}
                  </option>
                );
              })}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlSelect111">
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
        <Form.Group controlId="exampleForm.ControlSelect222">
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
        <Form.Group controlId="exampleForm.ControlSelect2222">
          <Form.Label
            style={{
              fontWeight: "600"
            }}
          >
            Type
          </Form.Label>
          <Form.Control
            style={{ borderRadius: "0" }}
            size="sm"
            as="select"
            value={this.props.selectedType}
            onChange={this.props.handleTypeChange}
          >
            {this.props.listOfType &&
              this.props.listOfType.map((item, index) => {
                return (
                  <option key={index} value={item}>
                    {item}
                  </option>
                );
              })}
          </Form.Control>
        </Form.Group>
      </Form>
    );
  }
}

export default LeftPanelExamtab;
