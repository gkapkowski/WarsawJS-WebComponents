(function () {
class Element extends HTMLElement {
    
    constructor () {
        super();
        console.log("constructor");
        this.shadow = this.attachShadow({mode: "open"});
        this.template = Element.doc.querySelector('template');

        this.index = 0;
    }

    connectedCallback () {
        let template = this.template.cloneNode(true);
        this.elem = template.content;
        
        this.elem.querySelector("button.play").addEventListener('click', this.play.bind(this));
        this.elem.querySelector("button.stop").addEventListener('click', this.stop.bind(this));

        this.shadow.appendChild(this.elem);

        this.fill(this.index);
    }

    fill (index) {
        let slide = this.shadow.querySelector("#slide");

        while (slide.hasChildNodes()) {
            slide.removeChild(slide.lastChild);
        }

        slide.appendChild(this.children[index].cloneNode(true));
    }

    play () {
        this.timer = setInterval(() => {
            console.log(this.index, this.children.length);
            
            this.fill(this.index);

            this.index = this.index === this.children.length - 1 ? 0 : this.index + 1;
        }, 2000);
    }

    stop () {
        clearInterval(this.timer);
    }

}

Element.doc = document.currentScript.ownerDocument;

window.customElements.define('slides-player', Element);    
    
})();
