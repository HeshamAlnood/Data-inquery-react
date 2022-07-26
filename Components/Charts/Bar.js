import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});
import {
  returnObjectSumm,
  groupObject,
  returnObjectProperty,
  groupBySum,
  sumArray,
} from "../../Methods/arreayFn";

export const BarChart = (props) => {
  let vSeries = props.series || [
    400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380,
  ];
  let vType = props.type || "bar";
  let vSize = props.size || "70%";
  let vTitle = props.title || "70%";
  let vCatg = props.catg || [
    "South Korea",
    "Canada",
    "United Kingdom",
    "Netherlands",
    "Italy",
    "France",
    "Japan",
    "United States",
    "China",
    "Germany",
  ];

  console.log(`vSeries
  .length`);
  console.log(vSeries.length);

  /*vSeries.forEach((e, i) => {
    console.log(sumArray(e));
    e[i] = sumArray(e[i]);
  });*/

  console.log(vSeries.map((e) => sumArray(e)));
  //console.log(vSeries);
  let vLabel = props.label;
  let vHeight = props.height || 1000;

  const state = {
    series: [
      {
        data: vSeries.map((e) => sumArray(e)),
        name: `${vTitle} Amount`,
      },
    ],
    options: {
      chart: {
        type: vType,
        height: vHeight,
      },
      title: {
        text: vTitle,
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: true,
      },
      xaxis: {
        categories: vCatg,
      },
    },
  };
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
