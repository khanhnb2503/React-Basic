import React, { useCallback, useEffect, useState } from "react";
import Datatable, {
  LIST_PER_PAGE,
} from "../../../../components/shared-components/Datatable";
import EducationService from "../../../../services/EducationService";
import { convertTreeDataIfExist } from "../../../../helpers/datatable.helper";
import { useTranslation } from "../../../../hooks/useTranslation";
import TimeHelper from "../../../../helpers/TimeHelper";
import { Button, notification, Space, Tag, Typography } from "antd";
import EducationForm from "../components/EducationForm";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Confirm from "../../../../hooks/useConfirm";
import useEducation from "../../../../hooks/useEducation";

const pickColor = (input) => {
  let color = "green";

  if (input === 1) {
    color = "volcano";
  }

  if (input === 2) {
    color = "magenta";
  }

  return color;
};

const POPUP_TYPES = {
  FORM: "form",
};

function EducationManagement() {
  const { t } = useTranslation();
  const [educations, setEducations] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIST_PER_PAGE[0]);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [popupType, setPopupType] = useState(null);
  const [idSelected, setIdSelected] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { loadSchools } = useEducation();

  const loadEducation = useCallback(() => {
    setLoading(true);
    EducationService.list({ page, limit: perPage }).then(
      ({ status, data, total }) => {
        if (status && data.length) {
          const list = convertTreeDataIfExist(data, "items");
          setEducations(list);
          setTotal(total);
        } else {
          setEducations([]);
        }
        setLoading(false);
      }
    );
  }, [page, perPage]);

  const handleDelete = (id) => {
    setIdSelected(id);
    Confirm(
      t("Delete education?"),
      () => {
        if (!id) {
          setDeleting(true);
        }
        EducationService.delete(id).then((res) => {
          if (res.status) {
            notification.info({
              message: t("Successfully"),
              description: t("Deleted successfully"),
              placement: "topRight",
            });
          }
          onHidePopup();
          loadEducation();
          setDeleting(false);
          setIdSelected(null);
          loadSchools();
        });
      },
      t
    );
  };

  const onShowPopup = (type, id) => {
    if (id) {
      setIdSelected(id);
    }
    setPopupType(type);
  };
  const onHidePopup = () => {
    setPopupType(null);
    setIdSelected(null);
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
    },
    {
      title: t("Code"),
      dataIndex: "code",
      key: "code",
      render: (code, obj) => <Tag color={pickColor(obj.type)}>{code}</Tag>,
    },
    {
      title: t("Number of students"),
      dataIndex: "number",
      key: "number",
      render: (number) => <Typography>{number || 0}</Typography>,
    },
    {
      title: t("Register date"),
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at) => TimeHelper(created_at),
    },
    {
      title: t("Action"),
      key: "action",
      render: (_, obj) => (
        <Space align="center">
          <Button
            size="small"
            type="ghost"
            icon={<EditOutlined style={{ color: "#ff7a45" }} />}
            onClick={() => {
              onShowPopup(POPUP_TYPES.FORM, obj._id);
            }}
          />
          {obj.number === 0 && (
            <Button
              size="small"
              type="ghost"
              icon={<DeleteOutlined style={{ color: "#ff4d4f" }} />}
              loading={deleting && idSelected === obj._id}
              onClick={() => {
                handleDelete(obj._id);
              }}
            />
          )}
        </Space>
      ),
    },
  ];

  useEffect(() => {
    loadEducation();
  }, [page, perPage]);
  return (
    <>
      <Datatable
        columns={columns}
        dataSource={educations}
        loading={loading}
        showPagination
        showHeader
        hideSearch
        metadata={{
          perPage,
          setPerPage,
          page,
          setPage,
          total,
          keyword,
          setKeyword,
        }}
        action={
          <Button type="primary" onClick={() => onShowPopup(POPUP_TYPES.FORM)}>
            {t("Add")}
          </Button>
        }
      />
      <EducationForm
        show={popupType === POPUP_TYPES.FORM}
        onHide={onHidePopup}
        callback={loadEducation}
        educations={educations}
        id={idSelected}
      />
    </>
  );
}

export default EducationManagement;
