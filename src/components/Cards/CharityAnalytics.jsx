/*eslint-disable*/
import React from "react";
import classnames from "classnames"
// used for making the prop types of this component
import PropTypes from "prop-types";

import ClipLoader from "react-spinners/ClipLoader"

import RevibeAPI from 'api/revibe.js'

import {
  Button,
  Nav,
  NavItem,
  NavLink,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Container,
  Row,
  Col
} from "reactstrap";

import { logEvent } from 'amplitude/amplitude';

const revibe = new RevibeAPI()

const TYPES = {
  "num_streams": {
    title: "Streams"
  },
  "listeners": {
    title: "Listeners"
  },
  "_playlist_songs": {
    title: "Playlist Adds"
  },
  "_library_songs": {
    title: "Library Adds"
  }
}

export default class CharityAnalyticsCard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: false,
      loaded: false,
      data: null,
      error: null,
      curType: "num_streams"
    }
  }

  async componentDidMount() { await this.handleUpdate() }
  async componentDidUpdate() { await this.handleUpdate() }

  async handleUpdate() {
    const { num_bars, inc_contributions, distinct  } = this.props
    var period = "week", data_type = this.state.curType, interval

    if(!this.state.loading && !this.state.loaded) {
      this.setState({ ...this.state, loading: true, error: null, data: null })

      try {
        var query = `?type=${data_type}${period != null ? `&time_period=${period}` : ""}${interval != null ? `&time_interval=${interval}` : ""}${num_bars != null ? `&num_bars=${num_bars}` : ""}${inc_contributions != null ? `&include_contributions=${inc_contributions}` : ""}${distinct != null ? `&distinct=${distinct}` : ""}`

        var res = await revibe.getAnalyticsChart("card", query)

        console.log(res)

        if(res.status && res.status >= 400) {
          this.setState({ ...this.state, error: res, loading: false, loaded: true })
          return
        }

        var newData = res.data ? res.data : {
          data: 0
        }

        this.setState({ ...this.state, data: newData, loading: false, loaded: true })
      } catch (e) {
        this.setState({ ...this.state, error: e, loading: false, loaded: true })
      }
    }
  }

  render() {
    const { footerIcon, footerText } = this.props, data_type = "num_streams"

    console.log(this.state)

    if(this.state.error) {
      // console.log("State output: ")
      // console.log(this.state)
      // console.log("Error output: ")
      // console.log(this.state.error)
    }

    const getFontSizeBasedOnData = str => {
      var length = str.length

      return `${(3.25 - ((length-2) * (0.1 + (0.04 * (length-3)))))}rem`
    }

    const dollarAmnt = this.state.data ? this.state.data.data[data_type] * 0.25 : 0
    const numericDollarAmnt = `$${dollarAmnt.toFixed(2)}`

    return (
      <Card className={`card-stats`} color="primary">
        <CardBody>
          <Row>
            <Row className="w-100 ml-auto mr-auto">
              <h2 className="w-100 text-center text-white mb-2 m-0 p-0">Listen For Change</h2>
            </Row>
            <Col xs="6" sm="6" md="6" lg="6" className="ml-0 mr-auto d-flex pl-0 pr-0">
              <Row className="ml-2 mr-2 w-100 mt-auto mb-auto">
                <h5 className="ml-1 mr-auto mt-auto w-auto mb-auto text-neutral d-inline-block" style={{ fontSize: "0.675rem" }}>
                  Every stream this week generates $0.25 that will be donated to Black Education for NOLA!
                </h5>
              </Row>
            </Col>
            <Col xs="6" sm="6" md="6" lg="6" className="d-flex align-items-center justify-content-center pl-0 pr-0">
              <div className="numbers text-left">
                {!this.state.loading && this.state.data ?
                  <CardTitle tag="h1" style={{ fontSize: getFontSizeBasedOnData(numericDollarAmnt) }}>{numericDollarAmnt}</CardTitle>
                :
                  <div className="w-auto h-auto m-auto">
                    <ClipLoader
                      size={15}
                      color={"white"}
                      loading={true}
                    />
                  </div>
                }
              </div>
            </Col>
          </Row>
        </CardBody>
        {footerIcon && footerText ? <CardFooter>
          <hr />
          <div className="stats">
            <i className={`tim-icons ${footerIcon}`} />{footerText}
          </div>
        </CardFooter> : null}
        {this.state.error ?
            <>
              <div className="w-100 text-center">
                <h1>An error has occurred!</h1>
                <h5>{this.state.error && this.state.error.detail ? this.state.error.detail : "Please refresh to try again!"}</h5>
              </div>
            </>
        : null}
      </Card>
    )
  }
}
