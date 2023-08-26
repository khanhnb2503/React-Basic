import React from "react";
import { Menu, Dropdown, Avatar } from "antd";
import { connect } from "react-redux";
import { EditOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import Icon from "components/util-components/Icon";
import { signOut } from "redux/actions/Auth";
import { useTranslation } from "../../hooks/useTranslation";

const menuItem = [
  {
    title: "Edit profile",
    icon: EditOutlined,
    path: "/app/profile",
  },
];

export const NavProfile = ({ signOut }) => {
  const { t } = useTranslation();
  const profileImg = "/img/avatars/thumb-1.jpg";
  const userStorage = localStorage.getItem("user") || null;
  const user = userStorage ? JSON.parse(userStorage) : null;
  const profileMenu = (
    <div className="nav-profile nav-dropdown">
      <div className="nav-profile-header">
        <div className="d-flex">
          <Avatar
            size={45}
            src={profileImg}
            icon={<UserOutlined />}
            style={{ backgroundColor: "#b7eb8f" }}
          />
          <div className="pl-3">
            <h4 className="mb-0">{user?.full_name}</h4>
            <span className="text-muted">{user?.role}</span>
          </div>
        </div>
      </div>
      <div className="nav-profile-body">
        <Menu>
          {menuItem.map((el, i) => {
            return (
              <Menu.Item key={i}>
                <a href={el.path}>
                  <Icon className="mr-3" type={el.icon} />
                  <span className="font-weight-normal">{t(el.title)}</span>
                </a>
              </Menu.Item>
            );
          })}
          <Menu.Item key={menuItem.length + 1} onClick={(e) => signOut()}>
            <span>
              <LogoutOutlined className="mr-3" />
              <span className="font-weight-normal">{t("Sign out")}</span>
            </span>
          </Menu.Item>
        </Menu>
      </div>
    </div>
  );
  return (
    <Dropdown placement="bottomRight" overlay={profileMenu} trigger={["click"]}>
      <Menu className="d-flex align-item-center" mode="horizontal">
        <Menu.Item key="profile">
          <Avatar
            src={profileImg}
            icon={<UserOutlined />}
            style={{ backgroundColor: "#b7eb8f" }}
          />
        </Menu.Item>
      </Menu>
    </Dropdown>
  );
};

export default connect(null, { signOut })(NavProfile);
