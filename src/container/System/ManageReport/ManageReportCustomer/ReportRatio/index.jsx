import { Card, Statistic } from "antd";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { getReportCustomerRatio } from "../../../../../api/report";
import CustomDatePicker from "../../../../../components/customDatePicker";
import LoadingPagination from "../../../../../components/paginationLoading";
import "./styles.scss";

const ReportRatio = () => {
  const [state, setState] = useState({
    average_purchase_value: 0,
    average_frequency_of_purchases: 0,
    customer_value: 0,
  });
  const [startDate, setStartDate] = useState(
    moment().subtract(30, "d").startOf("date").toISOString()
  );
  const [endDate, setEndDate] = useState(moment().endOf("date").toISOString());
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    getReportCustomerRatio(
      moment().subtract(30, "d").startOf("date").toISOString(),
      moment().endOf("date").toISOString(),
      ""
    )
      .then((res) => {
        setState({
          ...state,
          average_purchase_value: res?.average_purchase_value,
          average_frequency_of_purchases: res?.average_frequency_of_purchases,
          customer_value: res?.customer_value,
        });
      })
      .catch((err) => {});
  }, []);

  const onChangeDay = useCallback(() => {
    setIsLoading(true);
    getReportCustomerRatio(startDate, endDate, "")
      .then((res) => {
        setState({
          ...state,
          average_purchase_value: res?.average_purchase_value,
          average_frequency_of_purchases: res?.average_frequency_of_purchases,
          customer_value: res?.customer_value,
        });
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }, [startDate, endDate, state]);

  return (
    <>
      <p className="title-ratio-customer">Báo cáo tỉ suất khách hàng</p>
      <div className="div-date mt-3">
        <CustomDatePicker
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          onClick={onChangeDay}
          onCancel={() => {}}
          setSameStart={() => {}}
          setSameEnd={() => {}}
        />
        {startDate && (
          <p className="text-date m-0 ml-2">
            {moment(new Date(startDate)).format("DD/MM/YYYY")} -{" "}
            {moment(endDate).utc().format("DD/MM/YYYY")}
          </p>
        )}
      </div>

      <div className="div-chart-ratio-customer">
        <Card className="cart-ratio-customer">
          <Statistic
            title="Giá trị mua hàng trung bình"
            value={state.average_purchase_value}
            valueStyle={{
              color: "#3f8600",
            }}
            suffix="₫"
          />
        </Card>
        <Card className="cart-ratio-customer">
          <Statistic
            title="Tần suất mua hàng trung bình"
            value={state.average_frequency_of_purchases}
            valueStyle={{
              color: "#3f8600",
            }}
            precision={2}
          />
        </Card>
        <Card className="cart-ratio-customer">
          <Statistic
            title="Giá trị khách hàng"
            value={state.customer_value}
            valueStyle={{
              color: "#3f8600",
            }}
            suffix="₫"
          />
        </Card>
      </div>

      {isLoading && <LoadingPagination />}
    </>
  );
};

export default ReportRatio;
