import { useEffect, useState, useRef } from "react";
import { Container, Grid, Loading, Button } from "@nextui-org/react";
import { Input, Space, Table, Col, Divider, Row } from "antd";
import validator from "validator";
import { SearchOutlined } from "@ant-design/icons";
import Stats from "./Stats";
import { VerticalAlignBottomOutlined } from "@ant-design/icons";
import { Calendar, DateRangePicker } from "react-date-range";
import TagList from "./List";
//import Select from "../Components/Select";
import moment from "moment";
import { getSummry, sumArrayByKey, getObSummry } from "../Methods/arreayFn";

import { wrtie, utils, writeFileXLSX, writeFile } from "xlsx";
import "react-date-range/dist/styles.css"; // main style file react-date-range
import "react-date-range/dist/theme/default.css"; // theme css file react-date-range

export default function DataTablesA(props) {
  let [dataElm, setDataElm] = useState([{ key: 1, label: 1 }]);
  let [dataRaw, setDataRaw] = useState(dataElm);
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
  let [state1, setState1] = useState(new statProps("1", "1", "1"));
  let [state2, setState2] = useState(new statProps("1", "1", "1"));
  let [state3, setState3] = useState(new statProps("1", "1", "1"));
  let [flagState, setFlagState] = useState(false);

  const showDateRangerFlag = () => {
    if (showDateRanger === true) setShowDateRanger(false);
    else setShowDateRanger(true);
  };

  let [vTitles, setVTitles] = useState(["", "", ""]);

  const getTableKey = (pquery = query) => {
    if (pquery === "VENDOR") {
      return "VEND_VENDOR";
    } else if (pquery === "CUSTOMER") {
      return "CUST_CUSTOMER";
    } else if (pquery === "PURCHASING") {
      return "PIH_INV_NO";
    } else if (pquery === "INVOICING") {
      return "SIH_INV_NO";
    } else return pquery;
  };

  const getQueryArr = (pquery = query) => {
    if (pquery === "VENDOR") {
      return ["Total Balance Amount", "Total Vendors", "Max Balance Amount"];
    } else if (pquery === "CUSTOMER") {
      return ["Total Balance Amount", "Total Customer", "Max Balance Amount"];
    } else if (pquery === "PURCHASING") {
      return [
        "Total Purchase Amount",
        "Total Purchase Inovies",
        "Total Unpaid",
      ];
    } else if (pquery === "INVOICING") {
      return [
        "Total Invocies Amount",
        "Total Invocies Inovies",
        "Total Uncollect",
      ];
    } else if (pquery === "INVENTORY") {
      return [
        "Total Items Sold Amount",
        "Total Items Purchaed Amount",
        "Total On Hand",
      ];
    }
    //else return pquery;
  };

  const fillStateProps = (data, pquery = props.query) => {
    let stat3;
    let ob = getSummry(data, pquery);

    console.log("printing ob Summary");
    console.log(ob);

    if (pquery === "PURCHASING") {
      stat3 = sumArrayByKey(data, "PIH_INV_BALANCE");
    } else if (pquery === "INVOICING") {
      stat3 = sumArrayByKey(data, "SIH_INV_BALANCE");
    } else {
      stat3 = ob.max;
    }

    let vstate1 = new statProps(vTitles[0], ob.sum, "bg-red-400");

    setState1(new statProps(vTitles[0], ob.sum, "bg-red-400"));
    setState2(new statProps(vTitles[1], ob.count, "bg-teal-400"));
    setState3(new statProps(vTitles[2], stat3, "bg-blue-400"));
  };

  const [columnKeys, setColumnKeys] = useState(
    colKey.map((column) => column.key)
  );
  const columns = dataCols.filter((column) =>
    dataCols.some((key) => key === column.key)
  );

  const [vendorList, setVendorList] = useState(["A-0001"]);

  let [filterd, setFilterd] = useState([]);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const queryFilterd = (valueArr = filterd) => {
    let dataOb = dataRaw;

    let intersection;
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

  const resetFilter = () => {
    setDataElm(dataRaw);
    fillStateProps(dataRaw, props.query);

    setSearchText("");
  };

  const HtmlTOExcel = (type = ".xlsx", fun, dl) => {
    var elt = document.getElementById("dataTable");
    var wb = utils.table_to_book(elt, { sheet: "sheet1" });
    return dl
      ? write(wb, { bookType: type, bookSST: true, type: "base64" })
      : writeFile(wb, fun || query + ".xlsx");
  };

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
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            style={{
              width: 90,
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

  const fetchData = (params = {}) => {
    disableCursor();
    fetch(`http://192.168.0.159:3001/dbData?inquery=${query}`)
      .then((res) => res.json())
      .then((data) => {
        let cols = Object.keys(data[1]);
        let colsArr = [];

        cols.forEach((e, i) => {
          let ob = {
            title: e.replaceAll("_", " "),
            dataIndex: e,
            sorted: true,
            width: 10,
            responsive: ["lg"],
            //filteredValue: filteredInfo[e] || null,
            defaultSortOrder: "descend",
            filterMode: "tree",
            filterSearch: true,
            ...getColumnSearchProps(e),

            //  onFilter: (value, record) => record[e].startsWith(value),

            sorter: (a, b) => {
              //  console.log("check validator");
              let sa = a[e] || "";
              let sb = b[e] || "";
              validator.isFloat(sa.toString()) + " " + sa;

              if (validator.isFloat(sa.toString()) === true) {
                //  console.log("sort Numbers");
                return (
                  (Number.parseFloat(sa) || 1) - (Number.parseFloat(sb) || -1)
                );
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
                {text}
              </div>
            ),
            //ellipsis: true,
            sortDirections: ["descend", "ascend"],
          };

          colsArr.push(ob);
        });
        /*        console.log(`getTableKey`);
        console.log(getTableKey());*/

        let listUnqique = data.map((e) => e[getTableKey()]);
        //getQueryArr(query);
        setVendorList([...new Set(listUnqique)]);
        setDataElm(data);

        setDataRaw(data);
        setColKey(colsArr);

        setDataCols(colsArr);

        setIsLoading(false);
        disableCursor(false);
        setFlagState(true);
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
    if (query === "1" || query === undefined) {
      return;
    }
    setIsLoading(true);
    setFlagState(false);
    setVTitles(getQueryArr(query));
    fetchData({
      pagination,
    });
  }, [query]);

  useEffect(() => {
    if (flagState === false) return;
    //setVTitles(getQueryArr(query));
    fillStateProps(dataElm, props.query);
    setFlagState(true);
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
    <Container xl>
      <div className="md:container md:mx-auto  bg-slate-50 ">
        <div className="ease-in duration-300  ">
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
            <Divider />
            <a className="text-lg" onClick={showDateRangerFlag}>
              Search Date From - To :{" "}
            </a>

            {showDateRanger && (
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
            )}
          </div>
          <div>
            <Divider dashed />
            <Grid xs={12} md={3}>
              <Button.Group size="lg" color="primary" className="bg-blue-500">
                <Button color="gradient" onClick={performFilter}>
                  Search
                </Button>
                <Button color="gradient" onClick={resetFilter}>
                  Reset
                </Button>
                <Button color="gradient" onClick={HtmlTOExcel}>
                  Download Excel
                  <VerticalAlignBottomOutlined
                    style={{ paddingLeft: "0.5rem" }}
                  />
                </Button>
              </Button.Group>
            </Grid>
          </div>
          <TagList cols={vendorList} filterd={setFilterd} qName={query} />

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
            scroll={{
              //y: 240,
              x: "100vw",
            }}
            //className={"bg-sky-700 text-slate-50	text-base"}
            rowClassName={(record, index) => {
              let className = index % 2 ? "bg-gray-100" : "";
              return className;
            }}
          />
        </div>
      </div>
    </Container>
    //</div>
  );
}
