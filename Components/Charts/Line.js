import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export const AreaChart = (props) => {
  console.log(`props AreaChart`, props);
  let vSeries1 = props.series1 || [31, 40, 28, 51, 42, 109, 100];
  let vSeries2 = props.series2 || [11, 32, 45, 32, 34, 52, 41];
  let vType = props.type || "area";
  let vSize = props.size || "70%";
  let vLabel = props.label;
  let vHeight = props.height || 350;
  let vCatg = props.catg || [
    "2018-09-19T00:00:00.000Z",
    "2018-09-19T01:30:00.000Z",
    "2018-09-19T02:30:00.000Z",
    "2018-09-19T03:30:00.000Z",
    "2018-09-19T04:30:00.000Z",
    "2018-09-19T05:30:00.000Z",
    "2018-09-19T06:30:00.000Z",
  ];

  let state = {
    series: [
      {
        name: props.seriesLabel1,
        data: vSeries1,
      },
      {
        name: props.seriesLabel2,
        data: vSeries2,
      },
    ],
    options: {
      chart: {
        height: 350,
        type: vType,
        background: "transparent",
        foreColor: "white",

        zoom: {
          enabled: true,
          type: "x",
          autoScaleYaxis: false,
          zoomedArea: {
            fill: {
              //  color: "#90CAF9",
              color: "white",
              //opacity: 0.4,
            },
            stroke: {
              color: "#0D47A1",
              //  opacity: 0.4,
              width: 1,
            },
          },
        },
      },
      markers: {
        size: 5,
        //  colors: ["white"],
        strokeColor: "white",
        strokeWidth: 3,
        tooltip: {
          shared: false,
          intersect: true,
        },
        discrete: [
          {
            seriesIndex: 0,
            dataPointIndex: 7,
            fillColor: "#e3e3e3",
            strokeColor: "#fff",
            size: 5,
            shape: "square", // "circle" | "square" | "rect"
          },
          {
            seriesIndex: 2,
            dataPointIndex: 11,
            fillColor: "#f7f4f3",
            strokeColor: "#eee",
            size: 4,
            shape: "square", // "circle" | "square" | "rect"
          },
        ],
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },

      xaxis: {
        type: "datetime",
        categories: vCatg,
        tickPlacement: "on",
      },
      tooltip: {
        x: {
          format: "dd/MM/yyyy",
        },
      },
      lengend: {
        onItemClick: { toggleDataSeries: true },
        onItemHover: {
          highlightDataSeries: true,
        },
      },
    },
  };
  //}

  return (
    <div id="chart">
      <ReactApexChart
        options={state.options}
        series={state.series}
        type={vType}
        height={vHeight}
      />
    </div>
  );
};
