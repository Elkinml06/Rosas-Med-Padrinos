CREATE TABLE comprobantes_pago (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  cliente_id UUID NOT NULL,

  fecha_pago DATE NOT NULL DEFAULT CURRENT_DATE,
  estado TEXT NOT NULL DEFAULT 'pendiente',
  archivo_url TEXT NOT NULL,
  
  -- Nuevas columnas para manejar el pedido completo
  productos JSONB DEFAULT '[]'::jsonb,
  total NUMERIC DEFAULT 0,
  datos_envio JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMP DEFAULT now(),

  CONSTRAINT fk_cliente
    FOREIGN KEY (cliente_id)
    REFERENCES clientes(id)
    ON DELETE CASCADE,

  CONSTRAINT estado_comprobante_valido
    CHECK (estado IN ('pendiente', 'aprobado', 'rechazado'))
);
