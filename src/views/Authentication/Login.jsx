/*!

=========================================================
* Black Dashboard PRO React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-pro-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, {Component} from "react";
import classnames from "classnames";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Form,
  FormGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Col,
  Row
} from "reactstrap";
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ClipLoader from "react-spinners/ClipLoader";

import ScrollNavbar from "components/Navbars/ScrollNavbar.jsx";
import { login } from 'redux/authentication/actions.js'

class Login extends Component {

  constructor(props) {
    super(props)
    this.state = {
      // fields
      username: "",
      password: "",

      // state of fields (success or error)
      usernameState: "",
      passwordState: "",

      // field errors
      usernameError: "",
      passwordError: "",

      //Input focus fields
      usernameFocus: false,
      passwordFocus: false,

      SubmitButtonClicked: false

    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    document.body.classList.toggle("login-page");
  }

  componentWillUnmount() {
    document.body.classList.toggle("login-page");
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.props.loginErrors.username !== prevProps.loginErrors.username) {
      if(this.props.loginErrors.username) {
        this.setState({
          usernameError: this.props.loginErrors.username,
          usernameState: "has-danger"
        })
      }
    }
    if(this.props.loginErrors.password !== prevProps.loginErrors.password) {
      if(this.props.loginErrors.password) {
        this.setState({
          passwordError: this.props.loginErrors.password,
          passwordState: "has-danger"
        })
      }
    }
  }

  async onSubmit(history) {
    var validFields = true
    if (this.state.username === "") {
      validFields = false
      this.setState({
        usernameState: "has-danger",
        usernameError: "Username is a required field."
       });
    }
    if (this.state.password === "") {
      validFields = false
      this.setState({
        passwordState: "has-danger",
        passwordError: "Password is a required field."
       });
    }
    if(validFields) {
      if(this.state.usernameError==="" && this.state.passwordError==="") {
        this.setState({SubmitButtonClicked: true})
        this.props.login(this.state.username, this.state.password, history);
      }
    }
  }

  setFocus(key, value) {
    this.setState({
      [key + "Focus"]: value
    })
  }

  onChange(key, value)
  {
    this.setState({
      [key]: value,
      [key + "State"]: "has-success",
      [key + "Error"]: "",
     });
  }

  render() {

    const SubmitButton = withRouter(({ history }) => (
      <Button
        className="btn-round btn-primary w-100"
        onClick={() => this.onSubmit(history)}
        size="md"
        type="submit"
      >
        <h4 className="mt-auto mb-auto">Sign In</h4>
      </Button>
    ));

    const isMobile = window.innerWidth < 576;

    return (
      <>
      <ScrollNavbar hideLogin/>
      <div className="content">
        {/*
        <Container className="mt-lg">
          <Row>
            <Col className="ml-auto mr-auto" md="7">
              <Form className="form">
                <Card className="card-login card-gray">
                  <CardHeader className="pb-1">
                    <CardTitle style={{color: "#7248bd", display: "flex", alignItems: "center", justifyContent: "center", textTransform: "none"}} tag="h3">Login</CardTitle>
                  </CardHeader>
                  <div style={{textAlign:"center"}}>
                    {Object.keys(this.props.loginErrors).filter(x => x === "non_field_errors").length > 0 ? (
                      <label style={{color:"red"}}>
                        {this.props.loginErrors.non_field_errors}
                      </label>
                    ) : null}
                  </div>
                  <CardBody>
                  <div>
                  <FormGroup className={`has-label ${this.state.usernameState}`}>
                    <label>Username *</label>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      onChange={e => this.onChange( "username", e.target.value)}
                    />
                    {this.state.usernameState === "has-danger" ? (
                      <label className="error">
                        {this.state.usernameError}
                      </label>
                    ) : null}
                  </FormGroup>
                  </div>
                  <div>
                  <FormGroup className={`has-label ${this.state.passwordState}`}>
                    <label>Password *</label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="off"
                      onChange={e => this.onChange( "password", e.target.value)}
                    />
                    {this.state.passwordState === "has-danger" ? (
                      <label className="error">{this.state.passwordError}</label>
                    ) : null}
                  </FormGroup>
                  </div>
                  </CardBody>
                  <CardFooter>

                  <SubmitButton />
                    <div className="pull-right">
                      <h6>
                        <Link to="/account/register">Create Account</Link>
                      </h6>
                    </div>
                  </CardFooter>
                </Card>
              </Form>
            </Col>
          </Row>
        </Container>
        */}
        <Container className="mt-lg">
          <Row>
            <Col md="8" className="ml-auto mr-auto">
              <Form className="form">
                <Card className="card-login card-gray">
                  <CardBody>
                    <Container>
                      <Row>
                        {!isMobile ? <Col md="6">

                        </Col> : null}
                        <Col md="6">
                          {!isMobile ?
                            <h4 className="text-white w-50 text-right ml-auto mr-0"><Link to="/account/register">Skip</Link></h4>
                          :
                            <h1 className="w-100 text-white text-center">Welcome back!</h1>
                          }
                          <div className="w-100 mt-md mb-sm">
                            <h2 className="mt-0 mb-0 w-50">Sign In</h2>
                            {this.state.SubmitButtonClicked ?
                              <div className="d-inline-block" style={{ float: "right" }}>
                                <ClipLoader
                                  style={{paddingTop: 0, paddingBottom: 0}}
                                  size={20}
                                  color={"white"}
                                  loading={this.state.SubmitButtonClicked && Object.keys(this.props.loginErrors).length < 1}
                                />
                              </div>
                            :
                              null
                            }
                          </div>
                          <div>
                            <FormGroup className={`has-label ${this.state.usernameState}`}>
                              <label>Username *</label>
                              <Input
                                id="username"
                                name="username"
                                type="text"
                                onChange={e => this.onChange( "username", e.target.value)}
                              />
                              {this.state.usernameState === "has-danger" ? (
                                <label className="error">
                                  {this.state.usernameError}
                                </label>
                              ) : null}
                            </FormGroup>
                          </div>
                          <div>
                            <FormGroup className={`has-label ${this.state.passwordState}`}>
                              <label>Password *</label>
                              <Input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="off"
                                onChange={e => this.onChange( "password", e.target.value)}
                              />
                              {this.state.passwordState === "has-danger" ? (
                                <label className="error">{this.state.passwordError}</label>
                              ) : null}
                            </FormGroup>
                          </div>
                          <h6 className="w-100 text-center description" style={{ textTransform: "none" }}><Link to="/account/register">Forgot Password?</Link></h6>
                          <div className="ml-auto mr-auto mt-4" style={{ width: "80%" }}>
                            <SubmitButton />
                          </div>
                          <h6 className="w-100 text-center description" style={{ textTransform: "none" }}>or</h6>
                          <div className="w-100 d-flex justify-content-center align-items-center">
                            <Button
                              className="btn-primary btn-icon btn-round mr-2"
                              color="default"
                              size="lg"
                              href=""
                              target="_blank"
                            >
                              <i className="fab fa-facebook" />
                            </Button>
                            <Button
                              className="btn-primary btn-icon btn-round ml-2 mr-2"
                              color="default"
                              size="lg"
                              href=""
                              target="_blank"
                            >
                              <i className="fab fa-twitter" />
                            </Button>
                            <Button
                              className="btn-primary btn-icon btn-round ml-2"
                              color="default"
                              size="lg"
                              href=""
                              target="_blank"
                            >
                              <i className="fab fa-spotify" />
                            </Button>
                          </div>
                          {isMobile ? <div className="w-100 d-flex mb-1">
                            <h2 className="text-center title ml-auto mr-sm mb-0"><Link to="/account/register">Sign Up</Link></h2>
                            <h2 className="text-center title ml-sm mr-auto mb-0"><Link to="/account/register">Skip</Link></h2>
                          </div>
                          : <h2 className="text-center title ml-auto mr-auto mb-1"><Link to="/account/register">Sign Up</Link></h2>}
                        </Col>
                      </Row>
                    </Container>
                  </CardBody>
                </Card>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.authentication.user,
    loginErrors: state.authentication.loginErrors,
  }
};

const mapDispatchToProps = dispatch => ({
    login: (username, password, history, fn) => dispatch(login(username, password, history, fn)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
