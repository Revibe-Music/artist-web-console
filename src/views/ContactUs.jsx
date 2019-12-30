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
// nodejs library that concatenates classes
import classnames from "classnames";

// reactstrap components
import {
  Badge,
  Button,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col
} from "reactstrap";

// core components
import Footer from "components/Footer/Footer.jsx";



class ContactUs extends React.Component {

  state = {};

  componentDidMount() 
  {
    document.body.classList.add("contact-page");
  }
  componentWillUnmount() 
  {
    document.body.classList.remove("contact-page");
  }

  render() {
    return (
      <>
          <div className="wrapper" ref="wrapper">
          <div className="page-header header-filter contactus-3">
          <div className="main" style={{paddingTop: "100px"}}>
          <Container fluid>
              <Row>
                <Col className="text-center" md="12">
                  <h1 className="title">Questions?</h1>
                  <h3>We'd like to talk more about what you need</h3>
                </Col>
              </Row>
              <Row className="infos mb-5">
                <Col lg="3">
                <div className="info info-hover">
                <div className="icon icon-primary">
                      {/* <img
                        alt="..."
                        className="bg-blob"
                        src={require("assets/img/feature-blob/primary.png")}
                      /> */}
                      <i className="tim-icons icon-square-pin" style={{paddingLeft: "20px"}}/>
                    </div>
                    <h3 className="info-title" style={{color: "#7248bd"}}>Address</h3>
                    <p className="description" style={{color: "#7248bd"}}>8000 Innovation Park Dr.</p>
                    <p className="description" style={{color: "#7248bd"}}>Baton Rouge, LA 70820</p>
                  </div>
                </Col>
                <Col lg="3" >
                <div className="info info-hover">
                    <div className="icon icon-info">
                      {/* <img
                        alt="..."
                        className="bg-blob"
                        src={require("assets/img/feature-blob/info.png")}
                      /> */}
                      <i className="tim-icons icon-email-85" style={{paddingLeft: "20px"}}/>
                    </div>
                    <h3 className="info-title" style={{color: "#7248bd"}}>Email</h3>
                    <p className="description" style={{color: "#7248bd"}}>support@revibe.tech</p>
                  </div>
                </Col>
                <Col lg="3">
                <div className="info info-hover">
                    <div className="icon icon-warning">
                      {/* <img
                        alt="..."
                        className="bg-blob"
                        src={require("assets/img/feature-blob/warning.png")}
                      /> */}
                      <i className="tim-icons icon-mobile" style={{paddingLeft: "20px"}}/>
                    </div>
                    <h3 className="info-title" style={{color: "#7248bd"}}>Phone Number</h3>
                    <p className="description" style={{color: "#7248bd"}}>+1 (318) 550-8799</p>
                  </div>
                </Col>
                <Col lg="3">
                <div className="info info-hover">
                    <div className="icon icon-success">
                      {/* <img
                        alt="..."
                        className="bg-blob"
                        src={require("assets/img/feature-blob/success.png")}
                      /> */}
                      <i className="tim-icons icon-single-02" style={{paddingLeft: "20px"}}/>
                    </div>
                    <h3 className="info-title" style={{color: "#7248bd"}}>Contact</h3>
                    <p className="description" style={{color: "#7248bd"}}>Kayne Lynn</p>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
          </div>
          </div>
          <Footer />
      </>
    );
  }
}

export default ContactUs;
