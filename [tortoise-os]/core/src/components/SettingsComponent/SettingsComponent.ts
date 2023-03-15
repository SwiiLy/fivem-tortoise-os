import html from "./SettingsComponent.html?raw";
import style from "./SettingsComponent.scss";
import axios from 'axios';


export class SettingsComponent extends HTMLElement {
    
    static get observedAttributes() { return ["visible", "cid","color"];}


    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot!.innerHTML = html;
        const styleElement = document.createElement("style");
        styleElement.innerHTML = style;
        this.shadowRoot?.appendChild(styleElement);
    }

	toggleColorPicker(){
	}


    connectedCallback() {
		this.shadowRoot!.querySelector<HTMLElement>('[id="closeButton"]')!.onclick = () => {
			// document.getElementById("SettingsComponent")!.hidden = true
			let event = new CustomEvent('router', {detail: {route:"settings",open:false}});
			window.dispatchEvent(event);
		}
		// this.shadowRoot!.querySelectorAll<HTMLElement>('[class="colorVehicle"]')!.forEach(el=> {
		// 	el.onclick = (event: any) => {
		// 		this.changeColorVehicle(event.target.dataset.color)
		// 	}
		// }) 
		this.shadowRoot!.querySelectorAll<HTMLElement>('[class="colorMenu"]')!.forEach(el=> {
			el.onclick = async (event: any) => {
				this.changeColorMenu(event.target.dataset.color)
				await axios.post('http://core/setcolor',{color: event.target.dataset.color}).then();
			}
		}) 


		this.shadowRoot!.querySelector<HTMLInputElement>('[id="volume"]')!.addEventListener("input", (event:any) => {
			if (Number(event.target.value)===0) {
			}
		})
    }


	changeColorVehicle(color: string){
		this.shadowRoot!.querySelectorAll<HTMLElement>('[class="colorVehicle"]')!.forEach((el:any)=> {
			if(el.dataset.color==color){
				el.innerHTML = '<svg fill="white" viewBox="0 0 512 512"><path d="M470.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L192 338.7 425.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>'
				document.getElementById("VehicleComponent")?.setAttribute("color", el.dataset.color)
			} else {
				el.innerHTML = ""
			}
		}) 
	}
	
	changeColorMenu(color: string){
		this.shadowRoot!.querySelectorAll<HTMLElement>('[class="colorMenu"]')!.forEach((el:any)=> {
			if(el.dataset.color==color){
				el.innerHTML = '<svg fill="white" viewBox="0 0 512 512"><path d="M470.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L192 338.7 425.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>'
				document.getElementById("MenuComponent")?.setAttribute("color", el.dataset.color)
				document.getElementById("NavbarComponent")?.setAttribute("color", el.dataset.color)
				document.getElementById("InventaireComponent")?.setAttribute("color", el.dataset.color)
				document.getElementById("ProgressbarComponent")?.setAttribute("color", el.dataset.color)
				document.getElementById("ProductionComponent")?.setAttribute("color", el.dataset.color)
				this.shadowRoot!.querySelector<HTMLElement>('[id="headerSetting"]')!.className = el.dataset.color
				this.shadowRoot!.querySelector<HTMLElement>('[id="contentSetting"]')!.className = el.dataset.color
				this.shadowRoot!.querySelector<HTMLElement>('[id="volume"]')!.className = el.dataset.color
				this.changeColorVehicle(color)
			} else {
				el.innerHTML = ""
			}
		}) 
	}

    attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
		if (name=="visible"){
			if (newValue=="true") {
				document.getElementById("SettingsComponent")!.hidden = false
			} else {
				document.getElementById("SettingsComponent")!.hidden = true
			}
		} else if(name=="speedColor") {
			this.changeColorVehicle(newValue)
		}
		if (name==="color") {
			this.changeColorMenu(newValue)
		}
    }

}
customElements.define("settings-component", SettingsComponent);
