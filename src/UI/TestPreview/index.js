import React, { Component } from "react";
import Header from "../Header/index";
import { Container, Card, Row, Col } from "react-bootstrap";
import Error404 from "../QuesPreview/404.js";
import "../QuesPreview/index.css";
import axios from "axios";
import URL from "../../Assets/url";
import PdfContainer from "./../QuesPreview/pdf";
import Doc from "./../QuesPreview/doc";
// import ReactHtmlParser from "react-html-parser";
import MathJax from "react-mathjax-preview";

class Previewtest extends Component {
  constructor(props) {
    super(props);
    this.state = { isData: false, testId: null, data: {} };
  }
  componentDidMount() {
    let testId = JSON.parse(localStorage.getItem("TestPreviewId"));

    if (testId && testId !== undefined && testId !== "") {
      this.setState({ testId: testId }, () => {
        axios({
          method: "POST",
          url: URL.getexamcontent + this.state.testId,
          data: { authToken: "string" },
          headers: {
            "Content-Type": "application/json"
          }
        })
          .then(res => {
            if (res.status === 200) {
              let testdataresponse = res.data.data.test;
              if (
                testdataresponse.testSections &&
                testdataresponse.testSections.length > 0
              ) {
                this.setState({ data: testdataresponse, isData: true });
              }
            }
          })
          .catch(e => {
            alert(e);
            // this.props.history.push({
            //   pathname: "/"
            // });
          });
      });
    } else {
      var path = document.getElementById("tail");
      path.setAttribute(
        "d",
        "M89,315c2.2-15.2-23-13.2-21.6,4.8c1.7,22.3,24.4,22.1,42.5,9.1c10.8-7.8,15.3-1.8,19.1,1.1 c2.3,1.7,6.7,3.3,11-3"
      );
    }
  }
  createPdfexam = html => Doc.createPdf(html);
  render() {
    // console.log(this.state.data, this.state.isData);
    return (
      <React.Fragment>
        <Header props={this.props} />
        {this.state.isData && localStorage.getItem("TestPreviewLanguage") ? (
          <PdfContainer createPdf={this.createPdfexam}>
            <Container style={{ marginTop: "1em" }}>
              <center style={{ margin: "0 2em", textTransform: "capitalize" }}>
                <h3>
                  {
                    this.state.data.testVersions.filter(
                      item =>
                        item.language ===
                        localStorage.getItem("TestPreviewLanguage")
                    )[0].name
                  }
                </h3>
              </center>
              <Row>
                <Col lg="4">
                  {" "}
                  Time allowed:
                  {this.state.data.time ? this.state.data.time : " NA"}
                </Col>
                <Col />
                <Col lg="4">
                  <span style={{ float: "right" }}>
                    Maximum marks:
                    {this.state.data.maximumMarks
                      ? this.state.data.maximumMarks
                      : " NA"}
                  </span>
                </Col>
              </Row>
              <hr />
              <center>INSTRUCTION</center>
              {/* <div
              dangerouslySetInnerHTML={{
                __html: this.state.data.testVersions.filter(
                  item =>
                    item.language ===
                    localStorage.getItem("TestPreviewLanguage")
                )[0].instructions
              }}
            > */}
              <div>
                <MathJax
                  style={{ display: "inline-flex" }}
                  math={
                    this.state.data.testVersions.filter(
                      item =>
                        item.language ===
                        localStorage.getItem("TestPreviewLanguage")
                    )[0].instructions
                  }
                />
                {/* {ReactHtmlParser(this.state.data.testVersions.filter(
                  item =>
                    item.language ===
                    localStorage.getItem("TestPreviewLanguage")
                )[0].instructions)} */}
              </div>
              {/* {
                  this.state.data.testVersions.filter(
                    item =>
                      item.language ===
                      localStorage.getItem("TestPreviewLanguage")
                  )[0].instructions
                } */}
              {/* </div> */}
              <br />
              {this.state.data.testSections.map((item, index) => {
                return (
                  <div key={index}>
                    <center>
                      <h6>
                        {
                          item.testSectionVersions.filter(
                            obj =>
                              obj.language ===
                              localStorage.getItem("TestPreviewLanguage")
                          )[0].sectionName
                        }
                      </h6>
                    </center>
                    <br />
                    <div
                      // dangerouslySetInnerHTML={{
                      //   __html: item.testSectionVersions.filter(
                      //     obj =>
                      //       obj.language ===
                      //       localStorage.getItem("TestPreviewLanguage")
                      //   )[0].content
                      // }}
                      style={{ borderBottom: "1px #cecccc solid" }}
                    >
                      <MathJax
                        style={{ display: "inline-flex" }}
                        math={
                          item.testSectionVersions.filter(
                            obj =>
                              obj.language ===
                              localStorage.getItem("TestPreviewLanguage")
                          )[0].content
                        }
                      />
                      {/* {ReactHtmlParser(
                        item.testSectionVersions.filter(
                          obj =>
                            obj.language ===
                            localStorage.getItem("TestPreviewLanguage")
                        )[0].content
                      )} */}
                    </div>

                    <QuestionShowData
                      key={index}
                      data={item.testSectionMapping}
                    />
                  </div>
                );
              })}
            </Container>
          </PdfContainer>
        ) : (
          <Error404 />
        )}
      </React.Fragment>
    );
  }
}

class QuestionShowData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editabledata: this.props.data,
      finaldata: [],
      selectedLanguage: localStorage.getItem("TestPreviewLanguage")
    };
  }
  componentDidMount() {
    this.state.editabledata.map(item => {
      axios({
        method: "POST",
        url: URL.geteditques + item.questionId,
        data: { authToken: "string" },
        headers: {
          "Content-Type": "application/json"
        }
      }).then(res => {
        let currentarray = this.state.finaldata;
        currentarray.push(res.data.data.question);
        this.setState({ finaldata: currentarray });
      });
    });
  }
  render() {
    return (
      <Container>
        <div
          style={{
            padding: "0"
          }}
        >
          {this.state.finaldata &&
            this.state.finaldata.map((item, index) => {
              return (
                <Row
                  noGutters={true}
                  key={item.questionId}
                  style={{
                    margin: "2em 0em"
                    // borderBottom: "1px #cecccc solid"
                    // borderBottom: "1px #c2c2c2 solid"
                  }}
                >
                  <Col
                    style={{
                      paddingLeft: "0em",
                      paddingRight: "0em"
                    }}
                  >
                    <Card
                      style={{
                        background: "transparent",
                        borderColor: "transparent"
                      }}
                    >
                      <Card.Body style={{ padding: "0", margin: "0.5em 0" }}>
                        <Card.Title style={{ fontSize: "medium" }}>
                          <Row noGutters={true}>
                            <Col lg="1">
                              <span>
                                <small>
                                  <b>#</b>{" "}
                                </small>
                                <span style={{ color: "dimgrey" }}>
                                  {item.questionId}
                                </span>
                              </span>
                            </Col>

                            <Col>
                              <span
                                style={{
                                  float: "right",
                                  fontSize: "15px",
                                  fontWeight: "600"
                                }}
                              >
                                <b>Tags: </b>
                                <span style={{ color: "#1D4B7F" }}>
                                  {/* Difficulty:{" "} */}
                                  {item.level === "EASY"
                                    ? item.level === "MILD"
                                      ? "++"
                                      : "+"
                                    : item.level === "MILD"
                                    ? "++"
                                    : "+++"}
                                </span>
                                ,
                                <span
                                  style={{
                                    color: "darkgreen",
                                    textTransform: "lowercase"
                                  }}
                                >
                                  {" "}
                                  {item.type}
                                </span>
                                <span
                                  style={{
                                    color: "darkgoldenrod",
                                    textTransform: "lowercase"
                                  }}
                                >
                                  {item.tags.length > 0 &&
                                    item.tags.map(itm => {
                                      return `, ${itm.tag}`;
                                    })}
                                </span>
                              </span>
                            </Col>
                          </Row>
                        </Card.Title>

                        <Card.Text style={{ marginBottom: "0.5em" }}>
                          <b>{"Q. "}</b>
                          <MathJax
                            style={{ display: "inline-flex" }}
                            math={
                              item.questionVersions.filter(
                                obbj =>
                                  obbj.language === this.state.selectedLanguage
                              )[0].content
                            }
                          />
                          {/* {ReactHtmlParser(
                            item.questionVersions.filter(
                              obbj =>
                                obbj.language === this.state.selectedLanguage
                            )[0].content
                          )} */}
                          {/* {item.questionVersions
                            .filter(
                              obbj =>
                                obbj.language === this.state.selectedLanguage
                            )[0]
                            .content.replace(/<\/?[^>]+(>|$)/g, "")} */}
                        </Card.Text>
                        <Row>
                          {item.questionVersions
                            .filter(
                              obbj =>
                                obbj.language === this.state.selectedLanguage
                            )[0]
                            .options.map((optionitem, optionindex) => {
                              return (
                                <React.Fragment key={optionindex}>
                                  <Col lg="6" style={{ margin: "0.5em 0" }}>
                                    {optionindex + 1}
                                    {") "}
                                    <MathJax
                                      style={{ display: "inline-flex" }}
                                      math={optionitem.content}
                                    />
                                    {/* {ReactHtmlParser(optionitem.content)} */}
                                    {/* {optionitem.content.replace(
                                      /<\/?[^>]+(>|$)/g,
                                      ""
                                    )}{" "} */}
                                    <sub
                                    // style={{border:' dimgrey solid',padding:'0.1em'}}
                                    >
                                      (<b> {optionitem.weightage} </b>)
                                    </sub>
                                  </Col>
                                </React.Fragment>
                              );
                            })}{" "}
                        </Row>
                        <Row style={{ margin: "0.2em 0.1em" }}>
                          <b> Sol- </b>
                          <MathJax
                            style={{ display: "inline-flex" }}
                            math={
                              item.questionVersions.filter(
                                obbj =>
                                  obbj.language === this.state.selectedLanguage
                              )[0].solution
                            }
                          />
                          {/* {ReactHtmlParser(
                            item.questionVersions.filter(
                              obbj =>
                                obbj.language === this.state.selectedLanguage
                            )[0].solution
                          )} */}
                          {/* {item.questionVersions
                            .filter(
                              obbj =>
                                obbj.language === this.state.selectedLanguage
                            )[0]
                            .solution.replace(/<\/?[^>]+(>|$)/g, "")} */}
                        </Row>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              );
            })}
        </div>
      </Container>
    );
  }
}
export default Previewtest;
