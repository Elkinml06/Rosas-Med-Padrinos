import { useEffect, useState } from "react";

const Dashboard = () => {
  const [pedidos, setPedidos] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [busqueda, setBusqueda] = useState("");

  // Cargar pedidos
  useEffect(() => {
    const pedidosGuardados =
      JSON.parse(localStorage.getItem("pedidos")) || [];
    setPedidos(pedidosGuardados.reverse());
  }, []);

  // Guardar cambios en localStorage
  const actualizarPedidos = (nuevosPedidos) => {
    setPedidos(nuevosPedidos);
    localStorage.setItem(
      "pedidos",
      JSON.stringify([...nuevosPedidos].reverse())
    );
  };

  // Cambiar estado
  const cambiarEstado = (id) => {
    const nuevosPedidos = pedidos.map((p) =>
      p.id === id
        ? {
            ...p,
            estado: p.estado === "pendiente" ? "entregado" : "pendiente",
          }
        : p
    );
    actualizarPedidos(nuevosPedidos);
  };

  // Eliminar pedido
  const eliminarPedido = (id) => {
    if (!confirm("¿Eliminar este pedido?")) return;
    const nuevosPedidos = pedidos.filter((p) => p.id !== id);
    actualizarPedidos(nuevosPedidos);
  };

  // Filtros
  const pedidosFiltrados = pedidos.filter((pedido) => {
    const coincideEstado =
      filtroEstado === "todos" || pedido.estado === filtroEstado;

    const nombre =
      pedido.cliente?.nombreReceptor?.toLowerCase() || "";

    const coincideNombre = nombre.includes(busqueda.toLowerCase());

    return coincideEstado && coincideNombre;
  });

  return (
    <div className="p-8 bg-pink-50 min-h-screen">
      <h1 className="text-3xl font-bold text-pink-600 mb-6">
        Panel Admin 🌹
      </h1>

      {/* CONTROLES */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* BUSCADOR */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="🔍 Buscar por nombre del cliente"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border focus:outline-none"
          />
        </div>

        {/* FILTRO ESTADO */}
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="px-4 py-3 rounded-xl border"
        >
          <option value="todos">Todos</option>
          <option value="pendiente">Pendientes</option>
          <option value="entregado">Entregados</option>
        </select>
      </div>

      {/* SIN PEDIDOS */}
      {pedidosFiltrados.length === 0 && (
        <p className="text-gray-500 text-center">
          No hay pedidos con estos filtros.
        </p>
      )}

      {/* LISTA */}
      <div className="space-y-6">
        {pedidosFiltrados.map((pedido) => (
          <div
            key={pedido.id}
            className="bg-white rounded-2xl shadow p-6"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="font-semibold">
                  Pedido {pedido.id}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(pedido.fecha).toLocaleString()}
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold
                  ${
                    pedido.estado === "pendiente"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }
                `}
              >
                {pedido.estado}
              </span>
            </div>

            {/* CLIENTE */}
            <div className="mb-4">
              <p className="font-semibold mb-1">
                Cliente
              </p>
              <p>
                <strong>Receptor:</strong>{" "}
                {pedido.cliente?.nombreReceptor}
              </p>
              <p>
                <strong>Contacto:</strong>{" "}
                {pedido.cliente?.contacto}
              </p>

              {!pedido.cliente?.anonimo && (
                <p>
                  <strong>Remitente:</strong>{" "}
                  {pedido.cliente?.nombreRemitente}
                </p>
              )}

              {pedido.cliente?.mensaje && (
                <p className="mt-1 text-sm text-gray-600">
                  💌 {pedido.cliente.mensaje}
                </p>
              )}
            </div>

            {/* PRODUCTOS */}
            <div className="mb-4">
              <p className="font-semibold mb-2">
                Productos
              </p>

              {pedido.productos.map((p) => (
                <div
                  key={p.id}
                  className="flex justify-between text-sm"
                >
                  <span>
                    {p.nombre} x {p.cantidad}
                  </span>
                  <span>
                    ${(p.precio * p.cantidad).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* FOOTER */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-t pt-4">
              <p className="font-bold text-pink-500">
                Total: ${pedido.total.toLocaleString()}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => cambiarEstado(pedido.id)}
                  className="px-4 py-2 rounded-xl bg-blue-500 text-white text-sm"
                >
                  Cambiar estado
                </button>

                <button
                  onClick={() => eliminarPedido(pedido.id)}
                  className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-2">
              📎 {pedido.pago.comprobante.nombre}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
