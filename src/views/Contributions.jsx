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
import ContributionsTable from "components/Tables/ContributionsTable.jsx";
import PendingContributions from "components/Tables/PendingContributionsTable.jsx";


class Contributions extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="content">
        <Row className="mt-5">
          <Col xs={12} md={12}>
            <PendingContributions />
          </Col>
        </Row>
        <Row className="mt-5">
          <Col xs={12} md={12}>
            <ContributionsTable />
          </Col>
        </Row>
      }
      </div>
    );
  }
}

export default Contributions;
