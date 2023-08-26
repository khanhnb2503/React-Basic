import PropTypes from "prop-types";
import { useTranslation } from "../../../../hooks/useTranslation";
import { Form, Input, Modal, notification } from "antd";
import UserService from "../../../../services/UserService";
import React, { useEffect, useState } from "react";
import { USER_MAIL_ADDON } from "../../../../constants/app";

function MentorForm(props) {
  const { t } = useTranslation();
  const { show, onHide, callback, id } = props;
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();
  const onClose = () => {
    onHide();
    form.resetFields();
  };
  const handleSubmit = (values) => {
    console.log(form,"form")
    setSubmitting(true);
    const formValues = { ...values, email: values.email.toLowerCase() };
    if (id) {
      UserService.updateMentor(id, formValues).then((res) => {
        if (res.status) {
          notification.info({
            message: t("Successfully"),
            description: t("Updated successfully"),
            placement: "topRight",
          });
          callback();
          onClose();
        }
        setSubmitting(false);
      });
    } else {
      UserService.createMentor({
        ...formValues,
        role: "mentor",
      }).then((res) => {
        if (res.status) {
          notification.info({
            message: t("Successfully"),
            description: t("Created successfully"),
            placement: "topRight",
          });
          callback();
          onClose();
        }
        setSubmitting(false);
      });
    }
  };
  const loadMentor = () => {
    if (id) {
      UserService.detail(id).then((res) => {
        if (res.status && res.data) {
          form.setFieldsValue(res.data);
        }
      });
    }
  };
  useEffect(() => {
    loadMentor();
    // eslint-disable-next-line
  }, [id]);
  return (
    <Modal
      title={
        id
          ? t("Update {name}", { name: t("Mentor") })
          : t("Create {name}", { name: t("Mentor") })
      }
      onCancel={onClose}
      visible={show}
      confirmLoading={submitting}
      okText={id ? t("Update") : t("Create")}
      onOk={form.submit}
    >
      <Form
        onFinish={handleSubmit}
        form={form}
        translate="yes"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        autoComplete="off"
        size="small"
      >
        <Form.Item
          label={t("Full name")}
          name="full_name"
          rules={[{ required: true }, { whitespace: true }]}
          labelAlign="left"
        >
          <Input placeholder={t("Full name")} />
        </Form.Item>
        <Form.Item
          label={t("Username")}
          labelAlign="left"
          name="username"
          rules={[{ required: true }, { whitespace: true }]}
        >
          <Input disabled={!!id} placeholder={t("Username")} />
        </Form.Item>
        {!id && (
          <Form.Item
            label={t("Password")}
            labelAlign="left"
            name="password"
            rules={[
              { required: true, whitespace: true },
              { pattern: /^[\S]+$/, message: t("Do not enter a space") },
              {
                min: 6,
                message: t("{field} minlength is {length} characters", {
                  field: t("Password"),
                  length: 6,
                }),
              },
              {
                max: 14,
                message: t("{field} maxlength is {length} characters", {
                  field: t("Password"),
                  length: 14,
                }),
              },
            ]}
          >
            <Input placeholder={t("Password")} />
          </Form.Item>
        )}
        <Form.Item
          label={t("Email")}
          name="email"
          rules={[{ required: true, type: "email" }]}
          labelAlign="left"
        >
          <Input placeholder={`aaa11-aa111111${USER_MAIL_ADDON}`} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

MentorForm.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  callback: PropTypes.func.isRequired,
  id: PropTypes.string,
};

export default MentorForm;
