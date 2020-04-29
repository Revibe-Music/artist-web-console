import React, { Component, useState } from "react";
import classNames from "classnames";
// react component for creating dynamic tables
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Row,
  Col,
  Button
} from "reactstrap";
import { FaEllipsisH } from "react-icons/fa";
import DeleteAlbum from "components/Modals/DeleteAlbum.js";

class AlbumOptions extends Component {

  constructor(props) {
    super(props)
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
  }


  render() {
    console.log(window.screen.width);
    return (
      <>
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
            {/*<DropdownItem
              onClick={() => this.props.edit(this.props.id)}
            >
            Edit
            </DropdownItem>*/}
            <DropdownItem
              onClick={() => this.toggleDeleteWarning()}
            >
            Delete
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      :
        <Row>
          <a onClick={() => this.toggleDeleteWarning()} style={{cursor: "pointer"}}>
            <h3 style={{color: "#7248BD"}}>Edit</h3>
          </a>
          <h3 style={{color: "#7248BD", marginLeft: "5px", marginRight: "5px"}}> | </h3>
          <a onClick={() => this.toggleDeleteWarning()} style={{cursor: "pointer"}}>
            <h3 style={{color: "#7248BD"}}> Delete</h3>
          </a>

        </Row>
      }


      <DeleteAlbum show={this.state.showDeleteWarning} toggle={this.toggleDeleteWarning} album_id={this.props.id} />
      </>
    )
  }
}

export default AlbumOptions
