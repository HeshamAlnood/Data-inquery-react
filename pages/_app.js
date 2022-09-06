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

//export const companyName = createContext("");

function MyApp({ Component, pageProps, data }) {
  // return <Component {...pageProps} />; <SideBar companyName={"  Assassyat"} componentName={"hello"} />
  console.log(`from myApp props data`, data);
  return (
    <NextUIProvider>
      <Menu companyName={"Assassyat"} componentName={"hello"} />

      <Component {...pageProps} />
    </NextUIProvider>
  );
}

export default MyApp;
