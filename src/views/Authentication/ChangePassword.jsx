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
import { withRouter } from 'react-router-dom';
import ClipLoader from "react-spinners/ClipLoader";

import RevibeAPI from 'api/revibe.js';

const revibe = new RevibeAPI()

class ChangePassword extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      newPassword: "",
      newPassState: false,
      newPassError: "",

      confirmNewPassword: "",
      confNewPassState: false,
      confNewPassError: "",

      showPasswords: false
    }

    this.onChange = this.onChange.bind(this)
  }

  onChange(field, value) {
    var newState = { ...this.state }

    newState[field] = value

    this.setState(newState)
  }

  onSubmit(history) {

  }

  render() {
    const SubmitButton = withRouter(({ history }) => (
      <Button
        className="btn-round btn-primary w-100"
        onClick={() => this.onSubmit(history)}
        size="md"
        type="submit"
      >
        <h4 className="mt-auto mb-auto">Change Password</h4>
      </Button>
    ));

    return (
      <div className="content">
        <Container className="mt-lg">
          <Row>
            <Col md="8" sm="12" className="ml-auto mr-auto">
              <Form className="form">
                <Card className="card-login card-gray">
                  <Container>
                    <Row>
                      <Col md="8" sm="12" className="ml-auto mr-auto">
                        <div className="w-100 mt-md mb-sm">
                          <h2 className="mt-0 mb-0 w-50">Change Password</h2>
                          
                        </div>
                        <div>
                          <FormGroup className={`has-label ${this.state.newPassState}`}>
                            <label>New Password *</label>
                            <Input
                              id="newPassword"
                              name="newPassword"
                              type={!this.state.showPasswords ? "password" : "text"}
                              onChange={e => this.onChange("newPassword", e.target.value)}
                            />
                            {this.state.newPassState === "has-danger" ? (
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
                            {this.state.confNewPassState === "has-danger" ? (
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