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
/*eslint-disable*/
import React from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
import Footer from "components/Footer/Footer.jsx";
import ReactTooltip from 'react-tooltip';
import { Nav, Collapse } from "reactstrap";

// reactstrap components
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import {logout} from '../../redux/authentication/actions.js';

const privacyPolicyLink = "https://revibe-media.s3.us-east-2.amazonaws.com/Privacy+Policy.pdf"
const termAndConditionsLink = "https://revibe-media.s3.us-east-2.amazonaws.com/Terms+and+Conditions.pdf"

var ps;

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getCollapseStates(props.routes);
  }

  async onLogout(history) {
    this.props.logout(history);
  }

  // this creates the intial state of this component based on the collapse routes
  // that it gets through this.props.routes
  getCollapseStates = routes => {
    let initialState = {};
    routes.map((prop, key) => {
      if (prop.collapse) {
        initialState = {
          [prop.state]: this.getCollapseInitialState(prop.views),
          ...this.getCollapseStates(prop.views),
          ...initialState
        };
      }
      return null;
    });
    return initialState;
  };
  // this verifies if any of the collapses should be default opened on a rerender of this component
  // for example, on the refresh of the page,
  // while on the src/views/forms/RegularForms.jsx - route /admin/regular-forms
  getCollapseInitialState(routes) {
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse && this.getCollapseInitialState(routes[i].views)) {
        return true;
      } else if (window.location.href.indexOf(routes[i].path) !== -1) {
        return true;
      }
    }
    return false;
  }
  // this function creates the links and collapses that appear in the sidebar (left menu)
  createLinks = routes => {
    return routes.filter(x => x.showInSidebar).map((prop, key) => {
      if (prop.redirect) {
        return null;
      }
      if (prop.collapse) {
        var st = {};
        st[prop["state"]] = !this.state[prop.state];
        return (
          <li
            className={this.getCollapseInitialState(prop.views) ? "active" : ""}
            key={key}
          >
            <a
              href="#pablo"
              data-toggle="collapse"
              aria-expanded={this.state[prop.state]}
              onClick={e => {
                e.preventDefault();
                this.setState(st);
              }}
            >
              {prop.icon !== undefined ? (
                <>
                  <i className={prop.icon} />
                  <p>
                    {prop.name}
                    <b className="caret" />
                  </p>
                </>
              ) : (
                <>
                  <span className="sidebar-mini-icon">
                    {prop.mini}
                  </span>
                  <span className="sidebar-normal">
                    {prop.name}
                    <b className="caret" />
                  </span>
                </>
              )}
            </a>
            <Collapse isOpen={this.state[prop.state]}>
              <ul className="nav">{this.createLinks(prop.views)}</ul>
            </Collapse>
          </li>
        );
      }
      return (
        <a data-tip data-for={prop.name}>
        <li className={this.activeRoute(prop.layout + prop.path)} key={key}>
          <NavLink to={prop.layout + prop.path} activeClassName="" onClick={this.props.closeSidebar}>
            {prop.icon !== undefined ? (
              <>
                <i className={prop.icon} />
                <p>{prop.name}</p>
                <ReactTooltip id={prop.name} type='' effect='solid' delayShow={1500}>
                <span>{prop.toolTipMessage}</span>
                </ReactTooltip>
              </>
            ) : (
              <>
                <span className="sidebar-mini-icon">
                  {prop.mini}
                </span>
                <span className="sidebar-normal">
                  {prop.name}
                </span>
                <span>{prop.toolTipMessage}</span>
              </>
            )}
            </NavLink>
        </li>

          </a>
      );
    });
  };
  // verifies if routeName is the one active (in browser input)
  activeRoute = routeName => {
    return this.props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };
  componentDidMount() {
    // if you are using a Windows Machine, the scrollbars will have a Mac look
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(this.refs.sidebar);
    }
  }
  componentWillUnmount() {
    // we need to destroy the false scrollbar when we navigate
    // to a page that doesn't have this component rendered
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
    }
  }
  render() {
    const { activeColor, logo } = this.props;
    let logoImg = null;
    let logoText = null;
    if (logo !== undefined) {
      if (logo.outterLink !== undefined) {
        logoImg = (
          <a
            href={logo.outterLink}
            className="simple-text logo-mini"
            target="_blank"
            onClick={this.props.closeSidebar}
          >
          <div className="logo-img">
            <img alt="..." src={this.props.artistImage ? this.props.artistImage : require("assets/portal/img/default-avatar.png")} />
          </div>
          </a>
        );
        logoText = (
          <a
            href={logo.outterLink}
            className="simple-text logo-normal"
            target="_blank"
            onClick={this.props.closeSidebar}
          >
            {logo.text}
          </a>
        );
      } else {
        logoImg = (
          <NavLink
            to={logo.innerLink}
            className="simple-text logo-mini"
            onClick={this.props.closeSidebar}
          >
            <div className="logo-img">
              <img src={logo.imgSrc} alt="react-logo" />
            </div>
          </NavLink>
        );
        logoText = (
          <NavLink
            to={logo.innerLink}
            className="simple-text logo-normal"
            onClick={this.props.closeSidebar}
          >
            {logo.text}
          </NavLink>
        );
      }
    }
    return (
      <div className="sidebar" data={activeColor}>
        <div className="sidebar-wrapper" ref="sidebar">
          {logoImg !== null || logoText !== null ? (
            <div className="logo">
              <a className="simple-text logo-mini">
                <div className="logo-img">
                  <img alt="..." src={this.props.artistImage ? this.props.artistImage : require("assets/portal/img/default-avatar.png")} />
                </div>
              </a>
              <a className="simple-text logo-normal">
                {this.props.artistName ? this.props.artistName : ""}
              </a>
            </div>
          ) : null}
          <Nav>{this.createLinks(this.props.routes)}</Nav>
          <ul className="nav" style={{bottom: 0, position: "absolute"}}>
            <li className="nav-item">
              <a className="nav-link"
                href=""
                onClick={() => history.push('/dashboard/faq')}
                style={{ paddingTop: "0px", paddingBottom: "0px" }}
              >
                FAQ
              </a>
            </li>{" "}
            <li className="nav-item">
              <a className="nav-link"
                onClick={() => this.onLogout(history)}
                style={{ paddingTop: "0px", paddingBottom: "0px" }}
              >
                Logout
              </a>
            </li>{" "}
            <li className="nav-item">
              <a className="nav-link"
                href=""
                onClick={() => history.push('/dashboard/feedback')}
                style={{ paddingTop: "0px", paddingBottom: "0px" }}
              >
                Contact Us
              </a>
            </li>{" "}
            <li className="nav-item">
              <a
                className="nav-link"
                target="_blank"
                href={termAndConditionsLink}
                style={{ paddingTop: "0px", paddingBottom: "0px" }}
              >
                Terms & Conditions
              </a>
            </li>{" "}
            <li className="nav-item">
              <a className="nav-link"
                target="_blank"
                href={privacyPolicyLink}
                style={{ paddingTop: "0px", paddingBottom: "10px" }}
              >
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

      </div>
    );
  }
}

Sidebar.propTypes = {
  activeColor: PropTypes.oneOf(["primary", "blue", "green", "orange", "red"]),
  routes: PropTypes.array.isRequired,
  logo: PropTypes.oneOfType([
    PropTypes.shape({
      innerLink: PropTypes.string.isRequired,
      imgSrc: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired
    }),
    PropTypes.shape({
      outterLink: PropTypes.string.isRequired,
      imgSrc: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired
    })
  ]),
  // this is used on responsive to close the sidebar on route navigation
  closeSidebar: PropTypes.func
};

function mapStateToProps(state) {
  return {
    artistImage: state.authentication.user.images.small,
    artistName: state.authentication.user.displayName,
  }
};


const mapDispatchToProps = dispatch => ({
    logout: (history) =>dispatch(logout(history)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
