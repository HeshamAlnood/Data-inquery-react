import moment from "moment";

let url = `http://192.168.0.159:3001`;

export const requestData = async (pquery, pdateFrom, pDateTo) => {
  let vDateFrom = pdateFrom || moment().year() + "0101";
  let vDateTo = pDateTo || moment().year() + "1231";

  console.log(
    `Data api request Data date from ${pdateFrom} date to ${pDateTo}`
  );

  const rqs = await fetch(
    `${url}/dbData?inquery=${pquery}&dfrom=${vDateFrom}&dto=${vDateTo}`
  );
  const data = await rqs.json();

  return data;
};

// export const getCustomerInv = async () => {
//   let rsp = await fetch(`http://192.168.0.159:3001/dbData?inquery=CUSTOMERINV`);

//   let data = await rsp.json();

//   return data;
// };

export const getDailyTrans = async (pyear, pMonth) => {
  let year = pyear || moment().year();
  let month = pMonth || moment().month();
  let rsp = await fetch(`http://192.168.0.159:3001/DailyTrans?year=${year}`);
  let data = await rsp.json();
  return data;
};

export const getFiles = async (pType, pKeyVal) => {
  if (pType.length === 0) return;

  const rsp = await fetch(`${url}/getFiles?type=${pType}&keyVal=${pKeyVal}`);

  let data = await rsp.json();

  return data;
};

export const getDashBoardData = async (pType = null, pdfrom, pdto) => {
  const rsp = await fetch(`${url}/DashBoardData?dfrom=${pdfrom}&dto=${pdto}`);

  let data = await rsp.json();

  return data;
};

export const getItemsData = async (pType, pPartno) => {
  const rsp = await fetch(`${url}/itemData?type=${pType}&partno=${pPartno}`);
  let data = await rsp.json();
  return data;
};

export const aproveCollection = async (pInvs, pUser) => {
  const rsp = await fetch(
    `${url}/aproveCollection?invs=${pInvs}&user=${pUser}`,
    { method: "POST" }
  );
  let data = await rsp.json();
  return data;
};
