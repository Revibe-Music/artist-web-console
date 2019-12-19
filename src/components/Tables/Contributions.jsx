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
import { MDBDataTable, MDBBtn } from 'mdbreact';

const momentRandom = require('moment-random');


function randomDate(start, end) {
    return momentRandom(end).format("DD-MM-YYYY")
}


const NewButton = () => (<div>
                  <Button
                      onClick={() => {
                        console.log("Accepted");
                      }}
                      color="success"
                      size="sm"
                      className="btn-icon btn-link like"
                    >
                      <i className="tim-icons icon-check-2" />
                    </Button>
                    <Button
                      onClick={() => {
                        console.log("Declined");
                      }}
                      color="danger"
                      size="sm"
                      className="btn-icon btn-link like"
                    >
                      <i className="tim-icons icon-simple-remove" />
                    </Button>
                  </div>)
const data = {
  columns: [
    {
      label: 'Name',
      field: 'name',
      sort: 'asc',
      width: 150
    },
    {
      label: 'Album',
      field: 'album',
      sort: 'asc',
      width: 100
    },
    {
      label: 'Streams',
      field: 'streams',
      sort: 'asc',
      width: 75
    },
    {
      label: 'Uploaded',
      field: 'uploaded',
      sort: 'asc',
      width: 100
    },
    {
      label: 'Contribution Type',
      field: 'contributionType',
      sort: 'asc',
      width: 150
    },
  ],
  rows: [
    {name: "Airi Satou", album: "Accountant", streams:"102", uploaded: randomDate(new Date(2012, 0, 1), new Date()), contributionType: "Feature"},
    {name: "Angelica Ramos", album: "Chief Executive Officer (CEO)", streams:"102", uploaded: randomDate(new Date(2012, 0, 1), new Date()), contributionType: "Feature"},
    {name: "Ashton Cox", album: "Junior Technical Author", streams:"102", uploaded: randomDate(new Date(2012, 0, 1), new Date()), contributionType: "Producer"},
    {name: "Bradley Greer", album: "Software Engineer", streams:"102", uploaded: randomDate(new Date(2012, 0, 1), new Date()), contributionType: "Feature"},
    {name: "Brenden Wagner", album: "Software Engineer", streams:"102", uploaded: randomDate(new Date(2012, 0, 1), new Date()), contributionType: "Producer"},
    {name: "Brielle Williamson", album: "Integration Specialist", streams:"102", uploaded: randomDate(new Date(2012, 0, 1), new Date()), contributionType: "Producer"},
    {name: "Caesar Vance", album: "Pre-Sales Support", streams:"102", uploaded: randomDate(new Date(2012, 0, 1), new Date()), contributionType: "Producer"},
    {name: "Cedric Kelly", album: "Senior Javascript Developer", streams:"102", uploaded: randomDate(new Date(2012, 0, 1), new Date()), contributionType: "Feature"},
  ]
}


class Contributions extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  render() {
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

export default Contributions;
