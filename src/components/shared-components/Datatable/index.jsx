import React, { useEffect, useMemo } from "react";
import { Table, Pagination, Divider, Drawer, Form, Space, Button } from "antd";
import PropTypes from "prop-types";
import TableFilter from "./TableFilter";
import { useTranslation } from "../../../hooks/useTranslation";

export const LIST_PER_PAGE = [10, 20, 30, 50];

function Datatable(props) {
  const { t } = useTranslation();
  const {
    showPagination,
    action,
    showHeader,
    columns,
    onRow,
    dataSource,
    rowSelection,
    metadata,
    filter,
    loading = false,
    scroll,
    hideSearch,
    columnAlign,
    formFilter,
    breadcrumb,
  } = props;
  const [form] = Form.useForm();

  const onClearFilter = () => {
    if (formFilter) {
      formFilter.resetFields();
      formFilter.submit();
    } else {
      form.resetFields();
      form.submit();
    }
    metadata.setPage(1);
    if (filter.onFilterClean) {
      filter.onFilterClean();
    }
  };

  const onDownloadCSV = () => {
    filter.onLoadCSV();
  };

  const tableColumns = useMemo(() => {
    let tColumns = columns;
    if (columnAlign) {
      tColumns = tColumns.map((item) => ({ ...item, align: columnAlign }));
    }
    return tColumns;
  }, [columnAlign, columns]);

  // Remove selected keys when change page & perPage
  useEffect(() => {
    if (rowSelection?.onChange) {
      rowSelection.onChange([]);
    }
    // eslint-disable-next-line
  }, [dataSource]);
  return (
    <>
      <div className="code-box-table-demo">
        <div className="code-box">
          <section className="code-box-demo">
            <div>
              {breadcrumb && (
                <>
                  {breadcrumb}
                  <Divider />
                </>
              )}
              {showHeader && (
                <>
                  <TableFilter
                    pagination={
                      showPagination && {
                        perPage: metadata.perPage,
                        setPerPage: metadata.setPerPage,
                      }
                    }
                    setKeyword={metadata.setKeyword}
                    onShowFilter={filter && filter.onShow}
                    isApplyFilter={filter && filter.isApplyFilter}
                    onClearFilter={onClearFilter}
                    hideSearch={hideSearch}
                    setPage={metadata.setPage}
                  />
                  <Divider />
                </>
              )}
              {action}
              <Table
                onRow={onRow}
                rowSelection={rowSelection}
                columns={tableColumns}
                dataSource={dataSource}
                pagination={false}
                scroll={scroll}
                loading={loading}
              />
            </div>
            {showPagination && (
              <div className="d-flex justify-content-center mt-3">
                <Pagination
                  showSizeChanger={false}
                  defaultCurrent={1}
                  current={metadata.page}
                  total={metadata.total}
                  onChange={metadata.setPage}
                  defaultPageSize={metadata.perPage}
                  pageSize={metadata.perPage}
                />
              </div>
            )}
          </section>
        </div>
      </div>
      {filter && (
        <Drawer
          title={t("Filter")}
          placement="right"
          visible={filter.show}
          onClose={filter.onHide}
          size="default"
        >
          <Form
            name="table-filter"
            onFinish={filter.onFilter}
            autoComplete="off"
            form={formFilter ? formFilter : form}
            labelCol={{
              md: { span: 24 },
              lg: { span: 12 },
            }}
            labelAlign="left"
            wrapperCol={{
              md: { span: 24 },
              lg: { span: 12 },
            }}
          >
            {filter.element}
            <Divider />
            <Space>
              <Button type="primary" htmlType="submit">
                {t("Apply")}
              </Button>
              <Button type="default" htmlType="reset" onClick={onClearFilter}>
                {t("Reset")}
              </Button>
              {filter.onLoadCSV ? (
                <Button
                  type="link"
                  style={{ border: "1px solid #3e79f7" }}
                  onClick={onDownloadCSV}
                  loading={filter.isDownloading}
                >
                  {t("Download")}
                </Button>
              ) : (
                ""
              )}
            </Space>
          </Form>
        </Drawer>
      )}
    </>
  );
}

Datatable.propTypes = {
  showPagination: PropTypes.bool,
  action: PropTypes.element,
  showHeader: PropTypes.bool,
  onRow: PropTypes.func,
  rowSelection: PropTypes.shape({
    selectedRowKeys: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
  }),
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      dataIndex: PropTypes.string,
      key: PropTypes.string,
      render: PropTypes.func,
    })
  ).isRequired,
  dataSource: PropTypes.array.isRequired,
  metadata: PropTypes.shape({
    total: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    setPage: PropTypes.func.isRequired,
    perPage: PropTypes.number.isRequired,
    setPerPage: PropTypes.func.isRequired,
    keyword: PropTypes.string,
    setKeyword: PropTypes.func,
  }).isRequired,
  filter: PropTypes.shape({
    element: PropTypes.element.isRequired,
    show: PropTypes.bool.isRequired,
    onShow: PropTypes.func.isRequired,
    onHide: PropTypes.func.isRequired,
    isApplyFilter: PropTypes.bool.isRequired,
    onFilter: PropTypes.func.isRequired,
    onFilterClean: PropTypes.func,
    onLoadCSV: PropTypes.func,
    isDownloading: PropTypes.bool,
  }),
  loading: PropTypes.bool,
  scroll: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    scrollToFirstRowOnChange: PropTypes.bool,
  }),
  hideSearch: PropTypes.bool,
  columnAlign: PropTypes.oneOf(["center", "left", "right"]),
  formFilter: PropTypes.any,
  breadcrumb: PropTypes.element,
};

export default Datatable;
