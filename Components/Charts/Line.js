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

        zoom: {
          enabled: true,
          type: "x",
          autoScaleYaxis: false,
          zoomedArea: {
            fill: {
              color: "#90CAF9",
              opacity: 0.4,
            },
            stroke: {
              color: "#0D47A1",
              opacity: 0.4,
              width: 1,
            },
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      grid: {
        borderColor: "#90A4AE",
        strokeDashArray: 0,
        position: "back",
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
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
