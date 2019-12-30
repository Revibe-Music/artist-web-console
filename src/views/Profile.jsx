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
  CardTitle,
  CardHeader,
  CardBody,
  CardFooter,
  CardText,
  Container,
  FormGroup,
  Form,
  Input,
  InputGroup,
  Row,
  Col
} from "reactstrap";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import ImageUpload from "components/ImageUpload/ImageUpload.jsx";
import { connect } from 'react-redux';
import { editArtistProfile } from 'redux/authentication/actions.js'
import { compact } from 'lodash';

const MySwal = withReactContent(Swal)

const artistPicsDB = "https://revibe-media-test.s3.amazonaws.com/media/images/Artist/"


class Profile extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      editedUser: {
        name: null,
        email: null,
        country: null,
        city: null,
        zipcode: null,
        aboutMe: null
      },

    }
    this.ImageUploader = React.createRef();
  }

  componentDidMount() {
    document.body.classList.toggle("profile-page");
  }

  componentWillUnmount() {
    document.body.classList.toggle("profile-page");
  }

  saveBtnPressed() {
    MySwal.fire({
      title: 'Profile Saved',
      text: '',
      icon: 'success',
      showCancelButton: false,
      showConfirmButton: false,
      timer: 1500,
      background: "#303030"
    })
    var user = { ...this.state.editedUser }
    console.log();
    if(this.ImageUploader.current.state.file !== null) {
      user.image = this.ImageUploader.current.state.file
    }
    Object.keys(user).forEach((key) => {if(user[key] == null) delete user[key]});
    this.props.editArtistProfile(user)
  }

  onChange(key, value) {
    var user = { ...this.state.editedUser }
    user[key] = value
    this.setState({editedUser: user})
  }

  render() {
    return (
      <div className="content">
      <Container>
        <Row>
          <Col md="8">
            <Card>
              <CardHeader>
                <h5 className="title">Edit Profile</h5>
              </CardHeader>
              <CardBody>
                <Form className="form">
                  <Row>
                    <Col className="pr-md-1" md="6">
                    <FormGroup>
                      <label>Display Name</label>
                      <Input defaultValue={this.props.user.displayName} placeholder="Display Name" type="text" onChange={event => this.onChange( "name", event.target.value)}/>
                    </FormGroup>
                    </Col>
                    <Col className="pl-md-1" md="6">
                      <FormGroup>
                        <label>Email address</label>
                        <Input defaultValue={this.props.user.email} placeholder="user@email.com" type="email" onChange={event => this.onChange( "email", event.target.value)}/>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>

                    <Col className="px-md-1" md="4">
                      <FormGroup>
                        <label>Country</label>
                        <Input className="primary" defaultValue={this.props.user.country} placeholder="Country" type="text" onChange={event => this.onChange("country", event.target.value)}/>
                      </FormGroup>
                    </Col>
                    <Col className="pr-md-1" md="4">
                      <FormGroup>
                        <label>City</label>
                        <Input defaultValue={this.props.user.city} placeholder="City" type="text" onChange={event => this.onChange("city", event.target.value)}/>
                      </FormGroup>
                    </Col>
                    <Col className="pl-md-1" md="4">
                      <FormGroup>
                        <label>Postal Code</label>
                        <Input defaultValue={this.props.user.zipcode} placeholder="ZIP Code" type="number" onChange={event => this.onChange("zipcode", event.target.value)}/>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>About Me</label>
                        <Input
                          cols="80"
                          defaultValue={this.props.user.artistAboutMe}
                          placeholder="Here can be your description"
                          rows="4"
                          type="textarea"
                          onChange={event => this.onChange("aboutMe", event.target.value)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
              <CardFooter>
                <Button
                className="btn-fill"
                color="primary"
                type="submit"
                onClick={() => this.saveBtnPressed()}
                >
                  Save
                </Button>
              </CardFooter>
            </Card>
          </Col>
          <Col md="4">
            <Card className="card-user">
              <CardBody>
                <CardText />
                <div className="author">
                  <div className="block block-one" />
                  <div className="block block-two" />
                  <div className="block block-three" />
                  <div className="block block-four" />
                  <ImageUpload
                    defaultImage={require("../assets/img/default-avatar.png")}
                    uploadedImage={this.props.user.artistImage === "" ? null : (artistPicsDB+this.props.user.artistImage)}
                    btnText="Change Artist Image"
                    addBtnColor="default"
                    changeBtnColor="default"
                    ref={this.ImageUploader}
                  />
                </div>

              </CardBody>
              <CardFooter>
                <div className="button-container">
                  <Button className="btn-icon btn-round" color="facebook">
                    <i className="fab fa-facebook" />
                  </Button>
                  <Button className="btn-icon btn-round" color="twitter">
                    <i className="fab fa-twitter" />
                  </Button>
                  <Button className="btn-icon btn-round" color="google">
                    <i className="fab fa-google-plus" />
                  </Button>
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

function mapStateToProps(state) {
  return {
    user: state.authentication.user,
  }
};

const mapDispatchToProps = dispatch => ({
    editArtistProfile: (data) =>dispatch(editArtistProfile(data)),
});


export default connect(mapStateToProps, mapDispatchToProps)(Profile);
