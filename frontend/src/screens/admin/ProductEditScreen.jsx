import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import {
  useUpdateProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../slices/productsApiSlice";
import FormContainer from "../../components/FormContainer";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { toast } from "react-toastify";

const ProductEditScreen = () => {
  const { id: productId } = useParams();

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");

  const { data: product, error, isLoading } = useGetProductByIdQuery(productId);

  const [updateProduct, { isLoading: isUpdateLoading }] =
    useUpdateProductMutation();

  const [uploadProductImage, { isLoading: isUploadLoading }] =
    useUploadProductImageMutation();

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  }, [product]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedProduct = {
        productId,
        name,
        price,
        image,
        brand,
        category,
        countInStock,
        description,
      };
      const result = await updateProduct(updatedProduct).unwrap();
      if (result.error) {
        toast.error("Failed to update product");
      } else {
        toast.success("Product updated successfully");
        navigate("/admin/productlist");
      }
    } catch (error) {
      toast.error(
        error?.data?.message || error?.error || "Failed to update product"
      );
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    try {
      const result = await uploadProductImage(formData).unwrap();
      if (result.error) {
        toast.error("Failed to upload image");
      } else {
        setImage(result.image);
        toast.success("Image uploaded successfully");
      }
    } catch (error) {
      toast.error(
        error?.data?.message || error?.error || "Failed to upload image"
      );
    }
  };

  return (
    <>
      <Link to="/admin/productlist" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Product</h1>
        {isUpdateLoading && <Loader />}
        {isUploadLoading && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error?.data?.message || error?.error}</Message>
        ) : (
          <Form>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="image">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image URL"
                value={image}
                onChange={(e) => setImage}
              />
              <Form.Control
                type="file"
                label="Choose file"
                onChange={handleUpload}
                disabled={isUploadLoading}
              />
            </Form.Group>
            {isUploadLoading && <Loader />}
            <Form.Group controlId="brand">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="countInStock">
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter count in stock"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <Button
              variant="primary"
              onClick={handleUpdate}
              className="my-2"
              disabled={isUpdateLoading}
            >
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;
