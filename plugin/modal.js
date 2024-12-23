// Seleciona o ícone de informação e o modal de fake
let infoIconCountdown = document.getElementById('fake-timer-info');
let modal = document.getElementById('info-fake-timer-modal');
let closeModal = document.querySelector('.close-btn-fake-timer');
let showCountdownDivs = document.getElementById('showCountdownDivs');



function showDarkPatternModal(darkPatternName, textContent, imageSrc, sourceLink, sourceTitle) {
    // Verifica se o modal já existe e remove-o
    const existingModal = document.getElementById('dynamic-dark-pattern-modal');
    if (existingModal) {
        existingModal.remove();
    }

    // Cria o modal dinamicamente
    const modal = document.createElement('div');
    modal.id = 'dynamic-dark-pattern-modal';
    modal.className = 'modal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modal.style.zIndex = '1000';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';

    // Conteúdo do modal
    modal.innerHTML = `
        <div id="info-fake-timer-modal" class="modal">

      <div class="modal-content">
        <span class="close-btn-fake-timer">&times;</span>
        <h2>${darkPatternName}</h2>
        <p style="text-align: justify;">${textContent}</p>
         <p>Fonte: <a href=${sourceLink} target="_blank"
                        rel="noopener noreferrer">
                       ${sourceTitle}
                    </a></p>
        <p style="text-align: justify;">Exemplo de ${darkPatternName}:</p>
            <img src=${imageSrc} alt="Exemplo de contagem regressiva falsa"
                    style="display: block; margin: 20px auto; height: 170px;">      </div>
      </div>
    `;

    // Adiciona o modal ao body
    document.body.appendChild(modal);

    // Exibe o modal
    modal.style.display = 'flex';

    // Adiciona funcionalidade ao botão de fechar
    const closeButton = modal.querySelector('.close-btn-fake-timer');
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
        modal.remove();
    });

    // Fecha o modal ao clicar fora do conteúdo
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            modal.remove();
        }
    });
}
// Mostra o modal ao clicar no ícone
infoIconCountdown.addEventListener('click', () => {
    const darkPatternName = "Fake Countdown Timer";
    const textContent = `
    <p style="text-align: justify;">
            Cronômetros falsos de promoções são usados para criar um senso de  urgência no consumidor,
    pressionando-o a tomar decisões rápidas. 
    <br>
    Quando um usuário é pressionado por um limite de tempo, sua capacidade
    de analisar criticamente as informações apresentadas é reduzida devido à escassez de tempo e ao
    impacto do estresse ou da ansiedade. Provedores podem explorar essa situação para induzi-lo a tomar
    decisões rapidamente, muitas vezes contrárias aos seus próprios interesses.
    <br>Reflita se essa promoção é realmente única neste momento e evite sentir-se pressionado a adquirir um item apenas porque a oferta está prestes a expira
    </p>`;
    const imageSrc =  'examples/fake-countdown.png';
    const sourceLink = 'https://www.deceptive.design/types/fake-urgency';
    const sourceTitle =  "Deceptive Design - Fake Urgency";
    showDarkPatternModal(darkPatternName,textContent, imageSrc, sourceLink,sourceTitle );
});


showCountdownDivs.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: scrollToCountdown, // Função executada no content script
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

