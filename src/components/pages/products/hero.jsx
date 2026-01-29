import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RosaImg from "../../../assets/rosa.avif";

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
    imagen: RosaImg,
  },
  {
    id: 3,
    nombre: "Rosa + Carta",
    descripcion: "El combo perfecto: rosa y carta",
    precio: 8000,
    imagen: RosaImg,
  },
];

export default function SeleccionProductos() {
  const navigate = useNavigate();

  // { 1: 2, 2: 1 }
  const [cantidades, setCantidades] = useState({});

  // 🔄 Restaurar cantidades desde localStorage
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
    <div className="min-h-screen bg-pink-50 p-8">
      <h1 className="text-3xl font-bold text-center mb-2">
        Envía amor con una rosa o carta
      </h1>

      <p className="text-center text-gray-600 mb-8">
        Selecciona los productos que deseas enviar
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {productos.map((producto) => (
          <div
            key={producto.id}
            className="bg-white rounded-2xl shadow p-6 flex flex-col"
          >
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="h-40 object-contain mb-4"
            />

            <h2 className="text-xl font-bold">{producto.nombre}</h2>

            <p className="text-gray-600 text-sm mb-4">
              {producto.descripcion}
            </p>

            <div className="mt-auto flex items-center justify-between">
              <span className="text-pink-500 text-2xl font-bold">
                ${producto.precio.toLocaleString()}
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => disminuir(producto.id)}
                  className="w-10 h-10 rounded-full border text-lg"
                >
                  −
                </button>

                <span className="text-lg font-semibold">
                  {cantidades[producto.id] || 0}
                </span>

                <button
                  onClick={() => aumentar(producto.id)}
                  className="w-10 h-10 rounded-full border text-lg"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center mt-10">
        <button
          onClick={continuar}
          disabled={!hayProductosSeleccionados}
          className={`px-10 py-3 rounded-full text-lg font-semibold transition
            ${
              hayProductosSeleccionados
                ? "bg-pink-500 hover:bg-pink-600 text-white"
                : "bg-pink-300 text-white cursor-not-allowed"
            }
          `}
        >
          Continuar
        </button>

        {!hayProductosSeleccionados && (
          <p className="text-sm text-gray-500 mt-3">
            Debes seleccionar al menos un producto para continuar
          </p>
        )}
      </div>
    </div>
  );
}
