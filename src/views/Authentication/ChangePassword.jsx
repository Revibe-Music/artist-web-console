import React from 'react'

import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Card,
  CardBody,
  Label,
  Button
} from 'reactstrap'
import ClipLoader from "react-spinners/ClipLoader";
import { withRouter, NavLink } from 'react-router-dom';
import { logEvent } from 'amplitude/amplitude';

import RevibeAPI from 'api/revibe.js';

const revibe = new RevibeAPI()

class ChangePassword extends React.Component {
  constructor(props) {
    super(props)

    const { location } = this.props

    this.state = {
      oldPassword: location && location.state && location.state.password ? location.state.password : "",
      oldPassState: "",
      oldPassError: "",
      requireOldPass: !(location && location.state && location.state.password),

      newPassword: "",
      newPassState: "",
      newPassError: "",

      confirmNewPassword: "",
      confNewPassState: "",
      confNewPassError: "",

      showPasswords: false,
      submitButtonClicked: false,

      mustCreateProfile: !(location && location.state && location.state.is_artist)
    }

    this.onChange = this.onChange.bind(this)
  }

  componentWillUnmount() {
    logEvent("Change Password", "Exit")
  }

  onChange(field, value) {
    var newState = { ...this.state }

    newState[field] = value

    this.setState(newState)
  }

  async onSubmit(history) {
    logEvent("Change Password", "New Password Form Submitted")

    var validFields = true

    if(this.state.requireOldPass && this.state.oldPassword === "") {
      validFields = false
      this.setState({
        ...this.state,
        oldPassState: "has-danger",
        oldPassError: "The old password is required!"
       });
       logEvent("Change Password", "New Password Form Field Error")
    }

    if(this.state.newPassword === "") {
      validFields = false
      this.setState({
        ...this.state,
        newPassState: "has-danger",
        newPassError: "The new password is required!"
       });
       logEvent("Change Password", "New Password Form Field Error")
    }

    if(this.state.confirmNewPassword === "") {
      validFields = false
      this.setState({
        ...this.state,
        confNewPassState: "has-danger",
        confNewPassError: "Confirm the new password!"
       });
       logEvent("Change Password", "New Password Form Field Error")
    }

    if(this.state.newPassword !== this.state.confirmNewPassword) {
      validFields = false
      this.setState({
        ...this.state,
        newPassState: "has-danger",
        confNewPassState: "has-danger",
        confNewPassError: "The new password fields do not match."
       });
       logEvent("Change Password", "New Password Form Field Error")
    }

    if(validFields) {
      this.setState({ ...this.state, submitButtonClicked: true })

      var res = await revibe.changePassword(this.state.oldPassword, this.state.newPassword, this.state.confirmNewPassword)

      if(String(res.status).charAt(0) == "2") {
        history.push((this.state.requireOldPass || !this.state.mustCreateProfile ? '/dashboard' : '/account/create-profile'))
        logEvent("Change Password", "New Password Form Submission Success")
      }
      else if(String(res.status).charAt(0) == "4") {
        this.setState({
          ...this.state,
          oldPassState: "has-danger",
          oldPassError: "The old password entered is incorrect!",
          submitButtonClicked: false
        })
        logEvent("Change Password", "New Password Form Submission Failure")
      }
      else {
        this.setState({
          ...this.state,
          oldPassState: "has-danger",
          newPassState: "has-danger",
          confNewPassState: "has-danger",
          confNewPassError: "An external error occurred!",
          submitButtonClicked: false
        })
        logEvent("Change Password", "New Password Form Submission Failure")
      }
    }
  }

  render() {
    const SubmitButton = withRouter(({ history }) => (
      <Button
        className="btn-round btn-primary w-100"
        onClick={() => this.onSubmit(history)}
        size="md"
        type="submit"
        disabled={this.state.submitButtonClicked}
      >
        <h4 className="mt-auto mb-auto">Change Password</h4>
      </Button>
    ));

    const BackButton = withRouter(({ history }) => (
        <div
          onClick={() => {
            history.goBack()
            logEvent("Change Password", "Back Button Clicked")
          }}
          style={{cursor: 'pointer', backgroundColor: "#7248BD", width: "3.5rem", height: "3.5rem", borderRadius: "1.75rem", display: "flex", justifyContent: "center", alignItems: "center"}}>
          <i style={{color: "white", fontSize: "1.5rem", marginRight: ".25rem"}} className="tim-icons icon-minimal-left" />
        </div>
    ));

    return (
      <div className="content">
        <Container className="mt-lg">
          <BackButton />
          <Row>
            <Col md="8" sm="12" className="ml-auto mr-auto">
              <Form className="form">
                <Card className="card-login card-gray">
                  <Container>
                    <Row>
                      <Col md="8" sm="12" className="ml-auto mr-auto">
                        <div className="w-100 mt-md mb-sm">
                          <h2 className="mt-0 mb-2 w-50">Change Password</h2>
                          <p className="w-100">
                            {this.state.requireOldPass ?
                              <>
                                Enter in your old password and the new password you would like to use.
                              </>
                            :
                              "Looks like you requested a password change! Enter in the new password you would like to use."
                            }
                          </p>
                        </div>
                        {this.state.requireOldPass ? <div>
                          <FormGroup className={`has-label ${this.state.oldPassState}`}>
                            <label>Old Password *</label>
                            <Input
                              id="oldPassword"
                              name="oldPassword"
                              type={!this.state.showPasswords ? "password" : "text"}
                              onChange={e => this.onChange("oldPassword", e.target.value)}
                            />
                            {this.state.oldPassState === "has-danger" && this.state.oldPassError ? (
                              <label className="error">
                                {this.state.oldPassError}
                              </label>
                            ) : null}
                          </FormGroup>
                        </div> : null}
                        <div>
                          <FormGroup className={`has-label ${this.state.newPassState}`}>
                            <label>New Password *</label>
                            <Input
                              id="newPassword"
                              name="newPassword"
                              type={!this.state.showPasswords ? "password" : "text"}
                              onChange={e => this.onChange("newPassword", e.target.value)}
                            />
                            {this.state.newPassState === "has-danger" && this.state.newPassError ? (
                              <label className="error">
                                {this.state.newPassError}
                              </label>
                            ) : null}
                          </FormGroup>
                        </div>
                        <div>
                          <FormGroup className={`has-label ${this.state.confNewPassState}`}>
                            <label>Confirm New Password *</label>
                            <Input
                              id="confirmNewPassword"
                              name="confirmNewPassword"
                              type={!this.state.showPasswords ? "password" : "text"}
                              onChange={e => this.onChange("confirmNewPassword", e.target.value)}
                            />
                            {this.state.confNewPassState === "has-danger" && this.state.confNewPassError ? (
                              <label className="error">
                                {this.state.confNewPassError}
                              </label>
                            ) : null}
                          </FormGroup>
                        </div>
                        <FormGroup
                          check
                          className={`text-left`}
                        >
                          <Label check>
                            <Input
                              type="checkbox"
                              onClick= {event => this.setState({ ...this.state, showPasswords: event.target.checked })}
                            />
                            <span className="form-check-sign" />Show Password
                          </Label>
                        </FormGroup>
                        <div className="ml-auto mr-auto mt-3 mb-sm" style={{ width: "75%" }}>
                          <SubmitButton />
                        </div>
                      </Col>
                    </Row>
                  </Container>
                </Card>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

export default ChangePassword
