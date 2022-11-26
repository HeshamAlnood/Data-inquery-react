import { useEffect, useState } from "react";

import { Table, Loading } from "@nextui-org/react";
import lodash from "lodash";
import { DatePicker, Layout, Empty } from "antd";
import moment from "moment";
const ItemMovment = (props) => {
  let [itemMovmentData, setItemMovmentData] = useState([]);
  let [itemMovmentDataRaw, setItemMovmentDataRaw] = useState([]);
  let [dataCols, setDataCols] = useState([{ key: 1, label: 1 }]);
  let [colKey, setColKey] = useState(["2"]);
  let [isLoading, setIsLoading] = useState(true);
  let [isEmpty, setIsEmpty] = useState(false);

  const { RangePicker } = DatePicker;

  console.log(`inside Item Movment`, props.partno);

  const [columnKeys, setColumnKeys] = useState(
    colKey.map((column) => column.key)
  );

  function toFixedTrunc(x, n) {
    const v = (typeof x === "string" ? x : x.toString()).split(".");
    if (n <= 0) return v[0];
    let f = v[1] || "";
    if (f.length > n) return `${v[0]}.${f.substr(0, n)}`;
    while (f.length < n) f += "0";
    return `${v[0]}.${f}`;
  }

  const resetFilter = () => {
    setItemMovmentData(itemMovmentDataRaw);

    //setSearchText("");
  };
  const onChangeDateRange = (dates, dateStrings) => {
    if (dates) {
      let vStartDate = moment(dates[0]);
      let vEndDate = moment(dates[1]);
      let dataOb = itemMovmentData || [];

      var resultProductData = itemMovmentData.filter((a) => {
        let startDate = new Date(vStartDate);
        let endDate = new Date(vEndDate);
        let vObDateCol = "INV_DATE";
        var date = new Date(a[vObDateCol]);
        return (date >= startDate) & (date <= endDate);
      });

      if (resultProductData.length > 0) {
        let obSummary = {
          CATEGORY: "Summary",
          INV_NO: "",
          // PART_NO: "",
          INV_DATE: "",
          CUSTOMER: "",
          VENDOR: "",
          //NAME: "Customer / Vendor Name",
          IN_QTY: resultProductData
            .map((e) => +e.IN_QTY || 0)
            .reduce((e, o) => e + o, 0),

          IN_UNIT_PRICE: toFixedTrunc(
            resultProductData
              .map((e) => +e.IN_UNIT_PRICE || 0)
              .reduce((e, o) => +e + +o, 0),
            2
          ),

          OUT_QTY: resultProductData
            .map((e) => +e.OUT_QTY || 0)
            .reduce((e, o) => +e + +o, 0),
          OUT_UNIT_PRICE: toFixedTrunc(
            resultProductData
              .map((e) => +e.OUT_UNIT_PRICE || 0)
              .reduce((e, o) => +e + +o, 0),
            2
          ),
        };
        setIsEmpty(false);
        setItemMovmentData([obSummary, ...resultProductData]);
        //fillStateProps(resultProductData, props.query);
      } else {
        setIsEmpty(true);
      }
    } else {
      resetFilter();
      setIsEmpty(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetch(
      `http://localhost:3000/api/getItemsData?type=itemCardMovment&keyVal=${props.partno}`
    )
      .then((rs) => rs.json())
      .then((data) => {
        //        console.log(`item movment data`, data);

        let obSummary = {
          CATEGORY: "Summary",
          INV_NO: "",
          // PART_NO: "",
          INV_DATE: "",
          CUSTOMER: "",
          VENDOR: "",
          //NAME: "Customer / Vendor Name",
          IN_QTY: data.map((e) => +e.IN_QTY || 0).reduce((e, o) => e + o, 0),

          IN_UNIT_PRICE: toFixedTrunc(
            data.map((e) => +e.IN_UNIT_PRICE || 0).reduce((e, o) => +e + +o, 0),
            2
          ),

          OUT_QTY: data
            .map((e) => +e.OUT_QTY || 0)
            .reduce((e, o) => +e + +o, 0),
          OUT_UNIT_PRICE: toFixedTrunc(
            data
              .map((e) => +e.OUT_UNIT_PRICE || 0)
              .reduce((e, o) => +e + +o, 0),
            2
          ),
        };

        console.log(`obSummary`, obSummary);

        setItemMovmentData([obSummary, ...data]);
        setItemMovmentDataRaw([obSummary, ...data]);

        console.log(`item movment data`, data);

        let cols = data && Object.keys(data[0]);
        let colsArr = [];

        cols.forEach((e, i) => {
          let ob = { key: e, label: e };

          colsArr.push(ob);
        });

        setColKey(colsArr);

        setDataCols(colsArr);
        setColKey(colsArr);
        if (data.length > 0) {
          setIsLoading(false);
          setIsEmpty(false);
        } else setIsEmpty(true);
      });
  }, [props.partno]);

  const InfoData = {
    CATEGORY: "Trans Type",
    INV_NO: "Invoice No",
    //  PART_NO: "Part No",
    INV_DATE: "Trans Date",
    CUSTOMER: "Customer",
    VENDOR: "Vendor",
    //NAME: "Customer / Vendor Name",
    IN_QTY: "In Qty",
    IN_UNIT_PRICE: "Purchase Price",
    OUT_QTY: "Out Qty",
    OUT_UNIT_PRICE: "Sale Price",
  };
  const getColLabel = (plabel) => {
    return InfoData[plabel];
  };

  if (isLoading === true) {
    return (
      <div className="flex justify-center">
        <div className="article ">
          <Loading size="xl">Loading ...</Loading>
        </div>
      </div>
    );
  }

  if (isEmpty === true) {
    return <Empty description={<span>No Movment on this Item</span>} />;
  }

  return (
    /*style={{ width: "78.8rem" }}*/
    <div className="  relative  ">
      <div className="flex flex-col">
        <h1 className="text-lg	"> Chose Date :</h1>
        <RangePicker
          ranges={{
            Yesterday: [moment().day(-1), moment().day(-1)],

            Today: [moment(), moment()],
            "This Week": [moment().day(-7), moment().day(0)],
            "This Month": [moment().startOf("month"), moment().endOf("month")],
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
      </div>
      <div
        className="min-w-fit max-w-5xl	 relative "
        style={{
          //height: "50rem",
          minHeight: "10rem",
          maxHeight: "53rem",
          overflowY: "scroll",
          //position: "relative",
        }}
      >
        <Table
          id="ItemMovementDataTable"
          striped
          lined={true}
          //sticked
          bordered={false}
          aria-label="Example static striped collection table"
          hoverable="true"
          borderWeight="black"
          lineWeight="light"
          fixed={true}
          onSelectionChange={(keys) => console.log(`keyyys`, keys)}
          css={{
            height: "50%",
            width: "100%",
            //overflowY: "scroll",
            //minWidth: "50%",

            //position: "relative",
            //   height: "calc($space$14 * 10)",
          }} /*css={{
          height: "auto",
          minWidth: "100%",
          width: "100%",
          zIndex: 1,
        }}*/
        >
          <Table.Header columns={dataCols}>
            {(column) => (
              <Table.Column
                key={column.key || "1"}
                align="start"
                className="bg-teal-600 text-slate-50 text-base   "
                isRowHeader={true}
                //headerLined={true}
                //allowsSorting
                //name={column.label}
                css={{
                  //width: "10px",
                  minWidth: "30px" /* height: "calc($space$14 * 10)" }*/,
                  maxHeight: "100px",
                  position: "sticky",

                  zIndex: 3,
                  position: "sticky",
                  top: "0px",
                }}
              >
                {""}
                {getColLabel(column.label)}
              </Table.Column>
            )}
          </Table.Header>
          <Table.Body
            items={itemMovmentData}
            //onLoadMore={itemMovmentData.loadMore}
          >
            {(item, i) => (
              <Table.Row
                key={item + i}
                id={item + i}
                css={{
                  background: item.CATEGORY === "Summary" ? "#e5e7eb" : "",
                  fontSize: item.CATEGORY === "Summary" ? "1.2rem" : "",

                  //color: item.CATEGORY === "summary" ? "#e5e7eb" : "white",
                  "&:hover": {
                    background: "$yellow100",
                    color: "$blue400",
                  },
                }}
              >
                {
                  /*(columnKey) => <Table.Cell>{item[columnKey]}</Table.Cell>*/
                  (columnKey) => {
                    return (
                      <Table.Cell
                        css={{
                          width: "10px",
                          minWidth: "2px" /* height: "calc($space$14 * 10)" }*/,
                          color:
                            item.CATEGORY === "SALES" ||
                            item.CATEGORY === "PURCHASE RETURN"
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
    </div>
  );
};

export default ItemMovment;
