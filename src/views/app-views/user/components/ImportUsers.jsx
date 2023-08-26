import PropTypes from "prop-types";
import {
  Button,
  Modal,
  notification,
  Typography,
  Upload,
  Divider,
  Row,
  Col,
} from "antd";
import { useTranslation } from "../../../../hooks/useTranslation";
import UserService from "../../../../services/UserService";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import { FILE_ACCEPT } from "../../../../constants/consts";
import Flex from "../../../../components/shared-components/Flex";

function ImportUsers(props) {
  const { t } = useTranslation();
  const { show, onHide, callback } = props;
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);

  const onRemove = () => {
    setFile(null);
  };
  const beforeUpload = (file) => {
    setFile(file);
    return false;
  };
  const onClose = () => {
    onHide();
    setFile(null);
  };

  const handleUpload = () => { 
    if (file) { 
      setUploading(true);
      UserService.importUsers(file).then(({ data, status, statusCode, message }) => { 
        console.log(data, status, statusCode, message);
        if (status) {
          if(data) window.open(data);
          notification.info({
            message: t("Successfully"),
            description: message || t("Uploaded successfully"),
            placement: "topRight",
          });
          callback();
        }
        onClose();
        setUploading(false);
      });
    }
  };
  return (
    <Modal
      title={t("Import {name}", { name: t("User") })}
      visible={show}
      onCancel={onClose}
      footer={false}
    >
      <Row>
        <Col span={16}>
          <Upload
            onRemove={onRemove}
            beforeUpload={beforeUpload}
            multiple={false}
            fileList={file ? [file] : []}
            accept={FILE_ACCEPT.EXCEL}
            className="w-auto"
          >
            <Button icon={<UploadOutlined />}>{t("Choose file")}</Button>
          </Upload>
        </Col>
        <Col span={8}>
          <Flex>
            <Button
              loading={uploading}
              type="primary"
              onClick={handleUpload}
              className="ml-auto"
              disabled={!file}
            >
              {t("Upload")}
            </Button>
          </Flex>
        </Col>
      </Row>
      <Divider dashed />
      <Typography.Text type="danger">
        {t("*Use specified format of user. Please download the example file.")}
      </Typography.Text>
    </Modal>
  );
}

ImportUsers.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  callback: PropTypes.func.isRequired,
};

export default ImportUsers;
