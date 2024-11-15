import React from "react";
import { Button, Modal } from "antd";
import {
  SendOutlined,
  DeleteOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";

export const CustomModal = ({
  open,
  handleOk,
  confirmLoading,
  handleCancel,
  title,
  children,
  isSave,
  isDelete,
  handleDelete,
}) => {
  const { t } = useTranslation();
  return (
    <Modal
      title={title}
      open={open}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      footer={[
        <Button type="default" onClick={handleCancel} style={{ marginTop: 10 }}>
          {t("cancel")}
          <LogoutOutlined style={{ marginLeft: 8 }} />
        </Button>,
        isDelete && (
          <Button variant="solid" color="danger" onClick={handleDelete}>
            {t("delete")}
            <DeleteOutlined style={{ marginLeft: 8 }} />
          </Button>
        ),
        <Button key="ok" type="primary" onClick={handleOk}>
          {isSave ? `${t("save")}` : "OK"}
          <SendOutlined style={{ marginLeft: 8 }} />
        </Button>,
      ]}
    >
      {children}
    </Modal>
  );
};
