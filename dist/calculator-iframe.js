(function () {
    const calculatorUrl = "https://obg-calculator.netlify.app/";

    function createIframe(scriptTag) {
        if (!scriptTag) return;

        const iframe = document.createElement("iframe");
        iframe.src = calculatorUrl;
        iframe.width = "100%";
        iframe.height = "600px";
        iframe.style.border = "none";
        iframe.style.display = "block";
        iframe.style.margin = "20px auto";
        iframe.style.maxWidth = "1200px";

        scriptTag.parentNode.insertBefore(iframe, scriptTag);
    }

    document.addEventListener("DOMContentLoaded", function () {
        let scriptTag = document.querySelector('script[data-embed="calculator-iframe"]');

        if (!scriptTag) {
            const scripts = document.getElementsByTagName("script");
            scriptTag = scripts[scripts.length - 1];
        }

        if (scriptTag) {
            createIframe(scriptTag);
        } else {
            console.error("Calculator iframe embed: No script tag found!");
        }
    });
})();


// <script data-embed="calculator-iframe" src="calculator-iframe.js"></script>