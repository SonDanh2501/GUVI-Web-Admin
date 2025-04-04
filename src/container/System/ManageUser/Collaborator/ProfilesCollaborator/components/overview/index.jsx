import HeaderCard from "../../../../../../../components/headerCard";
import "./styles.scss";
import { useEffect, useState } from "react";
import { loadingAction } from "../../../../../../../redux/actions/loading";
import { useDispatch } from "react-redux";
import {
  getAllHistoryOrderCollaborator,
  getCollaboratorsById,
  getHistoryOrderCollaborator,
  getListTrainingLessonByCollaboratorApi,
  getOverviewCollaborator,
  getReviewCollaborator,
} from "../../../../../../../api/collaborator";
import { errorNotify } from "../../../../../../../helper/toast";

import CardInfo from "../../../../../../../components/card";
import CardActivityLog from "../../../../../../../components/card/cardActivityLog";
import CardBieChart from "../../../../../../../components/card/cardBieChart";
import CardRadio from "../../../../../../../components/card/cardRadio";
import CardPunishBonus from "../../../../../../../components/card/cardPunishBonus";
import CardList from "../../../../../../../components/card/cardList";
import CardRanking from "../../../../../../../components/card/cardRanking";
import CardProgressBar from "../../../../../../../components/card/cardProgressBar";
import CardInformation from "../../../../../../../components/card/cardInformation";
import CardCheckList from "../../../../../../../components/card/cardCheckList";
import CardOrderActivityLog from "../../../../../../../components/card/cardOrderActivityLog";

const Overview = ({ id, star }) => {
  const dispatch = useDispatch();
  const dataAreaChart = [
    {
      subject: "Làm việc chăm chỉ",
      A: 1,
      B: 2,
      fullMark: 5,
    },
    {
      subject: "Đồng phục gọn gàn, sạch sẽ",
      A: 1,
      B: 2,
      fullMark: 5,
    },
    {
      subject: "Dụng cụ chuẩn bị đầy đủ",
      A: 3,
      B: 4,
      fullMark: 5,
    },
    {
      subject: "Làm việc rất tốt, dọn dẹp sạch sẽ",
      A: 5,
      B: 5,
      fullMark: 5,
    },
    {
      subject: "Giờ giấc chuẩn, luôn đến trước giờ hẹn",
      A: 3,
      B: 4,
      fullMark: 5,
    },
  ]; // Giá trị tạm thời để hiển thị của tiêu chí đánh giá

  /* ~~~ Value ~~~ */
  const [dataRatingTotalItem, setDataRatingTotalItem] = useState(0); // Giá trị tổng số lượt đánh giá
  const [dataJobsTotalItem, setDataJobsTotalItem] = useState(0); // Giá trị tổng công việc
  const [dataJobsTotalSuccess, setDataJobsTotalSuccess] = useState(0); // Tổng số công việc hoàn thành
  const [dataJobsTotalCancel, setDataJobsTotalCancel] = useState(0); // Tổng số công việc đã hủy
  const [dataJobsTotalOther, setDataJobsTotalOther] = useState(0); // Tổng các công việc khác (đã nhận, đang làm)

  /* ~~~ List ~~~ */
  const [dataInformationCollaborator, setDataInformationCollaborator] =
    useState([]);
  const [dataExamination, setDataExamination] = useState([]); // Giá trị các bài kiểm tra
  const [listRecentOrderActivity, setListRecentOrderActivity] = useState([]); // Danh sách những hoạt động đơn hàng mới nhất
  const [dataRating, setDataRating] = useState([
    {
      name: "5 sao",
      value: 1,
    },
    {
      name: "4 sao",
      value: 1,
    },
    {
      name: "3 sao",
      value: 1,
    },
    {
      name: "2 sao",
      value: 1,
    },
    {
      name: "1 sao",
      value: 1,
    },
  ]); // Giá trị tổng giá trị từng loại sao
  const [total, setTotal] = useState({
    total_favourite: 0,
    total_order: 0,
    total_hour: 0,
    remainder: 0,
    gift_remainder: 0,
  }); // Tổng các giá trị: số lượt yêu thích, số đơn hoàn thành, số giờ làm...

  /* ~~~ Handle Function ~~~ */
  // 1. Hàm tính tổng từng loại sao
  const handleCalculateStarEachKind = (
    totalRating,
    setTotalRating,
    dataReview
  ) => {
    if (totalRating.length > 0 && dataReview.totalItem > 0) {
      let fiveStar = 0;
      let fourStar = 0;
      let threeStar = 0;
      let twoStar = 0;
      let oneStar = 0;
      dataReview?.data?.forEach((el) => {
        if (el.star === 5) fiveStar += 1;
        if (el.star === 4) fourStar += 1;
        if (el.star === 3) threeStar += 1;
        if (el.star === 2) twoStar += 1;
        if (el.star === 1) oneStar += 1;
      });
      setTotalRating((prevTotalRating) =>
        prevTotalRating.map((item, index) => {
          if (index === 0) {
            return { ...item, value: fiveStar };
          }
          if (index === 1) {
            return {
              ...item,
              value: fourStar,
            };
          }
          if (index === 2) {
            return {
              ...item,
              value: threeStar,
            };
          }
          if (index === 3) {
            return {
              ...item,
              value: twoStar,
            };
          }
          if (index === 4) {
            return {
              ...item,
              value: oneStar,
            };
          }
          return item;
        })
      );
      setDataRatingTotalItem(
        fiveStar + fourStar + threeStar + twoStar + oneStar
      );
    }
  };

  // Hàm fetch giá trị lịch sử 5 đơn hàng gần nhất
  const fetchRecentHistoryOrder = async (idCollaborator, start, length) => {
    try {
      dispatch(loadingAction.loadingRequest(true))
      const res = await getHistoryOrderCollaborator(
        idCollaborator,
        start,
        length
      );
      setListRecentOrderActivity(res);
      dispatch(loadingAction.loadingRequest(false))
    } catch (err) {
      errorNotify({
        message: err?.message || err,
      });
      dispatch(loadingAction.loadingRequest(false))
    }
  };

  const fetchHistoryOrder = async (idCollaborator) => {
    try {
      const res = await getAllHistoryOrderCollaborator(idCollaborator);
      res.map((el, index) => {
        if (el._id === "done") {
          setDataJobsTotalSuccess(el.total_order)
        }
        if (el._id === "confirm") {
          setDataJobsTotalOther(el.total_order)
        }
        if (el._id === "cancel") {
          setDataJobsTotalCancel(el.total_order)
        }
      });
      const totalItem = res.reduce((sum, el) => sum + el.total_order, 0);
      setDataJobsTotalItem(totalItem);

    } catch (err ) {
      errorNotify({ message: err?.message || err });
    }
  }
  /* ~~~ Use effect ~~~ */
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(loadingAction.loadingRequest(true));
        let tempTotalDoneActivity = 0,
          tempTotalCancelActivity = 0,
          tempTotalOtherActivity = 0;
        const [
          dataStarFetch,
          dataExaminationFetch,
          dataInformationCollaboratorFetch,
          dataOverviewCollaboratorFetch,
        ] = await Promise.all([
          getReviewCollaborator(id, 0, 1), // Fetch dữ liệu lấy đánh giá gần nhất của đối tác (dùng trick để lấy tổng đánh giá)
          getListTrainingLessonByCollaboratorApi(id, 0, 20, "all"), // Fetch dữ liệu các bài kiểm tra của đối tác
          getCollaboratorsById(id), // Fetch dữ liệu thông tin cộng tác viên
          getOverviewCollaborator(id), // Fetch dữ liệu tổng quan của đối tác
        ]);
        // Sau khi có tổng số lượng đánh giá, gọi lại API để lấy toàn bộ dữ liệu đánh giá
        const fullReviewData = await getReviewCollaborator(
          id,
          0,
          dataStarFetch.totalItem
        );
        /* Gán giá trị */
        handleCalculateStarEachKind(dataRating, setDataRating, fullReviewData);
        setDataExamination(dataExaminationFetch?.data);
        setDataInformationCollaborator(dataInformationCollaboratorFetch);
        setTotal({
          ...total,
          total_favourite:
            dataOverviewCollaboratorFetch?.total_favourite.length,
          total_hour: dataOverviewCollaboratorFetch?.total_hour,
          total_order: dataOverviewCollaboratorFetch?.total_order,
          remainder: dataOverviewCollaboratorFetch?.remainder,
          gift_remainder: dataOverviewCollaboratorFetch?.gift_remainder,
          work_wallet: dataOverviewCollaboratorFetch?.work_wallet,
          collaborator_wallet:
            dataOverviewCollaboratorFetch?.collaborator_wallet,
        });
        dispatch(loadingAction.loadingRequest(false));
      } catch (err) {
        errorNotify({
          message: err?.message,
        });
        dispatch(loadingAction.loadingRequest(false));
      }
    };
    fetchData();
  }, [id, dispatch]);

  useEffect(() => {
    fetchRecentHistoryOrder(id, 0, 5); // Lấy 5 hoạt động đơn hàng mới nhất
    fetchHistoryOrder(id);
  }, [id]);
  return (
    <div class="collaborator-overview">
      {/* Left container */}
      <div class="collaborator-overview__left">
        <CardInfo
          cardHeader="Tổng quan đánh giá"
          cardContent={
            <CardBieChart
              data={dataRating}
              star={star}
              // totalItem={dataRating?.reduce((acc, item) => acc + item.value, 0)}
              totalItem={dataRatingTotalItem}
            />
          }
        />
        <CardInfo
          cardHeader="Tiêu chí đánh giá"
          cardContent={
            <CardRadio
              data={dataAreaChart}
              dataKey="subject"
              dataName="Mục đánh giá"
            />
          }
          supportIcon={true}
        />
        <CardInfo
          cardHeader="Khen thưởng, vi phạm"
          cardContent={<CardPunishBonus />}
          supportIcon={true}
        />
        <CardInfo
          cardHeader="Bài kiểm tra"
          cardContent={<CardList data={dataExamination} />}
        />
      </div>
      {/* Middle container */}
      <div class="collaborator-overview__middle">
        <CardInfo
          cardHeader="Tài chính"
          cardContent={<CardRanking />}
          supportIcon={true}
          timeFilter={true}
        />
        <CardInfo
          cardHeader="Hiệu quả công việc"
          cardContent={
            <CardProgressBar
              totalJobs={dataJobsTotalItem}
              totalJobsSuccess={dataJobsTotalSuccess}
              totalJobsCancel={dataJobsTotalCancel}
              totalJobsOther={dataJobsTotalOther}
            />
          }
        />
        <CardInfo
          cardHeader="Hoạt động gần đây"
          cardContent={
            <CardOrderActivityLog
              data={listRecentOrderActivity?.data}
              totalItem={listRecentOrderActivity?.data?.length}
              dateIndex="date_work"
              statusIndex="status"
            />
          }
        />
      </div>
      {/* Right container */}
      <div class="collaborator-overview__right">
        <CardInfo
          cardContent={
            <CardInformation data={dataInformationCollaborator} total={total} />
          }
        />
        <CardInfo
          cardHeader="Tiến hành hồ sơ"
          cardContent={<CardCheckList data={dataInformationCollaborator} />}
        />
      </div>
    </div>
  );
};

export default Overview;
