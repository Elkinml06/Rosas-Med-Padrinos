import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import RosaImg from "../../../assets/rosa.png";
import CartaImg from "../../../assets/carta.png";
import RosaCartaImg from "../../../assets/rosa+carta.png";

const PRODUCTOS_BASE = {
  1: { nombre: "Rosa", imagen: RosaImg, tipo: "rosa" },
  2: { nombre: "Carta", imagen: CartaImg, tipo: "carta" },
  3: { nombre: "Rosa + Carta", imagen: RosaCartaImg, tipo: "combo" },
};

export default function DatosPedido() {
  const navigate = useNavigate();
  const primeraCarga = useRef(true);

  const productos =
    JSON.parse(localStorage.getItem("productosSeleccionados")) || [];

  let totalCartas = 0;
  productos.forEach((p) => {
    if (p.nombre === "Carta") totalCartas += p.cantidad;
    if (p.nombre === "Rosa + Carta") totalCartas += p.cantidad;
  });

  const total = productos.reduce(
    (acc, p) => acc + p.precio * p.cantidad,
    0
  );

  const [anonimo, setAnonimo] = useState(true);
  const [nombreRemitente, setNombreRemitente] = useState("");
  const [nombreReceptor, setNombreReceptor] = useState("");
  const [contacto, setContacto] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const guardado = JSON.parse(localStorage.getItem("datosPedido"));

    if (guardado) {
      setAnonimo(guardado.anonimo ?? true);
      setNombreRemitente(guardado.nombreRemitente || "");
      setNombreReceptor(guardado.nombreReceptor || "");
      setContacto(guardado.contacto || "");

      if (Array.isArray(guardado.mensajes)) {
        const nuevos = Array(totalCartas).fill("");
        guardado.mensajes.forEach((msg, i) => {
          if (i < totalCartas) nuevos[i] = msg;
        });
        setMensajes(nuevos);
      }
    } else {
      setMensajes(Array(totalCartas).fill(""));
    }
  }, []);

  useEffect(() => {
    setMensajes((prev) => {
      const nuevos = Array(totalCartas).fill("");
      prev.forEach((msg, i) => {
        if (i < totalCartas) nuevos[i] = msg;
      });
      return nuevos;
    });
  }, [totalCartas]);

  useEffect(() => {
    if (primeraCarga.current) {
      primeraCarga.current = false;
      return;
    }

    localStorage.setItem(
      "datosPedido",
      JSON.stringify({
        anonimo,
        nombreReceptor,
        contacto,
        mensajes,
        timestamp: Date.now(),
      })
    );
  }, [anonimo, nombreRemitente, nombreReceptor, contacto, mensajes]);

  const continuar = async () => {
    if (!nombreReceptor.trim())
      return setError("Debes ingresar el nombre del receptor");

    if (!/^\d{10}$/.test(contacto))
      return setError("El número debe tener 10 dígitos");

    if (!anonimo && !nombreRemitente.trim())
      return setError("Debes ingresar tu nombre");

    for (let i = 0; i < mensajes.length; i++) {
      if (!mensajes[i].trim())
        return setError(`Debes escribir el mensaje de la carta ${i + 1}`);
    }

    setError("");
    navigate("/pago");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
            Completa los Datos
          </h1>
          <p className="text-gray-700 text-base sm:text-lg">
            Información para el envío de tu regalo
          </p>
          <div className="flex justify-center gap-2 mt-2">
            <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
            <div className="w-2.5 h-2.5 bg-gray-400 rounded-full"></div>
            <div className="w-2.5 h-2.5 bg-black rounded-full"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* FORMULARIO */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-5 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold mb-2">
                Información del Envío
              </h2>
              <p className="text-gray-600 text-sm sm:text-base mb-6">
                Completa los datos para enviar tu regalo
              </p>

              <div className="space-y-6">
                <div className="space-y-2">
  {/* TITULO */}
  <p className="text-sm font-semibold text-gray-700">
    Tipo de envío
  </p>

  {/* DESCRIPCIÓN */}
  <p className="text-xs text-gray-500">
    Elige si quieres que tu nombre aparezca o enviar el regalo en anonimato.
  </p>

  {/* OPCIONES */}
  <div className="flex flex-col sm:flex-row gap-4 mt-2">
    {[
      { label: "Sí, anónimo", value: true },
      { label: "No, mostrar mi nombre", value: false },
    ].map((op) => (
      <label
        key={op.label}
        className="flex items-center gap-3 cursor-pointer"
      >
        <input
          type="radio"
          checked={anonimo === op.value}
          onChange={() => setAnonimo(op.value)}
        />
        <span>{op.label}</span>
      </label>
    ))}
  </div>
</div>


                {/* Nombre remitente (solo si no es anónimo) */}
{!anonimo && (
  <div className="space-y-1">
    <p className="text-sm font-semibold text-gray-700">
      Tu nombre
    </p>
    <input
      type="text"
      placeholder="Ej: Juan Pérez"
      className="w-full p-3 rounded-xl border"
      value={nombreRemitente}
      onChange={(e) => setNombreRemitente(e.target.value)}
    />
  </div>
)}

{/* Nombre receptor */}
<div className="space-y-1">
  <p className="text-sm font-semibold text-gray-700">
    Nombre del receptor
  </p>
  <input
    type="text"
    placeholder="Ej: María López"
    className="w-full p-3 rounded-xl border"
    value={nombreReceptor}
    onChange={(e) => setNombreReceptor(e.target.value)}
  />
</div>

{/* Contacto */}
<div className="space-y-1">
  <p className="text-sm font-semibold text-gray-700">
    Número de contacto
  </p>
  <input
    type="text"
    placeholder="Ej: 3001234567"
    className="w-full p-3 rounded-xl border"
    value={contacto}
    onChange={(e) =>
      setContacto(e.target.value.replace(/\D/g, ""))
    }
  />
</div>

{/* Mensajes de cartas */}
{mensajes.map((mensaje, i) => (
  <div key={i} className="space-y-1">
    <p className="text-sm font-semibold text-gray-700">
      Mensaje de la carta {i + 1}
    </p>
    <textarea
      placeholder="Escribe aquí tu mensaje..."
      className="w-full p-3 rounded-xl border h-36 resize-none"
      maxLength={500}
      value={mensaje}
      onChange={(e) => {
        const copy = [...mensajes];
        copy[i] = e.target.value;
        setMensajes(copy);
      }}
    />
  </div>
))}

              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-red-500 via-gray-400 to-black opacity-60" />
          </div>
          {/* RESUMEN */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-5 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold mb-6 pb-4 border-b">
                Resumen del Pedido
              </h2>

              <div className="space-y-4 sm:space-y-6">
                {productos.map((p) => (
                  <div key={p.id} className="flex justify-between gap-4">
                    <div className="flex gap-3">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 border rounded-lg p-2 bg-gray-50">
                        <img
                          src={PRODUCTOS_BASE[p.id].imagen}
                          alt={p.nombre}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-sm sm:text-base">
                          {p.nombre} x {p.cantidad}
                        </p>
                        <p className="text-xs text-gray-500">
                          ${p.precio.toLocaleString()} c/u
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-sm sm:text-base">
                      ${(p.precio * p.cantidad).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {totalCartas > 0 && (
                <div className="mt-6 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700">
                  Incluye {totalCartas} carta{totalCartas > 1 && "s"} con mensaje
                </div>
              )}

              <div className="h-px bg-gray-200 my-6"></div>

              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">Total</span>
                <span className="text-2xl font-bold text-red-600">
                  ${total.toLocaleString()}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button
                  onClick={() => navigate("/")}
                  className="w-full border-2 border-gray-300 py-3 rounded-full font-semibold"
                >
                  Volver
                </button>
                <button
                  onClick={continuar}
                  className="w-full bg-red-500 text-white py-3 rounded-full font-semibold shadow-lg"
                >
                  Continuar al Pago
                </button>
              </div>

              {error && (
                <div className="mt-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}
            </div>
            <div className="h-1 bg-gradient-to-r from-red-500 via-gray-400 to-black opacity-60" />
          </div>


        </div>

        <div className="hidden md:block fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-20"></div>
      </div>
    </div>
  );
}
