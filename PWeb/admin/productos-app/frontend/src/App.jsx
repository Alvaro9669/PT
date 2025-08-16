import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [formData, setFormData] = useState({
    n_articulo: '',
    precio: '',
    categoria_FK: '',
    scategoria_FK: '',
    imagen: null,
  });
  const [preview, setPreview] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar categorías al iniciar
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/categorias`);
        console.log('Categorias data:', res.data); // Verifica que sea un arreglo
        setCategorias(res.data);
      } catch (error) {
        console.error('Error fetching categorias:', error);
      }
    };
    fetchCategorias();
  }, []);


  // Cargar subcategorías cuando cambia la categoría
  useEffect(() => {
  const fetchSubcategorias = async () => {
    if (!formData.categoria_FK) {
      setSubcategorias([]);
      return;
    }
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/categorias/${formData.categoria_FK}/subcategorias`
      );
      console.log('Subcategorias data:', res.data); // Verifica que sea un arreglo
      setSubcategorias(res.data);
    } catch (error) {
      console.error('Error fetching subcategorias:', error);
    }
  };
  fetchSubcategorias();
}, [formData.categoria_FK]);

  // Manejar imagen
  const handleImagen = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, imagen: file });
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validar campos requeridos
    if (!formData.n_articulo || !formData.precio || !formData.categoria_FK || !formData.imagen) {
      alert('Por favor, completa todos los campos requeridos.');
      return;
    }
  
    setIsSubmitting(true);
    const formDataToSend = new FormData();
    formDataToSend.append('n_articulo', formData.n_articulo);
    formDataToSend.append('precio', formData.precio);
    formDataToSend.append('categoria_FK', formData.categoria_FK);
    formDataToSend.append('scategoria_FK', formData.scategoria_FK);
    formDataToSend.append('imagen', formData.imagen);
  
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/productos`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Producto creado exitosamente!');
      setFormData({
        n_articulo: '',
        precio: '',
        categoria_FK: '',
        scategoria_FK: '',
        imagen: null,
      });
      setPreview('');
    } catch (error) {
      console.error('Error al crear producto:', error);
      alert('Hubo un error al crear el producto.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Alta de Productos</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre del Artículo</label>
          <input
            type="text"
            className="form-control"
            value={formData.n_articulo}
            onChange={(e) => setFormData({ ...formData, n_articulo: e.target.value })}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Precio</label>
          <input
            type="number"
            className="form-control"
            step="0.01"
            value={formData.precio}
            onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
            required
          />
        </div>

        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Categoría</label>
            <select
              className="form-select"
              value={formData.categoria_FK}
              onChange={(e) => setFormData({ ...formData, categoria_FK: e.target.value })}
              required
            >
              <option value="">Seleccionar...</option>
              {Array.isArray(categorias) &&
                categorias.map((cat) => (
                  <option key={cat.ID_categoria} value={cat.ID_categoria}>
                    {cat.n_categoria}
                  </option>
                ))}
            </select>
          </div>

          <div className="col">
            <label className="form-label">Subcategoría</label>
            <select
              className="form-select"
              value={formData.scategoria_FK}
              onChange={(e) => setFormData({ ...formData, scategoria_FK: e.target.value })}
              required
              disabled={!formData.categoria_FK}
            >
              <option value="">Seleccionar...</option>
              {Array.isArray(subcategorias) &&
                subcategorias.map((sub) => (
                  <option key={sub.ID_subcate} value={sub.ID_subcate}>
                    {sub.n_scategoria}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Imagen del Producto</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleImagen}
            required
          />
          {preview && (
            <div className="mt-3">
              <img src={preview} alt="Vista previa" style={{ maxWidth: '200px', maxHeight: '200px' }} />
            </div>
          )}
        </div>

        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Guardar Producto'}
        </button>
      </form>
    </div>
  );
}

export default App;