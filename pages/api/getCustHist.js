import { getCustHist } from "../../Methods/DataApi";

const handler = async (rqs, res) => {
  let pCust = rqs.query.customer;
  let pDateFrom = rqs.query.dfrom;
  let pDateTo = rqs.query.dto;
  console.log(`from Handerl `, pDateFrom, pDateTo);

  let data = await getCustHist(pCust, pDateFrom, pDateTo);

  res.status(200).send(data);
};
export default handler;
