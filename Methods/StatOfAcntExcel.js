import * as XLSX from "xlsx-js-style";
import moment from "moment";

export const printExcel = (cData, hData, calcData) => {
  let cust = cData;
  let cHist = hData;
  let colsCust = Object.keys(cData[0]);
  let colsCustHist = Object.keys(hData[0]);
  let addNewLine = new Array(10);

  let colsO = colsCust.map((e) => {
    return {
      v: e === "RNK" ? "SRL NO" : e,
      t: "s",
      s: {
        fill: { fgColor: { rgb: "76adf5" } },
        font: { color: { rgb: "ffffff" } },
      },
    };
  });
  let cDataVal = cData.map((e, i) => Object.entries(e).map((e) => e[1])).flat();

  let cDataHistVal = hData.map((e, i) => Object.entries(e).map((e) => e[1]));
  //.flat()

  /*let cDataHistValO = [
    cDataHistVal.map((e) => {
      return { v: e.flat(), t: "s" };
    }),
  ];*/
  console.log(`cDataHistVal`, cDataHistVal);

  let balO = [
    {
      v: "Open Balance",
      t: "s",
      s: {
        fill: { fgColor: { rgb: "76adf5" } },
        font: { color: { rgb: "ffffff" } },
      },
    },
    {
      v: "Close Balance",
      t: "s",
      s: {
        fill: { fgColor: { rgb: "76adf5" } },
        font: { color: { rgb: "ffffff" } },
      },
    },
    {
      v: "Curr Balance",
      t: "s",
      s: {
        fill: { fgColor: { rgb: "76adf5" } },
        font: { color: { rgb: "ffffff" } },
      },
    },
  ];

  let balOVals = [calcData.openBalance, calcData.currbal, calcData.closebal];

  let colsOHist = colsCustHist.map((e) => {
    return {
      v: e,
      t: "s",
      s: {
        fill: { fgColor: { rgb: "76adf5" } },
        font: { color: { rgb: "ffffff" } },
      },
    };
  });

  console.log(`colsCust`, colsO, `values`, cDataVal);

  const ws = XLSX.utils.aoa_to_sheet([
    colsO,
    cDataVal,
    addNewLine,
    balO,
    //addNewLine,
    balOVals,
    addNewLine,
    addNewLine,
    colsOHist,
    //cDataHistVal.flat(),
  ]);

  //XLSX.utils.sheet_add_aoa(ws, [cust]);

  let type = ".xlsx";
  let fun, dl;
  var wb = XLSX.utils.book_new();
  //ws = utils.json_to_sheet(cHist.map((e) => e));
  // XLSX.utils.sheet_add_aoa(colsCust);

  /*XLSX.utils.sheet_add_json(
      ws,
      cHist.map((e) => e)
    );*/

  XLSX.utils.book_append_sheet(wb, ws, `Statment of Account `);
  XLSX.utils.sheet_add_aoa(ws, cDataHistVal, { origin: -1 });

  //ws = utils.json_to_sheet(cHist.map((e) => e));

  /*utils.sheet_add_json(
      cHist.map((e) => e),
      wb
    );*/
  /*const max_width = cData.reduce((w, r) => Math.max(w, r.CUST_NAME.length), 20);
  ws["!cols"] = [{ wch: max_width }];*/

  return dl
    ? XLSX.write(wb, { bookType: type, bookSST: true, type: "base64" })
    : XLSX.writeFile(wb, fun || `${`Statment of Account `}` + ".xlsx");

  /*HtmlTOExcel(
      data,
      cols,

      // Object.keys(cust[0]) /*, ...dataCols.map((e) => e.key)]*/ //,
  //    `Statment of Account `
  //);
};
