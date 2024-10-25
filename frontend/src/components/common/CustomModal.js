import React from "react";
import { Modal } from "antd";

export const CustomModal = ({
  open,
  handleOk,
  confirmLoading,
  handleCancel,
  title,
  children,
}) => {
  return (
    <Modal
      title={title}
      open={open}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
    >
      {children}
    </Modal>
  );
};
