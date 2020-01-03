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

      loginError: "YOOOO",
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
        this.props.login(this.state.username, this.state.password, history);
      }
    }
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
        block
        className="mb-3"
        color="primary"
        onClick={() => this.onSubmit(history)}
        size="lg"
      >
        Login
      </Button>
    ));

    return (
      <div className="content" style={{paddingTop: "50px"}}>
        <Container>
        <Row>
          <Col className="m-auto mr-auto" md="7">
            <Form className="form">
              <Card className="card-login card-gray">
                <CardHeader>
                  <CardTitle style={{color: "#7248bd", display: "flex", alignItems: "center", justifyContent: "center"}} tag="h3">Login</CardTitle>
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
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.authentication.user,
    otherError: state.authentication.errors.other,
  }
};

const mapDispatchToProps = dispatch => ({
    login: (username, password, history, fn) => dispatch(login(username, password, history, fn)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
