// arquivo designado para programar a deteccao e lóogica para seção dos dark patterns de urgencia



// Seleciona o ícone de informação e o modal de fake
let infoIcon = document.getElementById('fake-timer-info');
let modal = document.getElementById('info-fake-timer-modal');
let closeModal = document.querySelector('.close-btn-fake-timer');
let classesCountdown = ['timer', 'countdown', 'clock', 'time'];
let contentCountdown = ["Expira em", "Resta Apenas", "Termina em", "dias restantes"]
// Function that returns elements div with countdown classes or content
function getElementsCountdown(elements) {
  let foundElements = [];

  elements.forEach((element) => {
    // Check if any ancestor of the current element is already in foundElements
    let ancestorExists = false;
    let currentElement = element;

    while (currentElement && currentElement.tagName !== 'HTML') {
      if (foundElements.includes(currentElement)) {
        ancestorExists = true;
        break;
      }
      currentElement = currentElement.parentElement; // Move to the parent element
    }

    if (ancestorExists) {
      return; // Skip this element if any ancestor is already in foundElements
    }

    // Check classes
    if (element.tagName !== 'BODY' && element.tagName !== 'HTML') {
      for (let i = 0; i < classesCountdown.length; i++) {
        const currentClass = classesCountdown[i];
        if (element.className && element.className.toString().includes(currentClass)) {
          if (!foundElements.includes(element)) {
            foundElements.push(element);
          }
        }
      }

      // Check content
      for (let i = 0; i < contentCountdown.length; i++) {
        const currentText = contentCountdown[i];
        if (element.textContent && element.textContent.includes(currentText)) {
          if (!foundElements.includes(element)) {
            foundElements.push(element);
          }
        }
      }
    }
  });

  return foundElements;
}
function addStyleElement(element) {
  // Função que irá adicionar na página a borda vermelha e mensagem ao passar o mouse por cima do div

  // Cria um div pai
  const wrapper = document.createElement("div");
  wrapper.style.border = "3px solid red"; // Adiciona borda vermelha
  wrapper.style.display = "inline-block"; // Ajusta para envolver apenas o conteúdo do elemento
  wrapper.style.position = "relative"; // Evita o impacto no layout e permite controle do posicionamento interno

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
  hoverMessage.textContent = "Possível Dark Pattern: Fake countdown timer. Cuidado, esse tipo de contagem regressiva muitas vezes não reflete o tempo real da promoção e pode ser usado para criar urgência artificial.";
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
}
function removeStyleElement(element) {
  //funcao que ira remover na pagina da w3eb a borda vermelha e mensagem ao passar o mouse por cima do div
  if (element.tagName.toLowerCase() === "div" && element.style.border === "3px solid red") {
    const parent = element.parentNode;

    // Move todos os filhos de 'element' para o 'parent'
    while (element.firstChild) {
      parent.appendChild(element.firstChild);
    }

    // Remove o 'parent' após mover todos os filhos
    parent.removeChild(element);
  } else {
    const wrapper = element.parentNode;
    if (wrapper.tagName.toLowerCase() === "div" && wrapper.style.border === "3px solid red") {
      const parent = wrapper.parentNode;
      parent.insertBefore(element, wrapper);
      parent.removeChild(wrapper);
    }
  }
}

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

const fakeTimerCheckbox = document.getElementById('fake-timer');


function toggleFakeTimerBorder(isChecked) {
  console.log('in');

  const elements = document.querySelectorAll('*'); // Selects all elements (consider specific selectors for performance)
  let foundElements = getElementsCountdown(elements);
  console.log(foundElements);

  if (isChecked) {
    foundElements.forEach((element) => {
      addStyleElement(element); // adiciona borda vermelha e mensagem on hover
    });

  } else {

    foundElements.forEach((element) => {
      console.log("found element unchecked:", element);

      removeStyleElement(element); // remove borda vermelha e mensagem on hover
    });
  }
}

// Adiciona um evento para monitorar mudanças no estado do checkbox

fakeTimerCheckbox.addEventListener('change', (event) => {
  const isChecked = event.target.checked;


  // Envia a mensagem para o content script da página ativa
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ['urgencia.js']
    }, () => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: toggleFakeTimerBorder,
        args: [isChecked]
      });
    });
  });
});
