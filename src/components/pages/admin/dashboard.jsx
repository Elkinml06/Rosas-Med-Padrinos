import { supabase } from "../../../supabase";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const [pedidos, setPedidos] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Estados para UI
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [notification, setNotification] = useState({ show: false, type: "", message: "" });
  const [loadingAction, setLoadingAction] = useState(false);

  // Helper para notificaciones
  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: "", message: "" }), 4000);
  };

  // Cargar pedidos desde Supabase
  const cargarPedidos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('comprobantes_pago')
        .select(`
          *,
          clientes (
            nombre,
            telefono
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error cargando pedidos:", error);
        return;
      }

      // Mapear los datos de Supabase al formato que espera el Dashboard
      const pedidosFormateados = data.map((p, index) => {
        let productos = [];
        let datosEnvio = {};
        try {
          productos = typeof p.productos === 'string' ? JSON.parse(p.productos) : p.productos;
          datosEnvio = typeof p.datos_envio === 'string' ? JSON.parse(p.datos_envio) : p.datos_envio;
        } catch (e) { console.error("Error parseando JSON:", e); }

        return {
          id: p.id,
          numero: data.length - index, // Número secuencial basado en el total
          fecha: p.created_at,
          estado: p.estado,
          total: p.total,
          clienteId: p.cliente_id,
          cliente: {
            nombreReceptor: datosEnvio.nombreReceptor || p.clientes?.nombre || "N/A",
            contacto: datosEnvio.contacto || p.clientes?.telefono || "N/A",
            carrera: datosEnvio.carrera || "N/A",
            nombreRemitente: datosEnvio.nombreRemitente || "N/A",
            anonimo: datosEnvio.anonimo,
            mensajes: datosEnvio.mensajes || []
          },
          productos: productos,
          pago: {
            metodo: "Nequi",
            comprobante: {
              nombre: "Comprobante",
              base64: p.archivo_url
            }
          }
        };
      });

      setPedidos(pedidosFormateados);
    } catch (error) {
      console.error("Error inesperado:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  // Cambiar estado
  const cambiarEstado = async (id) => {
    const pedidoActual = pedidos.find(p => p.id === id);
    const nuevoEstado = pedidoActual.estado === "pendiente" ? "aprobado" : "pendiente";

    // Optimistic
    setPedidos(pedidos.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p));

    const { error } = await supabase
      .from('comprobantes_pago')
      .update({ estado: nuevoEstado })
      .eq('id', id);

    if (error) {
      console.error("Error actualizando estado:", error);
      showNotification("error", "Error al actualizar el estado");
      cargarPedidos();
    } else {
      showNotification("success", `Pedido marcado como ${nuevoEstado}`);
    }
  };

  // Abrir modal de confirmación
  const solicitarEliminacion = (id) => {
    setOrderToDelete(id);
    setShowDeleteModal(true);
  };

  // Ejecutar eliminación
  const confirmarEliminacion = async () => {
    if (!orderToDelete) return;
    setLoadingAction(true);

    const pedidoAEliminar = pedidos.find(p => p.id === orderToDelete);
    const pedidosPrevios = [...pedidos];

    // Optimistic delete
    setPedidos(pedidos.filter(p => p.id !== orderToDelete));
    setShowDeleteModal(false); // cerrar modal rapido para UX

    try {
      // 1. Storage
      if (pedidoAEliminar?.pago?.comprobante?.base64) {
        const url = pedidoAEliminar.pago.comprobante.base64;
        const path = url.split('/vouchers/')[1];
        if (path) {
          const { error: errorStorage } = await supabase.storage.from('vouchers').remove([path]);
          if (errorStorage) console.error("Error Storage:", errorStorage);
        }
      }

      // 2. Pedido
      const { error: errorPedido } = await supabase.from('comprobantes_pago').delete().eq('id', orderToDelete);
      if (errorPedido) throw errorPedido;

      // 3. Cliente
      if (pedidoAEliminar?.clienteId) {
        await supabase.from('clientes').delete().eq('id', pedidoAEliminar.clienteId);
      }

      await cargarPedidos(); // Sincronizar
      showNotification("success", "Pedido eliminado correctamente");

    } catch (error) {
      console.error("Error eliminación:", error);
      showNotification("error", "Error al eliminar el pedido");
      setPedidos(pedidosPrevios); // Revertir
    } finally {
      setLoadingAction(false);
      setOrderToDelete(null);
    }
  };

  // Filtros
  const pedidosFiltrados = pedidos.filter((pedido) => {
    const coincideEstado = filtroEstado === "todos" || pedido.estado === filtroEstado;
    const nombre = pedido.cliente?.nombreReceptor?.toLowerCase() || "";
    return coincideEstado && nombre.includes(busqueda.toLowerCase());
  });

  // Estadísticas
  const totalPedidos = pedidos.length;
  const pendientes = pedidos.filter(p => p.estado === "pendiente").length;
  const entregados = pedidos.filter(p => p.estado === "aprobado").length;
  const totalVendido = pedidos.reduce((sum, p) => sum + (Number(p.total) || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 sm:p-6 pt-24 relative">

      {/* TOAST DE NOTIFICACIÓN */}
      <div
        className={`fixed top-24 right-4 z-50 transition-all duration-300 transform ${notification.show ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
          }`}
      >
        <div className={`rounded-xl shadow-2xl p-4 flex items-center gap-3 border-l-4 ${notification.type === "success"
          ? "bg-white border-green-500 text-gray-800"
          : "bg-white border-red-500 text-gray-800"
          }`}>
          <div className={`p-2 rounded-full ${notification.type === "success" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
            {notification.type === "success" ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            )}
          </div>
          <div>
            <p className="font-bold text-sm">{notification.type === "success" ? "¡Éxito!" : "Error"}</p>
            <p className="text-sm text-gray-600">{notification.message}</p>
          </div>
        </div>
      </div>

      {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setShowDeleteModal(false)}
          ></div>
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all scale-100">
            <div className="w-16 h-16 rounded-full bg-red-100 mx-auto flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-center text-gray-900 mb-2">¿Eliminar pedido?</h3>
            <p className="text-center text-gray-600 mb-6">
              Esta acción es permanente. Se eliminará el pedido, el cliente asociado y la imagen del comprobante. No se puede deshacer.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                disabled={loadingAction}
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEliminacion}
                className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 shadow-lg hover:shadow-red-500/30 transition-all flex justify-center items-center gap-2"
                disabled={loadingAction}
              >
                {loadingAction ? "Eliminando..." : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">

        {/* Header del dashboard */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
              Panel Administrativo
            </h1>
          </div>
          <p className="text-gray-700 mb-2 text-lg">
            Gestión de pedidos y ventas
          </p>
          <div className="flex justify-center items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <div className="w-3 h-3 bg-black rounded-full"></div>
          </div>
        </div>

        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Pedidos</p>
                <p className="text-2xl font-bold text-gray-900">{totalPedidos}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center">
                <span className="text-white font-bold">📦</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-600">{pendientes}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                <span className="text-white font-bold">⏳</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Aprobados</p>
                <p className="text-2xl font-bold text-green-600">{entregados}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <span className="text-white font-bold">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Vendido</p>
                <p className="text-2xl font-bold text-red-600">${totalVendido.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                <span className="text-white font-bold">💰</span>
              </div>
            </div>
          </div>
        </div>

        {/* CONTROLES */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar por nombre del receptor..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
              />
            </div>

            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="pl-12 pr-10 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all appearance-none"
              >
                <option value="todos">Todos los estados</option>
                <option value="pendiente">Solo pendientes</option>
                <option value="aprobado">Solo aprobados</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* SIN PEDIDOS */}
        {pedidosFiltrados.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No hay pedidos</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {pedidos.length === 0
                ? "Aún no se han registrado pedidos. Los pedidos aparecerán aquí cuando los clientes completen sus compras."
                : "No hay pedidos que coincidan con los filtros aplicados."}
            </p>
          </div>
        )}

        {/* LISTA PEDIDOS */}
        <div className="space-y-6">
          {pedidosFiltrados.map((pedido) => (
            <div
              key={pedido.id}
              className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
            >
              <div className="p-6 sm:p-8">
                {/* HEADER */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-6 border-b border-gray-100">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center">
                        <span className="text-white font-bold">#</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          Pedido {pedido.numero}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(pedido.fecha).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-3 sm:mt-0">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${pedido.estado === "pendiente"
                        ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                        : "bg-green-100 text-green-700 border border-green-200"
                        }`}
                    >
                      {pedido.estado === "pendiente" ? "⏳ Pendiente" : "✅ Aprobado"}
                    </span>
                  </div>
                </div>

                {/* INFORMACIÓN DEL CLIENTE */}
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Información del Cliente</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-500 mb-1">Receptor</p>
                      <p className="font-semibold text-gray-900">{pedido.cliente?.nombreReceptor || "—"}</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-500 mb-1">Contacto</p>
                      <p className="font-semibold text-gray-900">{pedido.cliente?.contacto || "—"}</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-500 mb-1">Carrera</p>
                      <p className="font-semibold text-gray-900">{pedido.cliente?.carrera || "—"}</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-500 mb-1">Remitente</p>
                      <p className="font-semibold text-gray-900">
                        {pedido.cliente?.anonimo ? "Anónimo" : (pedido.cliente?.nombreRemitente || "—")}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-500 mb-1">Método de Pago</p>
                      <p className="font-semibold text-gray-900">{pedido.pago?.metodo || "Nequi"}</p>
                    </div>
                  </div>

                  {/* CARTAS DEL CLIENTE */}
                  {Array.isArray(pedido.cliente?.mensajes) && pedido.cliente.mensajes.length > 0 && (
                    <div className="mt-6">
                      <h5 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                        </svg>
                        Mensajes de las Cartas
                      </h5>
                      <div className="space-y-3">
                        {pedido.cliente.mensajes.map((msg, i) => (
                          <div
                            key={i}
                            className="p-4 bg-gradient-to-r from-red-50 to-white rounded-lg border border-red-100"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 text-xs font-bold flex items-center justify-center">
                                {i + 1}
                              </span>
                              <span className="text-sm font-medium text-gray-700">Carta {i + 1}</span>
                            </div>
                            <p className="text-gray-700 whitespace-pre-line pl-2 border-l-2 border-red-300">{msg}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* PRODUCTOS */}
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Productos del Pedido</h4>
                  <div className="space-y-4">
                    {pedido.productos?.map((p, index) => (
                      <div
                        key={`${p.id}-${index}`}
                        className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-gray-100 to-white border border-gray-200 p-2 flex-shrink-0">
                            <img
                              src={p.imagen}
                              alt={p.nombre}
                              className="w-full h-full object-contain"
                            />
                          </div>

                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h5 className="font-bold text-gray-900">{p.nombre}</h5>
                                <p className="text-sm text-gray-500">Cantidad: {p.cantidad}</p>
                                <p className="text-sm text-gray-500">Precio unitario: ${p.precio.toLocaleString()}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-gray-900">${(p.precio * p.cantidad).toLocaleString()}</p>
                                <p className="text-xs text-gray-500">Subtotal</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FOOTER */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200">
                  <div className="text-center md:text-left">
                    <p className="text-lg font-bold text-gray-900">Total del Pedido</p>
                    <div className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                      ${pedido.total?.toLocaleString()}
                    </div>
                    {pedido.pago?.comprobante && (
                      <div className="mt-3 space-y-2">
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                          </svg>
                          Comprobante: {pedido.pago.comprobante.nombre}
                        </p>

                        {/* 👇 IMAGEN DEL COMPROBANTE (Miniatura) */}
                        {pedido.pago.comprobante.base64 && (
                          <>
                            <img
                              src={pedido.pago.comprobante.base64}
                              alt="Comprobante de pago"
                              onClick={() => setIsOpen(true)} // Abrir modal
                              className="w-40 rounded-lg border border-gray-300 shadow-sm hover:scale-105 transition-transform cursor-pointer"
                            />

                            {/* 👇 MODAL (Se muestra solo si isOpen es true) */}
                            {isOpen && (
                              <div
                                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4 animate-in fade-in duration-300"
                                onClick={() => setIsOpen(false)} // Cerrar al hacer clic fuera
                              >
                                <div className="relative max-w-3xl w-full flex flex-col items-center">
                                  {/* Botón de cerrar */}
                                  <button
                                    className="fixed top-4 right-4 z-[60] bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full p-2 hover:bg-white/20 transition-all font-bold"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setIsOpen(false);
                                    }}
                                  >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>

                                  <img
                                    src={pedido.pago.comprobante.base64}
                                    alt="Comprobante ampliado"
                                    className="max-h-[90vh] max-w-full rounded-md shadow-2xl object-contain"
                                  />
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}

                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => cambiarEstado(pedido.id)}
                      className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${pedido.estado === "pendiente"
                        ? "bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 shadow-lg hover:shadow-xl"
                        : "bg-gradient-to-r from-gray-600 to-gray-500 text-white hover:from-gray-700 hover:to-gray-600 shadow-lg hover:shadow-xl"
                        }`}
                    >
                      {pedido.estado === "pendiente" ? "✅ Marcar como aprobado" : "⏳ Marcar como pendiente"}
                    </button>

                    <button
                      onClick={() => solicitarEliminacion(pedido.id)}
                      className="px-5 py-2.5 rounded-xl font-medium bg-gradient-to-r from-gray-100 to-white text-gray-700 border border-gray-300 hover:bg-gradient-to-r hover:from-gray-200 hover:to-gray-100 active:bg-gray-300 transition-all duration-300"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>

              {/* Barra decorativa inferior */}
              <div className="h-1 bg-gradient-to-r from-red-500 via-gray-400 to-black opacity-60"></div>
            </div>
          ))}
        </div>

        {/* Footer informativo */}
        <div className="mt-8 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Total de pedidos mostrados:</span> {pedidosFiltrados.length} de {pedidos.length}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Los cambios de estado y eliminaciones se guardan automáticamente. Usa con cuidado la función de eliminar.
              </p>
            </div>
          </div>
        </div>

        {/* Decoración sutil */}
        <div className="hidden md:block fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-20"></div>
      </div>
    </div>
  );
};

export default Dashboard;