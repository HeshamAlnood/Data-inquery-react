import { useEffect, useState } from "react";
import lodash, { conforms } from "lodash";
import validator from "validator";
import {
  Table,
  Modal,
  Layout,
  Divider,
  Statistic,
  Space,
  Skeleton,
} from "antd";
import Item from "antd/lib/list/Item";
import moment from "moment";
const { Header, Footer, Sider, Content } = Layout;

export const CustomerByItems = (props) => {
  console.log(`com CustomerByItems`, props);
  let [custData, setCustData] = useState([]);
  let [dataCols, setDataCols] = useState([]);

  const [vshowFlag, setShowFLag] = useState(false);

  const [visible, setVisible] = useState(false);
  const [size, setSize] = useState();
  let [isDone, setIsDone] = useState(false);

  let vType = props.type;
  let vKeyVal = props.keyVal || "A-0001";

  let [custItemReturn, setCustItemReturn] = useState([]);
  let [custItemReturnCols, setCustItemReturnCols] = useState([]);

  let obSummary = {
    totalSold: 0,
    totalQuantitySold: 0,
    mostItemSold: 0,
    totalQuantityReturned: 0,
    totalReturned: 0,
  };
  let [ItemTotal, setItemTotal] = useState({ obSummary });

  const setSummary = (data = []) => {
    let totalSold = data?.map((e) => +e.TOT_AMT).reduce((a, b) => a + b, 0);

    let totalQtySold = data
      ?.map((e) => +e.TOTAL_QTY)
      .reduce((a, b) => a + b, 0);

    let mostItemSold = data?.filter((e) => +e.RNK === 1)[0];

    let totQtyRet = data?.map((e) => +e.RETURN_QTY).reduce((a, b) => a + b, 0);

    let totRetAmt = data?.map((e) => +e.RETURN_AMT).reduce((a, b) => a + b, 0);

    obSummary.totalSold = new Intl.NumberFormat("en-IN", {
      //maximumSignificantDigits: 3,
    }).format(totalSold);
    obSummary.totalQuantitySold = totalQtySold;
    obSummary.mostItemSold = `${mostItemSold.PART_NO} - ${mostItemSold.PART_NAME}`;
    obSummary.totalQuantityReturned = totQtyRet;
    obSummary.totalReturned = new Intl.NumberFormat("en-IN", {
      //maximumSignificantDigits: 3,
    }).format(totRetAmt);
    setItemTotal(obSummary);
    console.log(obSummary);
  };

  const getReturnItem = (data = []) => {
    let retItemOnly = data?.filter((e) => +e.RETURN_QTY > 0);
    let rslt = [];
    console.log(`retItemOnly`, retItemOnly);

    retItemOnly?.forEach((e) =>
      rslt.push(
        lodash.pick(e, [
          "CUSTOMER",
          "PART_NO",
          "PART_NAME",
          "RETURN_QTY",
          "RETURN_AMT",
        ])
      )
    );
    return rslt || [{}];
  };

  const onClose = () => {
    setVisible(false);
    setShowFLag(false);
    props.setShowFlag("", false);
  };

  const generateCols = (ob = []) => {
    //let cols = Object.keys(ob[1]);
    let cols = [];
    cols = ob;
    let colsArr = [];

    cols.forEach((e, i) => {
      //console.log(`col for Each`, e);
      let ob = {
        title: e
          .replaceAll("_", " ")
          .replaceAll("SIH", "")
          .replaceAll("SIC", ""),
        dataIndex: e,
        sorted: true,
        width: 10,
        visible: false,
        //fixed: "SRL" === e ? "left" : "",
        /*shouldCellUpdate: () =>
          false /*(record, prevRecord) => prevRecord.key !== record.key*/

        responsive: ["lg", "md"],
        //filteredValue: filteredInfo[e] || null,
        defaultSortOrder: "descend",
        /*filterMode: "tree",
        filterSearch: true,*/
        responsive: ["lg", "md"],
        //...getColumnSearchProps(e),

        //  onFilter: (value, record) => record[e].startsWith(value),

        sorter: (a, b) => {
          //  console.log("check validator");
          let sa = a[e] || "";
          let sb = b[e] || "";
          validator.isFloat(sa.toString()) + " " + sa;

          if (validator.isFloat(sa.toString()) === true) {
            //  console.log("sort Numbers");
            return (Number.parseFloat(sa) || 1) - (Number.parseFloat(sb) || -1);
          } else if (validator.isAlpha(sa.toString()) === true) {
            //console.log("sort Strings");
            return (sa || "a")
              .toString()
              .toLowerCase()
              .localeCompare((sb || "b").toString().toLowerCase());
          } else {
            if (sa < sb) {
              return -1;
            }
            if (sa > sb) {
              return 1;
            }
            return 0;
          }
        },

        render: (text, record) => (
          <div style={{ wordWrap: "break-word", wordBreak: "break-word" }}>
            {/* {e === "START_SALES" ? moment(text).format("DD/MM/YYYY") : text} */}
            {([e].includes("START_SALES") || [e].includes("LAST_SALES")) ===
            true
              ? moment(text).format("DD/MM/YYYY")
              : text}
          </div>
        ),

        sortDirections: ["descend", "ascend"],
      };

      colsArr.push(ob);
    });

    //setDataCols(colsArr);
    return colsArr;
  };

  useEffect(() => {
    console.log(`api items for vKeyVal `, vKeyVal);
    fetch(
      `http://localhost:3000/api/requestData?inquery=CUSTOMERBYITEM&dfrom=${vKeyVal}`
    )
      .then((rsp) => rsp.json())
      .then((data) => {
        setIsDone(false);
        console.log(`api items for cutomer`, data);

        let rslt = [];

        data?.forEach((e) =>
          rslt.push(
            lodash.omit(e, ["CUSTOMER", "RETURN_QTY", "RETURN_AMT", "RANK"])
          )
        );
        //rslt = lodash.omit(rslt, ["CUSTOMER", "RETURN_QTY", "RETURN_AMT"]);
        console.log(`rslt `, rslt);
        let cols = Object?.keys(rslt[1]);

        setCustData(rslt);
        setDataCols(generateCols(cols));

        setCustItemReturn(getReturnItem(data));
        setCustItemReturnCols(
          generateCols(Object?.keys(getReturnItem(data)[1]))
        );
        setSummary(data || []);
        setIsDone(true);
        console.log(`data item `, data);
      });
  }, []);

  useEffect(() => {
    //setShowFLag(props.showFlag);
    props.showFlag === true ? setVisible(true) : setVisible(false);
    props.showFlag === true ? setShowFLag(true) : setShowFLag(false);
  }, [props.showFlag]);

  if (isDone === false) {
    return (
      <div className="flex justify-center">
        <div className="article ">
          <Skeleton active />
        </div>
      </div>
    );
  }

  return (
    <>
      <Modal
        title={`Item Summary for ${vKeyVal}`}
        centered
        visible={visible}
        width={1750}
        high={1550}
        onOk={() => onClose()}
        onCancel={() => onClose()}
      >
        <div className="grid grid-cols-2 gap-8 rounded-lg ">
          <Statistic
            title="Total Amount Sold"
            value={ItemTotal.totalSold}
            valueStyle={{
              color: "rgb(21 128 61)",
              borderBottomWidth: "2px",
              textAlign: "end",
            }}
            className="rounded-lg hover:border-blue-200 hover:border-2  hover:duration-100   hover:ring-offset-8"
          />
          <Statistic
            title="Total Quantiny Sold"
            value={ItemTotal.totalQuantitySold}
            valueStyle={{
              color: "rgb(6 182 212)",
              borderBottomWidth: "2px",
              textAlign: "end",
            }}
            className="rounded-lg hover:border-blue-200 hover:border-2  hover:duration-100   hover:ring-offset-8"
          />

          <Statistic
            title="Most Item Sold"
            value={ItemTotal.mostItemSold}
            valueStyle={{
              color: "rgb(59 130 246)",
              borderBottomWidth: "2px",
              textAlign: "end",
            }}
            className="rounded-lg hover:border-blue-200 hover:border-2  hover:duration-100   hover:ring-offset-8"
          />
          <Statistic
            title="Total Quantity Returned"
            value={ItemTotal.totalQuantityReturned}
            valueStyle={{
              color: "rgb(248 113 113)",
              borderBottomWidth: "2px",
              textAlign: "end",
            }}
            className="rounded-lg hover:border-blue-200 hover:border-2  hover:duration-100   hover:ring-offset-8"
          />
          <Statistic
            title="Total  Returned Amount"
            value={Item.totalReturned}
            valueStyle={{
              color: "rgb(220 38 38)",
              borderBottomWidth: "2px",
              textAlign: "end",
            }}
            className="rounded-lg hover:border-blue-200 hover:border-2  hover:duration-100   hover:ring-offset-8"
          />
        </div>

        <Divider>{vKeyVal} Items Transctions</Divider>
        <div class="grid grid-cols-2 gap-24">
          <div className="">
            <div className="w-2/2	">
              <Divider>Items Sold</Divider>
              <Table
                id="custItemsTable"
                //bordered="true"
                size="small"
                //editable
                columns={dataCols}
                rowKey={(record) => record["PART_NO"]}
                //rowSelection={{ ...rowSelection }}
                dataSource={custData}
                pagination={{ defaultPageSize: 100 }}
                //loading={setIsLoading}
                //onChange={handleChange}
                scroll={{
                  //y: 240,
                  x: "33vw",
                  y: 300,
                }}
              />
            </div>
          </div>

          <div className="basis-1/2">
            <div className="w-2/2">
              <Divider>Items Returned</Divider>
              <Table
                id="custItemsTableRet"
                //bordered="true"
                size="small"
                //editable
                columns={custItemReturnCols}
                rowKey={(record) => record["PART_NO"]}
                //rowSelection={{ ...rowSelection }}
                dataSource={custItemReturn}
                pagination={{ defaultPageSize: 100 }}
                //loading={setIsLoading}
                //onChange={handleChange}
                scroll={{
                  //y: 240,
                  x: "33vw",
                  y: 300,
                }}
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

//export default CustomerByItems;
