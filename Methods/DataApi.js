export const getCustomerData = async () => {
  let rsp = await fetch(`http://192.168.0.159:3001/dbData?inquery=CUSTOMER`);

  let data = await rsp.json();
  console.log(data);

  return data;
};

export const getVendorData = async () => {
  let rsp = await fetch(`http://192.168.0.159:3001/dbData?inquery=VENDOR`);

  let data = await rsp.json();

  return data;
};

export const getInventoryData = async () => {
  let rsp = await fetch(`http://192.168.0.159:3001/dbData?inquery=INVENTORY`);

  let data = await rsp.json();

  return data;
};

export const getPurchsaeData = async () => {
  let rsp = await fetch(`http://192.168.0.159:3001/dbData?inquery=PURCHASING`);

  let data = await rsp.json();

  return data;
};

export const getInvoicingData = async () => {
  let rsp = await fetch(`http://192.168.0.159:3001/dbData?inquery=INVOICING`);

  let data = await rsp.json();

  return data;
};
