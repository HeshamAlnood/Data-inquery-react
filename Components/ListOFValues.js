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

const ListOfValues = (props) => {
  let dataCols = props.data;

  const getColLabel = (plabel) => {
    return InfoData[plabel];
  };

  return (
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
            e.target.parentElement.querySelector("img").src.substring(0, -3)
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
                          onClick={() => showPreview(item.src, item.fileExt)}
                          className={"hover:scale-125"}
                        />
                      </Table.Cell>
                    );
                  } else if (columnKey === "fileCreateDate") {
                    return (
                      <Table.Cell
                        onClick={() => showPreview(item.src, item.fileExt)}
                      >
                        {item[columnKey] &&
                          formatDate(new Date(item[columnKey]), "dd/mm/yyyy")}
                      </Table.Cell>
                    );
                  } else if (columnKey === "fileExt") {
                    return (
                      <Table.Cell
                        onClick={() => showPreview(item.src, item.fileExt)}
                      >
                        {getExtIcon(item[columnKey])}
                      </Table.Cell>
                    );
                  } else {
                    return (
                      <Table.Cell
                        css={{
                          width: "10px",
                          minWidth: "2px" /* height: "calc($space$14 * 10)" }*/,
                        }}
                        onClick={() => showPreview(item.src, item.fileExt)}
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
  );
};
