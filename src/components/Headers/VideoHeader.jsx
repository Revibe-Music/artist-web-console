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
  UncontrolledCollapse,
  Label,
  FormGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col
} from "reactstrap";

class VideoHeader extends React.Component {


  render() {
    return (
      <>
      <div className="header header-4">
        <div className="header-wrapper">

          <div className="page-header header-video header-filter">
            <div className="overlay" />
            <video
              autoPlay="autoplay"
              loop="loop"
              muted="muted"
              playsInline="playsinline"
              style={{height: "80%"}}
            >
              <source
                src={require("../../assets/site/img/video.mp4")}
                type="video/mp4"
              />
            </video>
            <Container className="text-right" style={{marginTop:400}}>
              <Row>
                <Col lg="8">
                <div className="card-image">
                      <a to="/account/register" onClick={e => e.preventDefault()}>
                        <img
                          alt="..."
                          className="img rounded"
                          src={require("assets/site/img/laptop-image.png")}
                        />
                      </a>
                    </div>
                </Col>
              <Col lg="4" className="auto-md">
              <div className="video-text">
                <br /><br/><br/><br/>
                <h1 className="title">Run your entire music career in one place</h1>
                <br />
                <Link to="/account/register">
                <Button
                  className="btn-round btn-primary"
                  size="lg"
                >
                  Sign Up
                </Button>
                </Link>
              </div>
              </Col>
              </Row>
            </Container>
          </div>
        </div>
      </div>
      </>
    );
  }
}

export default VideoHeader;
