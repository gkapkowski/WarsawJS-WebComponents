const CONTRACT_ADDRESS = '0x0a48ac8263d9d79768d10cf9d7e82a19c49f0002';

function sendClaim(target, address, value) {
  return new Promise((resolve) => {
    const claim = {
      claim: { target },
      credits: [{
        type: 'interface',
        value: window.location.href,
      }],
    };
    const abi = [{
      constant: false,
      inputs: [
        { name: 'userfeed', type: 'address' },
        { name: 'data', type: 'string' },
      ],
      name: 'post',
      outputs: [],
      payable: true,
      type: 'function',
    }, {
      anonymous: false,
      inputs: [
        { indexed: false, name: 'sender', type: 'address' },
        { indexed: false, name: 'userfeed', type: 'address' },
        { indexed: false, name: 'data', type: 'string' },
      ],
      name: 'Claim',
      type: 'event',
    }];

    const contract = web3.eth.contract(abi).at(CONTRACT_ADDRESS);

    contract.post(address, JSON.stringify(claim), { value: web3.toWei(value, 'ether') }, resolve);
  });
}


class Endorse extends HTMLElement {

    constructor () {
        super();
        console.log('constructor');
        this.shadow = this.attachShadow({mode: "open"});
    }

    attributeChangedCallback () {
        console.log('attributeChangeCallback')
    }

    connectedCallback () {
        console.log('connectedCallback')

        let template = document.currentScript.ownerDocument.querySelector('template');
        template = template.cloneNode(true);

        let button = template.content.querySelector('button')
        button.innerText = this.attributes.label.value;
        button.addEventListener('click', this.click.bind(this));

        this.shadow.appendChild(template.content);
    }

    disconnectedCallback () {
        console.log('disconnectedCallback')
    }

    adoptedCallback () {
        console.log('adoptedCallback')
    }

    click () {
        console.log('click')
        sendClaim(window.location.href, 
            this.attributes.address.value,
            this.attributes.value.value)
    } 
};

window.customElements.define('userfeeds-button', Endorse);