import Statscis from "../Components/Statscis";
import moment from "moment";
import { ColumnsChart } from "../Components/Charts/Column";
import { MostSale } from "../Components/MostSale";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  Col,
  Row,
  Card,
  Layout,
  Divider,
  Statistic,
  DatePicker,
  Space,
  Tooltip,
} from "antd";
//const { RangePicker } = DatePicker;
import { getDashBoardData, requestData } from "../Methods/DataApi";
const { Header, Footer, Sider, Content } = Layout;

const DashBoard = (props) => {
  const [dailyRevnue, setDailyRevnue] = useState();
  const [dailyExpense, setDailyExpense] = useState();
  const [dailyProfit, setDailyProfit] = useState();

  let [dateFrom, setDateFrom] = useState();
  //moment().startOf("year").format("yyyyMMDD")
  let [dateTo, setDateTo] =
    useState(/*moment().endOf("year").format("yyyyMMDD")*/);

  const [statsRevnue, setStatsRevnue] = useState(0);
  const [statsExpense, setStatsExpense] = useState(0);
  const [statsProfit, setStatsProfit] = useState(0);

  let [statsTitle, setStatsTitle] = useState("Yearly");

  let [isDone, setIsDone] = useState(false);

  const [revExpSummary, setRevExpSummary] = useState();

  let [radioValue, setRadioValue] = useState(statsTitle);

  const formatDate = function (pdate, pformat = "dd/mm/yyyy") {
    let value = String(pdate);

    value =
      value.substring(0, 4) + value.substring(4, 6) + value.substring(6, 9);
    //return;
    let datt = `
            ${value.substring(6, 9).padStart(2, "0")}/${+value
      .substring(4, 6)
      .padStart(2, "0")}/${value.substring(0, 4)}
      `;
    return datt;
  };
  let activeButnClass = `flex h-full items-center justify-center rounded-full bg-gradient-to-r from-blue-300 to-blue-500 px-4 text-xl text-white hvr-float-shadow`;
  let notActiveButnClass = `flex h-full items-center justify-center rounded-full px-4 text-xl transition-all duration-150 ease-in-out hover:bg-blue-500/10 hvr-float-shadow`;
  let sysdate = moment();
  let Periods = {
    Yearly: [
      moment().startOf("year").format("yyyyMMDD"),
      moment().endOf("year").format("yyyyMMDD"),
    ],
    Quarter1: [
      sysdate.startOf("year").add(0, "Q").format("yyyyMMDD"),
      sysdate
        .startOf("year")
        .add(1, "Q")
        .subtract(1, "days")
        .format("yyyyMMDD"),
    ],
    Quarter2: [
      +sysdate.startOf("year").add(1, "Q").format("yyyyMMDD"),
      +sysdate
        .startOf("year")
        .add(2, "Q")
        .subtract(1, "days")
        .format("yyyyMMDD"),
    ],
    Quarter3: [
      sysdate.startOf("year").add(2, "Q").format("yyyyMMDD"),
      sysdate
        .startOf("year")
        .add(3, "Q")
        .subtract(1, "days")
        .format("yyyyMMDD"),
    ],
    Quarter4: [
      sysdate.startOf("year").add(3, "Q").format("yyyyMMDD"),
      sysdate
        .startOf("year")
        .add(4, "Q")
        .subtract(1, "days")
        .format("yyyyMMDD"),
    ],
    Monthly: [
      moment().startOf("month").format("yyyyMMDD"),
      moment().endOf("month").format("yyyyMMDD"),
    ],
    Weekly: [
      moment().startOf("week").format("yyyyMMDD"),
      moment().endOf("week").format("yyyyMMDD"),
    ],
  };

  const RaidoGroup = () => {
    let vals = [
      "Yearly",
      "Quarter 1",
      "Quarter 2",
      "Quarter 3",
      "Quarter 4",
      "Monthly",
      "Weekly",
    ];

    return (
      <div className="flex items-center justify-between ml-96 mt-8 mb-8">
        <div className="flex h-14 items-center space-x-1 rounded-full  bg-slate-200 p-2 ml-64 ">
          {vals.map((e, i) => (
            <Tooltip
              key={i}
              placement="topLeft"
              title={`From ${formatDate(
                Periods[e.replace(/\s/g, "")][0]
              )} To ${formatDate(Periods[e.replace(/\s/g, "")][1])}`}
            >
              <button
                onClick={() => chngRaido(e)}
                //className="flex h-full items-center justify-center rounded-full bg-gradient-to-r from-blue-300 to-blue-500 px-4 text-xl text-white"
                className={
                  radioValue === e ? activeButnClass : notActiveButnClass
                }
              >
                {e}
              </button>
            </Tooltip>
          ))}
        </div>
      </div>
    );
  };

  useEffect(() => {
    let dataDaily = props.dataDaily;

    let dataYearly = props.dataYearly;
    console.log(`dataYearly`, dataYearly);
    setDailyRevnue(
      dataDaily
        ?.filter((e) => e.TYPE === "REVENUE")
        .map((e) => e.AMOUNT)
        .reduce((e, c) => e + c, 0)
    );

    setDailyExpense(
      dataDaily
        ?.filter((e) => e.TYPE === "EXPENSES")
        .map((e) => e.AMOUNT)
        .reduce((e, c) => e + c, 0)
    );

    setDailyProfit(
      dataDaily
        ?.filter((e) => e.TYPE === "PROFIT")
        .map((e) => e.AMOUNT)
        .reduce((e, c) => e + c, 0)
    );

    setStatsExpense(
      dataYearly
        ?.filter((e) => e.TYPE === "EXPENSES")
        .map((e) => e.AMOUNT)
        .reduce((e, c) => e + c, 0)
    );

    setStatsRevnue(
      dataYearly
        ?.filter((e) => e.TYPE === "REVENUE")
        .map((e) => e.AMOUNT)
        .reduce((e, c) => e + c, 0)
    );

    setStatsProfit(
      dataYearly
        ?.filter((e) => e.TYPE === "PROFIT")
        .map((e) => e.AMOUNT)
        .reduce((e, c) => e + c, 0)
    );
    setIsDone(true);

    setRevExpSummary(props.dataExpRev);
  }, []);

  const chngRaido = (value) => {
    //let data = itemsDataRaw;

    //return;
    let dates = Periods[value.replace(/\s/g, "")];

    if (dates.length === 0) return;

    setDateFrom(dates[0]);
    setDateTo(dates[1]);

    setRadioValue(value);
    setStatsTitle(value);

    console.log(`chng Radio `, value);
    console.log(`current class `, activeButnClass);
  };

  useEffect(() => {
    if (dateFrom === undefined || dateTo === undefined) return;
    setIsDone(false);
    fetch(
      `http://localhost:3000/api/getDashBoardData?inquery=null&dfrom=${dateFrom}&dto=${dateTo}`
    )
      //getDashBoardData(null, dateFrom, dateTo)
      .then((rsp) => rsp.json())
      .then((data) => {
        setStatsExpense(
          data
            ?.filter((e) => e.TYPE === "EXPENSES")
            .map((e) => e.AMOUNT)
            .reduce((e, c) => e + c, 0)
        );

        setStatsRevnue(
          data
            ?.filter((e) => e.TYPE === "REVENUE")
            .map((e) => e.AMOUNT)
            .reduce((e, c) => e + c, 0)
        );

        setStatsProfit(
          data
            ?.filter((e) => e.TYPE === "PROFIT")
            .map((e) => e.AMOUNT)
            .reduce((e, c) => e + c, 0)
        );
        setIsDone(true);
      });
  }, [dateFrom, dateTo]);

  return (
    <>
      <Layout hasSider={false}>
        <Content
          style={{
            padding: "4rem",
            paddingLeft: "19rem",
            margin: 0,
            minHeight: 220,
            backgroundColor: "transparent",
          }}
        >
          <Divider>Daily Transctions</Divider>

          <div className="flex  ml-9 	 justify-evenly">
            <div className="flex  xl:w-96 md:w-64 lg:w-16  ">
              <Statscis
                value={new Intl.NumberFormat("en-us").format(dailyRevnue)}
                title="Daily Revnue"
                type={"revnue"}
                isDone={true}
              />
            </div>

            <div className="flex  xl:w-96  lg:w-64 md:w-16">
              <Statscis
                value={new Intl.NumberFormat("en-us").format(dailyExpense)}
                title="Daily Expense"
                type={"expense"}
                isDone={true}
              />
            </div>
            <div className="flex  xl:w-96  lg:w-64 md:w-16">
              <Statscis
                value={new Intl.NumberFormat("en-us").format(dailyProfit)}
                title="Daily Profit"
                type={"profit"}
                isDone={true}
              />
            </div>
          </div>
          <Divider>Transctions</Divider>

          {RaidoGroup()}
          <div className="flex  ml-9  justify-evenly">
            <div className="flex xl:w-96  lg:w-64 md:w-16 ">
              <Statscis
                value={new Intl.NumberFormat("en-us").format(statsRevnue)}
                title={`${statsTitle} Revnue`}
                type={"revnue"}
                isDone={isDone}
              />
            </div>

            <div className="flex xl:w-96  lg:w-64 md:w-16">
              <Statscis
                value={new Intl.NumberFormat("en-us").format(statsExpense)}
                title={`${statsTitle} Expense`}
                type={"expense"}
                isDone={isDone}
              />
            </div>
            <div className="flex   xl:w-96  lg:w-64 md:w-16">
              <Statscis
                value={new Intl.NumberFormat("en-us").format(statsProfit)}
                title={`${statsTitle}   Profit`}
                type={"profit"}
                isDone={isDone}
              />
            </div>
          </div>
          <Divider>Monthly Transctions</Divider>

          <div className="  flex justify-around  max-w-full	 		">
            <Card
              bordered={false}
              hoverable="true"
              style={{
                //width: "60.5rem",
                minHeight: "15.9rem",
                maxHeight: "36.9rem",
                //marginLeft: "6.45rem",
                borderRadius: "2%",
                backgroundColor: /*"transparent"*/ "rgb(55 65 81)",
                minWidth: "50%",
                maxWidth: "100%",
              }}
              className="glassy bg-gray-700 "
            >
              <ColumnsChart
                data={revExpSummary}
                title={"Revnue & Expenses Summary"}
                finish={true}
                bgcolor={"rgb(55 65 81)"}
              />
            </Card>
            <div className="">{<MostSale title={"Total Class Sales"} />}</div>
          </div>
        </Content>
      </Layout>
    </>
  );
};

export default DashBoard;

export async function getServerSideProps(context) {
  const today = moment();
  /* get Daily */

  let curDate = moment().format("yyyyMMDD");
  //let curDate = "20161205";
  /*let rqs = await fetch(
    `http://localhost:3000/api/getDashBoardData?inquery=null&dfrom=${curDate}&dto=${curDate}`
  );
  const dataDaily = await rqs.json();*/
  const dataDaily = await getDashBoardData(null, curDate, curDate);

  /*get Weekly */
  /*let from_date = today.startOf("week").format("yyyyMMDD");
  let to_date = today.endOf("week").format("yyyyMMDD");
  rqs = await fetch(
    `http://localhost:3000/api/getDashBoardData?inquery=null&dfrom=${20220101}&dto=${20220801}`
  );
  const dataWeekly = await rqs.json();*/
  let dataWeekly;

  /* get Yearly */
  let from_date = today.startOf("year").format("yyyyMMDD");
  let to_date = today.endOf("year").format("yyyyMMDD");
  /*rqs = await fetch(
    `http://localhost:3000/api/getDashBoardData?inquery=null&dfrom=${from_date}&dto=${to_date}`
  );*/
  //let dataYearly = await rqs.json();
  let dataYearly = await getDashBoardData(null, from_date, to_date);

  /* get rexExpSummary */
  /*rqs = await fetch(
    `http://localhost:3000/api/requestData?inquery=REVEXPSUMMARY&dfrom=${20220101}&dto=${20221231}`
  );
  let dataExpRev = await rqs.json();*/
  let dataExpRev = await requestData("REVEXPSUMMARY", 20220101, 20221231);

  return {
    props: {
      dataDaily: dataDaily || [],
      dataWeekly: dataWeekly || [],
      dataYearly: dataYearly || [],
      dataExpRev: dataExpRev || [],
    }, // will be passed to the page component as props
  };
}
