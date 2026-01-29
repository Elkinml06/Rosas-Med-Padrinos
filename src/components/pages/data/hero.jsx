import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RosaImg from "../../../assets/rosa.avif";

const PRODUCTOS_BASE = {
  1: { nombre: "Rosa", imagen: RosaImg },
  2: { nombre: "Carta", imagen: RosaImg },
  3: { nombre: "Rosa + Carta", imagen: RosaImg },
};

export default function DatosPedido() {
  const navigate = useNavigate();

  /* =======================
     🔹 PRODUCTOS
  ======================= */
  const productos =
    JSON.parse(localStorage.getItem("productosSeleccionados")) || [];

  const incluyeCarta = productos.some(
    (p) => p.nombre === "Carta" || p.nombre === "Rosa + Carta"
  );

  const total = productos.reduce(
    (acc, p) => acc + p.precio * p.cantidad,
    0
  );

  /* =======================
     🔹 FORMULARIO
  ======================= */
  const [anonimo, setAnonimo] = useState(true);
  const [nombreRemitente, setNombreRemitente] = useState("");
  const [nombreReceptor, setNombreReceptor] = useState("");
  const [contacto, setContacto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  /* =======================
     🔄 CARGAR DATOS GUARDADOS
  ======================= */
  useEffect(() => {
    const guardado = JSON.parse(localStorage.getItem("datosPedido"));

    if (guardado) {
      setAnonimo(guardado.anonimo);
      setNombreRemitente(guardado.nombreRemitente || "");
      setNombreReceptor(guardado.nombreReceptor || "");
      setContacto(guardado.contacto || "");
      setMensaje(guardado.mensaje || "");
    }
  }, []);

  /* =======================
     💾 GUARDADO AUTOMÁTICO
  ======================= */
  useEffect(() => {
    localStorage.setItem(
      "datosPedido",
      JSON.stringify({
        anonimo,
        nombreRemitente: anonimo ? "Anónimo" : nombreRemitente,
        nombreReceptor,
        contacto,
        mensaje,
      })
    );
  }, [anonimo, nombreRemitente, nombreReceptor, contacto, mensaje]);

  /* =======================
     ✅ VALIDAR Y CONTINUAR
  ======================= */
  const continuar = () => {
    if (!nombreReceptor.trim()) {
      return setError("Debes ingresar el nombre del receptor");
    }

    if (!/^\d{10}$/.test(contacto)) {
      return setError(
        "El número debe tener 10 dígitos (ej: 3107783345)"
      );
    }

    if (!anonimo && !nombreRemitente.trim()) {
      return setError("Debes ingresar tu nombre");
    }

    if (incluyeCarta && !mensaje.trim()) {
      return setError("Debes escribir el mensaje de la carta");
    }

    setError("");
    navigate("/pago");
  };

  /* =======================
     🖥️ UI
  ======================= */
  return (
    <div className="min-h-screen bg-pink-50 p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">

        {/* =======================
            RESUMEN
        ======================= */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold mb-4">
            Resumen del Pedido
          </h2>

          {productos.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between mb-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={PRODUCTOS_BASE[p.id].imagen}
                  alt={p.nombre}
                  className="w-16 h-16 object-contain rounded-lg"
                />

                <div>
                  <p className="font-semibold">
                    {p.nombre} x {p.cantidad}
                  </p>
                  <p className="text-sm text-gray-500">
                    ${p.precio.toLocaleString()}
                  </p>
                </div>
              </div>

              <span className="font-semibold">
                ${(p.precio * p.cantidad).toLocaleString()}
              </span>
            </div>
          ))}

          <hr className="my-4" />

          <div className="flex justify-between text-xl font-bold text-pink-500">
            <span>Total</span>
            <span>${total.toLocaleString()}</span>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => navigate("/")}
              className="w-full border border-pink-400 text-pink-500 py-3 rounded-full font-semibold"
            >
              Volver
            </button>

            <button
              onClick={continuar}
              className="w-full bg-pink-500 text-white py-3 rounded-full font-semibold hover:bg-pink-600"
            >
              Continuar
            </button>
          </div>

          {error && (
            <p className="text-red-500 mt-4 text-sm">
              {error}
            </p>
          )}
        </div>

        {/* =======================
            FORMULARIO
        ======================= */}
        <div className="bg-white rounded-2xl shadow p-6 space-y-5">
          <h2 className="text-2xl font-bold">
            ¿Deseas enviar de forma anónima?
          </h2>

          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={anonimo}
                onChange={() => setAnonimo(true)}
              />
              Sí
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={!anonimo}
                onChange={() => setAnonimo(false)}
              />
              No
            </label>
          </div>

          {!anonimo && (
            <input
              type="text"
              placeholder="Tu nombre"
              className="w-full p-3 rounded-xl bg-gray-100"
              value={nombreRemitente}
              onChange={(e) =>
                setNombreRemitente(e.target.value)
              }
            />
          )}

          <input
            type="text"
            placeholder="Nombre del receptor"
            className="w-full p-3 rounded-xl bg-gray-100"
            value={nombreReceptor}
            onChange={(e) =>
              setNombreReceptor(e.target.value)
            }
          />

          <div>
            <input
              type="text"
              placeholder="Ej: 310-778-3345"
              className="w-full p-3 rounded-xl bg-gray-100"
              value={contacto}
              onChange={(e) =>
                setContacto(e.target.value.replace(/\D/g, ""))
              }
            />
            <p className="text-xs text-gray-500 mt-1">
              Solo números, 10 dígitos
            </p>
          </div>

          {incluyeCarta && (
            <div>
              <textarea
                placeholder="Escribe tu carta de amor..."
                maxLength={500}
                className="w-full p-3 rounded-xl bg-gray-100 h-32"
                value={mensaje}
                onChange={(e) =>
                  setMensaje(e.target.value)
                }
              />
              <p className="text-xs text-gray-500 text-right">
                {mensaje.length} / 500
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
