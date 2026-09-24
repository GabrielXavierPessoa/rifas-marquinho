document.addEventListener("DOMContentLoaded", () => {
  // --- CARROSSEL DE IMAGENS ---
  const slides = document.querySelectorAll(".carousel-slide");
  const nextBtn = document.getElementById("nextSlide");
  const prevBtn = document.getElementById("prevSlide");
  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach((slide) => slide.classList.remove("active"));
    if (index >= slides.length) currentSlide = 0;
    else if (index < 0) currentSlide = slides.length - 1;
    else currentSlide = index;
    slides[currentSlide].classList.add("active");
  }

  nextBtn.addEventListener("click", () => showSlide(currentSlide + 1));
  prevBtn.addEventListener("click", () => showSlide(currentSlide - 1));

  setInterval(() => {
    showSlide(currentSlide + 1);
  }, 5000);

  // --- SISTEMA INTERATIVO DA RIFA AUTOMÁTICA ---
  const gridContainer = document.getElementById("rifaGrid");
  const checkoutText = document.getElementById("selectedNumbersText");
  const totalPriceText = document.getElementById("totalPriceText");
  const btnWhatsapp = document.getElementById("btnEnviarWhatsapp");

  // Elementos do Formulário de Usuário
  const inputName = document.getElementById("userName");
  const inputPhone = document.getElementById("userPhone");

  const precoPorNumero = 20.0;
  let numerosSelecionados = [];

  // Escuta os cliques nos números do quadro
  gridContainer.addEventListener("click", (e) => {
    const btn = e.target.closest(".number-btn");
    if (!btn) return;

    const status = btn.getAttribute("data-status");
    const num = btn.getAttribute("data-number");

    if (status === "reserved" || status === "paid") {
      alert(
        `O número ${num} já está reservado ou pago! Por favor, escolha outro.`,
      );
      return;
    }

    if (numerosSelecionados.includes(num)) {
      numerosSelecionados = numerosSelecionados.filter((item) => item !== num);
      btn.classList.remove("selected");
    } else {
      numerosSelecionados.push(num);
      btn.classList.add("selected");
    }

    numerosSelecionados.sort((a, b) => a - b);
    atualizarPainelCheckout();
  });

  // Escuta quando o usuário digita nos campos para validar o botão
  inputName.addEventListener("input", validarFormulario);
  inputPhone.addEventListener("input", validarFormulario);

  function atualizarPainelCheckout() {
    // Atualiza a lista de números em texto
    if (numerosSelecionados.length > 0) {
      checkoutText.textContent = numerosSelecionados.join(", ");
    } else {
      checkoutText.textContent = "Nenhum";
    }

    // Calcula e atualiza o valor total dinamicamente
    const valorTotal = numerosSelecionados.length * precoPorNumero;
    totalPriceText.textContent = `R$ ${valorTotal.toFixed(2).replace(".", ",")}`;

    validarFormulario();
  }

  function validarFormulario() {
    const nomePreenchido = inputName.value.trim().length > 2;
    const telefonePreenchido = inputPhone.value.trim().length > 7;
    const possuiNumeros = numerosSelecionados.length > 0;

    // O botão verde só destrava se tiver números marcados E o formulário preenchido
    if (possuiNumeros && nomePreenchido && telefonePreenchido) {
      btnWhatsapp.removeAttribute("disabled");
    } else {
      btnWhatsapp.setAttribute("disabled", "true");
    }
  }

  // Envio da Ação para o WhatsApp
  btnWhatsapp.addEventListener("click", () => {
    if (numerosSelecionados.length === 0) return;

    const telefoneDestino = "5514996508279"; // Número do Marquinho
    const loja = "Marquinhos Tralha de Pesca Tupã";

    const nomeComprador = inputName.value.trim();
    const telefoneComprador = inputPhone.value.trim();
    const valorFinal = (numerosSelecionados.length * precoPorNumero)
      .toFixed(2)
      .replace(".", ",");

    // Constrói a mensagem otimizada com todos os dados digitados e calculados
    const textoMensagem =
      `*NOVO PEDIDO DE RIFA - ${loja}*\n\n` +
      `*Nome:* ${nomeComprador}\n` +
      `*Contato:* ${telefoneComprador}\n\n` +
      `*Números Escolhidos:* ${numerosSelecionados.join(", ")}\n` +
      `*Valor Total:* R$ ${valorFinal}\n\n` +
      `Marquinho, separei esses números no site. Me envia a chave Pix para eu efetuar o pagamento!`;

    const linkWhatsApp = `https://wa.me/${telefoneDestino}?text=${encodeURIComponent(textoMensagem)}`;
    window.open(linkWhatsApp, "_blank");
  });
});
