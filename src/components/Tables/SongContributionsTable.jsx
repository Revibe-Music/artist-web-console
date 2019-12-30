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
  Row,
  Col,
  Button
} from "reactstrap";
import Moment from 'moment'
import { MDBDataTable, MDBBtn } from 'mdbreact';

import Options from 'components/Tables/Options.jsx'
import { songContributionColumns } from 'components/Tables/ColumnConfig.js'

const momentRandom = require('moment-random');

function randomDate(start, end) {
    return momentRandom(end).format("DD-MM-YYYY")
}




const rows = [
    {name: "Airi Satou", album: "Accountant", uploadedBy:"Travis Scott", uploaded: randomDate(new Date(2012, 0, 1), new Date()), contributionType: "Feature", actions: <Options />},
    {name: "Angelica Ramos", album: "Chief Executive Officer (CEO)", uploadedBy:"Travis Scott", uploaded: randomDate(new Date(2012, 0, 1), new Date()), contributionType: "Feature", actions: <Options />},
    {name: "Ashton Cox", album: "Junior Technical Author", uploadedBy:"Travis Scott", uploaded: randomDate(new Date(2012, 0, 1), new Date()), contributionType: "Producer", actions: <Options />},
  ]



class SongContributionsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  render() {
    var data = {columns: songContributionColumns, rows: rows}
    return (
        <Card>
          <CardHeader>
            <CardTitle tag="h4">Contributions</CardTitle>
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

export default SongContributionsTable;
