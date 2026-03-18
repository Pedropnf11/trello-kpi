// Página de Gráficos removida a pedido do utilizador.
// Redireciona para o dashboard do manager.
export { default } from 'next/navigation';

import { redirect } from 'next/navigation';
export default function ChartsRedirect() {
    redirect('/dashboard/manager');
}
