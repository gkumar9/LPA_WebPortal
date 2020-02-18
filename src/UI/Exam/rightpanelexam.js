import React, { Component } from "react";
import { Button, Row, Col, Form, Container } from "react-bootstrap";
// import CKEditor from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import CKEditor from "ckeditor4-react";
class RightExamPanel extends Component {
  render() {
    return (
      <div>
        <Row style={{ height: "auto" }} noGutters={true}>
          <Container fluid style={{ padding: "0" }}>
            <Form.Control
              style={{
                fontWeight: "600",
                margin: " 0 0.5em"
              }}
              plaintext
              readOnly
              defaultValue="Name"
            />
            <Row style={{ margin: "0em 0" }} noGutters={true}>
              <Col lg="6" style={{ paddingRight: "0.5em" }}>
                <Form.Control
                  value={this.props.testnameEnglish}
                  onChange={this.props.handleEnglishTestNameChange}
                  placeholder="Test name in English"
                  style={{ borderRadius: "0" }}
                />
              </Col>
              <Col></Col>
              <Col lg="6" style={{ paddingLeft: "0.5em" }}>
                <Form.Control
                  value={this.props.testnameHindi}
                  onChange={this.props.handleHindiTestNameChange}
                  placeholder="Test name in Hindi"
                  style={{ borderRadius: "0", float: "right" }}
                />
              </Col>
            </Row>
          </Container>
          <div style={{ margin: "1.7em 0", width: "100%" }}>
            {/* <Form.Control
              style={{
                fontWeight: "600",
                margin: " 0 0.5em"
              }}
              plaintext
              readOnly
              defaultValue="Description and Instruction"
            /> */}

            <div style={{ margin: "0em 0em", width: "100%" }}>
              <small>Test description and instruction in English</small>
              <CKEditor
                // editor={ClassicEditor}
                onBeforeLoad={CKEDITOR => (CKEDITOR.disableAutoInline = true)}
                onFocus={event=>{
                  event.editor.insertHtml( ' ' );
                  const data = event.editor.getData();
                  this.props.handleEnglishInstructionChange(data);
                }}
                config={{
                  height: 80
                  // placeholder: "Test description and instruction in English"
                }}
                data={this.props.testInstructionEnglish}
                onChange={event => {
                  const data = event.editor.getData();
                  this.props.handleEnglishInstructionChange(data);
                }}
              />
            </div>

            <div style={{ margin: "1em 0em", width: "100%" }}>
              <small>Test description and instruction in Hindi</small>
              <CKEditor
                onBeforeLoad={CKEDITOR => (CKEDITOR.disableAutoInline = true)}
                config={{
                  height: 80
                  // placeholder: "Test description and instruction in English"
                }}
                data={this.props.testInstructionHindi}
                onFocus={event=>{
                  event.editor.insertHtml( ' ' );
                  const data = event.editor.getData();
                  this.props.handleHindiInstructionChange(data);
                }}
                onChange={(event, editor) => {
                  const data = event.editor.getData();
                  this.props.handleHindiInstructionChange(data);
                }}
              />
            </div>
          </div>
          {this.props.listOfSection.length > 0 && (
            <Form.Control
              style={{
                fontWeight: "600",
                margin: " 0 0.5em"
              }}
              plaintext
              readOnly
              defaultValue="Section(s)"
            />
          )}
          {this.props.listOfSection &&
            this.props.listOfSection.map((item, index) => {
              return (
                <div
                  key={index}
                  style={{
                    border: "1px solid lightgrey",
                    width: "100%",
                    padding: "1em",
                    margin: "1em 0"
                  }}
                >
                  <Row noGutters={true} style={{ margin: "0em 0em" }}>
                    <Col lg="4">
                      {/* <Form.Control
                        style={{
                          fontWeight: "600"
                          // margin: " 0 0.5em"
                        }}
                        plaintext
                        readOnly
                        defaultValue="Section A"
                      /> */}
                    </Col>
                    {/* {this.props.listOfSection.length === index + 1 && ( */}
                    <Col>
                      <Button
                        style={{ float: "right", color: "grey" }}
                        variant="link"
                        onClick={this.props.deleteSection.bind(this, index)}
                      >
                        X Delete
                      </Button>
                    </Col>
                    {/* )} */}
                  </Row>
                  <Row noGutters={true} style={{ margin: "0em 0em" }}>
                    <Col lg="6" style={{ paddingRight: "0.5em" }}>
                      <small>Section Name in English</small>
                      <Form.Control
                        value={
                          item.versions.filter(
                            object => object.language === "ENGLISH"
                          )[0].name
                        }
                        onChange={this.props.handleSectionnameChange.bind(
                          this,
                          index,
                          "ENGLISH"
                        )}
                        placeholder="Section name in English"
                        style={{ borderRadius: "0" }}
                      />
                    </Col>
                    {/* <Col lg="2"></Col> */}
                    <Col lg="6" style={{ paddingLeft: "0.5em" }}>
                      <small>Section Name in Hindi</small>
                      <Form.Control
                        value={
                          item.versions.filter(
                            object => object.language === "HINDI"
                          )[0].name
                        }
                        onChange={this.props.handleSectionnameChange.bind(
                          this,
                          index,
                          "HINDI"
                        )}
                        placeholder="Section name in Hindi"
                        style={{ borderRadius: "0" }}
                      />
                    </Col>
                  </Row>
                  <Row noGutters={true} style={{ margin: "1em 0em" }}>
                    {/* <Col lg="2"></Col> */}
                    <Col lg="6" style={{ paddingRight: "0.5em" }}>
                      <small>Marks/ ques</small>
                      <Form.Control
                        type="number"
                        value={item.marksPerQuestion}
                        onChange={this.props.handleMarksperQuesChange.bind(
                          this,
                          index
                        )}
                        placeholder="Marks/ ques"
                        style={{ borderRadius: "0" }}
                      />
                    </Col>
                    {/* <Col lg="2"></Col> */}
                    <Col lg="6" style={{ paddingLeft: "0.5em" }}>
                      <small>Negative marks / ques</small>

                      <Form.Control
                        type="number"
                        value={item.negativeMarksPerQuestion}
                        onChange={this.props.handleNegativeMarksPerQuesChange.bind(
                          this,
                          index
                        )}
                        placeholder="-ve/ wrong ques"
                        style={{ borderRadius: "0" }}
                      />
                    </Col>
                  </Row>
                  <div style={{ margin: "1.7em 0", width: "100%" }}>
                    <div style={{ margin: "0em 0em", width: "100%" }}>
                      <small>
                        Section description and instruction in English
                      </small>
                      <CKEditor
                        onBeforeLoad={CKEDITOR =>
                          (CKEDITOR.disableAutoInline = true)
                        }
                        config={{
                          height: 80
                          // placeholder: "Test description and instruction in English"
                        }}
                        data={
                          item.versions.filter(
                            object => object.language === "ENGLISH"
                          )[0].content
                        }
                        onFocus={event=>{
                          event.editor.insertHtml( ' ' );
                          const data = event.editor.getData();
                          this.props.handleSectionDescriptionChange(
                            index,
                            "ENGLISH",
                            data
                          );
                        }}
                        onChange={(event, editor) => {
                          const data = event.editor.getData();
                          this.props.handleSectionDescriptionChange(
                            index,
                            "ENGLISH",
                            data
                          );
                        }}
                      />
                    </div>
                    <div style={{ margin: "1em 0em", width: "100%" }}>
                      <small>
                        Section description and instruction in Hindi
                      </small>
                      <CKEditor
                        onBeforeLoad={CKEDITOR =>
                          (CKEDITOR.disableAutoInline = true)
                        }
                        config={{
                          height: 80
                          // placeholder: "Test description and instruction in English"
                        }}
                        data={
                          item.versions.filter(
                            object => object.language === "HINDI"
                          )[0].content
                        }
                        onFocus={event=>{
                          event.editor.insertHtml( ' ' );
                          const data = event.editor.getData();
                          this.props.handleSectionDescriptionChange(
                            index,
                            "HINDI",
                            data
                          );
                        }}
                        onChange={(event, editor) => {
                          const data = event.editor.getData();
                          this.props.handleSectionDescriptionChange(
                            index,
                            "HINDI",
                            data
                          );
                        }}
                      />
                    </div>
                  </div>
                  {item.questions &&
                    item.questions.map((itemquestion, indexquestion) => {
                      return (
                        <Row key={indexquestion} style={{ marginTop: "0.5em" }}>
                          {/* <Col lg="2"></Col> */}
                          <Col lg="1">
                            <Form.Control
                              style={{
                                fontWeight: "500",
                                margin: " 0 0.5em",
                                textAlign: "right"
                                // paddingRight:'0'
                              }}
                              plaintext
                              readOnly
                              defaultValue={`Q ${indexquestion + 1}`}
                            />
                          </Col>
                          <Col lg="3" style={{}}>
                            <Form.Control
                              type="number"
                              value={itemquestion}
                              onChange={this.props.handlSectionQuestionValueChange.bind(
                                this,
                                index,
                                indexquestion
                              )}
                              placeholder="Question ID#"
                              style={{ borderRadius: "0" }}
                            />
                          </Col>
                          {/* {item.questions.length === indexquestion + 1 && ( */}
                            <Col>
                              <Button
                                style={{ float: "left", color: "grey" }}
                                variant="link"
                                onClick={this.props.deleteSectionQuestion.bind(
                                  this,
                                  index,
                                  indexquestion
                                )}
                              >
                                X Delete
                              </Button>
                            </Col>
                          {/* )} */}
                        </Row>
                      );
                    })}
                  <Row style={{ marginTop: "0.5em" }}>
                    <Col lg="1"></Col>
                    <Col>
                      <Button
                        onClick={this.props.addSectionQuestions.bind(
                          this,
                          index
                        )}
                        varirant="info"
                        style={{
                          fontSize: "0.8em",
                          fontWeight: "700",
                          background: "#6992EF",
                          borderColor: "#6992EF",
                          borderRadius: "0",
                          float: "left"
                        }}
                      >
                        {" "}
                        + Add question
                      </Button>
                    </Col>
                  </Row>
                </div>
              );
            })}

          <Container fluid style={{ paddingRight: "0" }}>
            <Row noGutters={true} style={{ margin: "1em 0em" }}>
              <Col lg="10"> </Col>
              <Col>
                <Button
                  onClick={this.props.addSection}
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
                  + Add Section
                </Button>
              </Col>
            </Row>
          </Container>
        </Row>
      </div>
    );
  }
}

export default RightExamPanel;
