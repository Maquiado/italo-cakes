// Elementos
const checkboxes = document.querySelectorAll('.adicionais input[type="checkbox"]');
const totalDisplay = document.getElementById('total');
const sabor = document.getElementById('sabor');
const tamanho = document.getElementById('tamanho');
const topo = document.getElementById('topo');
const cobertura = document.getElementById('cobertura');
const mensagem = document.getElementById('mensagem');
const pedidoBtn = document.getElementById('pedidoBtn');

// Função única para calcular o total
function calcularTotal() {
  let total = 0;

  total += parseInt(tamanho.value);
  total += parseInt(sabor.value);
  total += parseInt(topo.value);

  checkboxes.forEach(cb => {
    if (cb.checked) total += parseInt(cb.value);
  });

  totalDisplay.textContent = `Preço Total: R$ ${total},00`;
  return total;
}



// Eventos para atualizar o preço
checkboxes.forEach(cb => cb.addEventListener('change', calcularTotal));
sabor.addEventListener('change', calcularTotal);
tamanho.addEventListener('change', calcularTotal);
topo.addEventListener('change', calcularTotal);
mensagem.addEventListener('input', calcularTotal);

// Botão de pedido
pedidoBtn.addEventListener('click', () => {
  const valorTotal = calcularTotal();
  const adicionaisSelecionados = Array.from(checkboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.parentElement.textContent.trim())
    .join(", ");

  const tamanhoTexto = tamanho.options[tamanho.selectedIndex].text;
  const saborTexto = sabor.options[sabor.selectedIndex].text;
  const topoTexto = topo.options[topo.selectedIndex].text;
  const coberturaTexto = cobertura.options[cobertura.selectedIndex].text;

  const mensagemFinal = encodeURIComponent(
    `Olá! Gostaria de pedir um bolo:\n` +
    `- Tamanho: ${tamanhoTexto}\n` +
    `- Sabor: ${saborTexto}\n` +
    `- Cobertura: ${coberturaTexto}\n` +
    `- Topo: ${topoTexto}\n` +
    `- Mensagem: ${mensagem.value}\n` +
    `- Adicionais: ${adicionaisSelecionados || "Nenhum"}\n\n` +
    `Preço Total: R$ ${valorTotal},00`
  );

  const confirmacao = document.getElementById('confirmacao');
  confirmacao.classList.remove('confirmacao-escondida');
  confirmacao.classList.add('confirmacao-visivel');

  setTimeout(() => {
    confirmacao.classList.remove('confirmacao-visivel');
    confirmacao.classList.add('confirmacao-escondida');
  }, 4000);

  window.open(`https://wa.me/5599999999999?text=${mensagemFinal}`, '_blank');
});

// Inicializa
calcularTotal();




// Swiper
new Swiper(".mySwiper", {
  slidesPerView: 1.2,
  spaceBetween: 16,
  loop: true,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false
  },
  breakpoints: {
    768: {
      slidesPerView: 3
    }
  }

  
});
const swiper = new Swiper(".mySwiper", {
  slidesPerView: 3,
  spaceBetween: 20,
  loop: true,
  breakpoints: {
    1024: {
      slidesPerView: 4,
    },
    768: {
      slidesPerView: 3,
    },
    480: {
      slidesPerView: 2,
    },
    0: {
      slidesPerView: 1,
    },
  },
});

