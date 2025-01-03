
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
    'recusar', 'rejeitar', 'não aceitar', 'deny', 'negar',
    'decline', 'refuse', 'cancelar', 'não concordar', 'reject', 'necessary', "Necessary", "dispensar"
];
let cookiesElement = []; // array de quadruplos elementos: [[Parent do botao de aceitar, botao de aceitar, botao de recusar, botao de preferencias]] de cada possivel cookie pra recusar.
let indiceCookie = -1;
let cookieElement = [];
let cookieProcessed = false;
let lookForCookies = 0;

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


function getCookiesDeny(isChecked) {
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

                while ((parent && parent.textContent && !parent.textContent.toLowerCase().includes('cookie')) || parent == el) {
                    parent = parent.parentNode;  // Sobe para o próximo nível do DOM
                }


                const manageButton = Array.from(parent.querySelectorAll('button, a')).find(elm =>
                    manageTexts.some(manageText => elm.textContent.toLowerCase().includes(manageText.toLowerCase()))
                );
                const refuseButton = Array.from(parent.querySelectorAll('button, a')).find(elm =>
                    rejectTexts.some(rejectText => elm.textContent.toLowerCase().includes(rejectText.toLowerCase()))
                );
                if (!parent.tagName || parent.tagName === 'DOCUMENT' || parent.tagName === 'BODY' || el.tagName === 'SCRIPT' || el.tagName === 'HTML') {
                    // do nothing
                } else {
                    
                    possibleCookies.push([parent, acceptButton, refuseButton, manageButton]);
                }
                // break; // Se encontrar, não precisa verificar os outros textos do array
            }
        }
    });

    possibleCookies = removeDuplicateParents(possibleCookies);
    return possibleCookies;


}

function scrollToCookies() {

}


async function loadCookiesIndex() {
    // cookiesElement = getCookiesDeny(true);
    indiceCookie = await getCookieElement(cookiesElement);
}


let timerCookie = setInterval(async function () {
    // Configuração do MutationObserver
    if (cookieProcessed || (lookForCookies > 5)) {
        clearInterval(timerCookie);
        return;// ja achou cookie
    }

    let oldLength = cookiesElement.length;
    cookiesElement = getCookiesDeny(true);
    console.log('Cookies Element: ', cookiesElement);
    if ((cookiesElement.length > 0) && (oldLength != cookiesElement.length)) {
        console.log("Possiveis cookies encontrados. Finalizando DOM Lookup.");
        console.log('Cookies Element: ', cookiesElement);
        console.log('Cookies Element Length: ', cookiesElement.length);
        // getCookieElement(cookiesElement);
        const prompt = montarPromptGetCookieElement(cookiesElement);
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                }),
            });

            const data = await response.json();
            if (data.error) {
                console.error("API Error:", data.error);
            } else {
                const indice = JSON.parse(data.candidates[0]['content']['parts'][0]['text']);
                // console.log("Prompt: ", prompt)
                cookieElement = cookiesElement[indice - 1];
                const [parent, acceptButton, refuseButton, manageButton] = cookieElement;
                console.log('cookie Chosen: ', cookieElement);
                cookieProcessed = true;
                if (refuseButton) {
                    console.log("Encontrado Botão de recusar cookies:", refuseButton);
                    console.log("Apertando Botão de recusar cookies... ");
                    refuseButton.click();
                    console.log("Botão apertado. Cookies recusados.");
                }
                else if (manageButton) {
                    console.log("Encontrado botão de definições:", manageButton);
                    console.log("Apertando Botão de definições... ");
                    let oldCookies = cookiesElement;
                    console.log("Old cookies: ", oldCookies);
                    manageButton.click(); // clica
                    setTimeout(
                        async function () {
                            cookiesElement = getCookiesDeny(true);
                            // Filtra elementos do novo array que não estão no antigo
                            cookiesElement.splice(0, oldCookies.length - 1)
                            console.log("New cookies element: ", cookiesElement);
                            // console.log("Unique Elements: ", uniqueElements);

                            const prompt = montarPromptGetCookieElement(cookiesElement);
                            // console.log("Prompt: ", prompt);

                            try {
                                const response = await fetch(API_URL, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        contents: [{
                                            parts: [{ text: prompt }]
                                        }]
                                    }),
                                });

                                const data = await response.json();
                                const indice = JSON.parse(data.candidates[0]['content']['parts'][0]['text']);
                                // console.log("Prompt: ", prompt)
                                cookieElement = cookiesElement[indice - 1];
                                const [parent, acceptButton, refuseButton, manageButton] = cookieElement;
                                console.log('Cookie Chosen Definition Chosen: ', cookieElement);
                                if (refuseButton) {
                                    console.log("Encontrado Botão de recusar cookies:", refuseButton);
                                    console.log("Apertando Botão de recusar cookies... ");
                                    refuseButton.click();
                                    console.log("Botão apertado. Cookies recusados.");
                                }


                            } catch (error) {
                                data = await error.json();
                                console.error("Request failed:", data);
                                alert("Erro na LLM!");

                                return false;
                            }





                        }, .5); // delay para abrir preferencias


                }
                else if (acceptButton) {
                    console.log("Encontrado Apenas Botão de aceitar cookies:", acceptButton);
                    console.log("Apertando Botão de aceitar cookies... ");
                    acceptButton.click();
                    console.log("Botão apertado. Cookies recusados.");
                }
            }
        }
        catch (error) {
            data = await error.json();
            console.error("Request failed:", data);
            alert("Erro na LLM!");

            return false;
        }

    }
    lookForCookies++;
}, 2000);

