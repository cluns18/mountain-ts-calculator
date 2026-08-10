(function () {
    const calculatorUrl = "https://obg-calculator.netlify.app/";

    function createModal() {
        const modal = document.createElement("div");
        modal.id = "calculator-modal";
        modal.style.position = "fixed";
        modal.style.top = "0";
        modal.style.left = "0";
        modal.style.width = "100vw";
        modal.style.height = "100vh";
        modal.style.backgroundColor = "rgba(0,0,0,0.5)";
        modal.style.display = "none";
        modal.style.justifyContent = "center";
        modal.style.alignItems = "center";
        modal.style.zIndex = "1000";

        const iframe = document.createElement("iframe");
        iframe.src = calculatorUrl;
        iframe.width = "90%";
        iframe.height = "80%";
        iframe.style.border = "none";
        iframe.style.background = "white";
        iframe.style.borderRadius = "10px";

        const closeButton = document.createElement("button");
        closeButton.innerHTML = "×";
        closeButton.style.position = "absolute";
        closeButton.style.top = "10px";
        closeButton.style.right = "20px";
        closeButton.style.fontSize = "24px";
        closeButton.style.border = "none";
        closeButton.style.background = "none";
        closeButton.style.color = "white";
        closeButton.style.cursor = "pointer";
        closeButton.onclick = () => (modal.style.display = "none");

        modal.appendChild(iframe);
        modal.appendChild(closeButton);
        document.body.appendChild(modal);

        return modal;
    }

    function createButton(modal, scriptTag) {
        if (!scriptTag) return;

        const button = document.createElement("button");
        button.innerText = "Open Calculator";
        button.style.padding = "10px 20px";
        button.style.cursor = "pointer";
        button.onclick = () => (modal.style.display = "flex");

        scriptTag.parentNode.insertBefore(button, scriptTag);
    }

    document.addEventListener("DOMContentLoaded", () => {
        let scriptTag = document.querySelector('script[data-embed="calculator-modal"]');

        if (!scriptTag) {
            const scripts = document.getElementsByTagName("script");
            scriptTag = scripts[scripts.length - 1];
        }

        if (scriptTag) {
            const modal = createModal();
            createButton(modal, scriptTag);
        } else {
            console.error("Calculator modal embed: No script tag found!");
        }
    });
})();


// <script data-embed="calculator-modal" src="calculator-modal.js"></script>