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

// reactstrap components
import {
  Button,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
  UncontrolledTooltip
} from "reactstrap";

class Footer extends React.Component {
  render() {
    return (
      <>
      <br/>
        <footer className="footer" style={{borderColor:"#7248BD", background:"none"}}>
          <Container>
            <Row>
              <Col md="3">
                <h1 className="title">Revibe</h1>
              </Col>
              <Col md="3" xs="6">
                <Nav>
                  <NavItem>
                    <NavLink to="/" tag={Link}>
                      Home
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink to="/account/register" tag={Link}>
                      Register
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink to="/account/login" tag={Link}>
                      Login
                    </NavLink>
                  </NavItem>
                </Nav>
              </Col>
              <Col md="3" xs="6">
                <Nav>
                  <NavItem>
                    <NavLink to="/contact-us" tag={Link}>
                      Contact Us
                    </NavLink>
                  </NavItem>
                  {/*<NavItem>
                    <NavLink to="/about-us" tag={Link}>
                      About Us
                    </NavLink>
                  </NavItem>*/}
                </Nav>
              </Col>
              <Col md="3">
                <h3 className="title">Follow us:</h3>
                <div className="btn-wrapper profile text-left">
                  <Button
                    className="btn-icon btn-neutral btn-round btn-simple"
                    color="default"
                    href="https://twitter.com/revibemusic8"
                    id="tooltip39661217"
                    target="_blank"
                  >
                    <i className="fab fa-twitter" />
                  </Button>
                  <UncontrolledTooltip delay={0} target="tooltip39661217">
                    Follow us
                  </UncontrolledTooltip>
                  <Button
                    className="btn-icon btn-neutral btn-round btn-simple ml-1"
                    color="default"
                    href="https://www.facebook.com/revibemusic8"
                    id="tooltip206037619"
                    target="_blank"
                  >
                    <i className="fab fa-facebook-square" />
                  </Button>
                  <UncontrolledTooltip delay={0} target="tooltip206037619">
                    Like us
                  </UncontrolledTooltip>
                  <Button
                    className="btn-icon btn-neutral btn-round btn-simple ml-1"
                    color="default"
                    href="https://www.instagram.com/revibemusic8"
                    id="tooltip750293512"
                    target="_blank"
                  >
                    <i className="fab fa-instagram" />
                  </Button>
                  <UncontrolledTooltip delay={0} target="tooltip750293512">
                    Follow us
                  </UncontrolledTooltip>
                </div>
              </Col>
            </Row>
          </Container>
        </footer>
      </>
    );
  }
}

export default Footer;
