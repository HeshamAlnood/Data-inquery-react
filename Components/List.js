import { Select, Tag } from "antd";
import React from "react";
const { Option } = Select;
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'

let selectTag = [];

const TagList = (props) => {
  const children = props.cols.map((e) => (
    <Option key={e} className="rounded-full"></Option>
  ));

  let vWidth = props.width || "100%";

  const handleChange = (value) => {
    console.log(`selected ${value}`);

    console.log(`selectTag`);
    //console.log(selectTag);
    console.log(value);
    selectTag = value;

    props.filterd(selectTag);
  };

  /*for (let i = 10; i < 36; i++) {
    children.push(
      <Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>
    );
  }*/
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
        {label}
      </Tag>
    );
  };

  return (
    <div style={{ borderRadius: "5%" }}>
      <Select
        mode="multiple"
        size="large"
        allowClear
        showArrow
        placeholder={`Please Select ${props.qName ?? "Vendors"}`}
        //defaultValue={props.type === "Cols" ? props.cols : ""}
        tagRender={props.type === "Cols" ? "" : tagRender}
        //bordered={false}
        //status={"warning"}
        className="rounded-full text-red-500"
        popupClassName="rounded-full text-red-500"
        style={{
          width: "30rem", // vWidth,
          height: "2.5rem",
          //borderRadius: "5%",
        }}
        //defaultValue={[]}
        onChange={handleChange}
        //onDeselect={handleChange}
        //className="rounded-full"
      >
        {children}
      </Select>
    </div>
  );
};

export default TagList;
