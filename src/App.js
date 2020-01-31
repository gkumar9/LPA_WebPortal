// import React from "react";
// import Header from "./UI/Header/index.js";
import Login from "./UI/Login/index.js";
import Ques from "./UI/Ques/index.js";
import Dashboard from "./UI/Dashboard/index.js";
import Exam from './UI/Exam/index.js';
import Editques from './UI/Editques/index.js';
import React from "react";
import { HashRouter, Route } from "react-router-dom";
import PreviewQues from './UI/QuesPreview/index.js'
// import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router-3';
import { createBrowserHistory } from "history";
export const history = createBrowserHistory({
  basename: process.env.PUBLIC_URL
});

function App() {
  return (
    <HashRouter basename={"/"}>
      <Route
        exact
        path="/"
        render={props => {
          // console.log(props);
          return <Dashboard {...props} />;
        }}
      />
      <Route
        path="/login"
        render={props => {
          return <Login {...props} />;
        }}
      />
      <Route
        path="/addques"
        render={props => {
          return <Ques {...props} />;
        }}
      />
      <Route
        path="/addexam"
        render={props => {
          return <Exam {...props} />;
        }}
      />
      <Route 
      path="/editques/:id"
      render={props=>{
        return <Editques {...props} />;
      }}
      />
      <Route 
      path="/quespreview"
      render={props=>{
        return <PreviewQues {...props} />;
      }}
      />
    </HashRouter>
  );
}
export default App;
