// arquivo designado para programar a deteccao e lóogica para seção dos dark patterns de urgencia



// Seleciona o ícone de informação e o modal de fake
const infoIcon = document.getElementById('fake-timer-info');
const modal = document.getElementById('info-fake-timer-modal');
const closeModal = document.querySelector('.close-btn-fake-timer');
const classesCountdown = ['timer', 'countdown'];
const contentCountdown = ["Expira em", "Resta Apenas", "Termina em"]


// Mostra o modal ao clicar no ícone
infoIcon.addEventListener('click', () => {
  modal.style.display = 'block';
});

// Fecha o modal ao clicar no botão de fechar
closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Fecha o modal ao clicar fora do conteúdo
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

// popup.js
const fakeTimerCheckbox = document.getElementById('fake-timer');

// Adiciona um evento para monitorar mudanças no estado do checkbox
fakeTimerCheckbox.addEventListener('change', (event) => {
  const isChecked = event.target.checked;

  // Envia a mensagem para o content script da página ativa
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: toggleFakeTimerBorder,
      args: [isChecked]
    });
  });
});

function getElementsCountdown(elements) {
  // funcao que retorna elementos div com as classes ou conteudos do countdown
  let foundElements = [];
  elements.forEach((element) => {
    // checa as classes do elemento
    for (let i = 0; i < classesCountdown.length; i++) {
      const currentClass = classesCountdown[i];
     
      if (element.className && element.className.toString().includes(currentClass)) { //checa se o elemento tem a classe presente normalmente em dark patterns 
        if(!foundElements.find(element)){
          foundElements.push(element);
        }
      }
    }
    // checa o conteudo do elemento
    for (let i = 0; i < contentCountdown.length; i++) {
      const currentText = contentCountdown[i];
      if (element.textContent && element.textContent.includes(currentText)) {
        if(!foundElements.find(element)){
          foundElements.push(element);
        }
        
      }
    }

    return foundElements;
  });
}

// Função que será executada na página
function toggleFakeTimerBorder(isChecked) {
  const elements = document.querySelectorAll('*');
  let found = false;

  elements.forEach((element) => {
    if (
      (element.id && element.id.includes('timer')) || // Verifica se o ID contém "timer"
      (element.className && element.className.toString().includes('timer')) ||
      (element.className && element.className.toString().includes('countdown'))// Verifica se QUALQUER classe contém "timer"
    ) {
      if (isChecked && element.tagName.toLowerCase() !== 'body' && element.tagName.toLowerCase() !== 'html') {
        console.log('Element with timer found:', element);
        found = true;


        // alert

        // Cria um div pai
        const wrapper = document.createElement("div");
        wrapper.style.position = "relative"; // Para posicionar a mensagem de hover corretamente
        wrapper.style.border = "3px solid red"; // Adiciona borda vermelha
        wrapper.style.display = "inline-block"; // Ajusta para envolver apenas o conteúdo do elemento

        // Adiciona efeito de hover
        wrapper.style.transition = "border-color 0.3s ease";
        wrapper.addEventListener("mouseenter", () => {
          wrapper.style.borderColor = "blue"; // Altera a cor da borda ao passar o mouse
        });
        wrapper.addEventListener("mouseleave", () => {
          wrapper.style.borderColor = "red"; // Retorna à cor original
        });

        // Adiciona uma mensagem ao passar o mouse
        const hoverMessage = document.createElement("div");
        hoverMessage.textContent = "Possível Dark Pattern: Fake Countdown Timer";
        hoverMessage.style.position = "absolute";
        hoverMessage.style.top = "-25px"; // Ajusta para exibir acima do wrapper
        hoverMessage.style.left = "0";
        hoverMessage.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
        hoverMessage.style.color = "white";
        hoverMessage.style.padding = "5px";
        hoverMessage.style.borderRadius = "3px";
        hoverMessage.style.fontSize = "12px";
        hoverMessage.style.whiteSpace = "nowrap";
        hoverMessage.style.display = "none"; // Esconde por padrão

        // Exibe a mensagem ao passar o mouse
        wrapper.addEventListener("mouseenter", () => {
          hoverMessage.style.display = "block";
        });
        wrapper.addEventListener("mouseleave", () => {
          hoverMessage.style.display = "none";
        });

        // Move o elemento para dentro do div pai
        element.parentNode.insertBefore(wrapper, element);
        wrapper.appendChild(element);
        wrapper.appendChild(hoverMessage);

      } else {
        // Remove o div pai e retorna o elemento ao estado original
        const wrapper = element.parentNode;
        if (wrapper.tagName.toLowerCase() === "div" && wrapper.style.border === "3px solid red") {
          const parent = wrapper.parentNode;
          parent.insertBefore(element, wrapper);
          parent.removeChild(wrapper);
        }
      }
    }
  });
  if (found) {
    alert("Atenção: Um possível dark pattern de Fake Countdown Timer foi detectado!");

  }
}



