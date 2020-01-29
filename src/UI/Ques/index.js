import React, { Component } from "react";
import { Container, Button, Tabs, Tab } from "react-bootstrap";
import Header from "../Header/index";
import Back from "@material-ui/icons/ArrowBack";
import { styled } from "@material-ui/styles"; // If using WebPack and style-loader.
import "./index.css";
import EnglishHQuesTab from "./QuesEnglish.js";
import HindiQuesTab from "./QuesHindi.js";
import { Link } from "react-router-dom";

const MyBack = styled(Back)({
  color: "dimgrey",
  marginTop: "-0.2em",
  width: "1em"
});
class Ques extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionId: "",
      activetab: "1"
    }
    
  }
  handleSelect = () => {
    let activetab = this.state.activetab;
    if (activetab === "1") {
      this.setState({ activetab: "2" });
    } else {
      this.setState({ activetab: "1" });
    }
  };
  handleChange=(data)=>{
    console.log('Id from english response',data);
    this.setState({questionId:data});
  }
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
              style={{ marginLeft: "1em", fontSize: "1.2em", color: "dimgrey" }}
            >
              Back to dashboard
            </span>
          </Button></Link>
        </div>
        <Container
          fluid
          style={{ width: "auto", background: "#EEEEEE", padding: "0.5em 1.5em" }}
        >
          <Tabs
            className="myClass "
            variant="pill"
            activeKey={this.state.activetab}
            onSelect={this.handleSelect}
          >
            <Tab eventKey={1} title="English">
              <EnglishHQuesTab questionId={this.state.questionId} handleChange={this.handleChange}  handleSelect={this.handleSelect}/>
            </Tab>
            <Tab eventKey={2} title="Hindi">
              <HindiQuesTab questionId={this.state.questionId} handleChange={this.handleChange} 
               handleSelect={this.handleSelect}
              />
            </Tab>
          </Tabs>
        </Container>
      </React.Fragment>
    );
  }
}
export default Ques;
