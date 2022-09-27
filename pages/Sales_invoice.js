import {
  Input,
  Space,
  Table,
  Button,
  Form,
  Layout,
  Popconfirm,
  message,
  notification,
} from "antd";
import {
  useCallback,
  useEffect,
  useState,
  useRef,
  createContext,
  useContext,
} from "react";
const EditableContext = createContext(null);
import validator from "validator";
import { getCustomerData, getInventoryData } from "../Methods/DataApi";
//import { EditTable, EditableRow, EditableCell } from "../Components/EditTable";
import collapseMotion from "antd/lib/_util/motion";

const SalesInvoice = (props) => {
  const { Header, Footer, Sider, Content } = Layout;
  let [sihInvNo, setSihInvNo] = useState("");
  let [sihInvDate, setSihInvDate] = useState("");
  let [sihInvCust, setSihCust] = useState("");
  let [sihCustName, setSihCustName] = useState("");
  let [sihInvNetInvAmt, setSihNetInvAmt] = useState("");
  let [sihInvDiscountAmt, setSihInvDiscountAmt] = useState("");
  let [sihInvPaidAmt, setSihInvPaidAmt] = useState("");
  let [sihInvBalanceAmt, setSihInvDBalanceAmt] = useState("");
  let [custData, setCustData] = useState([]);
  let [insDetailFlag, setInsDetailFlag] = useState(false);
  let [itemData, setItemData] = useState([]);
  const [count, setCount] = useState(0);

  const openNotification = (placement) => {
    notification.info({
      message: `Notification `,
      description: "Item Requierd !",
      placement,
    });
  };

  let vDate = new Date();
  //console.log(vDate);
  const chkInsInvNo = useCallback(
    (val) => {
      console.log(`chkInsInvNo`, val, `is number ${validator.isNumeric(val)}`);
      setSihInvNo(val);
    },
    [sihInvNo]
  );

  const chkInsInvDate = useCallback(
    (val) => {
      //console.log(`chkInsInvDate`, val);

      /*if (validator.isDate(val) === false) {
        //  throw new Error();
        null;
      } else*/ setSihInvDate(val);
    },
    [sihInvDate]
  );

  const chksihInvCust = useCallback(
    (value) => {
      let val = value.target.value;
      if (val.length === 0) {
        openNotification("bottomRight");
        //throw new Error();
        value.preventDefault();
        document.getElementById("SIH_CUST").focus();
        return;
      }

      console.log(`chksihInvCust`, val);
      console.log(
        `chksihInvCustName`,
        custData.filter((e) => e.CUST_CUSTOMER === val)[0]?.CUST_NAME
      );
      setInsDetailFlag(val.length > 0 ? true : false);
      setSihCust(val);
      setSihCustName(
        custData?.filter((e) => e.CUST_CUSTOMER === val)[0]?.CUST_NAME
      );
    },
    [sihInvCust]
  );

  //   const chkInsInvNo = useCallback(
  //     (val) => {
  //       console.log(`chkInsInvNo`, val);
  //       setSihInvNo(val);
  //     },
  //     [sihInvNo]
  //   );

  //useEffect(()=> ,[sih_invsihInvCust])

  /* handling detail table */

  let detailOb = [
    {
      key: 1,
      sil_inv_No: " ",
      sil_inv_part: " ",
      sil_inv_qty: "",
      sil_inv_price: "",
    },
  ];
  let [dataSource, setDataSource] = useState([]);

  const handleAdd = () => {
    console.log(`insDetailFlag: `, insDetailFlag);
    if (insDetailFlag === false) {
      return message.error("Master Data Must Be Completed");
    }
    let data = dataSource;
    let counter = count + 1;
    console.table(`dataSource - handle Add `, dataSource);
    const newData = {
      key: counter,
      ...data,
    };

    console.log(`new Data : `, newData);
    setDataSource([...data, newData]);
    setCount(counter);
  };

  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setDataSource(newData);
  };

  const generateCols = (ob = detailOb) => {
    //let cols = Object.keys(ob[1]);
    let cols = [];
    cols = ob;
    let colsArr = [];

    cols.forEach((e, i) => {
      //console.log(`e`, e);
      let ob = {
        title: e.replaceAll("_", " ").toUpperCase(),
        dataIndex: e,
        sorted: true,
        width: "5%",
        visible: false,
        editable: true,

        defaultSortOrder: "descend",
        filterMode: "tree",
        filterSearch: true,
        responsive: ["lg", "md"],

        sorter: (a, b) => {
          let sa = a[e] || "";
          let sb = b[e] || "";
          validator.isFloat(sa.toString()) + " " + sa;

          if (validator.isFloat(sa.toString()) === true) {
            return (Number.parseFloat(sa) || 1) - (Number.parseFloat(sb) || -1);
          } else if (validator.isAlpha(sa.toString()) === true) {
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
        tableLayout: "auto",
        sortDirections: ["descend", "ascend"],
      };

      colsArr.push(ob);
    });
    colsArr.push({
      render: (_, record) =>
        dataSource?.length >= 1 ? (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.key)}
          >
            <a>Delete</a>
          </Popconfirm>
        ) : null,
    });
    return colsArr;
  };

  let cols = [];
  const [defaultColumns, setDefaultColumns] = useState(
    generateCols(Object.keys(detailOb[0]))
  );

  setTimeout(
    //() => setDefaultColumns(generateCols(Object.keys(detailOb[0]))),
    () => (cols = generateCols(Object.keys(detailOb[0]))),
    1000
  );

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };

  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);

    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };

    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({ ...record, ...values });
      } catch (errInfo) {
        console.log("Save failed:", errInfo);
      }
    };

    let childNode = children;

    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }

    return <td {...restProps}>{childNode}</td>;
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  /* End handling Detail Table */

  useEffect(() => {
    getCustomerData().then((d) => setCustData(d));
    getInventoryData().then((d) => setItemData(d));
    setDefaultColumns(generateCols(Object.keys(detailOb[0])));
    setDataSource(detailOb);
    setCount(count + 1);
  }, []);

  return (
    <Layout>
      <Content
        style={{
          padding: "4rem",
          paddingLeft: "18rem",
          margin: 0,
          minHeight: 280,
          backgroundColor: "transparent",
          //height: "60rem",
        }}
      >
        <form action="">
          <div className="InvGrid">
            <label for="SIH_INV_NO">Invoice No</label>
            <input
              type="text"
              id="SIH_INV_NO"
              disabled
              //onPointerLeave={(e) =>
              className="InputText"
              onChange={(e) =>
                /*chkInsInvNo(e.target.value)*/ chkInsInvNo(e.target.value)
              }
            ></input>
            <label for="SIH_INV_DATE">Invoice Date</label>
            <input
              type="date"
              id="SIH_INV_DATE"
              className="InputText"
              //</div>value={"2022-09-24"}
              pattern="\d{2}-\d{2}-\d{4}"
              onChange={(e) => chkInsInvDate(e.target.value)}
            ></input>
            <label for="SIH_CUST">Customer No</label>
            <input
              className="InputText"
              list="custList"
              type="text"
              id="SIH_CUST"
              required
              pattern=".{1,}"
              placeholder="Enter Customer Id"
              onSelect={(e) => chksihInvCust(e)}
              onKeyDown={(e) =>
                e.target.value.length === 0
                  ? e.preventDefault() // document.getElementById("SIH_CUST").focus()
                  : ""
              }
            ></input>
            <label for="SIH_CUST_CUSTOMER">Customer Name</label>
            <input
              className="InputText"
              type="text"
              id="SIH_CUST_CUSTOMER"
              value={sihCustName}
              disabled
            ></input>
            <label for="SIH_INV_NET_INV_AMT">NET AMNT</label>
            <input
              className="InputText"
              type="number"
              id="SIH_INV_NET_INV_AMT"
              disabled
            ></input>
            <label for="SIH_INV_DISCOUNT">DISCOUNT AMNT</label>
            <input
              className="InputText"
              type="number"
              id="SIH_INV_DISCOUNT"
              minLength={1}
            ></input>
            <label for="SIH_INV_PAID">PAID AMNT</label>
            <input
              className="InputText"
              type="number"
              id="SIH_INV_PAID"
              disabled
            ></input>
            <label for="SIH_INV_BALANCE">BALANCE AMNT</label>
            <input
              className="InputText"
              type="number"
              id="SIH_INV_BALANCE"
              disabled
              min="2"
              max="3"
            ></input>
          </div>
        </form>
        <br></br>
        <datalist id="custList">
          {custData.map((e) => (
            <option value={e.CUST_CUSTOMER}>
              {e.CUST_CUSTOMER + " - " + e.CUST_NAME}
            </option>
          ))}
        </datalist>

        <div> Invoice No : {sihInvNo}</div>
        <div> Invoice Date: {sihInvDate}</div>

        <div>
          {/* <EditTable
            data={[
              {
                key: 1,
                sil_inv_No: " ",
                sil_inv_part: " ",
                sil_inv_qty: "",
                sil_inv_price: "",
              },
            ]}
            flag={insDetailFlag}
            lov1={itemData}
            itemLov1={"SIL_PART_NO"}
          ></EditTable> */}
          <Button
            onClick={handleAdd}
            type="primary"
            style={{
              marginBottom: 16,
            }}
          >
            Add a row
          </Button>
          <Table
            components={components}
            rowClassName={() => "editable-row"}
            bordered
            size="small"
            dataSource={insDetailFlag === true ? dataSource : []}
            columns={insDetailFlag === true ? columns : []}
          />
        </div>
      </Content>
    </Layout>
  );
};

export default SalesInvoice;
