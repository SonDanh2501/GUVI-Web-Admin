import React, { useState } from "react";
import "./index.scss";
import moment from "moment";
import { useSelector } from "react-redux";
import { getLanguageState } from "../../../redux/selectors/auth";
import icons from "../../../utils/icons";
import { Pagination, Tooltip } from "antd";
import i18n from "../../../i18n";
import { formatMoney } from "../../../helper/formatMoney";

const {
  IoAlertOutline,
  IoCheckmarkDoneOutline,
  IoCloseCircleOutline,
  IoFlagOutline,
  IoHourglassOutline,
  IoPersonOutline,
  IoTimeOutline,
  IoPeopleOutline,
  IoSettingsOutline,
  MdDoubleArrow,
} = icons;

const CardActivityLog = (props) => {
  const {
    data,
    totalItem,
    start,
    pageSize,
    setLengthPage,
    onCurrentPageChange,
    dateIndex,
    statusIndex,
    pagination,
    type
  } = props;
  const lang = useSelector(getLanguageState);
  const [currentPage, setCurrentPage] = useState(1);

  /* Hàm hỗ trợ */
  // 1. Hàm tính thời gian bắt đầu - thời gian kết thúc
  const timeWork = (data) => {
    const start = moment(new Date(data.date_work)).format("HH:mm");
    const timeEnd = moment(new Date(data?.date_work))
      .add(data?.total_estimate, "hours")
      .format("HH:mm");
    return start + " - " + timeEnd;
  };
  // 2.
  const onChange = (page) => {
    setLengthPage(page);
  };

  const calculateCurrentPage = (event) => {
    setCurrentPage(event);
    if (onCurrentPageChange) {
      onCurrentPageChange(event * pageSize - pageSize);
    }
  };
  /* Hàm render */
  // 1. Hàm render nội dung bên trái (ngày tháng năm, thời gian và tên (nếu có))
  const leftContent = (date, dayInWeek, time) => {
    return (
      <div className="card-activities--activity-left">
        <div>
          <span className="card-activities--activity-left-date">{date}</span>
        </div>
        <div>
          <span className="card-activities--activity-left-day-in-week">
            {dayInWeek}
          </span>
        </div>
        <div>
          <span className="card-activities--activity-left-time">{time}</span>
        </div>
      </div>
    );
  };
  // 2. Hàm render nội dung giữa (line và icon)
  const middleContent = (status, lastItem) => {
    let iconType;
    if (statusIndex === "type") {
      switch (status?.split("_")[0]) {
        case "admin":
          iconType = (
            <div className="card-activities--activity-line-icon violet">
              <IoPeopleOutline size={15} color="violet" />
            </div>
          );
          break;
        case "collaborator":
          iconType = (
            <div className="card-activities--activity-line-icon blue">
              <IoPersonOutline size={15} color="blue" />
            </div>
          );
          break;
        case "verify":
          iconType = (
            <div className="card-activities--activity-line-icon red">
              <IoCloseCircleOutline size={15} color="red" />
            </div>
          );
          break;
        case "create":
          iconType = (
            <div className="card-activities--activity-line-icon green">
              <IoCheckmarkDoneOutline size={15} color="green" />
            </div>
          );
          break;
        default:
          iconType = (
            <div className="card-activities--activity-line-icon yellow">
              <IoSettingsOutline size={15} color="orange" />
            </div>
          );
          break;
      }
    } else if (statusIndex === "status") {
      switch (status) {
        case "pending":
          iconType = (
            <div className="card-activities--activity-line-icon pending">
              <IoAlertOutline size={15} color="orange" />
            </div>
          );
          break;
        case "confirm":
          iconType = (
            <div className="card-activities--activity-line-icon confirm">
              <IoFlagOutline size={15} color="blue" />
            </div>
          );
          break;
        case "doing":
          iconType = (
            <div className="card-activities--activity-line-icon doing">
              <IoHourglassOutline size={15} color="blue" />
            </div>
          );
          break;
        case "done":
          iconType = (
            <div className="card-activities--activity-line-icon done">
              <IoCheckmarkDoneOutline size={15} color="green" />
            </div>
          );
          break;
        case "cancel":
          iconType = (
            <div className="card-activities--activity-line-icon cancel">
              <IoCloseCircleOutline size={15} color="red" />
            </div>
          );
          break;
        default:
          iconType = "";
          break;
      }
    }
    return (
      <div className="card-activities--activity-line">
        {iconType}
        {!lastItem && (
          <div className="card-activities--activity-line-icon-line"></div>
        )}
      </div>
    );
  };
  // 3. Hàm render nội dung bên phải
  const rightConent = (data) => {
    let headerContent;
    let status;
    // Header content
    switch (data?.service?._id?.kind) {
      case "giup_viec_theo_gio":
        headerContent = `${i18n.t("cleaning", { lng: lang })} / ${timeWork(
          data
        )}`;
        break;
      case "giup_viec_co_dinh":
        headerContent = `${i18n.t("cleaning_subscription", {
          lng: lang,
        })} / ${timeWork(data)}`;
        break;
      case "phuc_vu_nha_hang":
        headerContent = `${i18n.t("serve", { lng: lang })} / ${timeWork(data)}`;
        break;
      default:
        headerContent = "";
        break;
    }
    if (data?.title_admin) headerContent = data?.title_admin;
    // Status content
    switch (data?.status) {
      case "pending":
        status = (
          <div className="card-activities--activity-right-status pending">
            <span>{i18n.t("pending", { lng: lang })}</span>
          </div>
        );
        break;
      case "confirm":
        status = (
          <div className="card-activities--activity-right-status confirm">
            <span>{i18n.t("confirm", { lng: lang })}</span>
          </div>
        );
        break;
      case "doing":
        status = (
          <div className="card-activities--activity-right-status doing">
            <span>{i18n.t("doing", { lng: lang })}</span>
          </div>
        );
        break;
      case "done":
        status = (
          <div className="card-activities--activity-right-status done">
            <span>{i18n.t("done", { lng: lang })}</span>
          </div>
        );
        break;
      case "cancel":
        status = (
          <div className="card-activities--activity-right-status cancel">
            <span>{i18n.t("cancel", { lng: lang })}</span>
          </div>
        );
        break;
      default:
        status = "";
        break;
    }
    return (
      <div className="card-activities--activity-right">
        {/* Header */}
        <div>
          <span className="card-activities--activity-right-time">
            {headerContent}
          </span>
        </div>
        {/* Sub content */}
        <div>
          <Tooltip placement="top" title={data?.address}>
            <span className="card-activities--activity-right-address">
              {data?.address && data?.address}
            </span>
          </Tooltip>
        </div>
        {/* Status */}
        {status}
      </div>
    );
  };

  const groupedData =
    data?.reduce((acc, item) => {
      const date = item.date_create.split("T")[0]; // Lấy phần ngày từ ISO string
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
      return acc;
    }, {}) || {}; // Nếu data là null hoặc undefined, groupedData sẽ là {}

  // const sortedGroupedData = Object.fromEntries(
  //   Object.entries(groupedData).sort(
  //     ([dateA], [dateB]) => new Date(dateB) - new Date(dateA)
  //   )
  // );
  // Chuyển đổi object thành mảng
  const groupedArray = Object.entries(groupedData).map(([date, items]) => ({
    date,
    items,
  }));

  return (
    <div className="card-activities">
      {groupedArray.map((date, index) => (
        <>
          <div
            key={index}
            className={`card-activities__child ${
              index === groupedArray.length - 1 && "last-item"
            }`}
          >
            <div
              className={`card-activities__child--header ${
                type === "punish" ? "punish" : type === "reward" ? "reward" : ""
              }`}
            >
              <span className="card-activities__child--header-day">
                {moment(new Date(date.date)).format("MM")}
              </span>
              <span className="card-activities__child--header-number">
                {moment(new Date(date.date)).format("DD")}
              </span>
            </div>
            <div className="card-activities__child--list">
              {date.items.map((el, childIndex) => (
                <div
                  key={childIndex}
                  className="card-activities__child--list-element"
                >
                  {childIndex > 0 && (
                    <div
                      className={`card-activities__child--list-element-dot ${
                        type === "punish"
                          ? "punish"
                          : type === "reward"
                          ? "reward"
                          : ""
                      }`}
                    ></div>
                  )}
                  <div className="card-activities__child--list-element-title">
                    <span className="card-activities__child--list-element-title-content">
                      {el.title_admin}
                    </span>
                    <span
                      className={`card-activities__child--list-element-title-number ${
                        el?.value > 0 ? "adding" : "minus"
                      }`}
                    >
                      {el?.value !== 0 &&
                        `${el?.value > 0 ? "+" : ""}${formatMoney(el?.value)}`}
                    </span>
                  </div>
                  <span className="card-activities__child--list-element-time">
                    <IoTimeOutline />
                    {moment(new Date(el.date_create))
                      .locale(lang)
                      .format("dddd - HH:mm:ss")}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {index === groupedArray.length - 1 && data.length < totalItem && (
            <div className="card-activities__show-more">
              <div
                onClick={() => calculateCurrentPage(currentPage + 1)}
                className="card-activities__show-more--container"
              >
                <span className="card-activities__show-more--container-label">
                  Xem thêm
                </span>
                <span className="card-activities__show-more--container-button">
                  <MdDoubleArrow />
                </span>
              </div>
            </div>
          )}
        </>
      ))}
    </div>
  );
};

export default CardActivityLog;
