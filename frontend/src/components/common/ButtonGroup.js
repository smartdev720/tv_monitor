import React, { useState } from "react";
import { Button, Popconfirm } from "antd";
import { DeleteOutlined, EditOutlined, SendOutlined } from "@ant-design/icons";

export const ButtonGroup = ({
  handleEditClick,
  popLoading,
  onDeleteConfirmClick,
  open,
  onDeleteClick,
  onCancel,
  onSave,
}) => {
  return (
    <div style={{ textAlign: "right", marginTop: 20 }}>
      <Button
        style={{ marginRight: 20 }}
        color="default"
        variant="solid"
        onClick={handleEditClick}
      >
        Edit <EditOutlined style={{ marginLeft: 8 }} />
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
        <Button
          style={{ marginRight: 20 }}
          color="danger"
          variant="solid"
          onClick={onDeleteClick}
        >
          Delete <DeleteOutlined style={{ marginLeft: 8 }} />
        </Button>
      </Popconfirm>
      <Button
        style={{ marginRight: 20 }}
        color="primary"
        variant="solid"
        onClick={onSave}
      >
        Save <SendOutlined style={{ marginLeft: 8 }} />
      </Button>
    </div>
  );
};
