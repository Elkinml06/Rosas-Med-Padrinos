import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* Logo */}
        <NavLink
          to="/"
          className="text-xl font-bold text-pink-600"
        >
          Flores UNAB 🌹
        </NavLink>

        {/* Flujo de pasos */}
        <nav className="hidden md:flex items-center gap-4">

          {/* Productos */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `transition font-medium ${
                isActive
                  ? "text-pink-600"
                  : "text-gray-400 hover:text-gray-600"
              }`
            }
          >
            Productos
          </NavLink>

          <span className="text-gray-400">→</span>

          {/* Datos */}
          <NavLink
            to="/datos"
            className={({ isActive }) =>
              `transition font-medium ${
                isActive
                  ? "text-pink-600"
                  : "text-gray-400 hover:text-gray-600"
              }`
            }
          >
            Datos
          </NavLink>

          <span className="text-gray-400">→</span>

          {/* Pago */}
          <NavLink
            to="/pago"
            className={({ isActive }) =>
              `transition font-medium ${
                isActive
                  ? "text-pink-600"
                  : "text-gray-400 hover:text-gray-600"
              }`
            }
          >
            Pago
          </NavLink>

        </nav>
      </div>
    </header>
  );
};

export default Header;
