import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import Logo from "./../../Assets/Logo.png";
// import firebase from 'firebase';
import firebase from "./../../firebaseApp";

function Header() {
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
