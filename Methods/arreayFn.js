import lodash, { isArray, sum } from "lodash";

const getColumnByQuery = (pquery) => {
  if (pquery === "VENDOR") {
    return "VEND_BALANCE";
  } else if (pquery === "CUSTOMER") {
    return "CUST_BALANCE";
  } else if (pquery === "PURCHASING") {
    return "PIH_NET_INV_AMT";
  } else if (pquery === "INVOICING") {
    return "SIH_NET_INV_AMT";
  } else {
    return pquery;
  }
};

export const sumArrayByKey = (obArry, queryName) => {
  let col = getColumnByQuery(queryName);
  return lodash.sumBy(obArry, col);
};

export const sumArray = (arry) => {
  return Math.trunc(lodash.sum(arry), 2);
};

export const countArray = (arry) => {
  return arry.length;
};

export const maxArrayValue = (arry) => {
  return lodash.max(arry);
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
  /*console.log("fromarrayFN");
  console.log(arry);
  console.log(vArry);*/
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
    //(r, v, i, a, k = f(v)) => ((r[k] || (r[k] = [])).push((v[s])), r),
    //(r, v, i, a, k = f(v)) => ((r[k] || (r[k] = [])).push(v[lodash.sum(s)]), r),
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
