import {
  Card,
  Col,
  Modal,
  Row,
  Upload,
  message,
  Image,
  Button,
  Space,
  Alert,
} from "antd";
import { useTranslation } from "../../../hooks/useTranslation";
import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import CustomIcon from "../../util-components/CustomIcon";
import { ImageSvg } from "../../../assets/svg/icon";
import { LoadingOutlined, FileAddOutlined } from "@ant-design/icons";
import MediaService from "../../../services/MediaService";
import styled from "styled-components";
import { getFileName, isImage } from "../../../helpers/fileHelper";
import { IMAGE_FALLBACK } from "../../../constants/consts";
import { API_BASE_URL } from "../../../configs/AppConfig";
import { IMAGE_TYPES, VIDEO_TYPES } from "../../../constants/upload";

const { Dragger } = Upload;

const StyledMediaItem = styled(Col)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 4px -1px rgba(0, 0, 0, 0.15);
  margin-bottom: 10px;
  padding: 5px;
  .ant-image {
    .ant-image-img {
      width: 100%;
      height: 150px;
      object-fit: cover;
    }
  }
  .file-item {
    width: inherit;
    display: flex;
    justify-content: center;
    align-items: center;
    a {
    }
  }
  &:hover {
    box-shadow: 0 1px 4px -1px rgba(0, 0, 0, 0.35);
    .media-item-selector {
      opacity: 1;
    }
  }
  .media-item-selector {
    margin-top: 10px;
    transition: opacity 0.5s;
    opacity: 0;
  }
`;

const imageUploadProps = {
  name: "file",
  multiple: true,
  listType: "picture-card",
  showUploadList: false,
  action: `${API_BASE_URL}/admin/image-upload`,
};

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

function MediaLibrary(props) {
  const { show, onHide, onChooseMedia, imageOnly = undefined } = props;
  const { t } = useTranslation();
  const [mediaFiles, setMediaFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const beforeUpload = (file) => {
    const isTypeValid = [...IMAGE_TYPES, ...VIDEO_TYPES].includes(file.type);
    if (!isTypeValid) {
      message.error(t("You can only upload JPG/PNG/GIF/MP4/M4V file!"));
    }
    const isImage = IMAGE_TYPES.includes(file.type);
    const isSizeValid = isImage
      ? file.size / 1024 / 1024 < 10
      : file.size / 1024 / 1024 < 200;
    if (!isSizeValid) {
      message.error(
        isImage
          ? t("Image must smaller than 10MB!")
          : t("Video must smaller than 200MB!")
      );
    }
    return isTypeValid && isSizeValid;
  };

  const loadMediaFiles = useCallback(() => {
    MediaService.list().then((res) => {
      if (res.status && res.data?.length) {
        setMediaFiles(res.data);
      } else {
        setMediaFiles([]);
      }
    });
  }, []);

  const handleUploadChange = (info) => {
    if (info.file.status === "uploading") {
      setUploading(true);
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (imageUrl) => {
        setUploading(false);
        loadMediaFiles();
      });
      message.success(t("The media file upload was successful"));
    }
    if (info.file.status === "error") {
      const { response } = info.file;
      if (response.message) {
        message.error(response.message);
      } else {
        message.error(t("I can't upload an existing media file."));
      }
      setUploading(false);
    }
  };

  useEffect(() => {
    loadMediaFiles();
    // eslint-disable-next-line
  }, []);
  return (
    <Modal
      visible={show}
      onCancel={onHide}
      title={t("Media library")}
      width={1200}
      onOk={onHide}
    >
      <Row gutter={16}>
        <Col xs={24} sm={24} md={17}>
          <Card
            title={t("Media files")}
            style={{ maxHeight: 700, overflowY: "scroll" }}
          >
            <Row>
              {mediaFiles.map((file, index) => (
                <StyledMediaItem
                  xs={24}
                  sm={12}
                  md={8}
                  lg={6}
                  key={`media-file-${index}`}
                >
                  {isImage(file.path_file) ? (
                    <Image src={file.path_file} fallback={IMAGE_FALLBACK} />
                  ) : (
                    <div className="file-item">
                      <a href={file.path_file} target="_blank">
                        {getFileName(file.path_file)}
                      </a>
                    </div>
                  )}
                  <div className="media-item-selector">
                    <Button
                      type="primary"
                      ghost
                      onClick={() => {
                        onChooseMedia(file);
                      }}
                      disabled={
                        imageOnly
                          ? !isImage(file.path_file)
                          : isImage(file.path_file)
                      }
                    >
                      {t("Select")}
                    </Button>
                  </div>
                </StyledMediaItem>
              ))}
            </Row>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={7}>
          <Card title={t("Upload")}>
            <Dragger
              {...imageUploadProps}
              beforeUpload={beforeUpload}
              onChange={(e) => handleUploadChange(e)}
              headers={() => ({ params: { mimetype: "" } })}
              accept={[...IMAGE_TYPES, ...VIDEO_TYPES].join(",")}
            >
              <div>
                {uploading ? (
                  <div>
                    <LoadingOutlined className="font-size-xxl text-primary" />
                    <div className="mt-3">{t("Uploading")}</div>
                  </div>
                ) : (
                  <div>
                    <CustomIcon className="display-3" svg={ImageSvg} />
                    <p>{t("Click or drag file to upload")}</p>
                  </div>
                )}
              </div>
            </Dragger>
          </Card>
          <Space direction="vertical">
            <Alert
              showIcon
              type="warning"
              message={t("You can only upload JPG/PNG/GIF/MP4/M4V file!")}
            />
            <Alert
              showIcon
              type="warning"
              message={t("Image must smaller than 10MB!")}
            />
            <Alert
              showIcon
              type="warning"
              message={t("Video must smaller than 200MB!")}
            />
          </Space>
        </Col>
      </Row>
    </Modal>
  );
}

MediaLibrary.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onChooseMedia: PropTypes.func.isRequired,
  imageOnly: PropTypes.bool.isRequired,
};

export default MediaLibrary;
