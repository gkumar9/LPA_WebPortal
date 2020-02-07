import React, { Component } from "react";
import Header from "../Header/index";
import { Button, Container, Card, Row, Col } from "react-bootstrap";
import Error404 from "../QuesPreview/404.js";
import "../QuesPreview/index.css";
import PdfContainer from "../QuesPreview/pdf.js";
import Doc from "../QuesPreview/doc";
import axios from "axios";
import URL from "../../Assets/url";
class Previewtest extends Component {
  constructor(props) {
    super(props);
    this.state = { isData: false, testId: null, data: [] };
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
            console.log(res.data.data);
            if(res.status===200){
                let testdataresponse=res.data.data.test;
                

            }
          })
          .catch(e => {
            alert(e);
            this.props.history.push({
              pathname: "/"
            });
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
                  <Row
                    noGutters={true}
                    key={item.questionId}
                    style={{
                      margin: "0.5em 0em"
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
                                    // float: "right",
                                    fontSize: "15px",
                                    fontWeight: "600"
                                  }}
                                >
                                  <b>Tags: </b>
                                  <span style={{ color: "#1D4B7F" }}>
                                    Difficulty:{" "}
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

                          <Card.Text style={{ marginBottom: "0.5em" }}>
                            <b>{"Q. "}</b>
                            {item.questionVersions
                              .filter(
                                obbj =>
                                  obbj.language === this.state.selectedLanguage
                              )[0]
                              .content.replace(/<\/?[^>]+(>|$)/g, "")}
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
                                      {") "}{" "}
                                      {optionitem.content.replace(
                                        /<\/?[^>]+(>|$)/g,
                                        ""
                                      )}{" "}
                                      <sub
                                      // style={{border:' dimgrey solid',padding:'0.1em'}}
                                      >
                                        -<b> {optionitem.weightage}</b>
                                      </sub>
                                    </Col>
                                  </React.Fragment>
                                );
                              })}{" "}
                          </Row>
                          <Row style={{ margin: "0.2em 0.1em" }}>
                            <b> Sol- </b>
                            {item.questionVersions
                              .filter(
                                obbj =>
                                  obbj.language === this.state.selectedLanguage
                              )[0]
                              .solution.replace(/<\/?[^>]+(>|$)/g, "")}
                          </Row>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                );
              })}
          </div>
        </PdfContainer>
      </Container>
    );
  }
}
export default Previewtest;
