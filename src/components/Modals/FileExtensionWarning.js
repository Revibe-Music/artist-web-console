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


class FileExtensionWarning extends Component {

  constructor(props) {
    super(props);
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
          <h3>It appears that you may have forgotten to remove the file extension from {this.props.occurances} {this.props.occurances > 1 ? "songs" : "song"}.</h3>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={this.props.onIgnore}>Ignore</Button>
          <Button color="primary" onClick={this.props.onClose}>Remove {this.props.occurances > 1 ? "them" : "it"} for me!</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

FileExtensionWarning.propTypes = {
  show: PropTypes.bool,
  occurances: PropTypes.number,      // album or song
  onClose: PropTypes.func.isRequired,
  onIgnore: PropTypes.func.isRequired,
};

FileExtensionWarning.defaultProps = {
  show: false,
};

export default FileExtensionWarning
