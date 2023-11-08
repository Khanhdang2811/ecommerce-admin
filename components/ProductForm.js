import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import Spinner from "./Spinner";
import {ReactSortable} from "react-sortablejs";

export default function ProductForm({
    _id,
    title: existingTitle,
    description: existingDescription,
    price: existingPrice,
    images :existingImages,
}) {
    const [title, setTitle] = useState(existingTitle || "");
    const [description, setDescription] = useState(existingDescription || "");
    const [price, setPrice] = useState(existingPrice || "");
    const [images,setImages] = useState(existingImages || []);
    const [goToProducts, setGoToProducts] = useState(false);
    const router = useRouter();
    const [isUploading,setIsUploading] = useState(false);
    async function saveProduct(ev) {
        ev.preventDefault();
        const data = { title, description, price ,images};
        if (_id) {
            //update
            await axios.put(`/api/products/${_id}`, data);
        } else {
            //create
            await axios.post("/api/products", data);
        }
        setGoToProducts(true);
    }

    if (goToProducts) {
        router.push("/products");
    }

    function updateImagesOrder(images) {
        setImages(images);
      }
    async function uploadImages(ev) {
        const files = ev.target?.files;
        if (files?.length > 0) {
            setIsUploading(true);
            const data = new FormData();
            for (const file of files) {
                data.append("file", file);
            }
            const res = await axios.post('/api/upload',data)
            setImages(oldImages => {
                return [...oldImages, ...res.data.links];

            });
            setIsUploading(false);
        }
    }

    return (
        <form onSubmit={saveProduct}>
            <label>Tên sản phẩm</label>
            <input
                className="text-black"
                type="text"
                placeholder="Tên sản phẩm"
                value={title}
                onChange={(ev) => setTitle(ev.target.value)}
            ></input>
            <label>Hình ảnh</label>
            <div className="mb-2 flex flex-wrap gap-2">
                    <ReactSortable
                    list={images}
                    className="flex flex-wrap gap-1"
                    setList={updateImagesOrder}>
                    {!!images?.length && images.map(link => (
                    <div key={link} className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200">
                        <img src={link} alt="" className="rounded-lg"/>
                    </div>
                    ))}
                </ReactSortable>
                  {isUploading && (
                    <div className="h-24 flex items-center">
                    <Spinner></Spinner>
                    </div>
                )}
                <label className="w-24 h-24 cursor-pointer text-center flex  items-center justify-center p-2 text-sm gap-1 text-gray-500 rounded-lg bg-gray-200">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <div className="">Tải hình lên</div>
                    <input type="file" className="hidden" onChange={uploadImages}></input>
                </label>
            </div>

            <label>Mô tả</label>
            <textarea
                className="text-black"
                placeholder="Mô tả"
                value={description}
                onChange={(ev) => setDescription(ev.target.value)}
            ></textarea>

            <label>Giá (in VND)</label>
            <input
                className="text-black"
                type="number"
                placeholder="giá"
                value={price}
                onChange={(ev) => setPrice(ev.target.value)}
            ></input>

            <button className="btn-primary" type="submit">
                Lưu
            </button>
        </form>
    );
}
