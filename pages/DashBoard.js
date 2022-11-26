import Statscis from "../Components/Statscis";
import moment from "moment";
import { ColumnsChart } from "../Components/Charts/Column";

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
} from "antd";
//const { RangePicker } = DatePicker;

const { Header, Footer, Sider, Content } = Layout;

const DashBoard = (props) => {
  const [dailyRevnue, setDailyRevnue] = useState();
  const [dailyExpense, setDailyExpense] = useState();
  const [dailyProfit, setDailyProfit] = useState();

  const [weeklyRevnue, setWeeklyRevnue] = useState();
  const [weeklyExpense, setweeklyExpense] = useState();
  const [weeklyProfit, setweeklyProfit] = useState();

  const [revExpSummary, setRevExpSummary] = useState();

  useEffect(() => {
    console.log(`print dashboard data `, props);
    let dataDaily = props.dataDaily;
    let dataWeekly = props.dataWeekly;

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

    setWeeklyRevnue(
      dataWeekly
        ?.filter((e) => e.TYPE === "REVENUE")
        .map((e) => e.AMOUNT)
        .reduce((e, c) => e + c, 0)
    );

    setweeklyExpense(
      dataWeekly
        ?.filter((e) => e.TYPE === "EXPENSES")
        .map((e) => e.AMOUNT)
        .reduce((e, c) => e + c, 0)
    );

    setweeklyProfit(
      dataWeekly
        ?.filter((e) => e.TYPE === "PROFIT")
        .map((e) => e.AMOUNT)
        .reduce((e, c) => e + c, 0)
    );
    setRevExpSummary(props.dataExpRev);
  }, []);

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
              />
            </div>

            <div className="flex  xl:w-96  lg:w-64 md:w-16">
              <Statscis
                value={new Intl.NumberFormat("en-us").format(dailyExpense)}
                title="Daily Expense"
                type={"expense"}
              />
            </div>
            <div className="flex  xl:w-96  lg:w-64 md:w-16">
              <Statscis
                value={new Intl.NumberFormat("en-us").format(dailyProfit)}
                title="Daily Profit"
                type={"profit"}
              />
            </div>
          </div>
          <Divider>Weekly Transctions</Divider>

          <div className="flex  ml-9  justify-evenly">
            <div className="flex  xl:w-96 md:w-64 lg:w-16">
              <Statscis
                value={new Intl.NumberFormat("en-us").format(weeklyRevnue)}
                title="Weekly Revnue"
                type={"revnue"}
              />
            </div>

            <div className="flex xl:w-96  lg:w-64 md:w-16">
              <Statscis
                value={new Intl.NumberFormat("en-us").format(weeklyExpense)}
                title="Weekly Expense"
                type={"expense"}
              />
            </div>
            <div className="flex   xl:w-96  lg:w-64 md:w-16">
              <Statscis
                value={new Intl.NumberFormat("en-us").format(weeklyProfit)}
                title="Weekly   Profit"
                type={"profit"}
              />
            </div>
          </div>
          <Divider>Monthly Transctions</Divider>

          <div className="    max-w-9xl 	 		">
            <Card
              bordered={false}
              hoverable="true"
              style={{
                //width: "60.5rem",

                height: "38.9rem",
                marginLeft: "6.45rem",
                borderRadius: "2%",
                backgroundColor: "transparent",
              }}
              className="glassy"
            >
              <ColumnsChart
                data={revExpSummary}
                title={"Revnue & Expenses Summary"}
                finish={true}
              />
            </Card>
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

  //  let curDate = moment().format("yyyyMMDD");
  let curDate = "20161205";
  let rqs = await fetch(
    `http://localhost:3000/api/getDashBoardData?inquery=null&dfrom=${curDate}&dto=${curDate}`
  );
  const dataDaily = await rqs.json();

  /*get Weekly */
  let from_date = today.startOf("week").format("yyyyMMDD");
  let to_date = today.endOf("week").format("yyyyMMDD");
  rqs = await fetch(
    `http://localhost:3000/api/getDashBoardData?inquery=null&dfrom=${20160101}&dto=${20160801}`
  );
  const dataWeekly = await rqs.json();

  /* get Monthly */
  /*from_date = today.startOf("month").format("yyyyMMDD");
  to_date = today.endOf("month").format("yyyyMMDD");
  rqs = await fetch(
    `http://localhost:3000/api/getDashBoardData?inquery=null&dfrom=${from_date}&dto=${to_date}`
  );
  let dataMonthly = await rqs.json();*/

  /* get rexExpSummary */
  rqs = await fetch(
    //`http://192.168.0.159:3001/dbData?inquery=${pquery}&dfrom=${pdateFrom}&dto=${pDateTo}`
    `http://localhost:3000/api/requestData?inquery=REVEXPSUMMARY&dfrom=${20160101}&dto=${20161231}`
  );
  let dataExpRev = await rqs.json();

  return {
    props: {
      dataDaily: dataDaily || [],
      dataWeekly: dataWeekly || [],
      //dataMonthly: dataMonthly || [],
      dataExpRev: dataExpRev || [],
    }, // will be passed to the page component as props
  };
}
