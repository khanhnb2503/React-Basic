import Datatable, {
  LIST_PER_PAGE,
} from "../../../components/shared-components/Datatable";
import { useTranslation } from "hooks/useTranslation";
import React, { useCallback, useEffect, useState } from "react";
import {
  Card,
  Button,
  Typography,
  Space,
  notification,
  Form,
  Input,
} from "antd";
import EmailService from "services/EmailService";
import { DeleteOutlined } from "@ant-design/icons";
import Confirm from "hooks/useConfirm";
import TimeHelper from "helpers/TimeHelper";
function PageSendEmail() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIST_PER_PAGE[0]);
  const [loading, setLoading] = useState(false);

  const [total, setTotal] = useState(0);
  const [listEmail, setListEmail] = useState([]);
  const [deleting, setDeleting] = useState(false);

  const handlerSubmit = () => {
    EmailService.createEmails(defaultValues).then((res) => {
      if (res.data.length > 0) {
        loadDataEmail();
        setDefaultValues([]);
      } else if (res.data === "No item to add list res") {
        notification.error({
          message: res.data,
        });
      }
    });
  };
  const loadDataEmail = () => {
    EmailService.getListEmail({
      page,
      limit: perPage,
    }).then((res) => {
      if (res.status) {
        setListEmail(res.data.map((i, index) => ({ ...i, key: index })));
        setTotal(res.total);
      } else {
        setListEmail([]);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    loadDataEmail();
  }, [page]);
  const onDeleteEmail = (dataEmail) => {
    Confirm(
      dataEmail && t("Delete {name}", { name: dataEmail.email }),
      () => {
        if (!dataEmail) {
          setDeleting(true);
        }
        EmailService.deleteEmail(dataEmail._id).then((res) => {
          if (res.status) {
            loadDataEmail();
            notification.info({
              message: t("Successfully"),
              description:
                dataEmail && t("Deleted {name}", { name: dataEmail.email }),
              placement: "topRight",
            });
          }
          setLoading(false);
          setDeleting(false);
        });
      },
      t
    );
  };
  const columns = [
    {
      title: t("NO"),
      dataIndex: "key",
      width: 60,
      render: (index) => index + 1,
    },
    {
      title: t("Email"),
      dataIndex: "email",
      render: (email) => (
        <Typography.Text>{email ? email : "-"}</Typography.Text>
      ),
    },
    {
      title: t("Register date"),
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at) => TimeHelper(created_at),
    },
    {
      title: t("Action"),
      width: 120,
      fixed: "right",
      render: (action, obj) => (
        <Space align="center">
          <Button
            size="small"
            type="ghost"
            icon={<DeleteOutlined style={{ color: "#ff4d4f" }} />}
            onClick={() => {
              onDeleteEmail(obj);
            }}
            loading={deleting}
          />
        </Space>
      ),
    },
  ];

  const [defaultValues, setDefaultValues] = useState([]);

  const handleClickKeywordRemove = (keyword) => {
    const values = defaultValues.filter((val) => val !== keyword);
    setDefaultValues(values);
  };
  const [validateEmail, setValidateEmail] = useState({
    status: false,
    title: "",
  });
  const handleKeywordAdd = (e) => {
    const { value } = e.target;
    let status = true;
    let checkSpaces = /^\s+$/.test(value);
    let isEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
    if (
      !defaultValues.includes(value) &&
      e.keyCode === 32 &&
      value !== "" &&
      isEmail
    ) {
      setDefaultValues([...defaultValues, value]);
      e.target.value = null;
      setValidateEmail({
        status: false,
        title: "",
      });
    } else if (value === "") {
      status = false;
      setValidateEmail({
        status: true,
        title: "メールアドレスを入力してください",
      });
    } else if (checkSpaces) {
      status = false;
      setValidateEmail({
        status: true,
        title: "space",
      });
    } else if (!isEmail) {
      status = false;
      setValidateEmail({
        status: true,
        title: "メールアドレスは有効なemailではありません",
      });
    } else {
      status = true;
      setValidateEmail({
        status: false,
        title: "",
      });
    }
    return status;
  };
  return (
    <>
      <Card
        title="フィードバック通知のメールアドレスのページ"
        style={{ width: "100%" }}
      >
        <div className="tags-input mb-3">
          <ul id="tags">
            {defaultValues.map((value, index) => (
              <li className="tag" key={index}>
                <span className="tag-title">{value}</span>
                <span
                  className="tag-close-icon"
                  onClick={() => handleClickKeywordRemove(value)}
                >
                  &times;
                </span>
              </li>
            ))}
          </ul>
          <input
            type="email"
            onKeyUp={(e) => handleKeywordAdd(e)}
            placeholder="メールアドレスを入力してください"
            // onKeyPress={e => e.key === "Enter" && e.preventDefault()}
          />
        </div>
        <div>
          {validateEmail.status && (
            <p style={{ color: "#ff6b72" }}>{validateEmail.title}</p>
          )}
        </div>
        <div className="btn-right-submitEmail">
          <Button
            type="primary"
            onClick={handlerSubmit}
            disabled={defaultValues.length === 0}
          >
            追加
          </Button>
        </div>
      </Card>
      <Datatable
        columns={columns}
        dataSource={listEmail}
        metadata={{ page, setPage, total, perPage, setPerPage }}
        loading={loading}
        scroll={{ x: 1300 }}
        // showHeader
        showPagination
        // hideSearch
        action={null}
      />
    </>
  );
}

export default PageSendEmail;
