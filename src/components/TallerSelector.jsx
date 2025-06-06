import React, { useState, useEffect } from 'react';
import './TallerSelector.css';
import Swal from 'sweetalert2';

const TallerSelector = ({ onSelect }) => {
  const [talleres, setTalleres] = useState([]);
  const [selectedTaller, setSelectedTaller] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTalleres = async () => {
      try {
        // Obtener el ID del usuario de la sesión
        const userId = localStorage.getItem('userId');
        if (!userId) {
          console.log('No hay usuario logueado');
          setLoading(false);
          setTalleres([]);
          return;
        }

        // Obtener los talleres del usuario
        const response = await fetch(`http://localhost:3000/api/talleres/usuario/${userId}`);
        if (!response.ok) {
          throw new Error('Error al obtener los talleres');
        }

        const data = await response.json();
        setTalleres(data);

        // Si no hay talleres, mostrar mensaje informativo
        if (data.length === 0) {
          Swal.fire({
            icon: 'info',
            title: 'Sin talleres registrados',
            text: 'No tienes talleres registrados en el sistema. Puedes continuar sin seleccionar un taller.',
            confirmButtonColor: '#24487f'
          });
        }
      } catch (error) {
        console.error('Error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los talleres',
          confirmButtonColor: '#24487f'
        });
        setTalleres([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTalleres();
  }, []);

  const handleChange = (event) => {
    const tallerId = event.target.value;
    setSelectedTaller(tallerId);
    
    // Encontrar el taller seleccionado
    const tallerSeleccionado = talleres.find(t => t.id_taller.toString() === tallerId);
    
    // Llamar al callback con la información del taller
    onSelect(tallerSeleccionado || null);
  };

  if (loading) {
    return <div className="taller-selector loading">Cargando talleres...</div>;
  }

  return (
    <div className="taller-selector">
      <label htmlFor="taller">Taller (opcional)</label>
      <select
        id="taller"
        value={selectedTaller}
        onChange={handleChange}
        className={talleres.length === 0 ? 'no-talleres' : ''}
      >
        <option value="">Seleccione un taller</option>
        {talleres.map(taller => (
          <option key={taller.id_taller} value={taller.id_taller}>
            {taller.nombre_taller} - {taller.direccion_taller}
          </option>
        ))}
      </select>
      {talleres.length === 0 && (
        <p className="no-talleres-mensaje">
          No tienes talleres registrados. Puedes continuar sin seleccionar un taller.
        </p>
      )}
    </div>
  );
};

export default TallerSelector; 