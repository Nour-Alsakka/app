import "./App.css";
import { useEffect, useState } from "react";
import { Route, Routes, Link, useParams } from "react-router-dom";
import { useLocalStorageState } from "./useLocalStorageState";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "./rtk/slices/products-slice";
import { addToCart, clear, deleteFromCart } from "./rtk/slices/cart-slice";
import Loading from "./Loading";

export default function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchProducts());
    }, []);

    return (
        <div className="page">
            <NavBar />
            {/* <LandingPage /> */}
            <Routes>
                <Route path="/E-Commerce-App" element={<ProductsList />} />
                <Route path="cart" element={<Cart />} />
                <Route path="product/:productId" element={<ProductDetails />} />
            </Routes>
        </div>
    );
}

function NavBar() {
    const cartNum = useSelector((state) => state.cart).length;

    return (
        <nav className="navbar">
            <div className="container">
                <Link className="navbar-logo" to="/">
                    Commy
                </Link>

                <ul>
                    <li className="nav-item">
                        <Link to="/E-Commerce-App">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="cart">
                            Cart - {cartNum}
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

function Cart() {
    const cart = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    const totalPrice = cart.reduce((acc, product) => {
        acc += product.price * product.quantity;
        return acc;
    }, 0);

    function handleRemove(product) {
        if (
            window.confirm(
                `Are you sure you want to Remove ( ${product.title} ) ?`
            )
        )
            dispatch(deleteFromCart(product));
    }

    return (
        <div className="cart">
            <div className="container">
                {cart.length > 0 ? (
                    <>
                        <p className="total-price">
                            Total Price: {totalPrice.toFixed(2)}$
                        </p>
                        <button
                            className="clear-cart-btn"
                            onClick={() => dispatch(clear())}
                        >
                            Clear My Cart
                        </button>

                        <div className="cart-list">
                            <>
                                {cart.map((product) => (
                                    <div className="item">
                                        <span className="id">
                                            #{product.id}
                                        </span>
                                        <span className="img">
                                            <img
                                                src={product.image}
                                                alt={product.title}
                                            />
                                        </span>

                                        <span className="title">
                                            {product.title}
                                        </span>

                                        <span className="quantity">
                                            {product.quantity} item
                                            {product.quantity > 1 && "s"}
                                        </span>
                                        <span className="price">
                                            {product.price}$
                                        </span>

                                        <button
                                            className="delete-btn"
                                            onClick={() =>
                                                handleRemove(product)
                                            }
                                        >
                                            ❌ Remove
                                        </button>
                                    </div>
                                ))}
                            </>
                        </div>
                    </>
                ) : (
                    <p className="empty-cart">Your Cart is Empty</p>
                )}
            </div>
        </div>
    );
}
function ProductsList() {
    const products = useSelector((state) => state.products);

    const categoriesSet = new Set();
    products.map((product) => categoriesSet.add(product.category));
    const categories = Array.from(categoriesSet);

    const [error, setError] = useState("");

    const [category, setCategory] = useLocalStorageState("category");
    const [specificPrice, setSpecificPrice] =
        useLocalStorageState("specificPrice");

    const productsByFilter1 = category
        ? products.filter((product) => product.category === category)
        : products;

    const productsByFilter2 = specificPrice
        ? productsByFilter1.filter((product) =>
              specificPrice == 501
                  ? product.price >= specificPrice
                  : product.price <= specificPrice
          )
        : productsByFilter1;

    return (
        <div className="products-list">
            <h2>Products</h2>

            <div className="container">
                {error ? (
                    <p>{error}</p>
                ) : (
                    <>
                        <div className="filters">
                            <span>Category: </span>
                            <select
                                value={category}
                                className="filter"
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">All</option>
                                {categories.map((cate) => (
                                    <option key={cate} value={cate}>
                                        {cate}
                                    </option>
                                ))}
                            </select>
                            <span>your balance</span>
                            <select
                                value={specificPrice}
                                className="filter"
                                onChange={(e) => {
                                    setSpecificPrice(e.target.value);
                                    console.log(e.target.value);
                                }}
                            >
                                <option value="">All</option>
                                <option value={501}>Over 500$</option>
                                <option value={500}>Less than 500$</option>
                                <option value={100}>Less than 100$</option>
                                <option value={50}>Less than 50$</option>
                                <option value={20}>Less than 20$</option>
                            </select>

                            <button
                                className={`reset-btn ${
                                    category || specificPrice
                                        ? "show-reset"
                                        : ""
                                }`}
                                onClick={() => {
                                    setCategory("");
                                    setSpecificPrice("");
                                }}
                            >
                                Reset Filters
                            </button>
                        </div>

                        {products.length > 0 && (
                            <>
                                {productsByFilter2.length > 0 ? (
                                    <p>
                                        Found: {productsByFilter2.length}{" "}
                                        product
                                        {productsByFilter2.length > 1 && "s"}.
                                    </p>
                                ) : (
                                    <p>No Products Found.</p>
                                )}
                            </>
                        )}
                    </>
                )}

                {error ? (
                    <p>Error: {error}</p>
                ) : (
                    <>
                        {products.length > 0 ? (
                            <div className="products">
                                {productsByFilter2.map((product) => (
                                    <div key={product.id} className="product">
                                        <Product
                                            key={product.id}
                                            product={product}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <Loading />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
function Product({ product }) {
    const { id, image, title, category, price } = product;
    const dispatch = useDispatch();
    return (
        <div className="card">
            <div className="img">
                <img src={image} alt={title} />
            </div>
            <div className="card-body">
                <h4>{title}</h4>
                <span className="price">Price: {price}$</span>
                <span className="category">#{category}</span>
                <Link to={`/product/${id}`}>Details</Link>
                <button onClick={() => dispatch(addToCart(product))}>
                    Add to cart
                </button>
            </div>
        </div>
    );
}

function ProductDetails() {
    const dispatch = useDispatch();
    const params = useParams();
    const products = useSelector((state) => state.products);

    const thisProduct = products.filter(
        (product) => +product.id === +params.productId
    )[0];

    return (
        <div className="details">
            <div className="container">
                <div className="card">
                    <div className="img">
                        <img src={thisProduct.image} alt={thisProduct.image} />
                    </div>
                    <div className="card-info">
                        <h3 className="title">{thisProduct.title}</h3>
                        <p className="text">{thisProduct.description}</p>
                        <p className="category">
                            Category: <span>{thisProduct.category}</span>
                        </p>
                        <p className="rate">
                            Rating:{" "}
                            <span>
                                {thisProduct.rating?.rate}⭐
                                <span>
                                    (rated by {thisProduct.rating?.count}{" "}
                                </span>
                                people.)
                            </span>
                        </p>
                        <p className="price">
                            Price: <span>{thisProduct.price}$</span>
                        </p>
                        <button
                            className="add-to-cart"
                            onClick={() => dispatch(addToCart(thisProduct))}
                        >
                            Add to cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
