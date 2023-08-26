import React, { Component, useEffect, useState } from "react";
import { Link, useHistory, useLocation, withRouter } from "react-router-dom";
import { Breadcrumb } from "antd";
import navigationConfig from "configs/NavigationConfig";
import IntlMessage from "components/util-components/IntlMessage";
import { HomeOutlined } from "@ant-design/icons";
import useEducation from "../../hooks/useEducation";

let breadcrumbData = {
  "/app": <IntlMessage id="Home" />,
};

navigationConfig.forEach((elm, i) => {
  const assignBreadcrumb = (obj) =>
    (breadcrumbData[obj.path] = <IntlMessage id={obj.title} />);
  assignBreadcrumb(elm);
  if (elm.submenu) {
    elm.submenu.forEach((elm) => {
      assignBreadcrumb(elm);
      if (elm.submenu) {
        elm.submenu.forEach((elm) => {
          assignBreadcrumb(elm);
        });
      }
    });
  }
});

const BreadcrumbRoute = withRouter((props) => {
  const { location } = props;
  const searchParams = new URLSearchParams(location.search);
  const { schools } = useEducation();
  const [faculties, setFaculties] = useState([]);
  const [educations, setEducations] = useState([]);
  const [schoolSelected, setSchoolSelected] = useState(null);
  const [facultySelected, setFacultySelected] = useState(null);
  const [courseSelected, setCourseSelected] = useState(null);
  const schoolId = searchParams.get("school") || null;
  const facultyId = searchParams.get("faculty") || null;
  const courseId = searchParams.get("course") || null;

  const pathSnippets = location.pathname.split("/").filter((i) => i);
  const buildBreadcrumb = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
    return (
      <Breadcrumb.Item key={url}>
        <Link to={url}>{breadcrumbData[url]}</Link>
      </Breadcrumb.Item>
    );
  });

  // Education selected
  useEffect(() => {
    if (schoolId) {
      const find = schools.find((item) => item._id === schoolId);
      if (find) {
        setFaculties(find.items);
        setSchoolSelected(find);
      } else {
        setFaculties([]);
      }
    } else {
      setSchoolSelected(null);
      setFaculties([]);
    }
  }, [schoolId, schools]);
  useEffect(() => {
    if (facultyId) {
      const find = faculties.find((item) => item._id === facultyId);
      if (find) {
        setEducations(find.items);
        setFacultySelected(find);
      } else {
        setEducations([]);
      }
    } else {
      setFacultySelected(null);
      setEducations([]);
    }
  }, [facultyId, faculties]);
  useEffect(() => {
    if (courseId) {
      const find = educations.find((item) => item._id === courseId);
      if (find) {
        setCourseSelected(find);
      }
    } else {
      setCourseSelected(null);
    }
  }, [courseId, educations]);
  return (
    <Breadcrumb>
      <Breadcrumb.Item>
        <HomeOutlined />
      </Breadcrumb.Item>
      {buildBreadcrumb}
      {schoolSelected && (
        <Breadcrumb.Item>
          <span>{schoolSelected.name}</span>
        </Breadcrumb.Item>
      )}
      {facultySelected && (
        <Breadcrumb.Item>
          <span>{facultySelected.name}</span>
        </Breadcrumb.Item>
      )}
      {courseSelected && (
        <Breadcrumb.Item>
          <span>{courseSelected.name}</span>
        </Breadcrumb.Item>
      )}
    </Breadcrumb>
  );
});

export class AppBreadcrumb extends Component {
  render() {
    return <BreadcrumbRoute />;
  }
}

export default AppBreadcrumb;
