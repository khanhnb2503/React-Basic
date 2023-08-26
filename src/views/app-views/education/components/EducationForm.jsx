import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Modal, Form, Input, notification, TreeSelect } from "antd";
import { useTranslation } from "../../../../hooks/useTranslation";
import EducationService from "../../../../services/EducationService";
import { REGEX } from "../../../../constants/patterns";
import useEducation from "../../../../hooks/useEducation";

const { TreeNode } = TreeSelect;

const INITIAL_VALUES = {
  name: "",
  code: "",
  parent_id: "none",
};

function EducationForm(props) {
  const { t } = useTranslation();
  const { id, show, onHide, callback } = props;
  const [submitting, setSubmitting] = useState(false);
  const [typeEdu, setTypeEdu] = useState(0);
  const [form] = Form.useForm();
  const { loadSchools, schools } = useEducation();

  const rules = {
    name: [
      {
        required: true,
        message: t("Please enter a proper noun"),
      },
      {
        whitespace: true,
        message: t("Do not use whitespace for proper nouns"),
      },
    ],
    code: [
      {
        required: true,
        message: t("Please enter the code"),
      },
      {
        whitespace: true,
        message: t("Code should not be whitespace"),
      },
      {
        pattern:
          typeEdu === 0
            ? REGEX.SCHOOL
            : typeEdu === 1
            ? REGEX.FACULTY
            : REGEX.COURSE,
        message:
          typeEdu === 0
            ? t("Enter the code in the format aaa11")
            : typeEdu === 1
            ? t("Enter the code in aa format")
            : t("Enter the code in the format of 11"),
      },
    ],
    parent_id: [],
    type: [],
  };

  const onClose = () => {
    onHide();
    form.resetFields();
  };

  const loadEducation = useCallback(() => {
    if (id) {
      EducationService.detail(id).then((res) => {
        if (res.status && res.data) {
          let dataEdu = res.data;
          if (dataEdu.parent_id?._id) {
            dataEdu = {
              ...dataEdu,
              parent_id: `${dataEdu.parent_id._id}_${dataEdu.parent_id.type}`,
            };
          } else if (dataEdu.parent_id) {
            dataEdu = {
              ...dataEdu,
              parent_id: `${dataEdu.parent_id}_${dataEdu.type}`,
            };
          } else {
            dataEdu = { ...dataEdu, parent_id: "none" };
          }
          form.setFieldsValue(dataEdu);
          console.log("typeEdu", dataEdu.type);
          setTypeEdu(dataEdu.type - 1);
        }
      });
    }
  }, [form, id]);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    const formValues = {
      ...values,
      name: values.name.trim(),
      code: values.code.trim(),
      parent_id:
        values.parent_id === "none" ? null : values.parent_id.split("_")[0],
    };
    const res = id
      ? await EducationService.update(id, formValues)
      : await EducationService.create(formValues);
    if (res.data) {
      notification.info({
        message: id ? t("Updated successfully") : t("Created successfully"),
      });
      callback();
      loadSchools();
      onClose();
    }
    setSubmitting(false);
  };

  useEffect(() => {
    loadEducation();
  }, [id]);
  return (
    <Modal
      title={t(id ? "School category updates" : "Add school category")}
      visible={show}
      onCancel={onClose}
      confirmLoading={submitting}
      onOk={form.submit}
      okText={t(id ? "Update" : "Add")}
    >
      <Form
        labelAlign="left"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        onFinish={handleSubmit}
        form={form}
        initialValues={INITIAL_VALUES}
      >
        <Form.Item name="name" label={t("Name")} rules={rules.name}>
          <Input placeholder={t("Name")} />
        </Form.Item>
        <Form.Item
          name="parent_id"
          label={t("Parent category")}
          rules={rules.parent_id}
        >
          <TreeSelect
            treeLine={{ showLeafIcon: false }}
            onChange={(value) => {
              const [id, type] = value.split("_");
              if (Number(type) !== typeEdu) {
                form.resetFields(["code"]);
              }
              if (type >= 0) {
                setTypeEdu(Number(type));
              } else {
                setTypeEdu(0);
              }
            }}
          >
            <TreeNode value="none" title={t("None")} />
            {schools
              .filter((i) => (id ? i._id !== id : i))
              .map((i) => (
                <TreeNode
                  value={`${i._id}_${i.type}`}
                  title={i.name}
                  key={`${i._id}_${i.type}`}
                >
                  {i.items
                    .filter((ii) => (id ? ii._id !== id : ii))
                    .map((ii) => (
                      <TreeNode
                        value={`${ii._id}_${ii.type}`}
                        title={ii.name}
                        key={`${ii._id}_${ii.type}`}
                      />
                    ))}
                </TreeNode>
              ))}
          </TreeSelect>
        </Form.Item>
        <Form.Item name="code" label={t("Code")} rules={rules.code}>
          <Input
            placeholder={typeEdu === 0 ? "aaa11" : typeEdu === 1 ? "aa" : "11"}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

EducationForm.propTypes = {
  id: PropTypes.string,
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  callback: PropTypes.func.isRequired,
  educations: PropTypes.array.isRequired,
};

export default EducationForm;
