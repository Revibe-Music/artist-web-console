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
import classnames from "classnames";

// reactstrap components
import {
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
  Col,
  Navbar
} from "reactstrap";

// core components
import Footer from "components/Footers/Footer.jsx";
import ScrollNavbar from "components/Navbars/ScrollNavbar.jsx"

import {withRouter} from 'react-router-dom';
import RevibeAPI from 'api/revibe.js';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import MetaHelmet from "components/MetaHelmet/MetaHelmet";


const MySwal = withReactContent(Swal)
const revibe = new RevibeAPI()

class ContactUs extends React.Component {

  constructor(props)
  {
    super(props)
    this.state =
    {
        first_name: "",
        last_name: "",
        email: "",
        subject: "",
        message: ""
    }
  };

  componentDidMount()
  {
    document.body.classList.add("contact-page");
  }
  componentWillUnmount()
  {
    document.body.classList.remove("contact-page");
  }

  async onSubmit()
  {
    if(this.state.first_name === ""
      || this.state.last_name === ""
      || !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email))
      || this.state.subject === ""
      || this.state.message === "") {
        MySwal.fire({
          title: 'Fields Not Filled Out!',
          text: 'Please make sure all of the fields in the form are filled out!',
          icon: 'error',
          showCloseButton: true,
          background: "#303030"
        })

        return
    }

    var response = await revibe.contactUs(this.state)

    if(response != undefined)
    {
      MySwal.fire({
        title: 'Thank You for Contacting Us!',
        text: 'Someone from our team will get back to you soon!',
        icon: 'success',
        showCloseButton: true,
        background: "#303030"
      })
    }
    else
    {
      MySwal.fire({
        title: 'Form Not Submitted',
        text: 'Please make sure all of the fields in the form are filled out!',
        icon: 'error',
        showCloseButton: true,
        background: "#303030"
      })
    }
  }

  onChange(key, value)
  {
    var newState = {...this.state}
    newState[key] = value
    this.setState(newState)
  }

  render() {

    const SubmitButton = withRouter(({ history }) => (
      <Button
        block
        className="mb-3"
        color="primary"
        onClick={() => this.onSubmit(history)}
        size="lg">
        Send Message
      </Button>
    ));

    return (
      <> 
        <MetaHelmet title="Contact Us - Revibe Artists" />
          <ScrollNavbar/>
          <div className="content">
          <div className="contactus-3">
          <Container>
              <Row className="align-items-center">
                <Col className="text-center" md="12">
                  <h1 className="title">Questions?</h1>
                  <h3>We'd like to talk more about what you need</h3>
                </Col>
              </Row>
              <Row>
                <Col lg ="2" style={{borderRight: 0}}/>
                <Col lg="3">
                <div className="info info-hover">
                <div className="icon icon-primary">
                      <i className="tim-icons icon-square-pin" />
                    </div>
                    <h3 className="info-title" style={{color: "#7248bd"}}>Address</h3>
                    <p className="description" style={{color: "#7248bd"}}>8000 Innovation Park Dr.</p>
                    <p className="description" style={{color: "#7248bd"}}>Baton Rouge, LA 70820</p>
                  </div>
                </Col>
                <Col lg="3" className="center-align">
                <div className="info info-hover">
                    <div className="icon icon-info">
                      <i className="tim-icons icon-email-85" />
                    </div>
                    <h3 className="info-title" style={{color: "#7248bd"}}>Email</h3>
                    <p className="description" style={{color: "#7248bd"}}>support@revibe.tech</p>
                  </div>
                </Col>
                <Col lg="3">
                <div className="info info-hover">
                    <div className="icon icon-success">
                      <i className="tim-icons icon-single-02" />
                    </div>
                    <h3 className="info-title" style={{color: "#7248bd"}}>Contact</h3>
                    <p className="description" style={{color: "#7248bd"}}>Kayne Lynn</p>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col className="m-auto" md="10">
                <div className="content" style={{paddingTop: "50px"}}>
                  <Form
                    className="form"
                    id="contact-form"
                    method="post">
                    <CardBody>
                      <Row>
                        <Col md="6">
                          <label>*First Name</label>
                          <InputGroup>
                            <Input
                              type="text"
                              onChange={event => this.onChange( "first_name", event.target.value)}/>
                          </InputGroup>
                        </Col>
                        <Col md="6">
                            <label>*Last Name</label>
                            <InputGroup>
                              <Input
                                type="text"
                                onChange={event => this.onChange( "last_name", event.target.value)}/>
                            </InputGroup>
                        </Col>
                      </Row>
                        <label>*Email Address</label>
                        <InputGroup>
                          <Input
                            type="text"
                            onChange={event => this.onChange( "email", event.target.value)}/>
                        </InputGroup>
                        <label>*Subject</label>
                        <InputGroup>
                          <Input
                            type="text"
                            onChange={event => this.onChange( "subject", event.target.value)}
                          />
                        </InputGroup>
                        <label>*Your Message</label>
                        <Input
                          id="message"
                          name="message"
                          rows="20"
                          type="textarea"
                          className="pl-3 pr-3 pb-2"
                          onChange={event => this.onChange( "message", event.target.value)}
                        />
                      <Row>
                        <Col className="ml-auto" md="3">
                          <SubmitButton/>
                        </Col>
                      </Row>
                    </CardBody>
                  </Form>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
          <Footer />
          </div>
      </>
    );
  }
}

export default ContactUs;
