import {
  Input,
  Select,
  Table,
  Button,
  Form,
  Layout,
  Popconfirm,
  message,
  notification,
  //Option,
  InputNumber,
} from "antd";
import {
  useCallback,
  useEffect,
  useState,
  useRef,
  createContext,
  useContext,
  useReducer,
  useMemo,
} from "react";
import { getCustomerData, getInventoryData } from "../Methods/DataApi";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
const SalesInvoice = (props) => {
  const { Content } = Layout;
  let [dataObj, setDataObj] = useState({});

  let [custData, setCustData] = useState([]);
  let [itemData, setItemData] = useState([]);

  let [recordCount, setRecordCount] = useReducer((n) => n + 1, 0);

  let defaultData = {
    key: "",
    sil_inv_No: "",
    sil_inv_part: "",
    sil_inv_part_name: "",
    sil_inv_qty: "",
    sil_inv_price: "",
  };
  let defaultCols = [
    {
      key: "key",
      label: "SRL",
      require: "",
      list: "",
      placeholder: "",
      disabled: true,
      type: "text",
    },
    {
      key: "sil_inv_part",
      label: "Part No ",
      require: true,
      list: "itemList",
      placeholder: "Enter Part No",
      disabled: false,
      type: "text",
    },
    {
      key: "sil_inv_part_name",
      label: "Part Name ",
      require: false,
      list: "",
      placeholder: "Enter Part Name",
      disabled: true,
      type: "text",
    },
    {
      key: "sil_inv_qty",
      label: "Quantity ",
      require: true,
      list: "",
      placeholder: "Enter Qty",
      disabled: false,
      type: "text",
    },
    {
      key: "sil_inv_price",
      label: "Unit Price ",
      require: true,
      list: "",
      placeholder: "Enter Unit Price",
      disabled: false,
      type: "text",
    },
    {
      key: "sil_inv_total_price",
      label: "Total Price ",
      require: true,
      list: "",
      placeholder: "Enter Unit Price",
      disabled: true,
      type: "text",
    },
  ];
  let [detailTable, setDetailTable] = useState([]);
  let classTr = "border border-gray-600 ";
  let classTd = "bg-white-400 border border-gray-2 00";
  useEffect(() => {
    getCustomerData().then((d) => setCustData(d));
    getInventoryData().then((d) => setItemData(d));
    //setDetailTable([defaultData]);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    control,
    getValues,
    setValue,
    watch,
    trigger,
    setFocus,
  } = useForm({
    defaultValues: {
      SIH_INV_NO: "",
      SIH_INV_DATE: "",

      SIH_CUSTOMER: "",
      SIH_CUST_CUSTOMER: "",

      SIH_NET_INV_AMT: "",
      SIH_INV_BALANCE: "",
    },
    detail: [defaultData],
  });

  const { append, fields, insert } = useFieldArray({
    control,
    name: "detail",
  });

  const getItemName = (objItems = [], partNo) =>
    objItems.find((e) => e.ITEM_PART_NO === partNo)?.ITEM_DESCRIPTION;

  const getCustomerName = (objItems = [], custNo) =>
    objItems.find((e) => e.CUST_CUSTOMER === custNo)?.CUST_NAME;

  const getQtyTotalPrc = (a, b) => a * b;

  console.log(`errors : `, errors);

  //console.log(`addRecord `, addRecord());
  const watchFieldArray = watch("detail");
  const addRecord = () => {
    let isOk = true;

    for (let obj of watchFieldArray) {
      if (obj.sil_inv_part.length === 0) {
        isOk = false;
        setFocus(`detail.${+obj.key - 1}.sil_inv_part`);
        break;
      }
    }
    //isOk ?? setFocus('detail.');

    console.log(`watch detail `, watchFieldArray);
    let sum = watchFieldArray
      .map((e) => +e.sil_inv_total_price)
      ?.reduce((a, b) => a + b, 0);
    setValue("SIH_NET_INV_AMT", sum);
    setValue("SIH_INV_BALANCE", sum);

    isOk && append(defaultData);
  };

  const submitForm = (data) => console.log(`data  ${data}`);

  let clsInput =
    "bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm";
  let clsInputDetail =
    "bg-white  border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm";
  let clsLabel = "text-base	text-start	text-slate-400	";
  return (
    <Layout>
      <Content
        style={{
          padding: "4rem",
          paddingLeft: "30rem",
          margin: 0,
          minHeight: 280,
          backgroundColor: "transparent",
          //height: "60rem",
        }}
      >
        <form
          onSubmit={handleSubmit((data) => setDataObj(data))}
          //className="place-content-center"
        >
          {/* <form
          onSubmit={(e) => {
            //handleSubmit(submitForm);
            handleSubmit((data) => console.log(data));
            e.preventDefault();
          }}
        > */}
          <div>
            <div className="InvGrid   ">
              <label htmlFor="SIH_INV_NO" className={clsLabel}>
                Invoice No
              </label>

              <input
                id="SIH_INV_NO"
                disabled
                className={clsInput}
                {...register}
              />
              {errors?.SIH_INV_NO && errors?.SIH_INV_NO.message}
              <label htmlFor="SIH_INV_DATE" className={clsLabel}>
                Invoice Date
              </label>

              <input
                id="SIH_INV_DATE"
                type="date"
                className={clsInput}
                {...register("SIH_INV_DATE", {
                  valueIsDate: true,
                  message: "Only Date Allowed !",
                })}
              />
              {errors?.SIH_INV_DATE && errors?.SIH_INV_DATE.message}
              <label htmlFor="SIH_CUSTOMER" className={clsLabel}>
                Customer
              </label>

              <input
                id="SIH_CUSTOMER"
                name="SIH_CUSTOMER"
                className={clsInput}
                list="custList"
                {...register("SIH_CUSTOMER", {
                  minLength: {
                    value: 3,
                    message: "Value should be more than 3 digits !",
                  },
                  required: { value: true, message: "enter customer " },
                })}
                onKeyDown={(e) =>
                  setValue(
                    "SIH_CUST_CUSTOMER",
                    getCustomerName(custData, e.target.value)
                  )
                }
              />
              {errors?.SIH_CUSTOMER && errors?.SIH_CUSTOMER.message}
              <label htmlFor="SIH_CUST_CUSTOMER" className={clsLabel}>
                Customer Name
              </label>

              <input
                id="SIH_CUST_CUSTOMER"
                className={clsInput}
                disabled
                {...register("SIH_CUST_CUSTOMER")}
              />
              {errors?.SIH_CUST_CUSTOMER && errors?.SIH_CUST_CUSTOMER.message}
              <label htmlFor="SIH_NET_INV_AMT" className={clsLabel}>
                Net Amount
              </label>

              <input
                id="SIH_NET_INV_AMT"
                className={clsInput}
                disabled
                {...register(
                  "SIH_NET_INV_AMT",

                  {
                    validate: (value) =>
                      isNaN(value) === false || "Only Number pnok",
                    //message: "Only Number Allowed !",
                  }
                )}
              />
              {errors?.SIH_NET_INV_AMT && errors?.SIH_NET_INV_AMT.message}
              <label htmlFor="SIH_INV_BALANCE" className={clsLabel}>
                Balance
              </label>

              <input
                id="SIH_INV_BALANCE"
                disabled
                className={clsInput}
                {...register("SIH_INV_BALANCE", {
                  validate: (value) =>
                    isNaN(value) === false || "Only Number pnok",
                  //message: "Only Number Allowed !",
                })}
              />
              {errors?.SIH_INV_BALANCE && errors?.SIH_INV_BALANCE.message}
              <br></br>
              <datalist id="custList">
                {custData.map((e) => (
                  <option key={e.CUST_CUSTOMER} value={e.CUST_CUSTOMER}>
                    {e.CUST_CUSTOMER + " - " + e.CUST_NAME}
                  </option>
                ))}
              </datalist>
              <div>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    addRecord(defaultData);
                    //                    append(defaultData);
                  }}
                >
                  Add Record
                </Button>
              </div>
              <br />
            </div>
            <div className=" mt-16">
              <table
                style={{ width: "20rem", borderColor: "white" }}
                className="table-auto "
              >
                <tr className="text-white	">
                  <th className="bg-blue-400 rounded-l-lg">SRL</th>
                  <th className="bg-blue-400">PART NO</th>
                  <th className="bg-blue-400">Part Name</th>
                  <th className="bg-blue-400">QTY</th>

                  <th className="bg-blue-400">PRICE</th>
                  <th className="bg-blue-400 rounded-r-lg">TOTAL PRICE</th>
                </tr>
                <tbody style={{ border: "1px solid black" }}>
                  {/* {detailTable.map((r) => ( */}
                  {fields.map((item, index) => (
                    <tr
                      key={item.id + " " + index}
                      style={{ border: "1px solid black" }}
                    >
                      {defaultCols.map((e, i) => (
                        <td key={"d" + i} className={classTd}>
                          <input
                            type={e.type}
                            value={e.key === "key" ? index + 1 : undefined}
                            // disabled={e.disabled}
                            onSelect={() => {
                              if (e.key === "sil_inv_part") {
                                setValue(
                                  `detail.${index}.sil_inv_part_name`,
                                  getItemName(
                                    itemData,
                                    getValues(`detail.${index}.${e.key}`)
                                  )
                                );
                              }
                            }}
                            onKeyDown={(bt) => {
                              if (
                                e.key === "sil_inv_qty" ||
                                e.key === "sil_inv_price"
                              ) {
                                let qty =
                                  getValues(`detail.${index}.sil_inv_qty`) || 0;
                                let untPrc =
                                  getValues(`detail.${index}.sil_inv_price`) ||
                                  0;
                                setValue(
                                  `detail.${index}.sil_inv_total_price`,
                                  getQtyTotalPrc(qty, untPrc)
                                );
                              }
                            }}
                            //disabled={false}
                            placeholder={e.placeholder}
                            list={e.list}
                            className={clsInputDetail}
                            //requierd={e.require}
                            key={item.id}
                            /*id={`detail[${e.key + " " + index}]`}
                        name={`detail[${e.key + " " + index}]`}*/
                            //name={e.key}
                            {...register(`detail.${index}.${e.key}`, {
                              requierd: {
                                value: true,
                                message: "must be enterd",
                              },
                              maxLength: {
                                value: 20,
                                message: "length is low",
                              },
                            })}
                            disabled={e.disabled}

                            //id={e.key}
                            //ref={register}
                            /*{...register(e.key, {
                          requierd: { value: true, message: "must be enterd" },
                          maxLength: { value: 2, message: "length is low" },
                        })}*/
                          />
                          {/* {<p>{errors[e.key]?.message}</p>} */}

                          {/* <Controller
                          render={({ field }) => <input {...field} />}
                          name={`detail.${index}.${e.key}`}
                          control={control}
                        /> */}
                        </td>
                        //
                      ))}{" "}
                    </tr>
                  ))}
                  <datalist id="itemList">
                    {itemData?.map((e) => (
                      <option key={e.ITEM_PART_NO} value={e.ITEM_PART_NO}>
                        {e.ITEM_PART_NO + " - " + e.ITEM_DESCRIPTION}
                      </option>
                    ))}
                  </datalist>
                </tbody>
              </table>
            </div>
          </div>

          <br />
          <button
            type="submit"
            id="submit"
            className="bg-red-300  rounded-full  
                       text-sm font-semibold
                       w-48
                       hover:bg-blue-300 hover:text-white"
          />
          {<div> {JSON.stringify(dataObj)}</div>}
        </form>
      </Content>
    </Layout>
  );
};

export default SalesInvoice;
