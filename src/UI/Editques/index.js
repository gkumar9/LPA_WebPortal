import React, { Component } from "react";
import { Container, Button } from "react-bootstrap";
import Header from "../Header/index";
import Back from "@material-ui/icons/ArrowBack";
import { styled } from "@material-ui/styles";
import { Link } from "react-router-dom";
import axios from "axios";
import URL from "../../Assets/url";
import EditComponent from "./editcomponent.js";
const MyBack = styled(Back)({
  color: "dimgrey",
  marginTop: "-0.2em",
  width: "1em"
});
class Editques extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionId: this.props.match.params.id,
      fetchedData: null
      // activetab: "1"
    };
  }
  componentDidMount() {
    // console.log(this.props.match.params.lang)
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
        }
      })
      .catch(e => {
        alert(e);
      });
  }
  // handleSelect = () => {
  //   let activetab = this.state.activetab;
  //   if (activetab === "1") {
  //     this.setState({ activetab: "2" });
  //   } else {
  //     this.setState({ activetab: "1" });
  //   }
  // };
  // handleChange = data => {
  //   console.log("Id from english response", data);
  //   this.setState({ questionId: data });
  // };
  render() {
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
        </div>
        <Container
          fluid
          style={{
            width: "auto",
            background: "#EEEEEE",
            padding: "0.5em 1.5em"
          }}
        >
          {this.state.fetchedData && (
            <EditComponent
              fetchedData={this.state.fetchedData}
              match={this.props.match}
            />
          )}
        </Container>
      </React.Fragment>
    );
  }
}

export default Editques;
