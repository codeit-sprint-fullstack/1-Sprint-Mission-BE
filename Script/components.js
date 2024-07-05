class Head extends HTMLElement {

    connectedCallback() {
       this.innerHTML = 
       `
    <Header class="Header">
        <div class="Header_Wrapper">
            <a class="Header_Logo" href="/">
                <img src="headlogo.svg" alt="Header_Logo">
            </a>
            <a class="Header_Logo2" href="/">
                <img src="lillogo.svg" alt="">
            </a>
            <div class="Header_Text">
                <div>
                    자유게시판
                </div>
                <div>
                    중고마켓
                </div>
            </div>
            <a href="./login" class="Login_Button">
                로그인
            </a>
        </div>
       `
    }
 }
 
 customElements.define("panda-head", Head);

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
