import { useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  const pasoActivo = (ruta) => {
    if (ruta === "/") return location.pathname === "/";
    return location.pathname.startsWith(ruta);
  };

  const itemClass = (activo) =>
    `font-medium transition ${
      activo
        ? "text-pink-600"
        : "text-gray-400"
    }`;

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* Logo (este sí puede navegar si quieres) */}
        <div className="text-xl font-bold text-pink-600">
          Flores UNAB 🌹
        </div>

        {/* Flujo visual */}
        <nav className="hidden md:flex items-center gap-4 select-none">

          <span className={itemClass(pasoActivo("/"))}>
            Productos
          </span>

          <span className="text-gray-400">→</span>

          <span className={itemClass(pasoActivo("/datos"))}>
            Datos
          </span>

          <span className="text-gray-400">→</span>

          <span className={itemClass(pasoActivo("/pago"))}>
            Pago
          </span>

        </nav>
      </div>
    </header>
  );
};

export default Header;
