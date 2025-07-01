import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import '../../resources/admin_screen.css';
import React from 'react';

const AdminScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/admin/users');
        setUsers(response.data);
      } catch (err) {
        setError('Erro ao carregar usuários: ' + (err.response?.data?.message || err.message));
        console.error('Erro:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchCurrentUser = async () => {
      try {
        const response = await api.get('/auth/me');
        setCurrentUser(response.data);
      } catch (err) {
        console.error('Erro ao carregar usuário logado:', err.response?.data || err.message);
      }
    };

    fetchUsers();
    fetchCurrentUser();
  }, []);

  const handleToggleActive = async (userId, currentStatus) => {
    try {
      const endpoint = currentStatus 
        ? `/admin/users/deactivate/${userId}` 
        : `/admin/users/activate/${userId}`;
      const response = await api.patch(endpoint);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, active: !currentStatus } : user
      ));
      setError('');
      setSuccess(response.data.message);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      let errorMessage = err.response?.data?.message || err.message;
      if (err.response?.status === 403) {
        errorMessage = 'Acesso negado: verifique suas permissões de administrador';
      }
      setError(`Erro ao atualizar status do usuário: ${errorMessage}`);
      console.error('Erro:', err.response?.data || err.message);
    }
  };

  const handleToggleAdmin = async (userId, admin) => {
    try {
      const endpoint = admin 
        ? `/admin/roles/${userId}/remove` 
        : `/admin/roles/${userId}`;
      await api.patch(endpoint);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, admin: !admin } : user
      ));
      setError('');
    } catch (err) {
      let errorMessage = err.response?.data?.message || err.message;
      if (err.response?.status === 403) {
        errorMessage = 'Acesso negado: verifique suas permissões de administrador';
      }
      setError(`Erro ao atualizar cargo de admin: ${errorMessage}`);
      console.error('Erro:', err.response?.data || err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleLogoutDropdown = () => {
    setShowLogout(!showLogout);
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get initials for user icon (first letter of username or fallback to 'U')
  const userInitial = currentUser?.username ? currentUser.username.charAt(0).toUpperCase() : 'U';

  return (
    <>
      {/* Navbar */}
      <div className="notes-navbar">
        <div className="notes-nav-title">Admin - Gerenciamento de Usuários</div>
        <div className="notes-nav-controls">
          <input
            type="text"
            className="notes-search"
            placeholder="Buscar usuários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Link to="/notes" className="notes-new-button">
            Voltar para Notas
          </Link>
          <div className="user-icon-container">
            <div className="user-icon" onClick={toggleLogoutDropdown}>
              {userInitial}
            </div>
            {showLogout && (
              <div className="logout-dropdown">
                <button className="logout-button" onClick={handleLogout}>
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Container principal */}
      <div className="notes-container">
        {loading ? (
          <div className="notes-loading">Carregando...</div>
        ) : (
          <>
            {error && <div className="notes-error">{error}</div>}
            {success && <div className="notes-success">{success}</div>}
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuário</th>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th>Data de Nascimento</th>
                  <th>Criado em</th>
                  <th>Status</th>
                  <th>Admin</th>
                  <th>Ação</th>
                  <th>Ação Admin</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{new Date(user.birthDate).toLocaleDateString()}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className={user.active ? 'status-active' : 'status-inactive'}>
                      {user.active ? 'Ativo' : 'Inativo'}
                    </td>
                    <td className={user.admin ? 'status-admin' : 'status-non-admin'}>
                      {user.admin ? 'Sim' : 'Não'}
                    </td>
                    <td>
                      <button
                        className={`note-button ${user.active ? 'note-deactivate' : 'note-activate'}`}
                        onClick={() => handleToggleActive(user.id, user.active)}
                      >
                        {user.active ? 'Desativar' : 'Ativar'}
                      </button>
                    </td>
                    <td>
                      <button
                        className={`note-button ${user.admin ? 'note-remove-admin' : 'note-grant-admin'}`}
                        onClick={() => handleToggleAdmin(user.id, user.admin)}
                      >
                        {user.admin ? 'Remover Admin' : 'Tornar Admin'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </>
  );
};

export default AdminScreen;