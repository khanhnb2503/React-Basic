import React, { useCallback, useEffect, useState } from "react";
import { Row, Col } from "antd";
import DataDisplayWidget from "../../../components/shared-components/DataDisplayWidget";
import {
  FileTextOutlined,
  FolderOpenOutlined,
  QuestionCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useTranslation } from "../../../hooks/useTranslation";
import DashboardService from "../../../services/DashboardService";
import ChartUsageTime from "./components/ChartUsageTime";
import ChartRank from "./components/ChartRank";
import useEducation from "../../../hooks/useEducation";

const Home = () => {
  const { t } = useTranslation();
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalFeedbacks, setTotalFeedbacks] = useState(0);
  const [loadingTotal, setLoadingTotal] = useState(false);
  const { schools } = useEducation();

  const loadAnalytics = useCallback(() => {
    setLoadingTotal(true);
    DashboardService.analytics().then((res) => {
      if (res.status && res.data) {
        const {
          number_users,
          number_feedbacks,
          number_questions,
          number_question_categorys,
        } = res.data;
        setTotalUsers(number_users);
        setTotalQuestions(number_questions);
        setTotalFeedbacks(number_feedbacks);
        setTotalCategories(number_question_categorys);
      }
      setLoadingTotal(false);
    });
  }, []);
  useEffect(() => {
    loadAnalytics();
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={12} lg={6} xl={6} xxl={6}>
          <DataDisplayWidget
            icon={<UserOutlined />}
            value={totalUsers}
            title={t("Number of users")}
            color="cyan"
            vertical={true}
            avatarSize={55}
            loading={loadingTotal}
          />
        </Col>
        <Col xs={24} sm={24} md={12} lg={6} xl={6} xxl={6}>
          <DataDisplayWidget
            icon={<QuestionCircleOutlined />}
            value={totalQuestions}
            title={t("Number of questions")}
            color="gold"
            vertical={true}
            avatarSize={55}
            loading={loadingTotal}
          />
        </Col>
        <Col xs={24} sm={24} md={12} lg={6} xl={6} xxl={6}>
          <DataDisplayWidget
            icon={<FolderOpenOutlined />}
            value={totalCategories}
            title={t("Number of question categories")}
            color="blue"
            vertical={true}
            avatarSize={55}
            loading={loadingTotal}
          />
        </Col>
        <Col xs={24} sm={24} md={12} lg={6} xl={6} xxl={6}>
          <DataDisplayWidget
            icon={<FileTextOutlined />}
            value={totalFeedbacks}
            title={t("Number of feedbacks")}
            color="volcano"
            vertical={true}
            avatarSize={55}
            loading={loadingTotal}
          />
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
          <ChartUsageTime schools={schools} />
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
          <ChartRank schools={schools} />
        </Col>
      </Row>
    </>
  );
};

export default Home;
