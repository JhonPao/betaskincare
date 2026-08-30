"use client";

import React, { useState, useEffect } from "react";
import { Logo } from "@/components/ui/Logo";
import { 
  auth, 
  Product, 
  CategoryItem,
  DEFAULT_CATEGORIES,
  getProductsFromFirebase, 
  saveProductToFirebase, 
  deleteProductFromFirebase, 
  getCategoriesFromFirebase,
  saveCategoryToFirebase,
  deleteCategoryFromFirebase
} from "@/lib/firebase";
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User 
} from "firebase/auth";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  AlertTriangle, 
  ClipboardList, 
  Settings, 
  LogOut, 
  Edit, 
  Trash2, 
  Plus, 
  Lock, 
  Mail,
  AlertCircle,
  Link as LinkIcon,
  Image as ImageIcon,
  Tag,
  Sparkles,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from "recharts";

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Formulario Login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Secciones Sidebar
  const [activeSection, setActiveSection] = useState<"dashboard" | "products" | "stock" | "orders" | "settings">("dashboard");

  // Datos
  const [products, setProducts] = useState<Product[]>([]);
  const [categoriesList, setCategoriesList] = useState<CategoryItem[]>(DEFAULT_CATEGORIES);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(10);
  const [whatsappPhone, setWhatsappPhone] = useState("51973468722");

  // Formulario Agregar/Editar Categoría o Marca
  const [newCatLabel, setNewCatLabel] = useState("");
  const [newBrandLabel, setNewBrandLabel] = useState("");

  // Formulario Agregar/Editar Producto
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "sunscreen",
    brand: "",
    price: "",
    discount: "0",
    stock: "",
    delivery: "inmediata" as "inmediata" | "distribuidor",
    shippingTime: "3-5 días hábiles",
    badge: "",
    rating: "5",
    reviewCount: "1",
    mainImage: "",
    extraImageUrl: "",
    imagesList: [] as string[]
  });

  const [savingLoading, setSavingLoading] = useState(false);

  // 1. Monitorear autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Cargar productos y categorías de Firebase
  const loadData = async () => {
    try {
      setLoadingProducts(true);
      const [prods, cats] = await Promise.all([
        getProductsFromFirebase(),
        getCategoriesFromFirebase()
      ]);
      setProducts(prods);
      setCategoriesList(cats);
    } catch (e) {
      console.error("Error al cargar datos en admin:", e);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
      const stored = localStorage.getItem("betaskincare_settings");
      if (stored) {
        try { 
          const parsed = JSON.parse(stored);
          setDeliveryFee(parsed.deliveryFee || 10);
          if (parsed.whatsappPhone) setWhatsappPhone(parsed.whatsappPhone);
        } catch { 
          setDeliveryFee(10); 
        }
      }
    }
  }, [user]);

  // Manejo de Login / Logout
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      setLoginError("Credenciales incorrectas. Verifica tu correo y contraseña.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  // 3. Gestión Separada de Categorías y Marcas
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatLabel.trim()) return;

    const slug = newCatLabel.toLowerCase().trim().replace(/[^a-z0-9]/g, "-");
    const newCat: CategoryItem = {
      id: slug,
      name: slug,
      label: newCatLabel.trim(),
      type: "category"
    };

    const updated = [...categoriesList, newCat];
    setCategoriesList(updated);
    localStorage.setItem("betaskincare_categories", JSON.stringify(updated));
    await saveCategoryToFirebase(newCat);
    setNewCatLabel("");
    alert("✓ Categoría agregada exitosamente");
  };

  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandLabel.trim()) return;

    const slug = newBrandLabel.toLowerCase().trim().replace(/[^a-z0-9]/g, "-");
    const newBrand: CategoryItem = {
      id: slug,
      name: slug,
      label: newBrandLabel.trim(),
      type: "brand"
    };

    const updated = [...categoriesList, newBrand];
    setCategoriesList(updated);
    localStorage.setItem("betaskincare_categories", JSON.stringify(updated));
    await saveCategoryToFirebase(newBrand);
    setNewBrandLabel("");
    alert("✓ Marca de cosmética agregada exitosamente");
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar esta opción?")) return;
    const updated = categoriesList.filter(c => c.id !== id);
    setCategoriesList(updated);
    localStorage.setItem("betaskincare_categories", JSON.stringify(updated));
    await deleteCategoryFromFirebase(id);
  };

  // 4. Borrar Producto
  const handleDeleteProduct = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      await deleteProductFromFirebase(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      alert("Producto eliminado correctamente.");
    } catch (error) {
      alert("Error al eliminar el producto.");
    }
  };

  // 5. Modal de creación / edición de producto
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    const defaultCat = categoriesList.find(c => c.type === "category")?.name || "sunscreen";
    setFormData({
      name: "",
      category: defaultCat,
      brand: "",
      price: "",
      discount: "0",
      stock: "",
      delivery: "inmediata",
      shippingTime: "3-5 días hábiles",
      badge: "",
      rating: "5",
      reviewCount: "1",
      mainImage: "",
      extraImageUrl: "",
      imagesList: []
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    const mainImg = product.image || (product.images && product.images[0]) || "";
    const extraImgs = product.images ? product.images.filter(u => u !== mainImg) : [];

    setFormData({
      name: product.name,
      category: product.category,
      brand: product.brand || "",
      price: String(product.price),
      discount: String(product.discount),
      stock: String(product.stock),
      delivery: product.delivery,
      shippingTime: product.shippingTime || "3-5 días hábiles",
      badge: product.badge || "",
      rating: String(product.rating || 5),
      reviewCount: String(product.reviewCount || 1),
      mainImage: mainImg,
      extraImageUrl: "",
      imagesList: extraImgs
    });
    setIsModalOpen(true);
  };

  // Agregar imagen secundaria por URL a la lista de galería
  const handleAddExtraImageUrl = () => {
    const url = formData.extraImageUrl.trim();
    if (!url) return;
    if (formData.imagesList.includes(url)) {
      alert("Esta URL ya está en la lista.");
      return;
    }
    setFormData(prev => ({
      ...prev,
      imagesList: [...prev.imagesList, url],
      extraImageUrl: ""
    }));
  };

  // Eliminar imagen de la lista de galería
  const handleRemoveImageIndex = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imagesList: prev.imagesList.filter((_, i) => i !== index)
    }));
  };

  // GUARDAR PRODUCTO CON URL DE IMAGEN EXACTA
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingLoading(true);

    try {
      const targetId = editingProduct 
        ? editingProduct.id 
        : products.length > 0 
          ? Math.max(...products.map(p => p.id)) + 1 
          : 1;

      const mainUrl = formData.mainImage.trim();
      const extraInputUrl = formData.extraImageUrl.trim();

      // Recoger imágenes secundarias
      let gallery = [...formData.imagesList];
      if (extraInputUrl && !gallery.includes(extraInputUrl)) {
        gallery.push(extraInputUrl);
      }

      // Asegurar que la imagen principal esté al inicio del arreglo de imágenes
      if (mainUrl && !gallery.includes(mainUrl)) {
        gallery = [mainUrl, ...gallery];
      } else if (mainUrl) {
        gallery = [mainUrl, ...gallery.filter(u => u !== mainUrl)];
      }

      const finalMainImage = mainUrl || (gallery[0] || "");
      const finalGallery = gallery.length > 0 ? gallery : (finalMainImage ? [finalMainImage] : []);

      const categoryObj = categoriesList.find(c => c.name === formData.category);
      const categoryLabel = categoryObj ? categoryObj.label : formData.category;

      const updatedProduct: Product = {
        id: targetId,
        name: formData.name.trim(),
        category: formData.category,
        categoryLabel: categoryLabel,
        brand: formData.brand.trim() || "",
        price: parseFloat(formData.price) || 0,
        discount: parseInt(formData.discount) || 0,
        stock: parseInt(formData.stock) || 0,
        delivery: formData.delivery,
        shippingTime: formData.delivery === "distribuidor" ? formData.shippingTime : "",
        badge: formData.badge.trim() || null,
        rating: parseFloat(formData.rating) || 5,
        reviewCount: parseInt(formData.reviewCount) || 1,
        image: finalMainImage,
        images: finalGallery
      };

      await saveProductToFirebase(updatedProduct);

      if (editingProduct) {
        setProducts(prev => prev.map(p => p.id === targetId ? updatedProduct : p));
      } else {
        setProducts(prev => [...prev, updatedProduct]);
      }

      setIsModalOpen(false);
      alert(editingProduct ? "✓ Producto actualizado correctamente" : "✓ Producto guardado correctamente");
    } catch (err: any) {
      console.error("Error al guardar producto:", err);
      alert("Error al guardar el producto: " + (err.message || err));
    } finally {
      setSavingLoading(false);
    }
  };

  // Guardar configuración de pedidos y tarifa de delivery
  const handleSaveSettings = () => {
    const cleanPhone = whatsappPhone.replace(/\D/g, "");
    const settingsObj = { 
      deliveryFee, 
      whatsappPhone: cleanPhone || "51973468722" 
    };
    localStorage.setItem("betaskincare_settings", JSON.stringify(settingsObj));
    alert("✓ Configuración de Pedidos y Delivery guardada correctamente.");
  };

  // Actualizar stock rápido
  const handleQuickUpdateStock = async (product: Product, newStock: number) => {
    if (newStock < 0) return;
    try {
      const updated = { ...product, stock: newStock };
      await saveProductToFirebase(updated);
      setProducts(prev => prev.map(p => p.id === product.id ? updated : p));
    } catch (error) {
      console.error(error);
    }
  };

  // DATOS PARA GRÁFICOS RECHARTS
  const categoryChartData = categoriesList
    .filter(c => c.type === "category")
    .map(c => {
      const count = products.filter(p => p.category === c.name).length;
      return { name: c.label, count };
    });

  const stockChartData = [
    { name: "En Stock", value: products.filter(p => p.stock > 3).length },
    { name: "Stock Bajo (≤3)", value: products.filter(p => p.stock > 0 && p.stock <= 3).length },
    { name: "Agotado (0)", value: products.filter(p => p.stock === 0).length }
  ];

  const CHART_COLORS = ["#7CB97A", "#F39C12", "#E74C3C"];

  const totalValue = products.reduce((acc, p) => acc + p.price * p.stock, 0);
  const lowStockCount = products.filter(p => p.stock <= 3).length;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-primary-dark mb-4"></div>
        <p className="text-sm text-brand-text-light font-medium">Verificando acceso...</p>
      </div>
    );
  }

  // PANTALLA DE LOGIN
  if (!user) {
    return (
      <div className="min-h-screen bg-linear-to-br from-brand-primary-light via-brand-bg to-brand-secondary flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-lg border border-brand-primary-dark/15 flex flex-col text-center">
          <div className="flex justify-center mb-3">
            <Logo size="lg" />
          </div>
          <div className="font-serif text-2xl font-bold mb-1">
            Beta<span className="text-brand-primary-dark">SkinCare</span>
          </div>
          <p className="text-xs text-brand-text-light tracking-widest uppercase font-semibold mb-6">
            Panel Administrador
          </p>

          {loginError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold text-left flex gap-1.5 items-start">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1.5">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <Input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@betaskincare.pe"
                  className="bg-stone-50 border-stone-200 pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <Input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-stone-50 border-stone-200 pl-10"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loginLoading}
              className="w-full py-6 rounded-full bg-linear-to-r from-primary to-brand-primary-dark text-white font-semibold cursor-pointer shadow-md mt-6 disabled:opacity-50"
            >
              {loginLoading ? "Ingresando..." : "Ingresar"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-brand-primary-dark/10 flex flex-col p-6">
        <div className="flex items-center gap-2.5 mb-8 justify-center md:justify-start">
          <Logo size="md" />
          <span className="font-serif text-lg font-bold">
            Beta<span className="text-brand-primary-dark">SkinCare</span>
          </span>
        </div>

        <nav className="space-y-1.5 flex-1">
          <button
            onClick={() => setActiveSection("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeSection === "dashboard"
                ? "bg-brand-primary-light text-brand-primary-dark"
                : "text-stone-600 hover:bg-stone-50"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>

          <button
            onClick={() => setActiveSection("products")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeSection === "products"
                ? "bg-brand-primary-light text-brand-primary-dark"
                : "text-stone-600 hover:bg-stone-50"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Productos
          </button>

          <button
            onClick={() => setActiveSection("stock")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeSection === "stock"
                ? "bg-brand-primary-light text-brand-primary-dark"
                : "text-stone-600 hover:bg-stone-50"
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            Control de Stock
          </button>

          <button
            onClick={() => setActiveSection("orders")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeSection === "orders"
                ? "bg-brand-primary-light text-brand-primary-dark"
                : "text-stone-600 hover:bg-stone-50"
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            Pedidos
          </button>

          <button
            onClick={() => setActiveSection("settings")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeSection === "settings"
                ? "bg-brand-primary-light text-brand-primary-dark"
                : "text-stone-600 hover:bg-stone-50"
            }`}
          >
            <Settings className="w-4 h-4" />
            Configuración & Categorías
          </button>
        </nav>

        <div className="border-t border-brand-primary-dark/10 pt-4 mt-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-50 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-8 pb-4 border-b border-brand-primary-dark/5">
          <h1 className="text-xl font-bold uppercase tracking-wider text-foreground">
            {activeSection === "dashboard" && "Dashboard General"}
            {activeSection === "products" && "Gestión de Productos"}
            {activeSection === "stock" && "Control de Inventario"}
            {activeSection === "orders" && "Registro de Pedidos"}
            {activeSection === "settings" && "Configuración & Categorías"}
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-600 font-semibold">{user.email}</span>
            <div className="w-8 h-8 rounded-full bg-brand-primary-dark text-white flex items-center justify-center font-bold text-xs">
              AD
            </div>
          </div>
        </header>

        {/* 1. DASHBOARD GRÁFICO */}
        {activeSection === "dashboard" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Tarjetas Estadísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-brand-primary-dark/10 shadow-xs">
                <span className="text-[10px] uppercase font-bold tracking-wider text-brand-text-muted">
                  Total Productos
                </span>
                <h3 className="text-3xl font-extrabold text-foreground mt-2">{products.length}</h3>
                <span className="text-xs text-green-600 font-semibold mt-1 inline-block">en catálogo</span>
              </div>
              <div className="bg-white rounded-3xl p-6 border border-brand-primary-dark/10 shadow-xs">
                <span className="text-[10px] uppercase font-bold tracking-wider text-brand-text-muted">
                  Bajo Stock (≤ 3 unids)
                </span>
                <h3 className="text-3xl font-extrabold text-orange-500 mt-2">{lowStockCount}</h3>
                <span className="text-xs text-orange-600/80 font-semibold mt-1 inline-block">requieren atención</span>
              </div>
              <div className="bg-white rounded-3xl p-6 border border-brand-primary-dark/10 shadow-xs">
                <span className="text-[10px] uppercase font-bold tracking-wider text-brand-text-muted">
                  Valor de Inventario
                </span>
                <h3 className="text-3xl font-extrabold text-brand-primary-dark mt-2">
                  S/. {totalValue.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                </h3>
                <span className="text-xs text-brand-text-muted font-semibold mt-1 inline-block font-sans">estimado en tienda</span>
              </div>
            </div>

            {/* GRÁFICOS RECHARTS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-3xl border border-brand-primary-dark/10 shadow-xs flex flex-col">
                <h3 className="font-serif text-base font-bold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-brand-primary-dark" />
                  Productos por Categoría
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryChartData}>
                      <XAxis dataKey="name" stroke="#8D7B6B" fontSize={12} />
                      <YAxis stroke="#8D7B6B" fontSize={12} allowDecimals={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#FAF7F5', borderRadius: '12px', border: '1px solid #EBE5E0' }} 
                      />
                      <Bar dataKey="count" fill="#F4A7B9" radius={[8, 8, 0, 0]} name="Cantidad" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-brand-primary-dark/10 shadow-xs flex flex-col">
                <h3 className="font-serif text-base font-bold mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-brand-primary-dark" />
                  Estado del Inventario
                </h3>
                <div className="h-64 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stockChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        label
                      >
                        {stockChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. PRODUCTOS TABLE (CRUD) */}
        {activeSection === "products" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-brand-text-light">{products.length} productos registrados</span>
              <Button 
                onClick={handleOpenAddModal}
                className="bg-linear-to-r from-primary to-brand-primary-dark text-white rounded-full px-5 py-4 cursor-pointer font-semibold shadow-sm"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Agregar Producto
              </Button>
            </div>

            {loadingProducts ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-brand-primary-dark/10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary-dark mx-auto mb-3"></div>
                <p className="text-xs text-brand-text-light">Cargando productos de la base de datos...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-brand-primary-dark/10">
                <p className="text-sm text-brand-text-light mb-4">No hay productos en catálogo</p>
                <Button onClick={handleOpenAddModal} className="rounded-full bg-primary text-white">
                  Crea tu primer producto
                </Button>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-brand-primary-dark/10 overflow-hidden shadow-xs">
                <Table>
                  <TableHeader className="bg-stone-50 border-b border-brand-primary-dark/10">
                    <TableRow>
                      <TableHead className="w-12 text-center">Foto</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Categoría / Marca</TableHead>
                      <TableHead className="text-right">Precio</TableHead>
                      <TableHead className="text-center">Stock</TableHead>
                      <TableHead className="text-center">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((p) => (
                      <TableRow key={p.id} className="hover:bg-stone-50/50">
                        <TableCell className="text-center p-2">
                          <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center p-1 border border-stone-200 mx-auto overflow-hidden">
                            {p.image ? (
                              <img src={p.image} alt="" className="max-h-full max-w-full object-contain" />
                            ) : (
                              <ImageIcon className="w-4 h-4 text-stone-300" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold text-sm text-foreground">{p.name}</TableCell>
                        <TableCell className="text-xs font-semibold text-brand-primary-dark">
                          {p.categoryLabel} {p.brand && <span className="text-stone-400 font-normal">({p.brand})</span>}
                        </TableCell>
                        <TableCell className="text-right font-medium text-sm">
                          {p.discount > 0 ? (
                            <div className="flex flex-col text-right">
                              <span className="font-bold text-foreground">S/. {(p.price * (1 - p.discount / 100)).toFixed(2)}</span>
                              <span className="text-[10px] text-stone-400 line-through">S/. {p.price.toFixed(2)}</span>
                            </div>
                          ) : (
                            <span>S/. {p.price.toFixed(2)}</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                            p.stock === 0 
                              ? "bg-red-50 text-red-700 border border-red-100" 
                              : p.stock <= 3 
                                ? "bg-orange-50 text-orange-700 border border-orange-100" 
                                : "bg-green-50 text-green-700 border border-green-100"
                          }`}>
                            {p.stock}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex gap-2 justify-center">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleOpenEditModal(p)}
                              className="w-8 h-8 rounded-lg cursor-pointer text-stone-500 hover:text-brand-primary-dark hover:bg-stone-100"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDeleteProduct(p.id)}
                              className="w-8 h-8 rounded-lg cursor-pointer text-stone-300 hover:text-red-500 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}

        {/* 3. CONTROL DE STOCK */}
        {activeSection === "stock" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((p) => (
                <div 
                  key={p.id} 
                  className={`bg-white rounded-3xl p-5 border shadow-xs flex flex-col justify-between ${
                    p.stock === 0 
                      ? "border-red-200 bg-red-50/10" 
                      : p.stock <= 3 
                        ? "border-orange-200 bg-orange-50/10" 
                        : "border-brand-primary-dark/10"
                  }`}
                >
                  <div className="flex gap-3 mb-4">
                    <div className="w-12 h-12 bg-stone-50 border border-stone-200 rounded-xl p-2 shrink-0 flex items-center justify-center overflow-hidden">
                      {p.image ? (
                        <img src={p.image} alt="" className="max-h-full max-w-full object-contain" />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-stone-300" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold truncate text-foreground">{p.name}</h4>
                      <p className="text-[10px] text-brand-primary-dark font-bold uppercase tracking-wider">{p.categoryLabel}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-stone-100 pt-3">
                    <span className="text-xs text-stone-600 font-semibold">Stock Actual:</span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleQuickUpdateStock(p, p.stock - 1)}
                        disabled={p.stock <= 0}
                        className="w-8 h-8 rounded-full cursor-pointer disabled:opacity-40"
                      >
                        -
                      </Button>
                      <span className="w-8 text-center text-sm font-bold">{p.stock}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleQuickUpdateStock(p, p.stock + 1)}
                        className="w-8 h-8 rounded-full cursor-pointer"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. PEDIDOS Y CONFIGURACIÓN DE NÚMERO WHATSAPP */}
        {activeSection === "orders" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
            {/* Panel 1: Información de Pedidos */}
            <div className="bg-white rounded-3xl border border-brand-primary-dark/10 p-8 space-y-4 shadow-xs">
              <div className="w-12 h-12 bg-brand-primary-light rounded-2xl flex items-center justify-center text-brand-primary-dark">
                <ClipboardList className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-foreground">Pedidos Automáticos por WhatsApp</h3>
              <p className="text-sm text-brand-text-light leading-relaxed">
                Cuando tus clientes agregan sus productos al carrito e ingresan sus datos de envío, el sistema genera automáticamente la orden detallada y la envía directo a tu WhatsApp corporativo.
              </p>
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600">
                <span className="font-bold text-foreground block mb-1">📱 Número de Recepción Actual:</span>
                <span className="font-mono text-brand-primary-dark text-sm font-bold">
                  +{whatsappPhone || "51973468722"}
                </span>
              </div>
            </div>

            {/* Panel 2: Formulario para Cambiar Número de WhatsApp */}
            <div className="bg-white rounded-3xl border border-brand-primary-dark/10 p-8 space-y-5 shadow-xs">
              <h3 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
                <Settings className="w-5 h-5 text-brand-primary-dark" />
                Editar Número de Pedidos
              </h3>
              <p className="text-xs text-brand-text-light leading-relaxed">
                Si la dueña cambia de teléfono o chip, puedes actualizar el número aquí para que todos los nuevos pedidos del carrito se sigan recibiendo sin interrupciones.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                    Número de WhatsApp Corporativo (con código de país)
                  </label>
                  <Input 
                    type="text"
                    value={whatsappPhone}
                    onChange={(e) => setWhatsappPhone(e.target.value)}
                    placeholder="Ej. 51973468722"
                    className="bg-stone-50 border-stone-200 text-sm font-mono"
                  />
                  <small className="text-[10px] text-stone-400 mt-1 block">
                    Ejemplo para Perú: <strong>51973468722</strong> (Prefijo 51 seguido de los 9 dígitos).
                  </small>
                </div>

                <Button
                  onClick={handleSaveSettings}
                  className="w-full rounded-full bg-linear-to-r from-primary to-brand-primary-dark text-white font-semibold py-5 cursor-pointer shadow-xs"
                >
                  Guardar Nuevo Número de WhatsApp
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 5. CONFIGURACIÓN Y GESTIÓN SEPARADA DE CATEGORÍAS, MARCAS Y DELIVERY */}
        {activeSection === "settings" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
            {/* Panel 1: Categorías de Producto */}
            <div className="bg-white rounded-3xl border border-brand-primary-dark/10 p-6 space-y-5 flex flex-col justify-between shadow-xs">
              <div className="space-y-4">
                <h3 className="font-serif text-base font-bold text-foreground flex items-center gap-2">
                  <Tag className="w-4 h-4 text-brand-primary-dark" />
                  Categorías de Producto
                </h3>

                <form onSubmit={handleAddCategory} className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                      Nombre de la Categoría
                    </label>
                    <Input 
                      type="text" 
                      required
                      value={newCatLabel}
                      onChange={(e) => setNewCatLabel(e.target.value)}
                      placeholder="Ej. Limpiadores, Mascarillas"
                      className="bg-stone-50 border-stone-200 text-xs"
                    />
                  </div>

                  <Button type="submit" className="w-full rounded-full bg-linear-to-r from-primary to-brand-primary-dark text-white text-xs py-5 cursor-pointer shadow-xs font-semibold">
                    + Agregar Categoría
                  </Button>
                </form>
              </div>

              <div className="space-y-2 pt-4 border-t border-stone-100">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                  Categorías Registradas ({categoriesList.filter(c => c.type === "category").length})
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
                  {categoriesList.filter(c => c.type === "category").map((cat) => (
                    <div key={cat.id} className="flex items-center gap-1 px-3 py-1 bg-stone-50 border border-stone-200 rounded-full text-xs font-medium">
                      <span>{cat.label}</span>
                      <button 
                        type="button"
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="text-stone-400 hover:text-red-500 ml-1 font-bold cursor-pointer"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Panel 2: Marcas de Cosmética */}
            <div className="bg-white rounded-3xl border border-brand-primary-dark/10 p-6 space-y-5 flex flex-col justify-between shadow-xs">
              <div className="space-y-4">
                <h3 className="font-serif text-base font-bold text-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-primary-dark" />
                  Marcas de Cosmética
                </h3>

                <form onSubmit={handleAddBrand} className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                      Nombre de la Marca
                    </label>
                    <Input 
                      type="text" 
                      required
                      value={newBrandLabel}
                      onChange={(e) => setNewBrandLabel(e.target.value)}
                      placeholder="Ej. Tocobo, Mixsoon, Abib"
                      className="bg-stone-50 border-stone-200 text-xs"
                    />
                  </div>

                  <Button type="submit" className="w-full rounded-full bg-linear-to-r from-primary to-brand-primary-dark text-white text-xs py-5 cursor-pointer shadow-xs font-semibold">
                    + Agregar Marca
                  </Button>
                </form>
              </div>

              <div className="space-y-2 pt-4 border-t border-stone-100">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                  Marcas Registradas ({categoriesList.filter(c => c.type === "brand").length})
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
                  {categoriesList.filter(c => c.type === "brand").map((cat) => (
                    <div key={cat.id} className="flex items-center gap-1 px-3 py-1 bg-stone-50 border border-stone-200 rounded-full text-xs font-medium">
                      <span>{cat.label}</span>
                      <button 
                        type="button"
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="text-stone-400 hover:text-red-500 ml-1 font-bold cursor-pointer"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Panel 3: Tarifas de Delivery y Número de Pedidos */}
            <div className="bg-white rounded-3xl border border-brand-primary-dark/10 p-6 space-y-5 flex flex-col justify-between shadow-xs">
              <div className="space-y-4">
                <h3 className="font-serif text-base font-bold text-foreground flex items-center gap-2">
                  <Settings className="w-4 h-4 text-brand-primary-dark" />
                  Pedidos & Tarifas de Delivery
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                      Número de WhatsApp de Pedidos
                    </label>
                    <Input 
                      type="text"
                      value={whatsappPhone}
                      onChange={(e) => setWhatsappPhone(e.target.value)}
                      placeholder="51973468722"
                      className="bg-stone-50 border-stone-200 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                      Costo de Delivery Fijo (S/.)
                    </label>
                    <Input 
                      type="number"
                      value={deliveryFee}
                      min="0"
                      step="0.5"
                      onChange={(e) => setDeliveryFee(parseFloat(e.target.value) || 0)}
                      className="bg-stone-50 border-stone-200 text-xs"
                    />
                  </div>

                  <Button
                    type="button"
                    onClick={handleSaveSettings}
                    className="w-full rounded-full bg-linear-to-r from-primary to-brand-primary-dark text-white text-xs py-5 cursor-pointer shadow-xs font-semibold mt-2"
                  >
                    Guardar Configuración
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* DIALOG FORMULARIO AGREGAR/EDITAR PRODUCTO (100% URL LINK DE IMÁGENES) */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl bg-white border border-brand-primary-dark/15 rounded-3xl p-6 sm:p-8 overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg font-bold">
              {editingProduct ? "Editar Producto" : "Nuevo Producto"}
            </DialogTitle>
            <DialogDescription className="text-xs text-stone-500">
              Completa los datos del producto y pega los enlaces (URLs) de las fotos.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveProduct} className="space-y-4 mt-2">
            <div>
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                Nombre del Producto
              </label>
              <Input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ej. COSRX Aloe Soothing Sun Cream SPF50+"
                className="bg-stone-50 border-stone-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Categoría
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg text-sm p-2 outline-none"
                >
                  {categoriesList.filter(c => c.type === "category").map(c => (
                    <option key={c.id} value={c.name}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Marca de Cosmética (Opcional)
                </label>
                <select
                  value={formData.brand}
                  onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg text-sm p-2 outline-none"
                >
                  <option value="">-- Seleccionar Marca --</option>
                  {categoriesList.filter(c => c.type === "brand").map(c => (
                    <option key={c.id} value={c.label}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Precio (S/.)
                </label>
                <Input 
                  type="number" 
                  step="0.1"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="89.00"
                  className="bg-stone-50 border-stone-200"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Descuento (%)
                </label>
                <Input 
                  type="number" 
                  min="0"
                  max="100"
                  value={formData.discount}
                  onChange={(e) => setFormData(prev => ({ ...prev, discount: e.target.value }))}
                  placeholder="0"
                  className="bg-stone-50 border-stone-200"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Stock Disponible
                </label>
                <Input 
                  type="number" 
                  required
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                  placeholder="10"
                  className="bg-stone-50 border-stone-200"
                />
              </div>
            </div>

            {/* SECCIÓN DE IMÁGENES POR URL (SIN CARGA DESDE PC) */}
            <div className="border border-stone-200 rounded-2xl p-4 bg-stone-50/80 space-y-4">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5 border-b border-stone-200 pb-2">
                <ImageIcon className="w-4 h-4 text-brand-primary-dark" />
                Imágenes del Producto (URLs / Enlaces)
              </span>

              {/* 1. Imagen Principal (URL) */}
              <div>
                <label className="text-[10px] font-bold text-brand-primary-dark uppercase tracking-wider block mb-1">
                  URL de la Imagen Principal *
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <Input 
                    type="url"
                    required
                    value={formData.mainImage}
                    onChange={(e) => setFormData(prev => ({ ...prev, mainImage: e.target.value }))}
                    placeholder="https://ejemplo.com/foto-principal.jpg"
                    className="bg-white border-stone-200 pl-9 text-xs"
                  />
                </div>

                {/* Previsualización en vivo de la foto principal */}
                {formData.mainImage && (
                  <div className="mt-2 flex items-center gap-3 p-2 bg-white rounded-xl border border-stone-200">
                    <div className="w-12 h-12 rounded-lg bg-stone-50 p-1 border border-stone-100 flex items-center justify-center shrink-0 overflow-hidden">
                      <img src={formData.mainImage} alt="Preview" className="max-h-full max-w-full object-contain" />
                    </div>
                    <span className="text-[10px] text-green-700 font-semibold">✓ Imagen Principal detectada</span>
                  </div>
                )}
              </div>

              {/* 2. Fotos Secundarias / Galería (URLs) */}
              <div className="pt-2 border-t border-stone-200">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Añadir Fotos Secundarias para el Carrusel (Opcional)
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <Input 
                      type="url"
                      value={formData.extraImageUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, extraImageUrl: e.target.value }))}
                      placeholder="https://ejemplo.com/foto-secundaria.jpg"
                      className="bg-white border-stone-200 pl-9 text-xs"
                    />
                  </div>
                  <Button 
                    type="button" 
                    onClick={handleAddExtraImageUrl}
                    className="bg-brand-primary-dark text-white text-xs rounded-xl cursor-pointer shadow-xs shrink-0"
                  >
                    + Añadir a Galería
                  </Button>
                </div>

                {/* Lista de miniaturas secundarias */}
                {formData.imagesList.length > 0 && (
                  <div className="mt-3 space-y-1">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                      Fotos Secundarias Agregadas ({formData.imagesList.length}):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {formData.imagesList.map((url, idx) => (
                        <div key={idx} className="relative w-14 h-14 rounded-xl border border-stone-200 bg-white p-1 overflow-hidden group shadow-xs">
                          <img src={url} alt="" className="w-full h-full object-contain" />
                          <button
                            type="button"
                            onClick={() => handleRemoveImageIndex(idx)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] shadow-xs cursor-pointer hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Tipo de Entrega
                </label>
                <select
                  value={formData.delivery}
                  onChange={(e) => setFormData(prev => ({ ...prev, delivery: e.target.value as "inmediata" | "distribuidor" }))}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg text-sm p-2 outline-none"
                >
                  <option value="inmediata">⚡ Entrega Inmediata</option>
                  <option value="distribuidor">📅 Pedido a Distribuidor</option>
                </select>
              </div>

              {formData.delivery === "distribuidor" && (
                <div>
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                    Tiempo de Espera
                  </label>
                  <Input 
                    type="text" 
                    value={formData.shippingTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, shippingTime: e.target.value }))}
                    placeholder="Ej. 7-10 días hábiles"
                    className="bg-stone-50 border-stone-200"
                  />
                </div>
              )}
            </div>

            <DialogFooter className="pt-4 border-t border-stone-100 flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full flex-1 cursor-pointer"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={savingLoading}
                className="rounded-full flex-1 bg-linear-to-r from-primary to-brand-primary-dark text-white font-semibold cursor-pointer shadow-xs disabled:opacity-50"
              >
                {savingLoading ? "Guardando..." : "Guardar Producto"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
