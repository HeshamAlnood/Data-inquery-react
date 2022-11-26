import { useRouter } from "next/router";
import {
  requestData,
  getDailyTrans,
  getFiles,
  getDashBoardData,
  getItemsData,
} from "../../Methods/DataApi";
import moment from "moment";

const handler = async (rqs, res) => {
  const querys = rqs.query.funcName;

  let inquery = rqs.query.inquery;
  let dfrom = rqs.query.dfrom;
  let dto = rqs.query.dto;
  let year = rqs.query.year;
  let month = rqs.query.month;
  let type = rqs.query.type;
  let keyVal = rqs.query.keyVal || "";

  let funcs = {
    requestData,
    getDailyTrans,
    getFiles,
    getDashBoardData,
    getItemsData,
  };

  //  return funcs[querys](2016);

  //return { inquery: inquery, funcName: funcName };

  //res.status(200).json({ inquery: rqs.query.inquery });
  let data = await funcs[querys](
    year || inquery || type,
    month || dfrom || keyVal,
    dto
  );

  console.log(
    ` print ${inquery} inquery ${inquery} month ${month} year ${year} dfrom ${dfrom} ${dto}`
  );

  res.status(200).send(data);
};

export default handler;
