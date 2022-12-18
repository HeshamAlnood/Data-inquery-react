import {
  //Card,
  Col,
  Descriptions,
  Radio,
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
import ItemMovment from "../Components/ItemMovment";
import ItemChart from "../Components/itemChart";
import { VariableSizeGrid } from "react-window";
import { AutoSizer, List } from "react-virtualized";
import moment from "moment";
import lodash from "lodash";

/*import outOfStoke from "../public/icons/out_of_stock.png";
import available from "../public/icons/Available.png";*/

import TagList from "../Components/List";
import ModalScreen from "../Components/Modal";
import Uploader from "../Components/Uploader";
import { useEffect, useState, useRef } from "react";
import Draggable from "react-draggable";
export default function Customer(props) {
  let [itemsData, setItemsData] = useState([]);
  let [itemsDataRaw, setItemsDataRaw] = useState([]);
  let [isDone, setIsDone] = useState(false);
  let [itemList, setItemList] = useState([]);
  let [filterd, setFilterd] = useState([]);
  let [currItem, setCurrItem] = useState("");
  let [drawerFlag, setDrawerFlag] = useState(false);
  let [itemsSummryFlag, setItemsSummryFlag] = useState(false);
  let [visible, setVisible] = useState(false);
  let [disabled, setDisabled] = useState(false);
  let [radioValue, setRadioValue] = useState(0);

  let activeButnClass = `flex h-full items-center justify-center rounded-full bg-gradient-to-r from-blue-300 to-blue-500 px-4 text-xl text-white hvr-float-shadow`;
  let notActiveButnClass = `flex h-full items-center justify-center rounded-full px-4 text-xl transition-all duration-150 ease-in-out hover:bg-blue-500/10 hvr-float-shadow`;

  let [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  const draggleRef = useRef(null);
  //const fetcher = (...args) => fetch(...args).then((res) => res.json());

  function toFixedTrunc(x, n) {
    const v = (typeof x === "string" ? x : x.toString()).split(".");
    if (n <= 0) return v[0];
    let f = v[1] || "";
    if (f.length > n) return `${v[0]}.${f.substr(0, n)}`;
    while (f.length < n) f += "0";
    return `${v[0]}.${f}`;
  }

  const controlDrawer = (item, flag = false) => {
    console.log(`controlDrawer`, flag);

    setDrawerFlag(flag);

    setCurrItem(item);
  };

  const controlItemSummry = (cust, flag = false) => {
    console.log(`controlDrawer`, flag);

    //drawerFlag === false ? setDrawerFlag(true) : setDrawerFlag(false);
    /*  setItemsSummryFlag(flag);
    //setDrawerFlag(drawerFlag);

    setItemCust(cust);*/
  };

  const chngRaido = (value) => {
    let data = itemsDataRaw;
    setRadioValue(value);
    if (value === "1") {
      setItemsData(data.filter((e) => e.ITEM_ON_HAND_QTY > 0));
    } else if (value === "-1") {
      setItemsData(data.filter((e) => e.ITEM_ON_HAND_QTY === 0));
    } else setItemsData(itemsDataRaw);

    console.log(`chng Radio `, value);
    console.log(`current class `, activeButnClass);
  };

  const fillArry = (data) => {
    let itemArr = data.map((e, i) => e.PART_NO);
    console.log(`before set`, itemArr.length);
    itemArr = [...new Set(itemArr)];

    console.log(`after set`, itemArr.length);
    console.log(`cust arr set`, itemArr);
    setItemList(
      itemArr.sort((a, b) =>
        (a || "a")
          .toString()
          .toLowerCase()
          .localeCompare((b || "b").toString().toLowerCase())
      )
    );

    return itemArr;
  };

  const setData = async () => {
    console.log(`start setting data `);
    console.log(props.data);
    console.log(`group by SALES`, lodash.groupBy(...props.data, "SALES"));
    await setItemsData(props.data);
    await setItemsDataRaw(props.data);
    await fillArry(props.data);
    console.log(`end setting data `);
    console.log(`data after setting `, itemsData);
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
  };
  const listRef = useRef(null);

  const showModal = (item) => {
    console.log(`Go Go Modal Modal`, item);
    setCurrItem(item);
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

  let ButtonCls =
    "rounded-full pl-2 pr-2  w-48 h-9  text-teal-400 hover:bg-teal-400 hover:text-white active:translate-y-0.5 shadow-lg shadow-teal  -500/50  text-base font-semibold hvr-float-shadow	";

  const Getdata = (data = props.data, index = null) => {
    //let dataP = data.length < 2 ? props.data : data;

    dataCard = data.map((e, i) => {
      let vTitle = `${e.PART_NO} - ${e.ITEM_DESCRIPTION} - ${i}`;
      //let [key, value] = Object.entries(e);

      let obEntry = Object.entries(e);

      let vSumNet = e.TOTAL_INVOICE_AMOUNT || 1;
      let vSumBal = e.CUST_BALANCE || 1;
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
                  backgroundColor: "#22c55e",
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
                  {obEntry.map(([key, val] = entry, i) => {
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
                  onClick={() => controlItemSummry(e.CUST_CUSTOMER, true)}
                >
                  Items Summarys
                </button>
                {/* </Row> */}
              </Card.Footer>
            </Card>
          </Space>
        </>
      );
    })[index];

    return dataCard;
  };

  const queryFilterd = (valueArr = filterd) => {
    let dataOb = itemsDataRaw;
    console.log(
      `query filter value error :${valueArr} and length ${valueArr.length}`
    );
    let intersection;
    if (valueArr.length > 0) {
      //intersection = dataOb.filter((e) => e.VEND_VENDOR.includes(valueArr));
      intersection = dataOb.filter((e) => valueArr.indexOf(e["PART_NO"]) >= 0);

      setItemsData(intersection);
    } else {
      setItemsData(props.data);
    }
    //getSummry(dataElm, query).then((e) => setObSum(e));
  };

  useEffect(() => {
    queryFilterd();
  }, [filterd]);

  // let optionButton = [
  //   { label: "All", value: 0 },
  //   { label: "Out of Stock", value: "-1" },
  //   {
  //     label: "Avaliable",
  //     value: "1",
  //   },
  // ];

  function rowRenderer({ key, index, style }) {
    return (
      <div key={key} style={style}>
        {itemsData[index]}
      </div>
    );
  }

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

        {/* <Row justify="center"> */}
        {/* <Col> */}
        <div className="grid justify-items-center    mt-6  mr-80 ">
          <TagList
            cols={itemList}
            filterd={setFilterd}
            qName={`ITEMS`}
            width={"80%"}
          />
          {/* <Radio.Group
            options={optionButton}
            onChange={({ target: { value } }) => chngRaido(value)}
            defaultValue={radioValue}
            value={radioValue}
            optionType="button"
            buttonStyle="solid"
            size="large"
            className="ml-64"
          /> */}
        </div>
        <div class="flex items-center justify-between ml-80 mt-8 ">
          <div className="flex h-14 items-center space-x-1 rounded-full  bg-slate-200 p-2 ml-64 ">
            <button
              onClick={() => chngRaido("0")}
              //className="flex h-full items-center justify-center rounded-full bg-gradient-to-r from-blue-300 to-blue-500 px-4 text-xl text-white"
              className={
                radioValue === "0" ? activeButnClass : notActiveButnClass
              }
            >
              All
            </button>
            <button
              onClick={() => chngRaido("-1")}
              // className="flex h-full items-center justify-center rounded-full px-4 text-xl transition-all duration-150 ease-in-out hover:bg-blue-500/10"
              className={
                radioValue === "-1" ? activeButnClass : notActiveButnClass
              }
            >
              Out Of Stock
            </button>
            <button
              onClick={() => chngRaido("1")}
              //className="flex h-full items-center justify-center rounded-full px-4 text-xl transition-all duration-150 ease-in-out hover:bg-blue-500/10"
              className={
                radioValue === "1" ? activeButnClass : notActiveButnClass
              }
            >
              Available
            </button>
          </div>
        </div>
        <div className="w-4/5 mr-4">
          <div
            style={{ width: "100%", height: "100vh", paddingTop: "1rem" }}
            className="overflow-hidden"
          >
            <AutoSizer>
              {({ height, width }) => (
                <List
                  height={height}
                  rowCount={itemsData.length}
                  rowHeight={500}
                  rowRenderer={({ key, index, style, parent }) =>
                    //Getdata(itemsData, index)
                    {
                      let e = itemsData[index] || props.data[index];
                      let vTitle = ` ${e.PART_NO}  - ${e.ITEM_DESCRIPTION}`;

                      let vSumNet = e.TOTAL_INVOICE_AMOUNT || 1;
                      let vSumBal = e.CUST_BALANCE || 1;
                      let prsnt = (vSumBal / vSumNet) * 100;
                      prsnt = toFixedTrunc(100 - prsnt, 2);
                      let obEntry = Object?.entries(e);

                      return (
                        <div key={key} style={style}>
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
                                  backgroundColor: "#14b8a6",
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
                                  {obEntry.map(([key, val] = entry, i) => {
                                    let bal = key === "CUST_BALANCE" ? val : 0;
                                    let vCustomValue;
                                    let val1;
                                    let color;

                                    let prcnt = bal ?? 1;

                                    if (
                                      key
                                        .replaceAll(" ")
                                        .replaceAll("_", " ") === "PRSNT"
                                    ) {
                                      return;
                                      vCustomValue = (
                                        <Progress
                                          type="circle"
                                          percent={+val}
                                          status={
                                            val === "0" ? "exception" : "active"
                                          }
                                          showInfo="true"
                                          width="100px"
                                          strokeColor={
                                            +val > 69
                                              ? "#ef4444"
                                              : +val > 30 && +val < 70
                                              ? "#facc15"
                                              : "#16a34a"
                                          }
                                        />
                                      );
                                    }

                                    if (
                                      key
                                        .replaceAll(" ")
                                        .replaceAll("_", " ") === "ITEM STATUS"
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
                                      vCustomValue = (
                                        <Tag color={color}>{val1}</Tag>
                                      );
                                    }

                                    return (
                                      <>
                                        <Descriptions.Item
                                          label={key
                                            .replaceAll(" ")
                                            .replaceAll("_", " ")}
                                          contentStyle={{
                                            fontWeight: "bold",
                                            color: "#0d9488",
                                          }}
                                          className="text-xl"
                                        >
                                          {Number.isFinite(val) === true
                                            ? new Intl.NumberFormat(
                                                "en-us"
                                              ).format(toFixedTrunc(val, 2))
                                            : ([key].includes(
                                                "LAST_PURCHASE_DATE"
                                              ) ||
                                                [key].includes(
                                                  "LAST_RETUERN_SALES_DATE"
                                                ) ||
                                                [key].includes(
                                                  "LAST_SALES_DATE"
                                                ) ||
                                                [key].includes(
                                                  "LAST_SALES_DATE"
                                                )) === true
                                            ? val &&
                                              moment(val).format("DD/MM/YYYY")
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
                                    {e.ITEM_ON_HAND_QTY <= 0 ? (
                                      <img
                                        src={"../icons/out_of_stock.png"}
                                        className="w-24 "
                                      />
                                    ) : (
                                      <img
                                        src={"../icons/Available.png"}
                                        className="w-24 "
                                      />
                                    )}
                                  </Descriptions.Item>

                                  {
                                    <Descriptions.Item
                                      label={""}
                                      contentStyle={{
                                        fontWeight: "bold",

                                        color: "rgb(29 78 216)",
                                      }}
                                    >
                                      <Progress
                                        className="w-24 mt-0"
                                        type="circle"
                                        format={(percent) =>
                                          //  +percent=== `${+percent} Sold `
                                          +percent > 69 && +percent < 100
                                            ? `${+percent}% Almoust finish `
                                            : +percent > 0 && +percent < 70
                                            ? `${+percent}%  Sold  `
                                            : +percent > 99
                                            ? `${+percent}%  Total Sold`
                                            : ` Not  Sold Yet `
                                        }
                                        percent={Math.trunc(+e.PRSNT)}
                                        status={
                                          e.PRSNT === "0"
                                            ? "exception"
                                            : "active"
                                        }
                                        showInfo="true"
                                        width="120px"
                                        strokeColor={
                                          +e.PRSNT > 69
                                            ? "#ef4444"
                                            : +e.PRSNT > 30 && +e.PRSNT < 70
                                            ? "#facc15"
                                            : "#16a34a"
                                        }
                                      />
                                    </Descriptions.Item>
                                  }
                                </Descriptions>
                              </Card.Body>
                              <Card.Divider />
                              <Card.Footer
                                className="flex justify-around"
                                isBlurred={"true"}
                              >
                                {/* <Row className="flex justify-around"> */}
                                <button
                                  className={ButtonCls}
                                  onClick={() => showModal(e.PART_NO)}
                                >
                                  Item Movment
                                </button>

                                <button
                                  className={ButtonCls}
                                  onClick={() => {
                                    //controlItemSummry(e.PART_NO, true)
                                    console.log(
                                      `on cloick ITEM CHART`,
                                      itemsData.filter(
                                        (r) => r.PART_NO === e.PART_NO
                                      )
                                    );

                                    setCurrItem(e.PART_NO);
                                    // setVisible(true);
                                    setDrawerFlag(true);
                                  }}
                                >
                                  Items Summarys
                                </button>
                                {/* </Row> */}
                              </Card.Footer>
                            </Card>
                          </Space>
                        </div>
                      );
                    }
                  }
                  width={width}
                  style={{ overFlow: "unset" }}
                  className="  	ml-48  scroll-smooth		"
                />
              )}
            </AutoSizer>
          </div>
        </div>
        {/* </Col> */}
        {/* </Row> */}
        <Modal
          title={`Item Movment For : ${currItem}`}
          centered
          visible={visible}
          onOk={() => setVisible(false)}
          onCancel={() => setVisible(false)}
          width={1500}
          //height={300}
          //className="h-96	"
        >
          <div>
            <ItemMovment partno={currItem} />
          </div>
        </Modal>
        <div>
          {drawerFlag && (
            <ItemChart
              isVisible={drawerFlag}
              partno={currItem}
              setShowFlag={setDrawerFlag}
            />
          )}
        </div>
      </Content>

      {/* {itemsSummryFlag && (
        <CustomerByItems
          showFlag={itemsSummryFlag}
          setShowFlag={controlItemSummry}
          keyVal={currItem}
          type="Customer"
        />
      )} */}
    </Layout>
  );
}
export async function getServerSideProps(context) {
  let rsp = await fetch(`http://localhost:3000/api/getItemsData?type=itemCard`);

  let data = await rsp.json();

  return {
    props: { data: data }, // will be passed to the page component as props
  };
}
