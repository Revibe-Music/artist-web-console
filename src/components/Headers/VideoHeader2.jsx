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
            <div className="overlay"/>
            <video
              autoPlay="autoplay"
              loop="loop"
              muted="muted"
              playsInline="playsinline"
            >
              <source
                src={require("../../assets/site/img/vid_background_2.mp4")}
                type="video/mp4"
              />
            </video>
            <Container style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
              <Row>
              <Col lg="4" style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
              <div className="video-text">
                <h2 className="title">
                  Revibe guides you from your first song to your first check.
                  Use our software to manage your hosting, distribution, collaboration,
                  merchandise marketing, and more for one low price.
                  </h2>
                  <h3>
                    Don't have the funds? Use our free plan for 20% profit share and switch
                    to our premium plan whenever you like.
                  </h3>
              </div>
              </Col>
              <Col lg="8">
                <div className="card-image">
                        <img
                          alt="..."
                          className="img rounded"
                          src={require("assets/site/img/laptop-image-2.png")}
                        />
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
