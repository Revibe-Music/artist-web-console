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
import Footer from "components/Footer/Footer.jsx";
import { FaRegQuestionCircle } from "react-icons/fa";

class ErrorPage extends React.Component {

  state = 
  {
    error_code: "400"
  };

  render() {
    return (
      <>
        <div className="wrapper" ref="wrapper" style={{paddingTop: "100px"}}> 
          <div className="page-header">
            <Container>
              <Row className="align-items-center">
                <Col lg="6">
                  <div className="featured-image">
                    <img
                      alt="..."
                      height="600"
                      src={require("assets/img/microphone.jpg")}
                    />
                  </div>
                </Col>
                <Col className="mt-md-5" lg="6">
                  <a href="https://revibe.tech">
                  <img style={{paddingLeft: "155px"}} src={require("assets/img/revibetransparent.png")}/>
                  </a>
                  <h1>Dude, where's my page? {this.state.error_code} Error</h1>
                  <Row>
                    <Col className="mt-md-5" lg="12">
                      <div className="info text-center text-primary">
                        <h4> Apologies</h4>
                        <p className="description">
                          It looks like there was an error loading this page...
                        </p>
                      </div>
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

export default ErrorPage;
