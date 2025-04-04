import { Button, Pagination, Table, Tooltip } from "antd";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  cancelMoneyPunishApi,
  confirmMoneyPunishApi,
  deleteMoneyPunishApi,
  getListPunishApi,
  refundMoneyPunishApi,
} from "../../../../../api/topup";
import EditPunish from "../../../../../components/editPunishMoney/editPunish";
import ModalCustom from "../../../../../components/modalCustom";
import LoadingPagination from "../../../../../components/paginationLoading";
import PunishMoneyCollaborator from "../../../../../components/punishMoneyCollaborator/punishMoneyCollaborator";
import { formatMoney } from "../../../../../helper/formatMoney";
import { errorNotify } from "../../../../../helper/toast";
import { useCookies } from "../../../../../helper/useCookies";
import useWindowDimensions from "../../../../../helper/useWindowDimensions";
import i18n from "../../../../../i18n";
import {
  getElementState,
  getLanguageState,
} from "../../../../../redux/selectors/auth";
import "./index.scss";

const Punish = () => {
  const [saveToCookie, readCookie] = useCookies();
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(
    readCookie("punish_start_ctv") === ""
      ? 0
      : Number(readCookie("punish_start_ctv"))
  );
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalCancel, setModalCancel] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalRefund, setModalRefund] = useState(false);
  const [itemEdit, setItemEdit] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { width } = useWindowDimensions();
  const navigate = useNavigate();
  const toggleConfirm = () => setModalConfirm(!modalConfirm);
  const toggleCancel = () => setModalCancel(!modalCancel);
  const toggle = () => setModal(!modal);
  const toggleRefund = () => setModalRefund(!modalRefund);
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);
  const punishCurrentCookie = readCookie("punish_current_page_ctv");

  useEffect(() => {
    getListPunishApi(0, 20)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
    setCurrentPage(
      punishCurrentCookie === "" ? 1 : Number(punishCurrentCookie)
    );
  }, [punishCurrentCookie]);

  const onConfirm = useCallback(
    (id) => {
      setIsLoading(true);
      confirmMoneyPunishApi(id).then((res) => {
        getListPunishApi(startPage, 20)
          .then((res) => {
            setData(res?.data);
            setTotal(res?.totalItem);
            setIsLoading(false);
            setModalConfirm(false);
          })
          .catch((err) => {
            setIsLoading(false);
            errorNotify({
              message: err?.message,
            });
          })
          .catch((err) => {
            setIsLoading(false);
            errorNotify({
              message: err?.message,
            });
          });
      });
    },
    [startPage]
  );

  const onCancel = useCallback(
    (id) => {
      setIsLoading(true);
      cancelMoneyPunishApi(id)
        .then((res) => {
          setModalCancel(false);
          getListPunishApi(startPage, 20)
            .then((res) => {
              setData(res?.data);
              setTotal(res?.totalItem);
              setIsLoading(false);
              setModalCancel(false);
            })
            .catch((err) => {});
        })
        .catch((err) => {
          setIsLoading(false);
          errorNotify({
            message: err?.message,
          });
        });
    },
    [startPage]
  );

  const onDelete = useCallback(
    (id) => {
      setIsLoading(true);
      deleteMoneyPunishApi(id)
        .then((res) => {
          setModalCancel(false);
          getListPunishApi(startPage, 20)
            .then((res) => {
              setData(res?.data);
              setTotal(res?.totalItem);
              setIsLoading(false);
              setModal(false);
            })
            .catch((err) => {});
        })
        .catch((err) => {
          setIsLoading(false);
          errorNotify({
            message: err?.message,
          });
        });
    },
    [startPage]
  );

  const onRefund = (id) => {
    setIsLoading(true);
    refundMoneyPunishApi(id)
      .then((res) => {
        setModalRefund(false);
        getListPunishApi(startPage, 20)
          .then((res) => {
            setData(res?.data);
            setTotal(res?.totalItem);
            setIsLoading(false);
            setModal(false);
          })
          .catch((err) => {});
      })
      .catch((err) => {
        setIsLoading(false);
        errorNotify({
          message: err?.message,
        });
      });
  };

  const onChange = (page) => {
    setCurrentPage(page);
    saveToCookie("punish_current_page_ctv", page);
    const dataLength = data.length < 20 ? 20 : data.length;
    const start = page * dataLength - dataLength;
    setStartPage(start);
    saveToCookie("punish_start_ctv", start);
    getListPunishApi(start, 20)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  };

  const columns = [
    {
      title: () => {
        return (
          <p className="title-column">{`${i18n.t("code_collaborator", {
            lng: lang,
          })}`}</p>
        );
      },
      render: (data) => (
        <p
          className="text-id-ctv"
          onClick={() =>
            navigate("/details-collaborator", {
              state: { id: data?.id_collaborator?._id },
            })
          }
        >
          {data?.id_collaborator?.id_view}
        </p>
      ),
    },
    {
      title: () => {
        return (
          <p className="title-column">{`${i18n.t("collaborator", {
            lng: lang,
          })}`}</p>
        );
      },
      render: (data) => {
        return (
          <Link
            to={`/details-collaborator/${data?.id_collaborator?._id}`}
            className="div-name-punish"
          >
            <p className="text-name-punish">
              {data?.id_collaborator?.full_name}
            </p>
            <p className="text-name-punish">{data?.id_collaborator?.phone}</p>
          </Link>
        );
      },
    },
    {
      title: () => {
        return (
          <p className="title-column">{`${i18n.t("money", { lng: lang })}`}</p>
        );
      },
      render: (data) => (
        <p className="text-money-punish">{formatMoney(data?.money)}</p>
      ),
      sorter: (a, b) => a.money - b.money,
    },
    {
      title: () => {
        return (
          <p className="title-column">{`${i18n.t("content", {
            lng: lang,
          })}`}</p>
        );
      },
      render: (data) => (
        <p className="text-description-punish">{data?.note_admin}</p>
      ),
    },
    {
      title: () => {
        return (
          <p className="title-column">{`${i18n.t("date_create", {
            lng: lang,
          })}`}</p>
        );
      },
      render: (data) => {
        return (
          <div className="div-time-punish">
            <p className="text-time">
              {moment(new Date(data?.date_create)).format("DD/MM/yyy")}
            </p>
            <p className="text-time">
              {moment(new Date(data?.date_create)).format("HH:mm")}
            </p>
          </div>
        );
      },
    },
    {
      title: () => {
        return (
          <p className="title-column">{`${i18n.t("status", { lng: lang })}`}</p>
        );
      },
      render: (data) => {
        return (
          <div>
            {data?.status === "pending" ? (
              <p className="text-pending-punish">{`${i18n.t("processing", {
                lng: lang,
              })}`}</p>
            ) : data?.status === "transfered" ? (
              <p className="text-transfered-punish">{`${i18n.t(
                "money_transferred",
                {
                  lng: lang,
                }
              )}`}</p>
            ) : data?.status === "done" ? (
              <p className="text-done-punish">{`${i18n.t("complete", {
                lng: lang,
              })}`}</p>
            ) : data?.status === "done" ? (
              <p className="text-cancel-punish-ctv">{`${i18n.t("cancel", {
                lng: lang,
              })}`}</p>
            ) : (
              <p className="text-refund-topup">{`${i18n.t("refund", {
                lng: lang,
              })}`}</p>
            )}
          </div>
        );
      },
      align: "center",
    },
    {
      title: () => {
        return (
          <p className="title-column">{`${i18n.t("approved_by", {
            lng: lang,
          })}`}</p>
        );
      },
      render: (data) => {
        return (
          <p className="text-name-verify">
            {data?.is_punish_system && data?.id_admin_refund
              ? data?.id_admin_refund?.full_name
              : data?.is_punish_system
              ? `${i18n.t("system", { lng: lang })}`
              : data?.id_admin_verify?.full_name}
          </p>
        );
      },
      align: "center",
    },
    {
      title: "",
      key: "action",
      align: "center",
      render: (data) => {
        return (
          <div>
            {checkElement?.includes("verify_punish_cash_book_collaborator") && (
              <Button
                className="btn-confirm"
                onClick={toggleConfirm}
                disabled={
                  data?.status === "cancel" ||
                  data?.status === "done" ||
                  data?.status === "refund"
                    ? true
                    : false
                }
              >
                {`${i18n.t("approved_by", { lng: lang })}`}
              </Button>
            )}

            <div className="refunds-cancel">
              {data?.status === "done" && (
                <div onClick={toggleRefund}>
                  <p className="text-refunds">{`${i18n.t("refund", {
                    lng: lang,
                  })}`}</p>
                </div>
              )}
              {checkElement?.includes(
                "cancel_punish_cash_book_collaborator"
              ) && (
                <div className="mt-1 ml-3">
                  {(data?.status === "pending" ||
                    data?.status === "transfered") && (
                    <Tooltip
                      placement="bottom"
                      title={`${i18n.t("canceling_collaborator_fine", {
                        lng: lang,
                      })}`}
                    >
                      <p className="text-cancel-topup" onClick={toggleCancel}>
                        {`${i18n.t("cancel_modal", { lng: lang })}`}
                      </p>
                    </Tooltip>
                  )}
                </div>
              )}
            </div>
            <div>
              {checkElement?.includes("edit_punish_cash_book_collaborator") && (
                <>
                  {data?.status === "cancel" ||
                  data?.status === "done" ||
                  data?.status === "refund" ? (
                    <></>
                  ) : (
                    <Tooltip
                      placement="bottom"
                      title={`${i18n.t("edit_collaborator_fine", {
                        lng: lang,
                      })}`}
                    >
                      <EditPunish
                        iconEdit={
                          <i
                            className={
                              (!data?.is_verify_punish &&
                                data?.status === "cancel") ||
                              data?.is_verify_punish
                                ? "uil uil-edit-alt icon-edit"
                                : "uil uil-edit-alt"
                            }
                          ></i>
                        }
                        item={itemEdit}
                        setDataT={setData}
                        setTotal={setTotal}
                        setIsLoading={setIsLoading}
                      />
                    </Tooltip>
                  )}
                </>
              )}

              {checkElement?.includes(
                "delete_punish_cash_book_collaborator"
              ) && (
                <Tooltip
                  placement="bottom"
                  title={`${i18n.t("remove_collaborator_fine", { lng: lang })}`}
                >
                  <button className="btn-delete" onClick={toggle}>
                    <i className="uil uil-trash"></i>
                  </button>
                </Tooltip>
              )}
            </div>
          </div>
        );
      },
    },
  ];
  return (
    <>
      <div>
        {checkElement?.includes("create_punish_cash_book_collaborator") && (
          <PunishMoneyCollaborator setDataT={setData} setTotal={setTotal} />
        )}
      </div>
      <div className="mt-3">
        <Table
          dataSource={data}
          columns={columns}
          pagination={false}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setItemEdit(record);
              },
            };
          }}
          scroll={{ x: width < 900 ? 1000 : 0 }}
        />
        <div className="div-pagination p-2">
          <p>
            {`${i18n.t("total", { lng: lang })}`}: {total}
          </p>
          <div>
            <Pagination
              current={currentPage}
              onChange={onChange}
              showSizeChanger={false}
              total={total}
              pageSize={20}
            />
          </div>
        </div>

        <div>
          <ModalCustom
            isOpen={modalConfirm}
            title={`${i18n.t("approval_of_fines", { lng: lang })}`}
            handleOk={() => onConfirm(itemEdit?._id)}
            handleCancel={toggleConfirm}
            textOk={`${i18n.t("approvals", { lng: lang })}`}
            body={
              <>
                <div className="body-modal">
                  <p className="text-content">
                    {`${i18n.t("collaborator", { lng: lang })}`}:{" "}
                    {itemEdit?.id_collaborator?.full_name}
                  </p>
                  <p className="text-content">
                    {`${i18n.t("phone", { lng: lang })}`}:{" "}
                    {itemEdit?.id_collaborator?.phone}
                  </p>
                  <p className="text-content">
                    {`${i18n.t("money", { lng: lang })}`}:{" "}
                    {formatMoney(itemEdit?.money)}
                  </p>
                  <p className="text-content">
                    {`${i18n.t("content", { lng: lang })}`}:{" "}
                    {itemEdit?.note_admin}
                  </p>
                </div>
              </>
            }
          />
        </div>
        <div>
          <ModalCustom
            isOpen={modalCancel}
            title={`${i18n.t("cancellation_of_fines", { lng: lang })}`}
            handleOk={() => onCancel(itemEdit?._id)}
            handleCancel={toggleCancel}
            textOk={`${i18n.t("yes", { lng: lang })}`}
            body={
              <>
                <p>
                  {`${i18n.t("want_cancellation_of_fines", { lng: lang })}`}
                </p>
                <p className="text-name-modal">
                  {itemEdit?.id_collaborator?.full_name}
                </p>
              </>
            }
          />
        </div>

        <div>
          <ModalCustom
            isOpen={modal}
            title={`${i18n.t("remove_the_fine", { lng: lang })}`}
            handleOk={() => onDelete(itemEdit?._id)}
            handleCancel={toggle}
            textOk={`${i18n.t("delete", { lng: lang })}`}
            body={
              <>
                <p>{`${i18n.t("want_remove_the_fine", { lng: lang })}`}</p>
                <p className="text-name-modal">
                  {itemEdit?.id_collaborator?.full_name}
                </p>
              </>
            }
          />

          <ModalCustom
            isOpen={modalRefund}
            title={`${i18n.t("refund_fines", { lng: lang })}`}
            handleOk={() => onRefund(itemEdit?._id)}
            handleCancel={toggleRefund}
            textOk={`${i18n.t("refund", { lng: lang })}`}
            body={
              <>
                <p>{`${i18n.t("want_refund_fines", { lng: lang })}`}</p>
                <p className="text-name-modal">
                  {itemEdit?.id_collaborator?.full_name}
                </p>
              </>
            }
          />
        </div>

        {isLoading && <LoadingPagination />}
      </div>
    </>
  );
};

export default Punish;
