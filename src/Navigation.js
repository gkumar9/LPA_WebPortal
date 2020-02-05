import Login from "./UI/Login/index.js";
import Ques from "./UI/Ques/index.js";
import Dashboard from "./UI/Dashboard/index.js";
import Exam from "./UI/Exam/index.js";
import Editques from "./UI/Editques/index.js";
import React, { Component } from "react";
import PreviewQues from "./UI/QuesPreview/index.js";
import EditExam from "./UI/Editexam/index.js";
import { createBrowserHistory } from "history";
import {
  Route,
  Redirect,
  HashRouter as Router,
  // Switch
} from "react-router-dom";
export const history = createBrowserHistory({
  basename: process.env.PUBLIC_URL
});

const ProtectedRoute = ({ component: Component, authenticated, path }) => {
  // console.log(path,authenticated)
  return (
    <Route
      exact
      render={props =>
        authenticated ? <Component {...props} /> : <Redirect to="/login" />
      }
      path={path}
    />
  );
};
class Navigation extends Component {
  render() {
    return (
      <Router basename={'/'}>
        {/* <Switch> */}
        <Route
          exact
          authenticated={this.props.authenticated}
          path="/login"
          component={Login}
        />
        <ProtectedRoute
          authenticated={this.props.authenticated}
          path="/"
          component={Dashboard}
        />

        <ProtectedRoute
          authenticated={this.props.authenticated}
          path="/addques"
          component={Ques}
        />
        <ProtectedRoute
          authenticated={this.props.authenticated}
          path="/addexam"
          component={Exam}
        />
        <ProtectedRoute
          authenticated={this.props.authenticated}
          path="/editques/:lang/:id"
          component={Editques}
        />
        <ProtectedRoute
          authenticated={this.props.authenticated}
          path="/quespreview"
          component={PreviewQues}
        />
        <ProtectedRoute
          authenticated={this.props.authenticated}
          path="/editexam/:id"
          component={EditExam}
        />
        {/* </Switch> */}
      </Router>
    );
  }
}
export default Navigation;
