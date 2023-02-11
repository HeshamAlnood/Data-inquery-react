import { useEffect, useState } from "react";
import { Descriptions, Button, DatePicker, Modal, Divider } from "antd";
import moment from "moment";
import { Table, Loading } from "@nextui-org/react";
import { VerticalAlignBottomOutlined } from "@ant-design/icons";
//import HtmlTOExcel from "../Methods/exportExcel";
//import { wrtie, utils, writeFileXLSX, writeFile } from "xlsx";
//import * as XLSX from "xlsx-js-style";
import { printExcel } from "../Methods/StatOfAcntExcel";

const { RangePicker } = DatePicker;

const StatOfAccntC = (props) => {
  let [currCustomer, setCurrCustomer] = useState([]);

  let [customerHist, setCustomerHist] = useState([]);
  let [dateR, setDateR] = useState([]);

  let [isDone, setIsDone] = useState(true);
  let [openBal, setOpenBal] = useState(0);
  let [currBal, setCurrBal] = useState(0);
  let [closeBal, setCloseBal] = useState(0);
  let [totalCr, setTotalCr] = useState(0);
  let [totalDb, setTotalDb] = useState(0);

  //let []

  function formatNum(num) {
    //return toFixedTrunc(num, 2);
    return new Intl.NumberFormat("en-IN", {
      //maximumSignificantDigits: 3,
    }).format(+toFixedTrunc(Math.abs(num), 2));
  }

  const calcBal = (data) => {
    let openBal = data.map((e) => +e.OPEN_BALANCE || 0)[1];
    console.log(`using protoyupe `, openBal.formatNum(openBal));
    setOpenBal(openBal.formatNum(openBal));
    let currBal = +data[data.length - 1 || 0]?.BAL || 0;
    console.log(`curr bal `, currBal, currBal.formatNum(+currBal));
    setCurrBal(currBal.formatNum(+currBal));
    let totalCr = data
      .map((e) => +e.CH_CREDIT_AMT)
      .reduce((a, b) => +a + +b, 0);
    let totalDb = data.map((e) => +e.CH_DEBIT_AMT).reduce((a, b) => +a + +b, 0);
    let vCloseBal = +totalDb - +totalCr;
    setCloseBal(vCloseBal.formatNum(vCloseBal));
    console.log(`cvalc val `, `openBal ${openBal} currBal ${currBal} `);
  };

  console.log(`is Done or Loading  ? `, !isDone, isDone);

  let visible = props.isVisible || false;

  let columns = [
    { key: "RNK", label: "SRL No" },
    //{ key: "CH_CUSTOMER", label: e },
    { key: "CH_DOC", label: "Source" },
    { key: "CH_DOC_REF_NO", label: "Ref Doc No" },
    { key: "CH_DATE", label: "Doc Date" },
    { key: "CH_DOC_REMARKS", label: "REMARKS" },
    { key: "CH_DEBIT_AMT", label: "Debit" },
    { key: "CH_CREDIT_AMT", label: "Credit" },
    { key: "CH_RECEIPT_NO", label: "Receipt No" },
    { key: "BAL", label: "Balance" },
  ];
  let [dataCols, setDataCols] = useState(columns);

  const toFixedTrunc = (x, n) => {
    const v = (typeof x === "string" ? x : x.toString()).split(".");
    if (n <= 0) return v[0];
    let f = v[1] || "";
    if (f.length > n) return `${v[0]}.${f.substr(0, n)}`;
    while (f.length < n) f += "0";
    return `${v[0]}.${f}`;
  };

  const getCustHist = () => {
    console.log(`prp for cals `, props.currCustomer, dateR[0], dateR[1]);
    let dateF = dateR[0].format("YYYYMMDD");
    let dateT = dateR[1].format("YYYYMMDD");
    setIsDone(false);

    fetch(
      `http://localhost:3000/api/getCustHist?customer=${props.currCustomer}&dfrom=${dateF}&dto=${dateT}`
    )
      .then((rsp) => rsp.json())
      .then((data) => {
        setIsDone(true);
        setCustomerHist(data);
        calcBal(data);
      });
  };

  const onChangeDateRange = (dates, dateStrings) => {
    if (dates) {
      console.log(
        `dates `,
        moment(dates[0]).format("YYYYMMDD"),
        moment(dates[1]).format("YYYYMMDD")
      );
      setDateR([moment(dates[0]), moment(dates[1])]);
    }
    /*if (dates[1].length > 1) {
      getCustHist();
    }*/
  };

  const search = () => {
    console.log(dateR);

    if (dateR[0].length < 2 || dateR[1].length < 2) {
      return;
    }
    getCustHist();
  };

  const getData = () => {
    fetch(`http://localhost:3000/api/requestData?inquery=customer`)
      .then((rsp) => rsp.json())
      .then((data) => {
        setCurrCustomer(
          data.filter((e) => e.CUST_CUSTOMER === props.currCustomer)
        );
      });
  };

  useEffect(() => {
    Number.prototype.formatNum = function (f) {
      console.log(`print from number proto `, f);
      return formatNum(f);
    };
    getData();
    //getCustHist();
  }, []);

  const getHeaderData = () => {
    let dateF = moment(dateR[0]).format("DD/MM/YYYY");
    let dateT = moment(dateR[1]).format("DD/MM/YYYY");
    return (
      <>
        <Descriptions
          title={`                 Covering Transactions Starting From ${dateF} To: ${dateT}`}
          bordered={true}
          contentStyle={{ fontSize: "15px", color: "blue" }}
          labelStyle={{ fontStyle: "oblique", fontSize: "15px" }}
        >
          {currCustomer?.map((e) => (
            <>
              <Descriptions.Item label="Cust. No">
                {e.CUST_CUSTOMER}
              </Descriptions.Item>
              <Descriptions.Item label="Customer Name">
                {e.CUST_NAME}
              </Descriptions.Item>
              <Descriptions.Item label="Address">
                {e.CUST_ADDRESS}
              </Descriptions.Item>
              <Descriptions.Item label="Contact Person">
                {e.CUST_PHONE}
              </Descriptions.Item>
              <Descriptions.Item label="E-Mail">
                {e.CUST_EMAIL}
              </Descriptions.Item>
              <Descriptions.Item label="Terms">
                {e.CUST_TERMS}
              </Descriptions.Item>
              <Descriptions.Item label="Credit Limit">
                {e.CUST_CREDIT_LIMIT}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {e.CUST_PHONE}
              </Descriptions.Item>

              <Descriptions.Item label="Fax">{e.CUST_FAX}</Descriptions.Item>
              <Descriptions.Item label="Open Balance" className="bg-red-50">
                {openBal}
              </Descriptions.Item>

              <Descriptions.Item label="Close Bal" className="bg-red-50">
                {closeBal}
              </Descriptions.Item>
              <Descriptions.Item label="Curr Bal" className="bg-red-50">
                {currBal}
              </Descriptions.Item>
            </>
          ))}
        </Descriptions>
      </>
    );
  };

  const getTableData = () => {
    return (
      <div
        className="min-w-fit max-w-5xl	 relative "
        style={{
          minHeight: "10rem",
          maxHeight: "53rem",
        }}
      >
        <Table
          id="custHistData"
          striped
          lined={true}
          //sticked={"true"}
          bordered={false}
          aria-label="Example static striped collection table"
          hoverable={"true"}
          borderWeight="black"
          lineWeight="light"
          fixed={true}
          containerCss={{
            //height: "50%",
            height: "53rem",
            width: "100%",
            position: "sticky",
            overflowY: "scroll",
          }}
        >
          <Table.Header columns={dataCols}>
            {(column) => (
              <Table.Column
                key={column.key || "1"}
                align="start"
                className="bg-sky-600 text-slate-50 text-base   "
                isRowHeader={true}
                //headerLined={true}
                //allowsSorting
                //name={column.label}
                css={{
                  //width: "10px",
                  minWidth: "30px" /* height: "calc($space$14 * 10)" }*/,
                  maxHeight: "100px",

                  zIndex: 300,
                  position: "sticky",
                  top: "0px",
                }}
              >
                {""}
                {column.label}
              </Table.Column>
            )}
          </Table.Header>
          <Table.Body
            items={customerHist}
            //onLoadMore={itemMovmentData.loadMore}
          >
            {(item, i) => (
              <Table.Row
                key={item.RNK || 1}
                //id={+i}

                css={{
                  background: item.CATEGORY === "Summary" ? "#e5e7eb" : "",
                  fontSize: item.CATEGORY === "Summary" ? "1.2rem" : "",
                  position: item.CATEGORY === "Summary" ? "sticky" : "",
                  top: item.CATEGORY === "Summary" ? "0px" : "",
                  //color: item.CATEGORY === "Summary" ? "#e5e7eb" : "white",
                  "&:hover": {
                    background: "$yellow100",
                    color: "$blue400",
                  },
                }}
              >
                {
                  /*(columnKey) => <Table.Cell>{item[columnKey]}</Table.Cell>*/
                  (columnKey, i) => {
                    return (
                      <Table.Cell
                        css={{
                          width: "10px",
                          minWidth: "2px" /* height: "calc($space$14 * 10)" }*/,
                          color:
                            item.CH_DOC === "RECEIPT" ||
                            item.CH_DOC === "SALES_RETURN " ||
                            item.CH_DOC === "SALES_RETURN_VAT "
                              ? "red"
                              : item.CATEGORY === "Summary"
                              ? "black"
                              : "green",
                        }}
                      >
                        {item[columnKey]}
                      </Table.Cell>
                    );
                  }
                }
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>
    );
  };
  const onClose = () => {
    props.setIsVisible(false);
  };
  return (
    <Modal
      // title={`Statment Of Account for ${
      //   currCustomer?.CUST_CUSTOMER + " " + currCustomer?.CUST_NAME
      // }`}
      centered
      visible={visible}
      width={1750}
      high={1550}
      onOk={() => onClose()}
      onCancel={() => onClose()}
    >
      {/* <div className="grid grid-cols-2 gap-8 rounded-lg "> */}
      <div>
        {getHeaderData()}
        <Divider />
        <div className="pb-4 flex justify-end">
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
            size={"large"}
            style={{ borderRadius: "9999999px", textAlign: "justify" }}
            className="text-lg text-justify	"
          />
          <Button
            type="primary"
            size="large"
            shape="round"
            loading={!isDone}
            //block={true}
            className="w-48 h-48 hvr-glow "
            onClick={() => search()}
          >
            {" "}
            Search
          </Button>
          <Button
            type="primary"
            size="large"
            shape="round"
            //block={true}
            className="w-32 h-48 hvr-glow"
            onClick={() =>
              /* HtmlTOExcel(
                [...currCustomer],
                dataCols.map((e) => e.key),
                `Statment of Account `
              )*/ printExcel(currCustomer, customerHist, {
                openBalance: openBal,
                currbal: currBal,
                closeBal: closeBal,
              })
            }
          >
            Excel
            <VerticalAlignBottomOutlined style={{ paddingLeft: "0.5rem" }} />
          </Button>
        </div>
        {getTableData()}
      </div>
    </Modal>
  );
};

export default StatOfAccntC;
