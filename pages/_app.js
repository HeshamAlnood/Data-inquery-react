import { NextUIProvider } from "@nextui-org/react";
import "../styles/globals.css";
import "../Components/Navbar.css";
import "../styles/style.css";
import "/dist/output.css";

/*import "react-date-range/dist/styles.css"; // main style file react-date-range
import "react-date-range/dist/theme/default.css"; // theme css file react-date-range*/
import SideBar from "../Components/SideBar";
import Menu from "../Components/Menu";
import { useContext, createContext } from "react";

//import "./node_modules/preline/dist/hs-ui.bundle.js";

export const CompanyName = createContext("Assassyat1");
//export const =createContext('');
//export const invContext = createContext([]);

/*const runRequest = async () => {
  const rqs = await fetch(
    `http://192.168.0.159:3001/dbData?inquery=${"INVENTORY"}&dfrom=${20100101}&dto=${20221231}`
  );
  const data = await rqs.json();
  invContext = createContext(data);
  return data;
};
runRequest();*/

function MyApp({ Component, pageProps, dataq }) {
  // return <Component {...pageProps} />; <SideBar companyName={"  Assassyat"} componentName={"hello"} />
  console.log(`from myApp props data`, dataq);
  return (
    <NextUIProvider>
      <Menu companyName={"Assassyat"} componentName={"hello"} />
      <Component {...pageProps} />
    </NextUIProvider>
  );
}

export default MyApp;
