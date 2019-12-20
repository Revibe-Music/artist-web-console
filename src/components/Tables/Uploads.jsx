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
import React, { Component } from "react";
import classNames from "classnames";
// react component for creating dynamic tables
import ReactTable from "react-table";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
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
    {album: "Accountant", streams:"102", uploaded: randomDate(new Date(2012, 0, 1), new Date()), contributors: "Drake", actions: <FaEllipsisH />},
    {album: "Chief Executive Officer (CEO)", streams:"102", uploaded: randomDate(new Date(2012, 0, 1), new Date()), contributors: "Drake", actions: <FaEllipsisH />},
    {album: "Junior Technical Author", streams:"102", uploaded: randomDate(new Date(2012, 0, 1), new Date()), contributors: "Drake", actions: <FaEllipsisH />},
    {album: "Software Engineer", streams:"102", uploaded: randomDate(new Date(2012, 0, 1), new Date()), contributors: "Drake", actions: <FaEllipsisH />},
    {album: "Software Engineer", streams:"102", uploaded: randomDate(new Date(2012, 0, 1), new Date()), contributors: "Drake", actions: <FaEllipsisH />},
    {album: "Integration Specialist", streams:"102", uploaded: randomDate(new Date(2012, 0, 1), new Date()), contributors: "Drake", actions: <FaEllipsisH />},
    {album: "Pre-Sales Support", streams:"102", uploaded: randomDate(new Date(2012, 0, 1), new Date()), contributors: "Drake", actions: <FaEllipsisH />},
    {album: "Senior Javascript Developer", streams:"102", uploaded: randomDate(new Date(2012, 0, 1), new Date()), contributors: "Drake", actions: <FaEllipsisH />},
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
          responsive
          striped
          data={data}
        />
        </CardBody>
      </Card>
    );
  }
}

export default Uploads;
