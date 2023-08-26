import { Button, Col, Form, Input, Row, Select, Space, Tooltip } from "antd";
import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "../../../hooks/useTranslation";
import { ClearOutlined, FilterOutlined } from "@ant-design/icons";
import { LIST_PER_PAGE } from "./index";

function TableFilter(props) {
  const {
    pagination,
    setKeyword,
    onShowFilter,
    isApplyFilter,
    onClearFilter,
    hideSearch,
    setPage,
  } = props;
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const onFinish = (values) => {
    if (setKeyword) {
      setKeyword(values.keyword ? values.keyword.trim() : "");
      setPage(1);
    }
  };

  const onSelectPerPage = (value) => {
    if (value !== pagination.perPage && setPage) {
      setPage(1);
    }
    pagination.setPerPage(value);
  };
  const handleClearFilter = () => {
    onClearFilter();
    form.resetFields();
    form.submit();
  };
  return (
    <>
      <section>
        <Form
          layout="vertical"
          form={form}
          name="control-hooks"
          onFinish={onFinish}
        >
          <Row>
            <Col xs={24} sm={12}>
              {pagination && (
                <Select
                  defaultValue={pagination.perPage}
                  style={{ width: 120 }}
                  onSelect={onSelectPerPage}
                >
                  {LIST_PER_PAGE.map((i, index) => (
                    <Select.Option value={i} key={`perPage-${index}`}>
                      {i} / {t("page")}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Col>
            {!hideSearch && (
              <Col xs={24} sm={12}>
                <Space className="d-flex justify-content-end">
                  <Form.Item
                    name="keyword"
                    className="m-0"
                    style={{ width: "auto", maxWidth: 300, minWidth: 250 }}
                  >
                    <Input placeholder={t("Enter text")} autoComplete="off" />
                  </Form.Item>
                  <Button htmlType="submit" type="default">
                    {t("Search")}
                  </Button>
                  {onShowFilter && (
                    <Tooltip title={t("Filter options")}>
                      <Button
                        onClick={onShowFilter}
                        type="default"
                        shape="circle"
                        icon={<FilterOutlined />}
                        size="middle"
                      />
                    </Tooltip>
                  )}
                  {isApplyFilter && (
                    <Tooltip title={t("Clear filter")}>
                      <Button
                        onClick={handleClearFilter}
                        type="dashed"
                        shape="circle"
                        size="middle"
                        icon={<ClearOutlined />}
                      />
                    </Tooltip>
                  )}
                </Space>
              </Col>
            )}
          </Row>
        </Form>
      </section>
    </>
  );
}

TableFilter.propTypes = {
  pagination: PropTypes.shape({
    perPage: PropTypes.number.isRequired,
    setPerPage: PropTypes.func.isRequired,
  }),
  setKeyword: PropTypes.func,
  onShowFilter: PropTypes.func,
  isApplyFilter: PropTypes.bool,
  onClearFilter: PropTypes.func,
  hideSearch: PropTypes.bool,
  setPage: PropTypes.func,
};

export default TableFilter;
