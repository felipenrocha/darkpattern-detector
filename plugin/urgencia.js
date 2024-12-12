// arquivo designado para programar a deteccao e lóogica para seção dos dark patterns de urgencia

let classesCountdown = ['timer', 'countdown', 'clock', 'time'];
let contentCountdown = ["Expira em", "Resta Apenas", "Termina em", "dias restantes"]
let foundElements = [];

function arraysIguais(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false; // Se os arrays têm tamanhos diferentes, não são iguais
  }

  // Ordena os arrays e compara elemento por elemento
  arr1.sort();
  arr2.sort();

  // Verifica se os arrays têm os mesmos elementos
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false; // Se algum elemento for diferente, os arrays não são iguais
    }
  }

  return true; // Arrays são iguais
}

// Function that returns elements div with countdown classes or content

function addStyleElement(element) {
  // Função que irá adicionar na página a borda vermelha e mensagem ao passar o mouse por cima do div

  // Cria um div pai
  const wrapper = document.createElement("div");
  wrapper.style.border = "2px solid red"; // Adiciona borda vermelha
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
  hoverMessage.innerHTML = "Possível Dark Pattern: Fake countdown timer. <br>" +
    "Cuidado, esse tipo de contagem regressiva muitas vezes não reflete o tempo real da promoção <br>" +
    "e pode ser usado para criar urgência artificial.";
  hoverMessage.style.textAlign = "center";
  hoverMessage.style.position = "absolute";
  hoverMessage.style.top = "-25px"; // Ajusta para exibir acima do wrapper
  hoverMessage.style.left = "0";
  hoverMessage.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  hoverMessage.style.color = "white";
  hoverMessage.style.padding = "5px";
  hoverMessage.style.borderRadius = "2px";
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
  if (element.tagName && element.tagName.toLowerCase() === "div" && element.style.border === "2px solid red") {
    const parent = element.parentNode;

    // Move todos os filhos de 'element' para o 'parent'
    while (element.firstChild) {
      parent.appendChild(element.firstChild);
    }

    // Remove o 'parent' após mover todos os filhos
    parent.removeChild(element);
  } else {
    const wrapper = element.parentNode;
    if (wrapper.tagName.toLowerCase() === "div" && wrapper.style.border === "2px solid red") {
      const parent = wrapper.parentNode;
      parent.insertBefore(element, wrapper);
      parent.removeChild(wrapper);
    }
  }

}

function getElementsCountdown(elements) {
  let newElements = [];

  elements.forEach((element) => {
    // Check if any ancestor of the current element is already in newElements
    let ancestorExists = false;
    let currentElement = element;

    while (currentElement && currentElement.tagName !== 'HTML' && currentElement.tagName !== 'BODY') {
      if (newElements.includes(currentElement)) {
        ancestorExists = true;
        break;
      }
      currentElement = currentElement.parentElement; // Move to the parent element
    }

    if (ancestorExists) {
      return; // Skip this element if any ancestor is already in newElements
    }

    // Check classes
    if (element.tagName !== 'BODY' && element.tagName !== 'HTML') {
      for (let i = 0; i < classesCountdown.length; i++) {
        const currentClass = classesCountdown[i];
        if (element.className && element.className.toString().includes(currentClass)) {
          if (!newElements.includes(element)) {
            newElements.push(element);
          }
        }
      }

      // Check content
      for (let i = 0; i < contentCountdown.length; i++) {
        const currentText = contentCountdown[i];
        if (element.textContent && element.textContent.includes(currentText)) {
          if (!newElements.includes(element)) {
            newElements.push(element);
          }
        }
      }
    }
  });

  return newElements;
}

function toggleFakeTimerBorder(isChecked) {

  const elements = document.querySelectorAll('*'); // Selects all elements 
  foundElements = getElementsCountdown(elements);

  if (isChecked) { // arrays diferentes e esta checado -> add estilo
    foundElements.forEach((element) => {
      addStyleElement(element); // adiciona borda vermelha e mensagem on hover
    });
  }
  else if (!isChecked) {
    foundElements.forEach((element) => {
      removeStyleElement(element); // remove borda vermelha e mensagem on hover
    });
  }
}
window.onload = () => {
  toggleFakeTimerBorder(true);
  console.log(foundElements);

  // setInterval(function () {
  //   console.log(foundElements);


  //   const fakeTimerCheckbox = document.getElementById('fake-timer');
  //   if (fakeTimerCheckbox) {
  //     toggleFakeTimerBorder(fakeTimerCheckbox.checked)
  //   } else {
  //     foundElements.forEach((element) => {
  //       removeStyleElement(element);
  //     });
  //     toggleFakeTimerBorder(true);
  //   }

  // }, 4000);

};  
