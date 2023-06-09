import html from "./CardComponent.html?raw";
import style from "./CardComponent.scss";
import axios from 'axios';


export class CardComponent extends HTMLElement {
    
    static get observedAttributes() { return ["visible", "set"];}

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot!.innerHTML = html;
        const styleElement = document.createElement("style");
        styleElement.innerHTML = style;
        this.shadowRoot?.appendChild(styleElement);
    }



    connectedCallback() {
    }

	handleRetrait(){
		let input = this.shadowRoot!.querySelector<HTMLInputElement>('[id="retraitInput"]')!;
		let value = Number(input.value)
		if(!value || Number.isNaN(Number(value)) || value <= 0){
			document.getElementById("NotificationComponent")!.setAttribute("new", JSON.stringify({title:"Banque", content:"La quantité n'est pas valide.", color:"error"}))
			return
		}
		input.value = ""
		axios.post("http://core/retrait", {value: Number(value)}).then()
	}

    attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
        if (name=="set") {
			let character = JSON.parse(newValue)
			let createdDate = new Date(Number(character.createdAt))
			let createdText = (createdDate.getDate()<10?'0'+createdDate.getDate():createdDate.getDate())+'/'+((createdDate.getMonth()+1)<10?'0'+(createdDate.getMonth()+1):(createdDate.getMonth()+1))+'/'+createdDate.getFullYear();
			let birthDate = new Date(Number(character.birthday))
			let birthText = (birthDate.getDate()<10?'0'+birthDate.getDate():birthDate.getDate())+'/'+((birthDate.getMonth()+1)<10?'0'+(birthDate.getMonth()+1):(birthDate.getMonth()+1))+'/'+birthDate.getFullYear();
			this.shadowRoot!.querySelector<HTMLElement>('[id="cardId"]')!.innerText = "00049342000000"+character.id
			this.shadowRoot!.querySelector<HTMLElement>('[id="cardName"]')!.innerText = character.firstName+" "+character.lastName
			this.shadowRoot!.querySelector<HTMLElement>('[id="cardBirthday"]')!.innerText = birthText
			this.shadowRoot!.querySelector<HTMLElement>('[id="cardSexe"]')!.innerText = character.sexe
			this.shadowRoot!.querySelector<HTMLElement>('[id="cardCreatedAt"]')!.innerText = createdText
        } 
		if (name=="visible"){
			if (newValue=="true") {
				document.getElementById("CardComponent")!.hidden = false
				setTimeout(() => {
					document.getElementById("CardComponent")!.hidden = true
				}, 10000);
			} else {
				document.getElementById("CardComponent")!.hidden = true
			}
		}
    }

}
customElements.define("card-component", CardComponent);
