
let elementos = []
let buttonFound = false;
let acceptTexts = [
    'aceitar', 'accept', 'permitir', 'allow', 'concordar',
    'continuar', 'ok', 'sim', 'yes', 'entendido',
    'entendi', 'proceed', 'agree', 'confirmar',
    'confirm', 'save and accept', 'consentir', 'approve'
];

let manageTexts = [
    'manage', 'escolhas', 'preferencias', 'gerenciar',
    'preferences', 'configurar', 'configurações', 'ajustes',
    'settings', 'personalizar', 'customize', 'editar',
    'edit', 'opt-out', 'alterar', 'modificar'
];

let rejectTexts = [
    'recusar', 'rejeitar', 'não aceitar', 'deny',
    'decline', 'refuse', 'cancelar', 'não concordar'
];
let cookiesElement = []; // array de quadruplos elementos: [[Parent do botao de aceitar, botao de aceitar, botao de recusar, botao de preferencias]] de cada possivel cookie pra recusar.
let indiceCookie = -1;
let cookieElement = [];

function removeDuplicateParents(cookiesElement) {

    // Função auxiliar para verificar se um elemento é ancestral de outro
    function isAncestor(parent, child) {
        if (!child || !parent) {
            return false;
        }
        if (parent.contains(child)) {
            return true;
        }
        return false;
    }

    // Marcar sub-arrays para remoção
    const removeIndices = [];
    for (let i = 0; i < cookiesElement.length; i++) {
        const [parent, acceptButton, rejectButton, preferencesButton] = cookiesElement[i];
        for (let j = i + 1; j < cookiesElement.length; j++) {
            const [otherParent, otherAcceptButton, otherRejectButton, otherPreferencesButton] = cookiesElement[j];
            if (isAncestor(parent, otherAcceptButton) ||
                isAncestor(parent, otherRejectButton) ||
                isAncestor(parent, otherPreferencesButton)) {
                removeIndices.push(i);
                break; // Não precisamos verificar mais para este sub-array
            }
        }
    }
    removeIndices.sort((a, b) => b - a); // Ordenar os índices em ordem decrescente para evitar deslocamentos
    // Remover os elementos na ordem inversa
    removeIndices.forEach(index => {
        cookiesElement.splice(index, 1);
    });
    return cookiesElement;
}


function toggleCookiesDeny(isChecked) {
    // Buscar todos os elementos da página
    let possibleCookies = [];
    const novosElementos = document.querySelectorAll('*');

    novosElementos.forEach((el) => {
        if (el.tagName === 'BODY' || el.tagName === 'SCRIPT' || el.tagName === 'HTML') {
            return; //pula tags
        }

        // Verificar se o texto do elemento contém qualquer item do array acceptTexts
        for (let text of acceptTexts) {
            if ((el.tagName === 'BUTTON' || el.tagName === 'A') && el.textContent.toLowerCase().includes(text.toLowerCase())) {
                // Caso o elemento seja um botão de "aceitar", podemos clicar nele
                buttonFound = true;
                const acceptButton = el;
                let parent = el;

                while (parent && !parent.textContent.toLowerCase().includes('cookie')) {
                    parent = parent.parentNode;  // Sobe para o próximo nível do DOM
                }
                if (parent.tagName === 'BODY' || el.tagName === 'SCRIPT' || el.tagName === 'HTML' || !parent.textContent.toLowerCase().includes('cookie')) {

                } else {

                    const manageButton = Array.from(parent.querySelectorAll('button, a')).find(elm =>
                        manageTexts.some(manageText => elm.textContent.toLowerCase().includes(manageText.toLowerCase()))
                    );
                    const refuseButton = Array.from(parent.querySelectorAll('button, a')).find(elm =>
                        rejectTexts.some(rejectText => elm.textContent.toLowerCase().includes(rejectText.toLowerCase()))
                    );
                    possibleCookies.push([parent, acceptButton, refuseButton, manageButton]);
                }
                break; // Se encontrar, não precisa verificar os outros textos do array
            }
        }
    });

    possibleCookies = removeDuplicateParents(possibleCookies);
    // let montarHTML = montarHTMLCookiesElement(cookiesElement);
    // getCookieElement(cookiesElement);

    return possibleCookies;


}

function scrollToCookies() {

}

let timerCookies = setInterval(function () {
    if (cookiesElement.length != toggleCookiesDeny(true).length) {
        console.log("Novo elemento encontrado, alterando possiveis cookies...")
        cookiesElement = toggleCookiesDeny(true);
        console.log("Possiveis cookies: ", cookiesElement);
        loadCookiesIndex();
        console.log("Indice cookie: ", indiceCookie);
        if (indiceCookie != -1) {
            cookieElement = cookiesElement[indiceCookie - 1];
            console.log("cookie element: ", cookieElement);
        }


    } else {
        console.log("Parando Busca Intervalo...")
        if (indiceCookie != -1) {
            cookieElement = cookiesElement[indiceCookie - 1];
            console.log("Cookie escolhido: ", cookieElement);
            const [parent, acceptButton, refuseButton, manageButton] = cookieElement;

            if (refuseButton) {
                console.log("Rejeitando Cookies. Botão apertado: ", refuseButton);
                refuseButton.click();
                console.log("Cookies rejeitados.")
            }
            else if (manageButton) {
                console.log("Não foram encontrados seções para recusa de Cookies. Buscando Botão para gerenciar preferências...");
                console.log("Abrindo preferências. Botão apertado: ", manageButton);
                manageButton.click();
            }


        } else {
            console.log("Não foram encontrados seções para recusa de Cookies nem aceitação de cookies.");

        }
        clearInterval(timerCookies);
    }
}, 2000)


async function loadCookiesIndex() {
    indiceCookie = await getCookieElement(cookiesElement);
}