import React, { Component } from "react";
import { Button, Row, Col, Form } from "react-bootstrap";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
class ExamEnglihPanel extends Component {
  render() {
    return (
      <div style={{ padding: "20px 10px" }}>
        <Row style={{ height: "auto" }}>
          <Form.Control
            placeholder="Test name"
            style={{ borderRadius: "0", width: "30%" }}
          />
          <div style={{ margin: "1.5em 0", width: "100%" }}>
            <CKEditor
              editor={ClassicEditor}
              config={{
                placeholder: "Test description and instruction"
              }}
              // data={item.content}
              onChange={(event, editor) => {
                const data = editor.getData();
                //   this.props.handleOptioncontentchange(index, data);
              }}
            />
          </div>
          <div
            style={{
              border: "1px solid lightgrey",
              width: "100%",
              padding: "0.5em",
              margin: "0.5em 0"
            }}
          >
            <Row>
              <Col lg="2">
                <Form.Control
                  style={{
                    fontWeight: "600",
                    margin: " 0 0.5em"
                    // textAlign: "center"
                  }}
                  plaintext
                  readOnly
                  defaultValue="Section A"
                />

                {/* <span
                              style={{
                                fontWeight: "600",
                                margin: "0.5em",
                                textAlign: "center"
                              }}
                            >
                              Section A
                            </span> */}
              </Col>
              <Col lg="3">
                <Form.Control
                  placeholder="Section name"
                  style={{ borderRadius: "0" }}
                />
              </Col>
              <Col>
                <Form.Control
                  placeholder="Marks/ ques"
                  style={{ borderRadius: "0" }}
                />
              </Col>
              <Col>
                <Form.Control
                  placeholder="-ve/ wrong op"
                  style={{ borderRadius: "0" }}
                />
              </Col>
              <Col lg="3"></Col>
            </Row>
            <div style={{ margin: "1.5em 0", width: "100%" }}>
              <CKEditor
                editor={ClassicEditor}
                config={{
                  placeholder: "Section description and instruction"
                }}
                // data={item.content}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  //   this.props.handleOptioncontentchange(index, data);
                }}
              />
            </div>
            <Row>
              <Col lg="2"></Col>
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
                  defaultValue="Q1"
                />
              </Col>
              <Col lg="3" style={{ paddingLeft: "10px" }}>
                <Form.Control
                  placeholder="Question ID#"
                  style={{ borderRadius: "0" }}
                />
              </Col>
            </Row>
            <Row style={{ marginTop: "0.5em" }}>
              <Col lg="2"></Col>
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
                  defaultValue="Q2"
                />
              </Col>
              <Col lg="3" style={{ paddingLeft: "10px" }}>
                <Form.Control
                  placeholder="Question ID#"
                  style={{ borderRadius: "0" }}
                />
              </Col>
              <Col>
                <Button
                  style={{ float: "left", color: "grey" }}
                  variant="link"
                  // onClick={this.props.deleteOption.bind(this, index)}
                >
                  X Delete
                </Button>
              </Col>
            </Row>
            <Row style={{ marginTop: "0.5em" }}>
              <Col lg="3"></Col>
              <Col>
                <Button
                  onClick={this.props.addoptionfn}
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
                  + Add Option
                </Button>
              </Col>
            </Row>
          </div>
          <Row>
            {/* <Col lg="10"> </Col> */}
            <Col style={{ textAlign: "right" }}>
              <Button
                // onClick={this.props.addoptionfn}
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
        </Row>
      </div>
    );
  }
}

export default ExamEnglihPanel;
