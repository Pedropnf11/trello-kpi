// Função melhorada de exportação PDF com paginação controlada
async function exportarPDFMelhorado(returnBase64 = false) {
    const appElement = document.getElementById('app');
    const container = appElement.querySelector('.space-y-6');

    if (!container) {
        alert('Erro: Container principal não encontrado.');
        return;
    }

    // Mostrar mensagem de loading
    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'fixed top-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-pulse';
    loadingMsg.innerHTML = '<span class="font-bold">📄 Gerando PDF...</span><br><span class="text-xs">Organizando páginas...</span>';
    loadingMsg.id = 'pdf-loading';
    document.body.appendChild(loadingMsg);

    let tempTitle = null;
    let originalStyles = new Map(); // Para guardar visibilidade original

    try {
        // Identificar elementos
        const children = Array.from(container.children);
        // Espera-se: 0:Header, 1:Tempo, 2:Atividade, 3:DUEs, 4:TableSemana, 5:TableGeral

        // Salvar estados originais
        children.forEach((child, index) => {
            originalStyles.set(index, child.style.display);
        });

        // Adicionar título temporário
        tempTitle = document.createElement('div');
        tempTitle.className = 'bg-gradient-to-r from-gray-900 to-gray-700 text-white p-8 rounded-2xl mb-8 shadow-xl';
        tempTitle.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-4xl font-bold mb-2">Dashboard KPI - Trello</h1>
                    <p class="text-gray-300 text-lg">Relatório de Performance</p>
                </div>
                <div class="text-right">
                    <p class="text-sm text-gray-300">Data do Relatório</p>
                    <p class="text-xl font-bold">${new Date().toLocaleDateString('pt-PT')}</p>
                </div>
            </div>
        `;
        // Inserir antes do container principal
        appElement.insertBefore(tempTitle, container);

        // Prepara jsPDF
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
            compress: true
        });

        const pageWidth = 210;
        const pageHeight = 297;
        const margin = 10;
        const contentWidth = pageWidth - (2 * margin);

        // --- CAPTURA DA PÁGINA 1 ---
        loadingMsg.innerHTML = '<span class="font-bold">📄 Gerando PDF...</span><br><span class="text-xs">Capturando Página 1 (KPIs)...</span>';

        // Configurar visibilidade para Página 1
        // Esconder Header original (0) e Tabelas (4, 5 e sucessores se houver)
        // Mostrar Título Temp, e Indices 1, 2, 3
        tempTitle.style.display = 'block';
        children.forEach((child, index) => {
            if (index === 0 || index >= 4) {
                child.style.display = 'none';
            } else {
                child.style.display = 'block'; // Garante visibilidade
            }
        });

        await new Promise(resolve => setTimeout(resolve, 800)); // Delay para layout

        const canvas1 = await html2canvas(appElement, {
            scale: 2, // Ligeiramente menor que 2.5 para performance, mas ainda HD
            backgroundColor: '#ffffff',
            useCORS: true,
            logging: false
        });

        const imgData1 = canvas1.toDataURL('image/png', 1.0);
        const imgHeight1 = (canvas1.height * contentWidth) / canvas1.width;

        // Adicionar Página 1 ao PDF
        pdf.addImage(imgData1, 'PNG', margin, margin, contentWidth, imgHeight1, undefined, 'FAST');


        // --- CAPTURA DA PÁGINA 2 ---
        loadingMsg.innerHTML = '<span class="font-bold">📄 Gerando PDF...</span><br><span class="text-xs">Capturando Página 2 (Tabelas)...</span>';

        // Configurar visibilidade para Página 2
        // Esconder Título Temp e Indices 0, 1, 2, 3
        // Mostrar Tabelas (Indices >= 4)
        tempTitle.style.display = 'none';
        children.forEach((child, index) => {
            if (index < 4) {
                child.style.display = 'none';
            } else {
                child.style.display = 'block';
            }
        });

        // Adicionar uma margem top pequena no container para não colar no topo
        container.style.marginTop = '20px';

        await new Promise(resolve => setTimeout(resolve, 800));

        const canvas2 = await html2canvas(appElement, {
            scale: 2,
            backgroundColor: '#ffffff',
            useCORS: true,
            logging: false
        });

        const imgData2 = canvas2.toDataURL('image/png', 1.0);
        const imgHeight2 = (canvas2.height * contentWidth) / canvas2.width;

        // Adicionar Página 2 ao PDF
        pdf.addPage();
        pdf.addImage(imgData2, 'PNG', margin, margin, contentWidth, imgHeight2, undefined, 'FAST');


        // --- FINALIZAÇÃO ---

        // Restaurar estilos originais
        container.style.marginTop = '';
        children.forEach((child, index) => {
            child.style.display = originalStyles.get(index);
        });
        if (appElement.contains(tempTitle)) {
            appElement.removeChild(tempTitle);
        }

        // Rodapé
        const totalPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            pdf.setPage(i);
            pdf.setFontSize(8);
            pdf.setTextColor(150);
            pdf.text(`Página ${i} de ${totalPages}`, pageWidth / 2, pageHeight - 5, { align: 'center' });
            pdf.text('Dashboard KPI', margin, pageHeight - 5);
            pdf.text(new Date().toLocaleDateString('pt-PT'), pageWidth - margin, pageHeight - 5, { align: 'right' });
        }

        if (returnBase64) {
            // Se for para retornar base64 (webhook), não salva o arquivo
            loadingMsg.innerHTML = '<span class="font-bold">✅ PDF gerado! Enviando...</span>';
            setTimeout(() => { if (loadingMsg.parentNode) loadingMsg.parentNode.removeChild(loadingMsg); }, 1000);

            // Retorna o Data URI
            return pdf.output('datauristring');
        } else {
            // Salvar PDF normalmente
            const dataAtual = new Date().toISOString().split('T')[0];
            const horaAtual = new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
            pdf.save(`Dashboard_KPI_${dataAtual}_${horaAtual}.pdf`);

            loadingMsg.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50';
            loadingMsg.innerHTML = '<span class="font-bold">✅ PDF gerado com sucesso!</span>';
            setTimeout(() => { if (loadingMsg.parentNode) loadingMsg.parentNode.removeChild(loadingMsg); }, 2000);
        }

    } catch (error) {
        console.error('Erro detalhado ao gerar PDF:', error);

        // Recuperação de falha
        if (container) {
            container.style.marginTop = '';
            children.forEach((child, index) => {
                child.style.display = originalStyles.get(index);
            });
        }
        if (tempTitle && appElement.contains(tempTitle)) {
            appElement.removeChild(tempTitle);
        }

        if (loadingMsg) {
            loadingMsg.className = 'fixed top-4 right-4 bg-red-600 text-white px-6 py-3 rounded-xl shadow-lg z-50';
            loadingMsg.innerHTML = `<span class="font-bold">❌ Erro ao gerar PDF</span><br><span class="text-xs">${error.message}</span>`;
            setTimeout(() => { if (loadingMsg.parentNode) loadingMsg.parentNode.removeChild(loadingMsg); }, 4000);
        }
    }
}
