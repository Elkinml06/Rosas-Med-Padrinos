import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <header className="w-full bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* Logo */}
        <NavLink
          to="/"
          className="text-xl font-bold text-pink-600"
        >
          Flores UNAB 🌹
        </NavLink>

        {/* Navegación */}
        <nav className="space-x-6 hidden md:block">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `transition ${
                isActive
                  ? "text-pink-600 font-semibold"
                  : "text-gray-600 hover:text-pink-600"
              }`
            }
          >
            Productos
          </NavLink>

          <NavLink
            to="/datos"
            className={({ isActive }) =>
              `transition ${
                isActive
                  ? "text-pink-600 font-semibold"
                  : "text-gray-600 hover:text-pink-600"
              }`
            }
          >
            Datos
          </NavLink>

          <NavLink
            to="/pago"
            className={({ isActive }) =>
              `transition ${
                isActive
                  ? "text-pink-600 font-semibold"
                  : "text-gray-600 hover:text-pink-600"
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
