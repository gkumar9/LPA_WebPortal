import React, { Component } from "react";
import { Container } from "react-bootstrap";
import Header from "../Header/index";
// import Back from "@material-ui/icons/ArrowBack";
// import { styled } from "@material-ui/styles";
// import { Link } from "react-router-dom";
import axios from "axios";
import URL from "../../Assets/url";
import EditComponentExam from "./editcomponentexam.js";
// const MyBack = styled(Back)({
//   color: "dimgrey",
//   marginTop: "-0.2em",
//   width: "1em"
// });
class EditExam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      testId: this.props.match.params.id,
      fetchedData: null
      // activetab: "1"
    };
  }
  componentDidMount() {
    axios({
      method: "POST",
      url: URL.getexamcontent + this.state.testId,
      data: { authToken: "string" },
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => {
      console.log(res.data.data.test);
      if (res.status === 200) {
        this.setState({ fetchedData: res.data.data.test });
      }
    }).catch((e)=>{
      alert(e);
      this.props.history.push({
        pathname: "/"
      });
    })
  }
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
        <Container
          fluid
          style={{
            width: "auto",
            // height:'90vh',
            background: "#EEEEEE",
            padding: "0"
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
