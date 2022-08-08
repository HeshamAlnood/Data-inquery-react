import { UploadOutlined, InboxOutlined } from "@ant-design/icons";
import { Button, Upload, message } from "antd";
import { useState } from "react";
const { Dragger } = Upload;

import React from "react";

const Uploader = (prop) => {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  console.log(`props.type, props.key`);
  console.log(prop.type, prop.keyVal);

  const handleUpload = () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("uploadFile", file);
    });
    console.log(`start upload 1 `);
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
      })
      .catch((er) => {
        message.error("upload failed.");
        console.log("upload failed.", er.error);
      })
      .finally((data) => {
        setUploading(false);
        console.log(`finnaly`);
        console.log(data);
      });
    console.log(`start upload 3`);
  };

  const props = {
    name: "file",
    //action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    multiple: true,
    accept: "image/jpeg,image/gif,image/png,application/pdf,image/x-eps",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
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
      console.log(`file`, file);
      setFileList([...fileList, file]);
      return false;
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
      setFileList([...fileList, e.dataTransfer.files]);
    },
    fileList,
  };

  return (
    <>
      <Dragger
        {...props}
        //action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        listType="picture"
        //defaultFileList={[...fileList]}
        className="upload-list-inline"
        // onDrop={handleUpload}
        //onChange={handleUpload}
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
    </>
  );
};

export default Uploader;
