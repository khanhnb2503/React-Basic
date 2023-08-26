import React, { useCallback, useEffect, useState } from "react";
import Datatable, {
  LIST_PER_PAGE,
} from "../../../../components/shared-components/Datatable";
import { Button, Modal, notification, Space, Typography } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useTranslation } from "../../../../hooks/useTranslation";
import QuestionService from "../../../../services/QuestionService";
import QuestionCategoryForm from "../components/QuestionCategoryForm";
import { convertTreeDataIfExist } from "../../../../helpers/datatable.helper";

function QuestionCategory() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIST_PER_PAGE[0]);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [questionCategories, setQuestionCategories] = useState([]);
  const [questionSelected, setQuestionSelected] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const onShowForm = (category = null) => {
    setQuestionSelected(category);
    setShowPopup(true);
  };
  const onHideForm = () => {
    setQuestionSelected(null);
    setShowPopup(false);
  };

  const loadQuestionCategories = useCallback(() => {
    QuestionService.getCategories({ page, perPage, keyword }).then(
      ({ status, data, total }) => {
        if (status && data.length) {
          const categories = convertTreeDataIfExist(data, "items");
          setQuestionCategories(categories);
          setTotal(total);
        } else {
          setQuestionCategories([]);
        }
        setLoading(false);
      }
    );
  }, [page, perPage, keyword]);

  /*const rowSelection = {
    onChange: (keys, rows) => {
      setSelectedRowKeys(keys);
    },
    onSelect: (record, selected, selectedRows) => {
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows);
    },
    selectedRowKeys,
    checkStrictly: false,
  };*/

  // Delete once user
  const handleDeleteCategory = (category) => {
    Modal.confirm({
      title: t("Confirm to delete"),
      icon: <ExclamationCircleOutlined />,
      content: (
        <span>
          {t("Delete")} <b>{category.name}</b>?
        </span>
      ),
      okText: t("Confirm"),
      cancelText: t("Cancel"),
      onOk() {
        QuestionService.deleteCategory(category._id).then(({ status }) => {
          if (status) {
            loadQuestionCategories();
            notification.info({
              message: t("Successfully"),
              description: t("Deleted successfully"),
              placement: "topRight",
            });
          }
        });
      },
    });
  };

  const columns = [
    {
      title: t("NO"),
      key: "no",
      dataIndex: "key",
      width: 200,
      render: (key) => <Typography.Text code>{key}</Typography.Text>,
    },
    {
      title: t("Name"),
      dataIndex: "name",
      key: "name",
      childrenColumnName: "abc",
      render: (name) => (
        <Space>
          <Typography.Text>{name}</Typography.Text>
        </Space>
      ),
    },
    {
      title: t("Action"),
      width: 120,
      key: "action",
      render: (action, obj) => (
        <Space>
          <Button
            size="small"
            type="ghost"
            icon={<EditOutlined style={{ color: "#ff7a45" }} />}
            onClick={() => {
              onShowForm(obj);
            }}
          />
          {/*<Button*/}
          {/*  size="small"*/}
          {/*  type="ghost"*/}
          {/*  icon={<DeleteOutlined style={{ color: "#ff4d4f" }} />}*/}
          {/*  onClick={() => {*/}
          {/*    handleDeleteCategory(obj);*/}
          {/*  }}*/}
          {/*/>*/}
        </Space>
      ),
    },
  ];
  useEffect(() => {
    setLoading(true);
    loadQuestionCategories();
    // eslint-disable-next-line
  }, [page, perPage, keyword]);
  return (
    <>
      <Datatable
        columns={columns}
        dataSource={questionCategories}
        metadata={{
          perPage,
          setPerPage,
          page,
          setPage,
          total,
          keyword,
          setKeyword,
        }}
        loading={loading}
        showPagination
        showHeader
        hideSearch
        action={
          <Button
            type="primary"
            onClick={() => {
              onShowForm();
            }}
          >
            {t("Add")}
          </Button>
        }
      />
      <QuestionCategoryForm
        show={showPopup}
        onHide={onHideForm}
        callback={() => {
          onHideForm();
          loadQuestionCategories();
        }}
        id={questionSelected ? questionSelected._id : null}
        categories={questionCategories}
      />
    </>
  );
}

export default QuestionCategory;
