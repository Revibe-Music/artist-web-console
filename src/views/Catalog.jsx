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
import React from "react";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Label,
  FormGroup,
  Input,
  Progress,
  Table,
  Row,
  Col,
} from "reactstrap";
import Uploads from "components/Tables/Uploads.jsx";
import SongUpload from "views/SongUpload.jsx";
import Contributions from "components/Tables/Contributions.jsx";
import PendingContributions from "components/Tables/PendingContributions.jsx";


class Catalog extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      uploading: true
    }
  }

  render() {
    return (
      <div className="content">

      {!this.state.uploading ?
        <>
          <Button
            color="primary"
            onClick={() => this.setState({uploading:true})}
          >
            Upload
          </Button>
          <Row className="mt-5">
            <Col xs={12} md={12}>
              <PendingContributions />
            </Col>
          </Row>
          <Row className="mt-5">
            <Col xs={12} md={12}>
              <Uploads />
            </Col>
          </Row>
          <Row className="mt-5">
            <Col xs={12} md={12}>
              <Contributions />
            </Col>
          </Row>
        </>
      :
        <>
          <a onClick={e => this.setState({uploading:false})}>
            <i className="tim-icons icon-simple-remove" style={{fontSize: "30px", marginBottom: "50px", color: "#7248BD"}}/>
          </a>
          <SongUpload />
        </>
      }
      </div>
    );
  }
}

export default Catalog;
