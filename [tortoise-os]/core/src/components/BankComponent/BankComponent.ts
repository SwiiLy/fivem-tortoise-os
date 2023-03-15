import html from "./BankComponent.html?raw";
import style from "./BankComponent.scss";
import axios from 'axios';


export class BankComponent extends HTMLElement {
    
    static get observedAttributes() { return ["visible", "cash", "bank"];}

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
			document.getElementById("BankComponent")!.hidden = true
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
		this.shadowRoot!.querySelector<HTMLElement>('[id="depotInput"]')!.onkeyup = (e:any) => {
			if(e.key==="Enter"){
				this.handleRetrait()
			}
		}
		this.shadowRoot!.querySelector<HTMLElement>('[id="depotButton"]')!.onclick = () => {
			this.handleDepot()
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

	handleDepot(){
		let input = this.shadowRoot!.querySelector<HTMLInputElement>('[id="depotInput"]')!;
		let value = Number(input.value)
		if(!value || Number.isNaN(Number(value)) || value <= 0){
			document.getElementById("NotificationComponent")!.setAttribute("new", JSON.stringify({title:"NAZE Bank", content:"La quantité n'est pas valide.", color:"error"}))
			return
		}
		input.value = ""
		axios.post("http://core/depot", {value: Number(value)}).then((_res)=>{
		})
	}

    attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
        if (name=="bank") {
			this.shadowRoot!.querySelector<HTMLElement>('[id="soldeContent"]')!.innerText = newValue.replace(/\B(?=(\d{3})+(?!\d))/g, "'");
			this.shadowRoot!.querySelector<HTMLElement>('[id="retraitInput"]')!.setAttribute("max",newValue)
        } 
		if (name=="cash") {
			this.shadowRoot!.querySelector<HTMLElement>('[id="walletContent"]')!.innerText = newValue.replace(/\B(?=(\d{3})+(?!\d))/g, "'");
			this.shadowRoot!.querySelector<HTMLElement>('[id="depotInput"]')!.setAttribute("max",newValue)
        } 
		if (name=="visible"){
			if (newValue=="true") {
				document.getElementById("BankComponent")!.style.animation = "zoomin 0.5s"
				document.getElementById("BankComponent")!.hidden = false
			} else {
				document.getElementById("BankComponent")!.hidden = true
			}
		}
    }

}
customElements.define("bank-component", BankComponent);
