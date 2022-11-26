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
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import PieRose from "../Components/Charts/Pie";
//import { invContext } from "./_app";
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

export default function DashBoard(props) {
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
  let vDateFrom = moment().startOf("year").format("yyyyMMDD");

  let vDateTo = moment().endOf("year").format("yyyyMMDD");

  //  console.log(`Date Moment : `, vDateFrom, vDateTo);
  let [dateFrom, setDateFrom] = useState(vDateFrom);
  let [dateTo, setDateTo] = useState(vDateTo);
  let [isDone, setIsDone] = useState(false);

  //  let invDataL = useContext(invContext);

  const storeInStorage = (value, valueName) => {
    sessionStorage.setItem(
      valueName,
      typeof value === "object" ? value.map((e) => JSON.stringify(e)) : value
    );
  };

  const getInStorage = (value) => {
    sessionStorage.getItem(valueName);
  };

  const dataHandling = useMemo((data, pquery) => {
    if (pquery === "VENDOR") {
      setVendors(data);
      //  console.log(`finish vendor`);
    } else if (pquery === "CUSTOMER") {
      setCustomers(data);
      //console.log(`finish custoemr`);
    } else if (pquery === "PURCHASING") {
      //console.log(`finish purchasing`);
      setPurchasing(data);
      setVendorSummOb(groupBySum(data, "PIH_VENDOR", "PIH_NET_INV_AMT"));
    } else if (pquery === "INVOICING") {
      setInvoicing(data);
      setCustomerSummOb(groupBySum(data, "SIH_CUSTOMER", "SIH_NET_INV_AMT"));
    } else if (pquery === "INVENTORY") {
      setInventory(data);
      //console.log(`finish items`);
    } else if (pquery === "VENDORBYPURCHASE") {
      setPurchasingByVendor(data);
    } else if (pquery === "CUSTOMERBYINVOICE") {
      setSalesByInvoice(data);
    } else if (pquery === "CLASSSALE") {
      setClassSale(data);
    } else if (pquery === "EXPENSETOTAL") {
      setExpensesTotal(data);
    } else if (pquery === "REVEXPSUMMARY") {
      setRevExpSummary(data);
    } else return;
  }, []);

  const requestData = async (pquery, pdateFrom, pDateTo) => {
    const rqs = await fetch(
      `http://localhost:3000/api/requestData?inquery=${pquery}&dfrom=${pdateFrom}&dto=${pDateTo}`
    );
    //`http://192.168.0.159:3000/api/requestData?inquery=CUSTOMERBYINVOICE&dfrom=20160101&dto=20160501`
    const data = await rqs.json();

    if (pquery === "VENDOR") {
      setVendors(data);
      //  console.log(`finish vendor`);
    } else if (pquery === "CUSTOMER") {
      setCustomers(data);
      //console.log(`finish custoemr`);
    } else if (pquery === "PURCHASING") {
      //console.log(`finish purchasing`);
      setPurchasing(data);
      setVendorSummOb(groupBySum(data, "PIH_VENDOR", "PIH_NET_INV_AMT"));
    } else if (pquery === "INVOICING") {
      setInvoicing(data);
      setCustomerSummOb(groupBySum(data, "SIH_CUSTOMER", "SIH_NET_INV_AMT"));
    } else if (pquery === "INVENTORY") {
      setInventory(data);
      //console.log(`finish items`);
    } else if (pquery === "VENDORBYPURCHASE") {
      setPurchasingByVendor(data);
    } else if (pquery === "CUSTOMERBYINVOICE") {
      setSalesByInvoice(data);
    } else if (pquery === "CLASSSALE") {
      setClassSale(data);
    } else if (pquery === "EXPENSETOTAL") {
      setExpensesTotal(data);
    } else if (pquery === "REVEXPSUMMARY") {
      setRevExpSummary(data);
    } else return;

    /*setCustomerSummOb(returnObjectSumm(data, "CUSTOMER"));
    setVendorSummOb(returnObjectSumm(data, "VENDORS"));*/
  };

  const runQuerys = async (pdateFrom = vDateFrom, pDateTo = vDateTo) => {
    setIsDone(false);
    /*Promise.all([
    
      requestData("VENDORBYPURCHASE", pdateFrom, pDateTo),
      requestData("CUSTOMERBYINVOICE", pdateFrom, pDateTo),
      requestData("CLASSSALE", pdateFrom, pDateTo),
      requestData("EXPENSETOTAL", pdateFrom, pDateTo),
      requestData("REVEXPSUMMARY", pdateFrom, pDateTo),
   
    ])
      .then((e) => setIsDone(true))
      .catch((err) => console.log(`Eroor Promise  `, err));*/
    await requestData("VENDORBYPURCHASE", pdateFrom, pDateTo);
    await requestData("CUSTOMERBYINVOICE", pdateFrom, pDateTo);
    await requestData("CLASSSALE", pdateFrom, pDateTo);
    await requestData("EXPENSETOTAL", pdateFrom, pDateTo);
    //await requestData("REVEXPSUMMARY", pdateFrom, pDateTo);
    setIsDone(true);
  };

  /*const exeQuerys = useMemo(
    () => runQuerys(vDateFrom, vDateTo),
    [vDateFrom, vDateTo]
  );*/

  const onChangeDateRange = (dates, dateStrings) => {
    console.log(`panel change ~  `);

    if (dates) {
      if (dateStrings[1].length > 0) {
        setDateTo(dateStrings[1].replaceAll("/", ""));
        setDateFrom(dateStrings[0].replaceAll("/", ""));

        let dataFr = dateStrings[0].replaceAll("/", "");
        let dataTo = dateStrings[1].replaceAll("/", "");
        console.log(`dataFr ${dataFr} dateTo`, dataTo);
        runQuerys(dataFr, dataTo);
        //exeQuerys;
      }
    } else {
      runQuerys();
      null;
    }
  };

  useEffect(() => {
    //assignDataFromStorage();
    console.log("Start Promise");
    console.log("props ", props.classSale);

    //runQuerys();
    //exeQuerys;

    setPurchasingByVendor(props.purchasingByVendor);

    setSalesByInvoice(props.salesByInvoice);

    setClassSale(props.classSale);

    setExpensesTotal(props.expensesTotal);

    setRevExpSummary(props.revExpSummary);
    setIsDone(true);
    console.log("End Promise");
  }, []);

  return (
    <Layout hasSider={false}>
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
            //onChange={onChangeDateRange}
            onCalendarChange={onChangeDateRange}
            size={"large"}
            defaultValue={[moment().startOf("year"), moment().endOf("year")]}
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

        <Row justify="center" className="space-x-20">
          <Col className="gutter-row  " span={6}>
            <Card
              bordered={false}
              size="small"
              style={{
                //                width: "41.5rem",
                height: "24rem",
                minWidth: "21.5rem",
                //              maxWidth: "59.6rem",
                maxWidth: "108rem",
                borderRadius: "4%",
                backgroundColor: "transparent",
              }}
              className="glassy "
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
              size="small"
              style={{
                //width: "41.5rem",
                minWidth: "21.5rem",
                maxWidth: "10z8rem",
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
                //width: "41.5rem",
                maxWidth: "108rem",
                minWidth: "21.5rem",
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
export async function getServerSideProps(context) {
  let purchasingByVendor,
    salesByInvoice,
    classSale,
    expensesTotal,
    revExpSummary;

  const requestData = async (pquery, pdateFrom, pDateTo) => {
    const rqs = await fetch(
      //`http://192.168.0.159:3001/dbData?inquery=${pquery}&dfrom=${pdateFrom}&dto=${pDateTo}`
      `http://localhost:3000/api/requestData?inquery=${pquery}&dfrom=${pdateFrom}&dto=${pDateTo}`
    );
    const data = await rqs.json();

    if (pquery === "VENDORBYPURCHASE") {
      purchasingByVendor = data;
    } else if (pquery === "CUSTOMERBYINVOICE") {
      salesByInvoice = data;
    } else if (pquery === "CLASSSALE") {
      classSale = data;
    } else if (pquery === "EXPENSETOTAL") {
      expensesTotal = data;
    } else if (pquery === "REVEXPSUMMARY") {
      revExpSummary = data;
    } else return;
  };

  const runQuerys = async (pdateFrom = vDateFrom, pDateTo = vDateTo) => {
    /*await Promise.all([*/
    await requestData("VENDORBYPURCHASE", pdateFrom, pDateTo);
    await requestData("CUSTOMERBYINVOICE", pdateFrom, pDateTo);
    await requestData("CLASSSALE", pdateFrom, pDateTo);
    await requestData("EXPENSETOTAL", pdateFrom, pDateTo);
    await requestData("REVEXPSUMMARY", pdateFrom, pDateTo);
    /*]
    )
      .then((e) => console.log(e))
      .catch((err) => console.log(`Eroor Promise  `, err));*/
  };
  let data = [];
  let dFrom = moment().year() + "0101";
  let dTo = moment().year() + "1231";

  await runQuerys(dFrom, dTo).then((e) => {
    return {
      props: {
        purchasingByVendor: `purchasingByVendor` || 0,
        salesByInvoice: `salesByInvoice`,
        classSale: `classSale`,
        expensesTotal: `expensesTotal`,
        revExpSummary: `revExpSummary`,
      }, // will be passed to the page component as props
    };
  });

  return {
    props: {
      purchasingByVendor: purchasingByVendor || 0,
      salesByInvoice: salesByInvoice,
      classSale: classSale,
      expensesTotal: expensesTotal,
      revExpSummary: revExpSummary,
    }, // will be passed to the page component as props
  };
}
