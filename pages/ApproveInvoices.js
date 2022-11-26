import { useEffect, useState, useRef, useReducer, useContext } from "react";
import { Container, Grid, Loading, Button } from "@nextui-org/react";
import { SearchOutlined } from "@ant-design/icons";
import Stats from "../Components/Stats";
import moment from "moment";
import {
  VerticalAlignBottomOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { Calendar, DateRangePicker } from "react-date-range";
import TagList from "../Components/List";
import { DropdownL } from "../Components/Dropdown";
import { getDataNoti } from "../Methods/Noti";
import validator from "validator";

import VirtualTable from "../Components/VirtualTable";
import { VList } from "virtual-table-ant-design";
//import CSSTransition from "react-addons-css-transition-group";
//import { CSSTransition, Transition } from "react-transition-group";
import { CompanyName } from "./_app";
import {
  Input,
  Space,
  Table,
  Col,
  Tag,
  Divider,
  Row,
  DatePicker,
  Layout,
  Statistic,
} from "antd";

const ApproveCollect = (prop) => {
  const [data, setData] = useState([]);
  const [dataRaw, setDataRaw] = useState([]);
  const [colKey, setColKey] = useState([]);
  let [showDateRanger, setShowDateRanger] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  let [isLoading, setIsLoading] = useState(true);
  const { Header, Footer, Sider, Content } = Layout;
  const [columnKeys, setColumnKeys] = useState(
    colKey.map((column) => column.key)
  );
  const [valueList, setValueList] = useState([""]);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [totalNeedAprv, setTotalNeedAprv] = useState(0);
  const [totalCheckAprv, setTotalCheckAprv] = useState(0);
  let [dataCols, setDataCols] = useState([{ key: 1, label: 1 }]);

  const [mounted, setMounted] = useState(false);

  const [counter, setCounter] = useReducer((n) => n + 1, 1);
  const [stIslodaing, setStIsLoading] = useState(false);
  const CompName = useContext(CompanyName);

  let [filterd, setFilterd] = useState([]);
  const { RangePicker } = DatePicker;

  const handleChange = (pagination, filters, sorter) => {
    //console.log("Various parameters", pagination, filters, sorter);
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const performFilter = () => {
    let vStartDate = moment(selectionRange.startDate);
    let vEndDate = moment(selectionRange.endDate);
    let dataOb = data;

    var resultProductData = dataOb.filter((a) => {
      let startDate = new Date(vStartDate);
      let endDate = new Date(vEndDate);
      let vObDateCol = "SIC_COLLECT_DATE";
      var date = new Date(a[vObDateCol]);
      return (date >= startDate) & (date <= endDate);
    });

    setData(resultProductData);
    //fillStateProps(resultProductData, props.query);
  };
  let now = moment();

  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: now._d,
    key: "selection",
  });

  const handleSelect = (date) => {
    setSelectionRange(date);
    /*console.log(`handleSelect`);
    console.log(date); // native Date object*/
  };
  const onChangeDateRange = (dates, dateStrings) => {
    if (dates) {
      let vStartDate = moment(dates[0]);
      let vEndDate = moment(dates[1]);
      let dataOb = data;

      var resultProductData = dataOb.filter((a) => {
        let startDate = new Date(vStartDate);
        let endDate = new Date(vEndDate);
        let vObDateCol = "SIC_COLLECT_DATE";
        var date = new Date(a[vObDateCol]);
        return (date >= startDate) & (date <= endDate);
      });

      setData(resultProductData);
      //fillStateProps(resultProductData, props.query);
    } else {
      resetFilter();
    }
  };

  const resetFilter = () => {
    setData(dataRaw);
    //fillStateProps(dataRaw, props.query);

    setSearchText("");
  };

  const HtmlTOExcel = (type = ".xlsx", fun, dl) => {
    var elt = document.getElementById("dataTable");
    var wb = utils.table_to_book(elt, { sheet: "sheet1" });
    return dl
      ? write(wb, { bookType: type, bookSST: true, type: "base64" })
      : writeFile(wb, fun || query + ".xlsx");
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
        filterMode: "tree",
        filterSearch: true,
        responsive: ["lg", "md"],
        ...getColumnSearchProps(e),

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
            {e === "SIC_STATUS" ? (
              text === 9 ? (
                <Tag icon={<CheckCircleOutlined />} color="success">
                  Approved
                </Tag>
              ) : (
                <Tag icon={<ExclamationCircleOutlined />} color="warning">
                  Not Approved
                </Tag>
              )
            ) : (
              text
            )}
          </div>
        ),
        //ellipsis: true,
        //tableLayout: "auto",
        sortDirections: ["descend", "ascend"],
      };

      colsArr.push(ob);
    });

    setDataCols(colsArr);
    return colsArr;
  };
  const chngCols = (pcolsArr) => {
    //console.log("chngCols", pcolsArr);
    let cols = generateCols(pcolsArr);
    setDataCols(cols);
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
              height: 30,
            }}
          ></Button>
          <Button
            type="primary"
            onClick={() => {
              clearFilters && handleReset(clearFilters);
              handleSearch(selectedKeys, confirm, dataIndex);
            }}
            size="small"
            style={{
              width: 90,
              height: 30,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            style={{
              width: 90,
              height: 30,
            }}
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    /*render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),*/
  });

  useEffect(() => {
    fetch(`http://192.168.0.159:3001/dbData?inquery=INVNEEDAPPROVE`)
      .then((res) => res.json())
      .then((data) => {
        //console.log(`data`, data);
        let cols = Object.keys(data[1]);

        setData(data);
        setDataRaw(data);

        let colsArr = generateCols(cols);

        setColKey(colsArr);
        setIsLoading(false);

        setColumnKeys(colsArr.map((column) => column.dataIndex));

        let listUnqique = data.map((e) => e["SIC_INVOICE_REF_NO"]);
        //console.log("listUnqique :", listUnqique);

        //getQueryArr(query);
        setValueList([...new Set(listUnqique)]);
        let ndAprv = data
          .filter((e) => e.SIC_STATUS != 9)
          .map((e) => e.SIC_AMOUNT);

        let sumNdAprv = ndAprv.reduce((a, e) => a + e, 0);
        setTotalNeedAprv(Math.round(sumNdAprv, 2));

        //fillArry(data);
      });

    return () => {};
  }, [mounted]);

  /*begin selection*/

  const onSelectChange = (newSelectedRowKeys, selectedRows, info) => {
    setStIsLoading(true);
    setCounter();
    setTotalCheckAprv(null);

    setSelectedRowKeys(newSelectedRowKeys);

    setTotalCheckAprv(
      selectedRows.map((e) => e.SIC_AMOUNT).reduce((a, b) => a + b, 0)
    );

    setTimeout(() => setStIsLoading(false), 10);
    //                          animation: "2s anim-lineUp ease-out",

    /*document
      .getElementsByClassName("ant-statistic-content-value-int")
      .classList.add("line");*/
  };

  const rowSelection = {
    onChange: onSelectChange,
    //onSelect:(record)=> {},
    onSelectInvert: (rows) => console.log(`rows inverted: `, rows),
    columnWidth: 5,
    getCheckboxProps: (record) => {
      //const rowIndex = data.findIndex((item) => item.key === record.key);

      //console.log(`getCheckboxProps : `, record);
      return {
        disabled: record.SIC_STATUS === 9, //enable first 2 rows only
      };
    },

    /* (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },*/
  };
  const hasSelected = selectedRowKeys.length > 0;
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const queryFilterd = (valueArr = filterd) => {
    let dataOb = dataRaw;

    let intersection;
    if (valueArr.length > 0) {
      //intersection = dataOb.filter((e) => e.VEND_VENDOR.includes(valueArr));
      intersection = dataOb.filter(
        (e) => valueArr.indexOf(e["SIC_INVOICE_REF_NO"]) >= 0
      );

      setData(intersection);

      setTotalNeedAprv(
        Math.round(
          intersection
            .filter((e) => e.SIC_STATUS != 9)
            .map((e) => e.SIC_AMOUNT)
            .reduce((a, e) => a + e, 0),
          2
        )
      );
    } else {
      setData(dataRaw);
      setTotalNeedAprv(
        Math.round(
          dataRaw
            .filter((e) => e.SIC_STATUS != 9)
            .map((e) => e.SIC_AMOUNT)
            .reduce((a, e) => a + e, 0),
          2
        )
      );

      //runGetSummry(dataRaw, query);
    }
    //getSummry(dataElm, query).then((e) => setObSum(e));
  };

  useEffect(() => {
    //fillStateProps(data, query);

    queryFilterd();
  }, [filterd]);

  //  setData(tempData);

  /*end selecion */

  if (isLoading === true) {
    return (
      <div className="flex justify-center">
        <div className="article ">
          <Loading size="xl">Loading ...</Loading>
        </div>
      </div>
    );
  }

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
        {/* <Row justify="space-around">
          <Col className="gutter-row" span={30} lg={{ span: 6, offset: 2 }}>
            <Stats
              title={state1.title}
              value={state1.value}
              color={state1.color}
            />
          </Col>
          <Col className="gutter-row" span={30} lg={{ span: 6, offset: 2 }}>
            <Stats
              title={state2.title}
              value={state2.value}
              color={state2.color}
            />
          </Col>
          <Col className="gutter-row" span={30} lg={{ span: 6, offset: 2 }}>
            <Stats
              title={state3.title}
              value={state3.value}
              color={state3.color}
            />
          </Col>
        </Row> */}
        <div>
          {showDateRanger && (
            <>
              <Divider orientation="center"></Divider>

              <Row justify="start" className="space-x-4">
                <h className="text-lg px-px"> Search Date : </h>

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
                />
              </Row>
            </>
          )}
          <Divider orientation="center"></Divider>
        </div>
        <div className="flex justify-end	">
          <Space size={1050}>
            {/* Add Statics */}

            <div className="inline-flex  ">
              <Space size={150}>
                <Col>
                  <Statistic
                    title="Total Need Approve"
                    value={totalNeedAprv}
                    valueStyle={{ color: "red" }}
                  />
                </Col>
                <Col>
                  <Statistic
                    title="Total Approved"
                    value={totalCheckAprv}
                    precision={2}
                    loading={stIslodaing}
                    valueStyle={{
                      color: "green",
                      //                      animation: "2s anim-lineUp ease-out",
                      animation: `0.5s anim-lineUp ease-out 1`,
                    }}
                    //className="line"
                  />
                </Col>
                <Col>
                  <Button
                    type="primary"
                    //loading={loadings[0]}
                    onClick={() => setTimeout(() => null, 3000)}
                    //    disabled={selectedRowKeys.length > 0 ? false : true}
                  >
                    Approve
                  </Button>
                </Col>
              </Space>
            </div>

            {/*End Add Statics*/}
          </Space>
        </div>
        <div>{/* <a>{CompName} hh</a> */}</div>
        <div>
          <DropdownL menu={columnKeys} chng={chngCols} />
          <TagList
            cols={valueList}
            filterd={setFilterd}
            qName={"Invoice Ref"}
          />
          <span
            style={{
              marginLeft: 8,
            }}
          >
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
          </span>
        </div>

        <Table
          id="dataTable"
          //bordered="true"
          size="small"
          //editable
          columns={dataCols}
          rowKey={(record) => record["SRL"]}
          rowSelection={{ ...rowSelection }}
          dataSource={data}
          pagination={{ defaultPageSize: 50 }}
          loading={setIsLoading}
          onChange={handleChange}
          /*scroll={{
            //y: 240,
            x: "80vw",
            //y:300,
          }}*/
          scroll={{ y: "240", x: "80vw" }}
          components={VList({
            height: "80vw",
          })}
        />

        {
          /* <VirtualTable
          id="dataTable"
          columns={dataCols}
          dataSource={data}
          rowKey={(record) => record["SRL"]}
          rowSelection={{ ...rowSelection }}
          scroll={{
            /*y: 300,
            x: "100vw",*/
          //y: 900,
          //x: "40vw",
          //y: 500,
          // x: "100vw",                  /> */
        }
      </Content>
    </Layout>
  );
};

export default ApproveCollect;
