import React, { Component } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
// import Difficulty from '../Ques/difficulty'
// import TagsInput from "react-tagsinput";
import ReactTags from "react-tag-autocomplete";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
class LeftPanelQAtab extends Component {
  render() {
    let currentvaluesubject = this.props.listOfSubject.filter(
      (item) => item.subject.subjectId === this.props.selectedSubjectID
    )[0];

    currentvaluesubject = currentvaluesubject
      ? currentvaluesubject.subjectName
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

    return (
      <Form>
        <Form.Group controlId="exampleForm.ControlSelect0">
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
            onChange={this.props.handleLanguageChange.bind(this)}
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
            placeholderText="Search tag"
            tags={this.props.tags}
            onInput={this.props.handleChangeTags}
            suggestions={this.props.suggestions}
            onDelete={this.props.onDelete.bind(this)}
            onAddition={this.props.onAddition.bind(this)}
          />
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlSelectauthorexam">
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
        <Form.Group controlId="exampleForm.ControlSelectauthor">
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
        <Form.Group controlId="exampleForm.ControlSelect1">
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
            onChange={this.props.handleSubjectChange.bind(this)}
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
        <Form.Group controlId="exampleForm.ControlSelect3">
          <Form.Label
            style={{
              fontWeight: "600",
            }}
          >
            Topic
          </Form.Label>
          <Form.Control
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
              Select all
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
              Select all
            </option>
          </Form.Control>
        </Form.Group>

        {/* <Form.Group controlId="exampleForm.ControlInput1">
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
        </Form.Group> */}
        <>
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
                {/* <span style={{ fontSize: "12px" }}>&#10005; </span> */}
                Clear Search
              </Button>
              {/* )} */}
            </Col>
            <Col xs lg="7" >
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
                {/* <span style={{ fontSize: "12px" }}>&#10004;</span> */}
                Search with filters
              </Button>
            </Col>
          </Row>
        </>
      </Form>
    );
  }
}

export default LeftPanelQAtab;
