import React, { useState, useEffect } from "react";
import {
  Button,
  DatePicker,
  Image,
  InputNumber,
  List,
  Popover,
  Switch,
  Checkbox,
  Drawer,
} from "antd";
import _debounce from "lodash/debounce";
import moment from "moment";
import {
  SELECT_TIME,
  TYPE_VIEW_OPTIONAL_SERVICE,
  DATE_OF_WEEK,
  MONTH_SCHEDULE,
  PAYMENT_METHOD,
} from "../../../../@core/constant/service.constant.js";
import "./index.scss";
import InputTextCustom from "../../../../components/inputCustom/index.jsx";

const DateWorkComponent = (props) => {
  const {
    serviceData,
    setPaymentMethod,
    setIsChoicePaymentMethod,
    setIsAutoOrder,
    setListLoopDateOfWeek,
  } = props;
  const [listTimeQuickSelect, setListTimeQuickSelect] = useState(SELECT_TIME);
  const [time, setTime] = useState(null);
  const [date, setDate] = useState(null);
  const [timeSchedule, setTimeSchedule] = useState([]);
  const [dateOfWeek, setDateOfWeek] = useState([]);
  const [monthSchedule, setMonthSchedule] = useState(null);
  const [service, setService] = useState(null);
  const [isOpenDetailSchedule, setIsOpenDetailSchedule] = useState(false);
  const [listSchedule, setListSchedule] = useState([]);
  const timeZoneLocal = 7 * 60 * 60 * 1000;
  useEffect(() => {
    const tempListSchedule = [];
    const dateNow = new Date();
    const oneDay = 1000 * 60 * 60 * 24;
    for (let i = 0; i < 8; i++) {
      const dateStartMonth = new Date(
        dateNow.getFullYear(),
        dateNow.getMonth() + i,
        1
      );
      const payload = {
        month: dateStartMonth.getMonth(),
        year: dateStartMonth.getFullYear(),
        firstLastWeek: 0,
        firstSunday: 0,
        date: [],
      };
      let currentDay = dateStartMonth;
      const payloadDate = [];

      while (currentDay.getMonth() === dateStartMonth.getMonth()) {
        payloadDate.push({
          month: dateStartMonth.getMonth(),
          year: dateStartMonth.getFullYear(),
          date: currentDay.getDate(),
          dateOfWeek: currentDay.getDay(),
          timeISOSTring: "",
        });
        currentDay = new Date(
          currentDay.getFullYear(),
          currentDay.getMonth(),
          currentDay.getDate() + 1
        );
      }
      payload.date = payloadDate;
      const firstLastWeek = payloadDate.findIndex((x) => x.dateOfWeek === 0);
      payload.firstLastWeek = firstLastWeek;
      tempListSchedule.push(payload);
    }
    setListSchedule(tempListSchedule);
  }, []);

  useEffect(() => {
    if (serviceData !== null) {
      setService(serviceData);
    }
  }, [serviceData]);

  useEffect(() => {
    setListLoopDateOfWeek(dateOfWeek)
  },[dateOfWeek])

  useEffect(() => {
    const tempSelect = SELECT_TIME;
    for (let i = 0; i < tempSelect.length; i++) {
      for (let y = 0; y < tempSelect[i].time.length; y++) {
        const temp = `2023-04-13T${tempSelect[i].time[y].label}:00.000Z`;
        const temp2 = new Date(temp).getTime();
        tempSelect[i].time[y].value = new Date(temp2)
          .toISOString()
          .slice(11, 16);
      }
    }
    setListTimeQuickSelect(tempSelect);
  }, []);

  useEffect(() => {
    if (time !== null && date !== null) {
      let tempTimeSchedule = [];
      if (service.type === "loop" || service.type === "single") {
        let tempDate = new Date(
          new Date(date).getTime() + timeZoneLocal
        ).toISOString();
        tempDate = tempDate.slice(0, 10);
        const tempTime = time.split(":");
        let temp = `${tempDate}T${time}:00.000+07:00`;
        temp = new Date(temp).toISOString();
        tempTimeSchedule.push(temp);
        setTimeSchedule(tempTimeSchedule);
        if (props.changeTimeSchedule)
          props.changeTimeSchedule(tempTimeSchedule);
      }
    }
  }, [time, date]);

  useEffect(() => {
    if (time !== null && monthSchedule !== null && dateOfWeek !== null) {
      let tempTimeSchedule = [];
      if (service.type === "schedule") {
        const hourTime = time.split(":");
        let dateNow = Number(new Date().getTime()) + timeZoneLocal;
        dateNow = new Date(dateNow);
        const tempDate = [];
        const temp = dateNow.getMonth() + monthSchedule;
        const dateEndSchedule = new Date(
          dateNow.getFullYear(),
          temp,
          dateNow.getDate(),
          hourTime[0],
          hourTime[1]
        );
        const startDate = new Date(
          dateNow.getFullYear(),
          dateNow.getMonth(),
          dateNow.getDate(),
          hourTime[0],
          hourTime[1]
        );
        let currentDate = startDate.getTime();

        while (currentDate < dateEndSchedule.getTime()) {
          currentDate += 24 * 60 * 60 * 1000;
          const tempDateTime = new Date(currentDate);
          const findDate = dateOfWeek.findIndex(
            (x) => x === tempDateTime.getDay()
          );
          if (findDate > -1) {
            tempDate.push(tempDateTime.toISOString());
          }
        }
        setTimeSchedule(tempDate);
        if (props.changeTimeSchedule) props.changeTimeSchedule(tempDate);
      }
    }
  }, [time, monthSchedule, dateOfWeek]);

  useEffect(() => {
    if (
      timeSchedule.length > 0 &&
      service !== null &&
      service.type === "schedule"
    ) {
      const tempTime = time.split(":");
      let tempSchedule = listSchedule;
      for (let i = 0; i < tempSchedule.length; i++) {
        for (let y = 0; y < tempSchedule[i].date.length; y++) {
          tempSchedule[i].date[y].timeISOSTring = new Date(
            tempSchedule[i].date[y].year,
            tempSchedule[i].date[y].month,
            tempSchedule[i].date[y].date,
            tempTime[0],
            tempTime[1]
          ).toISOString();
        }
      }
      setListSchedule(tempSchedule);
    }
  }, [timeSchedule]);

  const onChangeLoopDate = (newValue) => {
    let tempService = JSON.parse(JSON.stringify(service));
    tempService.is_auto_order = newValue;
    setIsAutoOrder(newValue) // Gán tạm nhanh giá trị
    if (timeSchedule !== null && newValue === true) {
      const getDateOfWeek = new Date(timeSchedule).getDay();
      setDateOfWeek([getDateOfWeek]);
      setPaymentMethod(PAYMENT_METHOD[0].value);
      setIsChoicePaymentMethod(false);
    } else {
      setDateOfWeek([]);
      setIsChoicePaymentMethod(true);
    }
    console.log("check tempService >>> ", tempService);
    setService(tempService);
  };

  const onClickDateOfWeek = (newValue) => {
    let newArray = [];
    newArray = dateOfWeek.filter((x) => x !== newValue);
    if (newArray.length === dateOfWeek.length) {
      newArray.push(newValue);
    }
    newArray.sort();
    setDateOfWeek(newArray);
  };

  const onClickMonthSchedule = (newValue) => {
    setMonthSchedule(newValue);
  };

  const changeDateSchedule = (newValue) => {
    let findItem = timeSchedule.filter((x) => x !== newValue.timeISOSTring);
    if (timeSchedule.length === findItem.length) {
      findItem.push(newValue.timeISOSTring);
    }
    setTimeSchedule(findItem);
    if (props.changeTimeSchedule) props.changeTimeSchedule(findItem);
  };

  return (
    <div>
      {service !== null && (
        <div className="date-work-component">
          {service.type === "schedule" ? (
            // Giúp việc cố định
            <div className="date-work-component__schedule">
              <div className="date-work-component__schedule--container">
                <span className="date-work-component__schedule--container-label">
                  Ngày làm trong tuần
                </span>
                <div className="date-work-component__schedule--container-date-in-week">
                  {DATE_OF_WEEK.map((item, index) => (
                    <div
                      key={index}
                      className={`date-work-component__schedule--container-date-in-week-child ${
                        dateOfWeek.findIndex((x) => x === item.value) > -1 &&
                        "selected"
                      }`}
                      onClick={() => {
                        onClickDateOfWeek(item.value);
                      }}
                    >
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="date-work-component__schedule--time">
                <span className="date-work-component__schedule--time-label">
                  Chọn thời gian làm
                </span>
                <div className="date-work-component__schedule--time-list">
                  {listTimeQuickSelect.time.map((item, index) => (
                    <div
                      key={index}
                      className={`date-work-component__schedule--time-list-child ${
                        item.label === time && "selected"
                      } `}
                      onClick={() => {
                        setTime(item.label);
                      }}
                    >
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="date-work-component__schedule--month">
                <div className="date-work-component__schedule--month-header">
                  <span className="date-work-component__schedule--month-header-label">
                    Gói tháng
                  </span>
                  <button
                    className="date-work-component__schedule--month-header-review"
                    onClick={() => {
                      setIsOpenDetailSchedule(!isOpenDetailSchedule);
                    }}
                  >
                    Xem lịch làm việc
                  </button>
                </div>
                <div className="date-work-component__schedule--month-container">
                  {MONTH_SCHEDULE.map((item, index) => (
                    <div
                      key={index}
                      className={`date-work-component__schedule--month-container-child ${
                        monthSchedule === item.value && "selected"
                      }`}
                      onClick={() => {
                        onClickMonthSchedule(item.value);
                      }}
                    >
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Giúp việc theo giờ
            <div className="date-work-component__time-section">
              <div className="date-work-component__time-section--date">
                <span className="date-work-component__time-section--date-label">
                  Chọn ngày làm
                </span>
                {/* <DatePicker
                  style={{ width: "100%" }}
                  format={"DD/MM/YYYY"}
                  onChange={setDate}
                  className="date-picker-select-time"
                /> */}
                <InputTextCustom
                  type="date"
                  value={date}
                  placeHolder="Ngày làm"
                  setValueSelectedProps={setDate}
                />
              </div>
              <div className="date-work-component__time-section--date">
                <span className="date-work-component__time-section--date-label">
                  Chọn giờ làm
                </span>
                <div className="date-work-component__time-section--date-list">
                  {listTimeQuickSelect.time.map((el, index) => (
                    <div
                      onClick={() => setTime(el.label)}
                      key={index}
                      className={`date-work-component__time-section--date-list-child ${
                        el.label === time && "selected"
                      } `}
                    >
                      <span>{el.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Lặp lại theo tuần */}
              {service.type === "loop" ? (
                <div className="date-work-component__time-section--loop">
                  <div className="date-work-component__time-section--loop-title">
                    <span className="date-work-component__time-section--loop-title-label">
                      Lặp lại theo tuần
                    </span>
                    <Switch
                      size="small"
                      disabled={!timeSchedule.length > 0}
                      checked={service.is_auto_order}
                      onChange={() => {
                        onChangeLoopDate(!service.is_auto_order);
                      }}
                    />
                    {!timeSchedule.length > 0 && (
                      <span className="date-work-component__time-section--loop-title-warning">{`(Vui lòng chọn thời gian làm việc trước khi tích vào đây)`}</span>
                    )}
                  </div>
                  {service.is_auto_order && (
                    <div className="date-work-component__time-section--loop-date-in-week">
                      {DATE_OF_WEEK.map((item, index) => (
                        <div
                          key={index}
                          className={`date-work-component__time-section--loop-date-in-week-child ${
                            dateOfWeek.findIndex((x) => x === item.value) >
                              -1 && "selected"
                          } `}
                          onClick={() => {
                            onClickDateOfWeek(item.value);
                          }}
                        >
                          <span>{item.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <></>
              )}
            </div>
          )}
        </div>
      )}
      <Drawer
        title={`Chi tiết lịch làm việc`}
        placement="right"
        onClose={() => setIsOpenDetailSchedule(false)}
        width={500}
        open={isOpenDetailSchedule}
        headerStyle={{ height: 50 }}
      >
        <div className="date-detail-schedule">
          {listSchedule.map((monthItem) => (
            <>
              <p className="div-title-month">
                Tháng {monthItem.month + 1}, {monthItem.year}
              </p>
              <div className="div-flex-row div-month">
                {DATE_OF_WEEK.map((item) => (
                  <>
                    <div className="div-flex-column column-week">
                      <p className="div-title-week">{item.label}</p>
                      {monthItem.date.map((dateItem, index) => (
                        <>
                          {monthItem.date.findIndex(
                            (x) => x.dateOfWeek === item.value
                          ) === index &&
                          monthItem.firstLastWeek < index &&
                          index < 7 ? (
                            <div className="empty-date"></div>
                          ) : (
                            <></>
                          )}
                          {dateItem.dateOfWeek === item.value ? (
                            <>
                              <p
                                className={`div-date-schedule ${
                                  timeSchedule.indexOf(dateItem.timeISOSTring) >
                                  -1
                                    ? "div-date-selected"
                                    : ""
                                }`}
                                onClick={() => {
                                  changeDateSchedule(dateItem);
                                }}
                              >
                                {dateItem.date}
                              </p>
                            </>
                          ) : (
                            <></>
                          )}
                        </>
                      ))}
                    </div>
                  </>
                ))}
              </div>
            </>
          ))}
        </div>
      </Drawer>
    </div>
  );
};

export default DateWorkComponent;
