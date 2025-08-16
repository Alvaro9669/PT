// Función utilitaria para formatear nombres de categorías para mostrar correctamente en la interfaz
export const formatCategoryName = (name) => {
    if (!name) return name;  // Verificar que el nombre existe antes de procesarlo
    
    return name
        .replace(/_/g, ' ')  // Reemplazar guiones bajos con espacios para mejor legibilidad
        .split(' ')          // Dividir en palabras individuales
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalizar primera letra de cada palabra
        .join(' ');          // Unir las palabras de nuevo con espacios
};

// Ejemplos de transformación:
// "digital" → "Digital"
// "video_juegos" → "Video Juegos"
// "ropa_deportiva" → "Ropa Deportiva"
