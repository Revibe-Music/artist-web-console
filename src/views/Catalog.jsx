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
import SongUpload from "components/SongUpload/SongUpload.jsx";
import UploadedSongs from "components/Tables/UploadedSongs.jsx";
import UploadingSongs from "components/Tables/UploadingSongs.jsx";


class Catalog extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="content">
        <UploadedSongs />
        <UploadingSongs />

        <Row>
          <Col md="12">
            <Card>
              <CardBody>
                <CardTitle tag="h4">Upload Songs</CardTitle>
                <SongUpload />
              </CardBody>
            </Card>
            {/* end card */}
          </Col>
        </Row>
      </div>
    );
  }
}

export default Catalog;
