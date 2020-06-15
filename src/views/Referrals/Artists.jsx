import React from 'react'

// nodejs library that concatenates classes
import classnames from "classnames";

// reactstrap components
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
  NavItem,
  NavLink,
  Nav,
  TabContent,
  TabPane
} from "reactstrap";

// material-ui components
import { Paper, Chip } from "@material-ui/core"

export default class ArtistsReferrals extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      email: "",
      emailState: "",
      emailError: "",

      emails: []
    }

    this.updateField = this.updateField.bind(this)
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  updateField(target, value) {
    var newState = { ...this.state }

    newState[target + "State"] = target === "email" && this.verifyEmail(value) && !this.state.emails.includes(value) ? "has-success" : "has-danger"
    newState[target] = value

    this.setState(newState)
  }

  verifyEmail(value) {
    var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(value)) {
      return true;
    }
    return false;
  }

  addEmailOnEnter(e) {
    if(e.keyCode === 13) {
      e.preventDefault()

      this.addEmailToList()
    }
  }

  addEmailToList() {
    var emailList = this.state.emails

    if(this.state.emailState === "has-success") {
      emailList.push(this.state.email)
      this.emailInput.value = ""
    }

    this.setState({ ...this.state, email: "", emailState: "", emailError: "", emails: emailList })
  }

  removeEmailFromList(i) {
    var emailList = this.state.emails

    emailList.splice(i, 1)

    this.setState({ ...this.state, emails: emailList })
  }

  render() {
    const isMobile = window.innerWidth < 576

    console.log(this.state)

    return (
      <Container>
        <Row>
          <h1 className="w-100 text-center m-0" style={{ fontSize: "3.25rem" }}>Invite Artists</h1>
        </Row>
        <Row className="d-flex mt-sm">
          <Col md="6" className="ml-auto mr-auto">
            <h3 className="text-white w-100 text-center m-0 mb-2">Invite fellow musicians and earn rewards!</h3>
            <div className="w-100 d-flex">
              <div style={isMobile ? { width: "80%" } : { width: "50%" }} className="d-flex ml-auto mr-2 mt-auto mb-auto">
                <InputGroup
                  className={classnames({
                    "input-group-focus": true
                  }) + ` mb-0 ${this.state.emailState}`}
                >
                  <Input
                    placeholder="Email..."
                    type="text"
                    onChange={e => this.updateField("email", e.target.value)}
                    style={{ borderBottomRightRadius: "0", borderTopRightRadius: "0" }}
                    innerRef={el => this.emailInput = el}
                    onKeyDown={e => this.addEmailOnEnter(e)}
                  />
                </InputGroup>
                <Button
                  className="btn-primary btn-simple referrals-btn"
                  onClick={() => this.addEmailToList()}
                >
                  <i className="fa fa-plus" />
                </Button>
              </div>
              <Button
                className="btn-primary btn-round ml-2 mr-auto"
              >
                <i className="far fa-paper-plane" />
              </Button>
            </div>
            {this.state.emails.length > 0 ? 
              <div style={isMobile ? { width: "80%" } : { width: "75%" }} className="ml-auto mr-auto d-flex">
                <div className="ml-auto mr-auto d-flex justify-content-center flex-wrap">
                  {this.state.emails.map((email, i) => (
                    <Chip 
                      label={email}
                      onDelete={() => this.removeEmailFromList(i)}
                      className="m-1"
                      color="primary"
                      style={{ backgroundColor: "#7248BD" }}
                    />
                  ))}
                </div>
              </div>  
            : null}
            <h5 className="text-light w-100 text-center mt-sm mb-sm">or</h5>
            <h3 className="text-white w-100 text-center m-0 mb-3">Share your link:</h3>
            <div className="w-100 d-flex">
              <h2 className="text-primary ml-auto mr-3 mt-auto mb-auto">Link goes here</h2>
              <Button
                className="ml-2 mr-auto btn-primary btn-round"
              >
                <i className="far fa-copy" />
              </Button>
            </div>
            <div className="w-100 d-flex mt-2">
              <Button
                className="btn-primary btn-icon btn-round ml-auto mr-2"
                color="default"
                size="lg"
              >
                <i className="fab fa-twitter" />
              </Button>
              <Button
                className="btn-primary btn-icon btn-round ml-2 mr-2"
                color="default"
                size="lg"
              >
                <i className="fab fa-facebook" />
              </Button>
              <Button
                className="btn-primary btn-icon btn-round ml-2 mr-auto"
                color="default"
                size="lg"
              >
                <i className="fab fa-instagram" />
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    )
  }
}