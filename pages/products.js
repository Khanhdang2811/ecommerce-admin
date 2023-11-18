import Layout from "@/components/Layout";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const productNames = products.map(p => p.title);

  const filteredProducts = products.filter(p => {
    return filterName === '' || p.title === filterName;
  });
  let stt = 1;
  useEffect(() => {
    setIsLoading(true);
    axios.get('/api/products').then(response => {
      setProducts(response.data);
      setIsLoading(false);
    });
  }, []);
  return (
    <Layout>
      <button
        className="btn-primary mb-1 mr-1"
        onClick={() => setShowFilter(true)}>
        Lọc
      </button>
      {showFilter && (
        <form className="inline-flex ml-1 mr-1">
          <select
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
          >
            <option
              value="">Tất cả</option>
            {productNames.map(name => (
              <option
                key={name}
                value={name}
              >{name}</option>
            ))}
          </select>
        </form>
      )}
      <Link className="btn-primary" href={'/products/new'}>Thêm sản phẩm mới</Link>
      <table className="basic mt-2">
        <thead>
          <tr>
            <td>STT</td>
            <td>Tên sản phẩm</td>
            <td colSpan={2}></td>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={2}>
                <div className="py-4">
                  <Spinner fullWidth={true} />
                </div>
              </td>
            </tr>
          )}
          {filteredProducts.map(product => (
            <tr key={product._id}>
              <td>{stt++}</td>
              <td>{product.title}</td>
              <td>
                <Link className="btn-default" href={'/products/edit/' + product._id}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                  Sửa
                </Link>
                <Link className="btn-red" href={'/products/delete/' + product._id}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                  Xóa
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}