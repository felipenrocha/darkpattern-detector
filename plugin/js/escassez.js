// arquivo designado para programar a deteccao e lóogica para seção dos dark patterns de urgencia



let createdDivsLowStock = [];
let notifiedLowStock = false;
let currentElementsScarcity = [];

// Palavras-chave comuns em mensagens de baixa disponibilidade
const lowStockKeywords = [
  "restantes", "no estoque", "à venda", "em estoque", 
];

// Palavras-chave que aparecem antes do número
const preNumberKeywords = [
  "resta", "restam", "apenas", "somente", "últimas", "faltam", "resta só", "restam só",
];

// Regex para detectar mensagens de baixa disponibilidade
const lowStockRegex = new RegExp(
  `\\b(${preNumberKeywords.join("|")})\\s*\\b(\\d+)\\b|\\b(\\d+)\\b\\s*(${lowStockKeywords.join("|")})`,
  "i"
);
// Função para checar se a string contém uma mensagem de baixa disponibilidade
function containsLowStockMessage(message) {
  return lowStockRegex.test(message);
}


const hoverMessageContentLowStock = "<br>Possível Dark Pattern: Mensagens falsas de estoque baixo. <br>" +
  "Atenção, algumas lojas podem exibir alertas de estoque limitado para pressionar o usuário a comprar rapidamente, " +
  "mesmo quando o estoque real não está tão baixo.<br><br>";
const idStockMessage = "hoverMessage-darkPattern-stock";
const classStockMessage = "stock-message-dark-pattern"; 






function toggleLowStockMessages(isChecked) {

  console.log("Shop Page Bool: ", shopPageBool);
  if (!shopPageBool) { // se nao for um site de compras retorne e nao faça nada com DOM
    return;
  }
  if (isChecked) {

    currentElementsScarcity = document.querySelectorAll('*'); // Selects all elements 

    currentElementsScarcity.forEach((element) => {
      if (element.tagName == "BODY" || element.tagName == "SCRIPT" || element.tagName == "HTML" || element.tagName == "HEAD") {
        return; // SKIP
      }

      if (element.textContent && containsLowStockMessage(element.textContent.toLowerCase()) && element.children.length === 0) {

        addStyleElement(element, hoverMessageContentLowStock, idStockMessage, classStockMessage);
        createdDivsLowStock.push(element);
      }
    });
    if (createdDivsLowStock.length > 0 && !notifiedLowStock) {
      notifiedLowStock = true;
      chrome.runtime.sendMessage({ event: "triggerNotificationLowStockMessage" }); // notifica ao usuario que foi encontrado possiveis dark patterns
    }

  } else {
    createdDivsLowStock.forEach((element) => {
      removeStyleElement(element, classStockMessage, idStockMessage);
    });
    createdDivsLowStock = [];
    notifiedLowStock = false;
  }


}

function scrollToLowStock() {
  const elements = document.querySelectorAll("." + classStockMessage);
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
    alert('Não foram encontrados Possíveis Dark Patterns de Mensagens falsas de estoque baixo nessa página.')
  }

}



let timerEscassez = setInterval(function () {
  const fakeTimerLowStock = document.getElementById('low-stock-checkbox');

  if (currentElementsScarcity.length != document.querySelectorAll('*').length && !fakeTimerLowStock) {
    createdDivsLowStock.forEach((element) => {
      // remove borda vermelha e mensagem on hover
      removeStyleElement(element, classStockMessage, idStockMessage);
    });

    createdDivsLowStock = [];
    toggleLowStockMessages(true);
  } else {
    clearInterval(timerEscassez);
  }

}, 10000);

toggleLowStockMessages(true);

// console.log(API_KEY);
