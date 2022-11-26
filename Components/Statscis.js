import { Container, Row, /*Card,*/ Text } from "@nextui-org/react";
import Dashboard from "./Dashboard";
import DataTable from "./DataTables";
import { Card, Avatar } from "antd";

//import RevnueImg from "../public/icons/revnue.png";
const { Meta } = Card;

export default function Statscis(props) {
  return (
    <Card
      bordered={false}
      hoverable="true"
      style={{
        //width: "24.5rem",
        //height: "10.9rem",
        //marginLeft: "6.45rem",
        borderRadius: "4%",
        backgroundColor: "transparent",
      }}
      className="glassy md:w-96 lg:h-full"
      // title="Daily Revenue"
    >
      <div className="text-2xl text-slate-500">{props.title}</div>
      <div className="flex flex-row-reverse ">
        <img src={`../icons/${props.type}.png`} className="w-16 " />
      </div>

      <div className="text-4xl">{props.value} </div>
      {/* <Meta
        //avatar={<Avatar src="../icons/revnue.png" className="w-96" />}
        title="Daily Revenue"
        description="5000.00"
        className="text-4xl"
      /> */}
    </Card>
  );
}
