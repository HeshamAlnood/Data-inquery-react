import { CodeSandboxCircleFilled } from "@ant-design/icons";
import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});
import { Skeleton } from "antd";

export const BarChart = (props) => {
  let vdata = props.data;
  console.log("data of class item");
  console.log(vdata);

  let finish = props.finish;
  if (finish === false) {
    return <Skeleton active />;
  }
  let vSeries = [];
  let vType = props.type || "bar";
  let vSize = props.size || "70%";
  let vTitle = props.title || "70%";
  let vCatg = [];

  let vHeight = props.height || 1000;

  let obKeys = [];
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
  });

  //console.log(vSeries.map((e) => sumArray(e)));
  console.log(`key In BARCHART`);
  console.log(key);

  console.log(`vSeries In BARCHART`);
  console.log(vSeries);
  console.log(`vCatg In BARCHART`);
  console.log(vCatg);

  const state = {
    series: [
      {
        //vSeries.map((e) => sumArray(e)),
        data: vSeries,
        name: `${vTitle} : Amount`,
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
      />
    </div>
  );
};
