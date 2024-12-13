// arquivo designado para programar a deteccao e lóogica para seção dos dark patterns de urgencia

let classesCountdown = ['timer', 'countdown', 'clock'];
let contentCountdown = ["Expira em", "Resta Apenas", "Termina em", "dias restantes"]
let shopContent = ["R$", "US$"]
let createdDivs = [];
let foundElements = []
let siblingsArray = []
let styledElements
let shopPage = false;  //bool to check if the current page is a shopping one



// Function that returns elements div with countdown classes or content
function addStyleElement(element) {
  // Função que irá adicionar na página a borda vermelha e mensagem ao passar o mouse por cima do div

  // Cria um div pai
  const wrapper = document.createElement("div");
  wrapper.style.border = "2px solid red"; // Adiciona borda vermelha
  wrapper.style.display = "inline-block"; // Ajusta para envolver apenas o conteúdo do elemento
  wrapper.style.position = "relative"; // Evita o impacto no layout e permite controle do posicionamento interno
  wrapper.id = "wrapper-dark-pattern";
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
  hoverMessage.id ="hoverMessage-darkPattern-countdown";
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
  if (element.parentNode) {
    element.parentNode.insertBefore(wrapper, element);
  }
  wrapper.appendChild(element);
  wrapper.appendChild(hoverMessage);
  createdDivs.push(wrapper);
}
function removeStyleElement(element) {

  //funcao que ira remover na pagina da w3eb a borda vermelha e mensagem ao passar o mouse por cima do div
  if (element.tagName && element.tagName.toLowerCase() === "div" && element.style.border === "2px solid red" && element.id === "wrapper-dark-pattern") {
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
function removeWrapper(element) {
  if (element.id === "wrapper-dark-pattern") {
    element.style.border = ""; // Adiciona borda vermelha
    element.style.display = ""; // Ajusta para envolver apenas o conteúdo do elemento
    element.style.position = ""; // Evita o impacto no layout e permite controle do posicionamento interno 

  }
}
function getElementsCountdown(elements) {
  let foundElements = [];
  let shopPage = false;

  elements.forEach((element) => {
    if(element.tagName == "BODY" || element.tagName == "SCRIPT" || element.tagName == "HTML" || element.tagName == "HEAD"){
      return; // SKIP
    }
    // Verificar se a página é uma página de compras
    shopContent.forEach((currency) => {
      if (element.textContent && element.textContent.includes(currency)) {
        shopPage = true;
      }
    });

    // Verificar se o elemento já foi processado
    let alreadyProcessed = siblingsArray.some(group => group.includes(element));
    if (alreadyProcessed) {
      return;
    }

    // Verificar se o elemento atende aos critérios
    let shouldAdd = false;
    for (let i = 0; i < classesCountdown.length; i++) {
      const currentClass = classesCountdown[i];
      if (element.className && element.className.toString().includes(currentClass)) {
        shouldAdd = true;
      }
    }

    for (let i = 0; i < contentCountdown.length; i++) {
      const currentText = contentCountdown[i];
      if (element.textContent && element.textContent.includes(currentText)) {
        shouldAdd = true;
      }
    }

    if (shouldAdd) {
      // Adicionar o elemento ao foundElements
      if (!foundElements.includes(element)) {
        foundElements.push(element);
      }

      // Criar um grupo de irmãos que atendem aos critérios
      let siblingGroup = [];
      let sibling = element.parentElement?.firstElementChild;

      while (sibling) {
        let siblingMatches = false;

        // Verificar se o irmão atende aos critérios
        for (let i = 0; i < classesCountdown.length; i++) {
          const currentClass = classesCountdown[i];
          if (sibling.className && sibling.className.toString().includes(currentClass)) {
            siblingMatches = true;
          }
        }

        for (let i = 0; i < contentCountdown.length; i++) {
          const currentText = contentCountdown[i];
          if (sibling.textContent && sibling.textContent.includes(currentText)) {
            siblingMatches = true;
          }
        }

        if (siblingMatches) {
          siblingGroup.push(sibling);
        }

        sibling = sibling.nextElementSibling;
      }

      // Adicionar o grupo de irmãos ao siblingsArray global
      if (siblingGroup.length > 0) {
        siblingsArray.push(siblingGroup);
      }
    }
  });

  if (shopPage) {
    console.log("found elements: ", foundElements);
    console.log("siblings array: ", siblingsArray);
    return foundElements;
  } else {
    return [];
  }
}

function toggleFakeTimerBorder(isChecked) {

  const elements = document.querySelectorAll('*'); // Selects all elements 
  let foundElements = getElementsCountdown(elements);

  createdDivs.forEach((element) => {
    removeWrapper(element);
  });

  if (isChecked) { // arrays diferentes e esta checado -> add estilo
    foundElements.forEach((element) => {
      addStyleElement(element); // adiciona borda vermelha e mensagem on hover
    });
  }
  else {
    document.querySelectorAll('#hoverMessage-darkPattern-countdown').forEach(element => {
      console.log("element hoverr: ", element);
      element.remove();
    });
    foundElements.forEach((element) => { // remove borda vermelha e mensagem on hover
      removeStyleElement(element); 
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
