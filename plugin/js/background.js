// Exemplo de evento para criar uma notificação
function notifyUser(title, message) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "../images/info-icon.png", // Certifique-se de adicionar esse ícone ao diretório da extensão
    title: title,
    message: message,
    priority: 2
  });
}

function salvarDados(chave, valor) {
  let obj = {};
  obj[chave] = valor;
  console.log("dados recebidos: ", obj)
  chrome.storage.local.set(obj, function () {
    console.log('Dados salvos:', chave, valor);
  });
}
function recuperarDados(chave) {
  chrome.storage.local.get([chave], function (result) {
    console.log('Dados recuperados!');
    return result[chave];
  });
}
function removerDados(chave) {
  chrome.storage.local.remove(chave, function () {
    console.log('Dados removidos:', chave);
  });
}


// Ouvir mensagens 
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "salvar") {
    salvarDados(message.chave, message.valor); sendResponse({ status: 'Dados salvos com sucesso' });
  } else if (message.action === "recuperar") {
    recuperarDados(message.chave);
    return true;
  } else if (message.action === "remover") {
    removerDados(message.chave);
    sendResponse({ status: 'Dados removidos com sucesso' });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.event === "triggerNotificationCountdownTimer") {

    notifyUser("Possível Dark Pattern Econtrado", "Contagem regressiva falsa: verifique seu plugin para localizá-lo e confirmar se ele se aplica ao cenário identificado.");
    sendResponse({ success: true });
  }
  else if(request.event === "triggerNotificationLowStockMessage"){
    console.log("teste");
    
    notifyUser("Possível Dark Pattern Econtrado", "Mensagem Falsa de Estoque Baixo: verifique seu plugin para localizá-lo e confirmar se ele se aplica ao cenário identificado.");
    sendResponse({ success: true });
  }
});

