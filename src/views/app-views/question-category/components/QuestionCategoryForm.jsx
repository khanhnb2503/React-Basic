import {
  Button,
  Divider,
  Form,
  Input,
  Modal,
  notification,
  Space,
  TreeSelect,
} from "antd";
import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "../../../../hooks/useTranslation";
import QuestionService from "../../../../services/QuestionService";

const INITIAL_VALUE = {
  parent_id: undefined,
  name: "",
};

function QuestionCategoryForm(props) {
  const { t } = useTranslation();
  const { show, onHide, callback, id, categories } = props;
  const [form] = Form.useForm();
  const { TreeNode } = TreeSelect;
  const [submitting, setSubmitting] = useState(false);
  const [category, setCategory] = useState(null);

  const loadCategory = useCallback(() => {
    if (id) {
      QuestionService.detailCategory(id).then((res) => {
        if (res.status && res.data) {
          const data = { ...res.data, parent_id: res.data?.parent_id?._id };
          setCategory(res.data);
          form.setFieldsValue(data);
        }
      });
    }
  }, [form, id]);

  const handleSubmit = (values) => {
    setSubmitting(true);
    if (id) {
      QuestionService.updateCategory(id, values).then(({ status, message }) => {
        if (status) {
          notification.info({
            message: t("Successfully"),
            description: message,
            placement: "topRight",
          });
        }
        callback();
        setSubmitting(false);
      });
    } else {
      QuestionService.createCategory(values).then(({ status, message }) => {
        if (status) {
          notification.info({
            message: t("Successfully"),
            description: message,
            placement: "topRight",
          });
        }
        callback();
        setSubmitting(false);
      });
    }
  };

  const onHideForm = () => {
    onHide();
    form.resetFields();
    setCategory(null);
  };

  useEffect(() => {
    loadCategory();
    // eslint-disable-next-line
  }, [id]);
  return (
    <Modal
      visible={show}
      onCancel={onHideForm}
      title={t(id ? "Update {name}" : "Create {name}", {
        name: t("Question Category"),
      })}
      footer={false}
    >
      <Form
        onFinish={handleSubmit}
        form={form}
        translate="yes"
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 14 }}
        autoComplete="off"
        initialValues={INITIAL_VALUE}
        size="small"
      >
        <Form.Item
          label={t("Sub question category")}
          name="parent_id"
          labelAlign="left"
        >
          <TreeSelect treeLine={{ showLeafIcon: false }}>
            <TreeNode value={undefined} />
            {categories
              .filter((i) => (category ? i._id !== category._id : i))
              .map((i) => (
                <TreeNode value={i._id} title={i.name} key={i._id}>
                  {i.items
                    .filter((ii) => (category ? ii._id !== category._id : ii))
                    .map((ii) => (
                      <TreeNode value={ii._id} title={ii.name} key={ii._id}>
                        {ii.items
                          .filter((iii) =>
                            category ? iii._id !== category._id : iii
                          )
                          .map((iii) => (
                            <TreeNode
                              value={iii._id}
                              title={iii.name}
                              key={iii._id}
                            />
                          ))}
                      </TreeNode>
                    ))}
                </TreeNode>
              ))}
          </TreeSelect>
        </Form.Item>
        <Form.Item
          label={t("Name")}
          name="name"
          rules={[{ required: true }, { whitespace: true }]}
          labelAlign="left"
        >
          <Input placeholder={t("Name")} />
        </Form.Item>
        {id && (
          <>
            <Form.Item label={t("Number questions")} labelAlign="left">
              <Input
                placeholder={t("Number questions")}
                readOnly
                value={category?.number_question}
              />
            </Form.Item>
            <Form.Item label={t("Correct answer rate")} labelAlign="left">
              <Input
                placeholder={t("Correct answer rate")}
                readOnly
                value={category ? category.percentage * 100 : 0}
                suffix="%"
              />
            </Form.Item>
          </>
        )}
        <Divider />
        <Space className="d-flex justify-content-end">
          <Button htmlType="reset" onClick={onHideForm}>
            {t("Cancel")}
          </Button>
          <Button htmlType="submit" type="primary" loading={submitting}>
            {t(id ? "Update" : "Create")}
          </Button>
        </Space>
      </Form>
    </Modal>
  );
}

QuestionCategoryForm.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  callback: PropTypes.func.isRequired,
  id: PropTypes.string,
  categories: PropTypes.array.isRequired,
};

export default QuestionCategoryForm;
