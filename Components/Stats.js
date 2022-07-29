import { Button, Col, Row, Statistic } from "antd";
import { Card } from "@nextui-org/react";
import { StockOutlined, VerticalAlignBottomOutlined } from "@ant-design/icons";
import sales from "../pages/sales.png";
const Stats = (props) => {
  let vTitle = props.title;
  let vValue = props.value;
  let bgColor = props.color;

  return (
    <Card
      isPressable
      isHoverable
      variant="bordered"
      css={{
        width: "19rem",
        borderRadius: "4%",
        backgroundColor: "transparent",
      }}
      className="glassy"
    >
      <Card.Body>
        <Statistic
          title={
            <>
              <h className="text-black font-bold	tracking-wide text-lg ">
                {vTitle}
              </h>
            </>
          }
          value={vValue}
          valueStyle={{
            color: bgColor,
            textAlign: "right",
            //fontSize: "2rem",
          }}
          className={bgColor}

          //prefix={<StockOutlined size="larg" />}
        />
      </Card.Body>
    </Card>
  );
};
export default Stats;
