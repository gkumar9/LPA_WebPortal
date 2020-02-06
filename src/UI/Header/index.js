import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import Logo from "./../../Assets/Logo.png";
// import firebase from 'firebase';
import firebase from "./../../firebaseApp";
import { Link } from "react-router-dom";

function Header({ props }) {
  // console.log(firebase.auth())
  
  return (
    <Navbar expand="lg" style={{ borderBottom: "solid 1px #cccbcb" }}>
      <Navbar.Brand  >
        <Link to="/" target="_self">
          <img
            src={Logo}
            className="d-inline-block align-top img-responsive"
            alt="React Bootstrap logo"
          />
        </Link>
      </Navbar.Brand>
      <Navbar.Brand style={{fontSize:'1em'}}>
        <Link
          to="/"
          target="_self"
          style={
            props.location.pathname === "/"
              ? { textDecoration: "none", color: "black" }
              : { color: "grey", textDecoration: "none" }
          }
        >
          Home
        </Link>
      </Navbar.Brand>
      <Nav className="mr-auto"></Nav>
      <Nav justify>
        {/* <Link to="/" target="_self"> */}{" "}
        <Nav.Link href="#">Welcome User</Nav.Link>
        <Nav.Link
          eventKey={2}
          onSelect={() => {
            firebase
              .auth()
              .signOut()
              .then(res => {
                console.log("signout called");
              });
          }}
        >
          Log out
        </Nav.Link>
      </Nav>
    </Navbar>
  );
}
export default Header;
