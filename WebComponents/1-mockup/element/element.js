class Element extends HTMLElement {
    
    constructor () {
        super();
        console.log("constructor");
        this.shadow = this.attachShadow({mode: "open"});
    }

    connectedCallback () {
        let template = document.currentScript.ownerDocument.querySelector('template');

        template = template.cloneNode(true);

        template.content.querySelector('h1').innerText = this.attributes.label.value;
        template.content.querySelector('img').src = this.attributes.photo.value;
        
        this.shadow.appendChild(template.content);
    }
}

window.customElements.define('mockup-element', Element);