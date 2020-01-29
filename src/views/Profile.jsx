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
  Col,
  UncontrolledTooltip
} from "reactstrap";
import ReactTooltip from 'react-tooltip';
import Select from "react-select";
import Switch from "react-bootstrap-switch";
import ClipLoader from "react-spinners/ClipLoader";
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { connect } from 'react-redux';
import { compact } from 'lodash';
import csc from 'country-state-city'
import zip from 'zippo'

import ImageUpload from "components/ImageUpload/ImageUpload.jsx";
import { editArtistProfile } from 'redux/authentication/actions.js'


class Profile extends React.Component {

  constructor(props) {
    super(props)

    this.state = {

      name: null,
      email: null,
      country: null,
      state: null,
      city: null,
      zipcode: null,
      aboutMe: null,
      image: null,

      nameState: "",
      emailState: "",
      zipcodeState: "",

      nameError: "",
      emailError: "",
      zipcodeError: "",

      countryOptions: csc.getAllCountries().map(function(x) { return {value: x.id, label: x.name}}),
      stateOptions: [],
      cityOptions: [],

      requireContributionApproval: this.props.user.requireContributionApproval,
      shareDataWithContributors: this.props.user.shareDataWithContributors,
      shareAdvancedDataWithContributors: this.props.user.shareAdvancedDataWithContributors,
      allowContributorsToEditContributions: this.props.user.allowContributorsToEditContributions,

      saving: false
    }

    if(this.state.countryOptions.filter(option => option.label === this.props.user.country).length > 0) {
      this.state.country = this.state.countryOptions.filter(option => option.label === this.props.user.country)[0]
      this.state.stateOptions = csc.getStatesOfCountry(this.state.country.value).map(function(x) { return {value: x.id, label: x.name}})

      if(this.state.stateOptions.filter(option => option.label === this.props.user.state).length > 0) {
        this.state.state = this.state.stateOptions.filter(option => option.label === this.props.user.state)[0]
        this.state.cityOptions = csc.getCitiesOfState(this.state.state.value).map(function(x) { return {value: x.id, label: x.name}})

        if(this.state.cityOptions.filter(option => option.label === this.props.user.city).length > 0) {
          this.state.city = this.state.cityOptions.filter(option => option.label === this.props.user.city)[0]
        }
      }
    }

    this.onSubmit = this.onSubmit.bind(this)
    this.onImageChange = this.onImageChange.bind(this)
    this.selectCountry = this.selectCountry.bind(this)
    this.selectState = this.selectState.bind(this)
    this.selectCity = this.selectCity.bind(this)
    this.toggleSetting = this.toggleSetting.bind(this)
  }

  componentDidMount() {
    document.body.classList.toggle("profile-page");
  }

  componentWillUnmount() {
    document.body.classList.toggle("profile-page");
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.props.editProfileErrors.email !== prevProps.editProfileErrors.email) {
      if(this.props.editProfileErrors.email) {
        this.setState({
          emailError: this.props.editProfileErrors.email,
          emailState: "has-danger"
        })
      }
    }
    if(this.props.user.country !== prevProps.user.country) {
      if(this.props.user.country) {
        var newState = {}
        if(this.state.countryOptions.filter(option => option.label === this.props.user.country).length > 0) {
          newState.country = this.state.countryOptions.filter(option => option.label === this.props.user.country)[0]
          newState.stateOptions = csc.getStatesOfCountry(newState.country.value).map(function(x) { return {value: x.id, label: x.name}})

          if(newState.stateOptions.filter(option => option.label === this.props.user.state).length > 0) {
            newState.state = newState.stateOptions.filter(option => option.label === this.props.user.state)[0]
            newState.cityOptions = csc.getCitiesOfState(newState.state.value).map(function(x) { return {value: x.id, label: x.name}})

            if(newState.cityOptions.filter(option => option.label === this.props.user.city).length > 0) {
              newState.city = newState.cityOptions.filter(option => option.label === this.props.user.city)[0]
            }
          }
          this.setState(newState)
        }
      }
    }
    if(this.props.user.requireContributionApproval !== prevProps.user.requireContributionApproval) {
      this.setState({requireContributionApproval: this.props.user.requireContributionApproval})
    }
    if(this.props.user.shareDataWithContributors !== prevProps.user.shareDataWithContributors) {
      this.setState({shareDataWithContributors:this.props.user.shareDataWithContributors})
    }
    if(this.props.user.shareAdvancedDataWithContributors !== prevProps.user.shareAdvancedDataWithContributors) {
      this.setState({shareAdvancedDataWithContributors:this.props.user.shareAdvancedDataWithContributors})
    }
    if(this.props.user.allowContributorsToEditContributions !== prevProps.user.allowContributorsToEditContributions) {
      this.setState({allowContributorsToEditContributions:this.props.user.allowContributorsToEditContributions})
    }
  }

  async onSubmit() {
    if(this.state.nameError==="" && this.state.emailError==="" && this.state.zipcodeError==="") {
      this.setState({saving: true})
      var user = {
        name: this.state.name,
        email: this.state.email,
        image: this.state.image,
        country: this.state.country ? this.state.country.label : null,
        state: this.state.state ? this.state.state.label : null,
        city: this.state.city ? this.state.city.label : null,
        zipcode: this.state.zipcode,
        aboutMe: this.state.aboutMe,
        requireContributionApproval: this.state.requireContributionApproval,
        shareDataWithContributors: this.state.shareDataWithContributors,
        shareAdvancedDataWithContributors: this.state.shareAdvancedDataWithContributors,
        allowContributorsToEditContributions: this.state.allowContributorsToEditContributions,
      }
      Object.keys(user).forEach((key) => {if(user[key] == null) delete user[key]});
      await this.props.editArtistProfile(user)
      this.setState({saving: false})
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

  // function that verifies if zipcode is valid
  verifyZipcode (value) {
    value = zip.parse(value)
    if (zip.validate(value)) {
      return true;
    }
    return false;
  }

  change(event, stateName, type) {
    switch (type) {
      case "name":
        if (this.verifyLength(event.target.value, 2)) {
          this.setState({
            [stateName + "State"]: "has-success",
            [stateName + "Error"]: ""
           });
        }
        else {
          this.setState({
            [stateName + "State"]: "has-danger",
            [stateName + "Error"]: "Display name must contain at least 2 characters."
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
      case "zipcode":
        if(event.target.value.length > 0) {
          if (this.verifyZipcode(event.target.value)) {
            this.setState({
              [stateName + "State"]: "has-success",
              [stateName + "Error"]: ""
             });
          }
          else {
            this.setState({
              [stateName + "State"]: "has-danger",
              [stateName + "Error"]: "Please enter a valid postal code."
             });
          }
        }
        else {
          this.setState({
            [stateName + "State"]: "",
            [stateName + "Error"]: ""
           });
        }
        break;
      default:
        break;
    }
    this.setState({ [stateName]: event.target.value });
  };

  onImageChange(file) {
    this.setState({
      image: file,
     });
  }


  /// LOCATION DROPDOWN METHODS ///
  selectCountry(country) {
    this.setState({
      country: country,
      state: null,
      city: null,
      stateOptions: csc.getStatesOfCountry(country.value).map(function(x) { return {value: x.id, label: x.name}})
    })
  }

  selectState(state) {
    this.setState({
      state: state,
      city: null,
      cityOptions: csc.getCitiesOfState(state.value).map(function(x) { return {value: x.id, label: x.name}}),
    })
  }

  selectCity(city) {
    this.setState({city: city})
  }

  toggleSetting(name, value) {
    this.setState({[name]: value})
  }

  render() {


    return (
      <div className="content">
      <Container>
        <Row>
          <Col md="8">
            <Form className="form">
              <Card>
                <CardHeader>
                  <CardTitle tag="h3">Edit Profile</CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col className="pr-md-1" md="6">
                      <FormGroup className={`has-label ${this.state.nameState}`}>
                        <label>Display Name</label>
                        <Input
                          defaultValue={this.props.user.displayName}
                          name="name"
                          type="text"
                          onChange={e => this.change(e, "name", "name")}
                        />
                        {this.state.nameState === "has-danger" ? (
                          <label className="error">
                            {this.state.nameError}
                          </label>
                        ) : null}
                      </FormGroup>
                    </Col>
                    <Col className="pl-md-1" md="6">
                      <FormGroup className={`has-label ${this.state.emailState}`}>
                        <label>Email Address</label>
                        <Input
                          defaultValue={this.props.user.email}
                          placeholder="ex: user@email.com"
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
                    </Col>
                  </Row>
                  <Row>
                    <Col xs="6" md="3">
                      <label>Country</label>
                      <Select
                        className="react-select"
                        classNamePrefix="react-select"
                        placeholder="Country"
                        closeMenuOnSelect={true}
                        isMulti={false}
                        onChange={option => this.selectCountry(option)}
                        value={this.state.country}
                        options={this.state.countryOptions}
                      />
                    </Col>
                    <Col xs="6" md="3">
                      <label>State</label>
                      <Select
                        className="react-select primary"
                        classNamePrefix="react-select"
                        placeholder="State"
                        closeMenuOnSelect={true}
                        isMulti={false}
                        onChange={option => this.selectState(option)}
                        value={this.state.state}
                        options={this.state.stateOptions}
                      />
                    </Col>
                    <Col xs="6" md="3">
                      <label>City</label>
                      <Select
                        className="react-select primary"
                        classNamePrefix="react-select"
                        placeholder="City"
                        closeMenuOnSelect={true}
                        isMulti={false}
                        onChange={option => this.selectCity(option)}
                        value={this.state.city}
                        options={this.state.cityOptions}
                      />
                    </Col>
                    <Col xs="6" md="3">
                      <FormGroup className={`has-label ${this.state.zipcodeState}`}>
                        <label>Postal Code</label>
                        <Input
                          defaultValue={this.props.user.zipcode}
                          placeholder="ex: 12345"
                          name="zipcode"
                          type="text"
                          pattern='[0-9]*'
                          onChange={e => this.change(e, "zipcode", "zipcode")}
                        />
                        {this.state.zipcodeState === "has-danger" ? (
                          <label className="error">
                            {this.state.zipcodeError}
                          </label>
                        ) : null}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <label>About Me</label>
                      <Input
                        cols="80"
                        defaultValue={this.props.user.artistAboutMe}
                        placeholder="Write a bio so that your fans can learn more about you."
                        rows="4"
                        type="textarea"
                        onChange={e => this.change(e, "aboutMe", "aboutMe")}
                      />
                    </Col>
                  </Row>
                  <Row style={{marginTop: "5%"}}>
                    <Col xs="4" md="2">
                      <Switch
                        value={this.state.requireContributionApproval}
                        offColor=""
                        onColor=""
                        onChange={(el, state) => this.toggleSetting("requireContributionApproval", state)}
                      />
                    </Col>
                    <Col xs="8" md="7">
                      <p>
                        <AiOutlineQuestionCircle style={{color: "#7248BD", marginRight: "5%"}} id="setting1-question"/>
                        Require Contribution Approval
                      </p>
                      <UncontrolledTooltip
                        style={{backgroundColor: "#7248BD", color: "white"}}
                        placement="bottom"
                        target="setting1-question"
                        hideArrow={true}
                      >
                        Enabling this will prevent others from automatically adding you as a contributor on a song/album.
                      </UncontrolledTooltip>
                    </Col>
                  </Row>
                  <Row style={{marginTop: "5%"}}>
                    <Col xs="4" md="2">
                      <Switch
                        value={this.state.shareDataWithContributors}
                        offColor=""
                        onColor=""
                        onChange={(el, state) => this.toggleSetting("shareDataWithContributors", state)}
                      />
                    </Col>
                    <Col xs="8" md="7">
                      <p>
                        <AiOutlineQuestionCircle style={{color: "#7248BD", marginRight: "5%"}} id="setting2-question"/>
                        Share Data With Contributors
                      </p>
                      <UncontrolledTooltip
                        style={{backgroundColor: "#7248BD", color: "white"}}
                        placement="bottom"
                        target="setting2-question"
                        hideArrow={true}
                      >
                        Enabling this will allow contributors on your songs/albums to view basic streaming data.
                      </UncontrolledTooltip>
                    </Col>
                  </Row>
                  <Row style={{marginTop: "5%"}}>
                    <Col xs="4" md="2">
                      <Switch
                        value={this.state.shareAdvancedDataWithContributors}
                        offColor=""
                        onColor=""
                        onChange={(el, state) => this.toggleSetting("shareAdvancedDataWithContributors", state)}
                      />
                    </Col>
                    <Col xs="8" md="7">
                      <p>
                        <AiOutlineQuestionCircle style={{color: "#7248BD", marginRight: "5%"}} id="setting3-question"/>
                        Share Advanced Data With Contributors
                      </p>
                      <UncontrolledTooltip
                        style={{backgroundColor: "#7248BD", color: "white"}}
                        placement="bottom"
                        target="setting3-question"
                        hideArrow={true}
                      >
                        Enabling this will allow contributors on your songs/albums to view advanced streaming data.
                      </UncontrolledTooltip>
                    </Col>
                  </Row>
                  <Row style={{marginTop: "5%"}}>
                    <Col xs="4" md="2">
                      <Switch
                        value={this.state.allowContributorsToEditContributions}
                        offColor=""
                        onColor=""
                        onChange={(el, state) => this.toggleSetting("allowContributorsToEditContributions", state)}
                      />
                    </Col>
                    <Col xs="8" md="7">
                      <p>
                        <AiOutlineQuestionCircle style={{color: "#7248BD", marginRight: "5%"}} id="setting4-question"/>
                        Allow Contributors To Edit Contributions
                      </p>
                      <UncontrolledTooltip
                        style={{backgroundColor: "#7248BD", color: "white"}}
                        placement="bottom"
                        target="setting4-question"
                        hideArrow={true}
                      >
                        Enabling this will allow contributors on one of your songs/albums to edit their contribution type after you have set it.
                      </UncontrolledTooltip>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                <a data-tip data-for="saveButtonTooltip">
                  <Button
                  className="btn-fill"
                  color="primary"
                  onClick={this.onSubmit}
                  >
                    Save
                    {this.state.saving ?
                      <div className="pull-right" style={{position: "absolute", right: "10%"}}>
                        <ClipLoader
                        style={{paddingTop: 0, paddingBottom: 0, marginTop: 0, marginBottom: 0, }}
                        size={15}
                        color={"white"}
                        loading={this.state.saving && Object.keys(this.props.editProfileErrors).length < 1}
                        />
                      </div>
                    :
                      null
                    }
                  </Button>
                  </a>
                <ReactTooltip id="saveButtonTooltip" effect='solid' delayShow={1500}>
                  <span>Save changes to profile</span>
                </ReactTooltip>
                </CardFooter>
              </Card>
            </Form>
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
                    defaultImage={require("../assets/portal/img/default-avatar.png")}
                    uploadedImage={this.props.user.images.large === "" ? null : this.props.user.images.large}
                    btnText="Change Artist Image"
                    addBtnColor="primary"
                    changeBtnColor="default"
                    onImageSelect={this.onImageChange}
                  />
                </div>
              </CardBody>
              <CardFooter>
                <div style={{margin: "2%"}}>
                  <p>*For best results, please use an image that is square and at least 750x750 pixels.</p>
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
    editProfileErrors: state.authentication.editProfileErrors,
  }
};

const mapDispatchToProps = dispatch => ({
    editArtistProfile: (data) => dispatch(editArtistProfile(data)),
});


export default connect(mapStateToProps, mapDispatchToProps)(Profile);
