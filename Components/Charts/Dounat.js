import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});
import { Skeleton } from "antd";

export const DounatChart = (props) => {
  let vdata = props.data;
  let vSeries = [];
  let vType = props.type || "pie";
  let vSize = props.size || "70%";
  let vTitle = props.title;
  let vWidth = props.width || 500;

  let finish = props.finish;
  if (finish === false) {
    return <Skeleton active />;
  }

  console.log(vdata);

  let vHeight = props.height || 350;

  let obKeys = [];
  Object.keys(vdata[0]).forEach((e) => {
    obKeys.push(e);
  });

  let key;
  let vLabel = [];
  obKeys.forEach((e) => {
    console.log(`vdata[e]`);
    console.log(vdata[e]);
    vdata.forEach((el) => {
      if (Number.isFinite(el[e])) key = e;
      if (isNaN(el[e])) vLabel.push(el[e]);
    });
  });

  console.log(`print kkk ${key} on Dounat`);

  vdata.forEach((e) => {
    vSeries.push(e[key]);
  });
  console.log(vSeries);
  console.log(vLabel);

  const state = {
    series: vSeries,

    options: {
      chart: {
        width: 500,
        //height: 500,
        type: vType,
      },
      plotOptions: {
        pie: {
          startAngle: -90,
          endAngle: 270,
        },
      },
      labels: vLabel,
      dataLabels: {
        enabled: true,
      },
      fill: {
        type: "gradient",
      },
      legend: {
        itemMargin: {
          horizontal: 5,
          vertical: 0,
        },
        formatter: function (val, opts) {
          return val + " - " + opts.w.globals.series[opts.seriesIndex];
        },
      },
      title: {
        text: vTitle || "Most Customer Sales",
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
              height: 400,
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
        type={vType}
        width={vWidth}
      />
    </div>
  );
};
