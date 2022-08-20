import { UploadOutlined, InboxOutlined } from "@ant-design/icons";
import { Button, Upload, message, Popconfirm } from "antd";
import { useState } from "react";
const { Dragger } = Upload;

import React from "react";

const Uploader = (prop) => {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  let vFilesArr = [];
  console.log(`props.type, props.key`);
  console.log(prop.type, prop.keyVal);

  const handleUpload = () => {
    const formData = new FormData();
    console.log(`handle upload file list`);
    console.log(fileList);
    fileList.forEach((file) => {
      console.log(`appdn files`, file);
      formData.append("uploadFiles", file);
    });
    console.log(`start upload 1 `);
    console.log(`form Data `);
    console.log(formData);
    setUploading(true); // You can use any AJAX library you like
    console.log(`start upload 2`);
    fetch(
      `http://localhost:3001/upload?type=${prop.type}&keyVal=${prop.keyVal}`,
      {
        method: "POST",
        body: formData,
        redirect: "follow",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setFileList([]);
        message.success("upload successfully.");
        console.log(`data`, data);
        vFilesArr.length = 0;
      })
      .catch((er) => {
        message.error("upload failed.");
        console.log("upload failed.", er.error);
      })
      .finally((data) => {
        setUploading(false);
        console.log(`finnaly`);
        console.log(data);
        vFilesArr.length = 0;
        setFileList([]);
      });
    console.log(`start upload 3`);
  };

  const props = {
    name: "file",
    listType: "picture-card",

    //action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    multiple: true,
    accept: "image/jpeg,image/gif,image/png,application/pdf,image/x-eps",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status !== "uploading" || info.file.status !== "removed") {
        console.log(`info filelist`, /*info.file,*/ info.fileList);
        console.log(`info file`, /*info.file,*/ info.file);
        console.log(
          `info file status : `,
          typeof info.file.status === "undefined"
            ? "undnd 000100"
            : info.file.status
        );
        console.log(`type of : `, typeof info.file.status);

        if (typeof info.file.status === "undefined") {
          console.log("let upload files");
          console.log(info.fileList);
          console.log("end upload files");
          //info.fileList.forEach((e) => setFileList([...fileList, e]));
          vFilesArr.length = 0;
          vFilesArr = fileList;
          console.log(`vFilesArr before fill`, vFilesArr);
          info.fileList.forEach((e) => vFilesArr.push(e.originFileObj));
          fileList.forEach((e) => console.log(`file list e`, e.originFileObj));

          let arr = vFilesArr;

          //arr.filter((e) => e["thumbUrl"]?.length > 0);
          //console.log(`print arr`, arr);
          console.log(`print fileList`, fileList);
          console.log(`print vFilesArr`, vFilesArr);
          //setFileList([...fileList, arr]);

          console.log(`removing duplicates `, ...new Set(fileList));
          let vList = [...new Set(fileList), info.file];
          setFileList([...new Set(vList)]);
          /*let fileArr = info.fileList.map((e) => e);
          
          fileArr.forEach((e) => {
            setFileList([...fileList, e]);
            console.log(`file list`, fileList);
            console.log(`e : `, e);
          });
          console.log(`show me fileArr : `, fileArr);*/
          //setFileList([...fileList, fileArr]);
        }
        console.log(`show me fileList : `, fileList);

        /*setFileList([
          ...fileList,
          typeof info.file.status === "undefined" ? info.fileList : "",
        ]);*/
        /*}
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }*/
      } else if (info.file.status === "removed") {
        console.log("removvved fileeees");
        message.error(`${info.file.name} file upload removed successfully`);
        const index = fileList.indexOf(info.file);
        const newFileList = fileList.slice();
        newFileList.splice(index, 1);
        setFileList(newFileList);
      }
    },
    progress: {
      strokeColor: {
        "0%": "#108ee9",
        "100%": "#87d068",
      },
      strokeWidth: 3,
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      console.log(`before upload list`, file.fileList);
      console.log(`file`, file);

      //setFileList([...new Set(fileList), file]);
      let vList = [...new Set(fileList), file];
      setFileList([...new Set(vList)]);
      //setFileList([file]);
      return false;
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
      //setFileList([...new Set(fileList), e.dataTransfer.files]);
    },
    ...new Set(fileList),
  };

  return (
    <>
      <Dragger
        {...props}
        //action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        //listType="picture"
        listType="picture-card"
        //defaultFileList={[...fileList]}
        className="upload-list-inline"
        // onDrop={handleUpload}
        //onChange={handleUpload}
        //  multiple="true"
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibit from uploading
          company data or other band files
        </p>
      </Dragger>
      <Popconfirm
        title="Are you sure to Upload the files ?"
        okText="Yes"
        cancelText="No"
      >
        <Button
          type="primary"
          onClick={() => {
            handleUpload();
            setFileList([]);
          }}
          disabled={fileList.length === 0}
          loading={uploading}
          style={{
            marginTop: 16,
          }}
        >
          {uploading ? "Uploading" : "Start Upload"}
        </Button>
      </Popconfirm>
    </>
  );
};

export default Uploader;
