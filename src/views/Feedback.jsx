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

import {withRouter} from 'react-router-dom';
import RevibeAPI from 'api/revibe.js';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Select from "react-select";



const MySwal = withReactContent(Swal)
const revibe = new RevibeAPI()

class Feedback extends React.Component {

  constructor(props) {
    super(props)
    this.state =
    {
        first_name: "",
        last_name: "",
        email: "",
        feedback_type: "",
        message: ""
    }
  };

  componentDidMount() {
    document.body.classList.add("contact-page");
  }

  componentWillUnmount() {
    document.body.classList.remove("contact-page");
  }

  async onSubmit() {
    var response = await revibe.contactUs(this.state)
    if(response != undefined) {
      MySwal.fire({
        title: 'Thank you for contacting us!',
        text: 'Someone from our team will get back to you soon :)',
        icon: 'success',
        showCloseButton: true,
        background: "#303030"
      })
    }
    else {
      MySwal.fire({
        title: 'Form not submitted',
        text: 'Please make sure all of the fields in the form are filled out',
        icon: 'error',
        showCloseButton: true,
        background: "#303030"
      })
    }
  }

  onChange(key, value) {
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
      <div className="content">
        <div className="wrapper" ref="wrapper">
          <div className="page-header header-filter contactus-3">
            <div className="main" style={{paddingTop: "100px"}}>
            <Container>
                <Row>
                  <Col className="text-center" md="12">
                    <h1 className="title">We Appreciate Your Feedback</h1>
                    <h3>Enter for a chance to win a high five by a Reviber</h3>
                  </Col>
                </Row>
                <Row>
                  <Col lg ="2"/>
                  <Col lg="3">
                  <div className="info info-hover">
                  <div className="icon icon-primary">
                        <i className="tim-icons icon-square-pin" style={{paddingLeft: "20px"}}/>
                      </div>
                      <h3 className="info-title" style={{color: "#7248bd"}}>Address</h3>
                      <p className="description" style={{color: "#7248bd"}}>8000 Innovation Park Dr.</p>
                      <p className="description" style={{color: "#7248bd"}}>Baton Rouge, LA 70820</p>
                    </div>
                  </Col>
                  <Col lg="3" className="center-align">
                  <div className="info info-hover">
                      <div className="icon icon-info">
                        <i className="tim-icons icon-email-85" style={{paddingLeft: "20px"}}/>
                      </div>
                      <h3 className="info-title" style={{color: "#7248bd"}}>Email</h3>
                      <p className="description" style={{color: "#7248bd"}}>support@revibe.tech</p>
                    </div>
                  </Col>
                  <Col lg="3">
                  <div className="info info-hover">
                      <div className="icon icon-success">
                        <i className="tim-icons icon-single-02" style={{paddingLeft: "20px"}}/>
                      </div>
                      <h3 className="info-title" style={{color: "#7248bd"}}>Contact</h3>
                      <p className="description" style={{color: "#7248bd"}}>Kayne Lynn</p>
                    </div>
                  </Col>
                </Row>
                <div className="content" style={{paddingTop: "50px"}}>
                <Row>
                  <Col className="m-auto" md="10">
                    <Form
                      className="form"
                      id="contact-form"
                      method="post">
                      <CardBody>
                        <Row>
                          <Col md="6">
                            <label>First name</label>
                            <InputGroup>
                              <Input
                                type="text"
                                onChange={event => this.onChange( "first_name", event.target.value)}/>
                            </InputGroup>
                          </Col>
                          <Col md="6">
                              <label>Last name</label>
                              <InputGroup>
                                <Input
                                  type="text"
                                  onChange={event => this.onChange( "last_name", event.target.value)}/>
                              </InputGroup>
                          </Col>
                        </Row>
                          <label>Email address</label>
                          <InputGroup>
                            <Input
                              type="text"
                              onChange={event => this.onChange( "email", event.target.value)}/>
                          </InputGroup>
                          <label>Feedback Type</label>
                          <InputGroup>
                          <Col className="m-auto mr-auto" md="12">
                            <Select
                              className="react-select primary"
                              classNamePrefix="react-select"
                              placeholder="Feedback Type"
                              name="multipleSelect"
                              closeMenuOnSelect={true}
                              isMulti={false}
                              onChange={option => this.setState({feedback_type: option.label})}
                              options={[
                                {
                                  value: "",
                                  isDisabled: true
                                },
                                { value: "2", label: "Bug or Issue" },
                                { value: "3", label: "Feature Request" },
                                { value: "4", label: "General Feedback" },
                              ]}
                            />
                          </Col>
                          </InputGroup>
                          <label>Your message</label>
                          <Input
                            placeholder=" If possible, please include steps to reproduce the bug/issue."
                            id="message"
                            name="message"
                            rows="20"
                            type="textarea"
                            onChange={event => this.onChange( "message", event.target.value)}
                          />
                        <Row style={{marginTop: "30px"}}>
                          <Col className="ml-auto" md="3">
                            <SubmitButton/>
                          </Col>
                        </Row>
                      </CardBody>
                    </Form>
                  </Col>
                </Row>
                </div>
              </Container>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Feedback;
