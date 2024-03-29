import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
//import Dashboard from "../Components/Dashboard";
import DataTable from "../Components/DataTables";
import { Divider } from "antd";
//import { getStaticProps } from "next/types";

export default function SideBar(props) {
  let vCompanyName = props.companyName;
  let vLabel = props.componentName;
  console.log(`label`);
  console.log(vLabel);
  //let   invcData   = getStaticProps();

  //console.log(`invcData`, data, props.data);
  let vLabelClasses =
    "ease-in-out flex items-center gap-x-3 py-2 px-2.5 text-xl text-orange-50 hover:text-slate-700 rounded-md hover:bg-gray-100 hover:scale-125   dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-300";

  const [dropList, setDropList] = useState(false);

  const drpList = () => {
    setDropList(dropList === true ? false : true);
    console.log(`dropList`);
    console.log(dropList);
  };

  const DropListComp = () => {
    //console.log(`DropListComp`);
    if (dropList === true) {
      return (
        <div className="dropdown-container ">
          <ul className="divide-y divide-slate-400">
            <li>
              <Link href="/data/VENDOR" key={"VENDOR"}>
                <a className="flex items-center gap-x-3 py-2 px-2.5 text-xl text-orange-50 hover:text-slate-700 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-300">
                  Vendors
                </a>
              </Link>
            </li>
            <li>
              <Link href="/data/CUSTOMER" key={"CUSTOMER"}>
                <a className="flex items-center gap-x-3 py-2 px-2.5 text-xl text-orange-50 hover:text-slate-700 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-300 ">
                  Customer
                </a>
              </Link>
            </li>
            <li>
              <Link href="/data/INVENTORY" key={"INVENTORY"}>
                <a
                  className={`flex items-center gap-x-3 py-2 px-2.5 text-xl text-orange-50 hover:text-slate-700 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-300`}
                >
                  Items
                </a>
              </Link>
            </li>
            <li>
              <Link href="/data/PURCHASING" key={"PURCHASING"}>
                <a className="flex items-center gap-x-3 py-2 px-2.5 text-xl text-orange-50 hover:text-slate-700 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-300">
                  Purchasing
                </a>
              </Link>
            </li>
            <li>
              <Link href="/data/INVOICING" key={"INVOICING"}>
                <a className="flex items-center gap-x-3 py-2 px-2.5 text-xl text-orange-50 hover:text-slate-700 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-300">
                  Invoicing
                </a>
              </Link>
            </li>
          </ul>
        </div>
      );
    } else return <div></div>;
  };

  //const router = useRouter();

  useEffect(() => {
    let sideBarElm = document.querySelector("#sidebar");
    //let sideBarLabels = sideBarElm.querySelectorAll(":scope > ul >li >a");

    // how to convert nodelist to array
    //    let ar = Array.prototype.slice.call(sideBarLabels);
    const removeActiveClass = () => {
      sideBarElm.querySelectorAll(":scope > ul >li >a").forEach((el) => {
        el.classList.remove("bg-gray-100", "text-slate-700");

        el.classList.remove("bg-gray-100", "text-slate-700");
        /*console.log(el.textContent);
        alert(el.textContent);*/
      });
    };

    sideBarElm.querySelectorAll(":scope > ul >li >a").forEach((el) => {
      //el.classList.remove("bg-gray-100", "text-slate-700");
      el.addEventListener("click", (e) => {
        //e.preventDefault();
        removeActiveClass();
        //setLabelActive(el.textContent);
        el.classList.add("bg-gray-100", "text-slate-700");

        /*console.log(el.textContent);
        alert(el.textContent);*/
      });
      //console.log(e);
    });
  }, []);

  return (
    <div>
      <button
        type="button"
        className="text-gray-500 hover:text-gray-600"
        data-hs-sidebar="#docs-sidebar"
        aria-controls="docs-sidebar"
        aria-label="Toggle navigation"
      >
        <span className="sr-only">Toggle Navigation</span>
        <svg
          className="w-5 h-5"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
          />
        </svg>
      </button>
      <div
        id="docs-sidebar"
        className="hs-sidebar hs-sidebar-open:translate-x-0 -translate-x-full transition-all duration-300 transform hidden fixed top-0 left-0 bottom-0 z-[60] w-64 bg-white border-r border-gray-200 pt-7 pb-10 overflow-y-auto scrollbar-y lg:block lg:translate-x-0 lg:right-auto lg:bottom-0 dark:scrollbar-y dark:bg-gray-800 dark:border-gray-700 bg-slate-600			  		"
      >
        <div className="px-6">
          <a
            className="flex-none text-3xl font-semibold dark:text-white text-white text-center"
            href="#"
            aria-label="Brand"
          >
            {vCompanyName}
          </a>
        </div>
        <Divider orientation="center"></Divider>

        <nav className="p-6 w-full flex flex-col flex-wrap" id="sidebar">
          <ul className="space-y-3.5 divide-y divide-slate-400">
            <li>
              <Link href="/article">
                <a
                  //className="flex items-center gap-x-3 py-2 px-2.5 text-orange-50   text-xl text-slate-700 rounded-md hover:text-slate-700 hover:bg-gray-100 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-300"
                  className={vLabelClasses}

                  //onClick={() => setLabel({ label: "DashBoard" })}
                >
                  <svg
                    className="w-3.5 h-3.5"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2 13.5V7h1v6.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V7h1v6.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5zm11-11V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z"
                    />
                    <path
                      fillRule="evenodd"
                      d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z"
                    />
                  </svg>
                  Dashboard
                </a>
              </Link>
            </li>
            <li>
              <a
                // className={`flex items-center gap-x-3 py-2 px-2.5  active:bg-gray-100 text-xl text-slate-700 text-orange-50 rounded-md hover:text-slate-700 hover:bg-gray-100 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-300 ${isActive}`} // href="#"
                className={vLabelClasses}
                onClick={() => {
                  //setLabel("Reports");
                  drpList();
                }}
              >
                <svg
                  className="w-3.5 h-3.5"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275zM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
                </svg>
                Reports
                <button className="dropdown-btn">
                  <i className="fa fa-caret-down"></i>
                </button>
              </a>

              <DropListComp />
            </li>
            <li>
              <Link href="/Customer">
                <a className={vLabelClasses} href="#">
                  <svg
                    className="w-3.5 h-3.5"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                    <path
                      fillRule="evenodd"
                      d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                    />
                  </svg>
                  Customer
                </a>
              </Link>
            </li>
            <li>
              <a className={vLabelClasses} href="#">
                <svg
                  className="w-3.5 h-3.5"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M1.5 0A1.5 1.5 0 0 0 0 1.5V13a1 1 0 0 0 1 1V1.5a.5.5 0 0 1 .5-.5H14a1 1 0 0 0-1-1H1.5z" />
                  <path d="M3.5 2A1.5 1.5 0 0 0 2 3.5v11A1.5 1.5 0 0 0 3.5 16h6.086a1.5 1.5 0 0 0 1.06-.44l4.915-4.914A1.5 1.5 0 0 0 16 9.586V3.5A1.5 1.5 0 0 0 14.5 2h-11zM3 3.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5V9h-4.5A1.5 1.5 0 0 0 9 10.5V15H3.5a.5.5 0 0 1-.5-.5v-11zm7 11.293V10.5a.5.5 0 0 1 .5-.5h4.293L10 14.793z" />
                </svg>
                Projects
              </a>
            </li>
            <li>
              <a className={vLabelClasses} href="#">
                <svg
                  className="w-3.5 h-3.5"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z" />
                  <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
                </svg>
                Calendar
              </a>
            </li>
            <li>
              <a className={vLabelClasses} href="#">
                <svg
                  className="w-3.5 h-3.5"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811V2.828zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z" />
                </svg>
                Documentation
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
