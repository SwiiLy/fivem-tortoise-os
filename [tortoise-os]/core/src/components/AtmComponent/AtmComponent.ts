import html from "./AtmComponent.html?raw";
import style from "./AtmComponent.scss";
import axios from 'axios';


export class AtmComponent extends HTMLElement {
    
    static get observedAttributes() { return ["visible", "bank"];}

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot!.innerHTML = html;
        const styleElement = document.createElement("style");
        styleElement.innerHTML = style;
        this.shadowRoot?.appendChild(styleElement);


    }



    connectedCallback() {
		this.shadowRoot!.querySelector<HTMLElement>('[id="closeButton"]')!.onclick = () => {
			document.getElementById("AtmComponent")!.hidden = true
			axios.post('http://core/closemenu',{}).then();
		}
		this.shadowRoot!.querySelector<HTMLElement>('[id="retraitInput"]')!.onkeyup = (e:any) => {
			if(e.key==="Enter"){
				this.handleRetrait()
			}
		}
		this.shadowRoot!.querySelector<HTMLElement>('[id="retraitButton"]')!.onclick = () => {
			this.handleRetrait()
		}
    }

	handleRetrait(){
		let input = this.shadowRoot!.querySelector<HTMLInputElement>('[id="retraitInput"]')!;
		let value = Number(input.value)
		if(!value || Number.isNaN(Number(value)) || value <= 0){
			document.getElementById("NotificationComponent")!.setAttribute("new", JSON.stringify({title:"Banque", content:"La quantité n'est pas valide.", color:"error"}))
			return
		}
		input.value = ""
		axios.post("http://core/retrait", {value: Number(value)}).then((_res)=>{
		})
		
	}

    attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
        if (name=="bank") {
			this.shadowRoot!.querySelector<HTMLElement>('[id="soldeContent"]')!.innerText = newValue.replace(/\B(?=(\d{3})+(?!\d))/g, "'");
			this.shadowRoot!.querySelector<HTMLElement>('[id="retraitInput"]')!.setAttribute("max",newValue)
        } 
		if (name=="visible"){
			if (newValue=="true") {
				document.getElementById("AtmComponent")!.hidden = false
			} else {
				document.getElementById("AtmComponent")!.hidden = true
			}
		}
    }

}
customElements.define("atm-component", AtmComponent);
