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

  const handleFile = (archivo) => archivo && setFile(archivo);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files[0]);
  };
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject("Error al convertir archivo");
  });
};

const enviarPedido = async () => {
  try {
    if (!file) return;

    const productos =
      JSON.parse(localStorage.getItem("productosSeleccionados")) || [];
    const datosCliente = JSON.parse(localStorage.getItem("datosPedido"));

    if (!datosCliente) return alert("Faltan los datos del cliente");

    const base64 = await fileToBase64(file);

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
          base64,
        },
      },
    };

    const pedidosPrevios = JSON.parse(localStorage.getItem("pedidos")) || [];
    pedidosPrevios.push(pedidoFinal);
    localStorage.setItem("pedidos", JSON.stringify(pedidosPrevios));

    setPedidoEnviado(true);
  } catch (error) {
    console.error(error);
    alert("Error al enviar el pedido. Intenta nuevamente.");
  }
};



  if (pedidoEnviado) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4 pt-24">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden max-w-md w-full">
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
              ¡Pedido realizado con éxito! 🎉
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed text-sm sm:text-base">
              Tu pedido ha sido recibido correctamente. Nos pondremos en contacto muy pronto.
            </p>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-6 text-sm">
              <p><span className="font-semibold">ID del pedido:</span> PED-{Date.now().toString().slice(-8)}</p>
              <p className="mt-1"><span className="font-semibold">Total:</span> ${total.toLocaleString()}</p>
            </div>

            <button
              onClick={() => navigate("/")}
              className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition-all"
            >
              Volver al inicio
            </button>
          </div>
          <div className="h-1 bg-gradient-to-r from-red-500 via-gray-400 to-black opacity-60" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 sm:p-6 pt-24">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
            Confirmación de Pago
          </h1>
          <p className="text-gray-700 text-sm sm:text-lg mb-2">
            Último paso: realiza el pago y sube el comprobante
          </p>
          <div className="flex justify-center gap-2 mt-2">
            <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
            <div className="w-2.5 h-2.5 bg-gray-400 rounded-full"></div>
            <div className="w-2.5 h-2.5 bg-black rounded-full"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

          {/* Resumen */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-5 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 border-b pb-3">Resumen Final</h2>

              {/* Cliente */}
              <div className="mb-4">
                <h3 className="font-bold text-gray-900 mb-2">Información del envío</h3>
                <div className="p-3 bg-gray-50 rounded-lg text-sm">
                  {(() => {
                    const datosCliente = JSON.parse(localStorage.getItem("datosPedido")) || {};
                    return (
                      <>
                        <p><span className="font-medium">Para:</span> {datosCliente.nombreReceptor || "-"}</p>
                        <p><span className="font-medium">Contacto:</span> {datosCliente.contacto || "-"}</p>
                        <p><span className="font-medium">Remitente:</span> {datosCliente.anonimo ? "Anónimo" : (datosCliente.nombreRemitente || "-")}</p>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Productos */}
              <div className="mb-4">
                <h3 className="font-bold text-gray-900 mb-2">Productos seleccionados</h3>
                <div className="space-y-2 text-sm">
                  {(() => {
                    const productos = JSON.parse(localStorage.getItem("productosSeleccionados")) || [];
                    return productos.map((p, i) => (
                      <div key={i} className="flex justify-between py-2 border-b last:border-0">
                        <div>
                          <p className="font-medium">{p.nombre} x {p.cantidad}</p>
                          <p className="text-gray-500 text-xs">${p.precio.toLocaleString()} c/u</p>
                        </div>
                        <span className="font-semibold text-gray-900">${(p.precio * p.cantidad).toLocaleString()}</span>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* Total */}
              <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total a pagar</span>
                <span className="text-2xl font-bold text-red-600">${total.toLocaleString()}</span>
              </div>

              <button
                onClick={() => navigate("/datos")}
                className="w-full mt-4 border-2 border-gray-300 py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors"
              >
                ← Volver a modificar datos
              </button>
            </div>
            <div className="h-1 bg-gradient-to-r from-red-500 via-gray-400 to-black opacity-60" />
          </div>

          {/* Pago Nequi */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-5 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold">
                  N
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Pago con Nequi</h2>
                  <p className="text-gray-600 text-sm sm:text-base">Transfiere al siguiente número</p>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 mb-4 text-sm">
                <p>Monto a transferir:</p>
                <div className="text-2xl sm:text-3xl font-bold text-red-600">${total.toLocaleString()}</div>
              </div>

              <div className="mb-4">
                <p className="font-medium mb-2">Número Nequi:</p>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm sm:text-base">
                  <span className="font-bold text-gray-900 tracking-wider">{nequiNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')}</span>
                  <button
                    onClick={copiarNumero}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                      copiado ? "bg-green-100 text-green-700" : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                  >
                    {copiado ? "✓ Copiado" : "📋 Copiar"}
                  </button>
                </div>
              </div>

              {/* Comprobante */}
              <div className="mb-4">
                <h3 className="font-bold mb-2">Comprobante de pago</h3>
                <label
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                  className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer text-center transition-all ${
                    dragActive ? "border-red-500 bg-red-50" : file ? "border-green-500 bg-green-50" : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <input type="file" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
                  <p className="font-medium">{file ? "Archivo cargado ✓" : "Arrastra o haz clic para seleccionar"}</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, PDF (Máx. 10MB)</p>
                </label>

                {file && (
                  <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg flex justify-between items-center text-sm">
                    <p className="truncate max-w-xs">{file.name}</p>
                    <button onClick={() => setFile(null)} className="text-red-500 hover:text-red-700 text-xs font-medium">Quitar</button>
                  </div>
                )}
              </div>

              <button
                onClick={enviarPedido}
                disabled={!file}
                className={`w-full py-3 rounded-full font-semibold mt-2 transition-all ${
                  file ? "bg-red-500 text-white hover:bg-red-600 shadow-md" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {file ? "Enviar pedido y finalizar" : "Sube el comprobante primero"}
              </button>

              <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs sm:text-sm">
                <span className="font-semibold">Importante:</span> Tu pedido se procesará una vez verifiquemos el comprobante de pago. Te contactaremos en máximo 24h.
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-red-500 via-gray-400 to-black opacity-60" />
          </div>
        </div>

        <div className="hidden md:block fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-20"></div>
      </div>
    </div>
  );
}
