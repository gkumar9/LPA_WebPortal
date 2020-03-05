import React, { Component } from "react";
import { Row, Col, Form, Container } from "react-bootstrap";
// import CKEditor from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import CKEditor from "ckeditor4-react";
class RightExamPanel extends Component {
  render() {
    return (
      <div>
        <Row noGutters={true} style={{ height: "auto" }}>
          <Container fluid style={{ padding: "0" }}>
            <Form.Control
              style={{
                fontWeight: "600"
                // margin: " 0 0.5em"
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
                onBeforeLoad={CKEDITOR => (CKEDITOR.disableAutoInline = true)}
                // editor={ClassicEditor}
                config={{
                  height: 80
                  // placeholder: "Test description and instruction in English"
                }}
                onFocus={event => {
                  event.editor.insertHtml(" ");
                  this.props.handleEnglishInstructionChange(
                    event.editor.getData()
                  );
                }}
                data={this.props.testInstructionEnglish}
                onChange={event => {
                  // const data = editor.getData();
                  this.props.handleEnglishInstructionChange(
                    event.editor.getData()
                  );
                }}
              />
            </div>
            <div style={{ margin: "1em 0em", width: "100%" }}>
              <small>Test description and instruction in Hindi</small>
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
                <option value="Typewrit">TypeWrit</option>
              </select>
              <CKEditor
                onBeforeLoad={CKEDITOR => (CKEDITOR.disableAutoInline = true)}
                // editor={ClassicEditor}
                config={{
                  height: 80
                  // placeholder: "Test description and instruction in Hindi"
                }}
                data={this.props.testInstructionHindi}
                onFocus={event => {
                  window.hook(event.editor.document.$.body);
                  event.editor.insertHtml(" ");
                  this.props.handleHindiInstructionChange(
                    event.editor.getData()
                  );
                }}
                onChange={event => {
                  // const data = editor.getData();
                  this.props.handleHindiInstructionChange(
                    event.editor.getData()
                  );
                }}
                oninstanceReady={event => {
                  var a = document.getElementById("txtLanguage");
                  a.selectedIndex = 1;
                  window.setLang();
                  var b = document.getElementById("txtKeyboard");
                  b.selectedIndex = 0;
                  window.changeKB();
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

                    {this.props.listOfSection.length === index + 1 && (
                      <Col>
                        {/* <Button
                          style={{ float: "right", color: "grey" }}
                          variant="link"
                          onClick={this.props.deleteSection}
                        >
                          X Delete
                        </Button> */}
                      </Col>
                    )}
                  </Row>
                  <Row noGutters={true} style={{ margin: "0em 0em" }}>
                    <Col lg="5">
                      <small>Section Name in English</small>
                      <Form.Control
                        value={
                          item.testSectionVersions.filter(
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
                    <Col lg="2"></Col>
                    <Col lg="5">
                      <small>Section Name in Hindi</small>
                      <Form.Control
                        value={
                          item.testSectionVersions.filter(
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
                    <Col lg="5">
                      <small>Marks/ ques</small>
                      <Form.Control
                        disabled
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
                      <small>Negative marks / ques</small>
                      <Form.Control
                        disabled
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
                        // editor={ClassicEditor}
                        data={
                          item.testSectionVersions.filter(
                            object => object.language === "ENGLISH"
                          )[0].content
                        }
                        config={{
                          height: 80
                          // placeholder:
                          //   "Section description and instruction in English"
                        }}
                        onFocus={event => {
                          event.editor.insertHtml(" ");
                          this.props.handleSectionDescriptionChange(
                            index,
                            "ENGLISH",
                            event.editor.getData()
                          );
                        }}
                        onChange={event => {
                          // const data = editor.getData();
                          this.props.handleSectionDescriptionChange(
                            index,
                            "ENGLISH",
                            event.editor.getData()
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
                        // editor={ClassicEditor}
                        data={
                          item.testSectionVersions.filter(
                            object => object.language === "HINDI"
                          )[0].content
                        }
                        config={{
                          height: 80,
                          placeholder:
                            "Section description and instruction in Hindi"
                        }}
                        onFocus={event => {
                          window.hook(event.editor.document.$.body);
                          event.editor.insertHtml(" ");
                          this.props.handleSectionDescriptionChange(
                            index,
                            "HINDI",
                            event.editor.getData()
                          );
                        }}
                        onChange={event => {
                          // const data = editor.getData();
                          this.props.handleSectionDescriptionChange(
                            index,
                            "HINDI",
                            event.editor.getData()
                          );
                        }}
                      />
                    </div>
                  </div>
                  {item.testSectionMapping &&
                    item.testSectionMapping.map(
                      (itemquestion, indexquestion) => {
                        return (
                          <Row
                            style={{ marginTop: "0.5em" }}
                            key={indexquestion}
                          >
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
                                disabled
                                type="number"
                                value={itemquestion.questionId}
                                onChange={this.props.handlSectionQuestionValueChange.bind(
                                  this,
                                  index,
                                  indexquestion
                                )}
                                placeholder="Question ID#"
                                style={{ borderRadius: "0" }}
                              />
                            </Col>
                            {/* {item.questions.length === indexquestion + 1 && (
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
                          )} */}
                          </Row>
                        );
                      }
                    )}
                  <Row style={{ marginTop: "0.5em" }}>
                    <Col lg="1"></Col>
                    <Col>
                      {/* <Button
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
                      </Button> */}
                    </Col>
                  </Row>
                </div>
              );
            })}

          <Container fluid style={{ paddingRight: "0" }}>
            <Row noGutters={true} style={{ margin: "1em 0em" }}>
              <Col lg="10"> </Col>
              <Col>
                {/* <Button
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
                </Button> */}
              </Col>
            </Row>
          </Container>
        </Row>
      </div>
    );
  }
}

export default RightExamPanel;
