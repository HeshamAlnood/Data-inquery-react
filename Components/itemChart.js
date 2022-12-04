import { useEffect, useState } from "react";
import lodash from "lodash";
import { BarChart } from "./Charts/Bar";
import { Modal, Divider, Space, Card } from "antd";
import { BarChartGrouped } from "./Charts/BarGrouped";
import { AreaChart } from "./Charts/Line";
/*import { responsiveArray } from "antd/lib/_util/responsiveObserve";
import { loadStaticPaths } from "next/dist/server/dev/static-paths-worker";*/

const ItemChart = (props) => {
  let [data, setData] = useState([]);

  let [itemSales, setItemSales] = useState([]);
  let [itemPurchase, setItemPurchase] = useState([]);
  let [itemSalesRet, setItemSalesRet] = useState([]);
  let [itemPurchaseRet, setItemPurchaseRet] = useState([]);
  let [category, setCategory] = useState([]);
  let [categorySales, setCategorySales] = useState([]);
  let [categoryPurchase, setCategoryPurchase] = useState([]);
  let [itemPurchaseAr, setItemPurchaseAr] = useState([]);
  let [itemSalesAr, setItemSalesAr] = useState([]);
  let [dateAr, setDateAr] = useState([]);

  const fillArrays = (data) => {
    console.log(`fil arrays data `, data);
    setItemSales(
      lodash
        .orderBy(data, ["TOTAL_SALES"], ["desc"])
        .map((e) => e.TOTAL_SALES)
        .filter((e) => e > 0)
    );
    setItemPurchase(
      lodash
        .orderBy(data, ["TOTAL_PURCHASE"], ["desc"])
        .map((e) => e.TOTAL_PURCHASE)
        .filter((e) => e > 0) || []
    );
    setItemSalesRet(
      data.map((e) => e.TOTAL_SALES_RETUERN || []).filter((e) => e > 0)
    );
    setItemPurchaseRet(
      data.map((e) => e.TOTAL_PURCHASE_RETURN || []).filter((e) => e > 0)
    );
    setCategory(data.map((e) => e.CUSTOMER_VENDOR));
    setCategorySales(
      lodash
        .orderBy(data, ["TOTAL_SALES"], ["desc"])
        .map((e) => e.CUSTOMER_VENDOR)
      // .filter((e) => e > 0) || []
    );
    setCategoryPurchase(
      lodash
        .orderBy(data, ["TOTAL_PURCHASE"], ["desc"])
        //.filter((e) => e > 0)
        .map((e) => e.CUSTOMER_VENDOR)
        .slice(
          0,
          data.map((e) => e.TOTAL_PURCHASE).filter((e) => e > 0).length
        ) || []
    );
    console.log(
      `order by lodash `,
      lodash.orderBy(data, ["TOTAL_SALES"], ["desc"])
    );
  };
  //let itemPurchase = data.filter((e) => e.TYPE === "PURCHASE");

  //console.log(`purchase`, itemPurchase);
  let [isVisible, setIsVisible] = useState(props.isVisible);
  let vKeyVal = props.partno;
  const onClose = () => {
    setIsVisible(false);
    //setShowFLag(false);
    props.setShowFlag(false);
  };

  console.log(`sales`, itemSales);
  console.log(`purchase`, itemPurchase);
  console.log(`purchaseRet`, itemPurchaseRet);
  console.log(`itemSalesRet`, itemSalesRet);
  console.log(`category`, category);

  useEffect(() => {
    fetch(
      `http://localhost:3000/api/getItemsData?type=itemRank&keyVal=${vKeyVal}`
    )
      .then((rsp) => rsp.json())
      .then((data) => {
        setData(data);
        fillArrays(data);
        /*setItemSales(
          data
            .filter((e) => e.TYPE === "SALES")
            .map((e) => e.CUSTOMER_VENDOR || e.TOTAL_QTY)
        );*/
      });

    fetch(
      `http://localhost:3000/api/getItemsData?type=itemCardMovment&keyVal=${props.partno}`
    )
      .then((rs) => rs.json())
      .then((data) => {
        console.log(
          `getItemsData `,
          //data,
          lodash.orderBy(data, ["INV_DATE"], ["desc"]),
          lodash
            .orderBy(data, ["INV_DATE"], ["desc"])
            .filter((e) => e.CATEGORY === "PURCHASE")
            .map((e) => e.IN_QTY || 0)
        );

        setItemPurchaseAr(
          lodash
            .orderBy(data, ["INV_DATE"], ["desc"])
            .filter((e) => e.CATEGORY === "PURCHASE")
            .map((e) => e.IN_QTY || 0)
        );
        setItemSalesAr(
          lodash
            .orderBy(data, ["INV_DATE"], ["desc"])
            .filter((e) => e.CATEGORY === "SALES")
            .map((e) => e.OUT_QTY || 0)
        );
        setDateAr(
          lodash
            .orderBy(data, ["INV_DATE"], ["desc"])
            .map((e) => e.INV_DATE || 0)
        );
      });
  }, [props.partno]);

  return (
    <>
      <Modal
        title={`Item Summary for ${vKeyVal}`}
        centered
        visible={isVisible}
        width={2750}
        high={1950}
        onOk={() => onClose()}
        onCancel={() => onClose()}
      >
        {/* <div className="grid grid-cols-2 gap-8 rounded-lg "></div> */}
        {/* <Divider>{vKeyVal} Items Transctions</Divider> */}
        <div className="grid  grid-cols-2  gap-24">
          <div
          //className="h-fit grid-cols-2	"
          //style={{ height: "100%", width: "100%", overflowY: "scroll" }}
          >
            <div>
              <div
                style={{
                  minHeight: "300px",
                  maxHeight: "1200px",
                  overflowY: "auto",
                  overflowX: "hidden",
                }}
              >
                <Card
                  bordered={false}
                  hoverable="true"
                  style={{
                    //width: "60.5rem",
                    //height: "38.9rem",
                    marginLeft: "6.45rem",
                    marginTop: "1rem",
                    marginBottom: "1rem",
                    borderRadius: "1%",
                    backgroundColor: "transparent",
                  }}
                  className="glassy"
                >
                  <BarChartGrouped
                    data={itemSales}
                    title={"High Customer Sales & Return"}
                    finish={true}
                    series1={itemSales}
                    series2={itemSalesRet}
                    catg={categorySales}
                    type1={"Sales"}
                    type2={"Sales Return"}
                  />
                </Card>
              </div>
            </div>
          </div>
          <div
            style={{
              minHeight: "300px",
              maxHeight: "1200px",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            <Card
              bordered={false}
              hoverable="true"
              style={{
                //width: "60.5rem",
                //height: "38.9rem",
                marginLeft: "6.45rem",
                marginTop: "1rem",

                marginBottom: "1rem",
                borderRadius: "1%",
                backgroundColor: "transparent",
              }}
              className="glassy"
            >
              <BarChartGrouped
                data={itemPurchase}
                title={"High Vendor Purchase & Return"}
                finish={true}
                series1={itemPurchase}
                series2={itemPurchaseRet}
                catg={categoryPurchase}
                type1={"Purchase"}
                type2={"Purchase Return"}
              />
            </Card>
          </div>
        </div>

        <div>
          <Divider> Trend</Divider>
          <Card
            bordered={false}
            hoverable="true"
            style={{
              //width: "60.5rem",
              //height: "38.9rem",
              marginLeft: "6.45rem",
              borderRadius: "1%",
              backgroundColor: "transparent",
            }}
            className="glassy"
          >
            <AreaChart
              series1={itemSalesAr}
              seriesLabel1={`Sales QTY `}
              series2={itemPurchaseAr}
              seriesLabel2={`Purchase QTY `}
              label={"hello"}
              catg={dateAr}
            />
          </Card>
        </div>
        {/* </div> */}
        {/* </div> */}
      </Modal>
    </>
  );
};

export default ItemChart;
