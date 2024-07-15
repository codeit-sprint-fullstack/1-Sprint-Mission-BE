class Head extends HTMLElement {
  connectedCallback() {
    const homeUrl = this.dataset.homeUrl || "/";
    const loginUrl = this.dataset.loginUrl || "./login";

    this.innerHTML = `
          <Header class="Header">
              <div class="Header_Wrapper">
                  <a class="Header_Logo" href="${homeUrl}">
                      <img src="../images/headLogo.svg" alt="Header_Logo">
                  </a>
                  <a class="Header_Logo2" href="${homeUrl}">
                      <img src="../images/lilLogo.svg" alt="">
                  </a>
                  <div class="Header_Text">
                      <div>
                          자유게시판
                      </div>
                      <div>
                          중고마켓
                      </div>
                  </div>
                  <a href="${loginUrl}" class="Login_Button">
                      로그인
                  </a>
              </div>
          </Header>
      `;
  }
}

customElements.define("GNB", Head);
