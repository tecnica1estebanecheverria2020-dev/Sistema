import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div>
      <h2>404 Página No Encontrada</h2>
      <Link to="/">Volver al inicio</Link>
    </div>
  );
}