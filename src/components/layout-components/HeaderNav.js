import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Layout } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import Logo from "./Logo";
// import NavNotification from "./NavNotification";
import NavProfile from "./NavProfile";
// import NavLanguage from "./NavLanguage";
import NavPanel from "./NavPanel";
import NavSearch from "./NavSearch";
import { toggleCollapsedNav, onMobileNavToggle } from "redux/actions/Theme";
import {
  NAV_TYPE_TOP,
  // SIDE_NAV_COLLAPSED_WIDTH,
  // SIDE_NAV_WIDTH,
} from "constants/ThemeConstant";
import utils from "utils";
import AppBreadcrumb from "./AppBreadcrumb";

const { Header } = Layout;

export const HeaderNav = (props) => {
  const {
    navCollapsed,
    mobileNav,
    navType,
    headerNavColor,
    toggleCollapsedNav,
    onMobileNavToggle,
    isMobile,
    currentTheme,
    direction,
  } = props;
  const [searchActive, setSearchActive] = useState(false);

  const onSearchClose = () => {
    setSearchActive(false);
  };

  const onToggle = () => {
    if (!isMobile) {
      toggleCollapsedNav(!navCollapsed);
    } else {
      onMobileNavToggle(!mobileNav);
    }
  };

  const isNavTop = navType === NAV_TYPE_TOP;
  const mode = () => {
    if (!headerNavColor) {
      return utils.getColorContrast(
        currentTheme === "dark" ? "#00000" : "#ffffff"
      );
    }
    return utils.getColorContrast(headerNavColor);
  };
  const navMode = mode();
  // const getNavWidth = () => {
  //   if (isNavTop || isMobile) {
  //     return "0px";
  //   }
  //   if (navCollapsed) {
  //     return `${SIDE_NAV_COLLAPSED_WIDTH}px`;
  //   } else {
  //     return `${SIDE_NAV_WIDTH}px`;
  //   }
  // };

  useEffect(() => {
    if (!isMobile) {
      onSearchClose();
    }
  });

  return (
    <Header
      className={`app-header ${navMode}`}
      style={{ backgroundColor: headerNavColor, height: "auto" }}
    >
      <div
        className={`app-header-wrapper w-100 ${
          isNavTop ? "layout-top-nav" : ""
        }`}
      >
        <Logo logoType={navMode} />
        <div className="d-flex flex-column w-100">
          <div className="w-100 d-flex justify-content-between">
            <div className="nav-left">
              <ul className="ant-menu ant-menu-root ant-menu-horizontal">
                {isNavTop && !isMobile ? null : (
                  <li
                    className="ant-menu-item ant-menu-item-only-child"
                    onClick={() => {
                      onToggle();
                    }}
                  >
                    {navCollapsed || isMobile ? (
                      <MenuUnfoldOutlined className="nav-icon" />
                    ) : (
                      <MenuFoldOutlined className="nav-icon" />
                    )}
                  </li>
                )}
              </ul>
            </div>
            {/*<NavNotification />*/}
            <div className="d-flex ml-auto">
              {/*<NavLanguage />*/}
              <NavProfile />
              <NavPanel direction={direction} />
            </div>
            <NavSearch active={searchActive} close={onSearchClose} />
          </div>
          <div
            className="border-top py-3 px-3"
            style={{
              marginLeft: navCollapsed || isMobile ? 0 : 35,
              transition: "all .2s",
            }}
          >
            <AppBreadcrumb />
          </div>
        </div>
      </div>
    </Header>
  );
};

const mapStateToProps = ({ theme }) => {
  const {
    navCollapsed,
    navType,
    headerNavColor,
    mobileNav,
    currentTheme,
    direction,
  } = theme;
  return {
    navCollapsed,
    navType,
    headerNavColor,
    mobileNav,
    currentTheme,
    direction,
  };
};

export default connect(mapStateToProps, {
  toggleCollapsedNav,
  onMobileNavToggle,
})(HeaderNav);
