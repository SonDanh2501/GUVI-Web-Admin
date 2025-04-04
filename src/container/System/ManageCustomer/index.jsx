import { PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Dropdown,
  FloatButton,
  Input,
  Select,
  Space,
  Pagination,
} from "antd";
import { useSelector } from "react-redux";
import i18n from "../../../i18n";
import { useCookies } from "../../../helper/useCookies";
import useWindowDimensions from "../../../helper/useWindowDimensions";
import "./index.scss";
import AddCustomer from "./addCustomer/addCustomer";
import {
  getElementState,
  getLanguageState,
} from "../../../redux/selectors/auth";
import {
  activeCustomer,
  deleteCustomer,
  fetchCustomers,
} from "../../../api/customer";
import DataTable from "../../../components/tables/dataTable";
import { UilEllipsisV } from "@iconscout/react-unicons";
import { useCallback, useEffect, useState } from "react";
import _debounce from "lodash/debounce";
import Tabs from "../../../components/tabs/tabs1";
import { getGroupCustomerApi } from "../../../api/promotion";
import ModalCustom from "../../../components/modalCustom";
import { errorNotify } from "../../../helper/toast";
import { useNavigate } from "react-router-dom";

const ManageCustomer = () => {
  const navigate = useNavigate();
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);
  const [isLoading, setIsLoading] = useState(false);
  const [lengthPage, setLengthPage] = useState(
    JSON.parse(localStorage.getItem("linePerPage"))
      ? JSON.parse(localStorage.getItem("linePerPage")).value
      : 20
  );
  const [data, setData] = useState([]);
  const [dataFilter, setDataFilter] = useState([]);
  const [startPage, setStartPage] = useState(0);
  const [idGroup, setIdGroup] = useState("all");
  const [total, setTotal] = useState(0);
  const [modal, setModal] = useState(false);
  const [modalBlock, setModalBlock] = useState(false);
  const toggleBlock = () => setModalBlock(!modalBlock);
  const toggle = () => setModal(!modal);
  const [status, setStatus] = useState("");
  const [valueSearch, setValueSearch] = useState("");
  const [item, setItem] = useState({});
  const [dataTab, setDataTab] = useState([{ label: "Tất cả", value: "all" }]);
  const [detectLoading, setDetectLoading] = useState(null);
  const [saveToCookie, readCookie] = useCookies();

  const getListCustomerByType = () => {
    fetchCustomers(lang, startPage, lengthPage, status, idGroup, valueSearch)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItems);
      })
      .catch((err) => {});
  };
  useEffect(() => {
    getGroupCustomerApi(0, 20)
      .then((res) => {
        const temp = [];
        res?.data.map((item) => {
          temp.push({
            value: item?._id,
            label: item?.name,
          });
        });
        setDataTab(dataTab.concat(temp));
      })
      .catch((err) => {});
  }, [lengthPage]);
  useEffect(() => {
    getListCustomerByType();
  }, [valueSearch, startPage, idGroup, lengthPage]);
  useEffect(() => {
  
    const updatedData = data.map(item => {
      const newItem = { ...item }; // Tạo một bản sao của item gốc để không thay đổi mảng gốc
      if (item.id_group_customer && item.id_group_customer.length > 0) {
        // Tìm các label từ dataTab
        const labels = item.id_group_customer.map(id => {
          const found = dataTab.find(tabItem => tabItem.value === id);
          return found ? found.label : null; // Trả về label nếu tìm thấy
        }).filter(label => label !== null); // Lọc bỏ những giá trị null nếu không tìm thấy label
        newItem.labels = labels; // Thêm labels vào newItem
      } else {
        newItem.labels = []; // Nếu không có id_group_customer, gán mảng rỗng
      }
      return newItem;
    });
    
    // console.log("check updatedData", updatedData)
    
    setDataFilter(updatedData);
  }, [data, dataTab]);
  const handleSearch = useCallback(
    _debounce((value) => {
      setValueSearch(value);
      setDetectLoading(value);
    }, 1000),
    []
  );
  const onChangePage = (value) => {
    setStartPage(value);
  };
  let items = [
    {
      key: "1",
      label: checkElement?.includes("active_customer") && (
        <p className="text-select-dropdown" onClick={toggleBlock}>
          {item?.is_active === true
            ? `${i18n.t("lock", { lng: lang })}`
            : `${i18n.t("unlock", { lng: lang })}`}
        </p>
      ),
    },
    {
      key: "2",
      label: checkElement?.includes("delete_customer") && (
        <p className="text-select-dropdown" onClick={toggle}>{`${i18n.t(
          "delete",
          { lng: lang }
        )}`}</p>
      ),
    },
  ];
  items = items.filter((x) => x.label !== false);
  const columns = [
    {
      title: "STT",
      dataIndex: "",
      key: "ordinal",
      width: 50,
      fontSize: "text-size-M",
    },
    {
      i18n_title: "code_customer",
      dataIndex: "id_view",
      key: "code_customer",
      fontSize: "text-size-L",
      width: 100,
    },
    {
      i18n_title: "date_create",
      dataIndex: "date_create",
      key: "date_create",
      fontSize: "text-size-L",
      width: 100,
    },
    {
      i18n_title: "customer",
      dataIndex: "customer",
      key: "customer_name_phone_rank",
      fontSize: "text-size-L",
      width: 140,
    },
    // {
    //   i18n_title: 'phone',
    //   dataIndex: 'phone_customer',
    //   key: "phone_action_hide",
    //   width: 120
    // },
    {
      i18n_title: "address",
      dataIndex: "default_address.address",
      key: "address",
      fontSize: "text-size-L",
      width: 200,
    },

    {
      i18n_title: "total_order",
      dataIndex: "total_order",
      key: "total_order",
      fontSize: "text-size-L",
      width: 100,
    },
    {
      i18n_title: "nearest_order",
      dataIndex: "nearest_order",
      key: "nearest_order",
      fontSize: "text-size-L",
      width: 110,
    },
    {
      i18n_title: "total",
      dataIndex: "total_price",
      key: "money",
      fontSize: "text-size-L",
      width: 100,
    },
  ];
  const addActionColumn = {
    i18n_title: "",
    dataIndex: "action",
    key: "action",
    fixed: "right",
    width: 40,
    render: () => (
      <Space size="middle">
        <Dropdown menu={{ items }} trigger={["click"]}>
          <a>
            <UilEllipsisV />
          </a>
        </Dropdown>
      </Space>
    ),
  };
  const onChangeTab = (item) => {
    setIdGroup(item.value);
    setStartPage(0);
    setDetectLoading(item);
    saveToCookie("tab-order", item?.key);
    saveToCookie("status-order", item?.value);
    saveToCookie("order_scrolly", 0);
    saveToCookie("start_order", 0);
    saveToCookie("page_order", 1);
  };
  const onDelete = useCallback(
    (id) => {
      setIsLoading(true);
      deleteCustomer(id, { is_delete: true })
        .then((res) => {
          fetchCustomers(lang, startPage, lengthPage, status, idGroup, "")
            .then((res) => {
              setData(res?.data);
              setTotal(res?.totalItems);
            })
            .catch((err) => {});
          setModal(false);
          setIsLoading(false);
        })
        .catch((err) => {
          errorNotify({
            message: err?.message,
          });
          setIsLoading(false);
        });
    },
    [status, startPage, idGroup, lang, lengthPage]
  );
  const blockCustomer = useCallback(
    (id, active) => {
      setIsLoading(true);
      activeCustomer(id, { is_active: active ? false : true })
        .then((res) => {
          setModalBlock(false);
          fetchCustomers(lang, startPage, lengthPage, status, idGroup, "")
            .then((res) => {
              setData(res?.data);
              setTotal(res?.totalItems);
            })
            .catch((err) => {});
          setIsLoading(false);
        })
        .catch((err) => {
          errorNotify({
            message: err?.message,
          });
          setIsLoading(false);
        });
    },
    [startPage, status, idGroup, lang, lengthPage]
  );
  
  return (
    <>
      <div className="div-container-content">
        <div className="div-flex-row">
          <div className="div-header-container">
            <h4 className="title-cv">{`${i18n.t("list_customer", {
              lng: lang,
            })}`}</h4>
          </div>
          <div className="btn-action-header">
            {checkElement?.includes("create_customer") && (
              <AddCustomer
                returnValueIsLoading={setDetectLoading}
                setData={setData}
                setTotal={setTotal}
                startPage={startPage}
                status={""}
                idGroup={idGroup}
              />
            )}
          </div>
          {/*Button tạo đơn*/}
          <Button
            className="bg-[#8b5cf6] text-white hover:text-black ml-2"
            icon={<PlusCircleOutlined />}
            onClick={() => navigate("/group-order/manage-order/create-order")}
          >
            {/* <i class="uil uil-plus-circle"></i> */}
            {`${i18n.t("create_order", { lng: lang })}`}
          </Button>
        </div>
        <div className="div-flex-row">
          <Tabs itemTab={dataTab} onValueChangeTab={onChangeTab} />
        </div>
        <div className="div-flex-row">
          <div></div>
          <div className="div-search">
            <Input
              placeholder={`${i18n.t("search_customer", { lng: lang })}`}
              prefix={<SearchOutlined />}
              className="input-search"
              onChange={(e) => {
                handleSearch(e.target.value);
              }}
            />
          </div>
        </div>
        <div>
          <DataTable
            columns={columns}
            data={dataFilter}
            actionColumn={addActionColumn}
            start={startPage}
            pageSize={lengthPage}
            setLengthPage={setLengthPage}
            totalItem={total}
            detectLoading={detectLoading}
            getItemRow={setItem}
            onCurrentPageChange={onChangePage}
          />
        </div>
        <div>
          <ModalCustom
            isOpen={modal}
            title={`${i18n.t("customer_delete", { lng: lang })}`}
            handleOk={() => onDelete(item?._id)}
            textOk={`${i18n.t("delete", { lng: lang })}`}
            handleCancel={toggle}
            body={
              <>
                <p>{`${i18n.t("sure_delete_customer", { lng: lang })}`}</p>
                <p className="text-name-modal">{item?.full_name}</p>
              </>
            }
          />
        </div>
        <div>
          <ModalCustom
            isOpen={modalBlock}
            title={
              item?.is_active === true
                ? `${i18n.t("lock_cutomer_account", { lng: lang })}`
                : `${i18n.t("unlock_cutomer_account", { lng: lang })}`
            }
            handleOk={() => blockCustomer(item?._id, item?.is_active)}
            textOk={
              item?.is_active === true
                ? `${i18n.t("lock", { lng: lang })}`
                : `${i18n.t("unlock", { lng: lang })}`
            }
            handleCancel={toggleBlock}
            body={
              <>
                {item?.is_active === true
                  ? `${i18n.t("want_lock_cutomer_account", { lng: lang })}`
                  : `${i18n.t("want_unlock_cutomer_account", { lng: lang })}`}
                <h6>{item?.full_name}</h6>
              </>
            }
          />
        </div>
        <FloatButton.BackTop />
      </div>
    </>
  );
};

export default ManageCustomer;
