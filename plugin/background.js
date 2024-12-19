// Exemplo de evento para criar uma notificação
function notifyUser(title, message) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "images/info-icon.png", // Certifique-se de adicionar esse ícone ao diretório da extensão
    title: title,
    message: message,
    priority: 2
  });
}



// title: "Possível Dark Pattern Econtrado",
// message: "Fake Countdown Timer: verifique seu plugin para localizá-lo e confirmar se ele se aplica ao cenário identificado.",


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.event === "triggerNotificationCountdownTimer") {
    notifyUser("Possível Dark Pattern Econtrado", "Fake Countdown Timer: verifique seu plugin para localizá-lo e confirmar se ele se aplica ao cenário identificado.");
    sendResponse({ success: true });
  }
});

