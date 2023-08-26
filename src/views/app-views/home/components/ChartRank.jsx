import { Card, Col, Form, Row, Select, Typography } from "antd";
import RankingStatistic from "./RankingStatistic";
import React, { useCallback, useEffect, useState } from "react";
import DashboardService from "../../../../services/DashboardService";
import { useTranslation } from "../../../../hooks/useTranslation";
import moment from "moment";
import Flex from "../../../../components/shared-components/Flex";

const INITIAL_VALUES = {
  year: moment().year(),
  school: null,
  faculty: null,
  course: null,
};

function ChartRank({ schools }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [faculties, setFaculties] = useState([]);
  const [courses, setCourses] = useState([]);
  const [rankChart, setRankChart] = useState([]);
  const [schoolSelected, setSchoolSelected] = useState(null);
  const [facultySelected, setFacultySelected] = useState(null);
  const [courseSelected, setCourseSelected] = useState(null);
  const [year, setYear] = useState(moment().year());
  const [loading, setLoading] = useState(false);

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
    setCourseSelected(null);

    setFacultySelected(id);
  };
  const onSelectCourse = (id) => {
    setCourseSelected(id);
  };
  const loadChart = useCallback(() => {
    setLoading(true);
    DashboardService.chartStudy({
      schools: schoolSelected,
      faculty: facultySelected,
      education_id: courseSelected,
      year,
    }).then((res) => {
      if (res.status && res.data) {
        setRankChart(res.data);
      }
      setLoading(false);
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
          { label: "S", key: "S" },
          { label: "A", key: "A" },
          { label: "B", key: "B" },
          { label: "C", key: "C" },
          { label: "D", key: "D" },
          { label: "未実施", key: "G" },
        ]}
        type={t("Rank")}
        loading={loading}
      />
      <Flex justifyContent="center">
        <Typography.Title level={5}>
          {t("Comprehensive evaluation distribution by class")}
        </Typography.Title>
      </Flex>
    </Card>
  );
}

export default ChartRank;
