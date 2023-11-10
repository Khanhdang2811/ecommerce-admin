import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditProductPage() {
    const [productInfo, SetProductInfo] = useState(null);
    const router = useRouter();
    const { id } = router.query;
    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/api/products?id=' + id).then(response => {
            SetProductInfo(response.data)
        })
    })
    return (
        <Layout>
            <h1>Chỉnh sửa sản phẩm</h1>
            {productInfo && (
                <ProductForm {...productInfo} />
            )}
        </Layout>

    );
}