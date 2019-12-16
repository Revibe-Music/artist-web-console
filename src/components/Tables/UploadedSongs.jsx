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

const momentRandom = require('moment-random');


function randomDate(start, end) {
    return momentRandom(end).format("DD-MM-YYYY")
}
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
      label: 'Contributors',
      field: 'contributors',
      sort: 'asc',
      width: 150
    },
  ],
  rows: [
    {name: "Airi Satou", album: "Accountant", streams:"102", uploaded: randomDate(new Date(2012, 0, 1), new Date()), contributors: "Drake"},
    {name: "Angelica Ramos", album: "Chief Executive Officer (CEO)", streams:"102", uploaded: randomDate(new Date(2012, 0, 1), new Date()), contributors: "Drake"},
    {name: "Ashton Cox", album: "Junior Technical Author", streams:"102", uploaded: randomDate(new Date(2012, 0, 1), new Date()), contributors: "Drake"},
    {name: "Bradley Greer", album: "Software Engineer", streams:"102", uploaded: randomDate(new Date(2012, 0, 1), new Date()), contributors: "Drake"},
    {name: "Brenden Wagner", album: "Software Engineer", streams:"102", uploaded: randomDate(new Date(2012, 0, 1), new Date()), contributors: "Drake"},
    {name: "Brielle Williamson", album: "Integration Specialist", streams:"102", uploaded: randomDate(new Date(2012, 0, 1), new Date()), contributors: "Drake"},
    {name: "Caesar Vance", album: "Pre-Sales Support", streams:"102", uploaded: randomDate(new Date(2012, 0, 1), new Date()), contributors: "Drake"},
    {name: "Cedric Kelly", album: "Senior Javascript Developer", streams:"102", uploaded: randomDate(new Date(2012, 0, 1), new Date()), contributors: "Drake"},
  ]
}


class UploadedSongs extends Component {
  constructor(props) {
    super(props);
    this.state = {
    //   data: dataTable.map((prop, key) => {
    //     return {
    //       id: key,
    //       name: prop[0],
    //       album: prop[1],
    //       streams: prop[2],
    //       uploaded: prop[3],
    //       contributors: prop[4],
    //       actions: (
    //         // we've added some custom button actions
    //         <div className="actions-right">
    //           {/* use this button to add a like kind of action */}
    //           <Button
    //             onClick={() => {
    //               let obj = this.state.data.find(o => o.id === key);
    //               alert(
    //                 "You clicked like no " + obj.name
    //               );
    //             }}
    //             color="info"
    //             size="sm"
    //             className={classNames("btn-icon btn-link like", {
    //               "btn-neutral": key < 5
    //             })}
    //           >
    //             <i className="tim-icons icon-heart-2" />
    //           </Button>{" "}
    //           {/* use this button to add a edit kind of action */}
    //           <Button
    //             onClick={() => {
    //               let obj = this.state.data.find(o => o.id === key);
    //               alert(
    //                 "Yo clicked edit on " +obj.name
    //               );
    //             }}
    //             color="warning"
    //             size="sm"
    //             className={classNames("btn-icon btn-link like", {
    //               "btn-neutral": key < 5
    //             })}
    //           >
    //             <i className="tim-icons icon-pencil" />
    //           </Button>{" "}
    //           {/* use this button to remove the data row */}
    //           <Button
    //             onClick={() => {
    //               var data = this.state.data;
    //               data.find((o, i) => {
    //                 if (o.id === key) {
    //                   // here you should add some custom code so you can delete the data
    //                   // from this component and from your server as well
    //                   data.splice(i, 1);
    //                   console.log(data);
    //                   return true;
    //                 }
    //                 return false;
    //               });
    //               this.setState({ data: data });
    //             }}
    //             color="danger"
    //             size="sm"
    //             className={classNames("btn-icon btn-link like", {
    //               "btn-neutral": key < 5
    //             })}
    //           >
    //             <i className="tim-icons icon-simple-remove" />
    //           </Button>{" "}
    //         </div>
    //       )
    //     };
    //   })
    };
  }
  render() {
    return (
      <Row className="mt-5">
        <Col xs={12} md={12}>
          <Card>
            <CardHeader>
              <CardTitle tag="h4">Uploaded Songs</CardTitle>
            </CardHeader>
            <CardBody>
            <MDBDataTable
              responsive
              striped
              small
              data={data}
            />
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }
}

export default UploadedSongs;
