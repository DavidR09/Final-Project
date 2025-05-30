import { useBlocker } from 'react-router-dom';

const NavigationGuard = ({ isEditing }) => {
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isEditing && currentLocation.pathname !== nextLocation.pathname
  );

  if (blocker.state === 'blocked') {
    return (
      <div className="guard-modal">
        <p>¿Tienes cambios sin guardar. Seguro que quieres salir?</p>
        <button onClick={blocker.proceed}>Salir</button>
        <button onClick={blocker.reset}>Cancelar</button>
      </div>
    );
  }

  return null;
};

export default NavigationGuard;
