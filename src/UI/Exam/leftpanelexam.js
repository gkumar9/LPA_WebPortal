import React, { Component } from "react";
import { Form, Row, Col } from "react-bootstrap";
import "./index.css";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
class LeftPanelExam extends Component {
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
        <Form.Group controlId="exampleForm.ControlSelect1111">
          <Form.Label
            style={{
              fontWeight: "600"
            }}
          >
            Exam
          </Form.Label>
          <Form.Control
            // style={{ borderRadius: "0" }}
            size="sm"
            as="select"
            // defaultValue=""
            onChange={this.props.handleExamChange}
            value={currentvalueexam}
            style={
              currentvalueexam !== ""
                ? { borderRadius: "0" }
                : { borderRadius: "0", color: "#a3a2a2" }
            }
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
              Select
            </option>
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
            style={
              currentvaluesubject !== ""
                ? { borderRadius: "0" }
                : { borderRadius: "0", color: "#a3a2a2" }
            }
            // style={{ borderRadius: "0" }}
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
        <Form.Group controlId="exampleForm.ControlSelect222">
          <Form.Label
            style={{
              fontWeight: "600"
            }}
          >
            Chapter
          </Form.Label>
          <Form.Control
            // style={{ borderRadius: "0" }}
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
              Select
            </option>
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
        {this.props.selectedType === "Previous year paper" && (
          <Form.Group controlId="exampleForm.ControlSelect22222">
            <Form.Label
              style={{
                fontWeight: "600"
              }}
            >
              Year
            </Form.Label>
            <Form.Control
              style={{ borderRadius: "0" }}
              size="sm"
              //   as="select"
              value={this.props.selectedTypeYear}
              onChange={this.props.handleTypeYearChange}
            ></Form.Control>
          </Form.Group>
        )}
        <Form.Group controlId="exampleForm.ControlSelect22221">
          <Form.Label
            style={{
              fontWeight: "600"
            }}
          >
            Stating date of test
          </Form.Label>
          <DatePicker
            selected={this.props.startDate}
            onChange={this.props.handleStartDateChange}
            dateFormat="dd/MM/yyyy"
          />
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlSelect222222">
          <Form.Label
            style={{
              fontWeight: "600"
            }}
          >
            Ending date of test
          </Form.Label>
          <DatePicker
            selected={this.props.endDate}
            onChange={this.props.handleEndDateChange}
            dateFormat="dd/MM/yyyy"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label
            style={{
              fontWeight: "600"
            }}
          >
            Total time for test (Hr : Min)
          </Form.Label>
          <Row noGutters={true}>
            <Col sm="5">
              <Form.Control
                type="number"
                placeholder="Hours"
                value={this.props.hour}
                onChange={this.props.onHourChange.bind(this)}
              ></Form.Control>
            </Col>
            <Col sm="2">
              <Form.Control
                style={{
                  textAlign: "center",
                  fontWeight: "600",
                  fontSize: "1em"
                }}
                plaintext
                readOnly
                defaultValue=":"
              />
            </Col>
            <Col sm="5">
              <Form.Control
                type="number"
                placeholder="Minutes"
                value={this.props.minute}
                onChange={this.props.onMinuteChange.bind(this)}
              ></Form.Control>
              {/* <TimePickerWrapper
          
            timeFormat="HH:MM"
            // timeMode="12"
            onTimeChange={this.props.onTimeChange}
            withoutIcon
            time={`${this.props.hour}:${this.props.minute}`}
          /> */}
            </Col>
          </Row>
        </Form.Group>
      </Form>
    );
  }
}

export default LeftPanelExam;
