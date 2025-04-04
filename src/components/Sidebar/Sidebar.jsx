import { NavLink } from "react-router-dom";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Collapse, Nav } from "reactstrap";
import logo from "../../assets/images/LogoS.png";
import i18n from "../../i18n";
import {
  getElementState,
  getLanguageState,
  getPermissionState,
} from "../../redux/selectors/auth";
import router from "../../routes/router";
import "./Sidebar.scss";

const Sidebar = ({ hide }) => {
  const permission = useSelector(getPermissionState);
  const [collapsed, setCollapsed] = useState(true);
  const [collapsedService, setCollapsedService] = useState(true);
  const [collapsedPromotion, setCollapsedPromotion] = useState(true);
  const lang = useSelector(getLanguageState);
  const checkElement = useSelector(getElementState);

  const checkPermission = [];

  const toggleNavbar = () => {
    setCollapsed(!collapsed);
    setCollapsedService(true);
    setCollapsedPromotion(true);
  };
  const toggleServiceNavbar = () => {
    setCollapsedService(!collapsedService);
    setCollapsed(true);
    setCollapsedPromotion(true);
  };
  const togglePromotionNavbar = () => {
    setCollapsedPromotion(!collapsedPromotion);
    setCollapsed(true);
    setCollapsedService(true);
  };
  permission?.map((item) => {
    checkPermission.push(item?.id_side_bar);
  });

  const clearAllCookies = () => {
    const cookies = document.cookie.split("; ");

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  };
  return (
    <>
      {hide ? (
        <div className="div-sidebar">
          <div className="div-logo">
            <img src={logo} className="img-logo" />
          </div>
          <div responsive className="container-sidebar">
            {router?.map((item, key) => {
              return (
                <div key={key}>
                  <ul className="nav nav-pills flex-column">
                    {item?.tab.length === 0 && (
                      <li
                        className={
                          checkPermission?.includes(item?.id_sidebar)
                            ? "li-nav-link"
                            : "li-nav-link-none"
                        }
                        onClick={clearAllCookies}
                      >
                        <NavLink to={item?.path}>
                          {({ isActive }) => (
                            <div
                              className={
                                isActive ? "active-link" : "unactive-link"
                              }
                            >
                              <div>
                                <img src={item?.icon} className="img-icon" />
                                <a
                                  className={
                                    isActive ? "active-text" : "unactive-text"
                                  }
                                >
                                  {`${i18n.t(item?.name, { lng: lang })}`}
                                </a>
                              </div>
                            </div>
                          )}
                        </NavLink>
                      </li>
                    )}
                    {item?.tab?.length > 0 && (
                      <li
                        className={
                          checkPermission?.includes(item?.id_sidebar)
                            ? "li-nav-link"
                            : "li-nav-link-none"
                        }
                      >
                        <NavLink
                          to={item?.path}
                          onClick={
                            item?.layout === "job"
                              ? toggleNavbar
                              : item?.layout === "group"
                              ? toggleServiceNavbar
                              : item?.layout === "promotion"
                              ? togglePromotionNavbar
                              : null
                          }
                        >
                          {({ isActive }) => (
                            <div
                              className={
                                isActive ? "active-link" : "unactive-link"
                              }
                            >
                              <div>
                                <img src={item?.icon} className="img-icon" />
                                <a
                                  className={
                                    isActive ? "active-text" : "unactive-text"
                                  }
                                >
                                  {`${i18n.t(item?.name, { lng: lang })}`}
                                </a>
                              </div>
                              {collapsed ? (
                                <i className="uil uil-angle-right icon-right"></i>
                              ) : (
                                <i className="uil uil-angle-down icon-right"></i>
                              )}
                            </div>
                          )}
                        </NavLink>
                        <Collapse
                          isOpen={
                            item?.layout === "job"
                              ? !collapsed
                              : item?.layout === "group"
                              ? !collapsedService
                              : item?.layout === "promotion"
                              ? !collapsedPromotion
                              : null
                          }
                        >
                          <Nav className="nav-link-sidebar" navbar>
                            {item?.tab?.map((i, index) => {
                              return (
                                <NavLink to={i?.path} key={index}>
                                  {({ isActive }) => (
                                    <div
                                      className={
                                        isActive
                                          ? "active-link-nav"
                                          : "unactive-link-nav"
                                      }
                                      style={
                                        checkElement?.includes(i?.role) ||
                                        i?.role == "all"
                                          ? {}
                                          : { display: "none" }
                                      }
                                    >
                                      {/* <i class="uil uil-shopping-bag icon"></i> */}
                                      <img src={i?.icon} className="img-icon" />
                                      <a
                                        className={
                                          isActive
                                            ? "active-text-nav"
                                            : "unactive-text-nav"
                                        }
                                      >
                                        {i?.name}
                                      </a>
                                    </div>
                                  )}
                                </NavLink>
                              );
                            })}
                          </Nav>
                        </Collapse>
                      </li>
                    )}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="div-sidebar">
          <div className="div-logo">
            {/* <img src={logo} className="img-logo-hide" /> */}
          </div>
          <div responsive className="container-sidebar">
            {router?.map((item, key) => {
              return (
                <div key={key}>
                  <ul className="nav nav-pills flex-column">
                    {item?.tab.length === 0 && (
                      <li
                        className={
                          checkPermission?.includes(item?.id_sidebar)
                            ? "li-nav-link"
                            : "li-nav-link-none"
                        }
                      >
                        <NavLink to={item?.path}>
                          {({ isActive }) => (
                            <div
                              className={
                                isActive ? "active-link" : "unactive-link"
                              }
                            >
                              <img src={item?.icon} className="img-icon" />
                              {/* <a
                            className={
                              isActive ? "active-text" : "unactive-text"
                            }
                          >
                            {item?.name}
                          </a> */}
                            </div>
                          )}
                        </NavLink>
                      </li>
                    )}
                    {item?.tab?.length > 0 && (
                      <li
                        className={
                          checkPermission?.includes(item?.id_sidebar)
                            ? "li-nav-link"
                            : "li-nav-link-none"
                        }
                      >
                        <NavLink
                          to={item?.path}
                          onClick={
                            item?.layout === "job"
                              ? toggleNavbar
                              : item?.layout === "group"
                              ? toggleServiceNavbar
                              : item?.layout === "promotion"
                              ? togglePromotionNavbar
                              : null
                          }
                        >
                          {({ isActive }) => (
                            <div
                              className={
                                isActive ? "active-link" : "unactive-link"
                              }
                            >
                              <img src={item?.icon} className="img-icon" />
                              {/* <a
                            className={
                              isActive ? "active-text" : "unactive-text"
                            }
                          >
                            {item?.name}
                          </a> */}
                              {collapsed ? (
                                <i className="uil uil-angle-right icon-right"></i>
                              ) : (
                                <i className="uil uil-angle-down icon-right"></i>
                              )}
                            </div>
                          )}
                        </NavLink>
                        <Collapse
                          isOpen={
                            item?.layout === "job"
                              ? !collapsed
                              : item?.layout === "group"
                              ? !collapsedService
                              : item?.layout === "promotion"
                              ? !collapsedPromotion
                              : null
                          }
                        >
                          <Nav className="nav-link-sidebar" navbar>
                            {item?.tab?.map((i, index) => {
                              return (
                                <NavLink to={i?.path} key={index}>
                                  {({ isActive }) => (
                                    <div
                                      className={
                                        isActive
                                          ? "active-link-nav"
                                          : "unactive-link-nav"
                                      }
                                    >
                                      <i className="uil uil-shopping-bag icon"></i>
                                      {/* <a
                                    className={
                                      isActive
                                        ? "active-text-nav"
                                        : "unactive-text-nav"
                                    }
                                  >
                                    {i?.name}
                                  </a> */}
                                    </div>
                                  )}
                                </NavLink>
                              );
                            })}
                          </Nav>
                        </Collapse>
                      </li>
                    )}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="div-version">
        <a className="text-version">{hide ? "Version 1.0.1" : "v1.0.1"}</a>
      </div>
    </>
  );
};

export default Sidebar;
