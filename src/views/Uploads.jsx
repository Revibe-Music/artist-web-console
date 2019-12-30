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
  Container,
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
import UploadedAlbumsTable from "components/Tables/UploadedAlbumsTable.jsx";
import UploadedSongsTable from "components/Tables/UploadedSongsTable.jsx";
import SongUpload from "views/SongUpload.jsx";
import { FaArrowLeft } from "react-icons/fa";


class Uploads extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      uploading: false
    }
  }

  render() {
    return (
      <div className="content">
      <Container>
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
              <UploadedAlbumsTable />
            </Col>
          </Row>
          <Row className="mt-5">
            <Col xs={12} md={12}>
              <UploadedSongsTable />
            </Col>
          </Row>
        </>
      :
        <>
          <a onClick={e => this.setState({uploading:false})}>
            <FaArrowLeft style={{fontSize: "30px", marginBottom: "50px", color: "#7248BD"}} />
          </a>
          <SongUpload />
        </>
      }
      </Container>
      </div>
    );
  }
}

export default Uploads;
