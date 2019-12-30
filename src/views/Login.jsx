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
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Col
} from "reactstrap";
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { login } from 'redux/authentication/actions.js'

class Login extends Component {

  constructor(props) {
    super(props)
    this.state = {
      username: 'bigR1',
      password: 'riley',
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

  // componentDidUpdate(prevProps, prevState) {
  //   if(this.props.user)
  // }

  async onSubmit(history) {
    const { cookies } = this.props;
    this.props.login(this.state.username, this.state.password, history);
  }

  onChange(key, value)
  {
    var newState = {...this.state.user}
    newState[key] = value
    this.setState(newState)
  }

  render() {

    const SubmitButton = withRouter(({ history }) => (
      <Button
        block
        className="mb-3"
        color="primary"
        href="#pablo"
        onClick={() => this.onSubmit(history)}
        size="lg"
      >
        Login
      </Button>
    ));

    return (
      <div className="content" style={{paddingTop: "50px"}}>
        <Container>
          <Col className="m-auto mr-auto" lg="4" md="6">
            <Form className="form">
              <Card className="card-login card-gray">
                <CardHeader>
                  <CardTitle style={{color: "#7248bd", display: "flex", alignItems: "center", justifyContent: "center"}} tag="h1">Login</CardTitle>
                </CardHeader>
                <CardBody>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="tim-icons icon-single-02" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input placeholder="Username" type="text" onChange={event => this.onChange( "username", event.target.value)}/>
                  </InputGroup>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="tim-icons icon-lock-circle" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input placeholder="Password" type="password" onChange={event => this.onChange( "password", event.target.value)}/>
                  </InputGroup>
                </CardBody>
                <CardFooter>
                <SubmitButton />
                  <div className="pull-left">
                    <h6>
                      <Link to="/account/register">Create Account</Link>
                    </h6>
                  </div>
                </CardFooter>
              </Card>
            </Form>
          </Col>
        </Container>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.authentication.user,
  }
};

const mapDispatchToProps = dispatch => ({
    login: (username, password, history, fn) => dispatch(login(username, password, history, fn)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
