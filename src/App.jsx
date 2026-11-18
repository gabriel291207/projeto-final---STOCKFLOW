
import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard, Package, ArrowLeftRight, ChartNoAxesColumn,
  UserRound, LogOut, Plus, Menu, X, Bell, Search, Pencil, Trash2,
  TrendingUp, TrendingDown, Boxes, AlertTriangle, DollarSign, CircleUserRound,
  ClipboardList, CheckCircle2, XCircle, Eye, EyeOff, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import { store } from "./api.js";

const money = value => Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const dateTime = value => new Date(value).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

function Auth({ onLogin }) {
  const [register, setRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  function submit(e) {
    e.preventDefault(); setError("");
    if (!email.trim() || !password.trim() || (register && !name.trim())) return setError("Preencha todos os campos.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Informe um e-mail válido.");
    if (password.length < 6) return setError("A senha deve ter pelo menos 6 caracteres.");
    onLogin({ name: register ? name.trim() : (name.trim() || email.split("@")[0]), email: email.trim() });
  }
  return <main className="auth-screen"><form className="auth-card" onSubmit={submit}>
    <div className="brand brand-auth">STOCK<span>FLOW</span></div>
    <div className="auth-mark"><Package size={25}/></div>
    <h1>{register ? "Crie sua conta" : "Bem-vindo de volta"}</h1>
    <p>Controle seu estoque de forma simples e inteligente.</p>
    {register && <label>Nome completo<input value={name} onChange={e=>setName(e.target.value)} placeholder="Seu nome completo" autoComplete="name"/></label>}
    <label>E-mail<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="seu@email.com" autoComplete="email"/></label>
    <label>Senha<div className="password-wrap"><input type={show?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Mínimo de 6 caracteres" autoComplete={register?"new-password":"current-password"}/><button type="button" className="password-toggle" onClick={()=>setShow(!show)} aria-label="Mostrar senha">{show?<EyeOff size={17}/>:<Eye size={17}/>}</button></div></label>
    {error && <div className="inline-error">{error}</div>}
    <button className="primary wide">{register?"Criar conta":"Entrar no StockFlow"}</button>
    <div className="auth-switch">{register?"Já possui uma conta?":"Ainda não tem conta?"} <button type="button" className="text-button" onClick={()=>{setRegister(!register);setError("")}}>{register?"Entrar":"Cadastre-se"}</button></div>
    <small className="auth-foot">Seus dados desta demonstração ficam salvos neste dispositivo.</small>
  </form></main>;
}

function Sidebar({ page, navigate, logout, mobileOpen, setMobileOpen }) {
  const items = [
    ["dashboard","Visão geral",LayoutDashboard],["products","Produtos",Package],
    ["movements","Movimentações",ArrowLeftRight],["stats","Estatísticas",ChartNoAxesColumn]
  ];
  return <>
    {mobileOpen && <button className="mobile-scrim" onClick={()=>setMobileOpen(false)} aria-label="Fechar menu"/>}
    <aside className={`sidebar ${mobileOpen?"sidebar-open":""}`}>
      <div className="sidebar-brand"><div className="brand-mark"><Boxes size={20}/></div><div className="brand">STOCK<span>FLOW</span><small>GESTÃO DE ESTOQUE</small></div><button className="close-menu" onClick={()=>setMobileOpen(false)}><X/></button></div>
      <div className="side-caption">MENU PRINCIPAL</div>
      <nav className="side-nav">{items.map(([id,label,Icon])=><button key={id} className={page===id || (page==="form"&&id==="products")?"nav-active":"nav-item"} onClick={()=>{navigate(id);setMobileOpen(false)}}><Icon size={18}/><span>{label}</span></button>)}</nav>
      <div className="sidebar-bottom">
        <button className={page==="profile"?"nav-active":"nav-item"} onClick={()=>{navigate("profile");setMobileOpen(false)}}><UserRound size={18}/><span>Meu perfil</span></button>
        <button className="nav-item logout-link" onClick={logout}><LogOut size={18}/><span>Sair da conta</span></button>
        <div className="sidebar-version">STOCKFLOW • CONTROLE INTELIGENTE</div>
      </div>
    </aside>
  </>;
}

function TopBar({ user, onMenu }) {
  return <header className="topbar"><button className="menu-toggle" onClick={onMenu}><Menu/></button><div className="topbar-heading"><b>PAINEL DE CONTROLE</b><small>Bem-vindo ao seu espaço de gestão</small></div><div className="top-actions"><span className="top-user-name">{user?.name}</span><div className="top-avatar"><CircleUserRound size={21}/></div></div></header>;
}

function PageHeading({ eyebrow="STOCKFLOW", title, description, action }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action}</div>;
}
function StatCard({ icon:Icon, label, value, hint, tone="blue" }) {
  return <article className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={20}/></div><div className="stat-label">{label}</div><strong>{value}</strong>{hint&&<small>{hint}</small>}</article>;
}
function Dashboard({ products, movements, onNew, onNavigate }) {
  const totalUnits=products.reduce((s,p)=>s+Number(p.quantity||0),0);
  const low=products.filter(p=>Number(p.quantity)<=Number(p.min)).length;
  const totalValue=products.reduce((s,p)=>s+Number(p.price)*Number(p.quantity),0);
  const recent=movements.slice(0,5);
  return <><PageHeading title="Visão geral" description="Acompanhe os principais indicadores do seu estoque." action={<button className="primary" onClick={onNew}><Plus size={17}/> Novo produto</button>}/>
    <section className="stats-grid">
      <StatCard icon={Package} label="Produtos cadastrados" value={products.length} hint="Itens diferentes" tone="blue"/>
      <StatCard icon={Boxes} label="Unidades em estoque" value={totalUnits.toLocaleString("pt-BR")} hint="Quantidade total" tone="violet"/>
      <StatCard icon={AlertTriangle} label="Estoque baixo" value={low} hint="No mínimo ou abaixo" tone="orange"/>
      <StatCard icon={DollarSign} label="Valor em estoque" value={money(totalValue)} hint="Custo estimado total" tone="green"/>
    </section>
    <div className="dashboard-grid"><section className="panel"><div className="panel-heading"><div><h2>Produtos recentes</h2><p>Últimos itens adicionados ao estoque</p></div><button className="link-button" onClick={()=>onNavigate("products")}>Ver todos <ArrowUpRight size={15}/></button></div>
      {products.length===0?<Empty icon={Package} title="Seu estoque está vazio" text="Cadastre seu primeiro produto para começar." action={<button className="primary" onClick={onNew}><Plus size={16}/> Cadastrar produto</button>}/>:<div className="recent-list">{products.slice(0,5).map(p=><div className="recent-row" key={p.id}><div className="product-symbol"><Package size={18}/></div><div className="recent-info"><b>{p.name}</b><small>{p.category}</small></div><div className="recent-quantity"><b>{p.quantity} un.</b><small>{money(p.price)} / un.</small></div><span className={`status ${Number(p.quantity)<=Number(p.min)?"status-low":""}`}>{Number(p.quantity)<=Number(p.min)?"Estoque baixo":"Disponível"}</span></div>)}</div>}
    </section><section className="panel"><div className="panel-heading"><div><h2>Últimas movimentações</h2><p>Entradas e saídas recentes</p></div><button className="link-button" onClick={()=>onNavigate("movements")}>Histórico <ArrowUpRight size={15}/></button></div>
      {recent.length===0?<Empty icon={ArrowLeftRight} title="Sem movimentações" text="As entradas e saídas registradas aparecerão aqui."/>:<div className="mini-movements">{recent.map(m=><div className="mini-movement" key={m.id}><span className={`movement-icon ${m.type}`} >{m.type==="entrada"?<ArrowDownRight size={17}/>:<ArrowUpRight size={17}/>}</span><div><b>{m.productName}</b><small>{dateTime(m.date)}</small></div><strong className={m.type}>{m.type==="entrada"?"+":"−"}{m.quantity}</strong></div>)}</div>}
    </section></div>
  </>;
}
function Empty({icon:Icon,title,text,action}) { return <div className="empty-state"><div className="empty-icon"><Icon size={24}/></div><b>{title}</b><p>{text}</p>{action}</div>; }

function Products({ products, onNew, onEdit, onDelete }) {
  const [search,setSearch]=useState(""); const [category,setCategory]=useState("Todas"); const [status,setStatus]=useState("Todos");
  const categories=["Todas",...new Set(products.map(p=>p.category).filter(Boolean))];
  const filtered=useMemo(()=>products.filter(p=>{
    const term=search.toLocaleLowerCase("pt-BR");
    const matches=`${p.name} ${p.category} ${p.description||""}`.toLocaleLowerCase("pt-BR").includes(term);
    const categoryOk=category==="Todas"||p.category===category;
    const low=Number(p.quantity)<=Number(p.min);
    const statusOk=status==="Todos"||(status==="Estoque baixo"&&low)||(status==="Disponível"&&!low);
    return matches&&categoryOk&&statusOk;
  }),[products,search,category,status]);
  return <><PageHeading title="Produtos" description="Cadastre, consulte, edite e organize os produtos." action={<button className="primary" onClick={onNew}><Plus size={17}/> Novo produto</button>}/>
    <section className="panel"><div className="toolbar"><div className="searchbox"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar por nome, categoria..."/></div><select value={category} onChange={e=>setCategory(e.target.value)}><option value="Todas">Todas as categorias</option>{categories.slice(1).map(c=><option key={c}>{c}</option>)}</select><select value={status} onChange={e=>setStatus(e.target.value)}><option>Todos</option><option>Disponível</option><option>Estoque baixo</option></select></div>
      <div className="table-summary"><b>{filtered.length} {filtered.length===1?"produto encontrado":"produtos encontrados"}</b><span>{products.length} cadastrados no total</span></div>
      {filtered.length===0?<Empty icon={Package} title="Nenhum produto encontrado" text={products.length?"Tente alterar os filtros da pesquisa.":"Cadastre seu primeiro produto para começar."} action={products.length?null:<button className="primary" onClick={onNew}><Plus size={16}/> Novo produto</button>}/>:<div className="table-wrap"><table><thead><tr><th>PRODUTO</th><th>CATEGORIA</th><th>QUANTIDADE</th><th>PREÇO UNITÁRIO</th><th>VALOR TOTAL</th><th>STATUS</th><th>AÇÕES</th></tr></thead><tbody>{filtered.map(p=>{const low=Number(p.quantity)<=Number(p.min);return <tr key={p.id}><td><div className="table-product"><div className="product-symbol"><Package size={17}/></div><div><b>{p.name}</b><small>{p.description||"Sem descrição"}</small></div></div></td><td>{p.category}</td><td><b>{p.quantity}</b> un.</td><td>{money(p.price)}</td><td>{money(Number(p.price)*Number(p.quantity))}</td><td><span className={`status ${low?"status-low":""}`}>{low?"Estoque baixo":"Disponível"}</span></td><td><div className="row-actions"><button className="icon-btn" title="Editar" onClick={()=>onEdit(p)}><Pencil size={16}/></button><button className="icon-btn danger" title="Excluir" onClick={()=>onDelete(p)}><Trash2 size={16}/></button></div></td></tr>})}</tbody></table></div>}
    </section></>;
}

function ProductForm({ product, onSave, onCancel, busy }) {
  const [form,setForm]=useState({name:"",category:"",description:"",quantity:"",min:"",price:""});
  const [error,setError]=useState("");
  useEffect(()=>{setForm(product?{name:product.name,category:product.category,description:product.description||"",quantity:String(product.quantity),min:String(product.min),price:String(product.price)}:{name:"",category:"",description:"",quantity:"",min:"",price:""});setError("")},[product]);
  function change(e){setForm({...form,[e.target.name]:e.target.value})}
  function submit(e){e.preventDefault();setError("");if(!form.name.trim()||!form.category.trim()||form.quantity===""||form.min===""||form.price==="")return setError("Preencha todos os campos obrigatórios.");if(!Number.isInteger(Number(form.quantity))||!Number.isInteger(Number(form.min))||Number(form.quantity)<0||Number(form.min)<0)return setError("Quantidade e estoque mínimo devem ser números inteiros não negativos.");if(!Number.isFinite(Number(form.price))||Number(form.price)<0)return setError("Informe um preço válido.");onSave({...form,name:form.name.trim(),category:form.category.trim(),description:form.description.trim(),quantity:Number(form.quantity),min:Number(form.min),price:Number(form.price)});}
  return <><PageHeading title={product?"Editar produto":"Novo produto"} description={product?"Atualize as informações do produto selecionado.":"Preencha os dados para adicionar um item ao estoque."}/><form className="form-panel" onSubmit={submit}><div className="form-section-title"><div className="form-section-icon"><Package size={18}/></div><div><b>Informações do produto</b><small>Os campos marcados com * são obrigatórios.</small></div></div><div className="form-grid"><label>Nome do produto *<input name="name" value={form.name} onChange={change} placeholder="Ex.: Mouse sem fio" maxLength="80" required/></label><label>Categoria *<input name="category" value={form.category} onChange={change} placeholder="Ex.: Periféricos" maxLength="50" required/></label><label>Quantidade em estoque *<input type="number" min="0" step="1" name="quantity" value={form.quantity} onChange={change} placeholder="0" required/></label><label>Estoque mínimo *<input type="number" min="0" step="1" name="min" value={form.min} onChange={change} placeholder="5" required/></label><label>Preço unitário (R$) *<input type="number" min="0" step="0.01" name="price" value={form.price} onChange={change} placeholder="0,00" required/></label><label className="full-field">Descrição (opcional)<textarea name="description" rows="3" value={form.description} onChange={change} placeholder="Detalhes ou observações sobre o produto..."/></label></div>{error&&<div className="inline-error">{error}</div>}<div className="form-buttons"><button type="button" className="secondary" onClick={onCancel}>Cancelar</button><button className="primary" disabled={busy}>{busy?"Salvando...":product?"Salvar alterações":"Cadastrar produto"}</button></div></form></>;
}

function Movements({ products, movements, onMove }) {
  const [form,setForm]=useState({productId:"",type:"entrada",quantity:"",note:""});
  const [error,setError]=useState("");
  function submit(e){e.preventDefault();setError("");try{onMove({...form,quantity:Number(form.quantity)});setForm({...form,quantity:"",note:""});}catch(err){setError(err.message);}}
  return <><PageHeading title="Movimentações" description="Registre entradas e saídas e acompanhe o histórico do estoque."/>
    <div className="movement-layout"><form className="form-panel movement-form" onSubmit={submit}><div className="form-section-title"><div className="form-section-icon"><ArrowLeftRight size={18}/></div><div><b>Nova movimentação</b><small>O saldo do produto será atualizado automaticamente.</small></div></div><label>Produto<select required value={form.productId} onChange={e=>setForm({...form,productId:e.target.value})}><option value="">Selecione um produto</option>{products.map(p=><option key={p.id} value={p.id}>{p.name} — {p.quantity} un.</option>)}</select></label><label>Tipo de movimentação<select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option value="entrada">Entrada de estoque</option><option value="saida">Saída de estoque</option></select></label><label>Quantidade<input type="number" min="1" step="1" required value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})} placeholder="Informe a quantidade"/></label><label>Observação (opcional)<textarea rows="2" value={form.note} onChange={e=>setForm({...form,note:e.target.value})} placeholder="Ex.: Compra de fornecedor, venda..."/></label>{error&&<div className="inline-error">{error}</div>}<button className="primary wide" disabled={!products.length}><Plus size={16}/> Registrar movimentação</button>{!products.length&&<small className="muted">Cadastre um produto antes de registrar movimentações.</small>}</form>
      <section className="panel"><div className="panel-heading"><div><h2>Histórico</h2><p>Movimentações registradas recentemente</p></div><span className="count-pill">{movements.length}</span></div>{movements.length===0?<Empty icon={ClipboardList} title="Nenhum registro ainda" text="Quando você registrar uma entrada ou saída, ela aparecerá aqui."/>:<div className="history-list">{movements.map(m=><div className="history-row" key={m.id}><span className={`movement-icon ${m.type}`}>{m.type==="entrada"?<ArrowDownRight/>:<ArrowUpRight/>}</span><div className="history-info"><b>{m.productName}</b><small>{m.type==="entrada"?"Entrada":"Saída"} • {dateTime(m.date)}{m.note?` • ${m.note}`:""}</small></div><div className="history-amount"><b className={m.type}>{m.type==="entrada"?"+":"−"}{m.quantity} un.</b><small>Saldo: {m.balance}</small></div></div>)}</div>}</section>
    </div>
  </>;
}

function Statistics({ products, movements }) {
  const total=products.reduce((s,p)=>s+Number(p.quantity),0);
  const value=products.reduce((s,p)=>s+Number(p.quantity)*Number(p.price),0);
  const low=products.filter(p=>Number(p.quantity)<=Number(p.min));
  const entries=movements.filter(m=>m.type==="entrada").reduce((s,m)=>s+m.quantity,0);
  const exits=movements.filter(m=>m.type==="saida").reduce((s,m)=>s+m.quantity,0);
  const max=Math.max(1,...products.map(p=>Number(p.quantity)));
  return <><PageHeading title="Estatísticas" description="Indicadores e visão detalhada da situação do seu estoque."/><section className="stats-grid"><StatCard icon={Package} label="Tipos de produtos" value={products.length} tone="blue"/><StatCard icon={Boxes} label="Unidades disponíveis" value={total} tone="violet"/><StatCard icon={TrendingUp} label="Unidades que entraram" value={entries} tone="green"/><StatCard icon={TrendingDown} label="Unidades que saíram" value={exits} tone="orange"/></section><div className="dashboard-grid"><section className="panel"><div className="panel-heading"><div><h2>Quantidade por produto</h2><p>Comparativo do saldo atual</p></div></div>{products.length===0?<Empty icon={ChartNoAxesColumn} title="Sem dados para exibir" text="Cadastre produtos para gerar estatísticas."/>:<div className="bars-list">{products.slice().sort((a,b)=>b.quantity-a.quantity).map(p=><div className="bar-item" key={p.id}><div><b>{p.name}</b><span>{p.quantity} un.</span></div><div className="bar-track"><div className="bar-fill" style={{width:`${Math.max(2,Number(p.quantity)/max*100)}%`}}/></div></div>)}</div>}</section><section className="panel"><div className="panel-heading"><div><h2>Resumo financeiro</h2><p>Estimativa baseada no preço cadastrado</p></div></div><div className="financial-total">{money(value)}</div><small className="muted">Valor total estimado do estoque</small><div className="stat-detail"><span>Produtos com estoque baixo</span><b className="text-orange">{low.length}</b></div><div className="stat-detail"><span>Produtos disponíveis</span><b>{products.length-low.length}</b></div><div className="stat-detail"><span>Total de movimentações</span><b>{movements.length}</b></div></section></div>{low.length>0&&<section className="panel low-panel"><div className="panel-heading"><div><h2><AlertTriangle size={17}/> Atenção ao estoque</h2><p>Produtos que atingiram o estoque mínimo ou estão abaixo dele.</p></div></div><div className="low-items">{low.map(p=><div key={p.id}><b>{p.name}</b><span>{p.quantity} em estoque • mínimo {p.min}</span></div>)}</div></section>}</>;
}

function Profile({user,onLogout}) {
  return <><PageHeading title="Meu perfil" description="Informações da conta utilizada nesta demonstração."/><section className="profile-card"><div className="profile-avatar"><UserRound size={34}/></div><h2>{user.name}</h2><p>{user.email}</p><div className="profile-note"><CheckCircle2 size={17}/> Sessão ativa neste dispositivo</div><button className="secondary" onClick={onLogout}><LogOut size={16}/> Sair da conta</button><small>Os dados de produtos e movimentações permanecem salvos neste navegador.</small></section></>;
}

export default function App() {
  const [user,setUser]=useState(()=>store.getUser());
  const [products,setProducts]=useState(()=>store.getProducts());
  const [movements,setMovements]=useState(()=>store.getMovements());
  const [page,setPage]=useState("dashboard");
  const [editing,setEditing]=useState(null);
  const [busy,setBusy]=useState(false);
  const [toast,setToast]=useState("");
  const [mobileOpen,setMobileOpen]=useState(false);
  useEffect(()=>{if(!toast)return;const id=setTimeout(()=>setToast(""),3200);return()=>clearTimeout(id)},[toast]);
  function refresh(){setProducts(store.getProducts());setMovements(store.getMovements())}
  function notify(message,type="success"){setToast({message,type});}
  function login(data){store.setUser(data);setUser(data);notify("Bem-vindo ao StockFlow!")}
  function logout(){store.clearUser();setUser(null);setPage("dashboard");}
  function navigate(next){setPage(next);setEditing(null);setMobileOpen(false)}
  function saveProduct(data){
    setBusy(true);
    try{if(editing){store.updateProduct(editing.id,data);notify("Produto atualizado com sucesso!")}else{store.createProduct(data);notify("Produto cadastrado com sucesso!")}refresh();setEditing(null);setPage("products");}
    catch(e){notify(e.message,"error")}finally{setBusy(false)}
  }
  function deleteProduct(product){
    if(!window.confirm(`Deseja realmente excluir o produto "${product.name}"?`))return;
    try{store.deleteProduct(product.id);refresh();notify("Produto excluído com sucesso!")}catch(e){notify(e.message,"error")}
  }
  function moveStock(data){
    store.moveStock(data);refresh();notify(data.type==="entrada"?"Entrada registrada com sucesso!":"Saída registrada com sucesso!");
  }
  if(!user)return <Auth onLogin={login}/>;
  return <div className="app-shell"><Sidebar page={page} navigate={navigate} logout={logout} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}/><div className="main-area"><TopBar user={user} onMenu={()=>setMobileOpen(true)}/><main className="content">
    {page==="dashboard"&&<Dashboard products={products} movements={movements} onNew={()=>navigate("form")} onNavigate={navigate}/>}
    {page==="products"&&<Products products={products} onNew={()=>navigate("form")} onEdit={p=>{setEditing(p);setPage("form")}} onDelete={deleteProduct}/>}
    {page==="form"&&<ProductForm product={editing} onSave={saveProduct} onCancel={()=>navigate("products")} busy={busy}/>}
    {page==="movements"&&<Movements products={products} movements={movements} onMove={moveStock}/>}
    {page==="stats"&&<Statistics products={products} movements={movements}/>}
    {page==="profile"&&<Profile user={user} onLogout={logout}/>}
  </main><footer className="footer">© {new Date().getFullYear()} StockFlow • Gestão inteligente de estoque</footer></div>
    {toast&&<div className={`toast ${toast.type==="error"?"toast-error":""}`}><span>{toast.type==="error"?<XCircle size={18}/>:<CheckCircle2 size={18}/>}</span>{toast.message}</div>}
  </div>;
}
