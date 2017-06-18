class Element extends HTMLElement {
    
    constructor () {
        super();
        console.log("constructor");
        this.shadow = this.attachShadow({mode: "open"});
        this.profileTemplate = document.currentScript.ownerDocument.querySelector('#profile');
        this.repoTemplate = document.currentScript.ownerDocument.querySelector('#repo');
    }

    connectedCallback () {
        this.fetch(this.attributes.profile.value).then(this.render.bind(this));        
    }

    render ({profile, repos}) {
        let profileTemplate = this.profileTemplate.cloneNode(true);
        
        this.fillTemplate(profileTemplate.content, profile);

        this.renderRepos(profileTemplate.content.querySelector('ul'), repos)
        
        this.shadow.appendChild(profileTemplate.content);
    }

    renderRepos (elem, repos) {
        repos = repos.filter(item => item.stargazers_count)
        repos.sort((a, b) => b.stargazers_count - a.stargazers_count);
        repos = repos.slice(0, this.attributes.repos.value);

        for (let repo of repos) {
            let repoTemplate = this.repoTemplate.cloneNode(true);
            
            this.fillTemplate(repoTemplate.content, repo);

            elem.appendChild(repoTemplate.content);
        }
    }

    fillTemplate (content, obj) {
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