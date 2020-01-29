import React, { Component } from "react";
import { Button, Row, Col, Form, Container } from "react-bootstrap";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
class ExamEnglihPanel extends Component {
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
                  placeholder="Test name in English"
                  style={{ borderRadius: "0" }}
                />
              </Col>
              <Col></Col>
              <Col lg="4" style={{ padding: "0" }}>
                <Form.Control
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
                onChange={(event, editor) => {
                  const data = editor.getData();
                }}
              />
            </div>
            <div style={{ margin: "1em 0em", width: "100%" }}>
              <CKEditor
                editor={ClassicEditor}
                config={{
                  placeholder: "Test description and instruction in Hindi"
                }}
                onChange={(event, editor) => {
                  const data = editor.getData();
                }}
              />
            </div>
          </div>

          <div
            style={{
              border: "1px solid lightgrey",
              width: "100%",
              padding: "1em",
              margin: "0em 0"
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
              <Col>
                <Button
                  style={{ float: "right", color: "grey" }}
                  variant="link"
                  // onClick={this.props.deleteOption.bind(this, index)}
                >
                  X Delete
                </Button>
              </Col>
            </Row>
            <Row noGutters={true} style={{ margin: "1em 0em" }}>
              {/* <Col lg="2">
                <Form.Control
                  style={{
                    fontWeight: "600",
                    margin: " 0 0em"
                  }}
                  plaintext
                  readOnly
                  defaultValue="Section A"
                />
              </Col> */}
              <Col lg="5">
                <Form.Control
                  placeholder="Section name in English"
                  style={{ borderRadius: "0" }}
                />
              </Col>
              <Col lg="2"></Col>
              <Col lg="5">
                <Form.Control
                  placeholder="Section name in Hindi"
                  style={{ borderRadius: "0" }}
                />
              </Col>
            </Row>
            <Row noGutters={true} style={{ margin: "1em 0em" }}>
              {/* <Col lg="2"></Col> */}
              <Col lg="5">
                <Form.Control
                  placeholder="Marks/ ques"
                  style={{ borderRadius: "0" }}
                />
              </Col>
              <Col lg="2"></Col>
              <Col lg="5">
                <Form.Control
                  placeholder="-ve/ wrong ques"
                  style={{ borderRadius: "0" }}
                />
              </Col>
            </Row>
            <div style={{ margin: "1.7em 0", width: "100%" }}>
              <div style={{ margin: "0em 0em", width: "100%" }}>
                <CKEditor
                  editor={ClassicEditor}
                  config={{
                    placeholder:
                      "Section description and instruction in English"
                  }}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                  }}
                />
              </div>
              <div style={{ margin: "1em 0em", width: "100%" }}>
                <CKEditor
                  editor={ClassicEditor}
                  config={{
                    placeholder: "Section description and instruction in Hindi"
                  }}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                  }}
                />
              </div>
            </div>
            <Row>
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
              <Col lg="1"></Col>
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
          <Row noGutters={true} style={{ margin: "1em 0em" }}>
            <Col lg="10"> </Col>
            <Col >
              <Button
                // onClick={this.props.addoptionfn}
                varirant="info"
                style={{
                  fontSize: "0.8em",
                  fontWeight: "700",
                  background: "#FF8976",
                  borderColor: "#FF8976",
                  borderRadius: "0",
                  // float: "right"
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
