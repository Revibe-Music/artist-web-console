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

import LineGraph from './LineGraph'
import BarGraph from './BarGraph'
import { logEvent } from 'amplitude/amplitude';

const revibe = new RevibeAPI()

const MONTHS = [ "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC" ]

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

const PERIOD = {
  "1d": {
    id: "day",
    title: "One Day",
    default_interval: "hour"
  },
  "1w": {
    id: "week",
    title: "One Week",
    default_interval: "day"
  },
  "1m": {
    id: "month",
    title: "One Month",
    default_interval: "day"
  },
  "3m": {
    id: "month_3",
    title: "Three Months",
    default_interval: "month"
  },
  "6m": {
    id: "month_6",
    title: "Six Months",
    default_interval: "month"
  },
  "1y": {
    id: "year",
    title: "One Year",
    default_interval: "month"
  },
  "All-Time": {
    id: "all-time",
    title: "All-Time",
    default_interval: "month"
  }
}

function getPeriodObjById(id) {
  var keys = Object.keys(PERIOD)

  for(var i in keys) {
    if(PERIOD[keys[i]].id == id) return PERIOD[keys[i]]
  }

  return null
}

function getTitleOfPeriodById(id) {
  var keys = Object.keys(PERIOD)

  for(var i in keys) {
    if(PERIOD[keys[i]].id == id) return PERIOD[keys[i]].title
  }

  return null
}

function getDefaultIntervalById(id) {
  var keys = Object.keys(PERIOD)

  for(var i in keys) {
    if(PERIOD[keys[i]].id == id) return PERIOD[keys[i]].default_interval
  }

  return null
}

/**
 * Document this function for a reason. This is where the line graph data is
 * filled in and refined based on period and interval. Modifications are done here
 * to control the data that is processed.
 *
 * When the period is set to all-time (month interval), it will post all data available, and the limit will be the first recorded data available.
 *
 * When the period is set to X months (month interval), it will fill in the available data, and the limit will be the the date X months back from the current date.
 *
 * When the period is set to one month (day interval), it will fill in the available data, and the limit will be the date 30 days back from the current date.
 *
 * When the period is set to one week (day interval), it will fill in the available data, and the limit will be the date 7 days back from the current date.
 *
 * @param {*} data
 * @param {*} type
 * @param {*} period
 * @param {*} interval
 */
function refineData(data, type, period, interval) {
  var labels = [], points = [], curDate = new Date(), monthLimit = 1, dayLimit = 1, yearLimit = 2020

  const checkForMonthDuplicates = data => {
    var months = []

    for(var i = 0; i < data.length; i++)
      months.push(data[i].month)

    months.sort((a, b) => a - b)

    var duplicates = 0, maxDuplicates = 0, curNum = months[0]

    for(var i = 1; i < data.length; i++) {
      if(curNum == months[i]) {
        duplicates++
      } else {
        curNum = months[i]
        if(maxDuplicates < duplicates) maxDuplicates = duplicates
        duplicates = 0
      }
    }

    return maxDuplicates
  }

  //console.log({ period, interval })

  if((period === "month_3" || period === "month_6" || period === "all-time") && interval === "month") {
    var month, year, dataIndex = 0

    if(period === "month_3" || period === "month_6") {
      var monthBuffer = period === "month_3" ? 3 : 6;

      if(curDate.getMonth() - monthBuffer < 0) {
        monthLimit = 12 + (curDate.getMonth() - monthBuffer)
        year = curDate.getFullYear() - 1
      } else {
        monthLimit = curDate.getMonth() - monthBuffer + 1
        year = curDate.getFullYear()
      }
    } else {
      monthLimit = data && data.length > 0 ? data[0].month : curDate.getMonth() + 1
      year = data && data.length > 0 ? curDate.getFullYear() - checkForMonthDuplicates(data) : curDate.getFullYear()-1

      if(data && data.length == 1) {
        if(data[0].year == curDate.getFullYear() && data[0].month == curDate.getMonth()+1) {
          monthLimit = data[0].month
          year = curDate.getFullYear()-1
        }
      }
    }

    month = monthLimit, dataIndex = 0

    while((data && dataIndex < data.length) || ((month-1 <= curDate.getMonth() && year == curDate.getFullYear()) || (year < curDate.getFullYear() && month <= 12))) {
      var dataPt = data ? data[dataIndex] : data

      labels.push(`${MONTHS[month-1]} ${year}`)

      if(dataPt && dataPt.year == year && dataPt.month == month) {
        points.push(dataPt[type])
        dataIndex++
      } else
        points.push(0)

      if(month < 12)
        month++
      else {
        month = 1
        year++
      }
    }
  } else if(period === "week" && interval === "day") {
    var day, month = curDate.getMonth(), dataIndex = 0

    if(curDate.getDate() - 7 < 1) {
      day = new Date(curDate.getMonth()-1, curDate.getFullYear(), 0).getDate() + (curDate.getDate() - 7)
      month--
    } else
      day = curDate.getDate() - 7

    //console.log({ day, month })

    while(dataIndex < data.length || ((month < curDate.getMonth() && day < new Date(month, curDate.getFullYear(), 0).getDate()) || (day <= curDate.getDate() && month == curDate.getMonth()))) {
      var dataPt = data[dataIndex]

      labels.push(`${month+1}/${day}`)

      if(dataPt && dataPt.month == month+1 && dataPt.day == day) {
        points.push(dataPt[type])
        dataIndex++
      } else
        points.push(0)

      if(day < new Date(month, curDate.getFullYear(), 0).getDate())
        day++
      else {
        day = 1
        month++
      }
    }
  } else {
    for(var i = 0; i < data.length; i++) {
      var dataPt = data[i]

      labels.push((dataPt.day ? `${dataPt.month}/${dataPt.day}` : `${MONTHS[dataPt.month-1]}`))
      points.push(dataPt[type])
    }
  }

  return { labels, points }
}

export default class Graph extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: false,
      loaded: false,
      data: null,
      error: null,
      curPill: (props.defaultPill ? props.defaultPill : 0),
      curType: (props.data_type ? props.data_type : "num_streams")
    }
  }

  async componentDidMount() { await this.handleUpdate() }
  async componentDidUpdate() { await this.handleUpdate() }

  async handleUpdate() {
    const { type, num_bars, inc_contributions, distinct, pills  } = this.props
    var period = "all-time", data_type = this.state.curType, interval

    if((!pills || pills.length == 0) && this.props.period) {
      period = this.props.period
      interval = this.props.interval ? this.props.interval : getDefaultIntervalById(period)
    } else if(pills && pills.length > 0) {
      period = PERIOD[pills[this.state.curPill]].id
      interval = this.props.interval ? this.props.interval : PERIOD[pills[this.state.curPill]].default_interval
    }

    if(!this.state.loading && !this.state.loaded) {
      this.setState({ ...this.state, loading: true, error: null, data: null })

      try {
        var query = `?type=${data_type}${period != null ? `&time_period=${period}` : ""}${interval != null ? `&time_interval=${interval}` : ""}${num_bars != null ? `&num_bars=${num_bars}` : ""}${inc_contributions != null ? `&include_contributions=${inc_contributions}` : ""}${distinct != null ? `&distinct=${distinct}` : ""}`

        var res = await revibe.getAnalyticsChart(type, query)

        //console.log(res)

        if(res.status && res.status >= 400) {
          this.setState({ ...this.state, error: res, loading: false, loaded: true })
          return
        }

        switch(type) {
          case "line": {
            var data = {
              title: res.data.title,
              description: res.data.description,
              x_axis: {
                ...res.data.x_axis_config
              },
              y_axis: {
                ...res.data.y_axis_config
              },
              chart: refineData(res.data.data, data_type, period, interval)
            }

            this.setState({ ...this.state, data: data, loading: false, loaded: true })
            break;
          }
          case "bar": {
            var data = {
              title: res.data.title,
              description: res.data.description,
              x_axis: {
                ...res.data.x_axis_config
              },
              y_axis: {
                ...res.data.y_axis_config
              },
              chart: {
                labels: [],
                points: []
              }
            }

            for(var i = 0; i < res.data.data.length; i++) {
              var dataPt = res.data.data[i]

              data.chart.labels.push(dataPt.title)
              data.chart.points.push(dataPt[data_type])
            }

            this.setState({ ...this.state, data: data, loading: false, loaded: true })

            break;
          }
          case "card": {
            var newData = res.data ? res.data : {
              data: 0
            }

            this.setState({ ...this.state, data: newData, loading: false, loaded: true })

            break;
          }
          default: {
            this.setState({ ...this.state, error: { detail: "This is not a valid type!" }, loading: false, loaded: true })
            break;
          }
        }
      } catch (e) {
        this.setState({ ...this.state, error: e, loading: false, loaded: true })
      }
    }
  }

  setPill(e, id) {
    e.preventDefault();

    this.setState({ ...this.state, curPill: id, loaded: false })
    logEvent("Stats", "Period Changed")
  }

  setType(e, id) {
    e.preventDefault();

    this.setState({ ...this.state, curType: id, loaded: false })
    logEvent("Stats", "Metric Changed")
  }

  render() {
    const { type, data_type, period, icon, footerIcon, footerText, pills } = this.props

    //console.log(this.state)

    if(this.state.error) {
      console.log("State output: ")
      console.log(this.state)
      console.log("Error output: ")
      console.log(this.state.error)
    }

    const getFontSizeBasedOnData = num => {
      var digits = 0
      if(num >= 1) digits++

      while(num / 10 >= 1) {
        num /= 10
        digits++
      }

      return `${(3.25 - ((digits-1) * (0.1 + (0.04 * (digits-2)))))}rem`
    }

    return (
      <Card className={`${type == "card" ? "card-stats" : "card-chart"}`}>
        {type == "line" ?
          <>
            <CardHeader>
              <Row>
                <Col className="text-left" sm="4" md="4" lg="4">
                  <h5 className="card-category">{this.state.data && this.state.data.title ? this.state.data.title : "Loading..."}</h5>
                  <CardTitle tag="h2">{`${pills ? PERIOD[pills[this.state.curPill]].title : getTitleOfPeriodById(period)} Performance`}</CardTitle>
                </Col>
                <Col sm="8" md="8" lg="8" className={window.innerWidth < 1275 ? "d-block" : "d-flex"}>
                  {pills && pills.length > 0 ?
                    <Nav className="w-auto h-auto ml-auto mr-auto ml-md-auto mr-md-0 mt-1 mb-auto nav-pills-primary d-flex" pills role="tablist">
                      {pills.map((val, i) => <NavItem className={`w-auto h-auto ${i === 0 ? "ml-auto" : "ml-1"} ${i === pills.length-1 ? "mr-0" : "mr-1"}`}>
                        <NavLink
                          className={classnames({
                          active: this.state.curPill === i
                          }) + " text-center w-auto h-auto m-auto p-1"}
                          onClick={e => this.setPill(e, i)}
                          style={{ cursor: "pointer", minWidth: "1px" }}
                        >
                          <p className="text-white mb-auto mt-auto ml-2 mr-2 w-auto d-inline-block" style={{ fontSize: "0.7rem" }}>{val}</p>
                        </NavLink>
                      </NavItem>)}
                    </Nav>
                  : null}
                  <div className="type-nav w-auto h-auto ml-auto mr-auto mt-1 mb-auto d-flex">
                    {Object.keys(TYPES).map((obj, i) => (
                      <Button
                        size="sm"
                        onClick={e => this.setType(e, obj)}
                        className={`${this.state.curType == obj ? "" : "btn-simple"} btn-primary w-auto h-auto pl-2 pr-2 pt-1 pb-1 btn-hover-off ${i > 0 && i < Object.keys(TYPES).length-1 ? "ml-0 mr-0 btn-middle" : (i == 0 ? "ml-auto mr-0 btn-left" : "ml-0 mr-0 btn-right")}`}
                      >
                        <p className="text-center w-auto h-auto m-0" style={{ fontSize: "0.7rem", color: "inherit" }}>{TYPES[obj].title}</p>
                      </Button>
                    ))}
                  </div>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              {!this.state.loading && this.state.data ? <LineGraph
                data={this.state.data.chart.points}
                labels={this.state.data.chart.labels}
                data_label={this.state.data.y_axis.title}
              /> :
              <>
                {this.state.loading && !this.state.error ?
                  <div className="w-auto h-auto m-auto">
                    <ClipLoader
                      size={15}
                      color={"white"}
                      loading={true}
                      className="ml-auto mr-auto"
                    />
                  </div>
                  : null}
              </>
              }
            </CardBody>
          </>
        : null}
        {type == "bar" ?
          <>
            <CardHeader>
              <Row>
                <Col sm="4" md="4" lg="4">
                  <h5 className="card-category">{this.state.data && this.state.data.title ? this.state.data.title : "Loading..."}</h5>
                  <CardTitle tag="h3">
                    {`${pills ? PERIOD[pills[this.state.curPill]].title : getTitleOfPeriodById(period)} `}{icon ? <i className={`tim-icons ${icon} text-primary`} /> : null}{" "}
                  </CardTitle>
                </Col>
                <Col sm="8" md="8" lg="8" className="d-flex">
                  {pills && pills.length > 0 ?
                    <Nav className="w-auto ml-auto mr-2 mt-1 nav-pills-primary d-flex" pills role="tablist">
                      {pills.map((val, i) => <NavItem className={`w-auto h-auto ${i === 0 ? "ml-auto" : "ml-1"} ${i === pills.length-1 ? "mr-auto" : "mr-1"}`}>
                        <NavLink
                          className={classnames({
                          active: this.state.curPill === i
                          }) + " text-center w-auto h-auto m-auto p-1"}
                          onClick={e => this.setPill(e, i)}
                          style={{ cursor: "pointer", minWidth: "1px" }}
                        >
                          <p className="text-white mb-auto mt-auto ml-2 mr-2 w-auto d-inline-block" style={{ fontSize: "0.7rem" }}>{val}</p>
                        </NavLink>
                      </NavItem>)}
                    </Nav>
                  : null}
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              {!this.state.loading && this.state.data ? <BarGraph
                data={this.state.data.chart.points}
                labels={this.state.data.chart.labels}
                data_label={this.state.data.y_axis.title}
              /> :
                <>
                  {this.state.loading && !this.state.error ?
                    <div className="w-auto h-auto m-auto">
                      <ClipLoader
                        size={15}
                        color={"white"}
                        loading={true}
                        className="ml-auto mr-auto"
                      />
                    </div>
                    : null}
                </>
              }
            </CardBody>
          </>
        : null}
        {type == "card" ?
          <>
            <CardBody>
              <Row>
                <Row className="w-100 ml-auto mr-auto">
                {pills && pills.length > 0 ?
                  <Nav className="nav-pills-primary d-flex ml-auto mr-auto" pills role="tablist">
                    {pills.map((val, i) => <NavItem className={`w-auto h-auto ${i === 0 ? "ml-auto" : "ml-1"} ${i === pills.length-1 ? "mr-auto" : "mr-1"}`}>
                      <NavLink
                        className={classnames({
                          active: this.state.curPill === i
                        }) + " text-center w-auto h-auto m-auto p-1"}
                        onClick={e => this.setPill(e, i)}
                        style={{ cursor: "pointer", minWidth: "1px" }}
                      >
                        <p className="text-white mb-auto mt-auto ml-2 mr-2 w-auto d-inline-block" style={{ fontSize: "0.7rem" }}>{val}</p>
                      </NavLink>
                    </NavItem>)}
                  </Nav>
                :
                  <h4 className="w-100 text-center mb-2 m-0 p-0">{period ? getTitleOfPeriodById(period) : "All-Time"}</h4>
                }
                </Row>
                <Col xs="8" sm="8" md="8" lg="8" className="ml-0 mr-auto d-flex pl-0 pr-0">
                  <Row className="ml-auto mr-auto w-100 mt-auto mb-auto">
                    <div className="w-auto h-auto mt-auto mb-auto ml-2 mr-1 info-icon text-center icon-primary d-flex align-items-center justify-content-center">
                      <i style={{ fontSize: "1.15rem", padding: "0.75rem" }} className={`tim-icons ${icon ? icon : "icon-single-02"}`} />
                    </div>
                    <h4 className="ml-1 mr-auto mt-auto w-auto mb-auto text-neutral d-inline-block">{`${TYPES[data_type].title}`}</h4>
                  </Row>
                </Col>
                <Col xs="4" sm="4" md="4" lg="4" className="d-flex align-items-center justify-content-center pl-0 pr-0">
                  <div className="numbers text-left">
                    {!this.state.loading && this.state.data ?
                      <CardTitle tag="h1" style={{ fontSize: getFontSizeBasedOnData(this.state.data.data[data_type]) }}>{this.state.data.data[data_type]}</CardTitle>
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
          </>
        : null}
        {(type != "line" && type != "bar" && type != "card") || this.state.error ?
            <>
              <div className="w-100 text-center">
                <h1>An error has occurred!</h1>
                <h5>{this.state.error && this.state.error.detail ? this.state.error.detail : "Please refresh to try again!"}</h5>
              </div>
            </>
        : null}
      </Card>
    )
    /* Original code setup -- kept incase!
    if(!this.state.loading && this.state.data != null) {
      switch(type) {
        case "line": {
          return <Card className="card-chart">
          <CardHeader>
            <Row>
              <Col className="text-left" sm="6">
                <h5 className="card-category">Total Streams</h5>
                <CardTitle tag="h2">Performance</CardTitle>
              </Col>
            </Row>
          </CardHeader>
          <CardBody>
            <LineGraph
              data={this.state.data.chart.points}
              labels={this.state.data.chart.labels}
              data_label={this.state.data.y_axis.title}
            />
          </CardBody>
        </Card>
        }
        case "bar": {
          return <BarGraph
            data={this.state.data.chart.points}
            labels={this.state.data.chart.labels}
            data_label={this.state.data.y_axis.title}
          />
        }
        case "card": {
          return (
            <>
            </>
          )
        }
        default: {
          return (
            <>
              <div className="w-100 text-center">
                <h3>An error has occurred!</h3>
                <h5>{this.state.error && this.state.error.detail ? this.state.error.detail : "Check the console for more information!"}</h5>
              </div>
            </>
          );
        }
      }
    } else {
      //TODO: fix up loading
      return (
        <p>Loading...</p>
      );
    }*/
  }
}
