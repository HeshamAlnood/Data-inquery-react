import React from "react";
import dynamic from "next/dynamic";
import { Container, Row, Card, Text } from "@nextui-org/react";

//import ReactApexChart from "react-apexcharts";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

class ApexChart extends React.Component {
  constructor(props) {
    super(props);

    console.log(`Start ApexCharts`);

    var sparklineData = [
      47, 45, 54, 38, 56, 24, 65, 31, 37, 39, 62, 51, 35, 41, 35, 27, 93, 53,
      61, 27, 54, 43, 19, 46,
    ];

    this.state = {
      series: [
        {
          data: sparklineData, //randomizeArray(sparklineData),
        },
      ],
      options: {
        chart: {
          type: "area",
          height: 160,
          sparkline: {
            enabled: true,
          },
        },
        stroke: {
          curve: "straight",
        },
        fill: {
          opacity: 0.3,
        },
        yaxis: {
          min: 0,
        },
        colors: ["#81b878"],
        title: {
          text: "$424,652",
          offsetX: 0,
          style: {
            fontSize: "24px",
          },
        },
        subtitle: {
          text: "Sales",
          offsetX: 0,
          style: {
            fontSize: "14px",
          },
        },
      },

      seriesSpark2: [
        {
          data: sparklineData,
        },
      ],
      optionsSpark2: {
        chart: {
          type: "area",
          height: 160,
          sparkline: {
            enabled: true,
          },
        },
        stroke: {
          curve: "straight",
        },
        fill: {
          opacity: 0.3,
        },
        yaxis: {
          min: 0,
        },
        colors: ["#FFCF36"],
        title: {
          text: "$235,312",
          offsetX: 0,
          style: {
            fontSize: "24px",
          },
        },
        subtitle: {
          text: "Expenses",
          offsetX: 0,
          style: {
            fontSize: "14px",
          },
        },
      },

      seriesSpark3: [
        {
          data: sparklineData,
        },
      ],
      optionsSpark3: {
        chart: {
          type: "area",
          height: 160,
          sparkline: {
            enabled: true,
          },
        },
        stroke: {
          curve: "straight",
        },
        fill: {
          opacity: 0.3,
        },
        xaxis: {
          crosshairs: {
            width: 1,
          },
        },
        yaxis: {
          min: 0,
        },
        title: {
          text: "$135,965",
          offsetX: 0,
          style: {
            fontSize: "24px",
          },
        },
        subtitle: {
          text: "Profits",
          offsetX: 0,
          style: {
            fontSize: "14px",
          },
        },
      },

      areaoptions: {
        xaxis: {
          categories: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
      },
      areaseries: [
        {
          name: "series-1",
          data: [30, 40, 25, 50, 49, 21, 70, 51],
        },
        {
          name: "series-2",
          data: [23, 12, 54, 61, 32, 56, 81, 19],
        },
      ],
    };
  }

  render() {
    return (
      <div className="md:container md:mx-auto">
        <div className="article bg-slate-50">
          <div className="row">
            <div className="col-md-4 ">
              <div className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7]">
                <div className="p-4 md:p-10">
                  <div id="chart-spark1">
                    <ReactApexChart
                      options={this.state.options}
                      series={this.state.series}
                      type="area"
                      height={160}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 flex flex-col bg-white border shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7]">
              <div className="p-4 md:p-10">
                <div id="chart-spark2">
                  <ReactApexChart
                    options={this.state.optionsSpark2}
                    series={this.state.seriesSpark2}
                    type="area"
                    height={160}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="col-md-4 flex flex-col bg-white border shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7]">
                <div className="p-4 md:p-10">
                  <div id="chart-spark3">
                    <ReactApexChart
                      options={this.state.optionsSpark3}
                      series={this.state.seriesSpark3}
                      type="area"
                      height={160}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4 flex flex-col bg-white border shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7]">
            <div className="p-4 md:p-10">
              <div className="area">
                <ReactApexChart
                  options={this.state.areaoptions}
                  series={this.state.areaseries}
                  type="area"
                  width="1200"
                />
              </div>
            </div>
          </div>
        </div>
        <div id="html-dist"></div>
      </div>
    );
  }
}
export default ApexChart;
