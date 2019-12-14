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

class Catalog extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <div className="tools float-right">
                  <UncontrolledDropdown>
                    <DropdownToggle
                      caret
                      className="btn-link btn-icon"
                      color="default"
                      data-toggle="dropdown"
                      type="button"
                    >
                      <i className="tim-icons icon-settings-gear-63" />
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem
                        href="#pablo"
                        onClick={e => e.preventDefault()}
                      >
                        Action
                      </DropdownItem>
                      <DropdownItem
                        href="#pablo"
                        onClick={e => e.preventDefault()}
                      >
                        Another action
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </div>
                <CardTitle tag="h4">Songs</CardTitle>
              </CardHeader>
              <CardBody>
                <Table responsive striped>
                  <thead className="text-primary">
                    <tr>
                      <th className="text-center">#</th>
                      <th>Name</th>
                      <th>ID</th>
                      <th>% of Streams</th>
                      <th className="text-center">Streams</th>
                      <th className="text-center">Upload Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-center">
                        <FormGroup check>
                          <Label check>
                            <Input defaultChecked type="checkbox" />
                            <span className="form-check-sign" />
                          </Label>
                        </FormGroup>
                      </td>
                      <td>Moleskine Agenda</td>
                      <td>Office</td>
                      <td>
                        <div className="progress-container progress-primary">
                          <span className="progress-badge">v1.2.0</span>
                          <Progress max="100" value="25">
                            <span className="progress-value">25%</span>
                          </Progress>
                        </div>
                      </td>
                      <td className="text-center">25</td>
                      <td className="text-center">€ 49</td>
                    </tr>
                    <tr>
                      <td className="text-center">
                        <FormGroup check>
                          <Label check>
                            <Input type="checkbox" />
                            <span className="form-check-sign" />
                          </Label>
                        </FormGroup>
                      </td>
                      <td>Stabilo Pen</td>
                      <td>Office</td>
                      <td>
                        <div className="progress-container progress-primary">
                          <span className="progress-badge">v1.4.0</span>
                          <Progress max="100" value="45">
                            <span className="progress-value">45%</span>
                          </Progress>
                        </div>
                      </td>
                      <td className="text-center">30</td>
                      <td className="text-center">€ 10</td>
                    </tr>
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
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
