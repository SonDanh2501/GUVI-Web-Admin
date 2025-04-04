import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Pagination, Table } from "antd";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import _debounce from "lodash/debounce";
import { Link } from "react-router-dom";
import {
  cancelPointCustomerApi,
  deletePointCustomerApi,
  getTopupPointCustomerApi,
  searchTopupPointCustomerApi,
  verifyPointCustomerApi,
} from "../../../../../api/topup";
import AddPoint from "../../../../../components/addPointCustomer/addPoint";
import ModalCustom from "../../../../../components/modalCustom";
import LoadingPagination from "../../../../../components/paginationLoading";
import { errorNotify } from "../../../../../helper/toast";
import useWindowDimensions from "../../../../../helper/useWindowDimensions";
import i18n from "../../../../../i18n";
import {
  getElementState,
  getLanguageState,
} from "../../../../../redux/selectors/auth";
import "./index.scss";

const TopupPoint = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState();
  const [dataSearch, setDataSearch] = useState([]);
  const [totalSearch, setTotalSearch] = useState();
  const [valueSearch, setValueSearch] = useState("");
  const [itemEdit, setItemEdit] = useState([]);
  const [startPage, setStartPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalCancel, setModalCancel] = useState(false);
  const { width } = useWindowDimensions();
  const toggle = () => setModal(!modal);
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);

  const toggleConfirm = () => setModalConfirm(!modalConfirm);
  const toggleCancel = () => setModalCancel(!modalCancel);

  useEffect(() => {
    getTopupPointCustomerApi(0, 20)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => console.log(err));
  }, []);

  const onDelete = useCallback(
    (id) => {
      setIsLoading(true);
      deletePointCustomerApi(id)
        .then((res) => {
          getTopupPointCustomerApi(startPage, 20)
            .then((res) => {
              setData(res?.data);
              setTotal(res?.totalItem);
              setModal(false);
              setIsLoading(false);
            })
            .catch((err) => {
              errorNotify({
                message: err?.message,
              });
              setIsLoading(false);
            });
        })
        .catch((err) => {});
    },
    [startPage]
  );

  const onConfirm = useCallback(
    (id) => {
      setIsLoading(true);
      verifyPointCustomerApi(id)
        .then((res) => {
          getTopupPointCustomerApi(startPage, 20)
            .then((res) => {
              setData(res?.data);
              setTotal(res?.totalItem);
              setModalConfirm(false);
              setIsLoading(false);
            })
            .catch((err) => {
              errorNotify({
                message: err?.message,
              });
              setIsLoading(false);
            });
        })
        .catch((err) => {
          errorNotify({
            message: err?.message,
          });
          setIsLoading(false);
        });
    },
    [startPage]
  );

  const onCancel = useCallback(
    (id) => {
      setIsLoading(true);
      cancelPointCustomerApi(id)
        .then((res) => {
          getTopupPointCustomerApi(startPage, 20)
            .then((res) => {
              setData(res?.data);
              setTotal(res?.totalItem);
              setModalCancel(false);
              setIsLoading(true);
            })
            .catch((err) => setIsLoading(true));
        })
        .catch((err) => {
          errorNotify({
            message: err?.message,
          });
          setIsLoading(true);
        });
    },
    [startPage]
  );

  const handleSearch = _debounce((value) => {
    setValueSearch(value);
    searchTopupPointCustomerApi(startPage, 20, value)
      .then((res) => {
        setDataSearch(res?.data);
        setTotalSearch(res?.totalItem);
      })
      .catch((err) => {});
  }, 1000);

  const columns = [
    {
      title: `${i18n.t("customer", { lng: lang })}`,
      render: (data) => {
        return (
          <Link
            to={`/profile-customer/${data?.id_customer?._id}`}
            className="div-name-point"
          >
            <p className="text-name">{data?.name_customer}</p>
            <p className="text-phone-point">{data?.phone_customer}</p>
          </Link>
        );
      },
    },
    {
      title: `${i18n.t("score", { lng: lang })}`,
      render: (data) => {
        return <p className="text-point">{data?.value}</p>;
      },
      align: "center",
      sorter: (a, b) => a.value - b.value,
    },
    {
      title: `${i18n.t("point_type", { lng: lang })}`,
      render: (data) => {
        return (
          <p className="text-type-point">
            {data?.type_point === "point"
              ? `${i18n.t("bonus", { lng: lang })}`
              : `${i18n.t("kind_member", { lng: lang })}`}
          </p>
        );
      },
    },
    {
      title: `${i18n.t("content", { lng: lang })}`,
      render: (data) => {
        return <p className="text-description-topup-point">{data?.note}</p>;
      },
    },
    {
      title: `${i18n.t("date_create", { lng: lang })}`,
      render: (data) => {
        return (
          <div className="div-day-create-point">
            <p className="text-day">
              {moment(new Date(data?.date_create)).format("DD/MM/YYYY")}
            </p>
            <p className="text-day">
              {moment(new Date(data?.date_create)).format("HH:mm")}
            </p>
          </div>
        );
      },
    },
    {
      title: `${i18n.t("status", { lng: lang })}`,
      render: (data) => {
        return (
          <div>
            {data?.status === "pending" ? (
              <p className="text-pending-point">{`${i18n.t("processing", {
                lng: lang,
              })}`}</p>
            ) : data?.status === "done" ? (
              <p className="text-done-point">{`${i18n.t("complete", {
                lng: lang,
              })}`}</p>
            ) : (
              <p className="text-cancel-point">{`${i18n.t("cancel", {
                lng: lang,
              })}`}</p>
            )}
          </div>
        );
      },
      align: "center",
    },
    {
      key: "action",
      align: "center",
      render: (data) => {
        return (
          <div>
            {checkElement?.includes("verify_point_cash_book_customer") && (
              <Button
                className="btn-verify-point-customer"
                disabled={
                  data?.is_verify ||
                  (!data?.is_verify && data?.status === "cancel")
                    ? true
                    : false
                }
                onClick={toggleConfirm}
              >
                {`${i18n.t("approvals", { lng: lang })}`}
              </Button>
            )}

            <div>
              {checkElement?.includes("cancel_point_cash_book_customer") && (
                <>
                  {data?.status === "pending" && (
                    <p className="text-cancel-point" onClick={toggleCancel}>
                      {`${i18n.t("cancel_modal", { lng: lang })}`}
                    </p>
                  )}
                </>
              )}
              {checkElement?.includes("delete_point_cash_book_customer") && (
                <button className="btn-delete-point" onClick={toggle}>
                  <i className="uil uil-trash"></i>
                </button>
              )}
            </div>
          </div>
        );
      },
    },
  ];

  const onChange = (page) => {
    setCurrentPage(page);
    const dataLength = data.length < 20 ? 20 : data.length;
    const searchLength = dataSearch.length < 20 ? 20 : dataSearch.length;
    const start =
      dataSearch.length > 0
        ? page * searchLength - searchLength
        : page * dataLength - dataLength;
    setStartPage(start);

    dataSearch.length > 0
      ? searchTopupPointCustomerApi(start, 20, valueSearch)
          .then((res) => {
            setDataSearch(res?.data);
            setTotalSearch(res?.totalItem);
          })
          .catch((err) => {})
      : getTopupPointCustomerApi(start, 20)
          .then((res) => {
            setData(res?.data);
            setTotal(res?.totalItem);
          })
          .catch((err) => console.log(err));
  };
  return (
    <div>
      <div className="div-head-point mt-2">
        {checkElement?.includes("topup_point_cash_book_customer") && (
          <AddPoint setDataL={setData} setTotal={setTotal} start={startPage} />
        )}
        <Input
          placeholder={`${i18n.t("search", { lng: lang })}`}
          type="text"
          className="input-search-topup-point"
          prefix={<SearchOutlined />}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
        />
      </div>
      <div className="mt-3">
        <Table
          columns={columns}
          dataSource={dataSearch.length > 0 ? dataSearch : data}
          pagination={false}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setItemEdit(record);
              },
            };
          }}
          scroll={{ x: width < 900 ? 1200 : 0 }}
        />
      </div>
      <div className="div-pagination p-2">
        <p>Tổng: {totalSearch > 0 ? totalSearch : total}</p>
        <div>
          <Pagination
            current={currentPage}
            onChange={onChange}
            total={totalSearch > 0 ? totalSearch : total}
            showSizeChanger={false}
            pageSize={20}
          />
        </div>
      </div>

      <div>
        <ModalCustom
          isOpen={modalConfirm}
          title={`${i18n.t("approve_points", { lng: lang })}`}
          handleOk={() => onConfirm(itemEdit?._id)}
          handleCancel={toggleConfirm}
          textOk={`${i18n.t("approvals", { lng: lang })}`}
          body={
            <div className="body-modal">
              <p style={{ margin: 0 }}>
                {`${i18n.t("customer", { lng: lang })}`}:{" "}
                {itemEdit?.name_customer}
              </p>
              <p style={{ margin: 0 }}>
                {`${i18n.t("score", { lng: lang })}`}: {itemEdit?.value}
              </p>
              <p style={{ margin: 0 }}>
                {`${i18n.t("content", { lng: lang })}`}: {itemEdit?.note}
              </p>
              <p style={{ margin: 0 }}>
                {`${i18n.t("point_type", { lng: lang })}`}:{" "}
                {itemEdit?.type_point === "point"
                  ? `${i18n.t("reward_points", { lng: lang })}`
                  : `${i18n.t("rank_point", { lng: lang })}`}
              </p>
            </div>
          }
        />
      </div>

      <div>
        <ModalCustom
          isOpen={modal}
          title={`${i18n.t("delete_points", { lng: lang })}`}
          handleOk={() => onDelete(itemEdit?._id)}
          handleCancel={toggle}
          textOk={`${i18n.t("delete", { lng: lang })}`}
          body={
            <>
              <p style={{ margin: 0 }}>{`${i18n.t("want_delete_points", {
                lng: lang,
              })}`}</p>
              <p className="text-name-modal">{itemEdit?.name_customer}</p>
            </>
          }
        />
      </div>
      <div>
        <ModalCustom
          isOpen={modalCancel}
          title={`${i18n.t("cancel_points", { lng: lang })}`}
          handleOk={() => onCancel(itemEdit?._id)}
          handleCancel={toggleCancel}
          textOk={`${i18n.t("yes", { lng: lang })}`}
          body={
            <>
              <p>{`${i18n.t("want_cancel_points", { lng: lang })}`}</p>
              <p className="text-name-modal">{itemEdit?.name_customer}</p>
            </>
          }
        />
      </div>

      {isLoading && <LoadingPagination />}
    </div>
  );
};

export default TopupPoint;
