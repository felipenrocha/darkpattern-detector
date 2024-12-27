








const blacklistedDomains = [
  'facebook.com',
  'instagram.com',
  'twitter.com',
  'x.com',
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
];



function addStyleElement(element, hoverMessageContent, idHoverMessage, className) {
  // Função que irá adicionar na página a borda vermelha e mensagem ao passar o mouse por cima do div
  element.style.border = "3px solid red"; // Adiciona borda vermelha
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
  hoverMessage.id = idHoverMessage;
  hoverMessage.innerHTML = hoverMessageContent;
  hoverMessage.style.textAlign = "center";
  element.classList.add(className);
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


function removeStyleElement(element, className, idHoverMessage) {
  element.style.border = ""; // Adiciona borda vermelha
  element.classList.remove(className); // Remove a classe
  const hoverDivs = document.querySelectorAll("#" + idHoverMessage);
  // Remove cada elemento do DOM
  hoverDivs.forEach((element) => {
    element.remove();
  });

}

function isAncestorOf(ancestors, element) {
  ancestors.forEach((ancestor) => {
    if (ancestor.tagName != "BODY" && ancestor.contains(element)) {
      return true;
    }
  });
  return false;
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

