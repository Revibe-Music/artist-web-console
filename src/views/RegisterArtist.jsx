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

} from "reactstrap";
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ClipLoader from "react-spinners/ClipLoader";

import {registerArtist} from '../redux/authentication/actions.js';
import ImageUpload from "components/ImageUpload/ImageUpload.jsx";
import RevibeAPI from '../api/revibe.js';

const revibe = new RevibeAPI()

class RegisterArtist extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      displayName: '',

      displayNameState: '',
      displayNameError: '',
      artistImageState: '',
      artistImageError: '',

      SubmitButtonClicked:false
    };

    this.ImageUploader = React.createRef();
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.props.registerArtistErrors.name !== prevProps.registerArtistErrors.name) {
      if(this.props.registerArtistErrors.name) {
        this.setState({
          displayNameError: this.props.registerArtistErrors.name,
          displayNameState: "has-danger"
        })
      }
    }
    if(this.props.registerArtistErrors.image !== prevProps.registerArtistErrors.image) {
      if(this.props.registerArtistErrors.image) {
        this.setState({
          artistImageError: this.props.registerArtistErrors.image,
          artistImageState: "has-danger"
        })
      }
    }

  }

  async onSubmit(history) {
    var validFields = true
    if (this.state.displayName === "") {
      validFields = false
      this.setState({
        displayNameState: "has-danger",
        displayNameError: "This field may not be blank."
       });
    }
    if (this.ImageUploader.current.state.file === null) {
      this.setState({
        artistImageState: "has-danger",
        artistImageError: "Please select an image."
       });
    }
    if(validFields) {
      if(this.state.displayNameError==="" && this.ImageUploader.current.state.file !== null) {
        this.setState({SubmitButtonClicked: true})
        this.props.registerArtist(this.state.displayName, this.ImageUploader.current.state.file, history)
      }
    }
  }

  onChange(value)  {
    this.setState({
      displayName: value,
      displayNameState: "",
      displayNameError: ""
    })
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
        Get Started
        {this.state.SubmitButtonClicked ?
          <div className="pull-right" >
            <ClipLoader
            style={{paddingTop: 0, paddingBottom: 0}}
            size={20}
            color={"white"}
            loading={this.state.SubmitButtonClicked && Object.keys(this.props.registerArtistErrors).length < 1}
            />
          </div>
        :
          null
        }
      </Button>
    ));

    return (
      <div className="content" style={{paddingTop: "50px"}}>
        <Container>
          <Row>
            <Col className="m-auto" md="8">
            <Form className="form">
              <Card className="card-register card-gray">
                <CardHeader>
                  <CardTitle style={{color: "#7248bd", display: "flex", alignItems: "center", justifyContent: "center"}} tag="h4">Artist Info</CardTitle>
                </CardHeader>
                <CardBody>
                <Row>
                  <Col className="m-auto" md="6">
                    <div style={{display: "flex",alignItems: "center", justifyContent: "center",textAlign: "center"}}>
                      <ImageUpload
                        defaultImage={require("../assets/img/default-avatar.png")}
                        uploadedImage={null}
                        addBtnColor="default"
                        changeBtnColor="default"
                        ref={this.ImageUploader}
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col className="m-auto" md="6">
                    <div style={{display: "flex",alignItems: "center", justifyContent: "center",textAlign: "center"}}>
                    {this.state.artistImageState === "has-danger" ? (
                      <label style={{color: "red"}} className="error">
                        {this.state.artistImageError}
                      </label>
                    ) : null}
                    </div>
                  </Col>
                </Row>
                <Col className="m-auto" md="6">
                <FormGroup className={`has-label ${this.state.displayNameState}`}>
                  <label>Display Name *</label>
                  <Input
                    placeholder="(This is what users will see)"
                    type="text"
                    onChange={e => this.onChange(e.target.value)}
                  />
                  {this.state.displayNameState === "has-danger" ? (
                    <label className="error">
                      {this.state.displayNameError}
                    </label>
                  ) : null}
                </FormGroup>
                </Col>
                </CardBody>
                <CardFooter>
                  <SubmitButton/>
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
    registerArtistErrors: state.authentication.registerArtistErrors,
  }
};

const mapDispatchToProps = dispatch => ({
    registerArtist: (name, image, history) => dispatch(registerArtist(name, image, history)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RegisterArtist);
