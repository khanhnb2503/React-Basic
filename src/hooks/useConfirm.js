import React from "react";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

export default function Confirm(content, onConfirm, t) {
  Modal.confirm({
    title: t("Confirm to delete"),
    icon: <ExclamationCircleOutlined />,
    content,
    okText: t("Confirm"),
    cancelText: t("Cancel"),
    onOk: onConfirm,
    keyboard: true,
    maskClosable: true,
  });
}
