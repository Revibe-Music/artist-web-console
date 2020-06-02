import React, {Component} from 'react';
import classNames from "classnames";
import PropTypes from "prop-types";

import Image from 'react-graceful-image';
import moment from 'moment'
import ReactTooltip from 'react-tooltip';
import {
  Card,
  CardBody,
  Form,
  FormGroup,
  Row,
  Col,
  UncontrolledTooltip,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { MdErrorOutline } from 'react-icons/md';
import { Link, NavLink } from 'react-router-dom'
import { FaEllipsisH } from "react-icons/fa";

import DeleteAlbum from "components/Modals/DeleteAlbum.js";
import TextInput from "components/Inputs/TextInput.jsx";
import Select from "components/Inputs/Select.jsx";
import ImageUpload from "components/ImageUpload/ImageUpload.jsx";
import ContributorTags from "components/Inputs/ContributorTags.jsx";
import { logEvent } from 'amplitude/amplitude';


class AlbumCard extends Component {

  constructor(props) {
      super(props);
      this.state = {
        dropdownOpen: false,
        showDeleteWarning: false
      }
      this.toggleDropdown = this.toggleDropdown.bind(this)
      this.toggleDeleteWarning = this.toggleDeleteWarning.bind(this)
    }

  toggleDropdown() {
    this.setState({dropdownOpen: !this.state.dropdownOpen})
  }

  toggleDeleteWarning() {
    this.setState({showDeleteWarning: !this.state.showDeleteWarning})
    logEvent("Uploads", "Click Delete")
  }

  render() {
    return (
      <>
      <Card>
        <CardBody>
          <Row style={{alignItems: "center", margin: "auto"}}>
            <Image
              src={this.props.album.images.length > 0 ? this.props.album.images[1] : null}
              width='15%'
              height='15%'
              alt='My awesome image'
              retry={{ count: 15, delay: 1}}
            />
          <div style={{marginLeft: "5%", width: "80%"}}>
            <Row style={{width: "100%", alignItems: "center", justifyContent: "space-between"}}>
                <h3 style={{color: "white", marginBottom: "20px", marginLeft: "2%"}}>{this.props.album.name}</h3>
                <h4 style={{color: "white", marginBottom: "20px"}}>{this.props.album.type}</h4>
            </Row>

            <Row>
              <Col xs="12" md="6">
                <Row style={{margin: "auto"}}>
                <h4 style={{color: "white",marginBottom: "auto", marginRight: 10}}>Contributors: </h4>
                {this.props.album.contributors.map(x => (
                  <div style={{backgroundColor: "#7248BD", borderRadius: 15, paddingLeft:10, paddingRight: 10, alignItems: "center", justifyContent: "center", display: "flex", width: "fit-content"}}>
                    <p style={{color:"white", marginBottom: 0 }}>{x.artist.artistName}</p>
                  </div>
                ))}
              </Row>
              </Col>
            </Row>

            <Row style={{alignItems: "center",marginTop: "20px"}}>
              <Col xs="12" md="6">
                <h4 style={{color: "white"}}>Released: {moment(this.props.album.uploadDate).format("MM/DD/YYYY HH:mm")}</h4>
              </Col>
            </Row>

            <Row style={{alignItems: "center", margin: "auto", marginTop: "15px"}}>
              <i style={{color: "#7248BD", fontSize: "1.5rem", marginRight: "10px"}} className="tim-icons icon-headphones" />
              <h4 style={{color: "white", marginBottom: 0}}>{this.props.album.totalStreams}</h4>
            </Row>

            <a
              aria-expanded={this.props.isExpanded}
              data-parent="#accordion"
              data-toggle="collapse"
              style={{cursor: "pointer",position: "absolute", right: "5%", bottom: "2%", color: "#7248BD", fontSize: "1.5rem"}}
              onClick={e => {
                this.props.onExpand(e)
                logEvent("Uploads", "Toggle Songs")
              }}
            >
              {this.props.isExpanded ?
                <i className="tim-icons icon-minimal-up" />
              :
                <i className="tim-icons icon-minimal-down" />
              }
            </a>
          </div>
          <div style={{position: "absolute", right: "5%", top: "45%"}}>
            {window.screen.width < 400 ?
              <Dropdown
                isOpen={this.state.dropdownOpen}
                toggle={this.toggleDropdown}
                direction="left"
              >
               <DropdownToggle tag="div">
                <FaEllipsisH />
              </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem header>Actions</DropdownItem>
                  {/*<NavLink to={`/dashboard/uploads/edit/${this.props.id}`}>
                    <DropdownItem>
                    Edit
                    </DropdownItem>
                  </NavLink>*/}
                  <DropdownItem
                    onClick={() => this.toggleDeleteWarning()}
                  >
                  Delete
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            :
              <Row>
                {/*<NavLink to={`/dashboard/uploads/edit/${this.props.id}`}>
                  <h4 style={{color: "#7248BD"}}>Edit</h4>
                </NavLink>
                <h4 style={{color: "white", marginLeft: "5px", marginRight: "5px"}}> | </h4>*/}
                <a onClick={() => this.toggleDeleteWarning()} style={{cursor: "pointer"}}>
                  <h4 style={{color: "#7248BD"}}> Delete</h4>
                </a>

              </Row>
            }
          </div>
        </Row>
      </CardBody>
    </Card>
    <DeleteAlbum show={this.state.showDeleteWarning} toggle={this.toggleDeleteWarning} album_id={this.props.album.id} />
    </>
    );
  }
}

AlbumCard.propTypes = {
  album: PropTypes.object.isRequired,                      // represents current user and is needed in order to exclude form search results
  onExpand: PropTypes.func,               // function that is called whenever edit button is clicked
  isExpanded: PropTypes.bool
};


export default AlbumCard
