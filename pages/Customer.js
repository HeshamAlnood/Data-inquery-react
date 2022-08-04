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
  Tag,
  Modal,
} from "antd";
const { Header, Footer, Sider, Content } = Layout;
import {
  ConsoleSqlOutlined,
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import TagList from "../Components/List";
import ModalScreen from "../Components/Modal";
import Uploader from "../Components/Uploader";
import { useEffect, useState, useRef } from "react";
import Draggable from "react-draggable";
export default function Customer() {
  let [customerData, setCustomerData] = useState([{}]);
  let [customerDataRaw, setCustomerDataRaw] = useState([{}]);
  let [isDone, setIsDone] = useState(false);
  let [custList, setCustList] = useState([]);
  let [filterd, setFilterd] = useState([]);

  let [visible, setVisible] = useState(false);
  let [disabled, setDisabled] = useState(false);
  let [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  const draggleRef = useRef(null);
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

  const handleOk = (e) => {
    console.log(e);
    setVisible(false);
  };
  const handleCancel = (e) => {
    console.log(e);
    setVisible(false);
  };

  const showModal = () => {
    console.log(`Go Go Modal Modal`);

    setVisible(true);

    const onStart = (_event, uiData) => {
      const { clientWidth, clientHeight } = window.document.documentElement;
      const targetRect = draggleRef.current?.getBoundingClientRect();

      if (!targetRect) {
        return;
      }

      setBounds({
        left: -targetRect.left + uiData.x,
        right: clientWidth - (targetRect.right - uiData.x),
        top: -targetRect.top + uiData.y,
        bottom: clientHeight - (targetRect.bottom - uiData.y),
      });
    };
  };

  const Getdata = (data = customerData) => {
    dataCard = data.map((e) => {
      let vTitle = `${e.CUST_CUSTOMER} - ${e.CUST_NAME}`;
      //let [key, value] = Object.entries(e);

      let obEntry = Object.entries(e);

      let vSumNet = e.TOTAL_INVOICE_AMOUNT || 0;
      let vSumBal = e.CUST_BALANCE;
      let prsnt = (vSumBal / vSumNet) * 100;
      prsnt = toFixedTrunc(100 - prsnt, 2);

      console.log(`prsnt`, toFixedTrunc(prsnt, 2));

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
                let vCustomValue;
                let val1;
                let color;

                let prcnt = bal ?? 1;

                if (key.replaceAll(" ").replaceAll("_", " ") === "PRSN") {
                  return;
                }

                if (
                  key.replaceAll(" ").replaceAll("_", " ") === "CUST STATUS"
                ) {
                  if (val === "A") {
                    val1 = "ACTIVE";
                    color = "green";
                  } else if (val === "I") {
                    val1 = "INACTIVE";
                    color = "red";
                  } else if (val === "P") {
                    val1 = "PROSPECT";
                    color = "lime";
                  }
                  vCustomValue = <Tag color={color}>{val1}</Tag>;
                }

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
                      : vCustomValue ?? val}
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
        <Modal
          title="Modal 1000px width"
          centered
          visible={visible}
          onOk={() => setVisible(false)}
          onCancel={() => setVisible(false)}
          width={1000}
        >
          <p>some contents...</p>
          <Uploader />
        </Modal>
      </Content>
    </Layout>
  );
}
