//import { Container, Row, Card, Text } from "@nextui-org/react";
import Dashboard from "../Components/Dashboard";
import DataTable from "../Components/DataTables";
import { BarChart } from "../Components/Charts/Bar";
import { DounatChart } from "../Components/Charts/Dounat";
import { ColumnsChart } from "../Components/Charts/Column";
import {} from "../Components/Charts/Gauge";
import {} from "../Components/Charts/Line";
import { useEffect, useState } from "react";
import PieRose from "../Components/Charts/Pie";
import { Col, Row, Card, Layout, Divider } from "antd";
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

  let [invoicing, setInvoicing] = useState({});
  let [customerSummOb, setCustomerSummOb] = useState({});
  let [vendorSummOb, setVendorSummOb] = useState({});
  let [dateFrom, setDateFrom] = useState("20160101");
  let [dateTo, setDateTo] = useState("20500101");

  const requestData = async (pquery) => {
    const rqs = await fetch(
      `http://192.168.0.159:3001/dbData?inquery=${pquery}&dfrom=${dateFrom}&dto=${dateTo}`
    );
    const data = await rqs.json();

    console.log("printing prmoise race");
    /*console.log(data);*/

    if (pquery === "VENDOR") {
      setVendors(data);
      console.log(`finish vendor`);
    } else if (pquery === "CUSTOMER") {
      setCustomers(data);
      console.log(`finish custoemr`);
    } else if (pquery === "PURCHASING") {
      console.log(`finish purchasing`);
      setPurchasing(data);
      setVendorSummOb(groupBySum(data, "PIH_VENDOR", "PIH_NET_INV_AMT"));
    } else if (pquery === "INVOICING") {
      setInvoicing(data);
      setCustomerSummOb(groupBySum(data, "SIH_CUSTOMER", "SIH_NET_INV_AMT"));
    } else if (pquery === "INVENTORY") {
      setInventory(data);
      console.log(`finish items`);
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
      console.log(`data from race`);
      console.log(data);
    } else return;

    /*setCustomerSummOb(returnObjectSumm(data, "CUSTOMER"));
    setVendorSummOb(returnObjectSumm(data, "VENDORS"));*/
  };

  useEffect(() => {
    console.log("Start Promise");
    Promise.allSettled([
      /*requestData("VENDOR"),
      requestData("CUSTOMER"),
      requestData("PURCHASING"),*/
      requestData("VENDORBYPURCHASE"),
      requestData("CUSTOMERBYINVOICE"),
      requestData("CLASSSALE"),
      requestData("EXPENSETOTAL"),
      requestData("REVEXPSUMMARY"),

      /*requestData("INVENTORY"),
      requestData("INVOICING"),*/
    ]);
    console.log("End Promise");
  }, []);

  /*<BarChart data={classSale} title={"Total Class Sales"} />*/

  return (
    <Layout>
      <Content
        style={{
          padding: "4rem",
          paddingLeft: "22rem",
          margin: 0,
          minHeight: 280,
          backgroundColor: "transparent",
        }}
      >
        <Row justify="space-around" gutter={[16, 30]}>
          <Col className="gutter-row" span={6}>
            <Card
              bordered={false}
              size="small"
              style={{ width: "41.5rem", height: "24rem" }}
              hoverable="true"
            >
              <PieRose
                data={purchasingByVendor}
                titile="Most Purchased Vendors"
              />
            </Card>
          </Col>
          <Col className="gutter-row" span={6}>
            <Card
              bordered={false}
              hoverable="true"
              style={{ width: "41.5rem", height: "24rem" }}
            >
              <DounatChart data={salesByInvoice} />
            </Card>
          </Col>

          <Col className="gutter-row" span={6}>
            <Card
              bordered={false}
              hoverable="true"
              style={{ width: "41.5rem", height: "24rem" }}
            >
              <DounatChart
                data={expensesTotal}
                type="donut"
                title="Most Expenses"
                width="650"
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
              style={{ width: "60.5rem", height: "38.9rem" }}
            >
              <BarChart data={classSale} title={"Total Class Sales"} />
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
              }}
            >
              <ColumnsChart
                data={revExpSummary}
                title={"Revnue & Expenses Summary"}
              />
            </Card>
          </Col>
        </Row>

        <Dashboard />
      </Content>
    </Layout>
  );
}
