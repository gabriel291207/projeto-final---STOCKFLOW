
import { useEffect, useState } from "react";
import { LogOut, UserRound } from "lucide-react";
import Auth from "./pages/Auth.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Products from "./pages/Products.jsx";
import ProductForm from "./pages/ProductForm.jsx";
import BottomNav from "./components/BottomNav.jsx";
import TopBar from "./components/TopBar.jsx";
import { api } from "./api.js";

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("stockflow_user"));
    } catch {
      return null;
    }
  });

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState("dashboard");
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");

  function notify(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  async function refresh() {
    try {
      setProducts(await api.list());
    } catch (e) {
      setProducts([]);
      notify("Não foi possível carregar os produtos.");
      console.error(e);
    }
  }

  useEffect(() => {
    if (user) refresh();
  }, [user]);

  function login(u) {
    sessionStorage.setItem("stockflow_user", JSON.stringify(u));
    setUser(u);
  }

  function logout() {
    sessionStorage.removeItem("stockflow_user");
    setUser(null);
    setPage("dashboard");
  }

  const go = (p) => {
    setPage(p);
    setEditing(null);
  };

  async function saveProduct(record) {
    setBusy(true);

    try {
      if (editing) {
        const id = editing.id ?? editing._id;

        if (id == null) {
          throw new Error("O produto não possui id/_id para edição.");
        }

        await api.update(id, record);
        notify("Produto atualizado com sucesso!");
      } else {
        await api.create(record);
        notify("Produto cadastrado com sucesso!");
      }

      setEditing(null);
      setPage("products");
      await refresh();
    } catch (e) {
      alert(`Não foi possível salvar: ${e.message}`);
    } finally {
      setBusy(false);
    }
  }

  async function deleteProduct(p) {
    if (!window.confirm(`Deseja realmente excluir "${p.name || p.nome}"?`)) {
      return;
    }

    try {
      const id = p.id ?? p._id;

      if (id == null) {
        throw new Error("O registro não possui id/_id.");
      }

      await api.remove(id);
      notify("Produto excluído com sucesso!");
      await refresh();
    } catch (e) {
      alert(`Não foi possível excluir: ${e.message}`);
    }
  }

  if (!user) return <Auth onLogin={login} />;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          STOCK<span>FLOW</span>
        </div>

        <div className="side-caption">MENU PRINCIPAL</div>

        <button
          className={page === "dashboard" ? "nav-active" : "nav-item"}
          onClick={() => go("dashboard")}
        >
          ⌂　Início
        </button>

        <button
          className={["products", "form"].includes(page) ? "nav-active" : "nav-item"}
          onClick={() => go("products")}
        >
          ▦　Produtos
        </button>

        <button
          className="nav-item"
          onClick={() => notify("O histórico será habilitado na próxima etapa.")}
        >
          ⇄　Movimentação
        </button>

        <button
          className="nav-item"
          onClick={() => notify("Estatísticas disponíveis após integrar os dados.")}
        >
          ▥　Estatísticas
        </button>

        <div className="side-bottom">
          <button className="nav-item" onClick={() => go("profile")}>
            <UserRound size={16} />　Perfil
          </button>

          <button className="nav-item" onClick={logout}>
            <LogOut size={16} />　Sair
          </button>
        </div>
      </aside>

      <div className="main-area">
        <TopBar user={user} />

        <main className="content">
          {page === "dashboard" && (
            <Dashboard products={products} onNew={() => go("form")} />
          )}

          {page === "products" && (
            <Products
              products={products}
              onNew={() => go("form")}
              onEdit={(p) => {
                setEditing(p);
                setPage("form");
              }}
              onDelete={deleteProduct}
            />
          )}

          {page === "form" && (
            <ProductForm
              product={editing}
              busy={busy}
              onSave={saveProduct}
              onCancel={() => go("products")}
            />
          )}

          {page === "profile" && (
            <section className="profile-card">
              <div className="avatar">●</div>
              <h2>Perfil</h2>
              <p>{user.name}</p>
              <p className="muted">{user.email}</p>
              <button className="secondary" onClick={logout}>
                Sair da conta
              </button>
            </section>
          )}

          {["movements", "stats"].includes(page) && (
            <section className="panel">
              <h2>
                {page === "movements" ? "Movimentação" : "Estatísticas"}
              </h2>
              <p className="muted">
                Área reservada para evolução do StockFlow. O CRUD principal já está nesta etapa.
              </p>
            </section>
          )}
        </main>

        <BottomNav
          page={page === "form" ? "products" : page}
          onNavigate={go}
        />
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
