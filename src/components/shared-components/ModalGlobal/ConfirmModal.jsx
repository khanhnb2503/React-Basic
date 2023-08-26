import React from "react";
import PropTypes from "prop-types";
import { Modal } from "antd";
import { useTranslation } from "../../../hooks/useTranslation";

function ConfirmModal(props) {
  const { t } = useTranslation();
  const { show, onHide, onConfirm, content, confirming } = props;
  return (
    <Modal
      title={t("Confirm to delete")}
      visible={show}
      onCancel={onHide}
      onOk={onConfirm}
      okText={t("Confirm")}
      confirmLoading={confirming}
    >
      {content}
    </Modal>
  );
}

ConfirmModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  content: PropTypes.string.isRequired,
  confirming: PropTypes.bool,
};

export default ConfirmModal;
