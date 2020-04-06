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
  FormGroup,
  Input,
  InputGroup,
  Row,
  Col,
} from "reactstrap";
import Select from "react-select";
import { FaTimes } from "react-icons/fa";

import validator from 'validator';

import { connect } from 'react-redux';


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

    this.availableStreamingServices = ["spotify", "apple_music", "amazon_music", "tidal", "soundcloud", "google_play_music"]
    this.availableSocialServices = ["facebook", "instagram", "twitter"]

    this.onClose = this.onClose.bind(this)
    this.onAdd = this.onAdd.bind(this)
    this.onSave = this.onSave.bind(this)
    this.onDelete = this.onDelete.bind(this)
  }

  componentDidMount() {
    if(this.props.link) {
      this.setState({selectedService: this.props.link.social_media, handle: this.props.link.handle})
    }
  }

  componentDidUpdate(prevProps) {
    if(this.props.link) {
      if(prevProps.link !== this.props.link) {
        console.log();
        this.setState({selectedService: this.props.link.social_media, handle: this.props.link.handle})
      }
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

  onSave() {
    this.props.onSave(this.state.selectedService, this.state.handle, this.state.description)
    this.onClose()
  }

  onAdd() {
    this.props.onAdd(this.state.selectedService, this.state.handle, this.state.description)
    this.onClose()
  }

  onDelete() {
    this.props.onDelete(this.state.selectedService, this.state.handle, this.state.description)
    this.onClose()
  }

  render() {
    var serviceOptions = this.availableStreamingServices.concat(this.availableSocialServices)
    serviceOptions = serviceOptions.map((value, index) => ({ label: this._toTitleCase(value), value: value }))
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
          <h1 style={{color: "white", textAlign: "center"}}>{this.props.link !== null? `Edit ${this._toTitleCase(this.props.link.social_media)}` : "Add New Link"}</h1>
          </Col>
          </Row>
        </ModalHeader>
        <ModalBody cssModule={{'modal-body': 'w-100 text-center'}}>
        <Col md="12">
        <Form className="form">
        <Row style={{justifyContent: "center", alignItems: "center"}}>
          <Col xs="10" md="10">
            <Select
              className="react-select"
              classNamePrefix="react-select"
              placeholder="Select Service"
              closeMenuOnSelect={true}
              isMulti={false}
              isDisabled={this.props.link}
              defaultValue={this.props.link ? serviceOptions.filter(option => option.value === this.props.link.social_media)[0] : null}
              onChange={option => this.setState({selectedService: option.value})}
              options={serviceOptions}
            />
          </Col>
          {this.state.selectedService === "other" ?
            <Col xs="10" md="10" style={{marginTop: "5%"}}>
              <FormGroup className={`has-label ${this.state.descriptionState}`}>
                <Input
                  type="text"
                  placeholder={"Link Description ex: 'Merchandise'"}
                  onChange={e => this.updateDesciption(e)}
                />
                {this.state.descriptionState === "has-danger" ? (
                  <label className="error">
                    {this.state.descriptionError}
                  </label>
                ) : null}
              </FormGroup>
            </Col>
          :
            null
          }
          <Col xs="10" md="10" style={{marginTop: "5%", paddingRight: 10}}>
            <FormGroup className={`has-label ${this.state.fieldState}`}>
              <Input
                disabled={!this.state.selectedService}
                defaultValue={this.state.handle}
                type="text"
                placeholder={`${this._toTitleCase(this.state.selectedService)} Share Link`}
                onChange={e => this.change(e)}
              />
              {this.state.fieldState === "has-danger" ? (
                <label className="error">
                  {this.state.fieldError}
                </label>
              ) : null}
            </FormGroup>
            </Col>
            {this.state.handle ?
              <a className="nav-link"
                 target="_blank"
                 style={{padding: 0, margin:0}}
                 href={this.state.handle}>
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
                this.onClose()
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
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onAdd: PropTypes.func,
  onDelete: PropTypes.func,
};

LinkManager.defaultProps = {
  show: false,
  link: null,
  service: "",
  handle: "",
};

export default LinkManager
