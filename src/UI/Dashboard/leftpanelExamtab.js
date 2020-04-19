import React, { Component } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
class LeftPanelExamtab extends Component {
  render() {
    let currentvalueexam = this.props.listOfExam.filter(
      (item) => item.exam.examId === this.props.selectedExamID
    )[0];
    currentvalueexam = currentvalueexam ? currentvalueexam.name : "";
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
    let currentvalueauthor = this.props.authorList.filter(
      (item) => item.authorId === this.props.authorId
    )[0];
    currentvalueauthor = currentvalueauthor
      ? currentvalueauthor.authorName
      : "";
    let currentvalueuser = this.props.userList.filter(
      (item) => item.userId === this.props.userId
    )[0];
    currentvalueuser = currentvalueuser ? currentvalueuser.name : "";

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
              fontWeight: "600",
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
            value={this.props.selectedLanguage}
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
        <Form.Group controlId="exampleForm.ControlSelectauthorqa">
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
              Select all
            </option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlSelectuserqa">
          <Form.Label
            style={{
              fontWeight: "600",
            }}
          >
            Users
          </Form.Label>
          <Form.Control
            style={
              currentvalueuser !== ""
                ? { borderRadius: "0" }
                : { borderRadius: "0", color: "#a3a2a2" }
            }
            size="sm"
            as="select"
            // defaultValue=""
            onChange={this.props.handleUserChange}
            value={currentvalueuser}
          >
            {this.props.userList &&
              this.props.userList.map((item, index) => {
                return (
                  <option key={index} value={item.name}>
                    {item.name}
                  </option>
                );
              })}
            <option key="" value="">
              Select all
            </option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlSelect22221">
          <Form.Label
            style={{
              fontWeight: "600",
            }}
          >
            Date
          </Form.Label>
          <DatePicker
            selected={this.props.date}
            onChange={this.props.handleDateChange}
            dateFormat="dd/MM/yyyy"
          />
        </Form.Group>

        <Form.Group controlId="exampleForm.ControlSelect1111">
          <Form.Label
            style={{
              fontWeight: "600",
            }}
          >
            Exam
          </Form.Label>
          <Form.Control
            style={
              currentvalueexam !== ""
                ? { borderRadius: "0" }
                : { borderRadius: "0", color: "#a3a2a2" }
            }
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
            <option key="" value="">
              Select all
            </option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlSelect111">
          <Form.Label
            style={{
              fontWeight: "600",
            }}
          >
            Subject
          </Form.Label>
          <Form.Control
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
              Select all
            </option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlSelect222">
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
              Select all
            </option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlSelect2222">
          <Form.Label
            style={{
              fontWeight: "600",
            }}
          >
            Type
          </Form.Label>
          <Form.Control
            // style={{ borderRadius: "0" }}
            size="sm"
            as="select"
            style={
              this.props.selectedType !== ""
                ? { borderRadius: "0" }
                : { borderRadius: "0", color: "#a3a2a2" }
            }
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
            <option key="" value="">
              Select
            </option>
          </Form.Control>
        </Form.Group>
        <>
          {/* <Button
            size="sm"
            onClick={this.props.handlesearchWithFilter}
            style={{
              borderRadius: "0",
              background: "#419ABB",
              borderColor: "transparent"
            }}
          >
            Search with filters
          </Button>
          {this.props.searchResultListLength > 0 && (
            <Button
              size="sm"
              onClick={this.props.clearSearchFromFilters}
              style={{
                marginLeft: "1em",
                borderRadius: "0",
                background: "dimgrey",
                borderColor: "transparent"
              }}
            >
              Clear Search
            </Button>
          )} */}
          <Row>
            <Col xs style={{ paddingRight: "0" }}>
              {/* {this.props.searchResultListLength > 0 && ( */}
              <Button
                size="sm"
                onClick={this.props.clearSearchFromFilters}
                style={{
                  // width:'auto',
                  // marginLeft: "1.5em",
                  color: "#615f5f",
                  borderRadius: "0",
                  background: "transparent",
                  borderColor: "#b7b7b7",
                }}
              >
                Clear Search
              </Button>
              {/* )} */}
            </Col>
            <Col xs lg="7" style={{ paddingLeft: "0" }}>
              <Button
                size="sm"
                onClick={this.props.handlesearchWithFilter}
                style={{
                  borderRadius: "0",
                  background: "rgb(106, 163, 255)",
                  borderColor: "transparent",
                  float: "right",
                  // marginRight: "0.5em"
                }}
              >
                Search with filters
              </Button>
            </Col>
          </Row>
        </>
      </Form>
    );
  }
}

export default LeftPanelExamtab;
