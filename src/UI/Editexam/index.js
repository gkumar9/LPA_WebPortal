import React, { Component } from "react";
import { Container } from "react-bootstrap";
import Header from "../Header/index";
import axios from "axios";
import URL from "../../Assets/url";
import EditComponentExam from "./editcomponentexam.js";
import swal from "sweetalert";
class EditExam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      testId: this.props.match.params.id,
      fetchedData: null,
    };
  }
  componentDidMount() {
    axios({
      method: "POST",
      url: URL.getexamcontent + this.state.testId,
      data: { authToken: "string" },
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        // console.log(res.data.data.test);
        if (res.status === 200) {
          this.setState({ fetchedData: res.data.data.test });
        }
      })
      .catch((e) => {
        swal("Error", "No data found", "error");
        this.props.history.push({
          pathname: "/",
        });
      });
  }
  render() {
    return (
      <React.Fragment>
        <Header props={this.props} />
        <Container
          fluid
          style={{
            width: "auto",
            background: "#EEEEEE",
            padding: "0",
          }}
        >
          {this.state.fetchedData && (
            <EditComponentExam fetchedData={this.state.fetchedData} />
          )}
        </Container>
      </React.Fragment>
    );
  }
}
export default EditExam;
