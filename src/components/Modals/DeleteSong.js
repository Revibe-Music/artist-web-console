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
import { deleteSong } from 'redux/media/actions.js'


class DeleteSong extends Component {

  constructor() {
    super();
    this.deleteButtonPressed = this.deleteButtonPressed.bind(this)
    this.cancelButtonPressed = this.cancelButtonPressed.bind(this)
  }

  deleteButtonPressed() {
    console.log(this.props.song_id);
    this.props.deleteSong(this.props.song_id)
    this.props.toggle()
  }

  cancelButtonPressed() {
    this.props.toggle()
  }

  render() {
    return (
      <Modal
        isOpen={this.props.show}
        toggle={this.props.toggle}
        modalClassName="modal-grey"
      >
        <ModalHeader cssModule={{'modal-title': 'w-100 text-center'}}>
          <h1 style={{color: "red"}}>Are You Sure?</h1>
        </ModalHeader>
        <ModalBody cssModule={{'modal-body': 'w-100 text-center'}}>
          <h3>Deleting a song is a permanent action that cannot be undone.</h3>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.deleteButtonPressed}>Delete</Button>
          <Button color="danger" onClick={this.cancelButtonPressed}>Cancel</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

DeleteSong.propTypes = {
  show: PropTypes.bool,
  toggle: PropTypes.func.isRequired,
  song_id: PropTypes.string
};

DeleteSong.defaultProps = {
  show: false,
};

const mapDispatchToProps = dispatch => ({
    deleteSong: (song_id) => dispatch(deleteSong(song_id)),
});

export default connect(null, mapDispatchToProps)(DeleteSong);
