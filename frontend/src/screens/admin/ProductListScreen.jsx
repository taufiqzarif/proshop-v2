import { LinkContainer } from "react-router-bootstrap";
import { useParams } from "react-router-dom";
import { Table, Button, Row, Col } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
} from "../../slices/productsApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { toast } from "react-toastify";
import Paginate from "../../components/Paginate";

const ProductListScreen = () => {
  const { pageNumber } = useParams();
  const { data, error, isLoading, refetch } = useGetProductsQuery({pageNumber});

  const [createProduct, { isLoading: isCreateLoading }] =
    useCreateProductMutation();

  const [deleteProduct, { isLoading: isDeleteLoading }] =
    useDeleteProductMutation();

  const handleCreateProduct = async () => {
    if (window.confirm("Are you sure you want to create a new product?")) {
      try {
        await createProduct();
        refetch();
        toast.success("Product created successfully");
      } catch (error) {
        toast.error(
          error?.data?.message || error?.error || "Failed to create product"
        );
      }
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        refetch();
        toast.success("Product deleted successfully");
      } catch (error) {
        toast.error(
          error?.data?.message || error?.error || "Failed to delete product"
        );
      }
    }
  };

  const handleEdit = (id) => {
    // Edit products
  }; 

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-end">
          <Button className="my-3" onClick={handleCreateProduct}>
            <FaEdit /> Create Product
          </Button>
        </Col>
      </Row>
      {isCreateLoading && <Loader />}
      {isDeleteLoading && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error?.error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button
                        variant="light"
                        className="btn-sm"
                        onClick={() => handleEdit(product._id)}
                      >
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => handleDeleteProduct(product._id)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={data.pages} page={data.page} isAdmin={true} />
        </>
      )}
    </>
  );
};

export default ProductListScreen;
