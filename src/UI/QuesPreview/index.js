import React, { Component } from "react";
import Error404 from "./404.js";
import { Button, Container, Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import Back from "@material-ui/icons/ArrowBack";
import { styled } from "@material-ui/styles";
import Header from "../Header/index";
import "./index.css";
import Pdf from "react-to-pdf";
const ref = React.createRef();

const MyBack = styled(Back)({
  color: "dimgrey",
  marginTop: "-0.2em",
  width: "1em"
});
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
        <Header />
        <div
          className="backbuttonprint"
          style={{
            boxShadow: "0px 3px 5px lightgrey",
            width: "auto",
            height: "4.5em",
            padding: "1em 3em"
          }}
        >
          <Link to="/">
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
        </div>
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
  render() {
    console.log(this.state.editabledata);
    return (
      <Container>
        <Pdf targetRef={ref} filename="code-example.pdf">
          {({ toPdf }) => (
            <button
              style={{
                // width: "auto",
                // background: "#EEEEEE",
                padding: "0.4em 1em",
                // float:'right',
                margin: "0.9em 1.5em"
              }}
              onClick={toPdf}
            >
              Generate Pdf
            </button>
          )}
        </Pdf>
        <div
          ref={ref}
          style={{
            width: "100%",
            height:"auto",
            // background: "#EEEEEE",
            padding: "0.5em 1.5em"
          }}
        >
          {this.state.editabledata &&
            this.state.editabledata.map((item, index) => {
              return (
                <Row
                  key={item.questionId}
                  style={{
                    margin: "0.5em 0em",
                    borderBottom: "1px #c2c2c2 solid"
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
                          {/* <Form.Check
                            inline
                            type="checkbox"
                            checked={
                              this.state.listOfsearchselected[index].status
                            }
                            onChange={this.handleInputChangeCheckboxlistsearch.bind(
                              this,
                              index
                            )}
                          /> */}

                          <span>
                            <b>Id#</b>{" "}
                            <span style={{ color: "dimgrey" }}>
                              {item.questionId}
                            </span>
                          </span>
                          <span
                            style={{
                              float: "right",
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
                        </Card.Title>

                        <Card.Text
                          style={{ marginBottom: "0.5em", fontSize: "1.2em" }}
                        >
                          {/* {"Q. "} */}
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
                                  <Col lg="6">
                                    {optionindex + 1}
                                    {") "}{" "}
                                    {optionitem.content.replace(
                                      /<\/?[^>]+(>|$)/g,
                                      ""
                                    )}{" "}
                                    <sub>
                                      <small>
                                        <b> {optionitem.weightage}</b>
                                      </small>
                                    </sub>
                                  </Col>
                                </React.Fragment>
                              );
                            })}{" "}
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
export default PreviewQues;
