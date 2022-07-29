import dynamic from "next/dynamic";
import { Skeleton } from "antd";
import moment from "moment";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export const SparkLine = (props) => {
  let vdata = props.data;

  let vTitle = props.title;
  let vDataType = props.dataType;
  let vColor = props.color;

  let finish = props.finish;
  if (finish === false) {
    return <Skeleton active />;
  }

  var sparklineData = [];

  let vMonth = [];
  let vYear;
  let vSum;

  vdata.forEach((e) => {
    if (e.TYPE === vDataType) {
      sparklineData.push(Math.trunc(e.AMOUNT, 2));
    }

    vMonth.push(e.MONTH);
    vYear = e.YEAR;
  });

  vSum = sparklineData.reduce((a, b) => a + b, 0);

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

  const state = {
    series: [
      {
        data: sparklineData,
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
      colors: [vColor],
      title: {
        text: new Intl.NumberFormat("en-us").format(vSum) + " SR",
        offsetX: 0,
        style: {
          fontSize: "24px",
        },
      },
      subtitle: {
        text: vTitle || "Sales",
        offsetX: 0,
        style: {
          fontSize: "14px",
        },
      },
    },
  };

  return (
    <ReactApexChart
      options={state.options}
      series={state.series}
      type="area"
      height={160}
    />
  );
};
