import { useTranslation } from "../../../../hooks/useTranslation";
import React, { useEffect, useState } from "react";
import Datatable, {
  LIST_PER_PAGE,
} from "../../../../components/shared-components/Datatable";
import { Button, notification, Space, Tag } from "antd";
import UserService from "../../../../services/UserService";
import { USER_STATUS } from "../constants";
import { DeleteOutlined, EditOutlined, SyncOutlined } from "@ant-design/icons";
import MentorForm from "../components/MentorForm";
import Confirm from "../../../../hooks/useConfirm";

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

const POPUP_TYPES = {
  FORM_CREATE: "FORM_CREATE",
  UPLOAD_FILE: "UPLOAD_FILE",
  DOWNLOAD_FILE: "DOWNLOAD_FILE",
  DETAIL: "DETAIL",
};

function MentorManagement() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [total, setTotal] = useState(1);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIST_PER_PAGE[0]);
  const [userActivating, setUserActivating] = useState(null);
  const [popupType, setPopupType] = useState(null);
  const [userSelected, setUserSelected] = useState(null);

  // Callback load Users
  const loadMentors = () => {
    const params = {
      page,
      limit: perPage,
    };
    UserService.getMentors(params).then(({ status, total, data }) => {
      if (status && data) {
        setTotal(total);
        setUsers(data.map((i, index) => ({ ...i, key: index })));
      } else {
        setUsers([]);
      }
      setLoading(false);
    });
  };

  // Update user status
  const handleUpdateUserStatus = (user) => {
    const { _id, status } = user;
    if (status === USER_STATUS.SUSPEND) {
      return;
    }
    setUserActivating(user._id);
    UserService.updateStatus(
      _id,
      status === USER_STATUS.ACTIVE ? USER_STATUS.INACTIVE : USER_STATUS.ACTIVE
    ).then(({ status }) => {
      if (status) {
        loadMentors();
        setUserActivating(null);
      }
    });
  };

  // Handle delete
  const handleDelete = (user) => {
    const ids = user
      ? [user._id]
      : selectedRowKeys.map((key) => users[key]._id);
    if (ids.length > 0) {
      Confirm(
        user
          ? t("Delete {name}", { name: user.full_name })
          : t("Delete {count} items", { count: ids.length }),
        () => {
          if (!user) {
            setDeleting(true);
          }
          UserService.deleteMany(ids).then(({ status }) => {
            if (status) {
              loadMentors();
              notification.info({
                message: t("Successfully"),
                description: user
                  ? t("Deleted {name}", { name: user.full_name })
                  : t("Deleted {count} items", { count: ids.length }),
                placement: "topRight",
              });
              setSelectedRowKeys([]);
            }
            setDeleting(false);
          });
        },
        t
      );
    }
  };

  // On select users
  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;
  const onShowPopup = (type, user = null) => {
    setUserSelected(user);
    setPopupType(type);
  };
  const onHidePopup = () => {
    setUserSelected(null);
    setPopupType(null);
  };

  // Define column table
  const columns = [
    {
      title: t("NO"),
      dataIndex: "key",
      width: 50,
      render: (index) => index + 1,
    },
    {
      title: t("Full name"),
      dataIndex: "full_name",
    },
    {
      title: t("Username"),
      dataIndex: "username",
    },
    {
      title: t("Email"),
      dataIndex: "email",
      width: 250,
    },
    {
      title: t("Status"),
      width: 140,
      dataIndex: "status",
      render: (status) => (
        <Tag color={pickColor(status)}>
          {status === USER_STATUS.ACTIVE ? t("Active") : t("Inactive")}
        </Tag>
      ),
    },
    {
      title: t("Action"),
      dataIndex: "action",
      width: 150,
      render: (action, ob) => (
        <Space>
          <Button
            size="small"
            type="ghost"
            icon={
              <SyncOutlined
                style={{ color: "#36cfc9", height: 14 }}
                spin={userActivating === ob._id}
              />
            }
            onClick={() => {
              handleUpdateUserStatus(ob);
            }}
            disabled={userActivating}
          />
          <Button
            size="small"
            type="ghost"
            icon={<EditOutlined style={{ color: "#ff7a45" }} />}
            onClick={() => {
              onShowPopup(POPUP_TYPES.DETAIL, ob);
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
    loadMentors();
    // eslint-disable-next-line
  }, [page, perPage]);
  return (
    <>
      <Datatable
        metadata={{ perPage, setPerPage, page, setPage, total }}
        showPagination
        showHeader
        hideSearch
        action={
          <div
            className="d-flex justify-content-between"
            style={{ marginBottom: 16 }}
          >
            <Space>
              <Button
                type="primary"
                onClick={() => {
                  handleDelete();
                }}
                disabled={!hasSelected}
                loading={deleting}
                danger
              >
                {`${t("Delete all")} ${
                  selectedRowKeys.length ? `(${selectedRowKeys.length})` : ""
                }`}
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  onShowPopup(POPUP_TYPES.FORM_CREATE);
                }}
              >
                {t("Add")}
              </Button>
            </Space>
          </div>
        }
        columns={columns}
        dataSource={users}
        rowSelection={rowSelection}
        loading={loading}
      />
      <MentorForm
        show={[POPUP_TYPES.FORM_CREATE, POPUP_TYPES.DETAIL].includes(popupType)}
        onHide={onHidePopup}
        callback={loadMentors}
        id={userSelected ? userSelected._id : null}
      />
    </>
  );
}

export default MentorManagement;
