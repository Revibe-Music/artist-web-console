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

import Icon from "../Icons/icons";

class Footer extends React.Component {
  render() {
    return (
      <>
        <footer className="footer" style={{ borderColor: "#7248BD", background: "none" }}>
          <Container>
            <Row>
              <Col md="3">
                <NavLink to="/home" tag={Link}>
                  <img src={require("../../assets/site/img/revibetransparent.png")} style={{ width: 175 }} className="mt-4" />
                </NavLink>
              </Col>
              <Col md="6" xs="12">
                <Nav className="pull-center">
                  <ul>
                    <li>
                      <NavLink to="/home" tag={Link}>
                        Home
                      </NavLink>
                    </li>
                    {/*<li>
                      <NavLink to="/about" tag={Link} className="ml-1">
                        About Us
                      </NavLink>
                    </li>*/}
                    <li>
                      <a href="https://revibe.tech" target="_blank" className="ml-1">
                        Revibe Music
                      </a>
                    </li>
                    <li>
                      <a href="https://revibe.tech/blog" target="_blank" className="ml-1">
                        Blog
                      </a>
                    </li>
                    <li>
                    <NavLink to="/contact-us" tag={Link} className="ml-1">
                        Contact Us
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/account/login" tag={Link} className="ml-1">
                        Login
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/account/register" tag={Link} className="ml-1">
                        Sign Up
                      </NavLink>
                    </li>
                  </ul>
                </Nav>
              </Col>
              {/*<Col md="3" xs="6">
                <Nav>
                  <NavItem>
                    <NavLink to="/home" tag={Link}>
                      Home
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink to="/about" tag={Link}>
                      About Us
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <a href="https://artist.revibe.tech">
                      For Artists
                    </a>
                  </NavItem>
                </Nav>
              </Col>
              <Col md="3" xs="6">
                <Nav>
                  <NavItem>
                    <NavLink to="/contact" tag={Link}>
                      Contact Us
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink to="/blogs" tag={Link}>
                      Blog
                    </NavLink>
                  </NavItem>
                  {/* Keep register disabled until auth and stuff is working on front side   <NavItem>
                    <NavLink to="/register" tag={Link}>
                      Register
                    </NavLink>
                  </NavItem>}
                </Nav>
              </Col>*/}
              <Col md="3">
                <h3 className="title mt-3 mb-2">Follow us:</h3>
                <div className="btn-wrapper profile text-left">
                  <Button
                    className="btn-icon btn-neutral btn-round btn-simple"
                    color="default"
                    href="https://twitter.com/revibemusic8"
                    id="tooltip-twitter"
                    target="_blank"
                  >
                    <i className="fab fa-twitter" />
                  </Button>
                  <UncontrolledTooltip delay={0} target="tooltip-twitter">
                    Twitter
                  </UncontrolledTooltip>
                  <Button
                    className="btn-icon btn-neutral btn-round btn-simple ml-1"
                    color="default"
                    href="https://www.facebook.com/revibemusic8"
                    id="tooltip-fb"
                    target="_blank"
                  >
                    <i className="fab fa-facebook-square" />
                  </Button>
                  <UncontrolledTooltip delay={0} target="tooltip-fb">
                    Facebook
                  </UncontrolledTooltip>
                  <Button
                    className="btn-icon btn-neutral btn-round btn-simple ml-1"
                    color="default"
                    href="https://instagram.com/revibemusic8"
                    id="tooltip-insta"
                    target="_blank"
                  >
                    <i className="fab fa-instagram" />
                  </Button>
                  <UncontrolledTooltip delay={0} target="tooltip-insta">
                    Instagram
                  </UncontrolledTooltip>
                  <Button
                    className="btn-icon btn-neutral btn-round btn-simple ml-1"
                    color="default"
                    href="https://vm.tiktok.com/GYQojE/"
                    id="tooltip-tiktok"
                    target="_blank"
                  >
                    <div style={{ width: "100%", height: "100%" }} className="d-flex justify-content-center align-items-center">
                      <Icon icon="tiktok" width="16px" height="16px" color="#ffffff" />
                    </div>
                  </Button>
                  <UncontrolledTooltip delay={0} target="tooltip-tiktok">
                    TikTok
                  </UncontrolledTooltip>
                  <Button
                    className="btn-icon btn-neutral btn-round btn-simple ml-1"
                    color="default"
                    href="https://www.youtube.com/channel/UCGSz0umIQ-xCKB8UsGKDK3A"
                    id="tooltip-yt"
                    target="_blank"
                  >
                    <i className="fab fa-youtube" />
                  </Button>
                  <UncontrolledTooltip delay={0} target="tooltip-yt">
                    YouTube
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
