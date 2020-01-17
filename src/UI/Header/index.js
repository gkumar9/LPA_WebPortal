import React from "react";
import {Navbar} from "react-bootstrap";
import Logo from './../../Assets/Logo.png';
function Header() {
  return (
    <Navbar expand="lg" style={{'borderBottom':'solid 1px #cccbcb'}}>
      <Navbar.Brand href="#home">
        <img
          src={Logo}
          className="d-inline-block align-top img-responsive"
          alt="React Bootstrap logo"
        />
      </Navbar.Brand>
    </Navbar>
  );
}
export default Header;
