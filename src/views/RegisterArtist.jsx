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
import ImageUpload from "components/ImageUpload/ImageUpload.jsx";
import RevibeAPI from '../api/revibe.js';

const revibe = new RevibeAPI()

class RegisterArtist extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      display_name: '',
      image: null
    };

    this.ImageUploader = React.createRef();
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    document.body.classList.toggle("register-page");
  }

  componentWillUnmount() {
    document.body.classList.toggle("register-page");
  }

  async onSubmit(history) 
  {
    var response = await revibe.registerArtist({name: this.state.display_name, image_up: this.ImageUploader.current.state.file})
    console.log(response);
  }

  onChange(key, value) {
    var newUser = {...this.state.user}
    newUser[key] = value
    this.setState({user: newUser})
    // console.log(index, key, value);
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
            <Col className="m-auto" md="8">
              <Card className="card-register card-gray">
                <CardHeader>
                  <CardTitle style={{color: "#7248bd", display: "flex", alignItems: "center", justifyContent: "center"}} tag="h4">Artist Info</CardTitle>
                </CardHeader>
                <CardBody>
                  <Form className="form">
                    <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                  <ImageUpload
                    avatar
                    addBtnColor="default"
                    changeBtnColor="default"
                    ref={this.ImageUploader}/>
                    </div>
                    <Col className="m-auto" md="6">
                    <InputGroup md="6">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="tim-icons icon-single-02" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input placeholder="Display Name" type="text" onChange={event => this.onChange( "display_name", event.target.value)}/>
                    </InputGroup>
                    </Col>
                  </Form>
                </CardBody>
                <CardFooter>
                  <SubmitButton/>
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

export default connect(null, mapDispatch)(RegisterArtist);
