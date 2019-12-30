/*!

=========================================================
* BLK Design System PRO React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/blk-design-system-pro-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import { Link } from "react-router-dom";
// JavaScript plugin that hides or shows a component based on your scroll
import Headroom from "headroom.js";
// reactstrap components
import {
  Button,
  UncontrolledCollapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
  UncontrolledTooltip
} from "reactstrap";

class ScrollNavbar extends React.Component {
  componentDidMount() {
    let headroom = new Headroom(document.getElementById("navbar-scroll"));
    // initialise
    headroom.init();
  }
  scrollPage = (e, id) => {
    e.preventDefault();
    if (document.getElementById(id) !== null) {
      document.getElementById(id).scrollIntoView();
    }
  };
  render() {
    return (
      <>
        <Navbar className="fixed-top bg-transparent" expand="lg" id="navbar-scroll">
        <Container>
          <div className="navbar-translate">
            <button className="navbar-toggler" id="example-header-4">
              <span className="navbar-toggler-bar bar1" />
              <span className="navbar-toggler-bar bar2" />
              <span className="navbar-toggler-bar bar3" />
            </button>
            <NavbarBrand
            >
            <a href="/home">
              <img src={require("../../assets/img/revibetransparent.png")} style={{width:150, marginTop: -7}} />
            </a>
            </NavbarBrand>
          </div>
          <UncontrolledCollapse navbar toggler="#example-header-4">
            <div className="navbar-collapse-header">
              <Row>
                <Col className="collapse-brand" xs="6">
                </Col>
                <Col className="collapse-close text-right" xs="6">
                  <button
                    className="navbar-toggler"
                    id="example-header-4"
                  >
                    <i className="tim-icons icon-simple-remove" />
                  </button>
                </Col>
              </Row>
            </div>
            <Nav className="ml-auto" navbar>
              <NavItem className="active">
              <NavLink
                href="/blog-posts"
              >
                Artist of the Week
              </NavLink>
              </NavItem>
              <NavItem>
              <NavLink
                href="/about-us"
              >
                About Us
              </NavLink>
              </NavItem>

              <NavItem>
                <NavLink
                  href="/contact-us"
                >
                  Contact
                </NavLink>
              </NavItem>
              <Link to="/register">
                <Button color="primary">Sign Up</Button>
              </Link>

            </Nav>
            </UncontrolledCollapse>
        </Container>
        </Navbar>
      </>
    );
  }
}

export default ScrollNavbar;
