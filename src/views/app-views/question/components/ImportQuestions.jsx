import PropTypes from "prop-types";
import {
  Button,
  Modal,
  notification,
  Typography,
  Upload,
  Divider,
  Alert,
  Space,
  Row,
  Col,
} from "antd";
import { useTranslation } from "../../../../hooks/useTranslation";
import { UploadOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../../configs/AppConfig";
import Flex from "../../../../components/shared-components/Flex";
import QuestionService from "../../../../services/QuestionService";
import { FILE_ACCEPT } from "../../../../constants/consts";

function ImportQuestions(props) {
  const { t } = useTranslation();
  const { show, onHide, callback } = props;
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [disabledUpload, setDisabledUpload] = useState(true);

  // Media files
  const mediaProps = {
    action: `${API_BASE_URL}/admin/image-upload`,
    accept: [FILE_ACCEPT.IMAGE, FILE_ACCEPT.VIDEO].join(","),
    fileList: mediaFiles,
    onChange({ fileList }) {
      setMediaFiles(fileList);
    },
    customRequest: async (options) => {
      const { file, onSuccess, onError } = options;
      try {
        const res = await QuestionService.uploadImage(file);
        // console.log("res", res);
        if (res.status && res.data) {
          onSuccess(res.body);
        } else {
          onError({
            status: res.statusCode || 500,
          });
        }
      } catch (err) {
        onError({
          status: 500,
        });
        console.log("Error: ", err);
      }
    },
  };

  // Question file
  const onRemove = () => {
    setFile(null);
  };
  const beforeUpload = (file) => {
    setFile(file);
    return false;
  };
  const onClose = () => {
    onHide();
    onRemove();
    setMediaFiles([]);
  };
  const handleUpload = () => {
    if (file) {
      setUploading(true);
      QuestionService.importQuestions(file).then(({ status }) => {
        if (status) {
          notification.info({
            message: t("Successfully"),
            description: t("Uploaded successfully"),
            placement: "topRight",
          });
          callback();
        }
        onClose();
        setUploading(false);
      });
    }
  };
  useEffect(() => {
    const hasMediaFilesDone = !!mediaFiles.find((i) => i.status === "done");
    if (mediaFiles.length === 0 || !hasMediaFilesDone) {
      setDisabledUpload(true);
    } else {
      setDisabledUpload(false);
    }
  }, [mediaFiles]);
  useEffect(() => {
    if (disabledUpload) {
      setFile(null);
    }
  }, [disabledUpload]);
  return (
    <Modal
      title={t("Import {name}", { name: t("Questions") })}
      visible={show}
      onCancel={onClose}
      footer={false}
    >
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <Upload listType="picture" {...mediaProps} multiple>
          <Button icon={<UploadOutlined />}>
            {t("Import {name}", { name: t("Media") })} ({t("multiple")})
          </Button>
        </Upload>
        <Row>
          <Col span={18}>
            <Upload
              listType="picture"
              maxCount={1}
              multiple
              beforeUpload={beforeUpload}
              accept={FILE_ACCEPT.EXCEL}
              fileList={file ? [file] : []}
              onRemove={() => {
                setFile(null);
              }}
            >
              <Button icon={<UploadOutlined />} disabled={disabledUpload}>
                {t("Upload")}
              </Button>
            </Upload>
          </Col>
          <Col span={6}>
            <Flex justifyContent="end">
              <Button
                type="primary"
                onClick={handleUpload}
                disabled={!file || disabledUpload}
                loading={uploading}
              >
                {t("Upload")}
              </Button>
            </Flex>
          </Col>
        </Row>
      </Space>
      {mediaFiles.length === 0 && (
        <Alert
          type="warning"
          message={t("Please upload media before upload question file.")}
          className="mt-2"
          showIcon
          banner
          closable
        />
      )}
      <Divider dashed />
      <Typography.Text type="danger">
        {t(
          "*Use specified format of question. Please download the example file."
        )}
      </Typography.Text>
    </Modal>
  );
}

ImportQuestions.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  callback: PropTypes.func.isRequired,
};

export default ImportQuestions;
