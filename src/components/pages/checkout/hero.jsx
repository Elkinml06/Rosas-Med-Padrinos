import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const nequiNumber = "3001234567";

export default function PagoNequi() {
  const navigate = useNavigate();

  const [copiado, setCopiado] = useState(false);
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [total, setTotal] = useState(0);
  const [pedidoEnviado, setPedidoEnviado] = useState(false);

  // 🔹 Calcular total desde localStorage
  useEffect(() => {
    const productos = JSON.parse(
      localStorage.getItem("productosSeleccionados")
    ) || [];

    const totalCalculado = productos.reduce(
      (acc, p) => acc + p.precio * p.cantidad,
      0
    );

    setTotal(totalCalculado);
  }, []);

  const copiarNumero = async () => {
    await navigator.clipboard.writeText(nequiNumber);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const handleFile = (archivo) => {
    if (!archivo) return;
    setFile(archivo);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files[0]);
  };

const enviarPedido = () => {
  if (!file) return;

  const productos =
    JSON.parse(localStorage.getItem("productosSeleccionados")) || [];

  const datosCliente =
    JSON.parse(localStorage.getItem("datosPedido"));

  if (!datosCliente) {
    alert("Faltan los datos del cliente");
    return;
  }

  const total = productos.reduce(
    (acc, p) => acc + p.precio * p.cantidad,
    0
  );

  const pedidoFinal = {
    id: `PED-${Date.now()}`,
    fecha: new Date().toISOString(),
    estado: "pendiente",
    cliente: datosCliente,
    productos,
    total,
    pago: {
      metodo: "Nequi",
      comprobante: {
        nombre: file.name,
        tipo: file.type,
        tamaño: file.size,
      },
    },
  };

  const pedidosPrevios =
    JSON.parse(localStorage.getItem("pedidos")) || [];

  pedidosPrevios.push(pedidoFinal);

  localStorage.setItem(
    "pedidos",
    JSON.stringify(pedidosPrevios)
  );

  // ✅ AQUÍ ESTÁ LA CLAVE
  setPedidoEnviado(true);
};



  // 🎉 CONFIRMACIÓN
  if (pedidoEnviado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="bg-white p-8 rounded-2xl shadow text-center max-w-md">
          <h2 className="text-2xl font-bold text-pink-500 mb-3">
            ¡Pedido realizado con éxito! 🌸
          </h2>

          <p className="text-gray-600 mb-6">
            Tu pedido ha sido recibido correctamente.
            Nos pondremos en contacto contigo muy pronto.
          </p>

          <button
            onClick={() => navigate("/")}
            className="bg-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-pink-600"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-pink-50 border border-pink-200 rounded-2xl p-6 text-center max-w-md mx-auto">

      <h2 className="text-xl font-semibold mb-2">
        Realiza tu pago
      </h2>

      <p className="text-gray-600 mb-4">
        Transfiere el monto total al siguiente número de <strong>Nequi</strong>.
      </p>

      {/* TOTAL */}
      <p className="text-lg font-bold text-pink-500 mb-4">
        Total a pagar: ${total.toLocaleString()}
      </p>

      <div className="flex items-center justify-center gap-3 mb-2">
        <span className="text-3xl font-bold text-pink-500">
          300 123 4567
        </span>

        <button
          onClick={copiarNumero}
          className="bg-pink-500 text-white px-3 py-2 rounded-lg"
        >
          📋
        </button>
      </div>

      {copiado && (
        <p className="text-green-600 text-sm mb-3">
          Número copiado ✔️
        </p>
      )}

      {/* COMPROBANTE */}
      <h3 className="font-semibold mb-3 text-left">
        Comprobante de pago
      </h3>

      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-10 cursor-pointer
          ${
            dragActive
              ? "border-pink-500 bg-pink-100"
              : "border-pink-300 bg-pink-50"
          }
        `}
      >
        <input
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />

        <p className="font-medium">
          Arrastra o selecciona tu comprobante
        </p>
      </label>

      {file && (
        <div className="mt-4 p-3 bg-white rounded-xl border flex justify-between">
          <span className="text-sm truncate">
            📎 {file.name}
          </span>
          <button
            onClick={() => setFile(null)}
            className="text-red-500 text-sm"
          >
            Quitar
          </button>
        </div>
      )}

      {/* BOTONES */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={() => navigate("/datos")}
          className="flex-1 border rounded-xl py-3"
        >
          Volver
        </button>

        <button
          onClick={enviarPedido}
          disabled={!file}
          className={`flex-1 rounded-xl py-3 font-semibold text-white
            ${
              file
                ? "bg-pink-500 hover:bg-pink-600"
                : "bg-pink-300 cursor-not-allowed"
            }
          `}
        >
          Enviar pedido →
        </button>
      </div>
    </div>
  );
}
