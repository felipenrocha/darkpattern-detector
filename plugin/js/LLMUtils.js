//LLM Stuf
console.log(API_KEY, API_URL);

let shopPageBool = false;
// let indiceCookie = -1;


function montarPromptPaginaCompra() {
    // Domínio atual da página
    const currentDomain = window.location.hostname;

    // Lista de domínios bloqueados (para evitar páginas indesejadas)

    // Regex para encontrar valores de preço em diferentes moedas
    const priceRegex = /(\$|€|£|₹|USD|EUR|INR)[\s\d,.]+/;

    // Buscar elementos na página que contenham texto correspondente à regex de preço
    const priceElements = Array.from(document.querySelectorAll('*')).filter(el => priceRegex.test(el.textContent));

    // Exigindo múltiplos preços na página (por exemplo, em uma lista de produtos)

    // Palavras-chave que indicam uma página de compra
    const keywords = ["product", "shop", "buy", "store", "cart", "checkout", "order", "sale", "discount", "deals"];

    // Contando palavras-chave na URL
    const urlKeywordsCount = keywords.filter(keyword => window.location.href.toLowerCase().includes(keyword)).length;

    // Classes e IDs que indicam elementos relacionados à compra
    const classNames = ["product-list", "cart-item", "checkout-button", "price", "discount"];
    const classNamesCount = classNames.reduce((count, className) => count + document.querySelectorAll(`.${className}`).length, 0);



    const idAttributes = ["product-details", "cart-summary", "payment-form"];
    const idAttributesCount = idAttributes.reduce((count, id) => count + document.querySelectorAll(`#${id}`).length, 0);

    // Montando a mensagem para a IA
    let prompt = `
    Você é uma IA especializada em identificar se essa página é página de compra que possa conter Dark Patterns como escassez, urgência, autoridade falsa, prova social, gratuidade ou compromisso.
    Analisar a página:
    * Domínio: ${currentDomain}    
    Responda apenas com 'true' ou 'false'. 
    Responda 'true' se a página analisada for uma página de identificada ou se o não existir domínio.
    Caso contrário, responda 'false'.
    `

    console.log("Prompt: ", prompt);

    return prompt;
}

// Função para montar o HTML de Cookies
function montarHTMLCookiesElement(cookiesElement) {
    let cookiesText = [];
    cookiesElement.forEach(cookieElement => {
        // console.log("Cookie Element: ", cookieElement);
        const [parent, acceptButton, refuseButton, manageButton] = cookieElement;
        let parentClassesText = parent.clas
        let text =
            `<${parent.tagName.toLowerCase()} class='${parent.className}' id='${parent.id ? parent.id : ''}'>
                <${acceptButton ? acceptButton.tagName.toLowerCase() + "class = '" + acceptButton.className + "' id='" + acceptButton.id + "'" : ''}>
                    ${acceptButton ? acceptButton.innerHTML : ''}
                </${acceptButton ? acceptButton.tagName.toLowerCase() : ''}>

                <${refuseButton ? refuseButton.tagName.toLowerCase() + "class = '" + refuseButton.className + "' id='" + refuseButton.id + "'" : ''}>
                    ${refuseButton ? refuseButton.innerHTML : ''}
                </${refuseButton ? refuseButton.tagName.toLowerCase() : ''}>

                <${manageButton ? manageButton.tagName.toLowerCase() + "class = '" + manageButton.className + "' id='" + manageButton.id + "'" : ''}>
                    ${manageButton ? manageButton.innerHTML : ''}
                </${manageButton ? manageButton.tagName.toLowerCase() : ''}>
            </${parent.tagName.toLowerCase()}>
        `
        text = text.replace(/(\r\n|\n|\r)/gm, "");
        cookiesText.push(text);
    });

    return cookiesText;
}
// 

function montarPromptGetCookieElement(cookiesElement) {
    const cookiesText = montarHTMLCookiesElement(cookiesElement);

    let prompt = `
    Identifique qual dos seguintes elementos HTML representam com maior probabilidade caixas de diálogo de cookies. 
    Responda com um único número, representando o índice do elemento na lista. 
    Se nenhum elemento representar uma caixa de diálogo de cookies, responda com -1.
  
    Numero de elementos a serem analisados: ${cookiesText.length}
    Array dos Elementos HTML:
  
    ${cookiesText}
    Responda sempre com apenas um número e nada mais: Responda -1 caso nenhum elemento represente ou o índice do elemento caso contrário.
    `;

    return prompt;
}
async function getCookieElement(cookiesElement) {
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
            const text = JSON.parse(data.candidates[0]['content']['parts'][0]['text']);
            console.log("Prompt: ", prompt)
            console.log("Resposta Cookie API GEMINI: ", text);
            // indiceCookie = text;
            return text;
        }
    }
    catch (error) {
        data = await error.json();
        console.error("Request failed:", data);
        alert("Erro na LLM!");

        return false;
    }
}

async function isShoppingPage() {
    console.log("API KEY: ", API_KEY);
    console.log("API_URL: ", API_URL);
    return true;
    const currentDomain = window.location.hostname;
    if (currentDomain == '') {
        console.log("current doimain", currentDomain);

        return true;
    }
    const prompt = montarPromptPaginaCompra();
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
            const text = JSON.parse(data.candidates[0]['content']['parts'][0]['text']);
            console.log("Text: ", text);

            if (text.toString() !== 'true' && text.toString() !== 'false') {
                console.log("Erro Text: ", text);

                alert("Erro na LLM!");
                return false;
            }

            return Boolean(text).valueOf();


        }
    }
    catch (error) {
        data = await error.json();
        console.error("Request failed:", data);
        alert("Erro na LLM!");

        return false;
    }
}

async function loadShopPageBool() {
    shopPageBool = await isShoppingPage();
}

loadShopPageBool(); // Detecção se a página é umapagina de compra;

