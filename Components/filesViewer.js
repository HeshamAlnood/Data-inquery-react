import {
  Container,
  Card,
  Loading,
  Button,
  Grid,
  Table,
  useAsyncList,
  useCollator,
} from "@nextui-org/react";

import {
  EyeOutlined,
  DownloadOutlined,
  ZoomInOutlined,
} from "@ant-design/icons";
import { Image, Divider, Col, Row, Empty, Space } from "antd";
import { useEffect, useState } from "react";

import { formatDate } from "../Methods/arreayFn";
import ViewerPdf from "./ViewerPdf";

const FileViewer = (props) => {
  let [dataElm, setDataElm] = useState([{ key: 1, label: 1 }]);
  let [dataRaw, setDataRaw] = useState(dataElm);
  let [dataCols, setDataCols] = useState([{ key: 1, label: 1 }]);
  let [vPage, setPage] = useState(15);
  let [colKey, setColKey] = useState(["2"]);
  let [isLoading, setIsLoading] = useState(true);
  let [noData, setNoDate] = useState(false);
  let [currSrc, setCurrSrc] = useState("");
  let [currSrcExt, setCurrSrcExt] = useState("");
  let [currFileName, setCurrFileName] = useState("");
  const [isPreviewVisible, setPreviewVisible] = useState(false);

  let [previewFlag, setPreviewFlag] = useState(false);
  const [columnKeys, setColumnKeys] = useState(
    colKey.map((column) => column.key)
  );
  const columns = dataCols.filter((column) =>
    dataCols.some((key) => key === column.key)
  );

  console.log(`try Format Date`, formatDate(new Date(), "dd/mm/yyyy"));
  let vType = props.type;
  let vKeyVal = props.keyVal;

  //  console.log(`key Valprops`, props.keyVal, vKeyVal);
  const InfoData = {
    fileName: "Name",
    fileExt: "Ext",
    fileSize: "Size",
    fileCreateDate: "Create Date",
    src: "",
  };
  const getColLabel = (plabel) => {
    return InfoData[plabel];
  };

  const getExtIcon = (pExt) => {
    let vWidth = "30";
    if (pExt === ".pdf" || pExt === ".PDF") {
      return <img src="/icons/pdf.png" width={vWidth}></img>;
    } else if (
      pExt === ".jpg" ||
      pExt === ".JPG" ||
      pExt === ".JPEG" ||
      pExt === ".jpeg"
    ) {
      return <img src="/icons/jpg.png" width={vWidth}></img>;
    } else return pExt;
  };

  const getPreview = (pcurrSrc, pcurrSrcExt, fileName = "") => {
    console.log(`from show Preview `, pcurrSrc, pcurrSrcExt);
    //setPreviewFlag(true);
    if (pcurrSrcExt.toLocaleUpperCase() === ".PDF") {
      /*return (
        <ViewerPdf
          src={pcurrSrc}
          fileName={fileName}
          previewFlag={props.previewFlag}
        />
      );*/
      return (
        /*(
        <object data={pcurrSrc} type="application/pdf">
          <iframe
            src={pcurrSrc}
            
            height={1000}
            frameborder="0"
            scrolling="no"
          ></iframe>
        </object>
      );*/ <object height={1000} data={pcurrSrc} type="application/pdf">
          <embed src={pcurrSrc} type="application/pdf" />
        </object>
      );
    }

    if (pcurrSrcExt.toLocaleUpperCase() === ".JPG" || ".JPEG") {
      return (
        <Image
          src={pcurrSrc}
          rootClassName="align-top"
          preview={{
            getContainer: true,
            //width: "50",

            visible: isPreviewVisible,
            maskClassName: "customize-mask",

            onVisibleChange: (visible, prevVisible) =>
              setPreviewVisible(visible),
          }}
        />
      );
    } else {
      //setPreviewFlag(false);
      return (
        /*<iframe src={pcurrSrc} width="100%" height="565px" frameborder="0">
          {" "}
        </iframe>*/
        <iframe
          src={`https://view.officeapps.live.com/op/embed.aspx?src=${pcurrSrc}`}
          width="100%"
          height="565px"
          frameBorder="0"
        >
          {" "}
        </iframe>
      );
    }
  };

  const showPreview = (pcurrSrc, pcurrSrcExt, fileName) => {
    console.log(`show PReview `, pcurrSrc, pcurrSrcExt);
    setCurrSrc(pcurrSrc);
    setCurrSrcExt(pcurrSrcExt);
    setPreviewFlag(true);
    setCurrFileName(fileName);
  };

  const closePreview = () => {
    setPreviewFlag(false);
  };

  //let [list, setList] = useState("");

  const disableCursor = (flag = true) => {
    flag === true
      ? document.body.classList.add("disabledbutton")
      : document.body.classList.remove("disabledbutton");
  };

  useEffect(() => {
    /*get data*/

    setIsLoading(true);

    fetch(`http://192.168.0.159:3001/getFiles?type=${vType}&keyVal=${vKeyVal}`)
      .then((res) => res.json())
      .then((data) => {
        let cols = data && Object.keys(data[0]);
        let colsArr = [];
        console.log(`file Info`, data);
        console.log(`data length`, data.length);

        cols.forEach((e, i) => {
          let ob = { key: e, label: e };

          colsArr.push(ob);
        });

        let listUnqique = data.map((e) => e["fileName"]);

        setDataElm(data);
        setDataRaw(data);
        setColKey(colsArr);

        setDataCols(colsArr);
        setIsLoading(false);
        setNoDate(false);

        setPage(Math.trunc(data.length / 20));

        console.log(dataElm);

        console.log(`list`);
        console.log(colsArr[0]);

        // list = useAsyncList({ data, sort });

        console.log("print map e colms");
        let contr = 0;
      })

      .catch((e) => {
        console.log(`Error in fetch ${e}`);
        setIsLoading(false);
        setNoDate(true);
      });
  }, [props.type, props.keyVal]);

  useEffect(() => {
    props.showFlag === false ? setCurrSrc("") : "";
  }, [props.showFlag]);

  if (isLoading === true) {
    return (
      <div className="flex justify-center">
        <div className="article ">
          <Loading size="xl">Loading ...</Loading>
        </div>
      </div>
    );
  }

  if (noData === true) {
    return <Empty description={<span>No Files been uploaded ..</span>} />;
  }
  return (
    /*  <div /*className="md:container md:mx-auto">
      <div className="article bg-slate-50">*/
    //<div className="md:container md:mx-auto">
    <Row>
      <Space size={20} align="start">
        <Col>
          <Card
            isHoverable
            variant="bordered"
            css={{
              mw: "100rem",
              width: "40rem",
              height: "65rem",
              backgroundColor: "rgb(203 213 225)",
            }}
          >
            <Card.Body
              css={{
                mw: "100rem",
                width: "40rem",
                height: "65rem",
                backgroundColor: "rgb(248 250 252)",
              }}
            >
              {previewFlag && getPreview(currSrc, currSrcExt, currFileName)}
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Divider type="vertical" />
          <div style={{ width: "32.8rem" }}>
            <Table
              id="dataTable"
              striped
              lined={true}
              bordered={false}
              aria-label="Example static striped collection table"
              hoverable="true"
              borderWeight="black"
              lineWeight="light"
              fixed={true}
              onSelectionChange={(keys) => console.log(`keyyys`, keys)}
              onClick={(e) => {
                console.log(
                  `e .src `,
                  //e.target,
                  e.target.parentElement
                );
                console.log(
                  e.target.parentElement
                    .querySelector("img")
                    .src.substring(0, -3)
                );

                /*console.log(
                  document
                    .getElementById("dataTable")
                    .getElementsByClassName("hover:scale-125")
                    .getAttribute("currentSrc")
                )*/
              }}
              //selectionMode="single"

              //sortDescriptor={list.sortDescriptor}
              //        onSortChange={list.sort}

              css={{
                height: "6",
                width: "100%",
                //minWidth: "50%",
              }} /*css={{
          height: "auto",
          minWidth: "100%",
          width: "100%",
          zIndex: 1,
        }}*/
            >
              <Table.Header columns={dataCols}>
                {(column) => (
                  <Table.Column
                    key={column.key}
                    align="start"
                    className="bg-sky-700 text-slate-50 text-base"
                    isRowHeader
                    //allowsSorting

                    css={{
                      width: "10px",
                      minWidth: "30px" /* height: "calc($space$14 * 10)" }*/,
                    }}
                  >
                    {""}
                    {getColLabel(column.label)}
                  </Table.Column>
                )}
              </Table.Header>
              <Table.Body items={dataElm}>
                {(item) => (
                  <Table.Row
                    key={colKey}
                    css={{
                      "&:hover": {
                        background: "$yellow100",
                        color: "$blue400",
                      },
                    }}
                  >
                    {
                      /*(columnKey) => <Table.Cell>{item[columnKey]}</Table.Cell>*/
                      (columnKey) => {
                        if (columnKey === "src") {
                          return (
                            <Table.Cell>
                              <Image
                                src={item[columnKey]}
                                width={50}
                                fallback="/icons/file.png"
                                preview={false}
                                onClick={() =>
                                  showPreview(item.src, item.fileExt)
                                }
                                className={"hover:scale-125"}
                              />
                            </Table.Cell>
                          );
                        } else if (columnKey === "fileCreateDate") {
                          return (
                            <Table.Cell
                              onClick={() =>
                                showPreview(item.src, item.fileExt)
                              }
                            >
                              {item[columnKey] &&
                                formatDate(
                                  new Date(item[columnKey]),
                                  "dd/mm/yyyy"
                                )}
                            </Table.Cell>
                          );
                        } else if (columnKey === "fileExt") {
                          return (
                            <Table.Cell
                              onClick={() =>
                                showPreview(item.src, item.fileExt)
                              }
                            >
                              {getExtIcon(item[columnKey])}
                            </Table.Cell>
                          );
                        } else {
                          return (
                            <Table.Cell
                              css={{
                                width: "10px",
                                minWidth:
                                  "2px" /* height: "calc($space$14 * 10)" }*/,
                              }}
                              onClick={() =>
                                showPreview(item.src, item.fileExt)
                              }
                            >
                              {item[columnKey]}
                            </Table.Cell>
                          );
                        }
                      }
                    }
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </div>
        </Col>
      </Space>
    </Row>
  );
};
export default FileViewer;
