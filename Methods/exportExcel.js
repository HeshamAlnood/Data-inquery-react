import { wrtie, utils, writeFileXLSX, writeFile } from "xlsx";
import lodash from "lodash";

const HtmlTOExcel = (pdata, cols, name = "export", type = ".xlsx", fun, dl) => {
  //var elt = document.getElementById("dataTable");
  //var wb = utils.table_to_book(elt, { sheet: "sheet1" })  ;

  console.log(`pdata `, pdata, cols);

  let ws = utils.json_to_sheet(pdata.map((e) => lodash.pick(e, cols)) || pdata);

  var wb = utils.book_new();

  utils.book_append_sheet(wb, ws, name);

  return dl
    ? write(wb, { bookType: type, bookSST: true, type: "base64" })
    : writeFile(wb, fun || `${name}` + ".xlsx");
};

export default HtmlTOExcel;
