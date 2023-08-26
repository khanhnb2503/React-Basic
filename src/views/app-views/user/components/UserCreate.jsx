import PropTypes from "prop-types";
import UserForm from "./UserForm";
import { useTranslation } from "../../../../hooks/useTranslation";
import { Form, Modal } from "antd";

function UserCreate(props) {
  const { t } = useTranslation();
  const { show, onHide, callback } = props;
  const [form] = Form.useForm();
  const onClose = () => {
    onHide();
    form.resetFields();
  };
  return (
    <Modal
      title={t("Create {name}", { name: t("User") })}
      onCancel={onClose}
      visible={show}
      footer={false}
    >
      <UserForm callback={callback} form={form} onHideModal={onClose} />
    </Modal>
  );
}

UserCreate.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  callback: PropTypes.func.isRequired,
};

export default UserCreate;
