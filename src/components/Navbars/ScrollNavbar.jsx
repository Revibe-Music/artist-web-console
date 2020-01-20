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
import PropTypes from "prop-types";


class ScrollNavbar extends React.Component {

  componentDidMount() {
    let headroom = new Headroom(document.getElementById("navbar-scroll"));
    // initialise
    headroom.init();
  }

  scrollPage = (e, id) => {
    e.preventDefault();
    if (document.getElementById(id) !== null)
    {
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
            <NavbarBrand>
            <a href="/">
              <img src={require("../../assets/site/img/revibetransparent.png")} style={{width:150, marginTop: -7}} />
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
              {/* Will ADD CODE BELOW WHEN WE KNOW WHAT WE WANT FOR THIS TAB */}
              {/* <NavItem className="active">
              <NavLink
                href="/blog-posts"
              >
                Artist of the Week
              </NavLink>
              </NavItem> */}

              <NavItem className="active">
              <NavLink
                href="/why-revibe"
              >
                Why Revibe?
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
              {this.props.hideLogin ?
                null
              :
              <Link to="/account/register">
                <Button color="primary">Sign Up</Button>
              </Link>
              }

            </Nav>
            </UncontrolledCollapse>
        </Container>
        </Navbar>
      </>
    );
  }
}

ScrollNavbar.defaultProps = {
  hideLogin: false,
};

ScrollNavbar.propTypes = {
  hideLogin: PropTypes.bool,
};

export default ScrollNavbar;
