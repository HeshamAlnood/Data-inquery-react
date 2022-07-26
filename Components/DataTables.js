import { useEffect, useState } from "react";
import {
  Container,
  Loading,
  Button,
  Grid,
  Table,
  useAsyncList,
  useCollator,
} from "@nextui-org/react";

import { Calendar, DateRangePicker } from "react-date-range";
import TagList from "./List";
//import Select from "../Components/Select";
import moment from "moment";

import { wrtie, utils, writeFileXLSX, writeFile } from "xlsx";
import "react-date-range/dist/styles.css"; // main style file react-date-range
import "react-date-range/dist/theme/default.css"; // theme css file react-date-range

export default function DataTable(props) {
  let [dataElm, setDataElm] = useState([{ key: 1, label: 1 }]);
  let [dataRaw, setDataRaw] = useState(dataElm);
  let [dataCols, setDataCols] = useState([{ key: 1, label: 1 }]);
  let [vPage, setPage] = useState(15);
  let [colKey, setColKey] = useState(["2"]);
  let [isLoading, setIsLoading] = useState(true);

  const [columnKeys, setColumnKeys] = useState(
    colKey.map((column) => column.key)
  );
  const columns = dataCols.filter((column) =>
    dataCols.some((key) => key === column.key)
  );

  const [vendorList, setVendorList] = useState(["A-0001"]);

  let [filterd, setFilterd] = useState([]);

  const queryFilterd = (valueArr = filterd) => {
    let dataOb = dataRaw;

    /*const intersection = dataOb.filter((element) =>
      valueArr.includes(element.VEND_VENDOR)
    );*/
    let intersection;
    if (valueArr.length > 0) {
      //intersection = dataOb.filter((e) => e.VEND_VENDOR.includes(valueArr));
      intersection = dataOb.filter((e) => valueArr.indexOf(e.VEND_VENDOR) >= 0);
      /*console.log(`intersection`);
      console.log(intersection);*/

      setDataElm(intersection);
    } else {
      setDataElm(dataRaw);
    }
  };

  useEffect(() => {
    queryFilterd();
  }, [filterd]);

  let now = moment();

  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: now._d,
    key: "selection",
  });

  const handleSelect = (date) => {
    setSelectionRange(date);
    /*console.log(`handleSelect`);
    console.log(date); // native Date object*/
  };
  //console.log(`End Dates`);
  const [dateValue, setDateValue] = useState([new Date(), new Date()]);

  console.log(dateValue);

  const performFilter = () => {
    let vStartDate = moment(selectionRange.startDate);
    let vEndDate = moment(selectionRange.endDate);
    console.log("DataElm afer Map");
    let dataOb = dataElm;

    var resultProductData = dataOb.filter((a) => {
      let startDate = new Date(vStartDate);
      let endDate = new Date(vEndDate);
      var date = new Date(a.PIH_INV_DATE);
      return (date >= startDate) & (date <= endDate);
    });

    setDataElm(resultProductData);
  };

  const resetFilter = () => {
    console.log("reset filter");
    console.log(dataRaw);
    console.log("end reset filter");
    setDataElm(dataRaw);
  };

  const HtmlTOExcel = (type = ".xlsx", fun, dl) => {
    var elt = document.getElementById("dataTable");
    var wb = utils.table_to_book(elt, { sheet: "sheet1" });
    return dl
      ? write(wb, { bookType: type, bookSST: true, type: "base64" })
      : writeFile(wb, fun || query + ".xlsx");
  };

  let query = props.query ?? "CUSTOMER";

  //let [list, setList] = useState("");
  const collator = useCollator({ numeric: true });

  async function sort({ items, sortDescriptor }) {
    return {
      items: items.sort((a, b) => {
        let first = a[sortDescriptor.column];
        let second = b[sortDescriptor.column];
        let cmp = collator.compare(first, second);
        if (sortDescriptor.direction === "descending") {
          cmp *= -1;
        }
        return cmp;
      }),
    };
  }
  let list = useAsyncList({ dataElm });
  //list = useAsyncList({ dataElm, sort });

  const disableCursor = (flag = true) => {
    flag === true
      ? document.body.classList.add("disabledbutton")
      : document.body.classList.remove("disabledbutton");
  };

  useEffect(() => {
    /*get data*/
    console.log(`inside useEffect`);
    console.log(`query params`);
    console.log(query);
    query = props.query;
    setIsLoading(true);
    disableCursor();
    if (query === "1" || query === undefined) {
      return;
    }
    fetch(`http://192.168.0.159:3001/dbData?inquery=${query}`)
      .then((res) => res.json())
      .then((data) => {
        let cols = Object.keys(data[1]);
        let colsArr = [];

        cols.forEach((e, i) => {
          let ob = { key: e, label: e };

          colsArr.push(ob);
        });

        let listUnqique = data.map((e) => e["VEND_VENDOR"]);

        setVendorList([...new Set(listUnqique)]);
        setDataElm(data);
        setDataRaw(data);
        setColKey(colsArr);
        //setList(useAsyncList({ data, sort }));
        //list = useAsyncList({ data, sort });
        console.log("list");
        console.log(list);
        setDataCols(colsArr);
        setIsLoading(false);
        disableCursor(false);
        setPage(Math.trunc(data.length / 20));

        console.log(dataElm);

        console.log(`list`);
        console.log(colsArr[0]);

        // list = useAsyncList({ data, sort });

        console.log("print map e colms");
        let contr = 0;
      })

      .catch((e) => console.log(`Error in fetch ${e}`));
  }, [query]);

  if (isLoading === true) {
    return (
      <div className="flex justify-center">
        <div className="article ">
          <Loading size="xl">Loading ...</Loading>
        </div>
      </div>
    );
  }
  return (
    /*  <div /*className="md:container md:mx-auto">
      <div className="article bg-slate-50">*/
    //<div className="md:container md:mx-auto">
    <Container xl>
      <div className="article bg-slate-50 ">
        <div className="ease-in duration-300 hover:ease-in space-y-4">
          <div>
            <a className="text-lg">Date From - To : </a>
            <DateRangePicker
              //onSelect={setColumnKeys}
              direction="horizontal"
              moveRangeOnFirstSelection={false}
              months={2}
              dateDisplayFormat={"dd/MM/yyyy"}
              onChange={(item) => handleSelect(item.selection)}
              //showSelectionPreview={false}
              preventSnapRefocus={true}
              showSelectionPreview={true}
              rangeColors={"#10b981"}
              ranges={[selectionRange]}
            />
          </div>
          <div>
            <Grid xs={12}>
              <Button.Group size="lg" color="primary" className="bg-blue-500">
                <Button color="gradient" onClick={performFilter}>
                  Search
                </Button>
                <Button color="gradient" onClick={resetFilter}>
                  Reset
                </Button>
                <Button color="gradient" onClick={HtmlTOExcel}>
                  Download Excel
                </Button>
              </Button.Group>
            </Grid>
          </div>

          <TagList cols={vendorList} filterd={setFilterd} />
          <Table
            id="dataTable"
            striped
            lined
            bordered
            aria-label="Example static striped collection table"
            hoverable="true"
            borderWeight="black"
            lineWeight="light"
            sortDescriptor={list.sortDescriptor}
            onSortChange={list.sort}
            css={{
              height: "auto",
              minWidth: "100%",
              width: "100%",
              zIndex: 1,
            }}
          >
            <Table.Header columns={dataCols}>
              {(column) => (
                <Table.Column
                  key={column.key}
                  align="center"
                  className="bg-sky-700 text-slate-50	text-base"
                  isRowHeader
                  //allowsSorting
                  minWidth="5rem"
                  maxWidth="10rem"
                >
                  {column.label}
                </Table.Column>
              )}
            </Table.Header>
            <Table.Body
              items={dataElm}
              loadingState={list.loadingState}
              onLoadMore={list.loadMore}
            >
              {(item) => (
                <Table.Row
                  //key={item.VEND_VENDOR}
                  key={colKey}
                  css={{
                    "&:hover": {
                      background: "$yellow100",
                      color: "$blue400",
                    },
                  }}
                >
                  {(columnKey) => <Table.Cell>{item[columnKey]}</Table.Cell>}
                </Table.Row>
              )}
            </Table.Body>
            <Table.Pagination
              shadow
              //noMargin
              align="center"
              rowsPerPage={20}
              //initialPage={15}
              //loop={true}
              total={vPage}
              onPageChange={(page) => console.log({ page })}
            />
          </Table>
        </div>
      </div>
    </Container>
    //</div>
  );
}
