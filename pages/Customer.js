import {
  //Card,
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
  //Button,
  Tag,
  Modal,
  BackTop,
} from "antd";
const { Header, Footer, Sider, Content } = Layout;
import { /*Container, Grid,*/ Loading, Card, Button } from "@nextui-org/react";

import {
  ConsoleSqlOutlined,
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
  FileSearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";

import ViewerPdf from "../Components/ViewerPdf";
import ViewArchive from "../Components/ViewArchive";
import { CustomerByItems } from "../Components/CustomerItmes";
import UnPaidInv from "../Components/UnColleted";
import StatOfAccntC from "../Components/StatOfAccntC";
//import PdfViewer from "../Components/PdfViewer";
import lodash from "lodash";
import TagList from "../Components/List";
import ModalScreen from "../Components/Modal";
import Uploader from "../Components/Uploader";
import { useEffect, useState, useRef } from "react";
import Draggable from "react-draggable";
export default function Customer(props) {
  let [customerData, setCustomerData] = useState([]);
  let [customerDataRaw, setCustomerDataRaw] = useState([]);
  let [isDone, setIsDone] = useState(false);
  let [custList, setCustList] = useState([]);
  let [custArrLabel, setCustArrLabel] = useState([]);

  let [filterd, setFilterd] = useState([]);
  let [currCust, setCurrCust] = useState("");
  let [drawerFlag, setDrawerFlag] = useState(false);
  let [itemsSummryFlag, setItemsSummryFlag] = useState(false);
  let [visible, setVisible] = useState(false);
  let [disabled, setDisabled] = useState(false);
  let [unPaidModal, setUnPaidModal] = useState(false);
  let [customerHistModal, setCustomerHistModal] = useState(false);

  let [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  const draggleRef = useRef(null);
  let custArr;
  //let custArrLabel = [];
  //const fetcher = (...args) => fetch(...args).then((res) => res.json());

  function toFixedTrunc(x, n) {
    const v = (typeof x === "string" ? x : x.toString()).split(".");
    if (n <= 0) return v[0];
    let f = v[1] || "";
    if (f.length > n) return `${v[0]}.${f.substr(0, n)}`;
    while (f.length < n) f += "0";
    return `${v[0]}.${f}`;
  }

  const controlDrawer = (cust, flag = false) => {
    //drawerFlag === false ? setDrawerFlag(true) : setDrawerFlag(false);
    //setItemsSummryFlag(flag);
    setDrawerFlag(flag);

    setCurrCust(cust);
  };

  const controlUnpaid = (cust, flag = false) => {
    setUnPaidModal(flag);
    setCurrCust(cust);
  };

  const controlStat = (cust, flag = false) => {
    setCustomerHistModal(flag);
    setCurrCust(cust);
  };
  const controlItemSummry = (cust, flag = false) => {
    console.log(`controlDrawer`, flag);

    //drawerFlag === false ? setDrawerFlag(true) : setDrawerFlag(false);
    setItemsSummryFlag(flag);
    //setDrawerFlag(drawerFlag);

    setCurrCust(cust);
  };

  /*const fetchData = async () => {
    //await fetch(`http://192.168.0.159:3001/dbData?inquery=CUSTOMERINV`)
    await fetch(`http://localhost:3000/api/requestData?inquery=CUSTOMERINV`)
      .then((res) => res.json())
      .then((data) => {
        setCustomerData(data);
        setCustomerDataRaw(data);

        fillArry(data);
      });
  };*/

  const fillArry = (data) => {
    custArr = data.map((e) => e.CUST_CUSTOMER);
    let custArrLabel = data.map((e) =>
      lodash.pick(e, ["CUST_CUSTOMER", "CUST_NAME"])
    );
    setCustList(
      custArr.sort((a, b) =>
        (a || "a")
          .toString()
          .toLowerCase()
          .localeCompare((b || "b").toString().toLowerCase())
      )
    );
    setCustArrLabel;
    custArrLabel = lodash.sortBy(custArrLabel, ["CUST_CUSTOMER"]);

    //.map((e) => e.CUST_CUSTOMER + " - " + e.CUST_NAME);

    setCustArrLabel(
      custArrLabel.map((e) => ({
        value: e.CUST_CUSTOMER,
        label: e.CUST_CUSTOMER + " - " + e.CUST_NAME,
      }))
    );
  };

  const setData = async () => {
    await setCustomerData([...props.data]);
    await setCustomerDataRaw([...props.data]);
    await fillArry(props.data);
  };

  useEffect(() => {
    setIsDone(false);
    setData().then(() => setIsDone(true));
  }, []);

  let dataCard = [];

  let dataDesc = [];

  const handleOk = (e) => {
    console.log(e);
    setVisible(false);
  };
  const handleCancel = (e) => {
    console.log(e);
    setVisible(false);
    setUnPaidModal(false);
    setCustomerHistModal(false);
  };

  const showModal = (cust) => {
    console.log(`Go Go Modal Modal`, cust);

    setVisible(true);
    setCurrCust(cust);

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

  let ButtonCls =
    "rounded-full pl-2 pr-2  w-48 h-9  text-sky-400 hover:bg-sky-400 hover:text-white active:translate-y-0.5 shadow-lg shadow-blue-500/50  text-base font-semibold	hvr-float-shadow";

  const Getdata = (data = props.data) => {
    //let dataP = data.length < 2 ? props.data : data;

    dataCard = data.map((e) => {
      let vTitle = `${e.CUST_CUSTOMER} - ${e.CUST_NAME}`;
      //let [key, value] = Object.entries(e);
      console.log(` set is Done`, isDone);
      console.log(`data props `, props.data);
      console.log(`customer data `, customerData);
      let obEntry = Object.entries(e);

      let vSumNet = e.TOTAL_INVOICE_AMOUNT || 0;
      let vSumBal = e.CUST_BALANCE;
      let prsnt = (vSumBal / vSumNet) * 100;
      prsnt = toFixedTrunc(100 - prsnt, 2);

      //console.log(`prsnt`, toFixedTrunc(prsnt, 2));

      if (isDone === false)
        return (
          <div className="flex justify-center">
            <div className="article ">
              <Loading size="xl">Loading ...</Loading>
            </div>
          </div>
        );

      // try another Card -- NextUI Card
      return (
        <>
          <Space size={"number"}>
            <Card
              css={{
                width: "80%",
                //    borderRadius: "3%",
              }}
              isHoverable
            >
              <Card.Header
                css={{
                  backgroundColor: "#1e81b0  ",
                  color: "white",
                  //                  borderRadius: "3%",

                  fontStyle: "normal",
                  //fontWeight: "bolder",
                }}
              >
                <b>{vTitle}</b>
              </Card.Header>
              <Card.Divider />
              <Card.Body>
                <Descriptions
                  labelStyle={{ fontWeight: "bold" }}
                  column={{
                    xxl: 4,
                    xl: 3,
                    lg: 3,
                    md: 3,
                    sm: 2,
                    xs: 1,
                  }}
                >
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
                      <>
                        <Descriptions.Item
                          label={key.replaceAll(" ").replaceAll("_", " ")}
                          contentStyle={{
                            fontWeight: "bold",
                            color: "rgb(2 132 199)",
                          }}
                          className="text-xl"
                        >
                          {Number.isFinite(val) === true
                            ? new Intl.NumberFormat("en-us").format(
                                toFixedTrunc(val, 2)
                              )
                            : vCustomValue ?? val}
                        </Descriptions.Item>
                      </>
                    );
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
              </Card.Body>
              <Card.Divider />
              <Card.Footer className="flex justify-around" isBlurred={"true"}>
                {/* <Row className="flex justify-around"> */}
                <button
                  className={ButtonCls}
                  onClick={() => showModal(e.CUST_CUSTOMER)}
                >
                  Upload Files
                  <UploadOutlined className="pl-3" />
                </button>
                <button
                  className={ButtonCls}
                  onClick={() => controlDrawer(e.CUST_CUSTOMER, true)}
                >
                  View Files
                  <FileSearchOutlined className="pl-3" />
                </button>

                <button
                  className={ButtonCls}
                  onClick={() => controlItemSummry(e.CUST_CUSTOMER, true)}
                >
                  Items Summarys
                </button>

                <button
                  className={ButtonCls}
                  onClick={() => controlUnpaid(e.CUST_CUSTOMER, true)}
                >
                  UnPaid Invocies
                </button>
                <button
                  className={ButtonCls}
                  onClick={() => controlStat(e.CUST_CUSTOMER, true)}
                >
                  Stat Of Accnt
                </button>
                {/* </Row> */}
              </Card.Footer>
            </Card>
          </Space>
        </>
      );

      //

      return (
        <>
          <Space size={"small"}>
            <Card
              title={vTitle}
              hoverable
              //loading={true}
              type="inner"
              //bordered={false}
              headStyle={{
                backgroundColor: "#1e81b0  ",
                color: "white",
                borderRadius: "3%",

                fontStyle: "normal",
                fontWeight: "bolder",
              }}
              style={{
                width: "80%",
                borderRadius: "3%",
              }}
              actions={[
                <UploadOutlined
                  key="setting"
                  onClick={() => showModal(e.CUST_CUSTOMER)}
                />,
                <FileSearchOutlined
                  key="edit"
                  onClick={() => controlDrawer(e.CUST_CUSTOMER, true)}
                />,
                <EllipsisOutlined
                  key="ellipsis"
                  onClick={() => controlDrawer(e.CUST_CUSTOMER, true)}
                />,
              ]}
            >
              <Descriptions
                labelStyle={{ fontWeight: "bold" }}
                column={{
                  xxl: 4,
                  xl: 3,
                  lg: 3,
                  md: 3,
                  sm: 2,
                  xs: 1,
                }}
              >
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
                    <>
                      <Descriptions.Item
                        label={key.replaceAll(" ").replaceAll("_", " ")}
                        contentStyle={{
                          fontWeight: "bold",
                          color: "rgb(163 163 163)",
                        }}
                      >
                        {Number.isFinite(val) === true
                          ? new Intl.NumberFormat("en-us").format(
                              toFixedTrunc(val, 2)
                            )
                          : vCustomValue ?? val}
                      </Descriptions.Item>
                    </>
                  );
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
          </Space>
        </>
      );
    });

    return dataCard;
  };

  const queryFilterd = (valueArr = filterd) => {
    let dataOb = customerDataRaw;
    console.log(
      `query filter value error :${valueArr} and length ${valueArr.length}`
    );
    let intersection;
    if (valueArr.length > 0) {
      //intersection = dataOb.filter((e) => e.VEND_VENDOR.includes(valueArr));
      intersection = dataOb.filter(
        (e) => valueArr.indexOf(e["CUST_CUSTOMER"]) >= 0
      );

      setCustomerData(intersection);
    } else {
      setCustomerData(props.data);
    }
    //getSummry(dataElm, query).then((e) => setObSum(e));
  };

  useEffect(() => {
    queryFilterd();
  }, [filterd]);

  return (
    <Layout>
      <BackTop />
      <Content
        style={{
          padding: "4rem",
          paddingLeft: "29rem",
          margin: 0,
          minHeight: 280,
          backgroundColor: "transparent",
        }}
      >
        {isDone ?? <Skeleton active />}

        <div className="max-w-7xl	 mb-4">
          <TagList
            cols={custList}
            filterd={setFilterd}
            qName={`CUSTOMER`}
            //  width={"100%"}
            options={custArrLabel}
          />
        </div>
        <Row justify="center">
          <Col>{isDone && Getdata(customerData)}</Col>
        </Row>
        <Modal
          title={`Upload files for ${currCust}`}
          centered
          visible={visible}
          onOk={() => setVisible(false)}
          onCancel={() => setVisible(false)}
          width={1000}
        >
          <Uploader keyVal={currCust} type="Customer" />
        </Modal>
      </Content>
      <ViewArchive
        showFlag={drawerFlag}
        setShowFlag={controlDrawer}
        keyVal={currCust}
        type="Customer"
      />
      {itemsSummryFlag && (
        <CustomerByItems
          showFlag={itemsSummryFlag}
          setShowFlag={controlItemSummry}
          keyVal={currCust}
          type="Customer"
        />
      )}
      {unPaidModal && (
        <UnPaidInv
          isVisible={unPaidModal}
          setIsVisible={controlUnpaid}
          custno={currCust}
          // type="Customer"
        />
      )}
      {customerHistModal && (
        <StatOfAccntC
          isVisible={customerHistModal}
          setIsVisible={controlStat}
          currCustomer={currCust}
          // type="Customer"
        />
      )}
    </Layout>
  );
}
export async function getServerSideProps(context) {
  let rsp = await fetch(
    `http://localhost:3000/api/requestData?inquery=CUSTOMERINV`
  );

  let data = await rsp.json();

  return {
    props: { data: data }, // will be passed to the page component as props
  };
}
