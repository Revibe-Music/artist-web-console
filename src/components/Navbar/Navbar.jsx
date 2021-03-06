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
// nodejs library that concatenates classes
import classNames from "classnames";

// reactstrap components
import {
  Button,
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Input,
  InputGroup,
  NavbarBrand,
  Navbar,
  NavLink,
  Nav,
  Container,
  Modal,
} from "reactstrap";
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {logout} from '../../redux/authentication/actions.js';


class AdminNavbar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      collapseOpen: false,
      color: "navbar-transparent"
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateColor);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateColor);
  }

  // function that adds color white/transparent to the navbar on resize (this is for the collapse)
  updateColor = () => {
    if (window.innerWidth < 993 && this.state.collapseOpen) {
      this.setState({
        color: "bg-white"
      });
    } else {
      this.setState({
        color: "navbar-transparent"
      });
    }
  };

  // this function opens and closes the collapse on small devices
  toggleCollapse = () => {
    if (this.state.collapseOpen) {
      this.setState({
        color: "navbar-transparent"
      });
    } else {
      this.setState({
        color: "bg-white"
      });
    }
    this.setState({
      collapseOpen: !this.state.collapseOpen
    });
  };

  async onLogout(history) {
    this.props.logout(history);
  }

  render() {
    const LogoutButton = withRouter(({ history }) => (
      <Button
        color="danger"
        onClick={() => this.onLogout(history)}
      >
        Logout
      </Button>
    ));

    return (
      <Navbar
        className={classNames("navbar-absolute", {
          [this.state.color]:
            this.props.location.pathname.indexOf("full-screen-map") === -1
        })}
        expand="lg"
      >
        <Container fluid>
          <div className="navbar-wrapper mt-3 mb-auto">
            {<div
              className={classNames("navbar-toggle d-inline", {
                toggled: this.props.sidebarOpened
              })}
            >
              <button
                className="navbar-toggler"
                type="button"
                onClick={this.props.toggleSidebar}
              >
                <span className="navbar-toggler-bar bar1" />
                <span className="navbar-toggler-bar bar2" />
                <span className="navbar-toggler-bar bar3" />
              </button>
            </div>}
            <NavbarBrand href="" onClick={e => e.preventDefault()}>
              {this.props.brandText}
            </NavbarBrand>
          </div>
          {/*<button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navigation"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={this.toggleCollapse}
          >
            <span className="navbar-toggler-bar navbar-kebab" />
            <span className="navbar-toggler-bar navbar-kebab" />
            <span className="navbar-toggler-bar navbar-kebab" />
          </button>*/}

          {/*<Nav className="ml-auto" navbar>
              <UncontrolledDropdown nav>
                <DropdownToggle
                  caret
                  color="primary"
                  data-toggle="dropdown"
                  nav
                  onClick={e => e.preventDefault()}
                  className="w-100 d-flex justify-content-end"
                >
                  <div className="photo">
                    <img alt="..." src={this.props.artistImage ? this.props.artistImage : require("assets/portal/img/default-avatar.png")} />
                  </div>
                </DropdownToggle>
                <DropdownMenu className="dropdown-navbar" right tag="ul">
                  <NavLink tag="li">
                    <DropdownItem className="nav-item">
                      <LogoutButton />
                    </DropdownItem>
                  </NavLink>
                </DropdownMenu>
              </UncontrolledDropdown>
              <li className="separator d-lg-none" />
            </Nav>*/}
        </Container>
      </Navbar>
    );
  }
}


function mapStateToProps(state) {
  return {
    artistImage: state.authentication.user.images.small,
  }
};


const mapDispatchToProps = dispatch => ({
    logout: (history) =>dispatch(logout(history)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminNavbar);
