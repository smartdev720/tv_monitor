import React from "react";
import { Modal } from "antd";

export const CustomModal = ({
  open,
  handleOk,
  confirmLoading,
  handleCancel,
  title,
  Children,
}) => {
  return (
    <Modal
      title="Title"
      open={open}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
    >
      <Children />
    </Modal>
  );
};
