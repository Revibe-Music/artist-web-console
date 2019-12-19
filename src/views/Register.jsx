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
  Label,
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
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as sessionActions from '../redux/authentication/actions.js';

class Register extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      agreedToTerms: false,
      user: {
        username: '',
        email: '',   
        password: '',
        profile: {}
      }
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeAgree = this.onChangeAgree.bind(this)
    this.onChangeUserFields = this.onChangeUserFields.bind(this);
  }

  componentDidMount() {
    document.body.classList.toggle("register-page");
  }

  componentWillUnmount() {
    document.body.classList.toggle("register-page");
  }

  async onSubmit(history) {
    this.props.actions.register(this.state.user, history);
  }

  onChangeUserFields(key, value) {
    var newUser = {...this.state.user}
    newUser[key] = value
    this.setState({user: newUser})
  }

  onChangeAgree(value) {
    this.setState({agreedToTerms: value})
    console.log(value)
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
        Get Started
      </Button>
    ));

    return (
      <div className="content" style={{paddingTop: "50px"}}>
        <Container>
          <Row>
            <Col className="m-auto" md="7">
              <Card className="card-register card-gray">
                <CardHeader>
                  <CardTitle style={{color: "#7248bd", display: "flex", alignItems: "center", justifyContent: "center"}} tag="h3">Register</CardTitle>
                </CardHeader>
                <CardBody>
                  <Form className="form">
                    <InputGroup>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="tim-icons icon-single-02" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input placeholder="Username (Not your Artist or Display Name)" type="text" onChange={event => this.onChangeUserFields( "username", event.target.value)} />
                    </InputGroup>
                    <InputGroup>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="tim-icons icon-email-85" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input placeholder="Email" type="text" onChange={event => this.onChangeUserFields( "email", event.target.value)}/>
                    </InputGroup>
                    <InputGroup>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="tim-icons icon-lock-circle" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input placeholder="Password" type="text" onChange={event => this.onChangeUserFields( "password", event.target.value)}/>
                    </InputGroup>
                    <FormGroup check className="text-left">
                      <Label check>
                        <Input type="checkbox" onClick= {event => this.onChangeAgree(event.target.checked)}/>
                        <span className="form-check-sign" />I agree to the{" "}
                        <a href="#pablo" onClick={e => e.preventDefault()}>
                          terms and conditions
                        </a>
                        .
                      </Label>
                    </FormGroup>
                  </Form>
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
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

const mapDispatch = (dispatch) => {
  return {
    actions: bindActionCreators(sessionActions, dispatch)
  };
};

export default connect(null, mapDispatch)(Register);
