import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  ButtonGroup
} from "react-bootstrap";
import Header from "../Header/index";
import Back from "@material-ui/icons/ArrowBack";
import { styled } from "@material-ui/styles";
import { Tabs } from "@yazanaabed/react-tabs";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const MyBack = styled(Back)({
  color: "dimgrey",
  marginTop: "-0.2em",
  width: "1em"
});
function Ques() {
  return (
    <React.Fragment>
      <Header />
      <div
        style={{
          boxShadow: "0px 3px 5px lightgrey",
          width: "auto",
          height: "4.5em",
          padding: "1em 3em"
        }}
      >
        <Button
          variant="light"
          style={{ background: "transparent", border: "transparent" }}
        >
          <MyBack />
          <span
            style={{ marginLeft: "1em", fontSize: "1.2em", color: "dimgrey" }}
          >
            Back to dashboard
          </span>
        </Button>
      </div>
      <Container
        fluid
        style={{ width: "auto", background: "#EEEEEE", padding: "0.5em 3em" }}
      >
        <Row style={{ height: "auto" }}>
          <Col lg="3">
            <div
              style={{
                width: "auto",
                height: "4.5em"
              }}
            ></div>
            <LeftPanel />
          </Col>
          <Col lg="1"></Col>
          <Col>
            <div>
              <Tabs
                activeTab={{
                  id: "tab1"
                }}
              >
                <Tabs.Tab id="tab1" title="English">
                  <div style={{ padding: "20px 0" }}>
                    <RightpanelEnglish />
                  </div>
                </Tabs.Tab>
                <Tabs.Tab id="tab2" title="Hindi">
                  <div style={{ padding: 10 }}>This is tab 2</div>
                </Tabs.Tab>
              </Tabs>
            </div>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
}
class RightpanelEnglish extends Component {
  constructor(props) {
    super();
    this.state = {
      listOfOptions: ["Option A", "Option B", "Option C", "Option D"],
      letterchartcode: 69
    };
  }
  addoptionfn = () => {
    let currentCharCode = this.state.letterchartcode;
    let name = "Option " + String.fromCharCode(currentCharCode);
    let currentArrayOfOption = this.state.listOfOptions;
    currentArrayOfOption.push(name);
    this.setState({
      listOfOptions: currentArrayOfOption,
      letterchartcode: currentCharCode + 1
    });
  };
  deleteOption = index => {
    let currentCharCode = this.state.letterchartcode;
    let currentArrayOfOption = this.state.listOfOptions;
    currentArrayOfOption.pop(index);
    this.setState({
      listOfOptions: currentArrayOfOption,
      letterchartcode: currentCharCode - 1
    });
  };
  render() {
    return (
      <Form>
        <QuestionComp ClassicEditor={ClassicEditor} />
        {this.state.listOfOptions &&
          this.state.listOfOptions.map((item, index) => {
            return (
              <React.Fragment key={item}>
                <Form.Group
                  as={Row}
                  controlId="exampleForm.EControlInput2"
                  style={{ marginTop: "2em" }}
                >
                  <Form.Label column sm="2" style={{ fontWeight: "600" }}>
                    {item}
                  </Form.Label>
                  <Col sm="2">
                    <Form.Control
                      style={{ borderRadius: "0", background: "lightgrey" }}
                      type="number"
                      placeholder="weightage"
                    />
                  </Col>
                  {this.state.listOfOptions.length === index + 1 && (
                    <Col>
                      <Button
                        style={{ float: "right", color: "grey" }}
                        variant="link"
                        onClick={this.deleteOption.bind(this, index)}
                      >
                        X Delete
                      </Button>
                    </Col>
                  )}
                </Form.Group>
                <div style={{ margin: "0.5em 0" }}>
                  <CKEditor
                    // style={{margin:'1em'}}
                    editor={ClassicEditor}
                    data="<p>Hello from CKEditor 5!</p>"
                    onInit={editor => {
                      // You can store the "editor" and use when it is needed.
                      console.log("Editor is ready to use!", editor);
                    }}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      console.log({ event, editor, data });
                    }}
                    onBlur={(event, editor) => {
                      console.log("Blur.", editor);
                    }}
                    onFocus={(event, editor) => {
                      console.log("Focus.", editor);
                    }}
                  />
                </div>
              </React.Fragment>
            );
          })}
        <Row>
          <Col lg="10"></Col>
          <Col>
            <Button
              onClick={this.addoptionfn}
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
              + Add Option
            </Button>
          </Col>
        </Row>
        <div style={{ margin: "2em 0" }}>
          <ExplanationComp />
        </div>

        <div style={{ margin: "1em 0", textAlign: "center" }}>
          <Button
            style={{
              borderRadius: "0",
              background: "#3F5FBB",
              borderColor: "#3F5FBB"
            }}
          >
            Save & move to Hindi section
          </Button>
        </div>
      </Form>
    );
  }
}
function ExplanationComp() {
  return (
    <Form.Group controlId="exampleForm.EControlInput1">
      <Form.Label
        style={{
          fontWeight: "600"
        }}
      >
        Explanation
      </Form.Label>
      <div
        style={{
          margin: "0.5em 0"
        }}
      >
        <CKEditor
          editor={ClassicEditor}
          data="<p>Hello from CKEditor 5!</p>"
          onInit={editor => {
            // You can store the "editor" and use when it is needed.
            console.log("Editor is ready to use!", editor);
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            console.log({
              event,
              editor,
              data
            });
          }}
          onBlur={(event, editor) => {
            console.log("Blur.", editor);
          }}
          onFocus={(event, editor) => {
            console.log("Focus.", editor);
          }}
        />
      </div>
    </Form.Group>
  );
}
function LeftPanel() {
  return (
    <Form>
      <Form.Group controlId="exampleForm.ControlSelect1">
        <Form.Label>Subject</Form.Label>
        <Form.Control style={{ borderRadius: "0" }} size="sm" as="select">
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="exampleForm.ControlSelect2">
        <Form.Label>Chapter</Form.Label>
        <Form.Control style={{ borderRadius: "0" }} size="sm" as="select">
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="exampleForm.ControlSelect3">
        <Form.Label>Topic</Form.Label>
        <Form.Control style={{ borderRadius: "0" }} size="sm" as="select">
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="exampleForm.ControlSelect4">
        <Form.Label>Sub-topic</Form.Label>
        <Form.Control style={{ borderRadius: "0" }} size="sm" as="select">
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="exampleForm.ControlInput1">
        <Form.Label>Tags</Form.Label>
        <Form.Control style={{ borderRadius: "0" }} size="sm" type="text" />
      </Form.Group>
      <Form.Group controlId="exampleForm.ControlTextarea1">
        <Form.Label>Difficulty</Form.Label>
        <br />
        <ButtonGroup size="" aria-label="Basic example">
          <Button variant="light">+</Button>
          <Button variant="light">++</Button>
          <Button variant="light">++</Button>
        </ButtonGroup>
      </Form.Group>
    </Form>
  );
}
export default Ques;

function QuestionComp({ ClassicEditor }) {
  return (
    <Form.Group controlId="exampleForm.EControlInput1">
      <Form.Label
        style={{
          fontWeight: "600"
        }}
      >
        Question
      </Form.Label>
      <div
        style={{
          margin: "0.5em 0"
        }}
      >
        <CKEditor
          editor={ClassicEditor}
          data="<p>Hello from CKEditor 5!</p>"
          onInit={editor => {
            // You can store the "editor" and use when it is needed.
            console.log("Editor is ready to use!", editor);
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            console.log({
              event,
              editor,
              data
            });
          }}
          onBlur={(event, editor) => {
            console.log("Blur.", editor);
          }}
          onFocus={(event, editor) => {
            console.log("Focus.", editor);
          }}
        />
      </div>
    </Form.Group>
  );
}
