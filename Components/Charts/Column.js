import { get } from "lodash";
import moment from "moment";
import dynamic from "next/dynamic";
import { Skeleton } from "antd";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});
export const ColumnsChart = (props) => {
  let vdata = props.data;
  /*console.log("data of Columns item");
  console.log(vdata);*/

  let finish = props.finish;
  if (finish === false || vdata.length === 0) {
    return <Skeleton active />;
  }

  let vSeriesRev = [];
  let vSeriesPro = [];
  let vSeriesExp = [];
  let vMonth = [];
  let vYear;

  vdata.forEach((e) => {
    if (e.TYPE === "REVENUE") {
      vSeriesRev.push(Math.trunc(e.AMOUNT, 2));
    } else if (e.TYPE === "PROFIT") {
      vSeriesPro.push(Math.trunc(e.AMOUNT, 2));
    } else if (e.TYPE === "EXPENSES") {
      vSeriesExp.push(Math.trunc(e.AMOUNT, 2));
    }

    vMonth.push(e.MONTH);
    vYear = e.YEAR;
  });

  vMonth = [...new Set(vMonth)];

  vMonth.forEach((e) => {
    e = moment()
      .month(e - 1)
      .format("MMMM");
  });
  let vMonthN = vMonth.map((e) =>
    moment()
      .month(e - 1)
      .format("MMMM")
  );
  console.log(`vMonthN`);
  console.log(vMonthN);

  let vType = props.type || "bar";
  let vSize = props.size || "70%";
  let vTitle = props.title || "70%";
  let vCatg = [];

  let vHeight = props.height || 1000;

  /*let obKeys = [];
  Object.keys(vdata[0]).forEach((e) => {
    obKeys.push(e);
  });

  let key;
  obKeys.forEach((e) => {
    console.log(`vdata[e]`);
    console.log(vdata[e]);
    vdata.forEach((el) => {
      if (Number.isFinite(el[e])) key = e;
      if (isNaN(el[e])) vCatg.push(el[e]);
    });
  });

  vdata.forEach((e) => {
    vSeries.push(e[key]);
  });*/

  const state = {
    series: [
      {
        name: "Revenue",
        data: vSeriesRev || [(44, 55, 57, 56, 61, 58, 63, 60, 66)],
      },
      {
        name: "Net Profit",
        data: vSeriesPro || [76, 85, 101, 98, 87, 105, 91, 114, 94],
      },
      {
        name: "Expenses",
        data: vSeriesExp || [35, 41, 36, 26, 45, 48, 52, 53, 41],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 500,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: vMonthN || [
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
        ],
      },
      yaxis: {
        title: {
          text: `Profit And Loss - Year ${vYear}`,
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "$ " + Math.trunc(val, 2) + " Riyals";
          },
        },
      },
    },
  };

  return (
    //<div id="chart">
    <ReactApexChart
      options={state.options}
      series={state.series}
      type="bar"
      height={550}
    />
    //</div>
  );
};
