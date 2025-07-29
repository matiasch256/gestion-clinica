import "./CategoriasDashboard.css";

export const CategoriasDashboard = () => {
  return (
    <>
      <h1 className="categorias-title">Dashboard de Categorías</h1>

      <div className="dashboard-grid">
        <div className="card">
          <h2>Categorías Activas</h2>
          <p>12 categorías en uso</p>
        </div>
        <div className="card">
          <h2>Sin Productos</h2>
          <p>3 categorías vacías</p>
        </div>
        <div className="card">
          <h2>Más Populares</h2>
          <p>Electrónica, Herramientas</p>
        </div>
        <div className="card">
          <h2>Categorías Nuevas</h2>
          <p>2 creadas esta semana</p>
        </div>
      </div>

      <div className="acciones-rapidas">
        <h2>Acciones Rápidas</h2>
        <div className="acciones-botones">
          <button>Agregar Categoría</button>
          <button>Editar Categoría</button>
          <button>Eliminar Categoría</button>
          <button>Ver Todas</button>
        </div>
      </div>
    </>
  );
};
