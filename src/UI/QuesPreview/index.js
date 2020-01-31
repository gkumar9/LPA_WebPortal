import React, { Component } from "react";
import Error404 from "./404.js";
class PreviewQues extends Component {
  constructor(props) {
    super(props);
    this.state = { isData: false };
  }
  componentDidMount() {
    console.log(this.props.location.state);
    if (this.props.location.state !== undefined) {
      this.setState({ isData: true });
      var path = document.getElementById("tail");
      path.setAttribute(
        "d",
        "M89,315c2.2-15.2-23-13.2-21.6,4.8c1.7,22.3,24.4,22.1,42.5,9.1c10.8-7.8,15.3-1.8,19.1,1.1 c2.3,1.7,6.7,3.3,11-3"
      );
      //var segments = path.pathSegList;
      //segments.getItem(2).y = -10;
    }
  }
  render() {
    return <div>{this.state.isData ? "asdasda" : <Error404 />}</div>;
  }
}
export default PreviewQues;
