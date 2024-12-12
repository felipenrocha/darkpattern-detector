// arquivo designado para programar a deteccao e lóogica para seção dos dark patterns de urgencia



// Seleciona o ícone de informação e o modal de fake
let infoIcon = document.getElementById('fake-timer-info'); 
let modal = document.getElementById('info-fake-timer-modal');
let closeModal = document.querySelector('.close-btn-fake-timer');
let classesCountdown = ['timer', 'countdown', 'clock', 'time'];
let contentCountdown = ["Expira em", "Resta Apenas", "Termina em", "dias restantes"]
// Function that returns elements div with countdown classes or content
function getElementsCountdown(elements) {
  let foundElements = [];

  elements.forEach((element) => {
    // Check if any ancestor of the current element is already in foundElements
    let ancestorExists = false;
    let currentElement = element;

    while (currentElement && currentElement.tagName !== 'HTML') {
      if (foundElements.includes(currentElement)) {
        ancestorExists = true;
        break;
      }
      currentElement = currentElement.parentElement; // Move to the parent element
    }

    if (ancestorExists) {
      return; // Skip this element if any ancestor is already in foundElements
    }

    // Check classes
    if (element.tagName !== 'BODY' && element.tagName !== 'HTML') {
      for (let i = 0; i < classesCountdown.length; i++) {
        const currentClass = classesCountdown[i];
        if (element.className && element.className.toString().includes(currentClass)) {
          if (!foundElements.includes(element)) {
            foundElements.push(element);
          }
        }
      }

      // Check content
      for (let i = 0; i < contentCountdown.length; i++) {
        const currentText = contentCountdown[i];
        if (element.textContent && element.textContent.includes(currentText)) {
          if (!foundElements.includes(element)) {
            foundElements.push(element);
          }
        }
      }
    }
  });

  return foundElements;
}

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

const fakeTimerCheckbox = document.getElementById('fake-timer');


function toggleFakeTimerBorder(isChecked) {
  console.log('in');
  
  const elements = document.querySelectorAll('*'); // Selects all elements (consider specific selectors for performance)
  let foundElements = getElementsCountdown(elements);
  console.log(foundElements);

  if (isChecked) {
    foundElements.forEach((element) => {
      element.style.border = "2px solid red";
    });

  } else {
    console.log('in again');
    
    foundElements.forEach((element) => {
      element.style.border = "";
    });
  }
}

// Adiciona um evento para monitorar mudanças no estado do checkbox

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
