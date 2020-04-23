import React, { Component } from "react";
import Navigation from "./Navigation";
import firebase from "./firebaseApp";
import axios from "axios";

import "./index.css";
class App extends Component {
  state = {
    authenticated: undefined,
  };
  componentDidMount() {
    firebase.auth().onAuthStateChanged((authenticated) => {
      if (authenticated) {
        axios.interceptors.request.use(
          async (config) => {
            let token = await firebase.auth().currentUser.getIdToken();

            if (config.data && config.data.authToken) {
              config.data.authToken = token;
            }
            return Promise.resolve(config);
          },
          function (error) {
            // Do something with request error
            return Promise.reject(error);
          }
        );
        this.setState({
          authenticated: true,
        });
      } else {
        this.setState({
          authenticated: false,
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
