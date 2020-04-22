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
import ReactTooltip from 'react-tooltip';

import ScrollNavbar from "components/Navbars/ScrollNavbar.jsx";
import { register } from 'redux/authentication/actions.js';

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

      SubmitButtonClicked:false

    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeUserFields = this.onChangeUserFields.bind(this);
  }

  componentDidMount() {
    document.body.classList.toggle("register-page");
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
        this.props.register(this.state.username, this.state.email, this.state.password, history);
      }
    }
  }

  onChangeUserFields(key, value) {
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
        size="lg"
        type="submit"
      >
        Register
        {this.state.SubmitButtonClicked ?
          <div className="pull-right" >
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
      </Button>
    ));

    return (
      <>
      <ScrollNavbar hideLogin/>
      <div className="content">
        <Container className="mt-lg">
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
    register: (username, email, password, history) =>dispatch(register(username, email, password, history)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);
