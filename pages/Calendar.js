import { Layout, Badge, Calendar, Input, Alert, Loading } from "antd";
import { padStart } from "lodash";
import moment from "moment";
import { useEffect, useState } from "react";
import { sumArrayByKey } from "../Methods/arreayFn";

function CalendarData(props) {
  const [dayTrans, setDayTrans] = useState([]);
  const [dayInfo, setDayInfo] = useState([]);
  const [vday, setDay] = useState("");
  const [vmonth, setMonth] = useState(moment().month() + 1);
  const [vyear, setYear] = useState(moment().subtract(0, "years").year());
  const [date, setDate] = useState("");
  const { Header, Footer, Sider, Content } = Layout;
  const [currDate, setCurrDate] = useState("");
  const [monthInfo, setMonthInfo] = useState([]);
  const [listData, setListDate] = useState([]);
  const [dayFlag, setDayFlag] = useState(false);

  //console.log(`from server props CalendarData :`, props.data);

  const tranDates = async (pDate) => {
    console.log(`Before tranDates , `, pDate.year(), pDate.format("MM"));
    console.log(`Before tranDates variables , `, vyear, vmonth);

    console.log(`After tranDates , `, pDate.year(), pDate.format("MM"));
    console.log(`After tranDates variables , `, vyear, vmonth);
    /*//console.log(`pDate `, pDate.);*/
    //if ((pDate.year() === vyear) & (pDate.month() === vmonth)) return;
    await getDayTrans(pDate.year(), pDate.format("MM"));
  };

  const getDaysInfo = async (pYear, pMonth = moment().month()) => {
    //if (pYear.length === 0 || pYear === "") return;
    console.log(`pYear : `, pYear);
    console.log(`pMonth : `, pMonth);

    let rsp = await fetch(
      `http://localhost:3000/api/getDailyTrans?year=${pYear}&month=${
        pMonth || null
      }`
    );

    let data = await rsp.json();
    //console.log(`data from api `, data);
    return data;
  };

  const getDayTrans = (pYear = vyear, pMonth = vmonth, pDay = null) => {
    let datas = [];
    const dayInfo = [];

    getDaysInfo(pYear, pMonth).then((d) => {
      setDayTrans(d);

      //setListDate(dayInfo.filter((e) => e.key === value.format("yyyyMMDD")));
      datas = d;
      //console.log(`data getDaysInfo & getDayTrans`, datas);
      datas.forEach((e) => {
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

      //setTimeout(() => setDayInfo(dayInfo || []), 3000);
      //setTimeout(() => null, 2000);
      //tranDates(date);
      setDayInfo(dayInfo || []);
      return dayInfo || [];
    });

    //setTimeout(() => console.log("waiting"), 3000);
    return dayInfo || [];
    console.log(`data after`, datas);
  };

  useEffect(() => {
    setDayFlag(false);
    setDayTrans(props.data);
    let dayInfo = [];

    let datas = props.data;
    //console.log(`data getDaysInfo & getDayTrans`, datas);
    datas.forEach((e) => {
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

    setDayInfo(dayInfo || []);
    setMonthInfo(dayInfo || []);
    //return dayInfo || [];
    //setDayInfo(props.data);

    setDayFlag(true);
  }, []);

  useEffect(() => {
    console.log(`useEffect vyear`, vyear);
    console.log(`useEffect vmonth`, vmonth + 1);
    if (vyear === undefined) return;
    console.log(`start api`);
    setDayFlag(false);
    getDaysInfo(vyear).then((d) => {
      // console.log(`get data api`, d);
      setMonthInfo(d);
      setDayFlag(true);
      //setTimeout(() => null, 1000);
    });
  }, [vyear, vmonth]);

  const dateCellRender = (value) => {
    // console.log(`dayFlag false or true : `, dayFlag);
    if (dayFlag === false) return;
    //console.log(`from dateCellRender`, dayInfo);
    const listData =
      dayInfo?.filter((e) => e.key === value.format("yyyyMMDD")) || [];
    //setListDate(dayInfo.filter((e) => e.key === value.format("yyyyMMDD")));
    //setTimeout(() => null, 1000);
    //    console.log(`listData : `, value.format("yyyyMMDD"), listData);
    /*if ((listData.length = 0)) {
      return (
        <div className="flex justify-center">
          <div className="article ">
            <Loading size="xl">Loading ...</Loading>
          </div>
        </div>
      );
    }*/

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
    //console.log(`month cell info`, monthInfo);
    if (dayFlag === false) return;
    let arr = monthInfo.filter((e) => e.MONTH === value.format("MM"));
    let arrInv = arr.filter((e) => e.TYPE === "INVOICE");
    let arrPur = arr.filter((e) => e.TYPE === "PURCHASE");
    //console.log(`arr`, arr);
    const sumInv = sumArrayByKey(arrInv, "AMOUNT");
    const sumPur = sumArrayByKey(arrPur, "AMOUNT");
    //console.log(`from monthCellRender `, sumInv, sumPur);
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
          dateCellRender={dayFlag === true ? dateCellRender : ""}
          //defaultValue={moment().subtract(6, "years")}
          defaultValue={moment().subtract(0, "years")}
          onChange={(e) => {
            console.log(` on Change `, e.format("yyyyMM"));
            console.log(` Current `, vyear, vmonth);
            //if ((e.year() === vyear) & (e.month() === vmonth)) return;
            setDate(e);
            /* setMonth(e.format("MM"));
            setYear(e.year());*/
            console.log(`print before waint onChange`);
            //setTimeout(() => tranDates(e), 1000);
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

export async function getServerSideProps() {
  let year = moment().year();
  let month = moment().month();
  let rsp = await fetch(`http://localhost:3000/api/getDailyTrans?year=${year}`);
  let data = await rsp.json();
  //let data = [{ hhh: "hello" }];
  //return data;
  //console.log(`getServerSideProps `, data);
  return {
    props: { data: data }, // will be passed to the page component as props
  };
}

export default CalendarData;
