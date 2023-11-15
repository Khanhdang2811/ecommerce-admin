import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { withSwal } from "react-sweetalert2";

function SettingsPage({ swal }) {
  const [products, setProducts] = useState([]);
  const [featuredProductId, setFeaturedProductId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // const [shippingFee, setShippingFee] = useState('');

  useEffect(() => {
    setIsLoading(true);
    fetchAll().then(() => {
      setIsLoading(false);
    });
  }, []);

  async function fetchAll() {
    await axios.get('/api/products').then(res => {
      setProducts(res.data);
    });
    await axios.get('/api/settings?name=featuredProductId').then(res => {
      setFeaturedProductId(res.data.value);
    });
  }

  async function saveSettings() {
    setIsLoading(true);
    await axios.put('/api/settings', {
      name: 'featuredProductId',
      value: featuredProductId,
    });
    setIsLoading(false);
    await swal.fire({
      title: 'Settings saved!',
      icon: 'success',
    });
  }

  return (
    <Layout>
      <h1>Cài đặt</h1>
      {isLoading && (
        <Spinner />
      )}
      {!isLoading && (
        <>
          <label>Sản phẩm tiêu biểu</label>
          <select value={featuredProductId} onChange={ev => setFeaturedProductId(ev.target.value)}>
            {products.length > 0 && products.map(product => (
              <option value={product._id}>{product.title}</option>
            ))}
          </select>
          <div>
            <button onClick={saveSettings} className="btn-primary">Lưu cài đặt</button>
          </div>
        </>
      )}
    </Layout>
  );
}

export default withSwal(({ swal }) => (
  <SettingsPage swal={swal} />
));