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
  Container,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Collapse,
  NavItem,
  NavLink,
  Nav,
  TabContent,
  TabPane,
  Row,
  Col
} from "reactstrap";
import { NavLink as Link } from "react-router-dom";
import ReactTooltip from 'react-tooltip';

import Uploads from './Uploads'
import Contributions from './Contributions'

class YourSongs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: "uploads",
    };
  }

  // with this function we change the active tab for all the tabs in this page
  changeActiveTab = (e, tabState, tadName) => {
    e.preventDefault();
    this.setState({
      [tabState]: tadName
    });
  };

  render() {
    return (
      <div className="content">
      <Container>
        <Row style={{justifyContent: "space-between", alignItems: "center"}}>
        <Nav className="nav-pills-primary" pills>
          <NavItem>
            <NavLink
              data-toggle="tab"
              className={this.state.tabs === "uploads" ? "active" : ""}
              onClick={e => this.changeActiveTab(e, "tabs", "uploads")}
            >
              Uploads
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              data-toggle="tab"
              className={this.state.tabs === "contributions" ? "active" : "" }
              onClick={e => this.changeActiveTab(e, "tabs", "contributions") }
            >
              Contributions
            </NavLink>
          </NavItem>

        </Nav>
        <a data-tip data-for="uploadToolTip">
          <Link to={'uploads/new'} activeClassName="">
            <Button
              style={{margin: 0}}
              color="primary"
              onClick={() => this.setState({uploading:true})}
            >
              New Upload
            </Button>
          </Link>
        </a>
        <ReactTooltip id="uploadToolTip" effect='solid' delayShow={1500} direction="right">
          <span>Upload new songs/albums</span>
        </ReactTooltip>
        </Row>

        <TabContent
          className="tab-space"
          activeTab={this.state.tabs}
        >
          <TabPane tabId="uploads">
            <Uploads />
          </TabPane>
          <TabPane tabId="contributions">
            <Contributions />
          </TabPane>
        </TabContent>
        </Container>
      </div>
    );
  }
}

export default YourSongs;
