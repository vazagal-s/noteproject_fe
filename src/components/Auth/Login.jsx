import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react"; 
import api from "../../services/api";
import "../../resources/style.css";
import "../../resources/auth.css";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", 
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      
      console.log("Dados enviados:", { email, password }); // Para debug
      console.log("Resposta do login:", response.data);
      
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError("Credenciais inválidas ou servidor offline");
      console.error("Erro no login:", err.response?.data || err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="auth-form-container">
        <h2 className="auth-form-title">ACESSO DO USUÁRIO</h2>
        {error && <div className="form-error">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="email" className="form-label">Identificação:</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-input"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password" className="form-label">Senha Secreta:</label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" className="form-submit">
          CONFIRMAR
        </button>
        
        <p className="form-alt-link">
          Novo usuário? <Link to="/register">REGISTRE-SE AQUI</Link>
        </p>
      </div>
    </form>
  );
};

export default Login;