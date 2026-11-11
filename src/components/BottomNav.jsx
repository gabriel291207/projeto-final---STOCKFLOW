import { Home, Package, ArrowLeftRight, ChartNoAxesColumn, UserRound } from "lucide-react";
const items = [
  ["dashboard","Início",Home],["products","Produtos",Package],["movements","Movimentação",ArrowLeftRight],["stats","Estatísticas",ChartNoAxesColumn],["profile","Perfil",UserRound]
];
export default function BottomNav({page,onNavigate}) {
  return <nav className="bottom-nav">{items.map(([id,label,Icon])=><button key={id} className={page===id?"selected":""} onClick={()=>onNavigate(id)}><Icon size={18}/><span>{label}</span></button>)}</nav>;
}