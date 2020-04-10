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
import { Card } from 'reactstrap'

export default class QuoteVideo extends React.Component {
  constructor(props) {
    super(props)
  }

  playVid = () => {
    const { vid } = this.refs

    if(vid.paused)
      vid.play()
    else
      vid.pause()
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
            <div className={`info ${this.props.right && !isMobile ? "info-right" : ""} text-left bg-primary`}>
              <div className="icon icon-white">
                <i className="fa fa-quote-right" />
              </div>
              <p className="description text-white">
                {this.props.children}
              </p>
              <div className="author">
                <img
                  alt="..."
                  className="avatar img-raised"
                  src={this.props.avatar ? this.props.avatar : require("../../assets/site/img/p10.jpg")}
                />
                <span>{this.props.artist ? this.props.artist : "No artist"}</span>
              </div>
            </div>
            <Card
              className={`card-blog card-background ${this.props.right && !isMobile ? "card-left" : ""} ${isMobile ? " mt-0" : ""}`}
              style={!isMobile ? { height: "641px" } : { minHeight: "200px", height: "auto" }}
              data-animation={true}
              onClick={!isMobile ? this.playVid.bind(this) : null}
            >
              <div className="header-video overlay card-video" style={!isMobile ? { height: "641px" } : {}}>
                <video fluid
                  ref="vid"
                  controls={isMobile ? true : false}
                >
                  <source
                    src={this.props.video ? this.props.video : require("../../assets/site/img/dj-cmix-bdv.mp4")}
                    type="video/mp4"
                  />
                </video>
              </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }
}