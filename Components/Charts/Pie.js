import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});
import { Skeleton } from "antd";

const pieRose = (props) => {
  let vdata = props.data;
  let vTitle = props.titile;
  let finish = props.finish;
  let vSeries = [];

  if (finish === false || vdata.length === 0) {
    return <Skeleton active />;
  }

  let obKeys = [];
  Object.keys(vdata[0])?.forEach((e) => {
    obKeys.push(e);
  });

  let key;
  let vLabel = [];
  obKeys.forEach((e) => {
    vdata.forEach((el) => {
      if (Number.isFinite(el[e])) key = e;
      if (isNaN(el[e])) vLabel.push(el[e]);
    });
  });

  vdata.forEach((e) => {
    vSeries.push(e[key]);
  });

  let state = {
    series: vSeries || [42, 47, 52, 58, 65],
    options: {
      chart: {
        width: 250,
        //hight: 600,
        type: "polarArea",
      },
      labels: vLabel || ["Rose A", "Rose B", "Rose C", "Rose D", "Rose E"],
      fill: {
        opacity: 1,
      },
      stroke: {
        width: 1,
        colors: undefined,
      },
      yaxis: {
        show: false,
      },

      plotOptions: {
        polarArea: {
          rings: {
            strokeWidth: 0,
          },
          spokes: {
            strokeWidth: 0,
          },
        },
      },
      theme: {
        /* monochrome: {
          enabled: true,
          color: "#255aee",
          shadeTo: "light",
          shadeIntensity: 0.6,
        },*/
        colors: ["#F44336", "#E91E63", "#9C27B0"],
      },
      title: {
        text: vTitle,
        align: "left",
        margin: 10,
        offsetX: 0,
        offsetY: 0,
        floating: false,
        style: {
          fontSize: "14px",
          fontWeight: "bold",
          fontFamily: undefined,
          color: "#263238",
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "left",
              formatter: function (val, opts) {
                return val + " - " + opts.w.globals.series[opts.seriesIndex];
              },
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
        type="polarArea"
        width={500}
      />
    </div>
  );
};

export default pieRose;
