import { Select, Tag } from "antd";
import React, { useEffect, useState } from "react";
const { Option } = Select;
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'

let selectTag = [];

const TagList = (props) => {
  let [options, setOptions] = useState(props.options || []);

  console.log(`label from props `, options);
  const children = props.cols.map((e, i) => (
    <Option
      key={e + i}
      className="rounded-full"
      value={e}

      //labelInValue={true}
    >
      {/* {label[i]} */}
    </Option>
  ));

  let vWidth = props.width || "100%";

  const handleChange = (value) => {
    console.log(`selected ${value}`);

    console.log(`selectTag`, value);
    //console.log(selectTag);

    selectTag = value;

    props.filterd(selectTag);
    setOptions(props.options);
  };

  /*for (let i = 10; i < 36; i++) {
    children.push(
      <Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>
    );
  }*/

  const handleSearch = (str) => {
    console.log(`length of input search `, str.length);
    if (str.length > 0) {
      //data.filter((e) => e.label.toLowerCase.indexOf(str.toLowerCase));
      let data = props.options;

      data = data.filter(
        (e) =>
          e.label
            .toString()
            .toLowerCase()
            .indexOf(str?.toString().toLowerCase()) > -1
      );
      console.log(`input search `, str, data);
      setOptions(data);
      //setTimeout(() => "", 1000);
    } else setOptions(props.options);
  };
  console.log(`options is = `, options);
  const tagRender = (props) => {
    const { label, value, closable, onClose } = props;

    const onPreventMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };

    return (
      <Tag
        color={"#1890ff"}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{
          borderRadius: "1.5625rem",
          height: "1.8rem",
          paddingTop: "0.2rem",
          marginTop: "0.2rem",
          marginBottom: "0.2rem",
          paddingLeft: "0.9rem",
          paddingRight: "0.6rem",
          fontSize: "1rem",
        }}
      >
        {value}
      </Tag>
    );
  };

  useEffect(() => setOptions(props.options), [props.options]);

  return (
    <div style={{ borderRadius: "5%" }}>
      <Select
        mode="multiple"
        size="large"
        allowClear
        showArrow
        showSearch
        filterOption={false}
        placeholder={`Please Select ${props.qName ?? "Vendors"}`}
        //defaultValue={props.type === "Cols" ? props.cols : ""}
        tagRender={props.type === "Cols" ? "" : tagRender}
        //bordered={false}
        //status={"warning"}
        className="rounded-full text-red-500"
        //popupClassName="rounded-full text-red-500"
        style={{
          width: vWidth || "50rem",
          height: "2.5rem",
          //borderRadius: "5%",
        }}
        //defaultValue={[]}
        options={options}
        onChange={handleChange}
        onSearch={handleSearch}
        //onDeselect={handleChange}
        //className="rounded-full"
      >
        {/* {children} */}
      </Select>
    </div>
  );
};

export default TagList;
