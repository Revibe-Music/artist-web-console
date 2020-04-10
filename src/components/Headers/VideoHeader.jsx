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
    const isMobile = window.innerWidth < 576

    return (
      <>
      <div className="header header-4">
        <div className="page-header header-video header-filter">
          <video fluid
            autoPlay="autoplay"
            loop="loop"
            muted="muted"
            playsInline="playsinline"
            style={!isMobile ? { width: "100%", height: "auto" } : {}}
          >
            <source
              src={require("../../assets/site/img/video.mp4")}
              type="video/mp4"
            />
          </video>
          <Container style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
            <Row>
              <Col lg="9">
                <div className="card-image" >
                      <a to="/account/register" onClick={e => e.preventDefault()}>
                        <img
                          alt="..."
                          className="img rounded"
                          src={require("assets/site/img/laptop-image-4.png")}
                        />
                      </a>
                    </div>
                </Col>
              <Col lg="3" className="d-flex align-items-center justify-content-center">
                <div className="video-text text-center">
                  <h1 className="title" style={{ textTransform: "none", fontFamily: "FuturaHeavy", fontSize: "2.15rem" }}>More streams.<br/>More Fans.<br/>More Money.</h1>
                  <br />
                  <div style={{ width: "100%" }} className="d-flex justify-content-center">
                    <Link to="/account/register" className="ml-auto mr-auto">
                      <Button
                        className="btn-round btn-primary"
                        size="lg"
                      >
                        Sign Up Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
      </>
    );
  }
}

export default VideoHeader;
