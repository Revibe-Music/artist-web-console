import React, {Component} from 'react';
import PropTypes from "prop-types";

// reactstrap components
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { connect } from 'react-redux';


class ContributionWarning extends Component {

  constructor() {
    super();
    this.state = {
      showMoreInfo: false
    }
    this.onClose = this.onClose.bind(this)
    this.onIgnore = this.onIgnore.bind(this)
    this.generateMessage = this.generateMessage.bind(this)
  }

  onClose() {
    this.setState({showMoreInfo: false})
    this.props.onClose()
  }

  onIgnore() {
    this.setState({showMoreInfo: false})
    this.props.onIgnore()
  }

  generateMessage() {
    var message = "It appears someone else contributed "
    if(this.props.objectType === "album") {
      message += "on this album. "
    }
    else {
      message += `on ${this.props.occurances} of your songs. `
    }
    message += "Make sure to give them credit by tagging them as a contributor!"
    return message
  }

  render() {
    return (
      <Modal
        isOpen={this.props.show}
        toggle={this.props.toggle}
        modalClassName="modal-grey"
      >
        <ModalHeader cssModule={{'modal-title': 'w-100 text-center'}}>
          <h1 style={{color: "red"}}>Just a second!</h1>
        </ModalHeader>
        <ModalBody cssModule={{'modal-body': 'w-100 text-center'}}>
          <h3>{this.generateMessage()}</h3>
          {/*<h3 style={{textDecorationLine: 'underline', color: "#7248BD"}} onClick={() => this.setState({showMoreInfo: true})}>Learn More</h3>*/}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={this.onIgnore}>Don't give credit.</Button>
          <Button color="primary" onClick={this.onClose}>Okay, I'll tag them!</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

ContributionWarning.propTypes = {
  show: PropTypes.bool,
  objectType: PropTypes.string,      // album or song
  occurances: PropTypes.number,      // number of songs that should be warned about
  onClose: PropTypes.func.isRequired,
  onIgnore: PropTypes.func.isRequired,

};

ContributionWarning.defaultProps = {
  show: false,
  objectType: "song",
  occurances: 1,
};

export default ContributionWarning
