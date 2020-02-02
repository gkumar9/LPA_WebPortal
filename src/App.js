import React, { Component } from "react";
import Navigation from "./Navigation";
import firebase from "./firebaseApp";
import "./index.css";
class App extends Component {
  state = {
    authenticated: undefined
  };
  componentDidMount() {
    firebase.auth().onAuthStateChanged(authenticated => {
      if (authenticated) {
        // console.log("authenticated", authenticated);
        this.setState({
          authenticated: true
        });
      } else {
        // console.log("authenticated", authenticated);
        this.setState({
          authenticated: false
        });
      }
    });
  }
  render() {
    // console.log(this.state.authenticated);
    // return  <Navigation authenticated={this.state.authenticated} />
    return this.state.authenticated !== undefined &&
      this.state.authenticated !== null ? (
      <Navigation authenticated={this.state.authenticated} />
    ) : (
      <div className="loader"></div>
    );
  }
}
export default App;
