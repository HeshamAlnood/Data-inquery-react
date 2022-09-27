import lodash, { isArray, sum, sortBy } from "lodash";
//import { tableKey } from "../Components/DataTable";
const columnByQuery = {
  VENDOR: "VEND_BALANCE",
  CUSTOMER: "CUST_BALANCE",
  PURCHASING: "PIH_INV_BALANCE",
  INVOICING: "SIH_INV_BALANCE",
  INVENTORY: "ITEM_ON_HAND_QTY",
};

const getColumnByQuery = (pquery) => {
  return columnByQuery[pquery];
};

export const sumArrayByKey = (obArry, queryName) => {
  let col = getColumnByQuery(queryName) || queryName;
  console.log(`col `, col);
  return Math.round(lodash.sumBy(obArry, col), 2);
};

export const sumArray = (arry) => {
  return Math.trunc(lodash.sum(arry), 2);
};

export const countArray = (arry) => {
  return arry.length;
};

export const maxArrayValue = (arry) => {
  return Math.trunc(lodash.max(arry), 2);
};

export const maxArrayValueByKey = (arry, pquery) => {
  return lodash.maxBy(arry, getColumnByQuery(pquery));
};

export const getValueByObKey = (arry, pquery) => {
  let values = [];
  arry.forEach((e) => {
    values.push(lodash.get(e, getColumnByQuery(pquery)));
  });
  return values;
};

function obSummary(sum, sumKey, max, maxKey, count) {
  this.sum = sum;
  this.sumKey = sumKey;
  this.max = max;
  this.maxKey = maxKey;
  this.count = count;
}

export const getSummryA = async (arry, pquery) => {
  let vArry = await getValueByObKey(arry, pquery);
  /*console.log("fromarrayFN");
  console.log(arry);
  console.log(vArry);*/
  let summaryOb = await sumArray(vArry);
  let sumKey = await sumArrayByKey(arry, pquery);
  let max = await maxArrayValue(vArry);
  let maxKey = await maxArrayValueByKey(arry, pquery);
  let count = await countArray(vArry);

  let ob = new obSummary(summaryOb, sumKey, max, maxKey, count);
  return { ob };
};

export const getSummry = (arry, pquery) => {
  let vArry = getValueByObKey(arry, pquery);
  console.log("fromarrayFN");
  console.log(arry);
  console.log(vArry);
  let summaryOb = sumArray(vArry);
  let sumKey = sumArrayByKey(arry, pquery);
  let max = maxArrayValue(vArry);
  let maxKey = maxArrayValueByKey(arry, pquery);
  let count = countArray(vArry);

  let ob = new obSummary(summaryOb, sumKey, max, maxKey, count);
  return ob;
};

export const getObSummry = (arry, pquery) => {
  let ob = {};
  getSummry(arry, pquery).then((e) => {
    return e;
  });
  /*console.log(`print from getObSummry the Object`);
  console.log(ob);*/
  return ob;
};

export const groupObject = (ob, col) => {
  return lodash.groupBy(ob, col);
};

export const returnObjectProperty = (ob, col) => {
  //  return lodash.takeWhile(ob, col);
  return lodash.map(ob, _.property(col));
};

export const returnObjectSumm = (ob, query) => {
  let queryCol = query === "CUSTOMER" ? "SIH_INV_DATE" : "PIH_INV_DATE";
  let sorted = lodash.sortBy(ob, queryCol);

  let dates = returnObjectProperty(
    sorted,
    query === "CUSTOMER" ? "SIH_INV_DATE" : "PIH_INV_DATE"
  );
  let balance = returnObjectProperty(
    sorted,
    query === "CUSTOMER" ? "SIH_INV_BALANCE" : "PIH_INV_BALANCE"
  );
  let paid = returnObjectProperty(
    sorted,
    query === "CUSTOMER" ? "SIH_PAID_AMT" : "PIH_PAID_AMT"
  );

  let profit = returnObjectProperty(
    sorted,
    query === "CUSTOMER" ? "SIH_PROFIT" : ""
  );

  return (ob = {
    dates: dates,
    balance: balance,
    paid: paid,
    profit: profit || 0,
  });
};

function groupBy(xs, f, s) {
  return xs.reduce(
    (r, v, i, a, k = f(v)) => ((r[k] || (r[k] = [])).push(v[s]), r),

    {}
  );
}

export const groupBySum = (ob, col, sumCol) => {
  //const result = groupBy(ob, (c) => c[col], sumCol);
  const result = groupBy(ob, (c) => c[col], sumCol);
  //const result = lodash.groupBy(ob, (c) => c[col]);

  return result;
};

export const formatDate = (pdate, pformat) => {
  //console.log(`pdate`, new Date(pdate));
  let vdd = String(pdate.getDate());
  let vmm = String(pdate.getMonth());
  let vyyyy = pdate.getFullYear();
  let vformat = pformat;
  vdd = vdd.padStart(2, "0");
  vmm = vmm.padStart(2, "0");
  vformat = vformat
    .replace("dd", vdd)
    .replace("mm", vmm)
    .replace("yyyy", vyyyy);
  return vformat;
};
