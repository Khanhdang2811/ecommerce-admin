import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { subHours } from "date-fns";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  const filterOrdersByDate = (dateFilter) => {
    const currentDate = new Date();
    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      if (dateFilter === 'today') {
        return orderDate > subHours(currentDate, 24);
      } else if (dateFilter === 'thisWeek') {
        return orderDate > subHours(currentDate, 24 * 7);
      } else if (dateFilter === 'thisMonth') {
        return orderDate > subHours(currentDate, 24 * 30);
      }
      return true; // No date filter, return all orders
    });
    return filteredOrders;
  };

  const filteredOrders = filterOrdersByDate(filterDate);

  let stt = 1;

  const handleFilterClick = () => {
    setShowFilter(!showFilter);
  };
  useEffect(() => {
    setIsLoading(true);
    axios.get('/api/orders').then(response => {
      setOrders(response.data);
      setIsLoading(false);
    });
  }, []);
  return (
    <Layout>
      <h1>Đơn hàng</h1>
      <button
        className="btn-primary mb-1 mr-1"
        onClick={handleFilterClick}>
        Lọc
      </button>
      {showFilter && (
        <form className="inline-flex ml-1 mr-1">
          <select
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          >
            <option value="">Tất cả</option>
            <option value="today">Hôm nay</option>
            <option value="thisWeek">Tuần này</option>
            <option value="thisMonth">Tháng này</option>
          </select>
        </form>
      )}
      <table className="basic">
        <thead>
          <tr>
            <th>STT</th>
            <th>Ngày</th>
            <th>Trạng thái</th>
            <th>Địa chỉ</th>
            <th>Sản phẩm đã mua</th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={4}>
                <div className="py-4">
                  <Spinner fullWidth={true} />
                </div>
              </td>
            </tr>
          )}
          {filteredOrders.length > 0 && filteredOrders.map(order => (
            <tr>
              <td>{stt++}</td>
              <td>{(new Date(order.createdAt)).toLocaleString()}
              </td>
              <td className={order.paid ? 'text-green-600' : 'text-red-600'}>
                {order.paid ? 'YES' : 'NO'}
              </td>
              <td>
                {order.name} {order.email}<br />
                {order.city} {order.postalCode} {order.country}<br />
                {order.streetAddress}
              </td>
              <td>
                {order.line_items.map(l => (
                  <>
                    {l.price_data?.product_data.name} x
                    {l.quantity}<br />
                  </>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}