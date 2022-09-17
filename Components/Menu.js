import { useContext, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  CalendarOutlined,
  KeyOutlined,
} from "@ant-design/icons";
import { Button, Menu, Divider } from "antd";
import { indexOf } from "lodash";

//import { getThemeName } from "@nextui-org/react/types/theme/utils";

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

let vLabelClasses =
  "ease-in-out items-center gap-x-3 py-2 px-2.5 text-xl text-orange-50 hover:text-slate-700 rounded-md  hover:scale-125 ";

const items = [
  //getItem("DashBoard", "1", <PieChartOutlined />),
  getItem(
    <Link href="/article">
      <a className={vLabelClasses}>DashBoard</a>
    </Link>,
    "1",
    <PieChartOutlined />
  ),

  getItem(<a className={vLabelClasses}>Report</a>, "sub1", <MailOutlined />, [
    //getItem("Vendors", "5"),
    getItem(
      <Link href="/data/VENDOR" key={"VENDOR"}>
        <a className={vLabelClasses}>Vendors</a>
      </Link>,
      "5"
    ),
    getItem(
      <Link href="/data/CUSTOMER" key={"CUSTOMER"}>
        <a className={vLabelClasses}>Customer</a>
      </Link>,
      "6"
    ),
    getItem(
      <Link href="/data/INVENTORY" key={"INVENTORY"}>
        <a className={vLabelClasses}>Items</a>
      </Link>,
      "7"
    ),
    getItem(
      <Link href="/data/PURCHASING" key={"PURCHASING"}>
        <a className={vLabelClasses}>Purchasing</a>
      </Link>,
      "8"
    ),
    getItem(
      <Link href="/data/INVOICING" key={"INVOICING"}>
        <a className={vLabelClasses}>Invoicing</a>
      </Link>,
      "9"
    ),
  ]),
  getItem(
    <Link href="/Customer">
      <a className={vLabelClasses}>Customer</a>
    </Link>,
    "10",
    <DesktopOutlined />
  ),
  getItem(
    <Link href="/Calendar" key={"Calendar"}>
      <a className={vLabelClasses}>Calendar</a>
    </Link>,
    "11",
    <CalendarOutlined />
  ),
  getItem(
    <Link href="/Account" key={"Account"}>
      <a className={vLabelClasses}>Account</a>
    </Link>,
    "12",
    <ContainerOutlined />
  ),
  getItem(
    <Link href="/ApproveInvoices" key={"Approve Collection"}>
      <a className={vLabelClasses}>Approve Collection</a>
    </Link>,
    "13",
    <ContainerOutlined />
  ),
  ,
];

function menuOb(key, href) {
  this.key = key;
  this.href = href;
}

let menuArr = [];
items.forEach((e) => {
  if (e.key === "sub1") {
    console.log(`Childern `, e.children);
    e.children?.forEach((c) =>
      menuArr.push(new menuOb(c.key, c.label.props.href))
    );
    e.children?.forEach((c) => console.log(c.key, c.label.props.href));
  } else {
    menuArr.push(new menuOb(e.key, e.label.props.href));
  }
  /*console.log(e.key, e.label.props.href);
  console.log(`items`, items);*/
});

const MenuBar = (props) => {
  const [collapsed, setCollapsed] = useState(false);
  let menuVArr = [];
  let router = useRouter();
  console.log("menuArr", menuArr);
  console.log(`router `, router.pathname);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  let vCompanyName = props.companyName;

  const getDefaultMenu = () => {
    let url_string = router.pathname; /*new URL(window.location.href)*/

    let currMenu = menuArr.filter((e) => e.href.indexOf(url_string) >= 0);

    menuVArr = currMenu.map((c) => c.key.toString())[0];
    return menuVArr || 1;
  };

  return (
    <div
      style={{
        overflow: "unset",
        width: 256,
        height: "auto",
        backgroundColor: "#001529",
      }}
      id="docs-sidebar"
      //className="hs-sidebar hs-sidebar-open:translate-x-0 -translate-x-full transition-all duration-300 transform hidden fixed top-0 left-0 bottom-0 z-[60] w-64 border-r border-gray-200 pt-7 pb-10 overflow-y-auto scrollbar-y lg:block lg:translate-x-0 lg:right-auto lg:bottom-0 dark:scrollbar-y dark:bg-gray-800 dark:border-gray-700 "
      className="hs-sidebar hs-sidebar-open:translate-x-0 -translate-x-full transition-all duration-300 transform hidden fixed top-0 left-0 bottom-0 z-[60] w-64 bg-white border-r border-gray-200 pt-7 pb-10 overflow-y-auto scrollbar-y lg:block lg:translate-x-0 lg:right-auto lg:bottom-0 dark:scrollbar-y dark:bg-gray-800 dark:border-gray-700 			  		"
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

      <nav
        className="  w-full flex flex-col flex-wrap divide-y divide-slate-400"
        id="sidebar"
      >
        <div className="divide-y divide-slate-400">
          <a
            className="flex-none text-3xl text-white font-semibold dark:text-white  text-center  "
            href="#"
            aria-label="Brand"
          >
            {vCompanyName}
          </a>
        </div>
        <Divider orientation="center"></Divider>
        <Menu
          defaultSelectedKeys={getDefaultMenu()}
          defaultOpenKeys={["sub1"]}
          mode="inline"
          theme="dark"
          inlineCollapsed={collapsed}
          items={items}
          //className={"bg-slate-300"}
          triggerSubMenuAction={"hover"}
          subMenuOpenDelay={1}
          //  className="items-center gap-x-3 py-2 px-2.5 text-xl text-orange-50 hover:text-slate-700 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-300"
          style={{
            //width: 256,
            height: "100%",
            overflow: "unset",
            hover: { transition: " 9.5s", backgroundColor: "green" },
          }}
        />
      </nav>
    </div>
  );
};

export default MenuBar;
