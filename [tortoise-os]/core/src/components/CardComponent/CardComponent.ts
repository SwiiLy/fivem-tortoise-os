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
			this.shadowRoot!.querySelector<HTMLElement>('[id="soldeContent"]')!.innerText = newValue.replace(/\B(?=(\d{3})+(?!\d))/g, "'");
			this.shadowRoot!.querySelector<HTMLElement>('[id="retraitInput"]')!.setAttribute("max",newValue)
        } 
		if (name=="visible"){
			if (newValue=="true") {
				document.getElementById("CardComponent")!.hidden = false
			} else {
				document.getElementById("CardComponent")!.hidden = true
			}
		}
    }

}
customElements.define("card-component", CardComponent);
