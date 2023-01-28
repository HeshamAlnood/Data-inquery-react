import { useEffect, useState } from "react";
import { Descriptions, Button, DatePicker } from "antd";
import moment from "moment";

const { RangePicker } = DatePicker;

export const StatOfAccntC = (props) => {
  let [currCustomer, setCurrCustomer] = useState(props.currCustomer);

  let [customerHist, setCustomerHist] = useState([]);
  let [dateR, setDateR] = useState([]);
  let visible = props.visible || false;

  const getCustHist = () => {
    fetch(``)
      .then((rsp) => rsp.json())
      .then((data) => setCustomerHist(date));
  };

  const onChangeDateRange = (dates, dateStrings) => {
    if (dates) {
      setDateR([moment(dates[0]), moment(dates[1])]);
    }
    if (dates[1].length > 1) getCustHist(moment(dates[0]), moment(dates[0]));
  };

  useEffect(() => {
    fetch(`http://192.168.0.159:3000/api/requestData?inquery=CUSTOMER`)
      .then((rsp) => rsp.json())
      .then((data) =>
        setCurrCustomer(
          data.filter((e) => e.CUST_CUSTOMER === props.currCustomer)
        )
      );
  }, []);

  const getHeaderData = () => {
    <>
      <Descriptions
        title={`Covering Transactions Starting From ${"01/01/2022"} To: ${"31/12/2022"}`}
      >
        {currCustomer?.map((e) => (
          <>
            <Descriptions.Item label="Cust. No">
              {e.CUST_CUSTOMER}
            </Descriptions.Item>
            <Descriptions.Item label="Customer Name">
              {e.CUST_NAME}
            </Descriptions.Item>
            <Descriptions.Item label="Address">
              {e.CUST_ADDRESS}
            </Descriptions.Item>
            <Descriptions.Item label="Contact Person">
              {e.CUST_PHONE}
            </Descriptions.Item>
            <Descriptions.Item label="E-Mail">{e.CUST_EMAIL}</Descriptions.Item>
            <Descriptions.Item label="Terms">{e.CUST_TERMS}</Descriptions.Item>
            <Descriptions.Item label="Credit Limit">
              {e.CUST_CREDIT_LIMIT}
            </Descriptions.Item>
            <Descriptions.Item label="Phone">{e.CUST_PHONE}</Descriptions.Item>
            <Descriptions.Item label="Fax">{e.CUST_FAX}</Descriptions.Item>
          </>
        ))}
      </Descriptions>
    </>;
  };

  return (
    <Modal
      title={`Statment Of Account for ${currCustomer}`}
      centered
      visible={visible}
      width={1750}
      high={1550}
      onOk={() => onClose()}
      onCancel={() => onClose()}
    >
      {/* <div className="grid grid-cols-2 gap-8 rounded-lg "> */}
      <div>
        <getHeaderData />
        <RangePicker
          ranges={{
            Yesterday: [moment().day(-1), moment().day(-1)],

            Today: [moment(), moment()],
            "This Week": [moment().day(-7), moment().day(0)],
            "This Month": [moment().startOf("month"), moment().endOf("month")],
            "3 Months": [moment().day(-90), moment().day(0)],
            "6 Months": [moment().day(-180), moment().day(0)],
            Year: [moment().day(-365), moment().day(0)],
            "This Year": [moment().startOf("year"), moment().endOf("year")],
          }}
          format="YYYY/MM/DD"
          onChange={onChangeDateRange}
          size={"large"}
          style={{ borderRadius: "9999999px", textAlign: "justify" }}
          className="text-lg text-justify	"
        />
      </div>
    </Modal>
  );
};
