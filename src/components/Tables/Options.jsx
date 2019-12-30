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

class Options extends Component {

  constructor(props) {
    super(props)
    this.state = {
      dropdownOpen: false,
    }
    this.toggleDropdown = this.toggleDropdown.bind(this)
  }

  toggleDropdown() {
    this.setState({dropdownOpen: !this.state.dropdownOpen})
  }

  render() {
    return (
      <Dropdown
        isOpen={this.state.dropdownOpen}
        toggle={this.toggleDropdown}
        direction="left"
      >
       <DropdownToggle tag="div">
        <FaEllipsisH />
      </DropdownToggle>
        <DropdownMenu>
          <DropdownItem header>Actions</DropdownItem>
          <DropdownItem>Edit</DropdownItem>
          <DropdownItem>Stats</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    )
  }
}

export default Options;
