import Datatable, {
  LIST_PER_PAGE,
} from "../../../../components/shared-components/Datatable";
import {
  Button,
  Col,
  Form,
  Image,
  notification,
  Row,
  Select,
  Space,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  InfoCircleOutlined,
  SyncOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { USER_STATUS } from "../../user/constants";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "../../../../hooks/useTranslation";
import QuestionService from "../../../../services/QuestionService";
import QuestionForm from "../components/QuestionForm";
import DownloadQuestions from "../components/DownloadQuestions";
import ImportQuestions from "../components/ImportQuestions";
import {
  QUESTION_IMAGE_TYPES,
  QUESTION_STATUS,
} from "../../../../constants/consts";
import Confirm from "../../../../hooks/useConfirm";
import { getFileURL, isImage } from "../../../../helpers/fileHelper";

const POPUP_TYPES = {
  FORM: "form",
  DOWNLOAD_FILE: "download",
  UPLOAD_FILE: "upload",
  CONFIRM_DELETE: "confirm-delete",
};

const pickColor = (input) => {
  let color = "green";

  if (input === USER_STATUS.INACTIVE) {
    color = "volcano";
  }

  if (input === USER_STATUS.SUSPEND) {
    color = "magenta";
  }

  return color;
};

const QUESTION_FILTER_DEFAULT = {
  status: null,
  level: null,
  image_type: null,
};

function QuestionManagement() {
  const { t } = useTranslation();
  const [questions, setQuestions] = useState([]);
  const [perPage, setPerPage] = useState(LIST_PER_PAGE[0]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [showPopup, setShowPopup] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [questionSelected, setQuestionSelected] = useState(null);
  const [questionUpdating, setQuestionUpdating] = useState(false);
  const [isApplyFilter, setIsApplyFilter] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [filter, setFilter] = useState(QUESTION_FILTER_DEFAULT);

  const [questionCategories, setQuestionCategories] = useState([]);
  const [subCategory, setSubCategory] = useState([]);

  const idsSelected = useMemo(
    () => selectedRowKeys.map((i) => questions[i]._id),
    [selectedRowKeys, questions]
  );
  const [formFilter] = Form.useForm();

  const loadQuestions = () => {
    const initialParams = {
      page,
      limit: perPage,
      title: keyword,
    };
    let params;
    if (Object.values(filter).find((keyValue) => keyValue)) {
      setIsApplyFilter(true);
      params = {
        ...initialParams,
        ...filter,
      };
    } else {
      setIsApplyFilter(false);
      params = initialParams;
    }
    QuestionService.list(params).then(({ status, total, data }) => {
      if (status && data.length) {
        setTotal(total);
        setQuestions(data.map((i, index) => ({ ...i, key: index })));
      } else {
        setQuestions([]);
      }
      setLoading(false);
    });
  };

  const loadQuestionCategories = () => {
    QuestionService.getFilterCategories()
      .then((data, message) => {    
        setQuestionCategories(data?.data?.items || []);
      }
    );
  };  
 
  const onSelectCategory = (id) => {
    if (id) { 
      const selected = questionCategories.find((item) => item._id === id) || null; 
      setSubCategory(selected ? selected.items : []); 
      formFilter.resetFields(["child_type"]);
    } else {
      setSubCategory([]);  
      formFilter.resetFields(["child_type"]);
    }
  };

  const onShowFilter = () => {  
    setShowFilter(true);
  };
  const onHideFilter = () => {
    setShowFilter(false);
  };
  // On filter
  const onFilter = (values) => {
    const formValues = {
      status: values.status || null,
      level: values.level || null,
      image_type: values.image_type || null,
      root_type: values.root_type || null,
      child_type: values.child_type || null,
    };
    setFilter(formValues);
    onHideFilter();
  };

  // On select users
  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const onShowPopup = (type, question = null) => {
    setQuestionSelected(question);
    setShowPopup(type);
  };
  const onHidePopup = () => {
    setQuestionSelected(null);
    setShowPopup(null);
  };

  // Handle change status
  const handleChangeStatus = (obj) => {
    setQuestionUpdating(obj._id);
    QuestionService.updateStatus(
      obj._id,
      obj.status === QUESTION_STATUS.ACTIVE
        ? QUESTION_STATUS.INACTIVE
        : QUESTION_STATUS.ACTIVE
    ).then(({ status, data }) => {
      if (status) {
        notification.info({
          message: t("Successfully"),
          description: t("Update {name} successfully", { name: t("Status") }),
          placement: "topRight",
        });
        loadQuestions();
      }
      setQuestionUpdating(null);
    });
  };
  // Handle delete once
  const handleDelete = (obj) => {
    const ids = obj ? [obj._id] : idsSelected;
    Confirm(
      obj
        ? t("Delete {name}", { name: obj.title })
        : t("Delete {count} items", { count: ids.length }),
      () => {
        if (!obj) {
          setDeleting(true);
        }
        QuestionService.deleteMultiple(ids).then(({ status }) => {
          if (status) {
            notification.info({
              message: t("Successfully"),
              description: t("Remove successfully"),
            });
            onHidePopup();
            loadQuestions();
            setSelectedRowKeys([]);
            setDeleting(false);
          }
        });
      },
      t
    );
  };
  // Define column table
  const columns = [
    {
      title: t("NO"),
      dataIndex: "key",
      width: 60,
      render: (index) => index + 1,
    },
    {
      title: t("Main question category"),
      dataIndex: "root_type",
      render: (root_type) => (
        <Typography.Text>{root_type.name}</Typography.Text>
      ),
    },
    {
      title: t("Sub question category"),
      dataIndex: "child_type",
      render: (child_type) => (
        <Typography.Text>{child_type.name}</Typography.Text>
      ),
    },
    {
      title: t("Level"),
      dataIndex: "level",
      render: (level) => <Tag color="volcano">{level}</Tag>,
    },
    {
      title: (
        <div>
          {t("Image type")
            .split("\n")
            .map((text) => (
              <Typography>{text}</Typography>
            ))}
        </div>
      ),
      dataIndex: "image_type",
      width: 126,
      render: (image_type) => {
        let type = null;
        Object.keys(QUESTION_IMAGE_TYPES).forEach((i) => {
          if (QUESTION_IMAGE_TYPES[i].value === image_type) {
            type = QUESTION_IMAGE_TYPES[i];
          }
        });
        return <Tag color="gold">{type ? type.name : "-"}</Tag>;
      },
    },
    {
      title: t("Question"),
      dataIndex: "title",
      width: 250,
    },
    {
      title: t("Status"),
      dataIndex: "status",
      width: 140,
      render: (status) => (
        <Tag color={pickColor(status)}>
          {status === QUESTION_STATUS.ACTIVE ? t("Active") : t("Inactive")}
        </Tag>
      ),
    },
    {
      title: t("Number questions"),
      dataIndex: "number_occurrences",
    },
    {
      title: t("Correct answer rate"),
      dataIndex: "percentage",
      render: (percentage) => (
        <Typography>{Math.round(Number(percentage || 0) * 100)}%</Typography>
      ),
    },
    {
      title: (
        <Space>
          <Space direction="vertical">
            {t("Media image/video")
              .split("\n")
              .map((text) => (
                <Typography>{text}</Typography>
              ))}
          </Space>
          <Tooltip
            title={t("Media image/video description")
              .split("\n")
              .map((text) => (
                <Typography className="text-white">{text}</Typography>
              ))}
          >
            <InfoCircleOutlined />
          </Tooltip>
        </Space>
      ),
      dataIndex: "path_file",
      width: 135,
      render: (path_file) =>
        isImage(path_file) ? (
          <Image src={getFileURL(path_file)} style={{ width: 80 }} />
        ) : (
          <video src={getFileURL(path_file)} style={{ width: 80 }} />
        ),
    },
    {
      title: t("Action"),
      dataIndex: "action",
      width: 150,
      fixed: "right",
      render: (action, ob) => (
        <Space>
          <Button
            size="small"
            type="ghost"
            icon={
              <SyncOutlined
                spin={questionUpdating === ob._id}
                style={{ color: "#36cfc9", height: 14 }}
              />
            }
            onClick={() => {
              handleChangeStatus(ob);
            }}
            disabled={questionUpdating === ob._id}
          />
          <Button
            size="small"
            type="ghost"
            icon={<EditOutlined style={{ color: "#ff7a45" }} />}
            onClick={() => {
              onShowPopup(POPUP_TYPES.FORM, ob);
            }}
          />
          <Button
            size="small"
            type="ghost"
            icon={<DeleteOutlined style={{ color: "#ff4d4f" }} />}
            onClick={() => {
              handleDelete(ob);
            }}
          />
        </Space>
      ),
    },
  ];

  useEffect(() => {
    setLoading(true);
    loadQuestions();
    // eslint-disable-next-line
  }, [page, perPage, keyword, filter]);
  useEffect(() => {
    if (keyword.length > 0) {
      setIsApplyFilter(true);
    }
  }, [keyword]);
  useEffect(() => {
    setSelectedRowKeys([]);
  }, [perPage]);

  useEffect(() => {
    if(questionCategories.length == 0){
      loadQuestionCategories(); 
    }
  }, [questionCategories]);

  return (
    <>
      <Datatable
        formFilter={formFilter}
        columnAlign="center"
        metadata={{
          perPage,
          setPerPage,
          page,
          setPage,
          total,
          keyword,
          setKeyword,
        }}
        showPagination
        showHeader
        action={
          <Row style={{ marginBottom: 16 }}>
            <Col xs={24} sm={12}>
              <Space>
                <Button
                  type="primary"
                  danger
                  disabled={selectedRowKeys.length === 0}
                  onClick={() => {
                    handleDelete();
                  }}
                  loading={deleting}
                >
                  {`${t("Delete all")} ${
                    selectedRowKeys.length ? `(${selectedRowKeys.length})` : ""
                  }`}
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    onShowPopup(POPUP_TYPES.FORM);
                  }}
                >
                  {t("Add")}
                </Button>
              </Space>
            </Col>
            <Col xs={24} sm={12}>
              <Space className="d-flex justify-content-end">
                <Tooltip title={t("Upload users management")}>
                  <Button
                    icon={<UploadOutlined />}
                    onClick={() => {
                      onShowPopup(POPUP_TYPES.UPLOAD_FILE);
                    }}
                  >
                    {t("Import")}
                  </Button>
                </Tooltip>
                <Tooltip title={t("Download example file")}>
                  <Button
                    icon={<DownloadOutlined />}
                    onClick={() => {
                      onShowPopup(POPUP_TYPES.DOWNLOAD_FILE);
                    }}
                  >
                    {t("Download")}
                  </Button>
                </Tooltip>
              </Space>
            </Col>
          </Row>
        }
        columns={columns}
        dataSource={questions}
        rowSelection={rowSelection}
        filter={{
          element: (
            <div>
              <Form.Item label={t("Status")} name="status">
                <Select defaultValue={null}>
                  <Select.Option value={null}>{t("All")}</Select.Option>
                  <Select.Option value={QUESTION_STATUS.ACTIVE}>
                    {t("Active")}
                  </Select.Option>
                  <Select.Option value={QUESTION_STATUS.INACTIVE}>
                    {t("Inactive")}
                  </Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label={t("Level")} name="level">
                <Select clearIcon defaultValue={null}>
                  <Select.Option value={null}>{t("All")}</Select.Option>
                  {[1, 2].map((i, index) => (
                    <Select.Option value={i} key={`level-${index}`}>
                      {i}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label={t("Type of question")} name="image_type">
                <Select clearIcon defaultValue={null}>
                  <Select.Option value={null}>{t("All")}</Select.Option>
                  {Object.keys(QUESTION_IMAGE_TYPES).map((i, index) => (
                    <Select.Option
                      value={QUESTION_IMAGE_TYPES[i].value}
                      key={`level-${index}`}
                    >
                      {QUESTION_IMAGE_TYPES[i].name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label={t("Main question category")} name="root_type">
                <Select
                  allowClear 
                  onClear={() => {
                    onSelectCategory(null);
                  }}
                  onChange={onSelectCategory}
                  options={questionCategories.map((item) => ({
                    label: item.name,
                    value: item._id,
                  }))}
                />
              </Form.Item>
              <Form.Item label={t("Sub question category")} name="child_type">
                <Select
                  allowClear 
                  options={subCategory.map((item) => ({
                    label: item.name,
                    value: item._id,
                  }))}
                />
              </Form.Item>
            </div>
          ),
          show: showFilter,
          onShow: onShowFilter,
          onHide: onHideFilter,
          isApplyFilter,
          onFilter,
        }}
        loading={loading}
        scroll={{ x: 1300 }}
      />
      <QuestionForm
        show={showPopup === POPUP_TYPES.FORM}
        onHide={onHidePopup}
        callback={loadQuestions}
        id={questionSelected ? questionSelected._id : null}
      />
      <DownloadQuestions
        show={showPopup === POPUP_TYPES.DOWNLOAD_FILE}
        onHide={onHidePopup}
      />
      <ImportQuestions
        show={showPopup === POPUP_TYPES.UPLOAD_FILE}
        onHide={onHidePopup}
        callback={loadQuestions}
      />
    </>
  );
}

export default QuestionManagement;
