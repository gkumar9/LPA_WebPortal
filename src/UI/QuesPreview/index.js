import React, { Component } from "react";
import Error404 from "./404.js";
import { Button, Container, Card, Row, Col } from "react-bootstrap";
import Header from "../Header/index";
import "./index.css";
import PdfContainer from "./pdf.js";
import Doc from "./doc";
// import ReactHtmlParser from "react-html-parser";
import MathJax from "react-mathjax-preview";

class PreviewQues extends Component {
  constructor(props) {
    super(props);
    this.state = { isData: false, data: [] };
  }
  componentDidMount() {
    if (
      this.props.location.state !== undefined &&
      this.props.location.state.data.length > 0
    ) {
      this.setState({ isData: true, data: this.props.location.state.data });
    } else {
      if (
        localStorage.getItem("Previewdata") !== null &&
        JSON.parse(localStorage.getItem("Previewdata")).length > 0
      ) {
        this.setState({
          isData: true,
          data: JSON.parse(localStorage.getItem("Previewdata"))
        });
      } else {
        var path = document.getElementById("tail");
        path.setAttribute(
          "d",
          "M89,315c2.2-15.2-23-13.2-21.6,4.8c1.7,22.3,24.4,22.1,42.5,9.1c10.8-7.8,15.3-1.8,19.1,1.1 c2.3,1.7,6.7,3.3,11-3"
        );
      }
    }
  }
  render() {
    return (
      <React.Fragment>
        <Header props={this.props} />
        {this.state.isData && localStorage.getItem("previewLanguage") ? (
          <ShowData data={this.state.data} />
        ) : (
          <Error404 />
        )}
      </React.Fragment>
    );
  }
}

class ShowData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editabledata: [],
      selectedLanguage: localStorage.getItem("previewLanguage")
    };
  }
  componentDidMount() {
    this.setState({ editabledata: this.props.data });
  }
  createPdf = html => Doc.createPdf(html);
  deleteQuestion = index => {
    let templist = this.state.editabledata;
    templist.splice(index, 1);
    this.setState({ editabledata: templist });
    // console.log(templist);
    localStorage.setItem("Previewdata", JSON.stringify(templist));
  };
  render() {
    return (
      <Container>
        <PdfContainer createPdf={this.createPdf}>
          <div
            style={{
              padding: "0.5em 1.5em"
            }}
          >
            {this.state.editabledata &&
              this.state.editabledata.map((item, index) => {
                return (
                  <div>
                    {item.questionVersions.filter(
                      obbj => obbj.language === this.state.selectedLanguage
                    ).length > 0 ? (
                      <Row
                        noGutters={true}
                        key={item.questionId}
                        style={{
                          margin: "0.5em 0em",
                          borderBottom: "1px #cecccc solid"
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
                            <Card.Body
                              style={{ padding: "0", margin: "0.5em 0" }}
                            >
                              <Card.Title
                                style={{
                                  fontSize: "medium",
                                  marginBottom: "0"
                                }}
                              >
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
                                        // float: "right",
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
                                  <Col lg="3">
                                    <Button
                                      className="backbuttonprint"
                                      style={{
                                        float: "right",
                                        color: "grey",
                                        fontSize: "0.8em"
                                      }}
                                      variant="link"
                                      onClick={this.deleteQuestion.bind(
                                        this,
                                        index
                                      )}
                                    >
                                      X Delete
                                    </Button>
                                  </Col>
                                </Row>
                              </Card.Title>

                              <Card.Text style={{ marginBottom: "0em" }}>
                                <b>{"Q. "}</b>
                                {/* <div
                                  dangerouslySetInnerHTML={{
                                    __html: item.questionVersions.filter(
                                      obbj =>
                                        obbj.language ===
                                        this.state.selectedLanguage
                                    )[0].content
                                  }}
                                ></div> */}
                                <span>
                                  <MathJax
                                    style={{ display: "inline-flex" }}
                                    math={
                                      item.questionVersions.filter(
                                        obbj =>
                                          obbj.language ===
                                          this.state.selectedLanguage
                                      )[0].content
                                    }
                                  />
                                  {/* {ReactHtmlParser(
                                  item.questionVersions.filter(
                                    obbj =>
                                      obbj.language ===
                                      this.state.selectedLanguage
                                  )[0].content
                                )} */}
                                </span>
                                {/* {item.questionVersions
                                  .filter(
                                    obbj =>
                                      obbj.language ===
                                      this.state.selectedLanguage
                                  )[0]
                                  .content.replace(/<\/?[^>]+(>|$)/g, "")} */}
                              </Card.Text>
                              <Row>
                                {item.questionVersions
                                  .filter(
                                    obbj =>
                                      obbj.language ===
                                      this.state.selectedLanguage
                                  )[0]
                                  .options.map((optionitem, optionindex) => {
                                    return (
                                      <React.Fragment key={optionindex}>
                                        <Col
                                          lg="6"
                                          style={{ margin: "0.5em 0" }}
                                        >
                                          {optionindex + 1}
                                          {") "}{" "}
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
                                <b> Sol. </b> &nbsp;
                                <MathJax
                                  style={{ display: "inline-flex" }}
                                  math={
                                    item.questionVersions.filter(
                                      obbj =>
                                        obbj.language ===
                                        this.state.selectedLanguage
                                    )[0].solution
                                  }
                                />
                                {/* {ReactHtmlParser(
                                  item.questionVersions.filter(
                                    obbj =>
                                      obbj.language ===
                                      this.state.selectedLanguage
                                  )[0].solution
                                )} */}
                                {/* {item.questionVersions
                                  .filter(
                                    obbj =>
                                      obbj.language ===
                                      this.state.selectedLanguage
                                  )[0]
                                  .solution.replace(/<\/?[^>]+(>|$)/g, "")} */}
                              </Row>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                    ) : (
                      <div></div>
                    )}
                  </div>
                );
              })}
          </div>
        </PdfContainer>
      </Container>
    );
  }
}
export default PreviewQues;
