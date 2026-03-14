// Esta página foi removida do produto.
// Analytics foi eliminado — não existe link de navegação para aqui.
// Redireciona para o dashboard principal.
import { redirect } from 'next/navigation';
export default function AnalyticsRedirect() {
    redirect('/dashboard/sales');
}
