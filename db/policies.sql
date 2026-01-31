-- Habilitar policies para STORAGE en el bucket 'vouchers'

-- 1. Permitir SUBIR archivos (INSERT)
DROP POLICY IF EXISTS "Permitir subir comprobantes publicamente" ON storage.objects;
CREATE POLICY "Permitir subir comprobantes publicamente"
ON storage.objects FOR INSERT 
TO public 
WITH CHECK (bucket_id = 'vouchers');

-- 2. Permitir VER archivos (SELECT)
DROP POLICY IF EXISTS "Permitir ver comprobantes publicamente" ON storage.objects;
CREATE POLICY "Permitir ver comprobantes publicamente" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'vouchers');

-- 3. Permitir BORRAR archivos (DELETE)
DROP POLICY IF EXISTS "Permitir eliminar comprobantes publicamente" ON storage.objects;
CREATE POLICY "Permitir eliminar comprobantes publicamente" 
ON storage.objects FOR DELETE 
TO public 
USING (bucket_id = 'vouchers');