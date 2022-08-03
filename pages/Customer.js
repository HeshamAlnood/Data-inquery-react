import {
  Card,
  Col,
  Descriptions,
  StatisticCol,
  Row,
  Layout,
  Divider,
  Progress,
  DatePicker,
  Space,
  Skeleton,
  Button,
} from "antd";
const { Header, Footer, Sider, Content } = Layout;
import {
  ConsoleSqlOutlined,
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import TagList from "../Components/List";
import { ModalScreen } from "../Components/Modal";
import Uploader from "../Components/Uploader";
import { useEffect, useState } from "react";

export default function Customer() {
  let [customerData, setCustomerData] = useState([{}]);
  let [customerDataRaw, setCustomerDataRaw] = useState([{}]);
  let [isDone, setIsDone] = useState(false);
  let [custList, setCustList] = useState([]);
  let [filterd, setFilterd] = useState([]);
  let custArr;

  function toFixedTrunc(x, n) {
    const v = (typeof x === "string" ? x : x.toString()).split(".");
    if (n <= 0) return v[0];
    let f = v[1] || "";
    if (f.length > n) return `${v[0]}.${f.substr(0, n)}`;
    while (f.length < n) f += "0";
    return `${v[0]}.${f}`;
  }

  const fetchData = async () => {
    await fetch(`http://192.168.0.159:3001/dbData?inquery=CUSTOMERINV`)
      .then((res) => res.json())
      .then((data) => {
        setCustomerData(data);
        setCustomerDataRaw(data);

        fillArry(data);
      });
  };

  useEffect(() => {
    setIsDone(false);
    fetchData().then((e) => setIsDone(true));
  }, []);

  const fillArry = (data) => {
    custArr = data.map((e) => e.CUST_CUSTOMER);

    setCustList(
      custArr.sort((a, b) =>
        (a || "a")
          .toString()
          .toLowerCase()
          .localeCompare((b || "b").toString().toLowerCase())
      )
    );
  };

  let dataCard = [];

  let dataDesc = [];

  const Getdata = (data = customerData) => {
    dataCard = data.map((e) => {
      let vTitle = `${e.CUST_CUSTOMER} - ${e.CUST_NAME}`;
      //let [key, value] = Object.entries(e);

      let obEntry = Object.entries(e);

      let vSumNet = e.TOTAL_INVOICE_AMOUNT || 0;
      let vSumBal = e.CUST_BAL;
      let prsnt = (vSumBal / vSumNet) * 100;
      prsnt = toFixedTrunc(100 - prsnt, 2);

      console.log(`prsnt`, toFixedTrunc(prsnt, 2));

      const showModal = () => {
        console.log(`Go Go Modal Modal`);

        return (
          <>
            <ModalScreen showFlag={true}> </ModalScreen>
          </>
        );
      };

      return (
        <>
          <Card
            title={vTitle}
            hoverable
            type="inner"
            //bordered={false}
            headStyle={{ backgroundColor: "#1e81b0  ", color: "white" }}
            style={{
              width: "80%",
            }}
            actions={[
              <SettingOutlined key="setting" onClick={showModal} />,
              <EditOutlined key="edit" onClick={showModal} />,
              <EllipsisOutlined key="ellipsis" onClick={showModal} />,
            ]}
          >
            <Descriptions labelStyle={{ fontWeight: "bold" }}>
              {obEntry.map(([key, val] = entry) => {
                let bal = key === "CUST_BALANCE" ? val : 0;

                let prcnt = bal ?? 1;

                /*if (key.replaceAll(" ").replaceAll("_", " ") === "PRSN") {
                  return;
                }*/
                return (
                  <Descriptions.Item
                    label={key.replaceAll(" ").replaceAll("_", " ")}
                    contentStyle={{
                      fontWeight: "bold",
                      //color: "blue",
                      color: "rgb(163 163 163)" /*"rgb(29 78 216)"*/,
                    }}
                  >
                    {Number.isFinite(val) === true
                      ? new Intl.NumberFormat("en-us").format(
                          toFixedTrunc(val, 2)
                        )
                      : val}
                  </Descriptions.Item>
                );
                // }
              })}

              <Descriptions.Item
                label={""}
                contentStyle={{
                  fontWeight: "bold",

                  color: "rgb(29 78 216)",
                }}
              >
                <Progress
                  format={function (percent, successPercent) {
                    return " Collection : " + +percent + "%";
                  }}
                  type="circle"
                  percent={+prsnt}
                  status="active"
                  showInfo="true"
                  width="100px"
                />
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </>
      );
    });

    return dataCard;
  };

  const queryFilterd = (valueArr = filterd) => {
    let dataOb = customerDataRaw;

    let intersection;
    if (valueArr.length > 0) {
      //intersection = dataOb.filter((e) => e.VEND_VENDOR.includes(valueArr));
      intersection = dataOb.filter(
        (e) => valueArr.indexOf(e["CUST_CUSTOMER"]) >= 0
      );

      setCustomerData(intersection);
    } else {
      setCustomerData(customerDataRaw);
    }
    //getSummry(dataElm, query).then((e) => setObSum(e));
  };

  useEffect(() => {
    queryFilterd();
  }, [filterd]);

  return (
    <Layout>
      <Content
        style={{
          padding: "4rem",
          paddingLeft: "18rem",
          margin: 0,
          minHeight: 280,
          backgroundColor: "transparent",
        }}
      >
        {isDone ?? <Skeleton active />}

        <TagList cols={custList} filterd={setFilterd} qName={`CUSTOMER`} />

        <Row justify="center">
          <Col>{Getdata(customerData)}</Col>
        </Row>
      </Content>
    </Layout>
  );
}
