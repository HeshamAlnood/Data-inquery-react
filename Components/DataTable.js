import { useEffect, useState, useRef, useMemo, useContext } from "react";
import { Container, Grid, Loading, Button } from "@nextui-org/react";
import lodash from "lodash";
import {
  Input,
  Space,
  Table,
  Col,
  Divider,
  Row,
  DatePicker,
  Layout,
  Progress,
  Empty,
} from "antd";
const { Header, Footer, Sider, Content } = Layout;
import validator from "validator";
import { SearchOutlined } from "@ant-design/icons";
import Stats from "./Stats";
import { VerticalAlignBottomOutlined } from "@ant-design/icons";
//import { Calendar, DateRangePicker } from "react-date-range";
import TagList from "./List";
import { DropdownL } from "./Dropdown";
import { getDataNoti } from "../Methods/Noti";
//import Select from "../Components/Select";
import moment from "moment";
import { getSummry, sumArrayByKey, getObSummry } from "../Methods/arreayFn";
//import { invContext } from "../_app";
//import { invContext } from "../pages/_app";

export const tableKey = {
  VENDOR: "VEND_VENDOR",
  CUSTOMER: "CUST_CUSTOMER",
  PURCHASING: "PIH_INV_NO",
  INVOICING: "SIH_INV_NO",
  INVENTORY: "ITEM_PART_NO",
};

//import { wrtie, utils, writeFileXLSX, writeFile } from "xlsx";
import HtmlTOExcel from "../Methods/exportExcel";
import collapseMotion from "antd/lib/_util/motion";
import { data } from "autoprefixer";
const { RangePicker } = DatePicker;

/*import "react-date-range/dist/styles.css"; // main style file react-date-range
import "react-date-range/dist/theme/default.css"; // theme css file react-date-range
*/
export default function DataTablesA(props) {
  let [dataElm, setDataElm] = useState(props.data);
  let [dataRaw, setDataRaw] = useState(props.data);
  let [dataCols, setDataCols] = useState([{ key: 1, label: 1 }]);
  let [vPage, setPage] = useState(15);
  let [colKey, setColKey] = useState(["2"]);
  let [isLoading, setIsLoading] = useState(true);
  let [showDateRanger, setShowDateRanger] = useState(false);
  let [obSum, setObSum] = useState({});
  let query = props.query ?? "CUSTOMER";

  const statProps = function (title, value, color) {
    this.title = title;
    this.value = value;
    this.color = color;
  };
  //let invDataL = useContext(invContext);
  let [state1, setState1] = useState(new statProps("1", "1", "1"));
  let [state2, setState2] = useState(new statProps("1", "1", "1"));
  let [state3, setState3] = useState(new statProps("1", "1", "1"));
  let [flagState, setFlagState] = useState(false);

  const showDateRangerFlag = (flag = false) => {
    setShowDateRanger(flag);
  };

  let [vTitles, setVTitles] = useState(["", "", ""]);

  const getTableKey = (pquery = query) => {
    return tableKey[pquery];
  };

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

  let queryArr = {
    VENDOR: ["Total Balance Amount", "Total Vendors", "Max Balance Amount"],
    CUSTOMER: ["Total Balance Amount", "Total Customer", "Max Balance Amount"],
    PURCHASING: [
      "Total Purchase Amount",
      "Total Purchase Inovies",
      "Total Unpaid",
    ],
    INVOICING: [
      "Total Invocies Amount",
      "Total Invocies Inovies",
      "Total Uncollect",
    ],
    INVENTORY: [
      "Total Items Sold Amount",
      "Total Items Purchaed Amount",
      "Total On Hand",
    ],
  };

  const getQueryArr = (pquery = query) => {
    return queryArr[pquery];
    //else return pquery;
  };

  const searchTable = (value) => {
    let vVal = value;
    let qryu = [];

    try {
      if (value.length === 0) {
        resetFilter();

        return;
      }
      let data = dataRaw;

      columnKeys.forEach((c) => {
        try {
          data.forEach((e) =>
            e[c]
              ?.toString()
              .toLowerCase()
              .indexOf(vVal?.toString().toLowerCase()) > -1
              ? qryu.push(e)
              : ""
          );

          console.log(`qruy with map`, qryu);
        } catch (e) {
          console.log(`err`, e);
        }
      });

      console.log(`map data qryu`, qryu);
      setDataElm([...new Set(qryu)]);

      //qryu.length = 0;
    } catch (e) {
      console.log(e);
    }
  };
  const fillStateProps = (data, pquery = props.query) => {
    let stat3;
    let ob = getSummry(data, pquery) || 0;

    if (pquery === "PURCHASING") {
      stat3 = sumArrayByKey(data, "PIH_INV_BALANCE");
    } else if (pquery === "INVOICING") {
      stat3 = sumArrayByKey(data, "SIH_INV_BALANCE");
    } else {
      stat3 = ob.max;
    }

    let vstate1 = new statProps(vTitles[0], ob.sum, "bg-red-400");

    /*setState1(new statProps(vTitles[0], ob.sum, "bg-red-400"));
    setState2(new statProps(vTitles[1], ob.count, "bg-teal-400"));
    setState3(new statProps(vTitles[2], stat3, "bg-blue-400"));*/

    setState1(new statProps(vTitles[0], ob.sum, "rgb(248 113 113)"));
    setState2(new statProps(vTitles[1], ob.count, "rgb(45 212 191)"));
    setState3(new statProps(vTitles[2], ob.sumKey, "rgb(96 165 250)"));
  };

  const [columnKeys, setColumnKeys] = useState(
    colKey.map((column) => column.key)
  );
  const columns = dataCols.filter((column) =>
    dataCols.some((key) => key === column.key)
  );

  const generateCols = (ob = []) => {
    //let cols = Object.keys(ob[1]);
    let cols = [];
    cols = ob;
    let colsArr = [];

    cols.forEach((e, i) => {
      let ob = {
        title: e.replaceAll("_", " "),
        dataIndex: e,
        sorted: true,
        width: "5%",
        visible: false,
        fixed: getTableKey(props.query) === e ? "left" : "",

        //responsive: ["lg", "md"],
        //filteredValue: filteredInfo[e] || null,
        defaultSortOrder: "descend",
        filterMode: "tree",
        filterSearch: true,
        //filteredValue: filteredInfo[e] || null,
        responsive: ["lg", "md"],
        ...getColumnSearchProps(e),

        //onFilter: (value, record) => record[e].startsWith(value),

        sorter: (a, b) => {
          //  console.log("check validator");
          let sa = a[e] || "";
          let sb = b[e] || "";
          validator.isFloat(sa.toString()) + " " + sa;

          if (validator.isFloat(sa.toString()) === true) {
            //  console.log("sort Numbers");
            return (Number.parseFloat(sa) || 1) - (Number.parseFloat(sb) || -1);
          } else if (validator.isAlpha(sa.toString()) === true) {
            //            console.log("sort Strings");
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
            {/* {text} */}
            {e === "REMAIN_PRSNT" ? getProgress(text) : text}
          </div>
        ),
        //ellipsis: true,
        tableLayout: "auto",
        sortDirections: ["descend", "ascend"],
      };

      colsArr.push(ob);
    });
    return colsArr;
  };

  const chngCols = (pcolsArr) => {
    //console.log("chngCols", pcolsArr);
    let cols = generateCols(pcolsArr);
    setDataCols(cols);
  };

  const [vendorList, setVendorList] = useState(["A-0001"]);

  let [filterd, setFilterd] = useState([]);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const searchAllInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const queryFilterd = (valueArr = filterd) => {
    let dataOb = dataRaw;

    let intersection = [];
    if (valueArr.length > 0) {
      //intersection = dataOb.filter((e) => e.VEND_VENDOR.includes(valueArr));
      intersection = dataOb.filter(
        (e) => valueArr.indexOf(e[getTableKey()]) >= 0
      );

      setDataElm(intersection);
      //runGetSummry(intersection, query);
      //fillStateProps(intersection);
      fillStateProps(intersection, props.query);
    } else {
      setDataElm(dataRaw);
      fillStateProps(dataRaw, props.query);
      //runGetSummry(dataRaw, query);
    }
    //getSummry(dataElm, query).then((e) => setObSum(e));
  };

  useEffect(() => {
    //fillStateProps(data, query);

    queryFilterd();
  }, [filterd]);

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

  const [dateValue, setDateValue] = useState([new Date(), new Date()]);

  const performFilter = () => {
    let vStartDate = moment(selectionRange.startDate);
    let vEndDate = moment(selectionRange.endDate);
    let dataOb = dataElm;

    var resultProductData = dataOb.filter((a) => {
      let startDate = new Date(vStartDate);
      let endDate = new Date(vEndDate);
      let vObDateCol = query === "PURCHASING" ? "PIH_INV_DATE" : "SIH_INV_DATE";
      var date = new Date(a[vObDateCol]);
      return (date >= startDate) & (date <= endDate);
    });

    setDataElm(resultProductData);
    fillStateProps(resultProductData, props.query);
  };

  const onChangeDateRange = (dates, dateStrings) => {
    if (dates) {
      let vStartDate = moment(dates[0]);
      let vEndDate = moment(dates[1]);
      let dataOb = dataElm || [];

      var resultProductData = dataOb.filter((a) => {
        let startDate = new Date(vStartDate);
        let endDate = new Date(vEndDate);
        let vObDateCol =
          query === "PURCHASING" ? "PIH_INV_DATE" : "SIH_INV_DATE";
        var date = new Date(a[vObDateCol]);
        return (date >= startDate) & (date <= endDate);
      });

      setDataElm(resultProductData);
      fillStateProps(resultProductData, props.query);
    } else {
      resetFilter();
    }
  };

  const resetFilter = () => {
    setDataElm(dataRaw);
    fillStateProps(dataRaw, props.query);

    setSearchText("");
  };

  /*const HtmlTOExcel = (type = ".xlsx", fun, dl) => {
     
    console.log(
      `dataCols`,
      dataCols.map((e) => e.dataIndex)
    );
     console.log(
      `lodash`,
      dataElm.map((e) =>
        lodash.pick(
          e,
          dataCols.map((e) => e.dataIndex)
        )
      )
    );
    let ws = utils.json_to_sheet(
      dataElm.map((e) =>
        lodash.pick(
          e,
          dataCols.map((e) => e.dataIndex)
        )
      )
    );

    var wb = utils.book_new();

    utils.book_append_sheet(wb, ws, query);

    return dl
      ? write(wb, { bookType: type, bookSST: true, type: "base64" })
      : writeFile(wb, fun || `UnPaid_Invoices_${props.custno}` + ".xlsx");
  };*/

  /* return dl
      ? write(wb, { bookType: type, bookSST: true, type: "base64" })
      : writeFile(wb, fun || query + ".xlsx");
  };*/

  const disableCursor = (flag = true) => {
    flag === true
      ? document.body.classList.add("disabledbutton")
      : document.body.classList.remove("disabledbutton");
  };

  const getRandomuserParams = (params) => ({
    results: params.pagination?.pageSize,
    page: params.pagination?.current,
    ...params,
  });

  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});

  const handleChange = (pagination, filters, sorter) => {
    //console.log("Various parameters", pagination, filters, sorter);
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
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
            borderRadius: "0.5rem",
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
          {/* <Button
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
          </Button> */}
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
      validator.isFloat(value.toString()) === true
        ? record[dataIndex]
            ?.toString()
            .toLowerCase()
            .startsWith(value.toLowerCase())
        : //.includes(value.toLowerCase()
          record[dataIndex]
            ?.toString()
            .toLowerCase()
            //.startsWith(value.toLowerCase()),
            .includes(value.toLowerCase()),
    //record[dataIndex]?.toString().toLowerCase() === value.toLowerCase(),
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

  const fetchDataFromProp = (params = {}) => {
    let data = props.data;
    let cols = Object.keys(data[1]);
    let colsArr = generateCols(cols);

    /*        console.log(`getTableKey`);
        console.log(getTableKey());*/

    let listUnqique = data.map((e) => e[getTableKey()]);
    //getQueryArr(query);
    setVendorList([...new Set(listUnqique)]);
    setDataElm(data);

    setDataRaw(data);
    setColKey(colsArr);

    dataElm = "";

    setDataCols(colsArr);
    setColumnKeys(colsArr.map((column) => column.dataIndex));
    setIsLoading(false);
    disableCursor(false);
    setFlagState(true);
    //getDataNoti();
    setPagination({
      ...params.pagination,
      total: 200, // 200 is mock data, you should read it from server
      // total: data.totalCount,
    });
  };

  const fetchData = (params = {}) => {
    disableCursor();
    fetchDataFromProp(params);
    return;

    fetch(`http://192.168.0.159:3001/dbData?inquery=${query}`)
      .then((res) => res.json())
      .then((data) => {
        let cols = Object.keys(data[1]);
        let colsArr = generateCols(cols);

        /*        console.log(`getTableKey`);
        console.log(getTableKey());*/

        let listUnqique = data.map((e) => e[getTableKey()]);
        //getQueryArr(query);
        setVendorList([...new Set(listUnqique)]);
        setDataElm(data);

        setDataRaw(data);
        setColKey(colsArr);

        dataElm = "";

        setDataCols(colsArr);
        setColumnKeys(colsArr.map((column) => column.dataIndex));
        setIsLoading(false);
        disableCursor(false);
        setFlagState(true);
        getDataNoti();
        setPagination({
          ...params.pagination,
          total: 200, // 200 is mock data, you should read it from server
          // total: data.totalCount,
        });
      })
      .catch((e) => console.log(`Error in fetch ${e}`));
  };

  useEffect(() => {
    /*get data*/
    query = props.query;
    /*if (query === "1" || query === undefined) {
      return;
    }*/

    setIsLoading(true);
    setFlagState(false);
    setVTitles(getQueryArr(query));
    setTimeout(
      () =>
        fetchData({
          pagination,
        }),
      1000
    );
  }, [query]);

  useEffect(() => {
    if (flagState === false) return;
    //setVTitles(getQueryArr(query));
    fillStateProps(dataElm, props.query);
    setFlagState(true);
    if (query === "PURCHASING" || query === "INVOICING") {
      showDateRangerFlag(true);
    } else {
      showDateRangerFlag(false);
    }

    console.log(document.getElementById("dataTable"));
  }, [flagState]);

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
    /*  <div /*className="md:container md:mx-auto">
      <div className="article bg-slate-50">*/
    //<div className="md:container md:mx-auto">
    /*<Container xl>
      <div className="md:container md:mx-auto  bg-slate-50 ">
        <div className="ease-in duration-300  ">*/
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
        <Row justify="space-around">
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
        </Row>
        <div>
          {/* {showDateRanger && (
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
            </> */}
          {/* <Divider orientation="center"></Divider> */}
          {/*showDateRanger && (
              <DateRangePicker
                //onSelect={setColumnKeys}
                direction="horizontal"
                moveRangeOnFirstSelection={false}
                months={2}
                dateDisplayFormat={"dd/MM/yyyy"}
                onChange={(item) => handleSelect(item.selection)}
                //showSelectionPreview={false}
                preventSnapRefocus={true}
                showSelectionPreview={true}
                rangeColors={"#10b981"}
                ranges={[selectionRange]}
              />
            )*/}
        </div>
        <div>
          <Divider dashed />
          <Grid xs={12} md={3}></Grid>
        </div>

        <div className="flex justify-items-start ">
          {/* <DropdownL menu={columnKeys} chng={chngCols} /> */}
          <TagList
            cols={vendorList}
            filterd={setFilterd}
            qName={query}
            width={"100%"}

            //classList="text-slate-500 !rounded-full"
            //className="text-slate-500 rounded-full"
          />
        </div>
        <Divider> </Divider>
        <div className="flex justifiy-items-start">
          <input
            className=" inputSearch border-slate-300	 focus:border-blue-50 w-full focus:w-full placeholder-shown:w-64	border-2 rounded-full placeholder:text-slate-300	"
            //id="inputSearch"
            ref={searchAllInput}
            type="text"
            name="search"
            placeholder="Search All Data..."
            onKeyUp={(e) => searchTable(e.target.value)}
          />
          {showDateRanger && (
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
              //style={{ marginLeft: "3rem" }}
              style={{
                marginLeft: "3rem",
                borderRadius: "9999999px",
                textAlign: "justify",
              }}
              className="text-lg text-justify	"
            />
          )}
          <Button.Group
            size="lg"
            color="primary"
            className="bg-blue-500 ml-16 "
          >
            <Button
              size="lg"
              color="primary"
              className="bg-blue-500 "
              onClick={() =>
                HtmlTOExcel(
                  dataElm,
                  dataCols.map((e) => e.dataIndex)
                )
              }
            >
              Download Excel
              <VerticalAlignBottomOutlined style={{ paddingLeft: "0.5rem" }} />
            </Button>
          </Button.Group>
        </div>

        <Divider> </Divider>
        <DropdownL menu={columnKeys} chng={chngCols} />
        <Table
          id="dataTable"
          //bordered="true"
          size="middle"
          editable
          columns={dataCols}
          rowKey={(record) => record[getTableKey(props.query)]}
          dataSource={dataElm}
          pagination={{ defaultPageSize: 20 }}
          loading={setIsLoading}
          onChange={handleChange}
          scroll={{ y: "240", x: "80vw" }}
          /*scroll={{
            //y: 240,
            x: "100vw",
          }}*/

          //className={"bg-sky-700 text-slate-50	text-base"}
          /*
          rowClassName={(record, index) => {
            let className = index % 2 ? "bg-gray-100" : "";
            return className;
          }}*/
        />
      </Content>
    </Layout>

    /*</Content></div>
      </div>
    </Container>*/
    //</div>
  );
}

/*
         
          <TagList
            cols={columnKeys}
            filterd={setColumnKeys}
            qName={`Columns to Display`}
            type={`Cols`}
          />
        
        */
