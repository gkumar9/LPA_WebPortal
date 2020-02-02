import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import Logo from "./../../Assets/Logo.png";
// import firebase from 'firebase';
import firebase from "./../../firebaseApp";

function HeaderLogin() {
  // console.log(firebase.auth())
  return (
    <Navbar expand="lg" style={{ borderBottom: "solid 1px #cccbcb" }}>
      <Navbar.Brand href="/">
        <img
          src={Logo}
          className="d-inline-block align-top img-responsive"
          alt="React Bootstrap logo"
        />
      </Navbar.Brand>
      <Nav className="mr-auto"></Nav>
      <Nav justify>
       
      </Nav>
    </Navbar>
  );
}
export default HeaderLogin;
