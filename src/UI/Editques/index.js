import React, { Component } from "react";
import { Tab, Container, Row, Col, Nav } from "react-bootstrap";
import Header from "../Header/index";
import axios from "axios";
import URL from "../../Assets/url";
import EditComponent from "./editcomponent.js";
import swal from "sweetalert";

const style = {
  textAlign: "center",
  background: "white",
  borderRadius: "2em",
  color: "black",
  padding: " 0.3em 2em",
  letterSpacing: "0.2em"
};
class Editques extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionId: this.props.match.params.id,
      fetchedData: null,
      activetab: this.props.match.params.lang
    };
  }
  handleSelect = () => {
    let activetab = this.state.activetab;
    if (activetab === "ENGLISH") {
      this.setState({ activetab: "HINDI" });
    } else {
      this.setState({ activetab: "ENGLISH" });
    }
  };
  componentDidMount() {
    // console.log(this.props.match.params.lang)
    if (
      JSON.parse(localStorage.getItem("editquesdata")) &&
      JSON.parse(localStorage.getItem("editquesdata")) !== null
    ) {
      this.setState({
        fetchedData: JSON.parse(localStorage.getItem("editquesdata"))
      });
    } else {
      // alert("No Data found");
      axios({
        method: "POST",
        url: URL.geteditques + this.state.questionId,
        data: { authToken: "string" },
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          console.log(res.data.data.question);
          if (res.status === 200) {
            this.setState({ fetchedData: res.data.data.question });
            localStorage.setItem(
              "editquesdata",
              JSON.stringify(res.data.data.question)
            );
          } else {
            swal("Error", "No data found", "error");
            // alert(e);
            this.props.history.push({
              pathname: "/"
            });
          }
        })
        .catch(e => {
          // swal('Error', "No data found","error");
          alert(e);
          this.props.history.push({
            pathname: "/"
          });
        });
    }
  }
  render() {
    return (
      <React.Fragment>
        <Header props={this.props} />
        <Container
          fluid
          style={{ width: "auto", background: "#EEEEEE", padding: "0" }}
        >
          <Tab.Container
            activeKey={this.state.activetab}
            onSelect={key => this.handleSelect(key)}
          >
            <Row
              style={{
                margin: "0",
                padding: "1em 0em",
                borderBottom: "1px solid #cac2c2",
                boxShadow: "-1px 3px 4px -5px rgba(0, 0, 0, 0.75)",
                zIndex: "99",
                position: "relative"
              }}
            >
              <Col
                lg="1.5"
                style={{
                  margin: "0px 0em 0em 3em"
                }}
              >
                <Nav.Link
                  eventKey="ENGLISH"
                  style={
                    this.state.activetab === "ENGLISH"
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
                  eventKey="HINDI"
                  style={
                    this.state.activetab === "HINDI"
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
              <Col>
                <h6
                  style={{
                    float: "right",
                    marginTop: "0.5em",
                    marginRight: "1em"
                  }}
                >
                  Editing question Id: #{this.state.questionId}
                </h6>
              </Col>
            </Row>
            <Tab.Content>
              <Tab.Pane eventKey="ENGLISH">
                {this.state.fetchedData && (
                  <EditComponent
                    fetchedData={this.state.fetchedData}
                    match={this.props.match}
                    lang="ENGLISH"
                  />
                )}
              </Tab.Pane>
              <Tab.Pane eventKey="HINDI">
                {this.state.fetchedData && (
                  <EditComponent
                    fetchedData={this.state.fetchedData}
                    match={this.props.match}
                    lang="HINDI"
                  />
                )}
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Container>
      </React.Fragment>
    );
  }
}

export default Editques;
