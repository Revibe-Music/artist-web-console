import React, {Component} from 'react';
import PropTypes from "prop-types";

// reactstrap components
import {
  FormGroup,
  Button,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  UncontrolledTooltip
} from "reactstrap";
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import NotificationAlert from "react-notification-alert";
import RevibeAPI from 'api/revibe.js';

const revibe = new RevibeAPI()

class InviteArtist extends Component {

  constructor() {
      super();
      this.state = {
        email: "",
        emailState: "",
        emailError: "",
      };

      this.sendInvite = this.sendInvite.bind(this)
      this.modalSendButtonPressed = this.modalSendButtonPressed.bind(this)
      this.modalCancelButtonPressed = this.modalCancelButtonPressed.bind(this)
  }

  modalSendButtonPressed() {
    this.sendInvite()
    this.props.toggle()
    this.setState({"emailState": "","emailError": ""});
  }

  modalCancelButtonPressed() {
    this.props.toggle()
    this.setState({"emailState": "","emailError": ""});
  }

  // function that returns true if value is email, false otherwise
  verifyEmail(value) {
    var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(value)) {
      return true;
    }
    return false;
  }

  change(event, stateName, type) {
    switch (type) {
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
      default:
        break;
    }
    this.setState({ [stateName]: event.target.value });
  };


  async sendInvite() {
    var options = {
      place: "tr",
      icon: "tim-icons icon-email-85",
      autoDismiss: 5
    };
    const response = await revibe.sendInvitation({"type": "artist_invite","to": [this.state.email],"artist": true})
    if(response.status === 200) {
      options.message = "Invite successfully sent."
      options.type = "primary"
    }
    else {
      options.message = "Invite was unable to be sent."
      options.type = "danger"
    }
    this.refs.notificationAlert.notificationAlert(options);
  };


  render() {
    return (
      <>
      <div className="rna-container">
        <NotificationAlert ref="notificationAlert" />
      </div>
        <Modal
          isOpen={this.props.show}
          toggle={this.props.toggle}
          modalClassName="modal-grey"
        >
          <ModalHeader>
            Invite Arists to Join Revibe
          </ModalHeader>
          <ModalBody>
            <FormGroup className={`has-label ${this.state.emailState}`}>
              <label>Email Address</label>
              <Input
                placeholder="ex: music@artist.com"
                type="email"
                onChange={e => this.change(e, "email", "email")}
              />
              {this.state.emailState === "has-danger" ? (
                <label className="error">
                  {this.state.emailError}
                </label>
              ) : null}
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" disabled={this.state.emailState!=="has-success"} onClick={this.modalSendButtonPressed}>Send</Button>
            <Button color="danger" onClick={this.modalCancelButtonPressed}>Cancel</Button>
          </ModalFooter>
          <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
            <p style={{fontSize: "10px"}}>*Invited artists must create a Revibe account before they can be tagged as a contributor.</p>
          </div>
        </Modal>
      </>
    )
  }
}

InviteArtist.propTypes = {
  show: PropTypes.bool,
  toggle: PropTypes.func.isRequired
};

InviteArtist.defaultProps = {
  show: false,
};

export default InviteArtist
