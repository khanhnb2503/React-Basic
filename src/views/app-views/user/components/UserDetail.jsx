import UserForm from "./UserForm";
import { Col, Row, Modal, Typography, Table, Form, Spin } from "antd";
import { useTranslation } from "../../../../hooks/useTranslation";
import PropTypes from "prop-types";
import { UserRadarChart } from "./UserRadarChart";
import { useEffect, useState } from "react";
import UserService from "../../../../services/UserService";
import TimeHelper, {
  getTestTime,
  JapanTime,
} from "../../../../helpers/TimeHelper";
import styled from "styled-components";
import { isNumber } from "lodash";

const StyledTableReview = styled(Table)`
  thead {
    tr:first-child {
      th {
        background: #ebf3fb;
      }
    }

    tr:last-child {
      display: none;
    }
  }
`;

const testDataDefault = [
  {
    spend_times: null,
    score: null,
    created_at: null,
  },
];

function UserDetail(props) {
  const { t } = useTranslation();
  const { show, onHide, callback, id } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [testLasted, setTestLasted] = useState(testDataDefault);

  const onClose = () => {
    onHide();
    form.resetFields();
  };

  const loadUser = () => {
    if (id) {
      setTimeout(() => {
        UserService.detail(id).then(({ status, data }) => {
          setLoading(false);
          if (status && data) {
            setUser(data);
            setTestLasted(
              data?.aptitude_test?.length
                ? data.aptitude_test.sort((a, b) => a.created_at - b.created_at)
                : testDataDefault
            );
          }
        });
      }, 500);
    }
  };

  const columns = [
    {
      title: <Typography.Text>{t("Comprehensive")}</Typography.Text>,
      colSpan: 3,
      children: [
        {
          dataIndex: "name",
          key: "name",
          width: 150,
        },
        {
          dataIndex: "rank",
          key: "rank",
          width: 100,
          render: (rank, obj) => (
            <Typography.Text>{!obj.date ? "-" : rank}</Typography.Text>
          ),
        },
        {
          dataIndex: "date",
          key: "date",
          width: 100,
          render: (date) => (
            <Typography.Text>{JapanTime(date)}</Typography.Text>
          ),
        },
      ],
    },
  ];
  const testLastedColumns = [
    {
      title: <Typography.Text>{t("Ability diagnostic test")}</Typography.Text>,
      colSpan: 3,
      children: [
        {
          dataIndex: "spend_times",
          key: "spend_times",
          width: 150,
          render: (spend_times) => (
            <Typography.Text>
              {spend_times ? `${getTestTime(spend_times)}` : "-"}
            </Typography.Text>
          ),
        },
        {
          dataIndex: "score",
          key: "score",
          width: 100,
          render: (score) => (
            <Typography.Text>
              {isNumber(score) ? `${score}点` : "-"}
            </Typography.Text>
          ),
        },
        {
          dataIndex: "created_at",
          key: "created_at",
          width: 100,
          render: (date) => (
            <Typography.Text>{JapanTime(date)}</Typography.Text>
          ),
        },
      ],
    },
  ];

  useEffect(() => {
    setLoading(true);
    loadUser();
    // eslint-disable-next-line
  }, [id]);
  return (
    <Modal
      title={t("User detail")}
      onCancel={onClose}
      visible={show}
      width={1200}
      onOk={form.submit}
      okText={t("Update")}
    >
      <Spin spinning={loading} size="large">
        <Row>
          <Col span={8}>
            <UserForm
              callback={() => {
                onClose();
                callback();
              }}
              user={user}
              isDetail
              form={form}
              id={id}
              onHideModal={onClose}
            />
          </Col>
          <Col span={8}>
            <div className="d-flex flex-column justify-content-center align-items-center px-3">
              <Typography.Title keyboard level={3}>
                {t("Comprehensive")}
              </Typography.Title>
              <Typography.Title
                level={1}
                style={{ fontSize: 200, marginTop: 40, marginBottom: 10 }}
              >
                {user?.rank}
              </Typography.Title>
              <Typography.Title level={4} style={{ marginTop: 0 }}>
                {TimeHelper(user?.date_rank, {
                  outputDefault: "-",
                })}
              </Typography.Title>
            </div>
          </Col>
          <Col span={8}>
            <StyledTableReview
              columns={testLastedColumns}
              dataSource={testLasted}
              pagination={false}
              bordered
              scroll={{ y: 400, scrollToFirstRowOnChange: true }}
            />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <UserRadarChart
              dataset={user?.character_child_type || []}
              className="d-flex align-items-center h-100"
            />
          </Col>
          <Col span={12}>
            <StyledTableReview
              columns={columns}
              dataSource={user?.character_root_type}
              pagination={false}
              bordered
            />
          </Col>
        </Row>
      </Spin>
    </Modal>
  );
}

UserDetail.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  callback: PropTypes.func.isRequired,
  user: PropTypes.object,
};

export default UserDetail;
