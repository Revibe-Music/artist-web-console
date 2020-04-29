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
import { Link, NavLink } from 'react-router-dom'
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
            <NavLink to={`/dashboard/uploads/edit/${this.props.id}`}>
              <DropdownItem>
              Edit
              </DropdownItem>
            </NavLink>
            <DropdownItem
              onClick={() => this.toggleDeleteWarning()}
            >
            Delete
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      :
        <Row>
          <NavLink to={`/dashboard/uploads/edit/${this.props.id}`}>
            <h4 style={{color: "#7248BD"}}>Edit</h4>
          </NavLink>
          <h4 style={{color: "white", marginLeft: "5px", marginRight: "5px"}}> | </h4>
          <a onClick={() => this.toggleDeleteWarning()} style={{cursor: "pointer"}}>
            <h4 style={{color: "#7248BD"}}> Delete</h4>
          </a>

        </Row>
      }

      <DeleteAlbum show={this.state.showDeleteWarning} toggle={this.toggleDeleteWarning} album_id={this.props.id} />
      </>
    )
  }
}

export default AlbumOptions
