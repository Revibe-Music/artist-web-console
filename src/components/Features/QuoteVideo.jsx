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
import React from 'react'
import { Card, Button } from 'reactstrap'
import { FaPause, FaPlay } from 'react-icons/fa'
import VisibilitySensor from 'react-visibility-sensor'

export default class QuoteVideo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      paused: true
    }
  }

  playVid = () => {
    const { vid } = this.refs

    if(vid.paused) {
      vid.play()
      this.setState({ ...this.state, paused: false })
    } else {
      vid.pause()
      this.setState({ ...this.state, paused: true })
    }
  }

  buttonPlay = e => {
    e.preventDefault();
    this.playVid();
  }

  render() {
    const isMobile = window.innerWidth < 576

    return(
      <div
        className="carousel slide carousel-team"
        id="carousel-testimonials3"
      >
        <div className="carousel-inner">
          <div className="carousel-item active">
            <div className={`info info-${this.props.right && !isMobile ? "right" : "left"} text-left bg-primary`}>
              <div className="icon icon-white">
                <i className="fa fa-quote-right" />
              </div>
              <p className="description text-white">
                {this.props.children}
              </p>
              <div className="author d-inline-flex" style={{ height: "50px" }}>
                <img
                  alt="..."
                  className="avatar img-raised mt-auto mb-auto"
                  style={{ width: "40px", height: "40px" }}
                  src={this.props.avatar ? this.props.avatar : require("../../assets/site/img/p10.jpg")}
                />
                <p className="mt-auto mb-auto description text-white pt-0 pb-0 pl-3 pr-0" style={{ fontSize:"24px" }}>{this.props.artist ? this.props.artist : "No artist"}</p>
              </div>
            </div>
            <Card
              className={`card-blog card-background video-card ${this.props.right && !isMobile ? "card-left" : "card-right"} ${isMobile ? " mt-0" : ""}`}
              style={!isMobile ? { height: "auto" } : { minHeight: "200px", height: "auto" }}
              data-animation={true}
            >
              <div className="header-video overlay card-video" style={!isMobile ? { height: "auto" } : {}}>
                <video fluid
                  ref="vid"
                  controls={isMobile ? true : false}
                  preload="metadata"
                >
                  <source
                    src={this.props.video ? this.props.video : require("../../assets/site/img/dj-cmix-bdv.mp4")}
                    type="video/mp4"
                  />
                </video>
                {!isMobile ? <div className={`d-flex justify-content-${this.state.paused ? "center" : "start"} align-items-${this.state.paused ? "center" : "end"} card-video-controls ${this.state.paused ? "" : "playing"}`}>
                  <Button
                    className={`btn-icon btn-neutral btn-round btn-simple ${this.state.paused ? "ml-0" : "ml-2 mb-2"}`}
                    size={this.state.paused ? "lg" : "sm"}
                    color="primary"
                    onClick={!isMobile ? e => this.buttonPlay(e) : null}
                  >
                    <div style={{ width: "100%", height: "100%" }} className="d-flex justify-content-center align-items-center">
                      {this.state.paused ?
                        <FaPlay className="ml-1" fontSize="30px" />
                        :
                        <FaPause fontSize="16px" />
                      }
                    </div>
                  </Button>
                </div> : null}
              </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }
}