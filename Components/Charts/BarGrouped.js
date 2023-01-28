import { CodeSandboxCircleFilled } from "@ant-design/icons";
import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});
import { Skeleton } from "antd";

export const BarChartGrouped = (props) => {
  let vdata = props.data || [{ n: 0 }];

  let finish = props.finish;
  if (finish === false || vdata.length === 0) {
    return <Skeleton active />;
  }
  let vSeries = [];
  let vType = props.type || "bar";
  let vSize = props.size || "70%";
  let vTitle = props.title || "70%";
  let vCatg = [];

  let vHeight = props.height || 1000;

  let obKeys = [];
  let defaultArr = [0, 0, 0];
  vCatg = props.catg || [];
  let vSeries1 = props.series1;
  let vSeries2 = props.series2;

  if (vSeries1.length < 3) {
    vSeries1 = [...vSeries1, ...defaultArr];
  }

  /** */

  //console.log(vSeries.map((e) => sumArray(e)));

  const state = {
    series: [
      {
        data: vSeries1,
        name: `${props.type1}   QTY`,
      },
      {
        data: vSeries2,
        name: `${props.type2}   QTY`,
      },
    ],
    options: {
      chart: {
        type: vType,
        // type: "numeric",

        height: vCatg.length * 20,
        // width: "100%",
        //redrawOnParentResize: true,
      },
      title: {
        text: vTitle,
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: true,
          //barHeight: "80%",
          columnWidth: "45%",
          //distributed: true,
        },
      },
      dataLabels: {
        enabled: true,
      },
      legend: {
        show: true,
      },
      stroke: {
        width: 2,
      },

      // grid: {
      //   row: {
      //     colors: ["#fff", "#f2f2f2"],
      //   },
      // },

      xaxis: {
        categories: vCatg,
        //floating: true,
        tickPlacement: "on",
      },
      responsive: [
        {
          breakpoint: 1000,
          options: {
            plotOptions: {
              bar: {
                horizontal: false,
              },
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
      // responsive: [
      //   {
      //     breakpoint: undefined,
      //     options: {},
      //   },
      // ],
      tooltip: {
        z: {
          formatter: undefined,
          title: "Size: ",
        },
      },
    },
  };

  return (
    <div
      id="chart"
      //style={{ height: "100%", width: "100%", overflowY: "scroll" }}
      //style={{ height: "100%", width: "50%" ,}}
      style={{
        minHeight: "200px",
        maxHeight: "500px",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <ReactApexChart
        options={state.options}
        series={state.series}
        type={vType}
      />
    </div>
  );
};
