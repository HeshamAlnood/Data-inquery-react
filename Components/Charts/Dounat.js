import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export const DounatChart = (props) => {
  let vSeries = props.series || [44, 55, 41, 17, 15];
  let vType = props.type || "donut";
  let vSize = props.size || "70%";
  let vLabel = props.label;
  let vHeight = props.height || 350;

  const state = {
    series: vSeries,
    options: {
      chart: {
        width: 380,
        type: vType,
      },
      plotOptions: {
        pie: {
          startAngle: -90,
          endAngle: 270,
        },
      },
      dataLabels: {
        enabled: false,
      },
      fill: {
        type: "gradient",
      },
      legend: {
        formatter: function (val, opts) {
          return val + " - " + opts.w.globals.series[opts.seriesIndex];
        },
      },
      title: {
        text: "Gradient Donut with custom Start-angle",
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  };

  return (
    <div>
      <ReactApexChart
        options={state.options}
        series={state.series}
        type={vType}
        width={380}
      />
    </div>
  );
};
