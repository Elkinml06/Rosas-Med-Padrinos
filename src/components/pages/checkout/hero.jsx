import { useState } from "react";

const nequiNumber = "3001234567";

export default function PagoNequi() {
  const [copiado, setCopiado] = useState(false);
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

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
    console.log("Pedido enviado con comprobante:", file);
    // aquí luego conectas backend
  };

  return (
    <div className="bg-pink-50 border border-pink-200 rounded-2xl p-6 text-center max-w-md mx-auto">

      <h2 className="text-xl font-semibold mb-2">Realiza tu pago</h2>

<p className="text-gray-600 mb-4">
  Puedes pagar desde cualquier banco o billetera digital.
  Solo transfiere el monto a este número de <strong>Nequi</strong>.
</p>

      <div className="flex items-center justify-center gap-3 mb-2">
        <span className="text-3xl font-bold text-pink-500 tracking-wide">
          300 123 4567
        </span>

        <button
          onClick={copiarNumero}
          className="bg-pink-500 text-white px-3 py-2 rounded-lg hover:bg-pink-600 transition"
        >
          📋
        </button>
      </div>

      {copiado && (
        <p className="text-green-600 text-sm mb-3">
          Número copiado ✔️
        </p>
      )}

      <p className="font-semibold mb-6">Total a pagar: $5.000</p>

      {/* COMPROBANTE */}
      <h3 className="font-semibold mb-3 text-left">Comprobante de pago</h3>

      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition
          ${dragActive ? "border-pink-500 bg-pink-100" : "border-pink-300 bg-pink-50"}
        `}
      >
        <input
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />

        <div className="text-gray-600">
          <div className="text-4xl mb-3">⬆️</div>
          <p className="font-medium">Arrastra tu comprobante aquí</p>
          <p className="text-sm text-gray-500">
            o haz clic para seleccionar
          </p>
        </div>
      </label>

      {file && (
        <div className="mt-4 p-4 bg-white rounded-xl border flex items-center justify-between">
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
        <button className="flex-1 border rounded-xl py-3">
          Volver
        </button>

        <button
          onClick={enviarPedido}
          disabled={!file}
          className={`flex-1 rounded-xl py-3 font-semibold text-white transition
            ${file
              ? "bg-pink-500 hover:bg-pink-600"
              : "bg-pink-300 cursor-not-allowed"}
          `}
        >
          Enviar pedido →
        </button>
      </div>

    </div>
  );
}
