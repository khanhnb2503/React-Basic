import { Card, Col, Form, Row, Select, Typography } from "antd";
import RankingStatistic from "./RankingStatistic";
import React, { useCallback, useEffect, useState } from "react";
import DashboardService from "../../../../services/DashboardService";
import { useTranslation } from "../../../../hooks/useTranslation";
import moment from "moment";
import Flex from "../../../../components/shared-components/Flex";
import $ from "jquery";

const INITIAL_VALUES = {
  year: moment().year(),
  school: null,
  faculty: null,
  course: null,
};

function ChartUsageTime({ schools }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [rankChart, setRankChart] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [courses, setCourses] = useState([]);
  const [schoolSelected, setSchoolSelected] = useState(null);
  const [facultySelected, setFacultySelected] = useState(null);
  const [courseSelected, setCourseSelected] = useState(null);
  const [year, setYear] = useState(moment().year());
  const [loading, setLoading] = useState(false);

  const onFilterChart = () => {
    const legend = document.querySelector(`div[seriesname="${t("All")}"]`);
    if (legend) {
      $(legend).children().click();
    }
  };

  const onSelectSchool = (id) => {
    if (id) {
      const selected = schools.find((item) => item._id === id) || null;
      setFaculties(selected ? selected.items : []);
      form.resetFields(["faculty", "course"]);
    } else {
      setFaculties([]);
      setCourses([]);
      form.resetFields(["faculty", "course"]);
    }
    setSchoolSelected(id);
    setFacultySelected(null);
    setCourseSelected(null);
  };
  const onSelectFaculty = (id) => {
    if (id) {
      const selected = faculties.find((item) => item._id === id) || null;
      setCourses(selected ? selected.items : []);
      form.resetFields(["course"]);
    } else {
      setCourses([]);
      form.resetFields(["course"]);
    }
    setFacultySelected(id);
    setCourseSelected(null);

  };
  const onSelectCourse = (id) => {
    setCourseSelected(id);
  };

  const loadChart = useCallback(() => {
    setLoading(true);
    const legend = document.querySelector(`div[seriesname="${t("All")}"]`);
    if ($(legend).hasClass("apexcharts-inactive-legend")) {
      $(legend).children().click();
    }
    DashboardService.chartUsageTime({
      schools: schoolSelected,
      faculty: facultySelected,
      education_id: courseSelected,
      year,
    }).then((res) => {
      if (res.status && res.data) {
        setRankChart(res.data);
      }
      setLoading(false);
      if (schoolSelected) {
        onFilterChart();
      }
    });
  }, [schoolSelected, facultySelected, courseSelected, year]);
  useEffect(() => {
    loadChart();
  }, [schoolSelected, facultySelected, courseSelected, year]);
  return (
    <Card>
      <Form form={form} initialValues={INITIAL_VALUES}>
        <Row gutter={8}>
          <Col span={6}>
            <Form.Item name="year">
              <Select
                className="w-100"
                allowClear
                onClear={() => {
                  setYear(null);
                }}
                onChange={setYear}
                options={Array.from(new Array(10)).map((_, index) => ({
                  label: moment().year() - index,
                  value: moment().year() - index,
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="school">
              <Select
                className="w-100"
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
          </Col>
          <Col span={6}>
            <Form.Item name="faculty">
              <Select
                className="w-100"
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
          </Col>
          <Col span={6}>
            <Form.Item name="course">
              <Select
                className="w-100"
                allowClear
                onClear={() => {
                  onSelectCourse(null);
                }}
                onChange={onSelectCourse}
                options={courses.map((item) => ({
                  label: item.name,
                  value: item._id,
                }))}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <RankingStatistic
        rankData={rankChart}
        units={[
          { label: t("All"), key: "total" },
          { label: t("School"), key: "schools" },
          { label: t("Faculty"), key: "faculty" },
          { label: t("Education"), key: "year" },
        ]}
        type={t("Usage time")}
        loading={loading}
      />
      <Flex justifyContent="center">
        <Typography.Title level={5}>
          {t("Average usage time per month (monthly)")}
        </Typography.Title>
      </Flex>
    </Card>
  );
}

export default ChartUsageTime;
