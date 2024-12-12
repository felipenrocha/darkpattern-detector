chrome.action.onClicked.addListener((tab)=>{
    chrome.scripting.executeScript({
        func: () => {
            const myButton: HTMLButtonElement = document.createElement('button');
            myButton.textContent = 'Hello World!';
            myButton.onclick = () => {
                alert("hello world");
            }   
            document.body.appendChild(myButton);
        },
        target: {
            tabId: tab.id || 0
        }
    }).then(() =>{
        console.log('button inserted');
    });

});