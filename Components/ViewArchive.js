import { Space, Table, Tag, Skeleton, Button, Drawer } from "antd";
import { useEffect, useState } from "react";
import FileViewer from "./filesViewer";

const ViewArchive = (props) => {
  let [vshowFlag, setShowFLag] = useState(props.showFlag);
  console.log(`View Archive Function`, props.showFlag);
  const [visible, setVisible] = useState(false);
  const [size, setSize] = useState();
  let vType = props.type;
  let vKeyVal = props.keyVal;

  console.log(`key Valprops`, props.keyVal, vKeyVal);

  const onClose = () => {
    setVisible(false);
    props.setShowFlag();
  };

  useEffect(() => {
    vshowFlag === false ? setVisible(true) : setVisible(false);
    vshowFlag === false ? setShowFLag(true) : setShowFLag(false);
  }, [props.showFlag]);

  () => {
    vshowFlag === false ? setVisible(true) : setVisible(false);
    vshowFlag === false ? setShowFLag(true) : setShowFLag(false);
  };

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
        <FileViewer type={vType} keyVal={vKeyVal} />
      </Drawer>
    </>
  );
};
export default ViewArchive;
