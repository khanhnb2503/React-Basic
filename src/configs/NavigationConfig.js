import {
  DashboardOutlined,
  UsergroupAddOutlined,
  FolderOpenOutlined,
  SisternodeOutlined,
  QuestionCircleOutlined,
  GroupOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { APP_PREFIX_PATH } from "configs/AppConfig";

const dashBoardNavTree = [
  {
    key: "home",
    path: `${APP_PREFIX_PATH}/home`,
    title: "Home",
    icon: DashboardOutlined,
    breadcrumb: false,
    submenu: [],
    isMentor: true,
  },
  {
    key: "user",
    path: `${APP_PREFIX_PATH}/user`,
    title: "User management",
    icon: GroupOutlined,
    breadcrumb: true,
    submenu: [
      {
        key: "user-management",
        title: "User",
        path: `${APP_PREFIX_PATH}/user`,
        submenu: [],
        icon: UsergroupAddOutlined,
        drawer: true,
      },
      {
        key: "mentor-management",
        title: "Mentor",
        path: `${APP_PREFIX_PATH}/mentor`,
        submenu: [],
        icon: UsergroupAddOutlined,
      },
    ],
  },
  {
    key: "question",
    path: `${APP_PREFIX_PATH}/question`,
    title: "Question management",
    icon: FolderOpenOutlined,
    breadcrumb: true,
    submenu: [],
    isMentor: true,
  },
  {
    key: "question-category",
    path: `${APP_PREFIX_PATH}/question-category`,
    title: "Question category management",
    icon: SisternodeOutlined,
    breadcrumb: true,
    submenu: [],
    isMentor: true,
  },
  {
    key: "q&a",
    path: `${APP_PREFIX_PATH}/feedback`,
    title: "Q&A management",
    icon: QuestionCircleOutlined,
    breadcrumb: true,
    submenu: [],
  },
  {
    key: "feedback_notify",
    path: `${APP_PREFIX_PATH}/feedback_notify`,
    title: "SendEmail",
    icon: QuestionCircleOutlined,
    breadcrumb: true,
    submenu: [],
  },
  {
    key: "education",
    path: `${APP_PREFIX_PATH}/education`,
    title: "School category management",
    icon: BookOutlined,
    breadcrumb: true,
    submenu: [],
  },
];

const navigationConfig = [...dashBoardNavTree];

export default navigationConfig;
