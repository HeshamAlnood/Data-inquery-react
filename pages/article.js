//import { Container, Row, Card, Text } from "@nextui-org/react";
import Dashboard from "../Components/Dashboard";
import DataTable from "../Components/DataTables";
import moment from "moment";
import { BarChart } from "../Components/Charts/Bar";
import { DounatChart } from "../Components/Charts/Dounat";
import { ColumnsChart } from "../Components/Charts/Column";
import {} from "../Components/Charts/Gauge";
import {} from "../Components/Charts/Line";
import { SparkLine } from "../Components/Charts/SparkLines";
import { useEffect, useState } from "react";
import PieRose from "../Components/Charts/Pie";

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
const { RangePicker } = DatePicker;

const { Header, Footer, Sider, Content } = Layout;

import {
  returnObjectSumm,
  groupObject,
  returnObjectProperty,
  groupBySum,
  sumArray,
} from "../Methods/arreayFn";
import Column from "antd/lib/table/Column";

export default function DashBoard(props, { dataq }) {
  let [vendors, setVendors] = useState({});
  let [customers, setCustomers] = useState({});
  let [inventory, setInventory] = useState({});

  let [purchasing, setPurchasing] = useState({});

  let [purchasingByVendor, setPurchasingByVendor] = useState([{}]);
  let [salesByInvoice, setSalesByInvoice] = useState([{}]);
  let [classSale, setClassSale] = useState([{}]);
  let [expensesTotal, setExpensesTotal] = useState([{}]);
  let [revExpSummary, setRevExpSummary] = useState([{}]);

  let [invoicing, setInvoicing] = useState([{}]);
  let [customerSummOb, setCustomerSummOb] = useState([{}]);
  let [vendorSummOb, setVendorSummOb] = useState([{}]);
  let vDateFrom = "20160101";
  let vDateTo = "20500101";
  let [dateFrom, setDateFrom] = useState(vDateFrom);
  let [dateTo, setDateTo] = useState(vDateTo);
  let [isDone, setIsDone] = useState(false);

  const storeInStorage = (value, valueName) => {
    sessionStorage.setItem(
      valueName,
      typeof value === "object" ? value.map((e) => JSON.stringify(e)) : value
    );
  };

  const assignDataFromStorage = (value = "", valueName = "") => {
    let expn = sessionStorage.getItem("EXPENSETOTAL-D");
    console.log(`Parse `, JSON.parse(expn));
    setExpensesTotal(JSON.parse(expn));
    setInventory(JSON.parse(sessionStorage.getItem("INVENTORY-D")));
    setSalesByInvoice(
      JSON.parse(sessionStorage.getItem("CUSTOMERBYINVOICE-D")) || []
    );

    setClassSale(JSON.parse(sessionStorage.getItem("CLASSSALE-D")) || []);
    setRevExpSummary(
      JSON.parse(sessionStorage.getItem("REVEXPSUMMARY-D")) || []
    );
    setPurchasingByVendor(
      JSON.parse(sessionStorage.getItem("VENDORBYPURCHASE-D")) || []
    );
  };

  console.log(`try props home :`, dataq);
  const requestData = async (pquery, pdateFrom, pDateTo) => {
    const rqs = await fetch(
      `http://192.168.0.159:3001/dbData?inquery=${pquery}&dfrom=${pdateFrom}&dto=${pDateTo}`
    );
    const data = await rqs.json();

    //console.log("printing prmoise race");
    /*console.log(data);*/

    if (pquery === "VENDOR") {
      setVendors(data);
      //  console.log(`finish vendor`);
      storeInStorage(data, "VENDOR-D");
    } else if (pquery === "CUSTOMER") {
      setCustomers(data);
      //console.log(`finish custoemr`);
      storeInStorage(data, "CUSTOMER-D");
    } else if (pquery === "PURCHASING") {
      //console.log(`finish purchasing`);
      setPurchasing(data);
      setVendorSummOb(groupBySum(data, "PIH_VENDOR", "PIH_NET_INV_AMT"));
      storeInStorage(data, "PURCHASING-D");
    } else if (pquery === "INVOICING") {
      setInvoicing(data);
      setCustomerSummOb(groupBySum(data, "SIH_CUSTOMER", "SIH_NET_INV_AMT"));
      storeInStorage(data, "INVOICING-D");
    } else if (pquery === "INVENTORY") {
      setInventory(data);
      //console.log(`finish items`);
      storeInStorage(data, "INVENTORY-D");
    } else if (pquery === "VENDORBYPURCHASE") {
      setPurchasingByVendor(data);

      storeInStorage(data, "VENDORBYPURCHASE-D");
    } else if (pquery === "CUSTOMERBYINVOICE") {
      setSalesByInvoice(data);
      storeInStorage(data, "CUSTOMERBYINVOICE-D");
    } else if (pquery === "CLASSSALE") {
      setClassSale(data);
      storeInStorage(data, "CLASSSALE-D");
    } else if (pquery === "EXPENSETOTAL") {
      setExpensesTotal(data);
      storeInStorage(data, "EXPENSETOTAL-D");
    } else if (pquery === "REVEXPSUMMARY") {
      setRevExpSummary(data);
      storeInStorage(data, "REVEXPSUMMARY-D");
    } else return;

    /*setCustomerSummOb(returnObjectSumm(data, "CUSTOMER"));
    setVendorSummOb(returnObjectSumm(data, "VENDORS"));*/
  };

  const runQuerys = (pdateFrom = vDateFrom, pDateTo = vDateTo) => {
    /* console.log(`runQuerys dateFrom, dateTo`);
    console.log(pdateFrom, pDateTo);
    console.log(`End runQuerys dateFrom, dateTo`);*/
    console.log(
      `runQuerys `,
      purchasingByVendor.length,
      salesByInvoice.length,
      classSale.length
    );
    if (
      purchasingByVendor.length > 1 ||
      salesByInvoice.length > 1 ||
      classSale.length > 1
    ) {
      setIsDone(false);
      return;
    }

    Promise.all([
      /*requestData("VENDOR"),
      requestData("CUSTOMER"),
      requestData("PURCHASING"),*/
      requestData("VENDORBYPURCHASE", pdateFrom, pDateTo),
      requestData("CUSTOMERBYINVOICE", pdateFrom, pDateTo),
      requestData("CLASSSALE", pdateFrom, pDateTo),
      requestData("EXPENSETOTAL", pdateFrom, pDateTo),
      requestData("REVEXPSUMMARY", pdateFrom, pDateTo),

      /*requestData("INVENTORY"),
      requestData("INVOICING"),*/
    ])
      .then((e) => setIsDone(true))
      .catch((err) => console.log(`Eroor Promise  `));
  };

  const onChangeDateRange = (dates, dateStrings) => {
    console.log(`dateStrings length`, dateStrings[1].length);
    /*if (dateStrings[1].length === 0) {
      return;
    }*/

    if (dates) {
      console.log("From: ", dates[0], ", to: ", dates[1]);
      console.log(
        "dateStrings From: ",
        dateStrings[0],
        ", to: ",
        dateStrings[1]
      );
      console.log(
        "From: ",
        dateStrings[0].replaceAll("/", ""),
        ", to: ",
        dateStrings[1].replaceAll("/", "")
      );
      console.log(dateStrings[0].replaceAll("/", ""));
      console.log(dateStrings[1].replaceAll("/", ""));

      if (dateStrings[1].length > 0) {
        setDateTo(dateStrings[1].replaceAll("/", ""));
        setDateFrom(dateStrings[0].replaceAll("/", ""));

        console.log("if length > 0");
        console.log(`dateFrom before run the query : `, dateFrom);
        console.log(
          `dateTo before run the query : `,
          dateTo,
          dateStrings[1].replaceAll("/", "")
        );
        let dataFr = dateStrings[0].replaceAll("/", "");
        let dataTo = dateStrings[1].replaceAll("/", "");
        runQuerys(dataFr, dataTo);
      }
    } else {
      console.log("else ");
      setDateFrom(vDateFrom);
      setDateTo(vDateTo);
      runQuerys();
      console.log("Clear");
    }
  };

  /*useEffect(() => {
    assignDataFromStorage();
    null;
  }, []);*/
  useEffect(() => {
    //assignDataFromStorage();
    console.log("Start Promise");

    runQuerys();
    console.log("End Promise");
  }, []);

  return (
    <Layout>
      <Content
        style={{
          padding: "4rem",
          paddingLeft: "15rem",
          margin: 0,
          minHeight: 280,
          backgroundColor: "transparent",
        }}
      >
        <Row justify="center" gutter={15}>
          <RangePicker
            ranges={{
              Yesterday: [moment().day(-1), moment().day(-1)],

              Today: [moment(), moment()],
              "This Week": [moment().day(-7), moment().day(0)],
              "This Month": [
                moment().startOf("month"),
                moment().endOf("month"),
              ],
              "3 Months": [moment().day(-90), moment().day(0)],
              "6 Months": [moment().day(-180), moment().day(0)],
              Year: [moment().day(-365), moment().day(0)],
              "This Year": [moment().startOf("year"), moment().endOf("year")],
            }}
            format="YYYY/MM/DD"
            onChange={onChangeDateRange}
            onCalendarChange={onChangeDateRange}
            size={"large"}
          />
        </Row>
        <Divider orientation="center"></Divider>

        <Row justify="space-around" gutter={15}>
          <Col span={3}>
            <Card
              bordered={false}
              hoverable="true"
              style={{
                width: "24.5rem",
                height: "12.9rem",
                //marginLeft: "6.45rem",
                borderRadius: "4%",
                backgroundColor: "transparent",
              }}
              className="glassy"
            >
              <SparkLine
                data={revExpSummary}
                dataType="REVENUE"
                title="Yearly Revenue"
                color="#81b878"
                finish={isDone}
              />
            </Card>
          </Col>
          <Col span={3}>
            <Card
              bordered={false}
              hoverable="true"
              style={{
                width: "24.5rem",
                height: "12.9rem",
                //marginLeft: "6.45rem",
                borderRadius: "4%",
                backgroundColor: "transparent",
              }}
              className="glassy"
            >
              <SparkLine
                data={revExpSummary}
                dataType="EXPENSES"
                title="Yearly Expenses"
                color="#FFCF36"
                finish={isDone}
              />
            </Card>
          </Col>
          <Col span={3}>
            <Card
              bordered={false}
              hoverable="true"
              style={{
                width: "24.5rem",
                height: "12.9rem",
                //marginLeft: "6.45rem",
                borderRadius: "4%",
                backgroundColor: "transparent",
              }}
              className="glassy"
            >
              <SparkLine
                data={revExpSummary}
                dataType="PROFIT"
                title="Yearly Profit"
                color="#119CF9"
                finish={isDone}
              />
            </Card>
          </Col>
        </Row>
        <Divider orientation="center"></Divider>

        <Row justify="space-around" gutter={[50, 30]}>
          <Col className="gutter-row" span={6}>
            <Card
              bordered={false}
              size="small"
              style={{
                width: "41.5rem",
                height: "24rem",
                borderRadius: "4%",
                backgroundColor: "transparent",
              }}
              className="glassy"
              hoverable="true"
            >
              <PieRose
                data={purchasingByVendor || [{}]}
                titile="Most Purchased Vendors"
                finish={isDone}
              />
            </Card>
          </Col>
          <Col className="gutter-row" span={6}>
            <Card
              bordered={false}
              hoverable="true"
              style={{
                width: "41.5rem",
                height: "24rem",
                borderRadius: "4%",
                backgroundColor: "transparent",
              }}
              className="glassy"
            >
              <DounatChart data={salesByInvoice} finish={isDone} />
            </Card>
          </Col>

          <Col className="gutter-row" span={6}>
            <Card
              bordered={false}
              hoverable="true"
              style={{
                width: "41.5rem",
                height: "24rem",
                borderRadius: "4%",
                backgroundColor: "transparent",
              }}
              className="glassy"
            >
              <DounatChart
                data={expensesTotal}
                type="donut"
                title="Most Expenses"
                width="650"
                finish={isDone}
              />
            </Card>
          </Col>
        </Row>
        <Divider orientation="center"></Divider>

        <Row
          justify="space-around  "
          gutter={[50, 30]}
          style={{ marginLeft: "-12.45rem" }}
        >
          <Col className="gutter-row" span={6}>
            <Card
              bordered={false}
              hoverable="true"
              style={{
                width: "60.5rem",
                height: "38.9rem",
                borderRadius: "4%",
                backgroundColor: "transparent",
              }}
              className="glassy"
            >
              <BarChart
                data={classSale}
                title={"Total Class Sales"}
                finish={isDone}
              />
            </Card>
          </Col>

          <Col span={8}>
            <Card
              bordered={false}
              hoverable="true"
              style={{
                width: "60.5rem",
                height: "38.9rem",
                marginLeft: "6.45rem",
                borderRadius: "4%",
                backgroundColor: "transparent",
              }}
              className="glassy"
            >
              <ColumnsChart
                data={revExpSummary}
                title={"Revnue & Expenses Summary"}
                finish={isDone}
              />
            </Card>
          </Col>
        </Row>
        <Divider orientation="center"></Divider>
      </Content>
    </Layout>
  );
}
