import React, { Component } from "react";
import { Button, Row, Col, Form, Container } from "react-bootstrap";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
class RightExamPanel extends Component {
  render() {
    return (
      <div>
        <Row style={{ height: "auto" }}>
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
            <Row style={{ margin: "0em 0" }}>
              <Col lg="4" style={{ padding: "0" }}>
                <Form.Control
                  value={this.props.testnameEnglish}
                  onChange={this.props.handleEnglishTestNameChange}
                  placeholder="Test name in English"
                  style={{ borderRadius: "0" }}
                />
              </Col>
              <Col></Col>
              <Col lg="4" style={{ padding: "0" }}>
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
            <Form.Control
              style={{
                fontWeight: "600",
                margin: " 0 0.5em"
              }}
              plaintext
              readOnly
              defaultValue="Description and Instruction"
            />
            <div style={{ margin: "0em 0em", width: "100%" }}>
              <CKEditor
                editor={ClassicEditor}
                config={{
                  placeholder: "Test description and instruction in English"
                }}
                data={this.props.testInstructionEnglish}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  this.props.handleEnglishInstructionChange(data);
                }}
              />
            </div>
            <div style={{ margin: "1em 0em", width: "100%" }}>
              <CKEditor
                editor={ClassicEditor}
                config={{
                  placeholder: "Test description and instruction in Hindi"
                }}
                data={this.props.testInstructionHindi}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  this.props.handleHindiInstructionChange(data);
                }}
              />
            </div>
          </div>

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
                  <Row noGutters={true} style={{ margin: "1em 0em" }}>
                    <Col lg="4">
                      <Form.Control
                        style={{
                          fontWeight: "600"
                          // margin: " 0 0.5em"
                        }}
                        plaintext
                        readOnly
                        defaultValue="Section A"
                      />
                    </Col>
                    {this.props.listOfSection.length === index + 1 && (
                      <Col>
                        <Button
                          style={{ float: "right", color: "grey" }}
                          variant="link"
                          onClick={this.props.deleteSection}
                        >
                          X Delete
                        </Button>
                      </Col>
                    )}
                  </Row>
                  <Row noGutters={true} style={{ margin: "1em 0em" }}>
                    <Col lg="5">
                      <Form.Control
                        value={
                          item.testSectionVersions.filter(
                            object => object.language === "ENGLISH"
                          )[0].sectionName
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
                    <Col lg="2"></Col>
                    <Col lg="5">
                      <Form.Control
                        value={
                          item.testSectionVersions.filter(
                            object => object.language === "HINDI"
                          )[0].sectionName
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
                    <Col lg="5">
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
                    <Col lg="2"></Col>
                    <Col lg="5">
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
                      <CKEditor
                        editor={ClassicEditor}
                        data={
                          item.testSectionVersions.filter(
                            object => object.language === "ENGLISH"
                          )[0].content
                        }
                        config={{
                          placeholder:
                            "Section description and instruction in English"
                        }}
                        onChange={(event, editor) => {
                          const data = editor.getData();
                          this.props.handleSectionDescriptionChange(
                            index,
                            "ENGLISH",
                            data
                          );
                        }}
                      />
                    </div>
                    <div style={{ margin: "1em 0em", width: "100%" }}>
                      <CKEditor
                        editor={ClassicEditor}
                        data={
                          item.testSectionVersions.filter(
                            object => object.language === "HINDI"
                          )[0].content
                        }
                        config={{
                          placeholder:
                            "Section description and instruction in Hindi"
                        }}
                        onChange={(event, editor) => {
                          const data = editor.getData();
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
                        <Row style={{ marginTop: "0.5em" }}>
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
                          {item.questions.length === indexquestion + 1 && (
                            <Col>
                              <Button
                                style={{ float: "left", color: "grey" }}
                                variant="link"
                                onClick={this.props.deleteSectionQuestion.bind(
                                  this,
                                  index
                                )}
                              >
                                X Delete
                              </Button>
                            </Col>
                          )}
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
