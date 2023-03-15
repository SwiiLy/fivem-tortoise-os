import html from "./NavbarComponent.html?raw";
import style from "./NavbarComponent.scss";
import icons from "../../data/Icons.json";
import axios from 'axios';

export class NavbarComponent extends HTMLElement {
	buttons: {onclose?:Function,element:HTMLButtonElement}[] = []
	opened: boolean = false
    
    static get observedAttributes() { return ["color", "display"];}

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot!.innerHTML = html;
        const styleElement = document.createElement("style");
        styleElement.innerHTML = style;
        this.shadowRoot?.appendChild(styleElement);

		this.constructNavbar()

		window.addEventListener('keydown', (event) => {
			if(event.key == "F3"){
				if (this.opened) {
					this.hideNavbar() 					
				}
			}			
		});
		// this.showNavbar()

		window.addEventListener('router', (event: any) => {
			if (!event.detail.open) {
				this.handleButtonSelected()
			} else {
				this.handleButtonSelected(event.detail.route)
			}
		});

		document.addEventListener("click", (e:any) => {
			if (this.opened) {
				if (e.target.localName === "body" || e.target.localName === "app-component"||e.target.localName === "gauges-component"||e.target.localName === "vehicle-component") {
					this.hideNavbar() 					
				}
			}
        });

    }

	async showNavbar(){
		this.shadowRoot!.querySelector<HTMLElement>('[id="navbar"]')!.style.top = "30px"
		this.shadowRoot!.querySelector<HTMLElement>('[id="navbar"]')!.style.animation = "slidein 0.4s"
		this.opened = true
		await axios.post('http://phone/closefrommenu',{}).then();
	}

	async hideNavbar(){
		this.handleButtonSelected()
		this.shadowRoot!.querySelector<HTMLElement>('[id="navbar"]')!.style.top = "-100px"
		this.shadowRoot!.querySelector<HTMLElement>('[id="navbar"]')!.style.animation = "slideout 0.4s"
		this.opened = false
		await axios.post('http://core/closemenu',{}).then();
	}

	async hideNavbarOnly(){
		this.shadowRoot!.querySelector<HTMLElement>('[id="navbar"]')!.style.top = "-100px"
		this.shadowRoot!.querySelector<HTMLElement>('[id="navbar"]')!.style.animation = "slideout 0.4s"
		this.opened = false
		await axios.post('http://core/closemenu',{}).then();
	}

	constructNavbar(){
		let list = this.shadowRoot!.querySelector<HTMLElement>('[id="navbar"]')

		// let buttonUser = {
		// 	onclose: () => {
		// 		document.getElementById("InventaireComponent")?.setAttribute("visible", "false")
		// 	},
		// 	element: document.createElement("button")
		// }
		// buttonUser.element.id = "user"
		// buttonUser.element.innerHTML = icons.user
		// buttonUser.element.onclick = () => {
		// 	this.handleButtonSelected(buttonUser.element.id).then(active=>{
		// 		if (active) {
		// 			document.getElementById("InventaireComponent")?.setAttribute("visible", "true")
		// 		} else {
		// 			document.getElementById("InventaireComponent")?.setAttribute("visible", "false")
		// 		}
		// 	})
		// }
		// list?.appendChild(buttonUser.element)
		// this.buttons.push(buttonUser)


		let buttonPhone = {element: document.createElement("button")}
		buttonPhone.element.id = "phone"
		buttonPhone.element.innerHTML = icons.phone
		buttonPhone.element.onclick = async () => {
			await axios.post('http://phone/open',{}).then();
			this.hideNavbar()
		}
		list?.appendChild(buttonPhone.element)
		this.buttons.push(buttonPhone)
	
		let buttonVehicle = {element: document.createElement("button")}
		buttonVehicle.element.id = "vehicle"
		buttonVehicle.element.innerHTML = icons.vehicle
		buttonVehicle.element.onclick = () => {
			this.hideNavbar()
		}
		list?.appendChild(buttonVehicle.element)
		this.buttons.push(buttonVehicle)

	
		let buttonSettings = {
			onclose: () => {
				document.getElementById("SettingsComponent")?.setAttribute("visible", "false")
				this.hideNavbarOnly()
			},
			element: document.createElement("button")
		}
		buttonSettings.element.id = "settings"
		buttonSettings.element.innerHTML = icons.settings
		buttonSettings.element.onclick = () => {
			this.handleButtonSelected(buttonSettings.element.id).then(active=>{
				if (active) {
					document.getElementById("SettingsComponent")?.setAttribute("visible", "true")
				} else {
					document.getElementById("SettingsComponent")?.setAttribute("visible", "false")
				}
			})
		}
		list?.appendChild(buttonSettings.element)
		this.buttons.push(buttonSettings)

	}

	handleButtonSelected(id?: string): Promise<boolean> {
		let res = false
		if (id) {
			let button = this.shadowRoot!.querySelector<HTMLElement>('[id="'+id+'"]')
			if (button!.classList.contains("selected")) {
				button!.classList.remove("selected")
			} else {
				button!.classList.add("selected")
				res = true
			}
			this.buttons.forEach(el => {
				if (el.element!=button) {
					el.element.classList.remove("selected")
					if(el.onclose){
						el.onclose()
					}
				}
			});
		} else {
			this.buttons.forEach(el => {
				el.element.classList.remove("selected")
				if(el.onclose){
					el.onclose()
				}
			});
		}
		return new Promise((resolve, _reject) => {
			resolve(res);
		});
	}


    connectedCallback() {
    }


    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (newValue != oldValue) {
			if(name==="color"){
				this.shadowRoot!.querySelector<HTMLElement>('[id="navbar"]')!.className = ""
				this.shadowRoot!.querySelector<HTMLElement>('[id="navbar"]')!.classList.add(newValue)
			}
        }
		if (name==="display") {
			newValue === "true" ? this.showNavbar() : this.hideNavbar();
		}
    }

}
customElements.define("navbar-component", NavbarComponent);
