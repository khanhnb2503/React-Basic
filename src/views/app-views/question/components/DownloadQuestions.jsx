import PropTypes from "prop-types";
import { useTranslation } from "../../../../hooks/useTranslation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Divider, Modal, Typography } from "antd";
import QuestionService from "../../../../services/QuestionService";
import Flex from "../../../../components/shared-components/Flex";

function DownloadQuestions(props) {
  const { t } = useTranslation();
  const { show, onHide, callback } = props;
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const refLink = useRef(null);

  const handleDownload = () => {
    if (file && refLink.current) {
      refLink.current.click();
    }
  };

  const loadFile = useCallback(() => {
    setLoading(true);
    QuestionService.downloadQuestions().then(({ status, data }) => {
      if (status && data) {
        setFile({
          url: data,
          fileName: data.substring(data.lastIndexOf("/") + 1),
        });
        if (callback) {
          callback();
        }
      }
      setLoading(false);
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    loadFile();
    // eslint-disable-next-line
  }, []);
  return (
    <Modal
      title={t("Download example file")}
      visible={show}
      onCancel={onHide}
      footer={false}
    >
      <Flex justifyContent="between">
        <Flex alignItems="end">
          {file ? (
            <Typography.Link>{file.fileName}</Typography.Link>
          ) : (
            <Typography.Text>{t("File not found")}</Typography.Text>
          )}
        </Flex>
        <Button
          type="primary"
          href={file?.url}
          download
          onClick={handleDownload}
          disabled={loading}
        >
          {t(loading ? "Loading" : "Download")}
        </Button>
      </Flex>
      <Divider dashed />
      <Typography.Text type="danger">
        {t("*This is specified format of question.")}
      </Typography.Text>
    </Modal>
  );
}

DownloadQuestions.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  callback: PropTypes.func,
};

export default DownloadQuestions;
