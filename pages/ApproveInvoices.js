import { useEffect, useState, useRef, useReducer, useContext } from "react";
import { Container, Grid, Loading /*Table,*/ } from "@nextui-org/react";
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
import HtmlTOExcel from "../Methods/exportExcel";

import { aproveCollection } from "../Methods/DataApi";
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
  Button,
  notification,
  Popconfirm,
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
  const openNotification = (placement, type, message, desc) => {
    let totAmount = totalCheckAprv || 0;
    notification[type]({
      message: message, //`Aproved Success`,
      description: desc, //`Aprvoed ${selectedRowKeys.length} Collection and ${totAmount} Amount`,
      //placement,

      duration: 3,
    });
  };

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
  const [buttonIslodaing, setButtonIslodaing] = useState(false);
  const searchAllInput = useRef(null);
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

  const resetFilter = () => {
    setData(dataRaw);

    setSearchText("");
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
      setData([...new Set(qryu)]);

      //qryu.length = 0;
    } catch (e) {
      console.log(e);
    }
  };
  let now = moment();

  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: now._d,
    key: "selection",
  });

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

  const getData = () => {
    setIsLoading(true);
    //setSelectedRowKeys((prev) => (prev = []));

    fetch(`http://192.168.0.159:3001/dbData?inquery=INVNEEDAPPROVE`)
      .then((res) => res.json())
      .then((data) => {
        console.log(`data`, data);
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
          .map((e) => +e.SIC_AMOUNT);

        let sumNdAprv = ndAprv.reduce((a, e) => a + e, 0);
        setTotalNeedAprv(Math.round(sumNdAprv, 2));
        setTotalCheckAprv(0);
        setDataCols(colsArr);
        console.log(`data cols :`, dataCols);
        console.log(`data  :`, data);
        setTimeout(() => {
          setSelectedRowKeys(["0"]);
        }, 1000);
        setIsLoading(false);
        //setSelectedRowKeys((prev) => (prev = []));

        console.log(`selectedRowKeys : `, selectedRowKeys);

        //fillArry(data);
      });
  };

  useEffect(() => {
    getData();
  }, [mounted]);

  /*begin selection*/

  const onSelectChange = (newSelectedRowKeys, selectedRows, info) => {
    setStIsLoading(true);
    setCounter();
    setTotalCheckAprv(null);

    setSelectedRowKeys(newSelectedRowKeys);

    let totCheckAprv = selectedRows
      .map((e) => +e.SIC_AMOUNT)
      .reduce((a, b) => +a + +b, 0);

    setTotalCheckAprv(totCheckAprv);

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
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
    getCheckboxProps: (record) => {
      //const rowIndex = data.findIndex((item) => item.key === record.key);

      //console.log(`getCheckboxProps : `, record);
      return {
        disabled: record.SIC_STATUS === 9, //enable first 2 rows only
      };
    },
  };

  const hasSelected = selectedRowKeys.length > 0;
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const queryFilterd = (valueArr = filterd, typ = 0) => {
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

  /* approve */

  const aprove = (invs) => {
    console.log(`invs `, invs);
    let sicCol = [];

    invs?.forEach((e, i) =>
      sicCol.push(data.filter((d) => d.SRL === e).map((k) => k.SIC_COLLECT_NO))
    );
    console.log(`sicCol , `, sicCol.flat());
    sicCol = sicCol.flat();
    //return;

    if (sicCol.length === 0) {
      //alert(`No Invoices Selected !`);
      openNotification(
        "topRight",
        "error",
        "No Collection Selected",
        `You need to select a Collection to Approve`
      );
      return;
    }

    setButtonIslodaing(true);
    //setMounted(false);

    aproveCollection(sicCol, "admin")
      .then((d) => {
        //d === "10000";
        console.log(`response from procedure `, d);
        setButtonIslodaing(false);

        getData();
        openNotification(
          "topRight",
          "success",
          "Approve Check",
          `Aprvoed ${selectedRowKeys.length} Collection and ${totalCheckAprv} Amount`
        );
        //        setMounted(true);

        /*queryFilterd(invs[0]);
        queryFilterd(invs[1]);*/
      })
      .catch((c) => {
        console.log(c);
        setButtonIslodaing(false);
      });
  };

  /* approve */

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
          minWidth: "50%",
          maxWidth: "100%",
          backgroundColor: "transparent",
        }}
      >
        <div>
          <Divider orientation="center"></Divider>
        </div>
        <div className="  max-w-full min-w-48   	">
          <Space size={1050}>
            {/* Add Statics */}

            <div className="inline-flex justify-start 	 ">
              <Space size={150}>
                <Col>
                  <div className=" space-y-1.5 gap-4  mb-4">
                    <input
                      className=" inputSearch border-slate-300	hover:border-blue-300 focus:border-blue-50  focus:w-96	select:w-96 placeholder-shown:w-64	border-2 rounded-full placeholder:text-slate-300	"
                      //id="inputSearch"
                      ref={searchAllInput}
                      type="text"
                      name="search"
                      placeholder="Search All Data..."
                      onKeyUp={(e) => searchTable(e.target.value)}
                    />
                    <TagList
                      cols={valueList}
                      filterd={setFilterd}
                      qName={"Invoice Ref"}
                    />
                  </div>
                </Col>
                <Col className="">
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
                  <div className="flex  justify-end	">
                    <div className="flex flex-col gap-4 sticky  ">
                      <Popconfirm
                        title="Procced To Approve  ? "
                        okText="YES"
                        //disabled={selectedRowKeys.length > 0 ? false : true}
                        cancelText="NO"
                        disabled={
                          selectedRowKeys.length > 0 && +selectedRowKeys[0] > 0
                            ? false
                            : true
                        }
                        onConfirm={() =>
                          selectedRowKeys.length > 0 && +selectedRowKeys[0] > 0
                            ? aprove(selectedRowKeys)
                            : openNotification(
                                "topRight",
                                "error",
                                "No Collection Selected",
                                `You need to select a Collection to Approve`
                              )
                        }
                      >
                        <Button
                          type="primary"
                          //loading={loadings[0]}
                          onClick={(e) => {
                            //   e.preventDefault();
                            console.log(
                              `lengh selection `,
                              selectedRowKeys,
                              selectedRowKeys.length,
                              +selectedRowKeys.length === 0 ||
                                +selectedRowKeys[0] === 0
                            );
                            if (
                              +selectedRowKeys.length === 0 ||
                              +selectedRowKeys[0] === 0
                            ) {
                              openNotification(
                                "topRight",
                                "error",
                                "No Collection Selected",
                                `You need to select a Collection to Approve`
                              );
                              return;
                            }
                          }}
                          //disabled={selectedRowKeys.length > 0 ? false : true}
                          size="large"
                          shape="round"
                          loading={buttonIslodaing}
                          //block={true}
                          className="w-48 h-48 hvr-glow "
                        >
                          Approve
                        </Button>
                      </Popconfirm>
                      <Button
                        type="primary"
                        size="large"
                        shape="round"
                        //loading={buttonIslodaing}
                        //block={true}
                        className="w-48 h-48 hvr-glow "
                        onClick={() =>
                          HtmlTOExcel(
                            data,
                            dataCols.map((e) => e.dataIndex)
                          )
                        }
                      >
                        Download Excel
                        <VerticalAlignBottomOutlined
                          style={{ paddingLeft: "0.5rem" }}
                        />
                      </Button>
                    </div>
                  </div>
                </Col>
              </Space>
            </div>

            {/*End Add Statics*/}
          </Space>
        </div>
        <div>{/* <a>{CompName} hh</a> */}</div>
        {/* <div className="flex justify-items-start space-x-1.5   mb-4">
          <input
            className=" inputSearch border-slate-300	hover:border-blue-300 focus:border-blue-50 w-full focus:w-96 placeholder-shown:w-64	border-2 rounded-full placeholder:text-slate-300	"
            //id="inputSearch"
            ref={searchAllInput}
            type="text"
            name="search"
            placeholder="Search All Data..."
            onKeyUp={(e) => searchTable(e.target.value)}
          />
          <TagList
            cols={valueList}
            filterd={setFilterd}
            qName={"Invoice Ref"}
          />
        </div> */}
        <DropdownL menu={columnKeys} chng={chngCols} />

        {/* {isLoading && (
          <div className="flex justify-center">
            <div className="article ">
              <Loading size="xl">Loading ...</Loading>
            </div>
          </div>
        )} */}

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
          scroll={{ y: "240", x: "80vw" }}
        />
      </Content>
    </Layout>
  );
};

export default ApproveCollect;
