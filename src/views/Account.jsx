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

import Profile from './Profile'
import Settings from './Settings'
import Relinked from './Relinked'
import TipJar from './TipJar'

class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: "profile",
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
        <Nav className="nav-pills-primary" pills>

          <NavItem>
            <NavLink
              data-toggle="tab"
              className={this.state.tabs === "profile" ? "active" : ""}
              onClick={e => this.changeActiveTab(e, "tabs", "profile")}
            >
              Profile
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink
              data-toggle="tab"
              className={this.state.tabs === "relinked" ? "active" : "" }
              onClick={e => this.changeActiveTab(e, "tabs", "relinked") }
            >
              Relink
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink
              data-toggle="tab"
              className={this.state.tabs === "tipJar" ? "active" : "" }
              onClick={e => this.changeActiveTab(e, "tabs", "tipJar") }
            >
              Tip Jar
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink
              data-toggle="tab"
              className={this.state.tabs === "settings" ? "active" : "" }
              onClick={e => this.changeActiveTab(e, "tabs", "settings") }
            >
              Settings
            </NavLink>
          </NavItem>

        </Nav>

        <TabContent
          className="tab-space"
          activeTab={this.state.tabs}
        >
          <TabPane tabId="profile">
            <Profile />
          </TabPane>
          <TabPane tabId="relinked">
            <Relinked />
          </TabPane>
          <TabPane tabId="tipJar">
            <TipJar />
          </TabPane>
          <TabPane tabId="settings">
            <Settings />
          </TabPane>
        </TabContent>
      </div>
    );
  }
}

export default Account;
