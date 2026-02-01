import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RosaImg from "../../../assets/images/rosa.png";
import CartaImg from "../../../assets/images/carta.png";
import RosaCartaImg from "../../../assets/images/rosa+carta.png";

const productos = [
  {
    id: 1,
    nombre: "Rosa",
    descripcion: "Una hermosa rosa para expresar tu amor",
    precio: 5000,
    imagen: RosaImg,
  },
  {
    id: 2,
    nombre: "Carta",
    descripcion: "Una carta personalizada con tus palabras",
    precio: 5000,
    imagen: CartaImg,
  },
  {
    id: 3,
    nombre: "Rosa + Carta",
    descripcion: "El combo perfecto: rosa y carta",
    precio: 8000,
    imagen: RosaCartaImg,
  },
];

export default function SeleccionProductos() {
  const navigate = useNavigate();
  const [cantidades, setCantidades] = useState({});

  useEffect(() => {
    const guardados = JSON.parse(
      localStorage.getItem("productosSeleccionados")
    );

    if (guardados && Array.isArray(guardados)) {
      const cantidadesIniciales = {};
      guardados.forEach((p) => {
        cantidadesIniciales[p.id] = p.cantidad;
      });
      setCantidades(cantidadesIniciales);
    }
  }, []);

  const aumentar = (id) => {
    setCantidades((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const disminuir = (id) => {
    setCantidades((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) - 1, 0),
    }));
  };

  const hayProductosSeleccionados = Object.values(cantidades).some(
    (cantidad) => cantidad > 0
  );

  const continuar = () => {
    if (!hayProductosSeleccionados) return;

    const productosSeleccionados = productos
      .filter((p) => cantidades[p.id] > 0)
      .map((p) => ({
        id: p.id,
        nombre: p.nombre,
        precio: p.precio,
        imagen: p.imagen,
        cantidad: cantidades[p.id],
      }));

    localStorage.setItem(
      "productosSeleccionados",
      JSON.stringify(productosSeleccionados)
    );

    navigate("/datos");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
          San Valentín Especial
        </h1>
        <p className="text-gray-700 text-base sm:text-lg mb-2">
          Expresa tu amor con un detalle único
        </p>
        <div className="flex justify-center items-center gap-2">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gray-400 rounded-full"></div>
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-black rounded-full"></div>
        </div>
      </div>

      {/* Grid productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
        {productos.map((producto) => (
          <div
            key={producto.id}
            className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col"
          >
            <div className="p-5 sm:p-6 flex flex-col h-full">
              {/* Imagen */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-3 sm:p-4 mb-4 border border-gray-200">
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  className="h-32 sm:h-40 object-contain mx-auto transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Info */}
              <div className="flex-grow">
                <div className="flex items-start justify-between mb-3 gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {producto.nombre}
                  </h2>
                  <span className="bg-red-50 text-red-600 text-xs sm:text-sm font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                    ${producto.precio.toLocaleString()}
                  </span>
                </div>

                <p className="text-gray-600 text-sm sm:text-base mb-5 leading-relaxed">
                  {producto.descripcion}
                </p>

                {/* Cantidad */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 font-medium">
                    Cantidad
                  </span>

                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      onClick={() => disminuir(producto.id)}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 flex items-center justify-center"
                    >
                      <span className="text-lg sm:text-xl leading-none">−</span>
                    </button>

                    <span className="text-lg sm:text-xl font-bold text-gray-900 min-w-6 text-center">
                      {cantidades[producto.id] || 0}
                    </span>

                    <button
                      onClick={() => aumentar(producto.id)}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-red-500 text-white hover:bg-red-600 active:bg-red-700 flex items-center justify-center"
                    >
                      <span className="text-lg sm:text-xl leading-none">+</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Barra inferior */}
            <div className="h-1 bg-gradient-to-r from-red-500 via-gray-400 to-black opacity-60"></div>
          </div>
        ))}
      </div>

      {/* Continuar */}
      <div className="flex flex-col items-center mt-10 sm:mt-12">
        <button
          onClick={continuar}
          disabled={!hayProductosSeleccionados}
          className={`w-full sm:w-auto px-10 py-4 rounded-full text-lg font-bold transition-all duration-300
            ${hayProductosSeleccionados
              ? "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white shadow-lg hover:-translate-y-1"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
        >
          <span className="flex items-center justify-center gap-2">
            Continuar
            {hayProductosSeleccionados && (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            )}
          </span>
        </button>

        {!hayProductosSeleccionados && (
          <div className="mt-4 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-center">
            <p className="text-gray-600 text-sm">
              Debes seleccionar al menos un producto para continuar
            </p>
          </div>
        )}

        {hayProductosSeleccionados && (
          <div className="mt-5 text-sm bg-red-50 text-red-700 px-4 py-2 rounded-full">
            {Object.values(cantidades).reduce((a, b) => a + b, 0)} producto(s)
            seleccionado(s)
          </div>
        )}
      </div>

      <div className="hidden md:block fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-20"></div>
    </div>
  );
}
