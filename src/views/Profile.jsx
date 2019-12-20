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
  FormGroup,
  Form,
  Input,
  Row,
  Col
} from "reactstrap";

import ImageUpload from "components/ImageUpload/ImageUpload.jsx";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as sessionActions from '../redux/authentication/actions.js';

const artistPicsDB = "https://revibe-media.s3.amazonaws.com/media/images/Artist/"

class Profile extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      user: {},
      profile:{
        artist_uri: "",
        ext: ""
      }
    };

    this.getProfile = this.getProfile.bind(this);
    this.editProfile = this.editProfile.bind(this);
  }

  componentWillMount()
  {
    this.getProfile()
  }

  componentDidMount() 
  {
    document.body.classList.toggle("profile-page");
  }

  componentWillUnmount() 
  {
    document.body.classList.toggle("profile-page");
  }

  componentDidUpdate(prevProps)
  {
  }

  async getProfile() 
  {
    var fetchedProfile = await this.props.actions.getProfile();
    console.log(fetchedProfile);
    
    this.setState({profile: fetchedProfile})    
    const fetchedUser = fetchedProfile.user
    this.setState({user: fetchedUser})
    console.log(artistPicsDB+
      this.state.profile.artist_uri+
      "."+
      this.state.profile.ext);
  }

  async editProfile()
  {
    await this.props.actions.editProfile(this.state.user);
  }

  onChange(key, value) 
  {
    var newUser = {...this.state.user}
    newUser[key] = value
    this.setState({user: newUser})  
  }

  render() {
    console.log(this.state.profile.ext ==="");
    return (
      <div className="content">
        <Row>
          <Col md="8">
            <Card>
              <CardHeader>
                <h5 className="title">Edit Profile</h5>
              </CardHeader>
              <CardBody>
                <Form>
                  <Row>
                    <Col className="pr-md-1" md="5">
                    <FormGroup>
                      <label>Username</label>
                      <Input defaultValue={this.state.user.username} placeholder="Username" type="text" onChange={event => this.onChange( "username", event.target.value)}/>
                    </FormGroup>
                    </Col>
                    <Col className="pl-md-1" md="4">
                      <FormGroup>
                        <label>Email address</label>
                        <Input defaultValue={this.state.user.email} placeholder="user@email.com" type="email" onChange={event => this.onChange( "email", event.target.value)}/>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-md-1" md="6">
                      <FormGroup>
                        <label>First Name</label>
                        <Input defaultValue={this.state.user.first_name} placeholder="First Name" type="text" onChange={event => this.onChange( "first_name", event.target.value)}/>
                      </FormGroup>
                    </Col>
                    <Col className="pl-md-1" md="6">
                      <FormGroup>
                        <label>Last Name</label>
                        <Input defaultValue={this.state.user.last_name}  placeholder="Last Name" type="text" onChange={event => this.onChange( "last_name", event.target.value)}/>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-md-1" md="4">
                      <FormGroup>
                        <label>City</label>
                        <Input defaultvalue="" placeholder="City" type="text" onChange={event => this.onChange( "city", event.target.value)}/>
                      </FormGroup>
                    </Col>
                    <Col className="px-md-1" md="4">
                      <FormGroup>
                        <label>Country</label>
                        <Input defaultvalue="" placeholder="Country" type="text" onChange={event => this.onChange( "country", event.target.value)}/>
                      </FormGroup>
                    </Col>
                    <Col className="pl-md-1" md="4">
                      <FormGroup>
                        <label>Postal Code</label>
                        <Input defaultvalue="" placeholder="ZIP Code" type="number" onChange={event => this.onChange( "zip", event.target.value)}/>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>About Me</label>
                        <Input
                          cols="80"
                          defaultValue="Lamborghini Mercy, Your chick she so thirsty, I'm in
                          that two seat Lambo."
                          placeholder="Here can be your description"
                          rows="4"
                          type="textarea"
                          onChange={event => this.onChange( "address", event.target.value)}
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
                onClick={() => this.editProfile()}
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
                    avatar= {this.state.profile.ext === "" ? require("../assets/img/default-avatar.png") : (artistPicsDB+this.state.profile.artist_uri+"."+this.state.profile.ext)}
                    btnText="Change Artist Image"
                    addBtnColor="default"
                    changeBtnColor="default"
                  />
                  <p className="description">Artist</p>
                </div>
                <div className="card-description">
                  Do not be scared of the truth because we need to restart the
                  human foundation in truth And I love you like Kanye loves
                  Kanye I love Rick Owens’ bed design but the back is...
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
      </div>
    );
  }
}
const mapDispatch = (dispatch) => {
  return {
    actions: bindActionCreators(sessionActions, dispatch)
  };
};

export default connect(null, mapDispatch)(Profile);
