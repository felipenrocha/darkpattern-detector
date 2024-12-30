
let elementos = []
let buttonFound = false;
let acceptTexts = ['aceitar', 'accept', 'permitir', 'allow', 'concordar', 'continuar'];
let refuseTexts = ['manage', 'escolhas', 'preferencias', 'gerenciar', 'preferences', 'configurar', 'configurações'];

function toggleCookiesDeny(isChecked) {
    // Buscar todos os elementos da página
    console.log("in");

    const novosElementos = document.querySelectorAll('*');

    novosElementos.forEach((el) => {
        if (el.tagName === 'BODY' || el.tagName === 'SCRIPT' || el.tagName === 'HTML') {
            return; //pula tags
        }

        // Verificar se o texto do elemento contém qualquer item do array acceptTexts
        for (let text of acceptTexts) {
            if (el.textContent.toLowerCase().includes(text.toLowerCase())) {
                // Caso o elemento seja um botão de "aceitar", podemos clicar nele
                if (el.tagName === 'BUTTON' || el.tagName === 'A') {
                    buttonFound = true;
                    console.log('Elemento encontrado: ', el);
                    const acceptButton = el;
                    let parent = el;

                    while (parent && !parent.textContent.toLowerCase().includes('cookie')) {
                        parent = parent.parentNode;  // Sobe para o próximo nível do DOM
                    }
                    console.log("Parent: ", parent);
                    
                    const refuseButton = Array.from(parent.querySelectorAll('button, a')).find(elm =>
                        refuseTexts.some(refuseText => elm.textContent.toLowerCase().includes(refuseText.toLowerCase()))
                    );
                    if(!refuseButton){
                        console.log("Não foram encontrados botões para gerenciar ou recusar cookies. Clicando Botão de Aceitar.")
                        acceptButton.click();
                    }
                    console.log("Refuse button: ", refuseButton);
                    

                }
                break; // Se encontrar, não precisa verificar os outros textos do array
            }
        }
    });

}

function scrollToCookies() {

}

let timerCookies = setInterval(function () {
    if (!buttonFound) {
        toggleCookiesDeny(true)
    }
    else {
        clearInterval(timerCookies);
    }

},
    2000)
