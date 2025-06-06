export default function inicializarMontarBolo() {
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
  }

  function atualizarTotal() {
    const tipoMassa = document.getElementById('tipoMassa')?.value;
    const coberturaValor = parseFloat(document.getElementById('cobertura')?.value || 0);

    // Preço base do tipo de massa
    let precoBase = 0;
    if (tipoMassa === 'tradicional') precoBase = 30;
    else if (tipoMassa === 'premium') precoBase = 40;

    total = precoBase + coberturaValor;
    totalSpan.textContent = `Preço Total: R$ ${total.toFixed(2).replace('.', ',')}`;
  }

  // Atualizar sabores de acordo com tipo de massa
  function atualizarSabores() {
    const tipoMassa = document.getElementById('tipoMassa').value;
    const saborMassa = document.getElementById('saborMassa');
    saborMassa.innerHTML = '';

    let opcoes = [];
    if (tipoMassa === 'tradicional') {
      opcoes = [
        'Branca',
        'Chocolate (50%)',
        'Cenoura',
        'Laranja',
        'Maracujá'
      ];
    } else if (tipoMassa === 'premium') {
      opcoes = [
        'Baunilha com cookies',
        'Paçoca de Amendoim',
        'Café Expresso com cacau',
        'Ferrero Rocher (Cacau 70% com amendoim tostados)',
        'Romeu e Julieta (Massa de queijo com pedaços de goiabada)'
      ];
    }

    opcoes.forEach(opcao => {
      const optionEl = document.createElement('option');
      optionEl.value = opcao;
      optionEl.textContent = opcao;
      saborMassa.appendChild(optionEl);
    });

    atualizarTotal();
  }

  // Navegação entre etapas
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

  // Eventos de atualização
  document.getElementById('tipoMassa')?.addEventListener('change', atualizarSabores);
  document.getElementById('cobertura')?.addEventListener('change', atualizarTotal);
  document.getElementById('cobertura')?.addEventListener('input', atualizarTotal);

  // Botão enviar
  enviarWhatsapp.addEventListener('click', async () => {
    const tipoMassa = document.getElementById('tipoMassa')?.value;
    const saborMassa = document.getElementById('saborMassa')?.value;
    const coberturaEl = document.getElementById('cobertura');
    const coberturaText = coberturaEl.selectedOptions[0]?.text || '';
    const nome = document.getElementById('nome')?.value.trim();
    const mensagem = document.getElementById('mensagem')?.value.trim();
    const tamanho = document.getElementById('tamanho')?.value;

    if (!nome) {
      alert("Por favor, preencha seu nome antes de enviar o pedido.");
      return;
    }

    const pedido = {
      nome,
      tamanho,
      tipoMassa,
      saborMassa,
      cobertura: coberturaText,
      mensagem: mensagem,
      total,
      dataHora: new Date().toISOString()
    };

    // Salvar no Firestore
    try {
      const { getFirestore, collection, addDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js");

      const firebaseConfig = {
        apiKey: "AIzaSyAzyLDVjy2hjnbIN82x-rYykJHpAhATWVc",
        authDomain: "italo-cakes.firebaseapp.com",
        projectId: "italo-cakes",
        storageBucket: "italo-cakes.appspot.com",
        messagingSenderId: "1065164711483",
        appId: "1:1065164711483:web:114b7f5813478ae46a5e1e",
        measurementId: "G-TZQEFZ0D23"
      };

      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);

   await addDoc(collection(db, "pedidos"), {
  ...pedido,
  timestamp: serverTimestamp(),
  ordem: Date.now() * -1
});

      console.log("Pedido salvo no Firestore com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar no Firestore:", error);
      alert("Erro ao salvar o pedido. Tente novamente.");
      return;
    }

    // Enviar para WhatsApp
    let texto = `🍰 Pedido de Bolo - Ítalo Cakes\n\n`;
    texto += `👤 Cliente: ${nome}\n`;
    texto += `🎂 Massa: ${tipoMassa} - ${saborMassa}\n`;
    texto += `🍬 Cobertura: ${coberturaText}\n`;
    texto += mensagem ? `📝 Obs: ${mensagem}\n` : '';
    texto += `\n💰 Total: R$ ${total.toFixed(2).replace('.', ',')}`;

    const numeroWhatsApp = '84994282475';
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');

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
  atualizarSabores(); // inicializa sabores com o tipo atual
}
