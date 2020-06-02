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
// used for making the prop types of this component
import PropTypes from "prop-types";

import { Bar } from "react-chartjs-2";

class BarGraph extends React.Component {
  constructor(props) {
    super(props);
  }

  makeLabelArray = (label, maxWidth) => {
    var sections = [], words = label.split(" "), temp = ""

    words.forEach((value, index) => {
      if(temp.length > 0) {
        var concat = temp + " " + value

        if(concat.length > maxWidth) {
          sections.push(temp)
          temp = ""
        } else {
          if(index == words.length-1) {
            sections.push(concat)
            return
          } else {
            temp = concat
            return
          }
        }
      } 

      if(index == words.length-1) {
        sections.push(value)
        return
      }

      if(value.length < maxWidth) {
        temp = value
      } else {
        sections.push(value)
      }
    })

    return sections
  }

  render() {
    const data = canvas => {
      let ctx = canvas.getContext("2d");
      let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);
      gradientStroke.addColorStop(1, "rgba(72,72,176,0.1)");
      gradientStroke.addColorStop(0.4, "rgba(72,72,176,0.0)");
      gradientStroke.addColorStop(0, "rgba(119,52,169,0)"); //purple colors

      return {
        labels: this.props.labels,
        datasets: [
          {
            label: this.props.data_label,
            fill: true,
            backgroundColor: gradientStroke,
            hoverBackgroundColor: gradientStroke,
            borderColor: "#7248BD",
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            data: this.props.data
          }
        ]
      };
    }

    const getMinAndMax = points => {
      var min = points[0], max = points[0]

      for(let i = 1; i < points.length; i++) {
        if(min > points[i]) min = points[i]

        if(max < points[i]) max = points[i]
      }

      return { min, max }
    }

    const minMax = getMinAndMax(this.props.data)

    const options = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      tooltips: {
        backgroundColor: "#f5f5f5",
        titleFontColor: "#333",
        bodyFontColor: "#666",
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest"
      },
      responsive: true,
      scales: {
        yAxes: [
          {
            gridLines: {
              drawBorder: false,
              color: "rgba(225,78,202,0.1)",
              zeroLineColor: "transparent"
            },
            ticks: {
              suggestedMin: 0,
              suggestedMax: minMax.max != 0 ? minMax.max : 10,
              padding: 20,
              fontColor: "#9e9e9e"
            }
          }
        ],
        xAxes: [
          {
            gridLines: {
              drawBorder: false,
              color: "rgba(225,78,202,0.1)",
              zeroLineColor: "transparent"
            },
            ticks: {
              callback: label => (this.makeLabelArray(label, 15)),
              padding: 20,
              fontColor: "#9e9e9e",
              autoSkip: false,
              minRotation: 30,
              maxRotation: 30
            }
          }
        ]
      }
    }

    return (
      <div className="chart-area">
        <Bar
          data={data}
          options={options}
        />
      </div>
    );
  }
}

// BarGraph.propTypes = {
//   data: PropTypes.bool,
// };

export default BarGraph;
