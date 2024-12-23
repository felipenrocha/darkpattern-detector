// arquivo designado para programar a deteccao e lóogica para seção dos dark patterns de urgencia

let classesCountdown = ['timer', 'countdown', 'clock'];
let contentCountdown = ["Expira em", "Resta Apenas", "Termina em", "dias restantes", "Oferta termina em"];
let shopContent = ["R$", "US$", "£"];
let createdDivs = [];
let foundElements = []
let siblingsArray = []
let currentElements = [];
let shopPage = false;  //bool to check if the current page is a shopping one
let notified = false;
const blacklistedDomains = [
  'facebook.com',
  'instagram.com',
  'twitter.com',
  'youtube.com',
  'linkedin.com',
  'tiktok.com',
  'pinterest.com',
  'snapchat.com',
  'reddit.com',
  'tumblr.com',
  'quora.com',
  'weibo.com',
  'vk.com',
  'flickr.com',
  'discord.com',
  'telegram.org',
  'whatsapp.com',
  'medium.com',
  'slack.com',
  'clubhouse.com'
]; // muitas vezes redes sociais tem multiplos anuncios mas nao sao´paginas de compra.



function isShoppingPage() {


  const currentDomain = window.location.hostname; // Domínio atual

  if (blacklistedDomains.some(domain => currentDomain.includes(domain))) {
    console.log("blacklisted");
    
    return false;
  }
  const priceRegex = /(\$|€|£|₹|USD|EUR|INR)[\s\d,.]+/;
  const priceElements = Array.from(document.querySelectorAll('*')).filter(el => priceRegex.test(el.textContent));
  // Require multiple prices in a specific area (e.g., product grid or list
  const hasMultiplePrices = priceElements.length > 5;
  console.log("priceElements.length:", priceElements.length);

  console.log("hasmultipleprices:", hasMultiplePrices);

  return hasMultiplePrices;
}


// Function that returns elements div with countdown classes or content
function addStyleElement(element) {
  // Função que irá adicionar na página a borda vermelha e mensagem ao passar o mouse por cima do div

  element.style.border = "6px solid red"; // Adiciona borda vermelha
  // Adiciona efeito de hover
  element.style.transition = "border-color 0.3s ease";
  element.addEventListener("mouseenter", () => {
    element.style.borderColor = "blue"; // Altera a cor da borda ao passar o mouse
  });
  element.addEventListener("mouseleave", () => {
    element.style.borderColor = "red"; // Retorna à cor original
  });
  // Adiciona uma mensagem ao passar o mouse
  const hoverMessage = document.createElement("div");
  hoverMessage.id = "hoverMessage-darkPattern-countdown";
  hoverMessage.innerHTML = "<br><br>Possível Dark Pattern: Fake countdown timer. <br>" +
    "Cuidado, esse tipo de contagem regressiva muitas vezes não reflete o tempo real da promoção <br>" +
    "e pode ser usado para criar urgência artificial.<br><br>";
  hoverMessage.style.textAlign = "center";
  element.classList.add("countdown-element-dark-pattern");
  hoverMessage.style.position = "absolute";
  hoverMessage.style.top = "-25px"; // Ajusta para exibir acima do wrapper
  hoverMessage.style.left = "0";
  hoverMessage.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  hoverMessage.style.color = "white";
  hoverMessage.style.borderRadius = "2px";
  hoverMessage.style.fontSize = "12px";
  hoverMessage.style.whiteSpace = "nowrap";
  hoverMessage.style.display = "none"; // Esconde por padrão

  // Exibe a mensagem ao passar o mouse
  element.addEventListener("mouseenter", () => {
    hoverMessage.style.display = "block";
  });

  element.addEventListener("mouseleave", () => {
    hoverMessage.style.display = "none";
  });

  element.appendChild(hoverMessage);
}
function removeStyleElement(element) {

  //funcao que ira remover na pagina da w3eb a borda vermelha e mensagem ao passar o mouse por cima do div
  element.style.border = ""; // Adiciona borda vermelha
  const index = createdDivs.indexOf(element);


}
function removeAncestors(siblingGroups) {
  // Combina todos os elementos em um único array para verificar relações de ancestralidade
  const allElements = siblingGroups.flat();

  // Filtrar cada grupo removendo elementos ancestrais
  return siblingGroups.map(group =>
    group.filter(element =>
      // Verifica se o elemento NÃO é ancestral de nenhum outro elemento
      !allElements.some(otherElement =>
        otherElement !== element && element.contains(otherElement)
      )
    )
  ).filter(group => group.length > 0); // Remove grupos vazios
}

function getElementsCountdown(elements) {
  let foundElements = [];
  shopPage = isShoppingPage();
  console.log("shop Page: ", shopPage);
  if (!shopPage) {
    return;
  }
  
  elements.forEach((element) => {
    if (element.tagName == "BODY" || element.tagName == "SCRIPT" || element.tagName == "HTML" || element.tagName == "HEAD") {
    // console.log("SKIP: ", element);
      
      return; // SKIP
    }
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
      console.log('should add:', shouldAdd);
      
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
    siblingsArray = removeAncestors(siblingsArray);
    console.log("shop Page: ", shopPage)
    return foundElements;
  } else {
    return [];
  }
}


function isAncestorOf(ancestors, element) {
  ancestors.forEach((ancestor) => {
    if (ancestor.tagName != "BODY" && ancestor.contains(element)) {
      return true;
    }
  });
  return false;
}

function scrollToCountdown() {
  console.log("in");

  const elements = document.querySelectorAll('.countdown-element-dark-pattern');
  console.log(elements);

  if (elements.length > 0) {
    const element = elements[0];
    const offset = -150; // Ajuste o valor para a distância acima desejada (scollar um pouco acima do relogio)
    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    const scrollToPosition = elementPosition + offset;

    window.scrollTo({
      top: scrollToPosition,
      behavior: 'smooth'
    });
  } else {
    alert('Não foram encontrados Possíveis Dark Patterns de Countdown Timer nessa página.')
  }

}
function toggleFakeTimerBorder(isChecked) {

  currentElements = document.querySelectorAll('*'); // Selects all elements 


  if (isChecked) { // arrays diferentes e esta checado -> add estilo
    foundElements = getElementsCountdown(currentElements);
    // console.log("found Elements: ", foundElements);
    
    siblingsArray.forEach((element, index) => {
      // checa se tem algum ancestral dentro dos elementos a serem adicionados (se tiver, pula)
      let ancestorFound = false;
      siblingsArray.forEach((ancestors) => {
        if (isAncestorOf(foundElements, element[0])) {
          ancestorFound = true;
        }
      });

      let parent = element[0].parentElement; // busca pai divs para adicionar a borda (caso de muitos irmaos com timer)
      while (parent && parent.tagName != "DIV") {
        parent = parent.parentElement;
      }
      if (!ancestorFound) {
        if (parent && parent.tagName == "DIV") {
          addStyleElement(parent);
          createdDivs.push(parent);
        } else {
          addStyleElement(element[0]); // somente o primeiro elemento de irmaos é adicionado a borda
          createdDivs.push(element[0]);
        }
      }
    });
    console.log("cerated Divs: ", createdDivs);
    
    if (createdDivs.length > 0 && !notified) {
      notified = true;
      chrome.runtime.sendMessage({ event: "triggerNotificationCountdownTimer" }); // notifica ao usuario que foi encontrado possiveis dark patterns
    }




  }
  else {
    createdDivs.forEach((element) => { // remove borda vermelha e mensagem on hover
      removeStyleElement(element);
      element.classList.remove('countdown-element-dark-pattern'); // Remove a classe
    });
    // remove hover messages que existirem:
    // hoverMessage-darkPattern-countdown
    const elements = document.querySelectorAll('#hoverMessage-darkPattern-countdown');

    // Remove cada elemento do DOM
    elements.forEach((element) => {
      element.remove();
    });
    createdDivs = [];
    notified = false;

  }
  currentElements = document.querySelectorAll('*'); // Selects all elements 

}
window.onload = () => {
  let timer = setInterval(function () {
    const fakeTimerCheckbox = document.getElementById('fake-timer');

    if (currentElements.length != document.querySelectorAll('*').length && !fakeTimerCheckbox) {
      createdDivs.forEach((element) => {
        // remove borda vermelha e mensagem on hover
        removeStyleElement(element);
      });
      // remove hover messages que existirem:
      // hoverMessage-darkPattern-countdown
      const hoverDivs = document.querySelectorAll('#hoverMessage-darkPattern-countdown');
      // Remove cada elemento do DOM
      hoverDivs.forEach((element) => {
        element.remove();
      });
      createdDivs = [];
      toggleFakeTimerBorder(true);
    } else {
      // clearInterval(timer);
    }

  }, 1000);

};  
