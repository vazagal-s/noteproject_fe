// src/components/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../resources/style.css";
import "../resources/home.css"; // Importa o CSS específico para a página inicial

const Home = () => {
  return (
    <div id="home">
  <div className="home-content">
    <h1 className="home-title">BEM-VINDO AO NOTES4WEB</h1>
    <p className="home-message">
      Selecione uma opção para continuar:
    </p>
    <div className="home-buttons">
      <Link to="/login">
        <button className="home-button">LOGIN</button>
      </Link>
      <Link to="/register">
        <button className="home-button">REGISTRAR</button>
      </Link>
    </div>
  </div>
</div>
  );
};

export default Home;