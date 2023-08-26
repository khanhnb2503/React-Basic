import PropTypes from "prop-types";
import { DatePicker, Form, Input, Modal, notification } from "antd";
import FeedbackService from "../../../../services/FeedbackService";
import { useCallback, useEffect, useState } from "react";
import moment from "moment";
import { useTranslation } from "../../../../hooks/useTranslation";

function SendFeedback(props) {
  const { t } = useTranslation();
  const { id, show, onHide, callback } = props;
  const [form] = Form.useForm();
  const [feedback, setFeedback] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const onClose = () => {
    onHide();
    form.resetFields();
    setFeedback(null);
  };

  const loadFeedback = useCallback(() => {
    if (id) {
      FeedbackService.detail(id).then((res) => {
        if (res.status && res.data) {
          setFeedback(res.data);
          form.setFieldsValue({ answer: res.data.answer });
        }
      });
    }
    // eslint-disable-next-line
  }, [id]);

  const handleSendFeedback = (values) => {
    FeedbackService.send(id, {
      answer: values.answer.trim().replace(/(?:\r\n|\r|\n)/g, "<br>"),
    }).then((res) => {
      if (res.status) {
        notification.info({
          message: t("Successfully"),
          description: t("Feedback sent"),
          placement: "topRight",
        });
        callback();
      }
      setSubmitting(false);
    });
  };
  useEffect(() => {
    loadFeedback();
    // eslint-disable-next-line
  }, [id]);
  return (
    <Modal
      title={t("Feedback detail")}
      visible={show}
      onCancel={onClose}
      okText={t("Send email")}
      confirmLoading={submitting}
      onOk={form.submit}
    >
      <Form
        labelAlign="left"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        onFinish={handleSendFeedback}
        form={form}
      >
        <Form.Item label={t("User")}>
          <Input
            value={`${feedback?.user_id?.full_name} - ${feedback?.user_id?.personal_id}`}
            readOnly
          />
        </Form.Item>
        <Form.Item label={t("Question")}>
          <Input value={feedback?.question} readOnly />
        </Form.Item>
        <Form.Item label={t("Question Date")}>
          <DatePicker
            value={feedback ? moment(feedback.create_at) : null}
            disabled
          />
        </Form.Item>
        <Form.Item
          label={t("Answer")}
          name="answer"
          rules={[{ required: true }, { whitespace: true }]}
        >
          <Input.TextArea rows={5} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

SendFeedback.propTypes = {
  id: PropTypes.string,
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  callback: PropTypes.func.isRequired,
};

export default SendFeedback;
