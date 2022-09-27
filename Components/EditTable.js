import { Button, Form, Input, Popconfirm, Table, Alert, message } from "antd";
import collapseMotion from "antd/lib/_util/motion";
import React, { useContext, useEffect, useRef, useState } from "react";
import validator from "validator";
const EditableContext = React.createContext(null);

export const EditableRow = ({ index, ...props }) => {
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

export const components = {
  body: {
    row: EditableRow,
    cell: EditableCell,
  },
};

export const EditTable = (props) => {
  const [dataSource, setDataSource] = useState([]);
  const [count, setCount] = useState(1);
  const [defaultColumns, setDefaultColumns] = useState([]);
  //setDataSource(props.data);

  const handleDelete = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const generateCols = (ob = []) => {
    //let cols = Object.keys(ob[1]);
    let cols = [];
    cols = ob;
    let colsArr = [];

    cols.forEach((e, i) => {
      console.log(`e`, e);
      let ob = {
        title: e.replaceAll("_", " ").toUpperCase(),
        dataIndex: e,
        sorted: true,
        width: "5%",
        visible: false,
        //fixed: getTableKey(props.query) === e ? "left" : "",
        editable: true,

        //responsive: ["lg", "md"],
        //filteredValue: filteredInfo[e] || null,
        defaultSortOrder: "descend",
        filterMode: "tree",
        filterSearch: true,
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
        dataSource.length >= 1 ? (
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

  //setDefaultColumns(generateCols(dataSource));

  useEffect(() => {
    console.log(`props.data`, props.data);
    setDataSource(props.data);
    setDefaultColumns(generateCols(Object.keys(props.data[0])));
  }, []);

  const handleAdd = () => {
    console.log(`props.flag : `, props.flag);
    if (props.flag === false) {
      return message.error("Master Data Must Be Completed");
    }
    const newData = {
      key: count,
      ...props.data,
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
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
  return (
    <div>
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
        dataSource={props.flag === true ? dataSource : []}
        columns={columns}
      />
    </div>
  );
};

//export default EditTable;
