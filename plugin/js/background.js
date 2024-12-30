// Exemplo de evento para criar uma notificação
function notifyUser(title, message) {
  // chrome.notifications.create({
  //   type: "basic",
  //   iconUrl: "../images/info-icon.png", // Certifique-se de adicionar esse ícone ao diretório da extensão
  //   title: title,
  //   message: message,
  //   priority: 2
  // });
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.event === "triggerNotificationCountdownTimer") {

    notifyUser("Possível Dark Pattern Econtrado", "Contagem regressiva falsa: verifique seu plugin para localizá-lo e confirmar se ele se aplica ao cenário identificado.");
    sendResponse({ success: true });
  }
  else if(request.event === "triggerNotificationLowStockMessage"){
    notifyUser("Possível Dark Pattern Econtrado", "Mensagem Falsa de Estoque Baixo: verifique seu plugin para localizá-lo e confirmar se ele se aplica ao cenário identificado.");
    sendResponse({ success: true });
  }
});

