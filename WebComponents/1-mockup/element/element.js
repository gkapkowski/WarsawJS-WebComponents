(function () {
class Element extends HTMLElement {

    constructor () {
        super();
        console.log("constructor");
        this.shadow = this.attachShadow({mode: "open"});
    }

    connectedCallback () {
        let template = Element.doc.querySelector('template');

        template = template.cloneNode(true);

        template.content.querySelector('h1').innerText = this.attributes.label.value;
        template.content.querySelector('img').src = this.attributes.photo.value;
        
        this.shadow.appendChild(template.content);
    }
}

Element.doc = document.currentScript.ownerDocument;

window.customElements.define('mockup-element', Element);    

})();
