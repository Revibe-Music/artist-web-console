import React, {Component} from 'react';
import PropTypes from "prop-types";

// reactstrap components
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  Row,
  Col,
} from "reactstrap";
import { FaTimes } from "react-icons/fa";
import validator from 'validator';
import { connect } from 'react-redux';

import TextInput from "components/Inputs/TextInput.jsx";
import Select from "components/Inputs/Select.jsx";


class LinkManager extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedService: "",
      handle: this.props.link ? this.props.link.handle : "",
      fieldState: "",
      fieldError: "",
      description: "",
      descriptionState: "",
      descriptionError: "",
    }

    this.availableStreamingServices = ["spotify", "applemusic", "amazonmusic", "tidal", "soundcloud", "googleplaymusic"]
    this.availableSocialServices = ["facebook", "instagram", "twitter"]

    this.onClose = this.onClose.bind(this)
    this.onAdd = this.onAdd.bind(this)
    this.onSave = this.onSave.bind(this)
    this.onDelete = this.onDelete.bind(this)
    this.onPreview = this.onPreview.bind(this)
    this.onFieldEdited = this.onFieldEdited.bind(this)
  }

  componentDidMount() {
    if(this.props.link) {
      var state = {selectedService: this.props.link.social_media, handle: this.props.link.handle}
      if(this.props.link.description) {
        state.description = this.props.link.description
      }
      this.setState(state)
    }
  }

  componentDidUpdate(prevProps) {
    if(this.props.link) {
      if(prevProps.link !== this.props.link) {
        var state = {selectedService: this.props.link.social_media, handle: this.props.link.handle}
        if(this.props.link.description) {
          state.description = this.props.link.description
        }
        this.setState(state)
      }
    }
  }

  getTitle(service) {
    switch (service) {
      case "applemusic":
        return "Apple Music";
      case "amazonmusic":
        return "Amazon Music";
      case "googleplaymusic":
        return "Google Play Music"
      case "spotify":
        return "Spotify"
      case "soundcloud":
        return "Soundcloud"
      case "tidal":
        return "Tidal"
      case "facebook":
        return "Facebook"
      case "instagram":
        return "Instagram"
      case "twitter":
        return "Twitter"
      default:
        return this._toTitleCase(service)
    }
  }


  _toTitleCase(str) {
      str = str.split('_').join(' ')
      return str.replace(/\w\S*/g, function(txt){
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
  }

  updateDesciption(event) {
    if(event.target.value.length < 1) {
      this.setState({descriptionState: "has-danger", descriptionError: "Must enter description."});
    }
    else {
      this.setState({descriptionState: "has-success:", descriptionError: ""});
    }
    this.setState({description: event.target.value});
  }

  change(event) {
    if(event.target.value.length < 1) {
      this.setState({fieldState: "", fieldError: ""});
    }
    else if(this.availableStreamingServices.includes(this.state.selectedService) || this.availableSocialServices.includes(this.state.selectedService)) {
      if (validator.isURL(event.target.value)) {
        this.setState({fieldState: "has-success", fieldError: ""});
      }
      else {
        this.setState({fieldState: "has-danger", fieldError: "Invalid URL."});
      }
    }
    this.setState({handle: event.target.value});
  };

  onClose() {
    this.setState({selectedService: "", handle: "", description: "", fieldState: "", fieldError: ""})
    this.props.onClose()
  }

  onCancel() {
    this.setState({selectedService: "", handle: "", description: "", fieldState: "", fieldError: ""})
    this.props.onCancel()
  }

  onSave() {
    var handle = this.state.handle.slice()
    if(!handle.includes("https://") && !handle.includes("http://")) {
      var handle = "https://"+handle
    }
    this.props.onSave(this.state.selectedService, handle, this.state.description)
    this.onClose()
  }

  onAdd() {
    var handle = this.state.handle.slice()
    if(!handle.includes("https://") && !handle.includes("http://")) {
      var handle = "https://"+handle
    }
    this.props.onAdd(this.state.selectedService, handle, this.state.description)
    this.onClose()
  }

  onDelete() {
    this.props.onDelete(this.state.selectedService, this.state.handle, this.state.description)
    this.onClose()
  }

  onPreview() {
    if(this.props.onPreview) {
      this.props.onPreview()
    }
  }

  onFieldEdited(fieldName) {
    if(this.props.onFieldEdited) {
      this.props.onFieldEdited(fieldName)
    }
  }

  render() {
    var serviceOptions = this.availableStreamingServices.concat(this.availableSocialServices)
    serviceOptions = serviceOptions.map((value, index) => ({ label: this.getTitle(value), value: value }))
    serviceOptions.push({ label: "Other", value: "other" })
    return (
      <Modal
        isOpen={this.props.show}
        toggle={this.props.toggle}
        modalClassName="modal-grey"
      >
        <ModalHeader cssModule={{'modal-title': 'w-100 text-center'}}>
        <Row>
          <Col md="2">
          <a onClick={this.onClose}>
            <FaTimes style={{fontSize: "20px", color: "white"}} />
          </a>
          </Col>
          <Col md="8">
          <h1 style={{color: "white", textAlign: "center"}}>{this.props.link !== null? `Edit ${this.getTitle(this.props.link.social_media)}` : "Add New Link"}</h1>
          </Col>
          </Row>
        </ModalHeader>
        <ModalBody cssModule={{'modal-body': 'w-100 text-center'}}>
        <Col md="12">
        <Form className="form">
        <Row style={{justifyContent: "center", alignItems: "center"}}>
          <Col xs="10" md="10">
            <Select
              placeholder="Select Service"
              value={this.props.link ? serviceOptions.filter(option => option.value === this.props.link.social_media)[0] : null}
              options={serviceOptions}
              disabled={this.props.link}
              onChange={option => this.setState({selectedService: option.value})}
              onBlur={() => this.onFieldEdited("Service")}
            />
          </Col>
          {this.state.selectedService === "other" ?
            <Col xs="10" md="10" style={{marginTop: "5%"}}>
              <TextInput
                placeholder={"ex: 'Merchandise'"}
                value={this.state.description}
                onChange={e => this.updateDesciption(e)}
                onBlur={() => this.onFieldEdited("Description")}
                errorMessage={this.state.descriptionState === "has-danger" ? this.state.descriptionError : ""}
              />
            </Col>
          :
            null
          }
          <Col xs="10" md="10" style={{marginTop: "5%", paddingRight: 10}}>
            <TextInput
              placeholder={`${this.getTitle(this.state.selectedService)} Share Link`}
              disabled={!this.state.selectedService}
              value={this.state.handle}
              onChange={e => this.change(e)}
              onBlur={() => this.onFieldEdited("URL")}
              errorMessage={this.state.fieldState === "has-danger" ? this.state.fieldError : ""}
            />
            </Col>
            {this.state.handle ?
              <a className="nav-link"
               target="_blank"
               style={{padding: 0, margin:0}}
               href={(!this.state.handle.includes("https://") && !this.state.handle.includes("http://")) ? `https://${this.state.handle}` : this.state.handle}
               onClick={this.onPreview}
              >
                <i style={{color: "#7482BD", padding: 0, margin:0}} className="tim-icons icon-link-72" />
              </a>
            :
              null
            }

          </Row>
        </Form>
        </Col>

        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            onClick={() => {
              if(this.props.link == null) {
                this.onCancel()
              }
              else {
                this.onDelete()
              }
            }}
          >
            {this.props.link == null? "Cancel" : "Delete"}
          </Button>
          <Button
            color="primary"
            onClick={() => {
              if(this.props.link == null) {
                this.onAdd()
              }
              else {
                this.onSave()
              }
            }}
          >
            {this.props.link == null? "Add" : "Save"}
          </Button>
        </ModalFooter>
      </Modal>
    )
  }
}

LinkManager.propTypes = {
  show: PropTypes.bool,
  link: PropTypes.object,
  onCancel: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onAdd: PropTypes.func,
  onDelete: PropTypes.func,
  onFieldEdited: PropTypes.func,
};

LinkManager.defaultProps = {
  show: false,
  link: null,
  service: "",
  handle: "",
};

export default LinkManager
