import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Grid, Typography } from "antd";
import IntlMessage from "../util-components/IntlMessage";
import Icon from "../util-components/Icon";
import navigationConfig from "configs/NavigationConfig";
import { connect } from "react-redux";
import { SIDE_NAV_LIGHT, NAV_TYPE_SIDE } from "constants/ThemeConstant";
import utils from "utils";
import { onMobileNavToggle } from "redux/actions/Theme";
import { useAccount } from "../../hooks/useAccount";
import { ROLE } from "../../constants/consts";
import EducationExpand from "../util-components/EducationExpan";

const { SubMenu } = Menu;
const { useBreakpoint } = Grid;

const setLocale = (isLocaleOn, localeKey) =>
  isLocaleOn ? <IntlMessage id={localeKey} /> : localeKey.toString();

const setDefaultOpen = (key) => {
  let keyList = [];
  let keyString = "";
  if (key) {
    const arr = key.split("-");
    for (let index = 0; index < arr.length; index++) {
      const elm = arr[index];
      index === 0 ? (keyString = elm) : (keyString = `${keyString}-${elm}`);
      keyList.push(keyString);
    }
  }
  return keyList;
};

const SideNavContent = (props) => {
  const {
    sideNavTheme,
    routeInfo,
    hideGroupTitle,
    localization,
    onMobileNavToggle,
  } = props;
  const isMobile = !utils.getBreakPoint(useBreakpoint()).includes("lg");
  const closeMobileNav = () => {
    if (isMobile) {
      onMobileNavToggle(false);
    }
  };
  const { role } = useAccount();
  const location = useLocation();

  return (
    <div className="site-drawer-render-in-current-wrapper">
      <Menu
        theme={sideNavTheme === SIDE_NAV_LIGHT ? "light" : "dark"}
        mode="inline"
        style={{ height: "100%", borderRight: 0 }}
        selectedKeys={[location.pathname]}
        defaultSelectedKeys={[location.pathname]}
        defaultOpenKeys={setDefaultOpen(
          ["/app/user", "/app/mentor"].includes(location.pathname)
            ? "/app/user"
            : ""
        )}
        className={hideGroupTitle ? "hide-group-title" : ""}
      >
        {navigationConfig
          .filter((i) => (role === ROLE.MENTOR ? i.isMentor : i))
          .map((menu) =>
            menu.submenu.length > 0 ? (
              <SubMenu
                key={menu.path}
                title={setLocale(localization, menu.title)}
                icon={<Icon type={menu.icon} />}
              >
                {menu.submenu.map((subMenuFirst) =>
                  subMenuFirst.submenu.length > 0 ? (
                    <Menu.ItemGroup
                      icon={<Icon type={subMenuFirst?.icon} />}
                      key={subMenuFirst.path}
                      title={setLocale(localization, subMenuFirst.title)}
                    >
                      {subMenuFirst.submenu.map((subMenuSecond) => (
                        <Menu.Item key={subMenuSecond.path}>
                          {subMenuSecond.icon ? (
                            <Icon type={subMenuSecond?.icon} />
                          ) : null}
                          <span>
                            {setLocale(localization, subMenuSecond.title)}
                          </span>
                          <Link
                            onClick={() => closeMobileNav()}
                            to={subMenuSecond.path}
                          />
                        </Menu.Item>
                      ))}
                    </Menu.ItemGroup>
                  ) : (
                    <Menu.Item
                      key={subMenuFirst.path}
                      icon={
                        subMenuFirst.icon ? (
                          <Icon type={subMenuFirst?.icon} />
                        ) : null
                      }
                    >
                      <span>{setLocale(localization, subMenuFirst.title)}</span>
                      <Link
                        onClick={() => closeMobileNav()}
                        to={subMenuFirst.path}
                      />
                    </Menu.Item>
                  )
                )}
              </SubMenu>
            ) : (
              <Menu.Item key={menu.path} icon={<Icon type={menu?.icon} />}>
                <span>{setLocale(localization, menu?.title)}</span>
                {menu.path ? (
                  <Link onClick={() => closeMobileNav()} to={menu.path} />
                ) : null}
              </Menu.Item>
            )
          )}
      </Menu>
      {/*<EducationExpand show={showEduExpand} onHide={onHideEduExpand} />*/}
    </div>
  );
};

const TopNavContent = (props) => {
  const { topNavColor, localization } = props;
  return (
    <Menu mode="horizontal" style={{ backgroundColor: topNavColor }}>
      {navigationConfig.map((menu) =>
        menu.submenu.length > 0 ? (
          <SubMenu
            key={menu.path}
            popupClassName="top-nav-menu"
            title={
              <span>
                {menu.icon ? <Icon type={menu?.icon} /> : null}
                <span>{setLocale(localization, menu.title)}</span>
              </span>
            }
          >
            {menu.submenu.map((subMenuFirst) =>
              subMenuFirst.submenu.length > 0 ? (
                <SubMenu
                  key={subMenuFirst.path}
                  icon={
                    subMenuFirst.icon ? (
                      <Icon type={subMenuFirst?.icon} />
                    ) : null
                  }
                  title={setLocale(localization, subMenuFirst.title)}
                >
                  {subMenuFirst.submenu.map((subMenuSecond) => (
                    <Menu.Item key={subMenuSecond.path}>
                      <span>
                        {setLocale(localization, subMenuSecond.title)}
                      </span>
                      <Link to={subMenuSecond.path} />
                    </Menu.Item>
                  ))}
                </SubMenu>
              ) : (
                <Menu.Item key={subMenuFirst.path}>
                  {subMenuFirst.icon ? (
                    <Icon type={subMenuFirst?.icon} />
                  ) : null}
                  <span>{setLocale(localization, subMenuFirst.title)}</span>
                  <Link to={subMenuFirst.path} />
                </Menu.Item>
              )
            )}
          </SubMenu>
        ) : (
          <Menu.Item key={menu.path}>
            {menu.icon ? <Icon type={menu?.icon} /> : null}
            <span>{setLocale(localization, menu?.title)}</span>
            {menu.path ? <Link to={menu.path} /> : null}
          </Menu.Item>
        )
      )}
    </Menu>
  );
};

const MenuContent = (props) => {
  return props.type === NAV_TYPE_SIDE ? (
    <SideNavContent {...props} />
  ) : (
    <TopNavContent {...props} />
  );
};

const mapStateToProps = ({ theme }) => {
  const { sideNavTheme, topNavColor } = theme;
  return { sideNavTheme, topNavColor };
};

export default connect(mapStateToProps, { onMobileNavToggle })(MenuContent);
