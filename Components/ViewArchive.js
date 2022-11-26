import { Space, Table, Tag, Skeleton, Button, Drawer, Modal } from "antd";
import { useEffect, useState } from "react";
import FileViewer from "./filesViewer";

const ViewArchive = (props) => {
  const [vshowFlag, setShowFLag] = useState(false);
  console.log(`View Archive Function`, props.showFlag, vshowFlag);
  const [visible, setVisible] = useState(false);
  const [size, setSize] = useState();

  let vType = props.type;
  let vKeyVal = props.keyVal;

  console.log(`key Valprops`, props.keyVal, vKeyVal);

  const onClose = () => {
    setVisible(false);
    setShowFLag(false);
    props.setShowFlag("", false);
    //vKeyVal = "";

    //    props.setShowFlag();

    //vKeyVal = "";
  };
  //setShowFLag(props.showFlag);

  /*  vshowFlag === false ? setVisible(true) : setVisible(false);
  vshowFlag === false ? setShowFLag(true) : setShowFLag(false);*/
  //setShowFLag(props.showFlag);

  useEffect(() => {
    //setShowFLag(props.showFlag);
    props.showFlag === true ? setVisible(true) : setVisible(false);
    props.showFlag === true ? setShowFLag(true) : setShowFLag(false);
  }, [props.showFlag]);

  if (vshowFlag === false) return;
  /*() => {
    vshowFlag === false ? setVisible(true) : setVisible(false);
    vshowFlag === false ? setShowFLag(true) : setShowFLag(false);
  };*/
  console.log(`visible `, visible);
  console.log(`show Flagg `, vshowFlag);
  return (
    <>
      <Modal
        title={`View files for ${vKeyVal}`}
        centered
        visible={visible}
        width={1550}
        onOk={() => onClose()}
        onCancel={() => onClose()}
      >
        <FileViewer type={vType} keyVal={vKeyVal} showFlag={vshowFlag} />
      </Modal>
    </>
  );
};
export default ViewArchive;
