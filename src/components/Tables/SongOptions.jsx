import React, { Component, useState } from "react";
import classNames from "classnames";
// react component for creating dynamic tables
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { FaEllipsisH } from "react-icons/fa";
import DeleteSong from "components/Modals/DeleteSong.js";

class SongOptions extends Component {

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
      <DeleteSong show={this.state.showDeleteWarning} toggle={this.toggleDeleteWarning} song_id={this.props.id} />
      </>
    )
  }
}

export default SongOptions
