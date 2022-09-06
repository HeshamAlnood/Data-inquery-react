import { Layout, Badge, Calendar, Input, Alert } from "antd";
import { padStart } from "lodash";
import moment from "moment";
import { useEffect, useState } from "react";
import { sumArrayByKey } from "../Methods/arreayFn";

export default function Customer(props) {
  const [dayTrans, setDayTrans] = useState([]);
  const [dayInfo, setDayInfo] = useState([]);
  const [vday, setDay] = useState("");
  const [vmonth, setMonth] = useState("");
  const [vyear, setYear] = useState("2016");
  const [date, setDate] = useState("");
  const { Header, Footer, Sider, Content } = Layout;
  const [currDate, setCurrDate] = useState("");
  const [monthInfo, setMonthInfo] = useState([]);

  const tranDates = async (pDate) => {
    console.log(`Before tranDates , `, pDate.year(), pDate.format("MM"));
    console.log(`Before tranDates variables , `, vyear, vmonth);
    /*pDate.year() === vyear ? setYear(pDate.year()) : "";
    pDate.month() === vmonth ? setMonth(pDate.month()) : "";*/
    /*setMonth(pDate.month());
    setYear(pDate.year());*/

    //setTimeout(() => console.log(`waitng for update the dates`), 1000);

    console.log(`After tranDates , `, pDate.year(), pDate.format("MM"));
    console.log(`After tranDates variables , `, vyear, vmonth);
    /*//console.log(`pDate `, pDate.);*/
    //if ((pDate.year() === vyear) & (pDate.month() === vmonth)) return;
    await getDayTrans(pDate.year(), pDate.format("MM"));
  };

  const tranMonth = (pYEar, pMonth = -1) => {
    //await   getDayTrans(pYEar.year());

    let rslt;
    //let rslt =
    //getDaysInfo(pYEar).then((d) => setMonthInfo(d));

    /*if (dayInfo === undefined) {
      let rslt = getDaysInfo(pYEar);

      console.log(`rslt : `, rslt);
    } else {
      rslt = dayInfo;
      console.log(`Else rslt : `, rslt);
    }*/
    //setTimeout(() => null, 1000);
    //let rslt = monthInfo;
  };

  const getDaysInfo = async (pYear, pMonth) => {
    //if (pYear.length === 0 || pYear === "") return;
    console.log(`pYEar : `, pYear);
    console.log(`pMonth : `, pMonth);
    let rsp = await fetch(
      `http://192.168.0.159:3001/DailyTrans?year=${pYear}&month=${
        pMonth || null
      }`
    );
    let data = rsp.json();

    return data;
  };

  const getDayTrans = (pYear = vyear, pMonth = vmonth, pDay) => {
    let data = [];
    const dayInfo = [];
    getDaysInfo(pYear, pMonth).then((d) => {
      setDayTrans(d);
      data = d;
      console.log(`data `, data);
      data.forEach((e) => {
        //if (e.Day === pDay) {

        let ob = {
          id: e.TYPE + e.YEAR + e.MONTH + e.DAY,
          key: e.YEAR + e.MONTH + e.DAY,
          amount: e.AMOUNT,
          day: e.DAY,
          month: e.MONTH,
          year: e.YEAR,
          type: e.TYPE === "INVOICE" ? "success" : "warning",
          content: `Total ${e.TYPE} : ${Math.round(e.AMOUNT, 2)}`,
        };
        dayInfo.push(ob);
        //}
      });

      setTimeout(() => setDayInfo(dayInfo || []), 3000);

      //tranDates(date);
      return dayInfo || [];
    });

    //setTimeout(() => console.log("waiting"), 3000);

    console.log(`data after`, data);
  };

  useEffect(() => {
    console.log(`useEffect vyear`, vyear);
    if (vyear === undefined) return;
    console.log(`start api`);
    getDaysInfo(vyear).then((d) => {
      console.log(`get data api`, d);
      setMonthInfo(d);
    });
  }, [vyear]);

  const dateCellRender = (value) => {
    const listData = dayInfo.filter((e) => e.key === value.format("yyyyMMDD"));

    //console.log(`listData : `, value.format("yyyyMMDD"), listData);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.id}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  const monthCellRender = (value) => {
    console.log(`month cell info`, monthInfo);
    let arr = monthInfo.filter((e) => e.MONTH === value.format("MM"));
    let arrInv = arr.filter((e) => e.TYPE === "INVOICE");
    let arrPur = arr.filter((e) => e.TYPE === "PURCHASE");
    console.log(`arr`, arr);
    const sumInv = sumArrayByKey(arrInv, "AMOUNT");
    const sumPur = sumArrayByKey(arrPur, "AMOUNT");
    console.log(`from monthCellRender `, sumInv, sumPur);
    return sumInv ? (
      <div className="notes-month">
        <ul className="events">
          <li key={"I" + value.format("yyyyMM")}>
            <Badge
              status={"success"}
              text={`Total Invoice : ${Math.round(sumInv)}`}
            />
          </li>
          <li key={"P" + value.format("yyyyMM")}>
            <Badge
              status={"warning"}
              text={`Total Purchase : ${Math.round(sumPur)}`}
            />
          </li>
        </ul>
      </div>
    ) : null;
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
        {currDate && (
          <div>
            <Alert message={`Date Selected ${currDate}`} type="info" showIcon />
          </div>
        )}
        <Calendar
          dateCellRender={dateCellRender}
          onChange={(e) => {
            console.log(` on Change `, e.format("yyyyMM"));
            console.log(` Current `, vyear, vmonth);
            //if ((e.year() === vyear) & (e.month() === vmonth)) return;
            setDate(e);
            setMonth(e.format("MM"));
            setYear(e.year());
            console.log(`print before waint onChange`);
            setTimeout(() => tranDates(e), 1000);
            console.log(`print ater waint onChange`);
            //            tranDates(e);

            console.log(`did Changes`);
          }}
          onSelect={(e) => setCurrDate(e.format("DD/MM/YYYY, MMMM Do YYYY"))}
          monthCellRender={monthCellRender}
          onPanelChange={(e, m) => {
            console.log(`onPanel Change `, e.year(), m);
            //m === "year" ? tranMonth(e.year(), e.month()) : "";
            if (m === "year") {
              console.log(`mode is year`);
              setYear(e.year());
            }
          }}
        />
      </Content>
    </Layout>
  );
}
