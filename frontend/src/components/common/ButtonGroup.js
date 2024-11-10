import React, { useState } from "react";
import { Button, Popconfirm } from "antd";
import { DeleteOutlined, EditOutlined, SendOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

export const ButtonGroup = ({
  handleEditClick,
  popLoading,
  onDeleteConfirmClick,
  open,
  onDeleteClick,
  onCancel,
  onSave,
  isDelete,
  isApply,
}) => {
  const { t } = useTranslation();
  return (
    <div style={{ textAlign: "right", marginTop: 20 }}>
      <Button
        style={{ marginRight: 20 }}
        color="default"
        variant="solid"
        onClick={handleEditClick}
      >
        {t("edit")} <EditOutlined style={{ marginLeft: 8 }} />
      </Button>
      <Popconfirm
        open={open}
        onCancel={onCancel}
        title="Do you really want to remove the selected item?"
        onConfirm={onDeleteConfirmClick}
        okButtonProps={{
          loading: popLoading,
        }}
      >
        {!isDelete && (
          <Button
            style={{ marginRight: 20 }}
            color="danger"
            variant="solid"
            onClick={onDeleteClick}
          >
            {t("delete")} <DeleteOutlined style={{ marginLeft: 8 }} />
          </Button>
        )}
      </Popconfirm>
      <Button
        style={{ marginRight: 20 }}
        color="primary"
        variant="solid"
        onClick={onSave}
      >
        {isApply ? `${t("apply")}` : `${t("save")}`}{" "}
        <SendOutlined style={{ marginLeft: 8 }} />
      </Button>
    </div>
  );
};
