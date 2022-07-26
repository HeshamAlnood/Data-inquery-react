import { Button, Col, Row, Statistic } from "antd";
import { Card } from "@nextui-org/react";
import { StockOutlined, VerticalAlignBottomOutlined } from "@ant-design/icons";
import sales from "../pages/sales.png";
const Stats = (props) => {
  let vTitle = props.title;
  let vValue = props.value;
  let bgColor = props.color;

  return (
    <Card isPressable isHoverable variant="bordered" css={{ width: "19rem" }}>
      <Card.Body className={bgColor}>
        <Statistic
          title={
            <>
              <h className="text-white font-bold	tracking-wide text-lg">
                {vTitle}
              </h>
            </>
          }
          value={vValue}
          valueStyle={{
            color: "#ffffff",
            textAlign: "right",
            //fontSize: "2rem",
          }}
          css={{ color: "#ffffff" }}
          //prefix={<StockOutlined size="larg" />}
        />
      </Card.Body>
    </Card>
  );
};
export default Stats;
