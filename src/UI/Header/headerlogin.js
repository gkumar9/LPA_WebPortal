import React from "react";
import { Navbar, Nav } from "react-bootstrap";
// import Logo from "./../../Assets/Logo.png";
// import firebase from 'firebase';
// import firebase from "./../../firebaseApp";

function HeaderLogin() {
  // console.log(firebase.auth())
  return (
    <Navbar expand="lg" style={{ borderBottom: "solid 1px #cccbcb" }}>
      <Navbar.Brand href="/">
      <h4 style={{margin:'0.3em 0.6em',color:'black'}}>Manuprakashan</h4>
      </Navbar.Brand>
      <Nav className="mr-auto"></Nav>
      <Nav justify>
       
      </Nav>
    </Navbar>
  );
}
export default HeaderLogin;
