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
  Badge,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  FormGroup,
  Input,
  Container,
  Row,
  Col,
  Carousel,
  CarouselItem
} from "reactstrap";

// core components
import ScrollNavbar from "components/Navbars/ScrollNavbar.jsx";
import Footer from "components/Footers/Footer.jsx";

class WhyRevibe extends React.Component {

  state = {
    activeIndex: 0
  };
  onExiting = () => {
    this.animating = true;
  };

  onExited = () => {
    this.animating = false;
  };

  goToIndex = newIndex => {
    if (this.animating) return;
    this.setState({ activeIndex: newIndex });
  };

  render() {
    return (
      <>
        <ScrollNavbar />
        <div className="wrapper" ref="wrapper">
        <div className="page-header page-header-small header-filter">
            <div
              className="page-header-image"
              style={{
                backgroundImage:
                  "url(" + require("assets/site/img/record.jpg") + ")"
              }}
            />
            <Container>
              <Row>
                <Col className="text-center" md="12">
                  <h1 className="title">What makes Revibe different?</h1>
                </Col>
              </Row>
            </Container>
          </div>
          <div className="main">
            <Container fluid>
              <Row className="infos mb-5">
                <Col className="md-auto" lg="12" >
                  <Row>
                    <Col lg="12" md="6">
                      <Row>
                      <div className="info">
                        <h3 className="info-title">
                        <i className="tim-icons icon-headphones text-primary" /> Host</h3>
                        <p className="description">
                          Upload your music for all to hear! Revibe makes it
                          easier than ever for fans to listen to music from the
                          underground by putting it next to their
                          premium Spotify subscription and entire YouTube catalagues
                        </p>
                      </div>
                      <div className="info">
                        <h3 className="info-title"><i className="tim-icons icon-delivery-fast text-primary" /> Distribute</h3>
                        <p className="description">
                        Distribute your music to over 50 DSPs while 
                        keeping 100% of your royalties. You can also split royalties, schedule releases, and more!
                        </p>
                      </div>
                      
                    <div className="info">
                      <h3 className="info-title"><i className="tim-icons icon-chat-33 text-primary" /> Collaborate</h3>
                      <p className="description">
                      Buy and sell beats, audio engineering, graphic design, 
                        videography, songwriting, features, and more on our 
                        flexible marketplace
                      </p>
                    </div>
                      <div className="info">
                        <h3 className="info-title"><i className="tim-icons icon-bag-16 text-primary" /> Merchandise</h3>
                        <p className="description">
                          Upload a file, pick a style, and start selling.
                          No upfront investment, no manual fulfillment, and no website needed
                        </p>
                      </div>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Container>
            </div>
          </div>
          <Footer />
      </>
    );
  }
}

export default WhyRevibe;
