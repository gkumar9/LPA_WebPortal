import React, { Component } from "react";
import { Row, Col, Form, Container } from "react-bootstrap";
import CKEditor from "ckeditor4-react";
class RightExamPanel extends Component {
  render() {
    return (
      <div>
        <Row noGutters={true} style={{ height: "auto" }}>
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
            <div style={{ margin: "0em 0em", width: "100%" }}>
              <small>Test description and instruction in English</small>
              <CKEditor
                ref={this.props.myReftestdescEnglish}
                onBeforeLoad={CKEDITOR => (CKEDITOR.disableAutoInline = true)}
                config={{
                  height: 80
                }}
                // onFocus={event => {
                //   // event.editor.insertHtml(" ");
                //   this.props.handleEnglishInstructionChange(
                //     event.editor.getData()
                //   );
                // }}
                data={this.props.testInstructionEnglish}
                // onChange={event => {
                //   this.props.handleEnglishInstructionChange(
                //     event.editor.getData()
                //   );
                // }}
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
                <option value="Ramington">Ramington</option>
              </select>
              <CKEditor
                ref={this.props.myReftestdescHindi}
                onBeforeLoad={CKEDITOR => (CKEDITOR.disableAutoInline = true)}
                config={{
                  height: 100
                }}
                data={this.props.testInstructionHindi}
                onFocus={event => {
                  window.hook(event.editor.document.$.body);
                }}
                oninstanceReady={event => {
                  var a = document.getElementById("txtLanguage");
                  a.selectedIndex = 1;
                  window.setLang();
                  var b = document.getElementById("txtKeyboard");
                  b.selectedIndex = 1;
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
                    <Col lg="4"></Col>

                    {this.props.listOfSection.length === index + 1 && (
                      <Col></Col>
                    )}
                  </Row>
                  <Row noGutters={true} style={{ margin: "0em 0em" }}>
                    <Col lg="6" style={{ paddingRight: "0.5em" }}>
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
                    {/* <Col lg="2"></Col> */}
                    <Col lg="6" style={{ paddingLeft: "0.5em" }}>
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
                    <Col lg="6" style={{ paddingRight: "0.5em" }}>
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
                    {/* <Col lg="2"></Col> */}
                    <Col lg="6" style={{ paddingLeft: "0.5em" }}>
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
                        ref={ref => {
                          this.props.refsSectionEnglish[index] = ref;
                          return true;
                        }}
                        onBeforeLoad={CKEDITOR =>
                          (CKEDITOR.disableAutoInline = true)
                        }
                        data={
                          item.testSectionVersions.filter(
                            object => object.language === "ENGLISH"
                          )[0].content
                        }
                        config={{
                          height: 100
                        }}
                      />
                    </div>
                    <div style={{ margin: "1em 0em", width: "100%" }}>
                      <small>
                        Section description and instruction in Hindi
                      </small>
                      <CKEditor
                        ref={ref => {
                          this.props.refsSectionHindi[index] = ref;
                          return true;
                        }}
                        onBeforeLoad={CKEDITOR =>
                          (CKEDITOR.disableAutoInline = true)
                        }
                        data={
                          item.testSectionVersions.filter(
                            object => object.language === "HINDI"
                          )[0].content
                        }
                        config={{
                          height: 100,
                          placeholder:
                            "Section description and instruction in Hindi"
                        }}
                        onFocus={event => {
                          window.hook(event.editor.document.$.body);
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
                            <Col lg="1">
                              <Form.Control
                                style={{
                                  fontWeight: "500",
                                  margin: " 0 0.5em",
                                  textAlign: "right"
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
                          </Row>
                        );
                      }
                    )}
                  <Row style={{ marginTop: "0.5em" }}>
                    <Col lg="1"></Col>
                    <Col></Col>
                  </Row>
                </div>
              );
            })}

          <Container fluid style={{ paddingRight: "0" }}>
            <Row noGutters={true} style={{ margin: "1em 0em" }}>
              <Col lg="10"> </Col>
              <Col></Col>
            </Row>
          </Container>
        </Row>
      </div>
    );
  }
}

export default RightExamPanel;
