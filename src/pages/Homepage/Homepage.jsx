import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Carousel, Modal, Alert, Card, Button } from "react-bootstrap";
import background from "../../assets/background.png";
import cssModule from "./Homepage.form.module.css";

import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.min.css";
import "owl.carousel/dist/assets/owl.theme.default.min.css";


import rupiahFormat from "rupiah-format";
import NavbarDefault from "../../component/Navbars/Navbar";
import NavbarAdmin from "../../component/Navbars/NavbarAdmin";
import NavbarUser from "../../component/Navbars/NavbarUser";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { API } from "../../config/api";

function Homepage() {
  document.title = `WaysBook`;

  let navigate = useNavigate();

  const [state, dispatch] = useContext(UserContext);

  const [alerts, setAlerts] = useState(false);

  let navbarConfig = "";
  if (!state.user.role) {
    navbarConfig = <NavbarDefault />;
  }
  if (state.user.role == "customer") {
    navbarConfig = <NavbarUser cartTg={alerts} />;
  }
  if (state.user.role == "admin") {
    navbarConfig = <NavbarAdmin />;
  }

  const [promoBooks, setPromoBooks] = useState([]);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    API.get("/books")
      .then((res) => {
        return setBooks(res.data.data.books);
      })
      .catch((error) => {
        console.log(error);
      });

    API.get("/promo-books")
      .then((res) => {
        return setPromoBooks(res.data.data.promoBooks);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  /* Modal Login dan Register */

  const [loginShow, setLoginShow] = useState(false);
  const [registerShow, setRegisterShow] = useState(false);
  const [message, setMessage] = useState(null);

  const [regForm, setRegForm] = useState({
    //Register Form
    name: "",
    email: "",
    password: "",
  });

  const [logForm, setLogForm] = useState({
    //Login Form
    email: "",
    password: "",
  });

  const handleChangeRegister = (e) => {
    setRegForm({
      ...regForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeLogin = (e) => {
    setLogForm({
      ...logForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleCloseLogin = () => {
    setMessage(null);
    setLoginShow(false);
  };

  const handleOpenLogin = () => {
    setMessage(null);
    setLoginShow(true);
  };

  const handleCloseRegister = () => {
    setMessage(null);
    setRegisterShow(false);
  };

  const switchRegLog = () => {
    setMessage(null);
    setRegisterShow(false);
    setLoginShow(true);
  };

  const switchLogReg = () => {
    setMessage(null);
    setLoginShow(false);
    setRegisterShow(true);
  };

  const handleSubmitReg = async (e) => {
    try {
      e.preventDefault();

      // Configuration Content-type
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      // Data body
      const body = JSON.stringify(regForm);

      // Insert data user to database
      const response = await API.post("/register", body, config);

      const alert = (
        <Alert variant="success" className="py-1">
          Register Success
        </Alert>
      );
      setMessage(alert);
    } catch (error) {
      const alert = (
        <Alert variant="danger" className="py-1">
          Register Failed
        </Alert>
      );
      setMessage(alert);
    }
  };

  const handleSubmitLog = async (e) => {
    try {
      e.preventDefault();

      // Configuration Content-type
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      // Data body
      const body = JSON.stringify(logForm);

      // Insert data user to database
      const response = await API.post("/login", body, config);

      const alert = (
        <Alert variant="success" className="py-1">
          Login Success!
        </Alert>
      );
      setMessage(alert);

      let dataUser = response.data.data.user;

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: dataUser,
      });
      setLoginShow(false);
      navigate("/");
    } catch (error) {
      const alert = (
        <Alert variant="danger" className="py-1">
          Login Failed!
        </Alert>
      );
      setMessage(alert);
    }
  };

  /* Akhir Modal Login dan Register  */

  const setNavTitle = (par1) => {
    if (!state.user.role) {
      handleOpenLogin();
    } else if (state.user.role == "customer") {
      navigate(`/detail/${par1}`);
    } else if (state.user.role == "admin") {
      navigate(`/update-book/${par1}`);
    }
  };

  const setAddCart = (par1) => {
    if (!state.user.role) {
      handleOpenLogin();
    } else if (state.user.role == "customer") {
      // Configuration Content-type
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      // Insert data user to database
      API.post(
        "/cart",
        {
          idProduct: par1,
        },
        config
      );

      setAlerts(true);
    } else if (state.user.role == "admin") {
      navigate(`/update-book/${par1}`);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "100%",
        width: "100%",
      }}
    >
      {navbarConfig}

      <Container>
        <Row style={{ marginBottom: "40px" }}>
          <Col className={cssModule.titleCont}>
            <p>With us, you can shop online & help</p>
            <p>save your high street at the same time</p>
          </Col>
        </Row>
        {promoBooks.length >= 1 ? (
          <Row>
            <OwlCarousel
              className="owl-theme"
              items="3"
              autoplay
              nav
              dots
              loop
              margin={20}
              style={{ marginTop: "100px" }}
            >
              {promoBooks.map((item, index) => (
                <div className="item d-flex align-items-center" key={index}>
                  <img
                    className="cover-book-card"
                    alt=""
                    src={item.bookImg}
                    style={{
                      width: "200px",
                      height: "250px",
                      borderRadius: "0 10px 10px 0",
                    }}
                  />
                  <Card style={{ width: "236px", border: "none" }}>
                    <Card.Body>
                      <Card.Title
                        onClick={() => setNavTitle(item.id)}
                        style={{
                          fontFamily: "Playfair Display",
                          fontSize: "20px",
                          color: "#000",
                          fontWeight: "bold",
                        }}
                      >
                        {item.title}
                      </Card.Title>
                      <Card.Subtitle
                        className="mb-3 text-muted"
                        style={{ fontStyle: "italic", fontSize: "16px" }}
                      >
                        {item.author}
                      </Card.Subtitle>
                      <Card.Text
                        style={{ textAlign: "justify", fontSize: "14px" }}
                      >
                        {item.desc}
                      </Card.Text>
                      <Card.Text
                        style={{
                          color: "#44B200",
                          fontWeight: "500",
                          fontSize: "18px",
                        }}
                      >
                        {rupiahFormat.convert(item.price)}{" "}
                      </Card.Text>
                      <Button
                        onClick={() => setAddCart(item.id)}
                        type="submit"
                        className="btn btn-to-cart"
                        style={{
                          width: "100%",
                          borderRadius: "0",
                          backgroundColor: "#393939",
                          border: "none",
                        }}
                      >
                        Add to Cart
                      </Button>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </OwlCarousel>
          </Row>
        ) : (
          <Row>
            <h1
              style={{
                textAlign: "center",
                marginTop: "89px",
                marginBottom: "89px",
              }}
            >
              No Promo Books Available Right Now
            </h1>
          </Row>
        )}
      </Container>
      <Container
        fluid
        style={{
          marginTop: "50px",
          height: "100%",
          width: "100%",
          backgroundColor: "#E5E5E5",
          paddingBottom: "30px",
        }}
      >
        <Row
          style={{
            width: "70%",
            paddingLeft: "100px",
          }}
        >
          <Col
            style={{
              marginTop: "45px",
              fontFamily: "Times New Roman",
              fontSize: "28px",
            }}
          >
            <h2 style={{ fontWeight: "bold" }}>List Book</h2>
          </Col>
        </Row>
        <Row
          style={{
            paddingLeft: "60px",
            paddingRight: "60px",
          }}
        >
          {books.map((item, index) => (
            <Col
              onClick={() => setNavTitle(item.id)}
              md={3}
              key={index}
              className={cssModule.listBook}
              style={{ width: "200px", margin: "30px", cursor: "pointer" }}
            >
              <img src={item.bookImg} alt="" />
              <h3 onClick={() => setNavTitle(item.id)} style={{height: "50px"}}>{item.title}</h3>
              <h6 className="mb-2">By: {item.author}</h6>
              <h5>{rupiahFormat.convert(item.price)}</h5>
            </Col>
          ))}
        </Row>
      </Container>
      <Modal
        style={{
          top: "250px",
        }}
        show={alerts}
        onHide={() => setAlerts(false)}
      >
        <Modal.Body
          style={{
            textAlign: "center",
            color: "#469F74",
            fontSize: "24px",
          }}
        >
          The product is successfully added to the cart
        </Modal.Body>
      </Modal>

      <Modal //Login Modal
        className={cssModule.modalLogin}
        show={loginShow}
        onHide={handleCloseLogin}
      >
        <Modal.Body>
          <h1>Login</h1>
          <form
            style={{
              marginBottom: "30px",
            }}
            onSubmit={handleSubmitLog}
          >
            <div className={cssModule.formGroup}>
              <input
                type="text"
                onChange={handleChangeLogin}
                name="email"
                placeholder="Email"
              />
            </div>
            <div className={cssModule.formGroup}>
              <input
                type="password"
                onChange={handleChangeLogin}
                name="password"
                placeholder="Password"
              />
            </div>
            <div className={cssModule.formGroup}>
              <button type="submit">Login</button>
            </div>
          </form>

          {message && message}

          <p>
            Don't have an account ? Klik{" "}
            <span onClick={switchLogReg}>Here</span>
          </p>
        </Modal.Body>
      </Modal>

      <Modal //Register Modal
        className={cssModule.modalRegister}
        show={registerShow}
        onHide={handleCloseRegister}
      >
        <Modal.Body>
          <h1>Register</h1>
          <form
            style={{
              marginBottom: "30px",
            }}
            onSubmit={handleSubmitReg}
          >
            <div className={cssModule.formGroup}>
              <input
                type="text"
                onChange={handleChangeRegister}
                name="name"
                placeholder="Name"
              />
            </div>
            <div className={cssModule.formGroup}>
              <input
                type="text"
                onChange={handleChangeRegister}
                name="email"
                placeholder="Email"
              />
            </div>
            <div className={cssModule.formGroup}>
              <input
                type="password"
                onChange={handleChangeRegister}
                name="password"
                placeholder="Password Min. 8"
              />
            </div>
            <div className={cssModule.formGroup}>
              <button type="submit">Register</button>
            </div>
          </form>

          {message && message}

          <p>
            Already have an account ? Klik{" "}
            <span onClick={switchRegLog}>Here</span>
          </p>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Homepage;
