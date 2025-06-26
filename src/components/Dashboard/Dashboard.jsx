import React from "react";

const Dashboard = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/"; 
  };

  return (
    <div>
      <h1>Bem-vindo à tela principal!</h1>
      <button onClick={handleLogout}>Sair</button>
    </div>
  );
};

export default Dashboard;