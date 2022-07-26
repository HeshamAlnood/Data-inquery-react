import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export const AreaChart = (props) => {
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

  state = {
    series: [
      {
        name: "series1",
        data: vSeries1,
      },
      {
        name: "series2",
        data: vSeries2,
      },
    ],
    options: {
      chart: {
        height: 350,
        type: vType,
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
      },
      tooltip: {
        x: {
          format: "dd/MM/yy",
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
