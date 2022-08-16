import { Dropdown, message, Checkbox, Row, Col } from "antd";

export const DropdownL = (props) => {
  let vMenus = props.menu;

  let gridChickBox = vMenus.map((e) => {
    <Col span={3}>
      <Checkbox value={e}>e</Checkbox>
    </Col>;
  });

  const onChange = (checkedValues) => {
    console.log("checked = ", checkedValues);
    console.log(`props`, props);
    props.chng(checkedValues);

    //props.chng(checkedValues);
  };

  const handleButtonClick = (e) => {
    //message.info("Click on left button.");
    console.log("click left button", e);
    console.log(vMenus);
  };

  return (
    <Dropdown.Button
      onClick={handleButtonClick}
      autoFocus={true}
      overlayStyle={{
        backgroundColor: "white",
        //borderRadius: "4%",
        width: "30%",
        height: "7rem",
      }}
      placement="topLeft"
      trigger={["click"]}
      overlay={
        /*<Checkbox.Group
          options={vMenus}
          defaultValue={vMenus}
          onChange={onChange}
        />*/

        <Checkbox.Group
          options={vMenus}
          onChange={onChange}
          defaultValue={vMenus}
          style={{
            width: "80%",
            height: "3rem",
            overflow: "visible",
            justifyContent: "flex-start",
          }}
        >
          <Row justify="space-between">{gridChickBox}</Row>
        </Checkbox.Group>
      }
    >
      Choose Columns
    </Dropdown.Button>
  );
};
