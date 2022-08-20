import { Space, Table, Tag, Skeleton, Button, Drawer } from "antd";
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
      <Drawer
        title={`${vType} - ${vKeyVal} Files `}
        placement="right"
        size={"large"}
        width={"50%"}
        onClose={onClose}
        visible={visible}
        extra={
          <Space>
            <Button onClick={onClose}>Back</Button>
            <Button type="primary" onClick={onClose}>
              OK
            </Button>
          </Space>
        }
      >
        <FileViewer type={vType} keyVal={vKeyVal} showFlag={vshowFlag} />
      </Drawer>
    </>
  );
};
export default ViewArchive;
