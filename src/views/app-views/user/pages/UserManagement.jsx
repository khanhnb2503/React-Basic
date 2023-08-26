import React, { useEffect, useState } from "react";
import {
  Button,
  Row,
  Col,
  DatePicker,
  Form,
  Input,
  notification,
  Select,
  Space,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import {
  SyncOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

import Datatable, {
  LIST_PER_PAGE,
} from "../../../../components/shared-components/Datatable";
import UserService from "../../../../services/UserService";
import { useTranslation } from "../../../../hooks/useTranslation";
import { USER_STATUS } from "../constants";
import TimeHelper, { getUsageTime } from "../../../../helpers/TimeHelper";
import ImportUsers from "../components/ImportUsers";
import DownloadUserFile from "../components/DownloadUserFile";
import { DATE_FORMAT_YYYY_MM_DD } from "../../../../constants/DateConstant";
import UserCreate from "../components/UserCreate";
import UserDetail from "../components/UserDetail";
import moment from "moment";
import Confirm from "../../../../hooks/useConfirm";
import { useHistory, useLocation } from "react-router-dom";
import useEducation from "../../../../hooks/useEducation";
import clsx from "clsx";

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

const USER_FILTER_DEFAULT = {
  status: null,
  hightest_score: null,
  from_date: null,
  to_date: null,
  used_app: null,
};

function UserManagement() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [total, setTotal] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIST_PER_PAGE[0]);
  const [showFilter, setShowFilter] = useState(false);
  const [userActivating, setUserActivating] = useState(null);
  const [popupType, setPopupType] = useState(null);
  const [userSelected, setUserSelected] = useState(null);
  const [isApplyFilter, setIsApplyFilter] = useState(false);
  const [filter, setFilter] = useState(USER_FILTER_DEFAULT);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const location = useLocation();
  const history = useHistory();
  const searchParams = new URLSearchParams(location.search);
  const schoolId = searchParams.get("school") || null;
  const facultyId = searchParams.get("faculty") || null;
  const courseId = searchParams.get("course") || null;

  const { schools } = useEducation();
  const [faculties, setFaculties] = useState([]);
  const [educations, setEducations] = useState([]);

  const [schoolFilter, setschoolFilter] = useState(null);
  const [facultyFilter, setfacultyFilter] = useState(null);

  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadAvailable, setIsDownloadAvailable] = useState(true);

  const [formFilter] = Form.useForm();

  const onSelectSchool = (id) => {
    setIsDownloadAvailable(!!id);
    if (id) {
      setschoolFilter(id);
      const selected = schools.find((item) => item._id === id) || null;
      setFaculties(selected ? selected.items : []);
      formFilter.resetFields(["faculty"]);
    } else {
      setFaculties([]);
      setEducations([]);
      setschoolFilter(null);
      formFilter.resetFields(["faculty", "education_id"]);
    }
  };
  const onSelectFaculty = (id) => {
    if (id) {
      setfacultyFilter(id);
      const selected = faculties.find((item) => item._id === id) || null;
      setEducations(selected ? selected.items : []);
    } else {
      setEducations([]);
      setfacultyFilter(null);
      formFilter.resetFields(["education_id"]);
    }
  };

  // Callback load Users
  const loadUsers = () => {
    const initialParams = {
      page,
      limit: perPage,
      keyword,
      schools: schoolId || undefined,
      faculty: facultyId || undefined,
    };
    let params;
    if (
      Object.values(filter).find((keyValue) => keyValue) ||
      schoolId ||
      facultyId
    ) {
      setIsApplyFilter(true);
      params = {
        ...initialParams,
        ...filter,
      };
    } else {
      setIsApplyFilter(false);
      params = initialParams;
    }
    UserService.getUsers(params).then(({ status, total, data }) => {
      if (status && data) {
        setTotal(total);
        setUsers(data.map((i, index) => ({ ...i, key: index })));
      } else {
        setUsers([]);
      }
      setLoading(false);
    });
  };
  const onLoadCSV = () => {
    setIsDownloadAvailable(!!schoolFilter);
    console.log("onLoadCSV");
    const params = {
      schools: schoolFilter || undefined,
      faculty: facultyFilter || undefined,
    };
    // if(schoolFilterStatus == 1 && facultyFilterStatus == 1){
    if (schoolFilter) {
      setIsDownloading(true);
      UserService.FilterCSV(params).then((data, message) => {
        if (data.message === "done!") setIsDownloading(false);
        notification.success({ message: " ダウンロードに成功しました。" });
        formFilter.resetFields(["schools", "faculty", "education_id"]);
        setFaculties([]);
        setEducations([]);
        setschoolFilter(null);
        setfacultyFilter(null);
        window.open(data.data);
      });
    }
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
        loadUsers();
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
              loadUsers();
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

  const onShowFilter = () => {
    setShowFilter(true);
  };
  const onHideFilter = () => {
    setShowFilter(false);
  };
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
      width: 60,
      align: "center",
      render: (index) => index + 1,
    },
    {
      title: t("Full name"),
      dataIndex: "full_name",
      width: 120,
      align: "center",
    },
    {
      title: t("Personal ID"),
      dataIndex: "personal_id",
      width: 150,
      align: "center",
    },
    {
      title: t("Usage time"),
      dataIndex: "usage_time",
      width: 70,
      align: "center",
      render: (usage_time) => getUsageTime(usage_time),
    },
    {
      title: t("Rank"),
      dataIndex: "rank",
      width: 50,
      align: "center",
      render: (rank) => <Typography.Text>{rank || "-"}</Typography.Text>,
    },
    {
      title: <Typography.Text>{t("Number of test runs")}</Typography.Text>,
      children: [
        {
          title: t("Scapula Shoulder joint"),
          dataIndex: "question_type_main",
          width: 80,
          align: "center",
          render: (data) => (
            <Typography.Text>{data[0].number_test}</Typography.Text>
          ),
        },
        {
          title: t("Elbow joint wrist joint"),
          dataIndex: "question_type_main",
          width: 80,
          align: "center",
          render: (data) => (
            <Typography.Text>{data[1].number_test}</Typography.Text>
          ),
        },
        {
          title: t("Hip"),
          dataIndex: "question_type_main",
          width: 80,
          align: "center",
          render: (data) => (
            <Typography.Text>{data[2].number_test}</Typography.Text>
          ),
        },
        {
          title: t("Knee joint"),
          dataIndex: "question_type_main",
          width: 80,
          align: "center",
          render: (data) => (
            <Typography.Text>{data[3].number_test}</Typography.Text>
          ),
        },
        {
          title: t("Ankle joint"),
          dataIndex: "question_type_main",
          width: 80,
          align: "center",
          render: (data) => (
            <Typography.Text>{data[4].number_test}</Typography.Text>
          ),
        },
        {
          title: t("Spine"),
          dataIndex: "question_type_main",
          width: 80,
          align: "center",
          render: (data) => (
            <Typography.Text>{data[5].number_test}</Typography.Text>
          ),
        },
        {
          title: t("Proficiency test"),
          dataIndex: "question_type_main",
          width: 80,
          align: "center",
          className: "px-4",
          render: (data) => (
            <Typography.Text>{data[6].number_test}</Typography.Text>
          ),
        },
      ],
    },
    {
      title: t("Ability diagnosis highest score"),
      dataIndex: "hightest_score",
      width: 90,
      align: "center",
      render: (score) => <Typography.Text>{score || "-"}</Typography.Text>,
    },
    {
      title: t("Registration date"),
      dataIndex: "created_at",
      className: "px-2",
      width: 90,
      align: "center",
      render: (created_at) => <span>{TimeHelper(created_at)}</span>,
    },
    {
      title: t("Expiration Date"),
      dataIndex: "expiration_date",
      className: "px-2",
      width: 90,
      align: "center",
      render: (expiration_date) => <span>{TimeHelper(expiration_date)}</span>,
    },
    {
      title: t("Status"),
      dataIndex: "status",
      width: 140,
      align: "center",
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
      fixed: "right",
      align: "center",
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

  const onFilter = (values) => {
    setIsDownloadAvailable(true);
    console.log("values: ", values);
    if (values.schools) {
      searchParams.set("school", values.schools);
    } else {
      searchParams.delete("school");
    }
    if (values.faculty) {
      searchParams.set("faculty", values.faculty);
    } else {
      searchParams.delete("faculty");
    }
    if (values.education_id) {
      searchParams.set("course", values.education_id);
    } else {
      searchParams.delete("course");
    }
    if (values.schools || values.faculty) {
      history.replace({
        search: searchParams.toString(),
      });
    } else {
      history.replace({ search: "" });
    }
    let filterValues = {
      hightest_score: values.hightest_score || null,
      from_date: values.from_date ? TimeHelper(values.from_date) : null,
      to_date: values.to_date ? TimeHelper(values.to_date) : null,
      used_app:
        values.used_app === "unused"
          ? "0"
          : values.used_app === "used"
          ? "1"
          : null,
      status: values.status || null,
    };
    setFilter(filterValues);
    onHideFilter();
  };

  const onFilterClean = () => {
    setIsDownloadAvailable(true);
    setFromDate(null);
    setToDate(null);
    searchParams.delete("school");
    searchParams.delete("faculty");
    searchParams.delete("course");
    history.replace({ search: searchParams.toString() });
    onSelectSchool();
  };

  useEffect(() => {
    setLoading(true);
    loadUsers();
    // eslint-disable-next-line
  }, [page, perPage, keyword, filter, schoolId, facultyId]);
  useEffect(() => {
    if (keyword.length > 0) {
      setIsApplyFilter(true);
    }
  }, [keyword]);
  useEffect(() => {
    setSelectedRowKeys([]);
  }, [perPage]);
  useEffect(() => {
    if (schoolId || facultyId) {
      setIsApplyFilter(true);
    }
    const dataFilter = { schools: schoolId, faculty: facultyId };
    if (schoolId) {
      onSelectSchool(schoolId);
    }
    if (facultyId && schools) {
      onSelectFaculty(facultyId);
    }
    formFilter.setFieldsValue(dataFilter);
  }, [schoolId, facultyId, schools]);
  return (
    <>
      <Datatable
        formFilter={formFilter}
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
        dataSource={users}
        rowSelection={rowSelection}
        filter={{
          element: (
            <>
              <Form.Item label={t("Status")} name="status">
                <Select clearIcon>
                  <Select.Option value={undefined}>{t("All")}</Select.Option>
                  <Select.Option value={USER_STATUS.ACTIVE}>
                    {t("Active")}
                  </Select.Option>
                  <Select.Option value={USER_STATUS.INACTIVE}>
                    {t("Inactive")}
                  </Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label={t("Highest score")} name="hightest_score">
                <Input type="number" min={0} max={100} />
              </Form.Item>
              <Input.Group>
                <Form.Item label={t("From")} name="from_date">
                  <DatePicker
                    bordered
                    format={DATE_FORMAT_YYYY_MM_DD}
                    placeholder={DATE_FORMAT_YYYY_MM_DD}
                    mode="date"
                    onChange={(date) => {
                      setFromDate(date);
                    }}
                    disabledDate={(current) => {
                      return toDate ? moment(toDate) < current : false;
                    }}
                    className="w-100"
                  />
                </Form.Item>
                <Form.Item label={t("To")} name="to_date">
                  <DatePicker
                    bordered
                    format={DATE_FORMAT_YYYY_MM_DD}
                    placeholder={DATE_FORMAT_YYYY_MM_DD}
                    mode="date"
                    onChange={(date) => {
                      setToDate(date);
                    }}
                    disabledDate={(current) => {
                      return fromDate ? current < moment(fromDate) : false;
                    }}
                    className="w-100"
                  />
                </Form.Item>
              </Input.Group>
              <Form.Item label={t("Used the App")} name="used_app">
                <Select>
                  <Select.Option value={null}>{t("All")}</Select.Option>
                  <Select.Option value="used">
                    {t("Using the app")}
                  </Select.Option>
                  <Select.Option value="unused">
                    {t("Having not used the app yet")}
                  </Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="schools"
                label={t("School")}
                className={clsx({
                  "ant-form-item-has-error": !isDownloadAvailable,
                })}
                help={
                  !isDownloadAvailable ? (
                    <Typography.Text style={{ color: "red", fontSize: "12px" }}>
                      学校名を選択して下さい。
                    </Typography.Text>
                  ) : (
                    ""
                  )
                }
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
              <Form.Item name="faculty" label={t("Faculty")}>
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
              <Form.Item name="education_id" label={t("Education")}>
                <Select
                  allowClear
                  options={educations.map((item) => ({
                    label: item.name,
                    value: item._id,
                  }))}
                />
              </Form.Item>
            </>
          ),
          screen: "userManagement",
          show: showFilter,
          onShow: onShowFilter,
          onHide: onHideFilter,
          isApplyFilter,
          onFilter,
          onFilterClean,
          onLoadCSV,
          isDownloading,
        }}
        loading={loading}
        scroll={{ x: 1300 }}
      />
      <UserCreate
        show={popupType === POPUP_TYPES.FORM_CREATE}
        onHide={onHidePopup}
        callback={() => {
          onHidePopup();
          loadUsers();
        }}
        roleCreate="user"
      />
      <UserDetail
        show={popupType === POPUP_TYPES.DETAIL}
        onHide={onHidePopup}
        callback={loadUsers}
        id={userSelected ? userSelected._id : null}
      />
      <ImportUsers
        show={popupType === POPUP_TYPES.UPLOAD_FILE}
        onHide={onHidePopup}
        callback={loadUsers}
      />
      <DownloadUserFile
        show={popupType === POPUP_TYPES.DOWNLOAD_FILE}
        onHide={onHidePopup}
      />
    </>
  );
}

export default UserManagement;
