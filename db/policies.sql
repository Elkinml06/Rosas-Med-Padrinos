-- Habilitar RLS en las tablas (por seguridad)
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comprobantes_pago ENABLE ROW LEVEL SECURITY;

-- 1. Políticas para tabla CLIENTES

-- Permitir insertar a cualquiera (público)
DROP POLICY IF EXISTS "Permitir insertar clientes publicamente" ON clientes;
CREATE POLICY "Permitir insertar clientes publicamente"
ON clientes FOR INSERT
TO public
WITH CHECK (true);

-- Permitir leer clientes (necesario para verificar duplicados por teléfono)
DROP POLICY IF EXISTS "Permitir leer clientes publicamente" ON clientes;
CREATE POLICY "Permitir leer clientes publicamente"
ON clientes FOR SELECT
TO public
USING (true);

-- Permitir eliminar clientes (para cascading delete)
DROP POLICY IF EXISTS "Permitir eliminar clientes publicamente" ON clientes;
CREATE POLICY "Permitir eliminar clientes publicamente"
ON clientes FOR DELETE
TO public
USING (true);

-- 2. Políticas para tabla COMPROBANTES_PAGO

-- Permitir insertar comprobantes
DROP POLICY IF EXISTS "Permitir insertar comprobantes publicamente" ON comprobantes_pago;
CREATE POLICY "Permitir insertar comprobantes publicamente"
ON comprobantes_pago FOR INSERT
TO public
WITH CHECK (true);

-- Permitir leer (opcional, si necesitas mostrar algo después)
DROP POLICY IF EXISTS "Permitir leer comprobantes publicamente" ON comprobantes_pago;
CREATE POLICY "Permitir leer comprobantes publicamente"
ON comprobantes_pago FOR SELECT
TO public
USING (true);

-- Permitir actualizar (para cambiar estado en dashboard)
DROP POLICY IF EXISTS "Permitir actualizar comprobantes publicamente" ON comprobantes_pago;
CREATE POLICY "Permitir actualizar comprobantes publicamente"
ON comprobantes_pago FOR UPDATE
TO public
USING (true);

-- Permitir eliminar (para borrar pedidos en dashboard)
DROP POLICY IF EXISTS "Permitir eliminar comprobantes publicamente" ON comprobantes_pago;
CREATE POLICY "Permitir eliminar comprobantes publicamente"
ON comprobantes_pago FOR DELETE
TO public
USING (true);

-- 3. Políticas para STORAGE (Bucket: vouchers)

-- Asegurarse de que el bucket exista y sea público
INSERT INTO storage.buckets (id, name, public)
VALUES ('vouchers', 'vouchers', true)
ON CONFLICT (id) DO NOTHING;

-- Permitir subir archivos al bucket 'vouchers' a cualquier usuario (público)
DROP POLICY IF EXISTS "Permitir subir comprobantes publicamente" ON storage.objects;
CREATE POLICY "Permitir subir comprobantes publicamente"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'vouchers');

-- Permitir ver los archivos (necesario para las URLs públicas)
DROP POLICY IF EXISTS "Permitir ver comprobantes publicamente" ON storage.objects;
CREATE POLICY "Permitir ver comprobantes publicamente"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'vouchers');

-- Permitir eliminar archivos (para cascading delete)
DROP POLICY IF EXISTS "Permitir eliminar comprobantes publicamente" ON storage.objects;
CREATE POLICY "Permitir eliminar comprobantes publicamente"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'vouchers');
