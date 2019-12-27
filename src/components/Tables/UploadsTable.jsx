/*!

=========================================================
* Black Dashboard PRO React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-pro-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Component, useState } from "react";
import classNames from "classnames";
// react component for creating dynamic tables
import ReactTable from "react-table";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Row,
  Col,
  Button
} from "reactstrap";
import Moment from 'moment'
import { MDBDataTable } from 'mdbreact';
import { FaEllipsisH } from "react-icons/fa";

const momentRandom = require('moment-random');


function randomDate(start, end) {
    return momentRandom(end).format("DD-MM-YYYY")
}

const Options = (props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(prevState => !prevState);

  return (
    <Dropdown
      isOpen={dropdownOpen}
      toggle={toggle}
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

const data = {
  columns: [
    {
      label: 'Album',
      field: 'album',
      sort: 'asc',
    },
    {
      label: 'Contributors',
      field: 'contributors',
      sort: 'asc',
    },
    {
      label: 'Streams',
      field: 'streams',
      sort: 'asc',
    },
    {
      label: 'Uploaded',
      field: 'uploaded',
      sort: 'asc',
    },
    {
      label: '',
      field: 'actions',
      sort: 'disabled',
      filter: 'disabled',
    },

  ],
  rows: [
    // {album: "Accountant", streams:"102", uploaded: randomDate(new Date(2012, 0, 1), new Date()), contributors: "Drake", clickEvent: () => this.handleClick()},
    {album: "Accountant", streams:"102", uploaded: randomDate(new Date(2012, 0, 1), new Date()), contributors: "Drake", actions: <Options />},
    {album: "Chief Executive Officer (CEO)", streams:"102", uploaded: randomDate(new Date(2012, 0, 1), new Date()), contributors: "Drake", actions: <Options />},
    {album: "Junior Technical Author", streams:"102", uploaded: randomDate(new Date(2012, 0, 1), new Date()), contributors: "Drake", actions: <Options />},
    ]
}


class Uploads extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  render() {
    return (
      <Card>
        <CardHeader>
          <CardTitle tag="h4">Uploads</CardTitle>
        </CardHeader>
        <CardBody>
        <MDBDataTable
          entriesOptions={[5, 10, 15, 20, 25]}
          entries={5}
          striped
          data={data}
        />
        </CardBody>
      </Card>
    );
  }
}

export default Uploads;
