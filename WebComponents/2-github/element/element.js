class Element extends HTMLElement {
    
    constructor () {
        super();
        console.log("constructor");
        this.shadow = this.attachShadow({mode: "open"});
    }

    connectedCallback () {
        let profileTemplate = document.currentScript.ownerDocument.querySelector('#profile');
        let repoTemplate = document.currentScript.ownerDocument.querySelector('#repo');

        this.fetch(this.attributes.profile.value).then(({profile, repos}) => {
            profileTemplate = profileTemplate.cloneNode(true);
            
            this.fill(profileTemplate.content, profile);

            let repoList = profileTemplate.content.querySelector('ul');

            repos = repos.filter(item => item.stargazers_count)
            repos.sort((a, b) => a.stargazers_count - b.stargazers_count);

            for (var i = repos.length - 1; i >= 0; i--) {
                let repo = repoTemplate.cloneNode(true);
                
                this.fill(repo.content, repos[i]);

                repoList.appendChild(repo.content);
            }
            
            this.shadow.appendChild(profileTemplate.content);
        });        
    }

    fill (content, obj) {
        for (let key in obj) {
            let elem = content.querySelector(`#${key}`);
            if (elem) {
                switch (elem.tagName) {
                    case "IMG":
                        elem.src = obj[key];
                        break  
                    default: 
                        elem.innerText = obj[key];
                }
            }
        }
    }

    fetch (profile) {
        let profileP = fetch(`${profile}.json`)
        .then(response => response.json());
        
        let reposP = fetch(`${profile}.repos.json`)
        .then(response => response.json());
    
        return Promise.all([profileP, reposP]).then((values) => {
            return new Promise((resolve, reject) => {
                resolve({
                    profile: values[0],
                    repos: values[1],
                })
            })
        });
    }
}

window.customElements.define('github-profile-card-element', Element);