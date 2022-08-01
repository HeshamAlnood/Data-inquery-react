import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { Button, Menu } from "antd";

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const items = [
  getItem("DashBoard", "1", <PieChartOutlined />),

  getItem("Report", "sub1", <MailOutlined />, [
    getItem("Vendors", "5"),
    getItem("Customer", "6"),
    getItem("Items", "7"),
    getItem("Purchasing", "8"),
    getItem("Invocing", "9"),
  ]),
  getItem("Calendar", "10", <DesktopOutlined />),
  getItem("Account", "11", <ContainerOutlined />),
];

const MenuBar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      style={{
        width: 256,
      }}
    >
      <Button
        type="primary"
        onClick={toggleCollapsed}
        style={{
          marginBottom: 16,
        }}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
      <Menu
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
        items={items}
        className={"dropdown-container"}
      />
    </div>
  );
};

export default MenuBar;
