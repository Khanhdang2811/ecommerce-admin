
import { withSwal } from 'react-sweetalert2';
import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

function Categories(swal)
{
  const [editedCategory, setEditedCategory] = useState(null);
const [name,setName] = useState('');
const [parentCategory,setParentCategory] = useState('');
const [categories,setCategories] = useState([]);

useEffect(() => {
  fetchCategories();
}, [])
async function saveCategory(ev){
  ev.preventDefault();
  const data = {name,parentCategory}
  if(editedCategory)
  {
    data._id = editedCategory._id;
    await axios.put('/api/categories',
    data);
    setEditedCategory(null);
  }
  else
  {
    await axios.post('/api/categories',
    data);

  }
 setName('');
 fetchCategories();
}
function fetchCategories() {
  axios.get('/api/categories').then(result => {
    setCategories(result.data);
  });
}
function editCategory(category){
  setEditedCategory(category);
  setName(category.name);
  setParentCategory(category.parent?._id);
  // setProperties(
  //   category.properties.map(({name,values}) => ({
  //   name,
  //   values:values.join(',')
  // }))
  // );
}
function deleteCategory(category){
  swal.fire({
    title: 'Are you sure?',
    text: `Do you want to delete ${category.name}?`,
    showCancelButton: true,
    cancelButtonText: 'Cancel',
    confirmButtonText: 'Yes, Delete!',
    confirmButtonColor: '#d55',
    reverseButtons: true,
  }).then(async result => {
    if (result.isConfirmed) {
      const {_id} = category;
      await axios.delete('/api/categories?_id='+_id);
      fetchCategories();
    }
  });
}

  return(
    <Layout>
      <h1>Categories</h1>
      <label>{editedCategory
       ? `Edit category ${editedCategory.name}` 
       : `Create new category`}
      </label>
      <form onSubmit={saveCategory} className="flex gap-1">
        <input className="mb-0"
        type="text"
         placeholder={'Category name'}
         value={name}
         onChange={ev => setName(ev.target.value)}
         ></input>
         <select
         className="mb-0 text-black "
         onChange={ev => setParentCategory(ev.target.value)}
         value={parentCategory}
         >
          <option value="">
            No parent category
          </option>
          {categories.length > 0 && categories.map(category => (
           <option value={category._id}>{category.name}</option>
          ))}
         </select>
        <button type="submit"className="btn-primary py-1">save</button>
      </form>
      <table className="basic mt-4">
        <thead>
          <tr>
            <td>Category name</td>
            <td>Parent category</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 && categories.map(category => (
            <tr>
               <td>{category.name}</td>
               <td>{category?.parent?.name}</td>
               <td>
                
                <button
                onClick={() => editCategory(
                  category
                )}
                 className="btn-primary mr-1">edit</button>
                <button 
                onClick={() => deleteCategory(category)}
                className="btn-primary">delete</button>     
                </td>
               
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}



export default withSwal (({swal},ref) =>(
 <Categories swal={swal}/>
));