import { Container, Row, Card, Text } from "@nextui-org/react";
import Dashboard from "../Components/Dashboard";
import DataTable from "../Components/DataTables";
import { BarChart } from "../Components/Charts/Bar";
import {} from "../Components/Charts/Dounat";
import {} from "../Components/Charts/Gauge";
import {} from "../Components/Charts/Line";
import { useEffect, useState } from "react";
import {
  returnObjectSumm,
  groupObject,
  returnObjectProperty,
  groupBySum,
  sumArray,
} from "../Methods/arreayFn";

export default function DashBoard(props) {
  let [vendors, setVendors] = useState({});
  let [customers, setCustomers] = useState({});
  let [inventory, setInventory] = useState({});

  let [purchasing, setPurchasing] = useState({});

  let [invoicing, setInvoicing] = useState({});
  let [customerSummOb, setCustomerSummOb] = useState({});
  let [vendorSummOb, setVendorSummOb] = useState({});

  const requestData = async (pquery) => {
    const rqs = await fetch(
      `http://192.168.0.159:3001/dbData?inquery=${pquery}`
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
    } else return;

    /*setCustomerSummOb(returnObjectSumm(data, "CUSTOMER"));
    setVendorSummOb(returnObjectSumm(data, "VENDORS"));*/
  };

  useEffect(() => {
    console.log("Start Promise");
    Promise.race([
      requestData("VENDOR"),
      requestData("CUSTOMER"),
      requestData("PURCHASING"),
      requestData("INVOICING"),
      requestData("INVENTORY"),
    ]);
    console.log("End Promise");
  }, []);

  return (
    <>
      <Container>
        <Card>
          <BarChart
            series={Object.values(vendorSummOb)}
            catg={Object.keys(vendorSummOb)}
            size="10%"
            title="Total Purchaes"
          />
        </Card>
      </Container>
      <Dashboard />
    </>
  );
}
