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
        firebase
          .auth()
          .currentUser.getIdToken()
          .then((idToken) => {
            // console.log(idToken)
            // localStorage.setItem("idToken", idToken);
            axios.interceptors.request.use(
              (config) => {
                if (config.data && config.data.authToken) {
                  config.data.authToken = idToken;
                }
                return Promise.resolve(config);
              },
              function (error) {
                // Do something with request error
                return Promise.reject(error);
              }
            );
            axios.interceptors.response.use(
              function (response) {
                // Any status code that lie within the range of 2xx cause this function to trigger
                // Do something with response data
                if (
                  response.data.error &&
                  response.data.error.errorCode === 10
                ) {
                  alert(
                    "Problem:Login Token expired.\nToken refreshed. Please try last action again"
                  );
                  firebase.auth().currentUser.getIdToken(true);
                }
                return Promise.resolve(response);
              },
              function (error) {
                // Any status codes that falls outside the range of 2xx cause this function to trigger
                // Do something with response error
                return Promise.reject(error);
              }
            );

            this.setState({
              authenticated: true,
            });
          })
          .catch((e) => {
            alert(e);
          });
      } else {
        // console.log("authenticated", authenticated);
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
