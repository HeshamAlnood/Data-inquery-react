import { useEffect, useState, useRef } from "react";

import { Card, Loading } from "@nextui-org/react";
import lodash, { assign } from "lodash";
import { DatePicker, Layout, Empty, Progress, Skeleton } from "antd";
import moment from "moment";
import { AutoSizer, List, VariableSizeGrid as Grid } from "react-virtualized";
import VirtualTable from "./VirtualTable";
export const MostSale = (props) => {
  const { RangePicker } = DatePicker;
  let [dataItem, setDataItem] = useState([]);
  let [dataItemRaw, setDataItemRaw] = useState([]);
  let [dateFrom, setDateFrom] = useState();
  let [dateTo, setDateTo] = useState();
  let [isDone, setIsDone] = useState(false);
  let [isEmpty, setIsEmpty] = useState(false);
  let dateF = moment().format("yyyyMMDD") - 20;
  let dateT = moment().format("yyyyMMDD");

  const searchInput = useRef(null);
  const searchAllInput = useRef(null);

  const getProgress = (value) => {
    let valueFormtd = Math.trunc(100 - value);
    let color =
      valueFormtd > 69
        ? "#ef4444"
        : valueFormtd > 30 && valueFormtd < 70
        ? "#facc15"
        : "#16a34a";
    return (
      <div
        style={{
          width: 100,
        }}
      >
        <Progress
          percent={valueFormtd}
          size="small"
          status="active"
          strokeColor={color}
        />
      </div>
    );
  };

  const getDataTd = (data) => {
    const [key, value] = Object.entries(data);

    return Object.entries(data).map((e, i) => (
      <td className="   border-slate-300 text-xs pl-8">
        {" "}
        {e[0] === "PRSN" ? getProgress(e[1]) : e[1]}
      </td>
    ));
  };
  let columns = ["PART NO", "NAME", "SOLD ", "PRICE", "Stock ", ""];
  const searchTable = (value) => {
    let vVal = value;
    let qryu = [];
    console.log(`vVal`, vVal);
    setIsDone(false);
    setIsEmpty(false);

    try {
      if (value.length === 0) {
        //resetFilter();
        setDataItem(dataItemRaw);
        setIsDone(true);
        //setIsEmpty(true);
        return;
      }
      let data = dataItemRaw || dataItem;
      //console.log(` data search`, Object.keys(data[0]));
      let cols = Object.keys(dataItemRaw[0]);
      console.log(` cols search`, cols);
      cols.forEach((c) => {
        try {
          data.forEach((e) =>
            e[c]
              ?.toString()
              .toLowerCase()
              .indexOf(vVal?.toString().toLowerCase()) > -1
              ? qryu.push(e)
              : ""
          );
        } catch (e) {
          console.log(`err`, e);
        }
      });

      setDataItem([...new Set(qryu)]);
      //qryu.length = 0;
      qryu.length > 0 ? setIsDone(true) : setIsEmpty(true);
    } catch (e) {
      console.log(e);
    }
  };

  const onChangeDateRange = (dates, dateStrings) => {
    if (dates) {
      let vStartDate = moment(dates[0]).format("yyyyMMDD"); /*moment(dates[0])*/

      let vEndDate = moment(dates[1]).format("yyyyMMDD");

      setDateFrom(vStartDate);
      setDateTo(vEndDate);
    } else {
      setDateFrom(dateF);
      setDateTo(dateT);
      setDataItem(dataItemRaw);
    }
  };
  useEffect(() => {
    setIsDone(false);
    console.log(`date from `, dateF, `date to `, dateT);

    fetch(
      `http://localhost:3000/api/requestData?inquery=MOSTSALE&dfrom=${dateF}&dto=${dateT}`
    )
      .then((rsp) => rsp.json())
      .then((data) => {
        setDataItem(data);
        setDataItemRaw(data);
        setIsDone(true);
      });
  }, []);

  useEffect(() => {
    setIsDone(false);

    fetch(
      `http://localhost:3000/api/requestData?inquery=MOSTSALE&dfrom=${dateFrom}&dto=${dateTo}`
    )
      .then((rsp) => rsp.json())
      .then((data) => {
        setDataItem(data);
        setDataItemRaw(data);
        setIsDone(true);
      });
  }, [dateFrom, dateTo]);

  return (
    <>
      <div className=" ">
        <Card
          bordered={false}
          hoverable="true"
          style={{
            minHeight: "15.9rem",
            maxHeight: "36.9rem",
            //marginLeft: "6.45rem",
            borderRadius: "2%",
            //backgroundColor: /*"transparent"*/ "rgb(55 65 81)",
            minWidth: "50%",
            maxWidth: "100%",
          }}
          className="glassy bg-gray-700   "
        >
          {" "}
          <div className="  relative   bg-white max-w-full ">
            <h1 className=" mt-4 ml-16 text-xl text-slate-600">
              Top 20 Product Sold
            </h1>
            <div className=" relative mt-4 pb-4 flex justify-around	min-w-fit max-w-full">
              {/* <h1 className="text-lg	"> Chose Date :</h1> */}
              <input
                className=" inputSearch border-slate-300	 focus:border-blue-50 w-full   placeholder-shown:w-64	border-2 rounded-full placeholder:text-slate-300 w-32 h-8	"
                //id="inputSearch"
                ref={searchAllInput}
                type="text"
                name="search"
                placeholder="Search All Data..."
                onKeyUp={(e) => searchTable(e.target.value)}
              />
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
                  "This Year": [
                    moment().startOf("year"),
                    moment().endOf("year"),
                  ],
                }}
                format="YYYY/MM/DD"
                onChange={onChangeDateRange}
                size={"large"}
                style={{ borderRadius: "9999999px", textAlign: "justify" }}
                className="text-lg text-justify w-64 h-8 	"
              />
            </div>
            <div
              className="min-w-fit max-w-full	 relative overflow-scroll relative  "
              style={
                {
                  //height: "50rem",
                  // minHeight: "10rem",
                  //maxHeight: "32rem",
                  //  overflowY: "scroll",
                  //position: "relative",
                }
              }
              id="tabledev"
            >
              {isEmpty && (
                <div className="flex justify-center     min-w-full">
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                </div>
              )}
              {isDone ?? (
                <div className="flex justify-center max-h-full min-h-96 max-h-96 max-w-full min-w-96  ">
                  <div className="article ">
                    <Skeleton active />
                  </div>
                </div>
              )}

              {isDone && (
                <table
                  id="table"
                  className="table-fixed  border-spacing-2 	mr-8 ml-8   "
                >
                  <thead className="border-none  ">
                    <tr className="bg-white h-8  border-b-4 border-indigo-500  	">
                      {columns.map((e) => (
                        <th
                          className="text-center"
                          //   className={
                          //     e === "PART NO"
                          //       ? "rounded-l-lg text-white"
                          //       : e === "PRSNT"
                          //       ? "rounded-r-lg text-white"
                          //       : "rounded-none text-white"
                          //   }
                        >
                          {e}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dataItem.map((e, i) => (
                      <tr
                        id={i}
                        className="odd:bg-white even:bg-slate-100 hover:bg-yellow-50 hover:text-sky-600 h-8 text-center	"
                      >
                        {getDataTd(e)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};
