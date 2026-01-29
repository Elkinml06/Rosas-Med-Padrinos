import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll suave a la parte superior al cambiar de ruta
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // transición suave
    });
  }, [pathname]);

  return null; // no renderiza nada
}
