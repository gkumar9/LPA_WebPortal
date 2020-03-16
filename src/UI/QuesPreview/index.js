import React, { Component } from "react";
import Error404 from "./404.js";
import { Button, Container, Card, Row, Col } from "react-bootstrap";
import Header from "../Header/index";
import "./index.css";
// import PdfContainer from "./pdf.js";
import Doc from "./doc";
// import ReactHtmlParser from "react-html-parser";
import MathJax from "react-mathjax-preview";
import swal from "@sweetalert/with-react";

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
  handleclearpreview = () => {
    swal({
      title: "Are you sure?",
      text: "All the question in this list will be cleared.",
      icon: "warning",
      buttons: true
      // dangerMode: true
    }).then(willDelete => {
      if (willDelete) {
        localStorage.setItem("Previewdata", []);
        this.setState(
          {
            isData: false,
            data: []
          },
          () => {
            this.props.history.push({
              pathname: "/"
            });
          }
        );
      }
    });
  };
  render() {
    // console.log(this.state.isData,localStorage.getItem("previewLanguage"),this.state.data)
    return (
      <React.Fragment>
        <Header props={this.props} />
        {this.state.isData && localStorage.getItem("previewLanguage") ? (
          <React.Fragment>
            <Row>
              <Col>
                <Button
                  id="clearpreview"
                  size="sm"
                  variant="outline-secondary"
                  style={{ float: "right", margin: "1em 1.5em" }}
                  onClick={this.handleclearpreview}
                >
                  Clear preview list & go back
                </Button>
              </Col>
            </Row>
            <ShowData data={this.state.data} />
          </React.Fragment>
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
      <Container fluid>
        <div>
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
                            id="cardpreview"
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

                              <Card.Text
                                style={{ marginBottom: "0em", display: "flex" }}
                              >
                                <b>{"Q. "}</b>

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
                                          style={{
                                            margin: "0.5em 0",
                                            display: "flex"
                                          }}
                                        >
                                          {" "}
                                          {optionindex + 1}
                                          {") "}{" "}
                                          <MathJax
                                            style={{ display: "inline-flex" }}
                                            math={optionitem.content}
                                          />
                                          <sub
                                            style={{
                                              display: "inline-block",
                                              position: "absolute",
                                              bottom: "0",
                                              left: "0",
                                              margin: " 0em 2em"
                                            }}
                                          >
                                            <b>W: {optionitem.weightage} </b>
                                          </sub>
                                        </Col>
                                      </React.Fragment>
                                    );
                                  })}{" "}
                              </Row>
                              <Row style={{ margin: "1em 0.1em" }}>
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
        </div>
      </Container>
    );
  }
}
export default PreviewQues;
