class Basic extends HTMLElement {
    connectedCallback() {

        let title = this.getAttribute('title') || "document";
        let style_name = this.getAttribute('style_name') || "style";

        this.innerHTML = 
        `
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${title}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link rel="stylesheet" as="style" crossorigin
            href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reset-css@4.0.1/reset.min.css" />
        <link rel="stylesheet" href="${style_name}.css" />
        <script src="https://cdn.jsdelivr.net/npm/sweetalert2@10"></script>
        `;
    }
}

customElements.define("head-default", Basic);
