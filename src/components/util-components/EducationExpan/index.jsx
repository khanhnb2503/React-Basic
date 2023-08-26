import { useTranslation } from "../../../hooks/useTranslation";
import { Col, Drawer, Row, Space, Typography } from "antd";
import "./style.scss";
import { Link } from "react-router-dom";
import useEducation from "../../../hooks/useEducation";

function EducationExpand({ show, onHide }) {
  const { t } = useTranslation();
  const { schools } = useEducation();
  console.log("education: ", { schools });
  return (
    <Drawer
      title={t("Education")}
      placement="right"
      visible={show}
      onClose={onHide}
      size="default"
      getContainer={false}
      className="education-drawer"
      closable
    >
      <Row gutter={8}>
        {schools.map((school, index) => (
          <Col sm={24} md={12} lg={6} key={`school-${index}`} className="mb-3">
            <Space direction="vertical">
              <Link
                to={{ pathname: "/app/user", search: `school=${school._id}` }}
                onClick={onHide}
              >
                <Typography.Text strong type="danger">
                  {school.name}
                </Typography.Text>
              </Link>
              <Space direction="vertical" className="text-left">
                {school.items.map((faculty, indexFaculty) => (
                  <Link
                    to={{
                      pathname: "/app/user",
                      search: `school=${school._id}&faculty=${faculty._id}`,
                    }}
                    key={`falcuty-${indexFaculty}`}
                    onClick={onHide}
                  >
                    <Typography>{faculty.name}</Typography>
                  </Link>
                ))}
              </Space>
            </Space>
          </Col>
        ))}
      </Row>
    </Drawer>
  );
}

export default EducationExpand;
