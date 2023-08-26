import React, { memo, useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  notification,
  Select,
  Space,
} from "antd";
import { useTranslation } from "../../../../hooks/useTranslation";
import PropTypes from "prop-types";
import UserService from "../../../../services/UserService";
import { USER_MAIL_ADDON } from "../../../../constants/app";
import { REGEX } from "../../../../constants/patterns";
import moment from "moment";
import { getUsageTime } from "../../../../helpers/TimeHelper";
import useEducation from "../../../../hooks/useEducation";

function UserForm(props) {
  const { t } = useTranslation();
  const { callback, user, isDetail, form, id, onHideModal } = props;
  const [submitting, setSubmitting] = useState(false);

  const { schools, loadSchools } = useEducation();
  const [faculties, setFaculties] = useState([]);
  const [educations, setEducations] = useState([]);

  const onSelectSchool = (id) => {
    if (id) {
      const selected = schools.find((item) => item._id === id) || null;
      setFaculties(selected ? selected.items : []);
    } else {
      setFaculties([]);
      setEducations([]);
      form.resetFields(["faculty", "education_id"]);
    }
  };
  const onSelectFaculty = (id) => {
    if (id) {
      const selected = faculties.find((item) => item._id === id) || null;
      setEducations(selected ? selected.items : []);
    } else {
      setEducations([]);
      form.resetFields(["education_id"]);
    }
  };

  const handleSubmit = (values) => {
    setSubmitting(true);
    const formValues = {
      ...values,
      expiration_date: moment(values.expiration_date).toISOString(),
      email: values.email.toLowerCase(),
    };
    if (id) {
      UserService.update(id, formValues).then(({ status, message }) => {
        if (status) {
          notification.info({
            message: t("Successfully"),
            description: message,
            placement: "topRight",
          });
          callback();
          form.resetFields();
        }
        setSubmitting(false);
      });
    } else {
      UserService.create({ ...formValues, role: "user" }).then(
        ({ status, message }) => {
          if (status) {
            notification.info({
              message: t("Successfully"),
              description: message,
              placement: "topRight",
            });
            callback();
            form.resetFields();
          }
          setSubmitting(false);
        }
      );
    }
  };

  useEffect(() => {
    if (user) {
      let userData = user;
      userData = {
        ...userData,
        full_personal_id: userData.personal_id,
        personal_id: userData.personal_id
          ? userData.personal_id.slice(10)
          : null,
      };
      form.setFieldsValue({
        ...userData,
        created_at: moment(user.created_at),
        expiration_date: moment(user.expiration_date),
      });
    }
    // eslint-disable-next-line
  }, [user]);
  useEffect(() => {
    if (user && schools.length > 0) {
      onSelectSchool(user.schools);
    }
  }, [schools, user]);
  useEffect(() => {
    if (user && faculties.length > 0) {
      onSelectFaculty(user.faculty);
    }
  }, [faculties, user]);
  useEffect(() => {
    loadSchools();
  }, []);
  return (
    <Form
      onFinish={handleSubmit}
      form={form}
      translate="yes"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
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
        label={t("School")}
        name="schools"
        rules={[{ required: true }]}
        labelAlign="left"
      >
        <Select
          allowClear
          onClear={() => {
            onSelectSchool(null);
          }}
          onChange={onSelectSchool}
          options={schools.map((item) => ({
            label: item.name,
            value: item._id,
          }))}
        />
      </Form.Item>
      <Form.Item
        label={t("Faculty")}
        name="faculty"
        rules={[{ required: true }]}
        labelAlign="left"
      >
        <Select
          allowClear
          onClear={() => {
            onSelectFaculty(null);
          }}
          onChange={onSelectFaculty}
          options={faculties.map((item) => ({
            label: item.name,
            value: item._id,
          }))}
        />
      </Form.Item>
      <Form.Item
        label={t("Education")}
        name="education_id"
        rules={[{ required: true }]}
        labelAlign="left"
      >
        <Select
          allowClear
          options={educations.map((item) => ({
            label: item.name,
            value: item._id,
          }))}
        />
      </Form.Item>
      <Form.Item
        label={t("Student serial number")}
        name="personal_id"
        rules={[
          {
            required: true,
            whitespace: true,
          },
          {
            pattern: REGEX.PERSONAL_ID,
            message: t("{name} must be in the format {format}", {
              name: t("Personal ID"),
              format: "1111",
            }),
          },
        ]}
        labelAlign="left"
      >
        <Input placeholder="1111" />
      </Form.Item>
      {isDetail && (
        <Form.Item
          label={t("Personal ID")}
          name="full_personal_id"
          labelAlign="left"
        >
          <Input placeholder="aaa11-aa111111" readOnly />
        </Form.Item>
      )}
      <Form.Item
        label={t("Email")}
        name="email"
        rules={[
          {
            required: true,
            type: "email",
            whitespace: true,
          },
        ]}
        labelAlign="left"
      >
        <Input placeholder={`aaa11-aa111111${USER_MAIL_ADDON}`} />
      </Form.Item>
      {isDetail && (
        <Form.Item label={t("Usage time (h)")} labelAlign="left">
          <Input disabled value={user ? getUsageTime(user.usage_time) : ""} />
        </Form.Item>
      )}
      {isDetail && (
        <Form.Item label={t("Number test")} labelAlign="left">
          <Input disabled value={user?.number_test} />
        </Form.Item>
      )}
      {isDetail && (
        <Form.Item label={t("Highest score")} labelAlign="left">
          <Input disabled value={user?.hightest_score} />
        </Form.Item>
      )}
      {isDetail && (
        <Form.Item
          label={t("Register date")}
          name="created_at"
          rules={[{ type: "date" }]}
          labelAlign="left"
        >
          <DatePicker placeholder="yyyy-mm-dd" disabled />
        </Form.Item>
      )}
      <Form.Item
        label={t("Expiration Date")}
        name="expiration_date"
        rules={[{ required: true, type: "date" }]}
        labelAlign="left"
      >
        <DatePicker
          placeholder="yyyy-mm-dd"
          disabledDate={(current) => moment() >= current}
        />
      </Form.Item>
      {!isDetail && (
        <>
          <Divider />
          <Space className="d-flex justify-content-end">
            <Button htmlType="reset" onClick={onHideModal}>
              {t("Cancel")}
            </Button>
            <Button htmlType="submit" type="primary" loading={submitting}>
              {t(id ? "Update" : "Create")}
            </Button>
          </Space>
        </>
      )}
    </Form>
  );
}

UserForm.propTypes = {
  id: PropTypes.string,
  user: PropTypes.object,
  isDetail: PropTypes.bool,
  form: PropTypes.object.isRequired,
  callback: PropTypes.func.isRequired,
  onHideModal: PropTypes.func.isRequired,
};

export default memo(UserForm);
