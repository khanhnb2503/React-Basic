import Datatable, {
  LIST_PER_PAGE,
} from "../../../../components/shared-components/Datatable";
import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Form,
  notification,
  Select,
  Space,
  Tooltip,
  Typography,
} from "antd";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  SendOutlined,
} from "@ant-design/icons";
import FeedbackService from "../../../../services/FeedbackService";
import TimeHelper from "../../../../helpers/TimeHelper";
import Flex from "../../../../components/shared-components/Flex";
import SendFeedback from "../components/SendFeedback";
import { useTranslation } from "../../../../hooks/useTranslation";
import Confirm from "../../../../hooks/useConfirm";
const { Option } = Select;
const POPUP_TYPES = {
  SEND_FEEDBACK: "send-feedback",
  DELETE_FEEDBACK: "delete-feedback",
};
function FeedbackManagement() {
  const { t } = useTranslation();
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [perPage, setPerPage] = useState(LIST_PER_PAGE[0]);
  const [sort, setSort] = useState({ field: null, value: null });
  const [popupType, setPopupType] = useState(null);
  const [feedbackSelected, setFeedbackSelected] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Callback load Users
  const loadFeedbacks = useCallback(() => {
    FeedbackService.getFeedbacks({
      page,
      limit: perPage,
      sort_user: sort.field === "user" ? sort.value : undefined,
      sort_answer: sort.field === "answer" ? sort.value : undefined,
    }).then(({ status, total, data }) => {
      if (status && data.length) {
        setTotal(total);
        setFeedbacks(data.map((i, index) => ({ ...i, key: index })));
      } else {
        setFeedbacks([]);
      }
      setLoading(false);
    });
  }, [page, perPage, sort.field, sort.value]);

  // On change sort
  const onChangeSort = (string) => {
    const [field, value] = string.split("_");
    setSort({ field, value });
  };

  // On select users
  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const onShowPopup = (type, obj = null) => {
    setPopupType(type);
    setFeedbackSelected(obj);
  };
  const onHidePopup = () => {
    setPopupType(null);
    setFeedbackSelected(null);
  };

  const onDeleteFeedback = (id) => {
    let ids = [];
    if (id) {
      ids = [id];
    } else if (selectedRowKeys.length > 0) {
      ids = selectedRowKeys.map((i) => feedbacks[i]._id);
    }
    if (ids.length > 0) {
      Confirm(
        id
          ? t("Delete feedback. Are you sure?")
          : t("Delete {count} feedbacks. Are you sure?", {
              count: ids.length,
            }),
        () => {
          if (!id) {
            setDeleting(true);
          }
          FeedbackService.deleteMany(ids).then((res) => {
            if (res.status) {
              notification.info({
                message: t("Successfully"),
                description: t("Deleted successfully"),
                placement: "topRight",
              });
            }
            setSelectedRowKeys([]);
            onHidePopup();
            loadFeedbacks();
            setDeleting(false);
          });
        },
        t
      );
    }
  };

  const columns = [
    {
      title: t("NO"),
      dataIndex: "key",
      width: 60,
      render: (index) => index + 1,
    },
    {
      title: t("User"),
      dataIndex: "user_id",
      render: (user) => (
        <Typography.Text>{user ? user?.full_name : "-"}</Typography.Text>
      ),
    },
    {
      title: t("Feedback"),
      dataIndex: "question",
      width: "25%",
    },
    {
      title: t("Question Date"),
      dataIndex: "created_at",
      render: (created_at) => (
        <Typography.Text>{TimeHelper(created_at)}</Typography.Text>
      ),
    },
    {
      title: t("Answer"),
      dataIndex: "answer",
      width: "25%",
      render: (answer) => <div dangerouslySetInnerHTML={{ __html: answer }} />,
    },
    {
      title: t("Answer Date"),
      dataIndex: "updated_at",
      render: (updated_at) => (
        <Typography.Text>
          {updated_at ? TimeHelper(updated_at) : ""}
        </Typography.Text>
      ),
    },
    {
      title: t("Action"),
      width: 120,
      fixed: "right",
      render: (action, obj) => (
        <Space align="center">
          <Tooltip title={t("Reply feedback")}>
            <Button
              size="small"
              type="ghost"
              icon={<SendOutlined style={{ color: "#36cfc9", height: 14 }} />}
              onClick={() => {
                onShowPopup(POPUP_TYPES.SEND_FEEDBACK, obj);
              }}
            />
          </Tooltip>
          <Button
            size="small"
            type="ghost"
            icon={<DeleteOutlined style={{ color: "#ff4d4f" }} />}
            onClick={() => {
              onDeleteFeedback(obj._id);
            }}
          />
        </Space>
      ),
    },
  ];
  useEffect(() => {
    loadFeedbacks();
    // eslint-disable-next-line
  }, [page, perPage, sort.field, sort.value]);
  return (
    <>
      <Datatable
        columns={columns}
        dataSource={feedbacks}
        metadata={{ page, setPage, total, perPage, setPerPage }}
        loading={loading}
        scroll={{ x: 1300 }}
        showHeader
        showPagination
        rowSelection={rowSelection}
        hideSearch
        action={
          <Flex justifyContent="between">
            <Button
              type="primary"
              danger
              disabled={!selectedRowKeys.length}
              onClick={() => {
                onDeleteFeedback();
              }}
              loading={deleting}
            >
              {t("Delete all")}{" "}
              {selectedRowKeys.length ? `(${selectedRowKeys.length})` : ""}
            </Button>
            <Space>
              <Form.Item label="Sort">
                <Select
                  style={{ minWidth: 100 }}
                  defaultValue=""
                  onChange={onChangeSort}
                >
                  <Option value="">{t("Un sort")}</Option>
                  <Option value="user_1">
                    {t("User")} <ArrowDownOutlined />
                  </Option>
                  <Option value="user_-1">
                    {t("User")} <ArrowUpOutlined />
                  </Option>
                  <Option value="answer_1">
                    {t("Answer")} <ArrowDownOutlined />
                  </Option>
                  <Option value="answer_-1">
                    {t("Answer")} <ArrowUpOutlined />
                  </Option>
                </Select>
              </Form.Item>
            </Space>
          </Flex>
        }
      />
      <SendFeedback
        show={popupType === POPUP_TYPES.SEND_FEEDBACK}
        onHide={onHidePopup}
        callback={() => {
          loadFeedbacks();
          onHidePopup();
        }}
        id={feedbackSelected ? feedbackSelected._id : null}
      />
    </>
  );
}

export default FeedbackManagement;
