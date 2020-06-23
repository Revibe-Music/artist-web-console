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
import React from "react";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardImg,
  CardTitle,
  Container,
  Label,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
  Tooltip
} from "reactstrap";
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ClipLoader from "react-spinners/ClipLoader";

import queryString from 'query-string'

import ScrollNavbar from "components/Navbars/ScrollNavbar.jsx";
import { register, signInViaGoogle } from 'redux/authentication/actions.js';
import { BuilderComponent } from "@builder.io/react";
import SocialButton from "components/Buttons/SocialAuth.jsx";

const termAndConditionsLink = "https://revibe-media.s3.us-east-2.amazonaws.com/Terms+and+Conditions.pdf"


class Register extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      // fields
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreedToTerms: false,

      // state of fields (success or error)
      usernameState: "",
      emailState: "",
      passwordState: "",
      confirmPasswordState: "",
      agreedToTermsState: "",

      // field errors
      usernameError: "",
      emailError: "",
      passwordError: "",
      confirmPasswordError: "",
      agreedToTermsError: "",

      SubmitButtonClicked:false,
      popupIsFailure: Math.random(),

      referralId: null
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeUserFields = this.onChangeUserFields.bind(this);
    this.socialAuthErr = this.socialAuthErr.bind(this);
    this.googleAuthSuccess = this.googleAuthSuccess.bind(this);
  }

  componentDidMount() {
    document.body.classList.toggle("register-page");

    var values = queryString.parse(this.props.location.search)

    if(values.uid)
      this.setState({ ...this.state, referralId: values.uid })
  }

  componentWillUnmount() {
    document.body.classList.toggle("register-page");
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.props.registerErrors.username !== prevProps.registerErrors.username) {
      if(this.props.registerErrors.username) {
        this.setState({
          usernameError: this.props.registerErrors.username,
          usernameState: "has-danger"
        })
      }
    }
    if(this.props.registerErrors.email !== prevProps.registerErrors.email) {
      if(this.props.registerErrors.email) {
        this.setState({
          emailError: this.props.registerErrors.email,
          emailState: "has-danger"
        })
      }
    }
    if(this.props.registerErrors.password !== prevProps.registerErrors.password) {
      if(this.props.registerErrors.password) {
        this.setState({
          passwordError: this.props.registerErrors.password,
          passwordState: "has-danger"
        })
      }
    }
  }

  // function that returns true if value is email, false otherwise
  verifyEmail(value) {
    var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(value)) {
      return true;
    }
    return false;
  }

  // function that verifies if a string has a given length or not
  verifyLength(value, length) {
    if (value.length >= length) {
      return true;
    }
    return false;
  };

  // function that verifies if two strings are equal
  compare(string1, string2){
    if (string1 === string2) {
      return true;
    }
    return false;
  };

  change(event, stateName, type, stateNameEqualTo) {
    switch (type) {
      case "username":
        if (this.verifyLength(event.target.value, 6)) {
          this.setState({
            [stateName + "State"]: "has-success",
            [stateName + "Error"]: ""
           });
        } else {
          this.setState({
            [stateName + "State"]: "has-danger",
            [stateName + "Error"]: "Username must contain at least 8 characters."
           });
        }
        break;
      case "email":
        if (this.verifyEmail(event.target.value)) {
          this.setState({
            [stateName + "State"]: "has-success",
            [stateName + "Error"]: ""
           });
        }
        else {
          this.setState({
            [stateName + "State"]: "has-danger",
            [stateName + "Error"]: "Please enter a valid email address."
           });
        }
        break;
      case "password":
        if (this.verifyLength(event.target.value, 8)) {
          this.setState({
            [stateName + "State"]: "has-success",
            [stateName + "Error"]: ""
           });
        }
        else {
          this.setState({
            [stateName + "State"]: "has-danger",
            [stateName + "Error"]: "Password must contain at least 8 characters."
           });
        }
        break;
      case "equalTo":
        if (this.compare(event.target.value, this.state[stateNameEqualTo])) {
          this.setState({
            [stateName + "State"]: "has-success",
            [stateName + "Error"]: "",
           });
        }
        else {
          this.setState({
            [stateName + "State"]: "has-danger",
            [stateName + "Error"]: "Password must match field above.",
          });
        }
        break;

      default:
        break;
    }
    this.setState({ [stateName]: event.target.value });
  };

  async onSubmit(history) {
    var validFields = true
    if (this.state.username === "") {
      validFields = false
      this.setState({
        usernameState: "has-danger",
        usernameError: "This field may not be blank."
       });
    }
    if (this.state.email === "") {
      validFields = false
      this.setState({
        emailState: "has-danger",
        emailError: "This field may not be blank."
       });
    }
    if (this.state.password === "") {
      validFields = false
      this.setState({
        passwordState: "has-danger",
        passwordError: "This field may not be blank."
       });
    }
    if (this.state.confirmPassword === "") {
      validFields = false
      this.setState({
        confirmPasswordState: "has-danger",
        confirmPasswordError: "This field may not be blank."
       });
    }
    if (!this.state.agreedToTerms) {
      validFields = false
      this.setState({
        agreedToTermsState: "has-danger",
        agreedToTermsError: "Please agree to the terms and conditions. "
       });
    }
    if(validFields) {
      if(this.state.usernameError==="" && this.state.emailError==="" && this.state.passwordError==="" && this.state.confirmPasswordError==="") {
        this.setState({SubmitButtonClicked: true})

        var referralId = this.state.referralId ? this.state.referralId : null

        if(referralId)
          this.props.register(this.state.username, this.state.email, this.state.password, history, referralId);
        else
          this.props.register(this.state.username, this.state.email, this.state.password, history);
      }
    }
  }

  onChangeUserFields(key, value) {
    var newState = {...this.state}
    newState[key] = value
    this.setState(newState)
  }

  socialAuthErr(err) {
    // console.log(err)
    this.setState({ popupIsFailure: Math.random() })
  }

  googleAuthSuccess(user, history) {
    var token = user._token.accessToken, referralId = this.state.referralId ? parseInt(this.state.referralId) : null

    if(referralId)
      this.props.signInViaGoogle(token, history, referralId)
    else
      this.props.signInViaGoogle(token, history)
  }

  render() {
    console.log(this.state)

    const SubmitButton = withRouter(({ history }) => (
      <Button
        className="btn-round btn-primary w-100"
        onClick={() => this.onSubmit(history)}
        size="md"
        type="submit"
      >
        <h4 className="mt-auto mb-auto">Register</h4>
      </Button>
    ));

    const SocialAuthButton = withRouter(({ history, ...props }) => (
      <SocialButton
        onLoginSuccess={user => props.loginOnSuccess(user, history)}
        {...props}
      >
        {props.children}
      </SocialButton>
    ));

    const isMobile = window.innerWidth < 576;

    return (
      <>
      <ScrollNavbar hideLogin/>
      <div className="content">
        {/*<Container className="mt-lg">
          <Row>
            <Col className="m-auto" md="7">
            <Form className="form">
              <Card className="card-register card-gray">
                <CardHeader className="pb-0">
                  <CardTitle style={{color: "#7248bd", display: "flex", alignItems: "center", justifyContent: "center"}} tag="h3">Register</CardTitle>
                </CardHeader>
                <div style={{textAlign:"center"}}>
                  {this.props.otherError !== "" ? (
                    <label style={{color:"red"}}>
                      {this.props.otherError}
                    </label>
                  ) : null}
                </div>
                <CardBody>
                  <FormGroup className={`has-label ${this.state.usernameState}`}>
                    <label>Username *</label>
                    <Input
                      placeholder="(Not your Artist or Display Name)"
                      name="username"
                      type="text"
                      onChange={e => this.change(e, "username", "username")}
                    />
                    {this.state.usernameState === "has-danger" ? (
                      <label className="error">
                        {this.state.usernameError}
                      </label>
                    ) : null}
                  </FormGroup>
                  <FormGroup className={`has-label ${this.state.emailState}`}>
                    <label>Email Address *</label>
                    <Input
                      name="email"
                      type="email"
                      onChange={e => this.change(e, "email", "email")}
                    />
                    {this.state.emailState === "has-danger" ? (
                      <label className="error">
                        {this.state.emailError}
                      </label>
                    ) : null}
                  </FormGroup>
                  <FormGroup className={`has-label ${this.state.passwordState}`}>
                    <label>Password *</label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="off"
                      onChange={e =>
                        this.change(e, "password", "password")
                      }
                    />
                    {this.state.passwordState === "has-danger" ? (
                      <label className="error">{this.state.passwordError}</label>
                    ) : null}
                  </FormGroup>
                  <FormGroup
                    className={`has-label ${this.state.confirmPasswordState}`}
                  >
                    <label>Confirm Password *</label>
                    <Input
                      equalto="#password"
                      id="passwordConfirmation"
                      name="password_confirmation"
                      type="password"
                      autoComplete="off"
                      onChange={e => this.change(e, "confirmPassword", "equalTo", "password")}
                    />
                    {this.state.confirmPasswordState ===
                    "has-danger" ? (
                      <label className="error">{this.state.confirmPasswordError}</label>
                    ) : null}
                  </FormGroup>

                  <FormGroup
                    check
                    className={`text-left`}
                    >
                    <Label check>
                      <Input
                        type="checkbox"
                        onClick= {event => this.onChangeUserFields("agreedToTerms", event.target.checked)}
                      />
                      <span className="form-check-sign" />I agree to the{" "}
                      <a
                        target="_blank"
                        href={termAndConditionsLink}
                      >
                        terms and conditions
                      </a>
                      .
                    </Label>
                    {this.state.agreedToTermsState ===
                    "has-danger" ? (
                      <label style={{color: "red"}} className="error">{this.state.agreedToTermsError}</label>
                    ) : null}
                  </FormGroup>
                </CardBody>
                <CardFooter>
                  <SubmitButton />
                    <div className="pull-right">
                    <h6>
                      <Link to="/account/login">Have an Account? Login Here</Link>
                    </h6>
                  </div>
                </CardFooter>
              </Card>
              </Form>
            </Col>
          </Row>
        </Container>*/}
        <Container className={`${isMobile ? "mt-2" : "mt-lg"}`}>
          <Row>
            <Col md="8" className="ml-auto mr-auto">
              <Form className="form">
                <Card className="card-login card-gray">
                  <CardBody>
                    <Container>
                      <Row>
                        {!isMobile ? <Col md="6" className="d-flex align-items-center">
                          <div className="mt-auto mb-auto">
                            <BuilderComponent
                              name="component"
                              entry="481fa42b58824e3faa10bc6b2e0da733"
                            />
                          </div>
                        </Col> : null}
                        <Col md="6">
                          {!isMobile ?
                            <>
                              {/*<h4 className="text-white w-50 text-right ml-auto mr-0"><Link to="/account/register">Skip</Link></h4>*/}
                            </>
                          :
                            <h1 className="w-100 text-white text-center">Welcome to Revibe!</h1>
                          }
                          <div className="w-100 mt-md mb-sm">
                            <h2 className="mt-0 mb-0 w-50">Sign Up</h2>
                            {this.state.SubmitButtonClicked ?
                              <div className="d-inline-block" style={{ float: "right" }}>
                                <ClipLoader
                                  style={{paddingTop: 0, paddingBottom: 0}}
                                  size={20}
                                  color={"white"}
                                  loading={this.state.SubmitButtonClicked && Object.keys(this.props.registerErrors).length < 1}
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
                              placeholder="(Not your Artist or Display Name)"
                              name="username"
                              type="text"
                              onChange={e => this.change(e, "username", "username")}
                            />
                            {this.state.usernameState === "has-danger" ? (
                              <label className="error">
                                {this.state.usernameError}
                              </label>
                            ) : null}
                          </FormGroup>
                          <FormGroup className={`has-label ${this.state.emailState}`}>
                            <label>Email Address *</label>
                            <Input
                              name="email"
                              type="email"
                              onChange={e => this.change(e, "email", "email")}
                            />
                            {this.state.emailState === "has-danger" ? (
                              <label className="error">
                                {this.state.emailError}
                              </label>
                            ) : null}
                          </FormGroup>
                          <FormGroup className={`has-label ${this.state.passwordState}`}>
                            <label>Password *</label>
                            <Input
                              id="password"
                              name="password"
                              type="password"
                              autoComplete="off"
                              onChange={e =>
                                this.change(e, "password", "password")
                              }
                            />
                            {this.state.passwordState === "has-danger" ? (
                              <label className="error">{this.state.passwordError}</label>
                            ) : null}
                          </FormGroup>
                          <FormGroup
                            className={`has-label ${this.state.confirmPasswordState}`}
                          >
                            <label>Confirm Password *</label>
                            <Input
                              equalto="#password"
                              id="passwordConfirmation"
                              name="password_confirmation"
                              type="password"
                              autoComplete="off"
                              onChange={e => this.change(e, "confirmPassword", "equalTo", "password")}
                            />
                            {this.state.confirmPasswordState ===
                            "has-danger" ? (
                              <label className="error">{this.state.confirmPasswordError}</label>
                            ) : null}
                          </FormGroup>

                          <FormGroup
                            check
                            className={`text-left`}
                          >
                            <Label check>
                              <Input
                                type="checkbox"
                                onClick= {event => this.onChangeUserFields("agreedToTerms", event.target.checked)}
                              />
                              <span className="form-check-sign" />I agree to the{" "}
                              <a
                                target="_blank"
                                href={termAndConditionsLink}
                              >
                                terms and conditions
                              </a>
                              .
                            </Label>
                            {this.state.agreedToTermsState ===
                            "has-danger" ? (
                              <label style={{color: "red"}} className="error">{this.state.agreedToTermsError}</label>
                            ) : null}
                          </FormGroup>
                          </div>
                          <div className="ml-auto mr-auto mt-4" style={{ width: "80%" }}>
                            <SubmitButton />
                          </div>
                          <h6 className="w-100 text-center description" style={{ textTransform: "none" }}>or</h6>
                          <div className="w-100 d-flex justify-content-center align-items-center">
                            {/*<SocialButton
                              className="btn-primary btn-icon btn-round mr-2"
                              color="default"
                              size="lg"
                              provider="facebook"
                              appId="TBD"
                              onLoginSuccess={user => console.log(user)}
                              onLoginFailure={err => console.log(err)}
                            >
                              <i className="fab fa-facebook" />
                            </SocialButton>*/}
                            {/*<Button
                              className="btn-primary btn-icon btn-round ml-2 mr-2"
                              color="default"
                              size="lg"
                              href=""
                              target="_blank"
                            >
                              <i className="fab fa-twitter" />
                            </Button>*/}
                            <SocialAuthButton
                              provider="google"
                              appId="377937989327-52gam844ctp3j0fukme2v106g7frtlhh.apps.googleusercontent.com"
                              loginOnSuccess={(user, history) => this.googleAuthSuccess(user, history)}
                              onLoginFailure={this.socialAuthErr}
                              className="btn-primary btn-icon btn-round ml-2"
                              color="default"
                              size="lg"
                              key={this.state.popupIsFailure}
                            >
                              <i className="fab fa-google" />
                            </SocialAuthButton>
                          </div>
                          {isMobile ? <div className="w-100 d-flex mb-1">
                            <h2 className="text-center title ml-auto mr-auto mb-0"><Link to="/account/login">Sign In</Link></h2>
                            {/*<h2 className="text-center title ml-auto mr-sm mb-0"><Link to="/account/login">Sign In</Link></h2>
                            <h2 className="text-center title ml-sm mr-auto mb-0"><Link to="/account/register">Skip</Link></h2>*/}
                          </div>
                          : <h2 className="text-center title ml-auto mr-auto mb-1"><Link to="/account/login">Sign In</Link></h2>}
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
    registerErrors: state.authentication.registerErrors,
  }
};

const mapDispatchToProps = dispatch => ({
    register: (username, email, password, history, referralId) =>dispatch(register(username, email, password, history, referralId)),
    signInViaGoogle: (access_token, history, referralId) => dispatch(signInViaGoogle(access_token, history, referralId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);
