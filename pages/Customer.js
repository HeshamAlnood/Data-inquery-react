import {
  Card,
  Col,
  Descriptions,
  StatisticCol,
  Row,
  Layout,
  Divider,
  Statistic,
  DatePicker,
  Space,
} from "antd";
const { Header, Footer, Sider, Content } = Layout;

import { useEffect, useState } from "react";

export default function Customer() {
  let [customerData, setCustomerData] = useState([{}]);
  let [isDone, setIsDone] = useState(false);
  const fetchData = async () => {
    await fetch(`http://192.168.0.159:3001/dbData?inquery=CUSTOMER`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setCustomerData(data);
        console.log(Getdata(data));
      });
  };

  useEffect(() => {
    setIsDone(false);
    fetchData().then((e) => setIsDone(true));
  }, []);

  let dataCard = [];

  let dataDesc = [];

  const Getdata = (data = customerData) => {
    dataCard = data.map((e) => {
      let vTitle = `${e.CUST_CUSTOMER} - ${e.CUST_NAME}`;
      return (
        <Card
          title={vTitle}
          //bordered={false}
          style={{
            width: "80%",
          }}
        >
          <Descriptions>
            {
              //data.map((e) => {
              (e) => {
                for (const [key, value] of Object.entries(e)) {
                  console.log(`Object Keys : ${key}
               Object Values : ${value}`);
                  return (
                    <Descriptions.Item label={key}>{value}</Descriptions.Item>
                  );
                }
                //})
              }
            }
          </Descriptions>
        </Card>
      );
    });
    return dataCard;
    /*dataDesc = data.map((e) => {
      let { keys, values } = Object.entries(e);

      return <Descriptions.Item label={keys}>{values}</Descriptions.Item>;
    });*/
  };

  return (
    <Layout>
      <Content
        style={{
          padding: "4rem",
          paddingLeft: "18rem",
          margin: 0,
          minHeight: 280,
          backgroundColor: "transparent",
        }}
      >
        {" "}
        <Row justify="center">
          <Col>{Getdata(customerData)}</Col>
        </Row>
      </Content>
    </Layout>
  );
}
