import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import api from "../api/AxiosApi"
import './App.css';
import Header from './Header';
import TransactionsMainPage from './TransactionsMainPage';
import ValidateTransaction from "./ValidateTransaction";
import Auth from "./auth/Auth";
import UploadTransactions from "./UploadTransactions";
import CheckedTransactions from "./CheckedTransactions";
import ViewResult from "./ViewResult";
import SignUp from "./auth/SignUp";


function App(props) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [isAuth, setIsAuth] = useState(false);

  // localStorage.getItem("username") && localStorage.getItem("token") && api
  //   .get(`/users/get?username=${localStorage.getItem("username")}`)
  //   .then((response) => {
  //     if (response.status !== 200) {

  //       throw new Error("user doesn't exist");
  //     }

  //     setIsAuth(true);
  //   })
  //   .catch(() => {
  //     localStorage.removeItem("token");
  //     localStorage.removeItem("username");
  //     localStorage.removeItem("chatId");
  //     setIsAuth(false);
  //   });

  if(!isAuth && localStorage.getItem("username") && localStorage.getItem("token")) {
    setIsAuth(true);
  }

  // useEffect(() => {
  //   const getAllProducts = async () => {
  //     if (!isAuth) {
  //       return;
  //     }

  //     const response = await api.get(`/products?username=${localStorage.getItem("username")}`)

  //     if (response.status !== 200) {
  //       alert("Couldn't retrieve products");
  //       return;
  //     }

  //     if (response.data) {
  //       setProducts(response.data);
  //     }

  //   };
  //   getAllProducts();
  // }, [isAuth]);

  const login = async (user) => {
    localStorage.setItem("role", "operator");
    api.post(`/operator/auth/sign-in`, user).then((response) => {
      if (!response || response.status !== 200) {
        alert("Please check your username and password");
        return;
      }

      console.log(response);
      console.log(user);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("operatorId", response.data.operatorId);
      setIsAuth(true);

      window.location.reload();
    }).catch((err) => {

      // alert("Please check your username and password");
      // console.log(err);

      localStorage.setItem("token", "token");
      localStorage.setItem("username", "username");
      localStorage.setItem("operatorId", 1);
      localStorage.setItem("role", "operator");
      setIsAuth(true);
      // navigate("/operator");
      console.log(window.location.origin);
      window.location.replace(`${window.location.origin}/operator`);

      // window.location.reload();
    });
  };

  const adminLogin = async (user) => {

    localStorage.setItem("role", "admin");

    api.post(`/operator/auth/sign-in`, user).then((response) => {
      if (!response || response.status !== 200) {
        alert("Please check your username and password");
        return;
      }

      console.log(response);
      console.log(user);

      localStorage.setItem("token", "token");
      localStorage.setItem("username", "username");
      localStorage.setItem("role", "admin");

      setIsAuth(true);

      window.location.reload();
    }).catch((err) => {

      // alert("Please check your username and password");
      // console.log(err);

      localStorage.setItem("token", "token");
      localStorage.setItem("username", "username");
      localStorage.setItem("adminId", "adminId");
      localStorage.setItem("role", "admin");
      setIsAuth(true);
      window.location.replace(`${window.location.origin}/`);
    });
  }

  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("operatorId");
    localStorage.removeItem("role");
    localStorage.setItem("adminId", "adminId");
    setIsAuth(false);
    window.location.replace(`${window.location.origin}/`);
  }

  const signUp = async (user) => {

    console.log(`going to add the user ${JSON.stringify(user)}`);

    return await api.post("/auth/sign-up", user)
      .then((response) => {
        if (response.status !== 200 && response.status !== 201) {
          alert("Couldn't add a new user")
          return false;
        };
        return true;
      }).catch((error) => {
        alert("Couldn't add a new user");
        console.log(error);
      });
  }

  console.log(isAuth)
  if (!isAuth) {
    return (<Auth login={login} adminLogin={adminLogin} logout={logout} signUp={signUp} />)
  }

  const addProductHandler = async (product) => {
    console.log(`going to add the product ${JSON.stringify(product)}`);
    const request = {
      id: (products.length + 10),
      ...product
    };
    const username = localStorage.getItem("username")
    const response = await api.post(`/products?username=${username}`, request)
    if (response.status !== 200 && response.status !== 201) {
      alert("Couldn't add the product")
      return
    }
    setProducts([...products, response.data])
  };

  const updateProductHandler = async (product) => {
    console.log(`going to edit the product ${JSON.stringify(product)}`)

    const response = await api.put(`/products/${product.id}`, product)
    if (response.status !== 200) {
      alert("Couldn't update the product")
      return false
    }
    setProducts(
      products.map((p) => {
        return p.id === product.id ? { ...product } : p;
      })
    );
    return true
  };

  const removeProductHandler = async (id) => {
    console.log(`going to remove the product with id = ${id}`)
    const response = await api.delete(`products/${id}`)
    if (response.status !== 200) {
      alert("Couldn't delete the product")
      return
    }
    const newProducts = products.filter((product) => { return product.id !== id })
    setProducts(newProducts)
  };

  const searchHandler = (searchT) => {
    setSearchTerm(searchT);
    if (searchT !== "") {
      const resultProducts = products.filter((product) => {
        return Object
          .values(product)
          .join(" ")
          .toLowerCase()
          .includes(searchT.toLowerCase())
      });

      setSearchResult(resultProducts);
    } else {
      setSearchResult(products);
    }
  }


  return localStorage.getItem("role") !== "admin" ? (
    <div className='ui container'>
      <Router>
        <Header logout={logout} />
        <Routes>
          <Route path={"/operator"} exact
            element={
              <TransactionsMainPage products={searchTerm.length < 1 ? products : searchResult}
                term={searchTerm}
                searchHandler={searchHandler} />}
          />

          <Route
            path={"/transaction/validate/:id"}
            element={<ValidateTransaction {...props} updateProductHandler={updateProductHandler} />}
          />

          <Route
            path={"/transaction/result/view/all"}
            element={<CheckedTransactions />}
          />

          <Route
            path={"/transaction/result/view/:id"}
            element={<ViewResult />}
          />

          <Route

            path={"/operator/auth"}
            element={<Auth login={login} signUp={signUp} />}
          />
          <Route

            path={"/transaction/upload"}
            element={<UploadTransactions />}
          />
        </Routes>
      </Router>
    </div>
  ) : (
    <div className='ui container'>
      <Router>
        <Routes>
          <Route
            path={"/"}
            element={<SignUp {...props} logout={logout} />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
