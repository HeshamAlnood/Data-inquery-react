import { NextUIProvider } from "@nextui-org/react";
import "../styles/globals.css";
import "../Components/Navbar.css";
import "../styles/style.css";
import "/dist/output.css";

/*import "react-date-range/dist/styles.css"; // main style file react-date-range
import "react-date-range/dist/theme/default.css"; // theme css file react-date-range*/
import SideBar from "../Components/SideBar";

//import "./node_modules/preline/dist/hs-ui.bundle.js";

function MyApp({ Component, pageProps }) {
  // return <Component {...pageProps} />;
  return (
    <NextUIProvider>
      <SideBar companyName={"assassyat"} componentName={"hello"} />

      <Component {...pageProps} />
    </NextUIProvider>
  );
}

export default MyApp;
