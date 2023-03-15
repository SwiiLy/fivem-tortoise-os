import html from "./InventaireComponent.html?raw";
import style from "./InventaireComponent.scss";


export class InventaireComponent extends HTMLElement {
	
	static get observedAttributes() { return ["visible", "cid", "color"];}
	
	draggingSource?: string;
	draggingItem: any;
	draggingType?: string;
	draggingElement?: HTMLElement;
	weaponPrimary?: any
	weaponSecondary?: any


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

	connectedCallback(){}
    // connectedCallback() {
	// 	this.shadowRoot!.querySelector<HTMLElement>('[id="closeButton"]')!.onclick = () => {
	// 		document.getElementById("InventaireComponent")!.hidden = true
	// 		let event = new CustomEvent('router', {detail: {route:"user",open:false}});
	// 		window.dispatchEvent(event);
	// 	}

		
	// 	this.shadowRoot!.querySelectorAll<HTMLElement>('[class="item"]')!.forEach(el=> {
	// 		el.ondragstart = (event: any) => {
	// 			this.handleDragStart(el, event)
	// 		}
	// 		el.ondragend = () => {
	// 			switch (this.draggingType) {
	// 				case "head":
	// 					this.shadowRoot!.querySelector<HTMLElement>('[id="characterHead"]')!.style.border = "1px solid #ffffff80";
	// 					this.shadowRoot!.querySelector<HTMLElement>('[id="characterHead"]')!.style.background = "#ffffff20";
	// 					break;
	// 				case "weapon":
	// 					if (!this.weaponPrimary) {
	// 						this.shadowRoot!.querySelector<HTMLElement>('[id="characterWeapon1"]')!.style.background = "#ffffff20";
	// 					}
	// 					this.shadowRoot!.querySelector<HTMLElement>('[id="characterWeapon1"]')!.style.border = "1px solid #ffffff80";
	// 					this.shadowRoot!.querySelector<HTMLElement>('[id="characterWeapon2"]')!.style.border = "1px solid #ffffff80";
	// 					this.shadowRoot!.querySelector<HTMLElement>('[id="characterWeapon2"]')!.style.background = "#ffffff20";
	// 					break;
	// 				default:
	// 					break;
	// 			}
	// 			if (this.draggingElement) {
	// 				el.hidden = false
	// 				this.draggingElement = undefined
	// 				this.draggingType = undefined
	// 				this.draggingItem = undefined
	// 				this.draggingSource = undefined
	// 			}
	// 		}
	// 		el.ondrag = (_event:any) => {
	// 		}
	// 	}) 

	// 	this.shadowRoot!.querySelector<HTMLElement>('[id="character"]')!
	// 	.ondragover = (event: any) => {
	// 		switch (this.draggingType) {
	// 			case "head":
	// 				event.preventDefault();
	// 				let img = document.createElement("img")
	// 				img.className = "dragover"
	// 				img.src = ""+this.draggingElement?.firstElementChild?.getAttribute("src")
	// 				if (this.shadowRoot!.querySelector<HTMLElement>('[id="characterHead"]')!.firstElementChild != img) {
	// 					this.shadowRoot!.querySelector<HTMLElement>('[id="characterHead"]')!.innerHTML = ''
	// 					this.shadowRoot!.querySelector<HTMLElement>('[id="characterHead"]')!.appendChild(img)
	// 				}
	// 				break;
			
	// 			default:
	// 				break;
	// 		}
	// 	}
	// 	this.shadowRoot!.querySelector<HTMLElement>('[id="character"]')!
	// 	.ondragleave = (event: any) => {
	// 		function isDescendant(parent:any, child:any) {
	// 			var node = child.parentNode;
	// 			while (node != null) {
	// 				if (node == parent) {
	// 					return true;
	// 				}
	// 				node = node.parentNode;
	// 			}
	// 			return false;
	// 	   }
	// 	   if(!isDescendant(this.shadowRoot!.querySelector<HTMLElement>('[id="character"]'),event.target) || !this.shadowRoot!.querySelector<HTMLElement>('[id="character"]')){
	// 		   switch (this.draggingType) {
	// 		   	case "head":
	// 		   		this.shadowRoot!.querySelector<HTMLElement>('[id="characterHead"]')!.innerHTML = ''
	// 		   		break;
	// 		   	default:
	// 		   		break;
	// 		   }
	// 	   }
		   
	// 	}
	// 	this.shadowRoot!.querySelector<HTMLElement>('[id="character"]')!
	// 	.ondrop = (event: any) => {
	// 		if(event.preventDefault) { event.preventDefault(); }
    // 		if(event.stopPropagation) { event.stopPropagation(); }
	// 		switch (this.draggingType) {
	// 			case "head":
	// 				this.shadowRoot!.querySelector<HTMLElement>('[id="characterHead"]')!.style.border = "1px solid #ffffff80";
	// 				this.shadowRoot!.querySelector<HTMLElement>('[id="characterHead"]')!.style.background = "#ffffff20";
	// 				let img = document.createElement("img")
	// 				img.src = ""+this.draggingElement?.firstElementChild?.getAttribute("src")
	// 				if (this.shadowRoot!.querySelector<HTMLElement>('[id="characterHead"]')!.firstElementChild != img) {
	// 					this.shadowRoot!.querySelector<HTMLElement>('[id="characterHead"]')!.innerHTML = ''
	// 					this.shadowRoot!.querySelector<HTMLElement>('[id="characterHead"]')!.appendChild(img)
	// 				}
	// 				break;
	// 			default:
	// 				break;
	// 		}
	// 		this.draggingElement = undefined
	// 		this.draggingType = undefined
	// 		this.draggingItem = undefined
	// 		this.draggingSource = undefined
	// 	}
	// 	this.shadowRoot!.querySelector<HTMLElement>('[id="inventaire"]')!.ondragover = (event: any) => {
	// 		event.preventDefault();
	// 	}
	// 	this.shadowRoot!.querySelector<HTMLElement>('[id="inventaire"]')!.ondrop = (event: any) => {
	// 		if(event.preventDefault) { event.preventDefault(); }
    // 		if(event.stopPropagation) { event.stopPropagation(); }
	// 	}






	// 	this.shadowRoot!.querySelector<HTMLElement>('[id="characterWeapon1"]')!
	// 	.ondragover = (event: any) => {
	// 		if (this.draggingType==="weapon" && !this.weaponPrimary) {
	// 			event.preventDefault();
	// 			this.shadowRoot!.querySelector<HTMLElement>('[id="characterWeapon1"]')!.style.background = 'url('+this.draggingElement?.firstElementChild?.getAttribute("src")+')'
	// 			this.shadowRoot!.querySelector<HTMLElement>('[id="characterWeapon1"]')!.style.backgroundSize = 'contain'
	// 		}
	// 	}
	// 	this.shadowRoot!.querySelector<HTMLElement>('[id="characterWeapon1"]')!
	// 	.ondrop = (event: any) => {
	// 		if(event.preventDefault) { event.preventDefault(); }
    // 		if(event.stopPropagation) { event.stopPropagation(); }
	// 		this.weaponPrimary = this.draggingItem
	// 		this.shadowRoot!.querySelector<HTMLElement>('[id="characterWeapon1"]')!.style.background = 'url('+this.weaponPrimary.image+')'
	// 		this.shadowRoot!.querySelector<HTMLElement>('[id="characterWeapon1"]')!.style.backgroundSize = 'contain'
	// 	}
	// 	this.shadowRoot!.querySelector<HTMLElement>('[id="characterWeapon1"]')!
	// 	.ondragleave = () => {
	// 		if (!this.weaponPrimary) {
	// 			this.shadowRoot!.querySelector<HTMLElement>('[id="characterWeapon1"]')!.style.background = '#ffffff80'
	// 		}
	// 	}
		
		



	// 	this.shadowRoot!.querySelector<HTMLElement>('[id="characterWeapon2"]')!.ondrop = (event: any) => {
	// 		if(event.preventDefault) { event.preventDefault(); }
    // 		if(event.stopPropagation) { event.stopPropagation(); }
	// 	}
	// }

	handleDragStart(el: any, event: any){
		this.draggingElement = el
		this.draggingItem = {
			id: el.id,
			type: el.dataset.type,
			image: el.firstElementChild?.getAttribute("src")
		}
		this.draggingSource = "inventaire"
		this.draggingType = event.target.dataset.type
		var img = document.createElement('img')
		var canvas = document.createElement('canvas')
		var ctx = canvas.getContext('2d')
		if(el.firstElementChild?.getAttribute("src") != null){
			img.src = ""+el.firstElementChild?.getAttribute("src")
		}
		canvas.id = "dragGhost"
		img.style.border = "1px solid white"
		canvas.innerText = "coucou"
		ctx!.fillStyle = "#ffffff80"
		ctx!.fillRect(0,0, 80,80)
		ctx!.drawImage(img, 5, 5, 70, 70)
		ctx!.strokeStyle = "white"
		ctx!.strokeRect(0,0, 80,80)
		event.dataTransfer.setDragImage(canvas, 40, 40)
		el.hidden = true
		switch (this.draggingType) {
			case "head":
				this.shadowRoot!.querySelector<HTMLElement>('[id="characterHead"]')!.style.border = "1px solid white";
				this.shadowRoot!.querySelector<HTMLElement>('[id="characterHead"]')!.style.background = "#ffffff80";
				break;
			case "weapon":
				if(!this.weaponPrimary){
					this.shadowRoot!.querySelector<HTMLElement>('[id="characterWeapon1"]')!.style.border = "1px solid white";
					this.shadowRoot!.querySelector<HTMLElement>('[id="characterWeapon1"]')!.style.background = "#ffffff80";
				} else {
					this.shadowRoot!.querySelector<HTMLElement>('[id="characterWeapon1"]')!.style.border = "1px solid red";
				}
				if(!this.weaponSecondary){
					this.shadowRoot!.querySelector<HTMLElement>('[id="characterWeapon2"]')!.style.border = "1px solid white";
					this.shadowRoot!.querySelector<HTMLElement>('[id="characterWeapon2"]')!.style.background = "#ffffff80";
				} else {
					this.shadowRoot!.querySelector<HTMLElement>('[id="characterWeapon2"]')!.style.border = "1px solid red";
				}
				break;
			
			default:
				break;
		}
	}



    attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
		if (name=="visible"){
			if (newValue=="true") {
				document.getElementById("InventaireComponent")!.hidden = false
			} else {
				document.getElementById("InventaireComponent")!.hidden = true
			}
		} else if(name=="color") {
			this.shadowRoot!.querySelector<HTMLElement>('[id="headerInventaire"]')!.className = newValue
		} 
    }

}
customElements.define("inventaire-component", InventaireComponent);
