function inicializarMontarBolo() {
  const etapas = document.querySelectorAll('.etapa');
  const botoesProximo = document.querySelectorAll('.proximo');
  const botoesVoltar = document.querySelectorAll('.voltar');
  const totalSpan = document.getElementById('total');
  const enviarWhatsapp = document.getElementById('enviarWhatsapp');
  const confirmacao = document.getElementById('confirmacao');

  let etapaAtual = 0;
  let total = 0;

  function mostrarEtapa(index) {
    etapas.forEach((etapa, i) => {
      etapa.classList.toggle('escondido', i !== index);
    });
    etapaAtual = index;
    atualizarTotal();
    atualizarAvisos();
  }

  function atualizarTotal() {
    const tamanho = parseFloat(document.getElementById('tamanho')?.value || 0);
    const massa = document.getElementById('massa')?.value;
    const topo = parseFloat(document.getElementById('topo')?.value || 0);

    let adicionais = 0;
    document.querySelectorAll('#adicionais input:checked').forEach(item => {
      let valor = parseFloat(item.value);
      if (tamanho > 120) valor *= 2;
      adicionais += valor;
    });

    let acrescimoMassa = 0;
    if (massa === 'redvelvet') {
      acrescimoMassa = tamanho <= 120 ? 10 : 20;
    } else if (massa === 'mistas') {
      acrescimoMassa = tamanho <= 120 ? 15 : 25;
    }

    total = tamanho + topo + adicionais + acrescimoMassa;
    totalSpan.textContent = `Preço Total: R$ ${total.toFixed(2).replace('.', ',')}`;
  }

  function atualizarAvisos() {
    const massa = document.getElementById('massa')?.value;
    const tamanho = parseFloat(document.getElementById('tamanho')?.value || 0);
    const avisoRV = document.getElementById('avisoRedVelvet');
    const avisoMistas = document.getElementById('avisoMistas');
    const avisoAdic = document.getElementById('avisoAdicionais');

    avisoRV.classList.toggle('escondido', massa !== 'redvelvet');
    avisoMistas.classList.toggle('escondido', massa !== 'mistas');
    avisoAdic.classList.toggle('escondido', !(etapaAtual === 3 && tamanho > 120));
  }

  // Limitar máximo 2 recheios selecionados
  const recheiosInputs = document.querySelectorAll('#recheios input[type="checkbox"]');
  recheiosInputs.forEach(input => {
    input.addEventListener('change', () => {
      const selecionados = Array.from(recheiosInputs).filter(i => i.checked);
const avisoRecheios = document.getElementById('avisoRecheios');

if (selecionados.length > 2) {
  input.checked = false;
  avisoRecheios.style.display = 'block';
  setTimeout(() => {
    avisoRecheios.style.display = 'none';
  }, 3000); // Esconde depois de 3 segundos
}
      atualizarTotal();
    });
  });

  botoesProximo.forEach(botao => {
    botao.addEventListener('click', () => {
      if (etapaAtual < etapas.length - 1) {
        mostrarEtapa(etapaAtual + 1);
      }
    });
  });

  botoesVoltar.forEach(botao => {
    botao.addEventListener('click', () => {
      if (etapaAtual > 0) {
        mostrarEtapa(etapaAtual - 1);
      }
    });
  });

  document.querySelectorAll('select, input, textarea').forEach(el => {
    document.getElementById('massa')?.addEventListener('change', atualizarAvisos);
    el.addEventListener('change', atualizarTotal);
    el.addEventListener('input', atualizarTotal);
  });

  enviarWhatsapp.addEventListener('click', async () => {
    const tamanhoEl = document.getElementById('tamanho');
    const massa = document.getElementById('massa').value;
    const cobertura = document.getElementById('cobertura').value;
    const topoEl = document.getElementById('topo');
    const nome = document.getElementById('nome').value.trim();
    const mensagemExtra = document.getElementById('mensagem').value.trim();

    const tamanhoText = tamanhoEl.selectedOptions[0]?.text || '';
    const topoText = topoEl.selectedOptions[0]?.text || '';
    const adicionaisSelecionados = Array.from(document.querySelectorAll('#adicionais input:checked'))
      .map(item => item.parentElement.textContent.trim());

    // NOVO: pegar recheios selecionados para envio
    const recheiosSelecionados = Array.from(document.querySelectorAll('#recheios input:checked'))
      .map(item => item.parentElement.textContent.trim());

    if (!nome) {
      alert("Por favor, preencha seu nome antes de enviar o pedido.");
      return;
    }

    const pedido = {
      nome,
      tamanho: tamanhoText,
      massa,
      recheios: recheiosSelecionados, // Adicionado recheios aqui
      cobertura,
      adicionais: adicionaisSelecionados,
      topo: topoText,
      mensagem: mensagemExtra,
      total: total,
      dataHora: new Date().toISOString()
    };

    let texto = `🍰 Pedido de Bolo - Ítalo Cakes\n\n`;
    texto += `👤 Cliente: ${nome}\n`;
    texto += `📏 Tamanho: ${tamanhoText}\n`;
    texto += `🎂 Massa: ${massa}\n`;
    texto += `🍫 Recheios: ${recheiosSelecionados.join(', ') || 'Nenhum'}\n`; // Linha nova no texto
    texto += `🍬 Cobertura: ${cobertura}\n`;
    texto += `➕ Adicionais: ${adicionaisSelecionados.join(', ') || 'Nenhum'}\n`;
    texto += `🎀 Topo: ${topoText}\n`;
    texto += mensagemExtra ? `📝 Obs: ${mensagemExtra}\n` : '';
    texto += `\n💰 Total: R$ ${total.toFixed(2).replace('.', ',')}`;

    const numeroWhatsApp = '5584988663170'; // Seu número real
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(texto)}`;

    // Abre WhatsApp numa nova aba
    window.open(url, '_blank');

    // Salva no Firestore em background
    try {
      const snapshot = await firebase.firestore()
        .collection("pedidos")
        .orderBy("ordem", "desc")
        .limit(1)
        .get();

      let proximaOrdem = 1;
      if (!snapshot.empty) {
        const ultimoPedido = snapshot.docs[0].data();
        proximaOrdem = (ultimoPedido.ordem || 0) + 1;
      }

      pedido.ordem = proximaOrdem;

      await firebase.firestore().collection("pedidos").add(pedido);
      console.log("Pedido salvo no Firestore com sucesso com ordem:", proximaOrdem);

    } catch (error) {
      console.error("Erro ao salvar no Firestore:", error);
    }

    // Mostrar confirmação
    confirmacao.classList.remove('confirmacao-escondida');
    confirmacao.classList.add('confirmacao-visivel');

    setTimeout(() => {
      confirmacao.classList.remove('confirmacao-visivel');
      confirmacao.classList.add('confirmacao-escondida');
    }, 5000);
  });

  // Inicializa
  mostrarEtapa(0);
}
