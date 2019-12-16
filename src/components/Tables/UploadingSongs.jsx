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
  Button,
  FormGroup,
  Label,
  Input,
} from "reactstrap";

import Select from "react-select";

const colourStyles = {
  control: styles => ({ ...styles, backgroundColor: 'white' }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: "yellow",
      color: '#red',
      cursor: isDisabled ? 'not-allowed' : 'default',
    };
  },
};


class UploadingSongs extends Component {


  constructor(props) {
    super(props);
    // this.state = {
    //   data: data.map((prop, key) => {
    //     return {
    //       id: key,
    //       name: prop[0],
    //       album: prop[1],
    //       contributors: prop[2],
    //       duration: prop[3],
    //       quality: prop[4],
    //       actions: (
    //         // we've added some custom button actions
    //         <div className="actions-right">
    //           {/* use this button to remove the data row */}
    //           <Button
    //             onClick={() => {
    //               var data = this.state.data;
    //               data.find((o, i) => {
    //                 if (o.id === key) {
    //                   // here you should add some custom code so you can delete the data
    //                   // from this component and from your server as well
    //                   data.splice(i, 1);
    //                   return true;
    //                 }
    //                 return false;
    //               });
    //               this.setState({ data: data });
    //             }}
    //             color="danger"
    //             size="sm"
    //             className={classNames("btn-icon btn-link like")}
    //           >
    //             <i className="tim-icons icon-simple-remove" />
    //           </Button>{" "}
    //         </div>
    //       )
    //     };
    //   })
    // };

    this.state = {
      data : [
         {index: 0, name: "Airi Satou", album:"Accountant", contributors: "Drake", duration: "2:15", quality: "120 kb/s"},
         {index: 1, name: "Angelica Ramos", album:"Chief Executive Officer (CEO)", contributors: "Drake", duration: "2:15", quality: "120 kb/s"},
         {index: 2, name: "Ashton Cox", album:"Junior Technical Author", contributors: "Drake", duration: "2:15", quality: "120 kb/s"},
         {index: 3, name: "Bradley Greer", album:"Software Engineer", contributors: "Drake", duration: "2:15", quality: "120 kb/s"},
         {index: 4, name: "Brenden Wagner", album:"Software Engineer", contributors: "Drake", duration: "2:15", quality: "120 kb/s"},
         {index: 5, name: "Brielle Williamson", album:"Integration Specialist", contributors: "Drake", duration: "2:15", quality: "120 kb/s"},
         {index: 6, name: "Caesar Vance", album:"Pre-Sales Support", contributors: "Drake", duration: "2:15", quality: "120 kb/s"},
         {index: 7, name: "Cedric Kelly", album:"Senior Javascript Developer", contributors: "Drake", duration: "2:15", quality: "120 kb/s"},
     ]
    }

    this.columns = [
        {
          id: "name",
          Header: "Name",
          accessor: row => <Input value={row.name} onChange={event => this.editRow( row.index,"name", event.target.value)} />,
          filterable: false,
        },
        {
          id: "album",
          Header: "Album",
          accessor: row => <Input value={row.album} onChange={event => this.editRow( row.index,"album", event.target.value)} />,
          filterable: false
        },
        {
          id: "contributors",
          Header: "Contributors",
          style:{overflow: "visible"},
          Cell: row => <Select
            styles={colourStyles}
            className="react-select info"
            classNamePrefix="react-select"
            placeholder="Contributors"
            name="multipleSelect"
            closeMenuOnSelect={false}
            isMulti
            value={row.contributors}
            onChange={value =>
              this.editRow( row.index,"contributors", value)
            }
            options={[
              {
                value: "",
                isDisabled: true
              },
              { value: "2", label: "Drake " },
              { value: "3", label: "Travis Scott" },
              { value: "4", label: "J. Cole" },
            ]}
          />,
          filterable: false
        },
        {
          accessor: "duration",
          Header: "Duration",
          filterable: false
        },
        {
          Header: "Quality",
          accessor: "quality",
          filterable: false
        },
        {
          id: "explicit",
          Header: "Explicit",
          accessor: row => (<FormGroup className="center" check>
                              <Label check>
                                <Input type="checkbox" />
                                <span className="form-check-sign" />
                              </Label>
                            </FormGroup>),
          filterable: false
        },
        {
          Header: "Actions",
          accessor: "actions",
          sortable: false,
          filterable: false
        }
      ]

      this.editRow = this.editRow.bind(this)
  }

  editRow(index, key, value) {
    var newData = [... this.state.data]
    newData[index][key] = value
    this.setState({data: newData})
    // console.log(index, key, value);
  }

  render() {
    console.log(this.state.data);
    return (
      <Row className="mt-5">
        <Col xs={12} md={12}>
          <Card>
            <CardHeader>
              <CardTitle tag="h4">Upload</CardTitle>
            </CardHeader>
            <CardBody>
            <ReactTable
              data={this.state.data}
              resizable={true}
              columns={this.columns}
              defaultPageSize={this.state.data.length}
              showPagination={false}
              className="-striped -highlight"
            />
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }
}

export default UploadingSongs;
