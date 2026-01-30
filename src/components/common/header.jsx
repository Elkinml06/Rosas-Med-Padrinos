import { useLocation } from "react-router-dom";
import Logo from "../../assets/Logo UNAB Rojo.png";

const Header = () => {
  const location = useLocation();

  const pasoActivo = (ruta) => {
    if (ruta === "/") return location.pathname === "/";
    return location.pathname.startsWith(ruta);
  };

  const itemClass = (activo) =>
    `font-semibold transition-all duration-300 ${
      activo
        ? "text-red-600"
        : "text-gray-400"
    }`;

  const pasoNumberClass = (activo) =>
    `rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
      activo
        ? "bg-red-600 text-white shadow-md"
        : "bg-gray-200 text-gray-500"
    }`;

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between">
        
{/* Logo UNAB */}
<div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto sm:mx-0 mb-2 sm:mb-0">
  <img
    src={Logo}
    alt="Logo UNAB"
    className="w-full h-full object-contain"
  />
</div>


          

        {/* Flujo visual mejorado - Responsive sin cambiar estructura */}
        <nav className="flex items-center justify-center gap-1 sm:gap-2 select-none">
          
          {/* Paso 1: Productos */}
          <div className="flex items-center gap-1 sm:gap-2">
            <div className={`${pasoNumberClass(pasoActivo("/"))} w-6 h-6 sm:w-8 sm:h-8 text-xs sm:text-sm`}>
              1
            </div>
            <div className="flex flex-col">
              <span className={`${itemClass(pasoActivo("/"))} text-sm sm:text-base`}>
                Productos
              </span>
              <span className="text-[10px] sm:text-xs text-gray-400 hidden sm:block">
                Selección
              </span>
            </div>
          </div>

          {/* Separador - Más corto en móvil */}
          <div className="flex items-center mx-0.5 sm:mx-2">
            <div className="w-4 sm:w-12 h-px bg-gradient-to-r from-gray-300 to-gray-300"></div>
            <svg className="w-3 h-3 sm:w-5 sm:h-5 text-gray-300 mx-0.5 sm:mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <div className="w-4 sm:w-12 h-px bg-gradient-to-r from-gray-300 to-gray-300"></div>
          </div>

          {/* Paso 2: Datos */}
          <div className="flex items-center gap-1 sm:gap-2">
            <div className={`${pasoNumberClass(pasoActivo("/datos"))} w-6 h-6 sm:w-8 sm:h-8 text-xs sm:text-sm`}>
              2
            </div>
            <div className="flex flex-col">
              <span className={`${itemClass(pasoActivo("/datos"))} text-sm sm:text-base`}>
                Datos
              </span>
              <span className="text-[10px] sm:text-xs text-gray-400 hidden sm:block">
                Información
              </span>
            </div>
          </div>

          {/* Separador - Más corto en móvil */}
          <div className="flex items-center mx-0.5 sm:mx-2">
            <div className="w-4 sm:w-12 h-px bg-gradient-to-r from-gray-300 to-gray-300"></div>
            <svg className="w-3 h-3 sm:w-5 sm:h-5 text-gray-300 mx-0.5 sm:mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <div className="w-4 sm:w-12 h-px bg-gradient-to-r from-gray-300 to-gray-300"></div>
          </div>

          {/* Paso 3: Pago */}
          <div className="flex items-center gap-1 sm:gap-2">
            <div className={`${pasoNumberClass(pasoActivo("/pago"))} w-6 h-6 sm:w-8 sm:h-8 text-xs sm:text-sm`}>
              3
            </div>
            <div className="flex flex-col">
              <span className={`${itemClass(pasoActivo("/pago"))} text-sm sm:text-base`}>
                Pago
              </span>
              <span className="text-[10px] sm:text-xs text-gray-400 hidden sm:block">
                Confirmación
              </span>
            </div>
          </div>

        </nav>
      </div>

      {/* Barra de progreso sutil */}
      <div className="h-1 bg-gray-100">
        <div 
          className="h-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-500"
          style={{
            width: pasoActivo("/") ? '33%' : pasoActivo("/datos") ? '66%' : '100%'
          }}
        ></div>
      </div>
    </header>
  );
};

export default Header;