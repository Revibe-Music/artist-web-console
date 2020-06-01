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

import { Line } from "react-chartjs-2";

class LineGraph extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props)

    const data = canvas => {
      let ctx = canvas.getContext("2d");
      let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);
      gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
      gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
      gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors

      return {
        labels: this.props.labels,
        datasets: [
          {
            label: this.props.data_label,
            fill: true,
            backgroundColor: gradientStroke,
            borderColor: "#7248BD",
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: "#7248BD",
            pointBorderColor: "rgba(255,255,255,0)",
            pointHoverBackgroundColor: "#7248BD",
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
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
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: "rgba(29,140,248,0.0)",
              zeroLineColor: "transparent"
            },
            ticks: {
              suggestedMin: minMax.min,
              suggestedMax: (minMax.max != 0 ? minMax.max : 10),
              padding: 20,
              fontColor: "#9a9a9a"
            }
          }
        ],
        xAxes: [
          {
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: "rgba(29,140,248,0.1)",
              zeroLineColor: "transparent"
            },
            ticks: {
              padding: 20,
              fontColor: "#9a9a9a"
            }
          }
        ]
      }
    };

    return (
      <div className="chart-area">
        <Line
          data={data}
          options={options}
        />
      </div>
    );
  }
}

// LineGraph.propTypes = {
//   data: PropTypes.bool,
// };

export default LineGraph;
