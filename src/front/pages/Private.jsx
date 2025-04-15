import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Private = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    // Si no hay token, redirige a login
    if (!token) {
      navigate("/login");
      return;
    }

    // Si hay token, verifica con el servidor
    fetch("http://localhost:3001/api/private", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Token inválido o expirado");
        return res.json();
      })
      .then((data) => {
        setUserData(data.user); // viene del back: user.serialize()
      })
      .catch((err) => {
        console.error(err);
        sessionStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate]);

  if (!userData) return <p>Cargando zona privada...</p>;

  return (
    <div className="private-page">
      <h2>Bienvenido a la zona privada</h2>
      <p>Email: {userData.email}</p>
      <p>ID de usuario: {userData.id}</p>
    </div>
  );
};
