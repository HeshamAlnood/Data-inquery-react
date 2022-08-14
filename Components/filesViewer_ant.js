import { Space, Table, Tag, Skeleton, Input, Button } from "antd";
import { useEffect, useState, useRef } from "react";
import validator from "validator";
import { SearchOutlined } from "@ant-design/icons";
const FileViewer = (props) => {
  console.log(`File Viewer Function`, props.keyVal);
  let vType = props.type;
  let vKeyVal = props.keyVal;

  let [fileData, setFileData] = useState([{}]);
  let [dataCols, setDataCols] = useState([]);
  let [isDone, setIsDone] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const getRandomuserParams = (params) => ({
    results: params.pagination?.pageSize,
    page: params.pagination?.current,
    ...params,
  });
  const searchInput = useRef(null);
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

  const fetchData = (params = {}) => {
    //disableCursor();
    fetch(`http://192.168.0.159:3001/getFiles?type=${vType}&keyVal=${vKeyVal}`)
      .then((res) => res.json())
      .then((data) => {
        let cols = data && Object.keys(data[0]);
        let colsArr = [];
        console.log(`data`, data);

        cols.forEach((e, i) => {
          let ob = {
            title: e.replaceAll("_", " "),
            dataIndex: e,
            sorted: true,
            width: 1,
            visible: false,

            //responsive: ["lg", "md"],
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
            ellipsis: true,
            sortDirections: ["descend", "ascend"],
            //textWrap: "word-break",
          };

          colsArr.push(ob);
        });

        setDataCols(colsArr);
        setFileData(data);
        //setColumnKeys(colsArr.map((column) => column.dataIndex));

        setIsDone(true);
        setPagination({
          ...params.pagination,
          total: 200, // 200 is mock data, you should read it from server
          // total: data.totalCount,
        });
      })
      .catch((e) => console.log(`Error in fetch `, e));
  };

  useEffect(() => {
    console.log(`start useEffect`);
    setIsDone(false);
    fetchData();
    console.log(`End useEffect`);
  }, [props.type, props.keyVal]);

  if (isDone === false) {
    return <Skeleton />;
  }

  return (
    <Table
      id="fileTables"
      //bordered="true"
      size="small"
      editable
      columns={dataCols}
      rowKey={(record) => record["fileName"]}
      dataSource={fileData}
      pagination={{ defaultPageSize: 10 }}
      loading={setIsDone}
      //onChange={handleChange}
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
  );
};
export default FileViewer;
