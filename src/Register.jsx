import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');

  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.some(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );

    if (userExists) {
      setMessageType('error');
      setMessage('El correo ya está registrado.');
      return;
    }

    const newUser = { name, email, password, phone };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    setMessageType('success');
    setMessage('Registro exitoso. Ahora puedes iniciar sesión.');
    setName('');
    setEmail('');
    setPassword('');
    setPhone('');
  };

  const fields = [
    { label: 'Nombre', value: name, setter: setName, type: 'text' },
    { label: 'Correo Electrónico', value: email, setter: setEmail, type: 'email' },
    { label: 'Contraseña', value: password, setter: setPassword, type: 'password' },
    { label: 'Teléfono', value: phone, setter: setPhone, type: 'tel' },
  ];

  return (
    <div className="welcome-container">
      <div className="left-section">
        <img src="/public/fotinicio.jpg" alt="Imagen ilustrativa" />
      </div>
      <div className="right-section">
        <div
          className="logo-container"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        >
          <img src="/public/Logo.png" alt="Logo" />
        </div>
        <div className="register-box">
          <h2>Regístrate</h2>
          <form onSubmit={handleRegister}>
            {fields.map((field, index) => (
              <div className="user-box" key={index}>
                <input
                  type={field.type}
                  required
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                />
                <label>{field.label}</label>
              </div>
            ))}
            <button type="submit" className="register-button">Registrarse</button>
          </form>
          {message && (
            <p className="message" style={{
              color: messageType === 'error' ? 'red' : '#03e9f4',
            }}>
              {message}
            </p>
          )}
          <p className="redirect-text">
            ¿Ya tienes una cuenta? <a href="/login">Inicia Sesión</a>
          </p>
        </div>
      </div>

      <style jsx>{`
        .welcome-container {
          display: flex;
          height: 100vh;
          font-family: 'Segoe UI', sans-serif;
        }

        .left-section {
          flex: 1;
          background-color: #2a2829;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .left-section img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .right-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: white;
          padding: 20px;
        }

        .logo-container {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          overflow: hidden;
          margin-bottom: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .logo-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .register-box {
          width: 400px;
          padding: 40px;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          border-radius: 10px;
          box-shadow: 0 15px 25px rgba(0, 0, 0, 0.5);
          text-align: center;
        }

        .register-box h2 {
          margin-bottom: 30px;
        }

        .user-box {
          position: relative;
          margin-bottom: 30px;
        }

        .user-box input {
          width: 100%;
          padding: 10px 0;
          font-size: 16px;
          color: #fff;
          border: none;
          border-bottom: 1px solid #fff;
          background: transparent;
          outline: none;
        }

        .user-box label {
          position: absolute;
          top: 0;
          left: 0;
          padding: 10px 0;
          font-size: 16px;
          color: #fff;
          pointer-events: none;
          transition: 0.5s;
        }

        .user-box input:focus ~ label,
        .user-box input:valid ~ label {
          top: -20px;
          color: #03e9f4;
          font-size: 12px;
        }

        .register-button {
          width: 100%;
          padding: 12px;
          color: #03e9f4;
          background: none;
          border: 1px solid #03e9f4;
          font-size: 16px;
          cursor: pointer;
          border-radius: 5px;
          transition: 0.5s;
        }

        .register-button:hover {
          background-color: #03e9f4;
          color: #fff;
        }

        .message {
          margin-top: 20px;
          text-align: center;
          font-size: 14px;
        }

        .redirect-text {
          margin-top: 20px;
          text-align: center;
          font-size: 14px;
          color: #ccc;
        }

        .redirect-text a {
          color: #03e9f4;
          text-decoration: none;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}
