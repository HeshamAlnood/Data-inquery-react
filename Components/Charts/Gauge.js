import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export const RadialFullChart = (props) => {
  let vSeries = props.series || 70;
  let vType = props.type || "radialBar";
  let vSize = props.size || "70%";
  let vLabel = props.label;
  let vHeight = props.height || 350;

  const state = {
    series: [vSeries],
    options: {
      chart: {
        height: 350,
        type: vType,
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: vSize,
          },
        },
      },
      labels: [vLabel],
    },
  };

  return (
    <div>
      <ReactApexChart
        options={state.options}
        series={state.series}
        type={vType}
        height={350}
      />
    </div>
  );
};

export const SemiCircleGaugeChart = (props) => {
  let vSeries = props.series || 70;
  let vType = props.type || "radialBar";
  let vSize = props.size || "70%";
  let vLabel = props.label;
  let vHeight = props.height || 350;

  const state = {
    series: [vSeries],
    options: {
      chart: {
        type: vType,
        offsetY: -20,
        sparkline: {
          enabled: true,
        },
      },
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 90,
          track: {
            background: "#e7e7e7",
            strokeWidth: "97%",
            margin: 5, // margin is in pixels
            dropShadow: {
              enabled: true,
              top: 2,
              left: 0,
              color: "#999",
              opacity: 1,
              blur: 2,
            },
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              offsetY: -2,
              fontSize: "22px",
            },
          },
        },
      },
      grid: {
        padding: {
          top: -10,
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          shadeIntensity: 0.4,
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 50, 53, 91],
        },
      },
      labels: [vLabel],
    },
  };

  return (
    <div>
      <ReactApexChart
        options={state.options}
        series={state.series}
        type={vType}
        height={350}
      />
    </div>
  );
};
