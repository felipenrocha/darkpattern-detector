// arquivo designado para programar a deteccao e lóogica para seção dos dark patterns de urgencia

let classesCountdown = ['timer', 'countdown', 'clock', 'count-down', 'Timer'];
let contentCountdown = ["Expira em", "Resta Apenas", "Termina em", "dias restantes", "Oferta termina em"];
let createdDivs = [];
let foundElements = []
let siblingsArray = []
let currentElements = [];
let shopPage = false;  //bool to check if the current page is a shopping one
let notified = false;
// muitas vezes redes sociais tem multiplos anuncios mas nao sao´paginas de compra.



const hoverMessageContentCountdown = "<br><br>Possível Dark Pattern: Fake countdown timer. <br>" +
  "Cuidado, esse tipo de contagem regressiva muitas vezes não reflete o tempo real da promoção <br>" +
  "e pode ser usado para criar urgência artificial.<br><br>";
const idCountdown = "hoverMessage-darkPattern-countdown";
const classCountdown = "countdown-element-dark-pattern";

function getElements(elements, classes, content) {
  // retorna elementos encontrados elementos irmaos contendo as classes especificas do darkpattern
  let foundElements = [];
  let siblingsArray = [];
  shopPage = isShoppingPage();
  if (!shopPage) {
    return;
  }

  elements.forEach((element) => {
    if (element.tagName == "BODY" || element.tagName == "SCRIPT" || element.tagName == "HTML" || element.tagName == "HEAD") {

      return; // SKIP
    }
    // Verificar se o elemento já foi processado
    let alreadyProcessed = siblingsArray.some(group => group.includes(element));
    if (alreadyProcessed) {
      return;
    }

    // Verificar se o elemento atende aos critérios
    let shouldAdd = false;
    for (let i = 0; i < classes.length; i++) {
      const currentClass = classes[i];
      if (element.className && element.className.toString().includes(currentClass)) {
        shouldAdd = true;
      }
    }

    for (let i = 0; i < content.length; i++) {
      const currentText = content[i];
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
        for (let i = 0; i < classes.length; i++) {
          const currentClass = classes[i];
          if (sibling.className && sibling.className.toString().includes(currentClass)) {
            siblingMatches = true;
          }
        }

        for (let i = 0; i < content.length; i++) {
          const currentText = content[i];
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
    return [foundElements, siblingsArray];
  } else {
    return [];
  }
}
function scrollToCountdown() {
  const elements = document.querySelectorAll('.countdown-element-dark-pattern');

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
    foundElements = getElements(currentElements, classesCountdown, contentCountdown)[0];
    siblingsArray = getElements(currentElements, classesCountdown, contentCountdown)[1];

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
          addStyleElement(parent, hoverMessageContentCountdown, idCountdown, classCountdown);
          createdDivs.push(parent);
        } else {
          addStyleElement(element[0], hoverMessageContentCountdown, idCountdown, classCountdown); // somente o primeiro elemento de irmaos é adicionado a borda
          createdDivs.push(element[0]);
        }
      }
    });

    if (createdDivs.length > 0 && !notified) {
      notified = true;
      
      chrome.runtime.sendMessage({ event: "triggerNotificationCountdownTimer" }); // notifica ao usuario que foi encontrado possiveis dark patterns
    }




  }
  else {
    createdDivs.forEach((element) => { // remove borda vermelha e mensagem on hover
      removeStyleElement(element, classCountdown, "hoverMessage-darkPattern-countdown");
    });
    notified = false;

  }
  currentElements = document.querySelectorAll('*'); // Selects all elements 

}
window.onload = () => {
  let timer = setInterval(function () {
    const fakeTimerCheckbox = document.getElementById('fake-timer-checkbox');

    if (currentElements.length != document.querySelectorAll('*').length && !fakeTimerCheckbox) {
      createdDivs.forEach((element) => {
        // remove borda vermelha e mensagem on hover
        removeStyleElement(element, classCountdown, "hoverMessage-darkPattern-countdown");
      });
      // remove hover messages que existirem:

      createdDivs = [];
      toggleFakeTimerBorder(true);
    } else {
      clearInterval(timer);
    }

  }, 1000);

};  
