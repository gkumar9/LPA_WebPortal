import React, { Component } from "react";
import { Container, Tab, Nav, Row, Col } from "react-bootstrap";
import Header from "../Header/index";
// import Back from "@material-ui/icons/ArrowBack";
// import { styled } from "@material-ui/styles"; // If using WebPack and style-loader.
import "./index.css";
import EnglishHQuesTab from "./QuesEnglish.js";
import HindiQuesTab from "./QuesHindi.js";
// import { Link } from "react-router-dom";
const style = {
  textAlign: "center",
  background: "white",
  borderRadius: "2em",
  color: "black",
  padding: " 0.3em 2em",
  letterSpacing: "0.2em"
};
// const MyBack = styled(Back)({
//   color: "dimgrey",
//   marginTop: "-0.2em",
//   width: "1em"
// });
class Ques extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionId: "",
      activetab: "english"
    };
  }
  handleSelect = () => {
    let activetab = this.state.activetab;
    if (activetab === "english") {
      this.setState({ activetab: "hindi" });
    } else {
      this.setState({ activetab: "english" });
    }
  };
  handleChange = data => {
    console.log("Id from english response", data);
    this.setState({ questionId: data });
  };
  render() {
    return (
      <React.Fragment>
        <Header props={this.props}/>
        {/* <div
          style={{
            boxShadow: "0px 3px 5px lightgrey",
            width: "auto",
            height: "4.5em",
            padding: "1em 3em"
          }}
        >
          <Link to="/" target="_self">
            <Button
              variant="light"
              style={{ background: "transparent", border: "transparent" }}
            >
              <MyBack />
              <span
                style={{
                  marginLeft: "1em",
                  fontSize: "1.2em",
                  color: "dimgrey"
                }}
              >
                Back to dashboard
              </span>
            </Button>
          </Link>
        </div> */}
        <Container fluid style={{ width: "auto", background: "#EEEEEE" }}>
          <Tab.Container
            activeKey={this.state.activetab}
            onSelect={key => this.handleSelect(key)}
          >
            <Row
              style={{
                padding: "1em 0em",
                borderBottom: "1px solid #cac2c2",
                boxShadow: "-1px 3px 4px -3px rgba(0, 0, 0, 0.75)",
                zIndex: "99",
                position: "relative"
              }}
            >
              {/* <Col lg="3"></Col> */}
              <Col
                lg="1.5"
                // className="customtabcolor"
                style={{
                  margin: "0px 0em 0em 3em"
                }}
              >
                <Nav.Link
                  eventKey="english"
                  style={
                    this.state.activetab === "english"
                      ? style
                      : {
                          color: "dimgrey",
                          letterSpacing: "0.2em",
                          padding: " 0.3em 2em"
                        }
                  }
                >
                  <span style={{ fontSize: "larger" }}>English </span>
                </Nav.Link>
              </Col>
              <Col
                lg="1.5"
                style={{
                  padding: "0 "
                }}
              >
                <Nav.Link
                  eventKey="hindi"
                  style={
                    this.state.activetab === "hindi"
                      ? style
                      : {
                          color: "dimgrey",
                          letterSpacing: "0.2em",
                          padding: " 0.3em 2em"
                        }
                  }
                >
                  <span style={{ fontSize: "larger" }}>Hindi</span>
                </Nav.Link>
              </Col>
              <Col></Col>
            </Row>
            <Tab.Content>
              <Tab.Pane eventKey="english">
                <EnglishHQuesTab
                  questionId={this.state.questionId}
                  handleChange={this.handleChange}
                  handleSelect={this.handleSelect}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="hindi">
                <HindiQuesTab
                  questionId={this.state.questionId}
                  handleChange={this.handleChange}
                  handleSelect={this.handleSelect}
                />
              </Tab.Pane>
            </Tab.Content>
            {/* <Tabs
            className="myClass "
            variant="pill"
            activeKey={this.state.activetab}
            onSelect={this.handleSelect}
          >
            <Tab eventKey={1} title="English">
              <EnglishHQuesTab
                questionId={this.state.questionId}
                handleChange={this.handleChange}
                handleSelect={this.handleSelect}
              />
            </Tab>
            <Tab eventKey={2} title="Hindi">
              <HindiQuesTab
                questionId={this.state.questionId}
                handleChange={this.handleChange}
                handleSelect={this.handleSelect}
              />
            </Tab>
          </Tabs> */}
          </Tab.Container>
        </Container>
      </React.Fragment>
    );
  }
}
export default Ques;
