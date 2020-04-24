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
          <Link to={`/dashboard/uploads/edit/${this.props.id}`} activeClassName="">
            <DropdownItem>
            Edit
          </DropdownItem>
          </Link>
          <DropdownItem
            onClick={() => this.toggleDeleteWarning()}
          >
          Delete
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <DeleteAlbum show={this.state.showDeleteWarning} toggle={this.toggleDeleteWarning} album_id={this.props.id} />
      </>
    )
  }
}

export default AlbumOptions
