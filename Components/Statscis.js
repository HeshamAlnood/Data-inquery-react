import { Container, Row, /*Card,*/ Text } from "@nextui-org/react";
import Dashboard from "./Dashboard";
import DataTable from "./DataTables";
import { Card, Avatar, Skeleton } from "antd";

//import RevnueImg from "../public/icons/revnue.png";
const { Meta } = Card;

export default function Statscis(props) {
  let isDone = props.isDone;
  console.log(`statics isDone`, isDone, props.isDone, props.title);
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
      className="glassy md:w-96 lg:h-48 md:h-32 max-h-40 "
      // title="Daily Revenue"
    >
      <div className="text-2xl text-slate-500 relative flex  ">
        {props.title}
      </div>
      <div className="flex justify-between ">
        <div className="text-4xl  pt-8 pb-16">
          {props.isDone && props.value}
          {props.isDone ?? <Skeleton.Input active={true} size={"small"} />}
        </div>
        <img src={`../icons/${props.type}.png`} className="w-16 pb-16" />
      </div>

      {/* <Meta
        //avatar={<Avatar src="../icons/revnue.png" className="w-96" />}
        title="Daily Revenue"
        description="5000.00"
        className="text-4xl"
      /> */}
    </Card>
  );
}
