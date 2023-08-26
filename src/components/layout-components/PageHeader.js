import React from "react";
import AppBreadcrumb from "components/layout-components/AppBreadcrumb";
import { Space } from "antd";

export const PageHeader = ({ title, display }) => {
  return display ? (
    <Space direction="vertical">
      <AppBreadcrumb />
      {/*<h3 className="mb-0 mr-3 font-weight-semibold">*/}
      {/*  <IntlMessage id={title ? title : "Home"} />*/}
      {/*</h3>*/}
    </Space>
  ) : null;
};

export default PageHeader;
