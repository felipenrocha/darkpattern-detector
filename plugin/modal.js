// Seleciona o ícone de informação e o modal de fake
let infoIcon = document.getElementById('fake-timer-info');
let modal = document.getElementById('info-fake-timer-modal');
let closeModal = document.querySelector('.close-btn-fake-timer');
let showCountdownDivs = document.getElementById('showCountdownDivs');

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

showCountdownDivs.addEventListener('click', () => {
    let chave = "createdDivsCountdown";
    chrome.storage.local.get([chave], function (result) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: removeBorda, // Função executada no content script
            });
        });
    });

});

const fakeTimerCheckbox = document.getElementById('fake-timer');

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

