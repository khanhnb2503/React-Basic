import PropTypes from "prop-types";
import {
  Button,
  Divider,
  Form,
  Image,
  Input,
  Modal,
  notification,
  Select,
  Space,
  Spin,
  Upload,
} from "antd";
import { useTranslation } from "../../../../hooks/useTranslation";
import { useEffect, useMemo, useState } from "react";
import Flex from "../../../../components/shared-components/Flex";
import QuestionService from "../../../../services/QuestionService";
import { MEDIA_ENDPOINT_URL } from "../../../../configs/AppConfig";
import {
  FILE_ACCEPT,
  QUESTION_IMAGE_TYPES,
} from "../../../../constants/consts";
import MediaLibrary from "../../../../components/shared-components/MediaLibrary";
import {
  getFileName,
  getFileURL,
  isImage,
} from "../../../../helpers/fileHelper";

const INITIAL_VALUES = {
  level1: "",
  level2: "",
  level3: "",
  level4: "",
  title: "",
  level: 1,
  image_type: "A",
  path_file: "",
  question: "",
  option_1: "",
  option_2: "",
  option_3: "",
  option_4: "",
  correct_answer: 1,
};

const LENGTH_QUESTION = {
  TEXT: 80,
  IMAGE_AND_VIDEO: 46,
};
const LENGTH_OPTION = 36;

function QuestionForm(props) {
  const { t } = useTranslation();
  const { id, show, onHide, callback } = props;
  const [form] = Form.useForm();
  const { Option } = Select;
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(null);
  const [categoryIdLevel1, setCategoryIdLevel1] = useState(null);
  const [categoryIdLevel2, setCategoryIdLevel2] = useState(null);
  const [categoryIdLevel3, setCategoryIdLevel3] = useState(null);
  const [categoryIdLevel4, setCategoryIdLevel4] = useState(null);
  const [imageType, setImageType] = useState(QUESTION_IMAGE_TYPES[0]);
  const [fileList, setFileList] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [showMedia, setShowMedia] = useState(false);
  const [question, setQuestion] = useState(null);
  const [questionLength, setQuestionLength] = useState(LENGTH_QUESTION.TEXT);

  const onCancel = () => {
    onHide();
    setFileList([]);
    form.resetFields();
  };

  // category selector
  const categoryLevel1 = useMemo(
    () =>
      categoryIdLevel1
        ? categories.find((i) => i._id === categoryIdLevel1)
        : null,
    [categories, categoryIdLevel1]
  );
  const categoryLevel2 = useMemo(
    () =>
      categoryIdLevel2
        ? categoryLevel1?.items.find((i) => i._id === categoryIdLevel2)
        : null,
    [categoryLevel1, categoryIdLevel2]
  );
  const categoryLevel3 = useMemo(
    () =>
      categoryIdLevel3
        ? categoryLevel2?.items.find((i) => i._id === categoryIdLevel3)
        : null,
    [categoryLevel2, categoryIdLevel3]
  );
  const categoryLevel4 = useMemo(
    () =>
      categoryIdLevel4
        ? categoryLevel3?.items.find((i) => i._id === categoryIdLevel4)
        : null,
    [categoryLevel3, categoryIdLevel4]
  );

  const loadCategories = () => {
    QuestionService.getCategories().then(({ status, data }) => {
      if (status && data?.length) {
        setCategories(data);
      }
    });
  };
  const loadQuestion = () => {
    QuestionService.detail(id).then(({ status, data }) => {
      if (status && data) {
        setCategory(data);
        setImageType(data.image_type);

        setCategoryIdLevel1(data.root_type._id);
        setCategoryIdLevel2(data.child_type._id);
        setCategoryIdLevel3(data.last_type._id);
        setCategoryIdLevel4(data.question_type_id._id);
        if (data.path_file) {
          setFileList([
            {
              name: data.path_file,
              url: data.path_file,
            },
          ]);
        }

        let formData = {
          level1: data.root_type._id,
          level2: data.child_type._id,
          level3: data.last_type._id,
          level4: data.question_type_id._id,
          title: data.title,
          level: data.level,
          image_type: data.image_type,
          option_1: data.option_1,
          option_2: data.option_2,
          option_3: data.option_3,
          option_4: data.option_4,
          correct_answer: data.correct_answer,
          number_occurrences: data.number_occurrences,
          percentage: data.percentage,
        };
        if (
          data.image_type === QUESTION_IMAGE_TYPES.IMAGE.value ||
          data.image_type === QUESTION_IMAGE_TYPES.ANIMATION.value
        ) {
          formData = { ...formData, path_file: data.path_file };
        }
        form.setFieldsValue(formData);
        setQuestion(formData);
      }
    });
  };
  const onSubmit = (values) => {
    setSubmitting(true);
    const formValues = {
      ...values,
      path_file: values.path_file ? getFileName(values.path_file) : "",
      root_type: values.level1,
      child_type: values.level2,
      last_type: values.level3,
      question_type_id: values.level4,
    };
    const afterSubmit = () => {
      delete formValues.level1;
      delete formValues.level2;
      delete formValues.level3;
      delete formValues.level4;
    };
    const beforeSubmit = (status, isUpdate = false) => {
      if (status) {
        notification.info({
          message: t("Successfully"),
          description: isUpdate ? t("Question updated") : t("Question created"),
          placement: "topRight",
        });
        callback();
        onHide();
        setFileList([]);
        form.resetFields();
      }
      setSubmitting(false);
    };

    // Handle create or update
    if (id) {
      afterSubmit();
      QuestionService.update(id, formValues).then(({ status }) => {
        beforeSubmit(status, true);
      });
    } else {
      afterSubmit();
      QuestionService.create(formValues).then(({ status }) => {
        beforeSubmit(status);
      });
    }
  };
  const onClearSelectCategory = (level) => {
    switch (level) {
      case 1: {
        setCategoryIdLevel1(null);
        setCategoryIdLevel2(null);
        setCategoryIdLevel3(null);
        setCategoryIdLevel4(null);
        break;
      }
      case 2: {
        setCategoryIdLevel2(null);
        setCategoryIdLevel3(null);
        setCategoryIdLevel4(null);
        break;
      }
      case 3: {
        setCategoryIdLevel3(null);
        setCategoryIdLevel4(null);
        break;
      }
      case 4: {
        setCategoryIdLevel4(null);
        break;
      }
      default: {
        break;
      }
    }
  };
  const onSelectCategory = (value, level) => {
    switch (level) {
      case 1: {
        if (value !== categoryIdLevel1) {
          onClearSelectCategory(2);
        }
        setCategoryIdLevel1(value);
        break;
      }
      case 2: {
        if (value !== categoryIdLevel2) {
          onClearSelectCategory(3);
        }
        setCategoryIdLevel2(value);
        break;
      }
      case 3: {
        if (value !== categoryIdLevel3) {
          onClearSelectCategory(4);
        }
        setCategoryIdLevel3(value);
        break;
      }
      case 4: {
        setCategoryIdLevel4(value);
        break;
      }
      default: {
        break;
      }
    }
  };

  const uploadFileProps = {
    onRemove: () => {
      setFileList([]);
    },
    beforeUpload: ({ fileList: newFileList }) => {
      setFileList(newFileList);
      if (newFileList.length === 0) {
        form.setFieldsValue({ path_file: "" });
      }
    },
    handleUpload: async (options) => {
      const { file } = options;
      try {
        const res = await QuestionService.uploadImage(file);
        if (res.status && res.data) {
          setFileList([{ url: res.data }]);
          form.setFieldsValue({ path_file: res.data });
        } else {
          if (id && question?.path_file) {
            setFileList([{ url: question.path_file }]);
            form.setFieldsValue({ path_file: question.path_file });
          } else {
            setFileList([]);
            form.setFieldsValue({ path_file: "" });
          }
        }
      } catch (err) {
        console.log("Error: ", err);
      }
    },
  };

  const onChangeImageType = (type) => {
    let found = null;
    Object.keys(QUESTION_IMAGE_TYPES).forEach((i) => {
      if (QUESTION_IMAGE_TYPES[i].value === type) {
        found = QUESTION_IMAGE_TYPES[i].value;
      }
    });
    if (found) {
      if (type !== category?.image_type) {
        setFileList([]);
        form.setFieldsValue({ path_file: "" });
      } else {
        setFileList([
          {
            name: category?.path_file,
            url: category?.path_file,
          },
        ]);
        form.setFieldsValue({ path_file: category?.path_file });
      }
      setImageType(found);
    }
  };

  // Media library
  const onHideMedia = () => {
    setShowMedia(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);
  useEffect(() => {
    if (id) {
      loadQuestion();
    }
    // eslint-disable-next-line
  }, [id]);

  // Remove category selected when clear
  useEffect(() => {
    if (!categoryIdLevel1) {
      form.setFieldsValue({ level1: "" });
    }
    if (!categoryIdLevel2) {
      form.setFieldsValue({ level2: "" });
    }
    if (!categoryIdLevel3) {
      form.setFieldsValue({ level3: "" });
    }
    if (!categoryIdLevel4) {
      form.setFieldsValue({ level4: "" });
    }
  }, [
    categoryIdLevel1,
    categoryIdLevel2,
    categoryIdLevel3,
    categoryIdLevel4,
    form,
  ]);
  const rules = {
    level1: [
      { required: true, message: t("Please choose Main question category") },
    ],
    level2: [
      { required: true, message: t("Please choose Sub question category") },
    ],
    level3: [
      { required: true, message: t("Please choose Child question category") },
    ],
    level4: [{ required: true, message: t("Please choose Name") }],
    level: [{ required: true, message: t("Please choose Level") }],
    image_type: [{ required: true, message: t("Please choose Image type") }],
    correct_answer: [
      { required: true, message: t("Please choose Correct answer") },
    ],
    path_file: [{ required: true, message: t("Please choose Media") }],
    title: [
      { required: true },
      { whitespace: true },
      {
        max: questionLength,
        message: t("Maxlength is {length} characters", {
          length: questionLength,
        }),
      },
    ],
    option_1: [
      { required: true },
      { whitespace: true },
      {
        max: LENGTH_OPTION,
        message: t("Maxlength is {length} characters", {
          length: LENGTH_OPTION,
        }),
      },
    ],
    option_2: [
      { required: true },
      { whitespace: true },
      {
        max: LENGTH_OPTION,
        message: t("Maxlength is {length} characters", {
          length: LENGTH_OPTION,
        }),
      },
    ],
    option_3: [
      { required: true },
      { whitespace: true },
      {
        max: LENGTH_OPTION,
        message: t("Maxlength is {length} characters", {
          length: LENGTH_OPTION,
        }),
      },
    ],
    option_4: [
      { required: true },
      { whitespace: true },
      {
        max: LENGTH_OPTION,
        message: t("Maxlength is {length} characters", {
          length: LENGTH_OPTION,
        }),
      },
    ],
  };
  useEffect(() => {
    if (imageType) {
      if (
        [
          QUESTION_IMAGE_TYPES.IMAGE.value,
          QUESTION_IMAGE_TYPES.ANIMATION.value,
        ].includes(imageType)
      ) {
        setQuestionLength(LENGTH_QUESTION.IMAGE_AND_VIDEO);
      } else {
        setQuestionLength(LENGTH_QUESTION.TEXT);
      }
    }
    // eslint-disable-next-line
  }, [imageType]);
  return (
    <Modal
      visible={show}
      onCancel={onCancel}
      footer={false}
      title={t(id ? "Update question" : "Create question")}
      width={800}
    >
      <Form
        form={form}
        onFinish={onSubmit}
        defaultValue={INITIAL_VALUES}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        labelAlign="left"
      >
        <Form.Item
          label={t("Main question category")}
          name="level1"
          rules={rules.level1}
        >
          <Select
            onChange={(event) => {
              onSelectCategory(event, 1);
            }}
            placeholder={t("Select main question category")}
            allowClear
            onClear={() => {
              onClearSelectCategory(1);
            }}
            value={categoryLevel1?._id}
          >
            {categories.map((category, index) => (
              <Option value={category._id} key={`category-level1-${index}`}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label={t("Sub question category")}
          name="level2"
          rules={rules.level2}
        >
          <Select
            onChange={(event) => {
              onSelectCategory(event, 2);
            }}
            placeholder={t("Select sub question category")}
            allowClear
            onClear={() => {
              onClearSelectCategory(2);
            }}
            value={categoryLevel2?._id}
          >
            {categoryLevel1?.items.map((category, index) => (
              <Option value={category._id} key={`category-level2-${index}`}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label={t("Child question category")}
          name="level3"
          rules={rules.level3}
        >
          <Select
            onChange={(event) => {
              onSelectCategory(event, 3);
            }}
            placeholder={t("Select child question category")}
            allowClear
            onClear={() => {
              onClearSelectCategory(3);
            }}
            value={categoryLevel3?._id}
          >
            {categoryLevel2?.items.map((category, index) => (
              <Option value={category._id} key={`category-level3-${index}`}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label={t("Name")} name="level4" rules={rules.level4}>
          <Select
            onChange={(event) => {
              onSelectCategory(event, 4);
            }}
            placeholder={t("Select question category")}
            allowClear
            onClear={() => {
              onClearSelectCategory(4);
            }}
            value={categoryLevel4?._id}
          >
            {categoryLevel3?.items.map((category, index) => (
              <Option value={category._id} key={`category-level4-${index}`}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label={t("Level")} rules={rules.level} name="level">
          <Select>
            {[1, 2].map((i) => (
              <Option value={i} key={`level-${i}`}>
                {i}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label={t("Type of question")}
          rules={rules.image_type}
          name="image_type"
        >
          <Select onChange={onChangeImageType}>
            {Object.keys(QUESTION_IMAGE_TYPES).map((i, index) => (
              <Option
                value={QUESTION_IMAGE_TYPES[i].value}
                key={`image-type-${index}`}
              >
                {QUESTION_IMAGE_TYPES[i].name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        {[
          QUESTION_IMAGE_TYPES.IMAGE.value,
          QUESTION_IMAGE_TYPES.ANIMATION.value,
        ].includes(imageType) && (
          <Form.Item
            label={t("Media")}
            rules={rules.path_file}
            name="path_file"
          >
            <Flex justifyContent="between">
              {!form.getFieldValue("path_file") ? null : isImage(
                  form.getFieldValue("path_file")
                ) ? (
                <Image
                  src={getFileURL(form.getFieldValue("path_file"))}
                  className=""
                  style={{ maxWidth: 310 }}
                  loading="eager"
                />
              ) : (
                <video
                  className="mr-auto"
                  src={getFileURL(form.getFieldValue("path_file"))}
                  style={{ maxWidth: 310 }}
                  controls
                />
              )}
              <Button
                type="dashed"
                style={{ zIndex: 1 }}
                onClick={() => {
                  setShowMedia(!showMedia);
                }}
              >
                + {t("Upload")}
              </Button>
            </Flex>
          </Form.Item>
        )}
        <Form.Item label={t("Question")} rules={rules.title} name="title">
          <Input.TextArea />
        </Form.Item>
        <Form.Item label={t("Option 1")} rules={rules.option_1} name="option_1">
          <Input type="text" />
        </Form.Item>
        <Form.Item label={t("Option 2")} rules={rules.option_2} name="option_2">
          <Input type="text" />
        </Form.Item>
        <Form.Item label={t("Option 3")} rules={rules.option_3} name="option_3">
          <Input type="text" />
        </Form.Item>
        <Form.Item label={t("Option 4")} rules={rules.option_4} name="option_4">
          <Input type="text" />
        </Form.Item>
        <Form.Item
          label={t("Correct answer")}
          rules={rules.correct_answer}
          name="correct_answer"
        >
          <Select>
            {[1, 2, 3, 4].map((i) => (
              <Option value={i} key={`correct-answer-${i}`}>
                {i}
              </Option>
            ))}
          </Select>
        </Form.Item>
        {id && (
          <>
            <Form.Item label={t("Number questions")}>
              <Input readOnly value={question?.number_occurrences || 0} />
            </Form.Item>
            <Form.Item label={t("Correct answer rate")}>
              <Input
                readOnly
                value={Math.round(Number(question?.percentage || 0) * 100)}
                addonAfter="%"
              />
            </Form.Item>
          </>
        )}
        <Divider />
        <Flex justifyContent="end">
          <Space>
            <Button htmlType="reset" onClick={onCancel}>
              {t("Cancel")}
            </Button>
            <Button htmlType="submit" type="primary" loading={submitting}>
              {t(id ? "Update" : "Create")}
            </Button>
          </Space>
        </Flex>
      </Form>
      <MediaLibrary
        show={showMedia}
        onChooseMedia={(media) => {
          console.log("choose media: ", media);
          form.setFieldsValue({ path_file: media.path_file });
          onHideMedia();
        }}
        onHide={onHideMedia}
        imageOnly={imageType === QUESTION_IMAGE_TYPES.IMAGE.value}
      />
    </Modal>
  );
}

QuestionForm.propTypes = {
  id: PropTypes.string,
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  callback: PropTypes.func.isRequired,
};

export default QuestionForm;
