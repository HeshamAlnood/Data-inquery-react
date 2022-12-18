import { useEffect, useState } from "react";

import { Table, Loading } from "@nextui-org/react";
import lodash from "lodash";
import { DatePicker, Layout, Empty, Modal, Button } from "antd";
import moment from "moment";
import { requestData } from "../Methods/DataApi";
import { VerticalAlignBottomOutlined } from "@ant-design/icons";
import { wrtie, utils, writeFileXLSX, writeFile } from "xlsx";

const UnPaidInv = (props) => {
  let [invData, setInvData] = useState([]);
  let [invDataRaw, setInvDataRaw] = useState([]);
  let [dataCols, setDataCols] = useState([{ key: 1, label: 1 }]);
  let [colKey, setColKey] = useState(["2"]);
  let [isLoading, setIsLoading] = useState(true);
  let [isEmpty, setIsEmpty] = useState(false);

  const onClose = () => {
    //setIsVisible(false);
    //setShowFLag(false);
    props.setIsVisible(false);
  };

  console.log(`from UnPaid Inv `, props.custno, props);

  const HtmlTOExcel = (type = ".xlsx", fun, dl) => {
    var elt = document.getElementById("unpaidinv");
    var wb = utils.table_to_book(elt, { sheet: "sheet1" });
    return dl
      ? write(wb, { bookType: type, bookSST: true, type: "base64" })
      : writeFile(wb, fun || `UnPaid Invoices ${props.custno}` + ".xlsx");
  };

  const InfoData = {
    SIH_INV_NO: "Invoice No",
    SIH_INV_DATE: "Invoice Date",
    //  PART_NO: "Part No",
    SIH_CUSTOMER: "Customer",
    SIH_CUST_NAME: "Customer Name",
    SIH_NET_INV_AMT: "Net Amount",
    //NAME: "Customer / Vendor Name",
    SIH_PAID_AMT: "Paid Amount",

    SIH_INV_BALANCE: "Balance Amount",
  };

  const getColLabel = (plabel) => {
    return InfoData[plabel];
  };

  useEffect(() => {
    setIsLoading(true);
    fetch(
      `http://localhost:3000/api/requestData?inquery=UNPAIDINV&dfrom=${
        props.custno
      }&dto=${""}`
    )
      .then((rs) => rs.json())
      .then((data) => {
        let ob = {
          SIH_INV_NO: "Summary",
          SIH_INV_DATE: "",
          //  PART_NO: "Part No",
          SIH_CUSTOMER: "",
          SIH_CUST_NAME: "",
          SIH_NET_INV_AMT: ~~data
            .map((e) => e.SIH_NET_INV_AMT)
            .reduce((e, i) => +e + +i, 0),
          //NAME: "Customer / Vendor Name",
          SIH_PAID_AMT: ~~data
            .map((e) => e.SIH_PAID_AMT)
            .reduce((e, i) => +e + +i, 0),

          SIH_INV_BALANCE: ~~data
            .map((e) => e.SIH_INV_BALANCE)
            .reduce((e, i) => +e + +i, 0),
        };

        setInvData([ob, ...data]);
        setInvDataRaw([ob, ...data]);
        console.log(`from unpaid data`, data);
        let cols = data && Object.keys(data[0]);
        let colsArr = [];

        cols.forEach((e, i) => {
          let ob = { key: e, label: e };

          colsArr.push(ob);
        });

        setDataCols(colsArr);
      });
  }, [props.custno]);

  return (
    <Modal
      title={`Unpaid Invoices for ${props.custno}`}
      centered
      visible={props.isVisible}
      width={1200}
      high={600}
      onOk={() => onClose()}
      onCancel={() => onClose()}
    >
      <div>
        <Button
          size="lg"
          type="primary"
          className="bg-blue-500  float-right mb-4"
          shape="round"
          onClick={HtmlTOExcel}
        >
          Download Excel
          <VerticalAlignBottomOutlined style={{ paddingLeft: "0.5rem" }} />
        </Button>

        <Table
          id="unpaidinv"
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
                {getColLabel(column.label)}
              </Table.Column>
            )}
          </Table.Header>
          <Table.Body
            items={invData}
            //onLoadMore={itemMovmentData.loadMore}
          >
            {(item) => (
              <Table.Row
                key={item.SIH_INV_NO || 1}
                //id={+i}

                css={{
                  background: item.SIH_INV_NO === "Summary" ? "#e5e7eb" : "",
                  fontSize: item.SIH_INV_NO === "Summary" ? "1.2rem" : "",
                  position: item.SIH_INV_NO === "Summary" ? "sticky" : "",
                  top: item.SIH_INV_NO === "Summary" ? "0px" : "",
                  //color: item.CATEGORY === "Summary" ? "#e5e7eb" : "white",
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
    </Modal>
  );
};

export default UnPaidInv;
