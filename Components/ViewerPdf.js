import { Document, Page, pdfjs, View } from "react-pdf";
//import { PDFViewer } from "@react-pdf/renderer";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

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

  useEffect(() => {
    setCurrSrc(props.src);
  }, [props.src]);

  return (
    <div>
      <nav>
        <button onClick={goToPrevPage}>Prev</button>
        <button onClick={goToNextPage}>Next</button>
        <p>
          Page {pageNumber} of {numPages}
        </p>
      </nav>

      <Document
        //file="../git-cheat-sheet-education.pdf"
        file={currSrc}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page pageNumber={pageNumber} />
      </Document>
      <Document
        file="/uploads/Customer/S-0002/Export.pdf"
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page pageNumber={pageNumber} />
      </Document>
    </div>
  );
}

export default ViewerPdf;
