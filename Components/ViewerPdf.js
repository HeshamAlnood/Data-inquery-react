import { Document, Page, pdfjs, View } from "react-pdf";
//import { PDFViewer } from "@react-pdf/renderer";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
import { Button } from "antd";
import { EyeOutlined, DownloadOutlined } from "@ant-design/icons";

import { useEffect, useState, useRef } from "react";

function ViewerPdf(props) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [currSrc, setCurrSrc] = useState("");

  console.log(`Viewer Pdf`, props.src);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  console.log(`Viewer Pdf  1`, props.src);

  const goToPrevPage = () =>
    setPageNumber(pageNumber - 1 <= 1 ? 1 : pageNumber - 1);
  console.log(`Viewer Pdf  2`, props.src);

  const goToNextPage = () =>
    setPageNumber(pageNumber + 1 >= numPages ? numPages : pageNumber + 1);
  console.log(`Viewer Pdf  3`, props.src);

  const goToFirstPage = () => setPageNumber(1);
  const goToLastPage = () => setPageNumber(numPages);

  console.log(`Viewer Pdf  3`, props.src);

  useEffect(() => {
    setCurrSrc(props.src);
  }, [props.src, props.previewFlag]);

  console.log(`preview Flag `, props.previewFlag);
  console.log(`CurrSrc `, props.src);

  //if (props.previewFlag === false) setCurrSrc("");
  //  props.previewFlag === false ? setCurrSrc("") : "";

  return (
    <div>
      <nav className="flex justify-end">
        <Button
          //type="primary"
          shape="round"
          icon={<DownloadOutlined />}
          size={"large"}
          css={{ color: "white" }}
          className="flex justify-end"
        >
          <a href={currSrc} download={props.fileName}>
            Download
          </a>
        </Button>
      </nav>

      <Document
        //file="../git-cheat-sheet-education.pdf"
        file={/*props.previewFlag &&*/ currSrc}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page pageNumber={pageNumber} />
        <nav className="flex justify-center">
          <Button
            //   type="primary"
            // ghost
            shape="round"
            size={"large"}
            onClick={goToFirstPage}
          >
            First Page
          </Button>
          <Button
            //  type="primary"
            //ghost
            shape="round"
            size={"large"}
            onClick={goToPrevPage}
          >
            Prev
          </Button>
          <Button
            //type="primary"
            //ghost
            shape="round"
            size={"large"}
            onClick={goToNextPage}
          >
            Next
          </Button>
          <Button
            // type="primary"
            //ghost
            shape="round"
            size={"large"}
            onClick={goToLastPage}
          >
            Last Page
          </Button>
        </nav>
        <span className="flex justify-center">
          Page {pageNumber} of {numPages}
        </span>
      </Document>
    </div>
  );
}

export default ViewerPdf;
