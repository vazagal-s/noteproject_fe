import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import React from 'react';
import api from '../../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    birth_date: ''
  });
  const [error, setError] = useState('');
  const [localBirthDate, setLocalBirthDate] = useState('');
  const navigate = useNavigate();

  // Converte dd/mm/aaaa para aaaa-mm-dd (formato ISO)
  const formatDateToISO = (dateString) => {
    if (!dateString) return '';
    
    const [day, month, year] = dateString.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'birth_date') {
      // Formatação automática enquanto digita
      let formattedValue = value.replace(/\D/g, '');
      
      if (formattedValue.length > 2) {
        formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2)}`;
      }
      if (formattedValue.length > 5) {
        formattedValue = `${formattedValue.slice(0, 5)}/${formattedValue.slice(5, 9)}`;
      }
      
      setLocalBirthDate(formattedValue);
      setFormData({
        ...formData,
        birth_date: formatDateToISO(formattedValue)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Valida o formato brasileiro
  const validateBirthDate = (date) => {
    const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    return regex.test(date);
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/register', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 201) {
        navigate('/login');
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data);
      } else {
        setError('Erro ao conectar com o servidor');
      }
    }
  };

  return (
    <div className="auth-form-container">
      <h2 className="auth-form-title">CRIAR CONTA</h2>
      {error && <div className="form-error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username" className="form-label">Usuário:</label>
          <input
            type="text"
            id="username"
            name="username"
            className="form-input"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-input"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">Senha:</label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-input"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone" className="form-label">Telefone:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="form-input"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="birth_date" className="form-label">Data de Nascimento:</label>
          <input
            type="text"
            id="birth_date"
            name="birth_date"
            className="form-input"
            placeholder="dd/mm/aaaa"
            value={localBirthDate}
            onChange={handleChange}
            maxLength={10}
          />
        </div>

        <button type="submit" className="form-submit">
          REGISTRAR
        </button>
      </form>

      <p className="form-alt-link">
        Já tem conta? <Link to="/login">Faça login</Link>
      </p>
    </div>
  );
};

export default Register;