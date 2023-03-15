import html from "./ProductionComponent.html?raw";
import style from "./ProductionComponent.scss";
import axios from 'axios';



export class ProductionComponent extends HTMLElement {
    
    static get observedAttributes() { return ["visible", "prod", "color", "update"];}

	prod!: {
		id: number,
		name: string,
		x: number,
		y: number,
		z: number,
		msInterval: number,
		entrepriseId?: number,
		inputItem1: any,
		inputItem1Id: number,
		inputItem1Stock: number,
		inputItem1Quantity: number,
		inputItem1Max: number,
		inputItem2: any,
		inputItem2Id?: number,	
		inputItem2Stock?: number,	
		inputItem2Optional?: number,	
		inputItem2Multiplier?: number,	
		inputItem2Quantity?: number,	
		inputItem2Max?: number,	
		inputItem3: any,
		inputItem3Id?: number,	
		inputItem3Stock?: number,	
		inputItem3Optional?: number,	
		inputItem3Multiplier?: number,	
		inputItem3Quantity?: number,	
		inputItem3Max?: number,	
		outputItem1: any,
		outputItem1Id: number,
		outputItem1Stock: number,
		outputItem1Quantity: number,
		outputItem1Max: number,
		outputItem2: any,
		outputItem2Id?: number,	
		outputItem2Stock?: number,	
		outputItem2Quantity?: number,	
		outputItem2Max?: number,	
		outputItem3: any,
		outputItem3Id?: number,	
		outputItem3Stock?: number,	
		outputItem3Quantity?: number,	
		outputItem3Max?: number,
	};

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot!.innerHTML = html;
        const styleElement = document.createElement("style");
        styleElement.innerHTML = style;
        this.shadowRoot?.appendChild(styleElement);
    }


    connectedCallback() {
		this.shadowRoot!.querySelector<HTMLButtonElement>('[id="closeButton"]')!.onclick = async () => {
			document.getElementById("ProductionComponent")!.hidden = true
			await axios.post('http://core/closemenu',{}).then();
		}
		this.shadowRoot!.querySelectorAll<HTMLElement>('[class="inputAdd"]')!.forEach(el=> {
			el.onclick = async () => {
				let input = this.shadowRoot!.querySelector<HTMLInputElement>('[id="'+el.id+'i"]')!;
				let value = Number(input.value)
				if(!value || Number.isNaN(Number(value)) || value <= 0){
					document.getElementById("NotificationComponent")!.setAttribute("new", JSON.stringify({title:"Production", content:"La quantité n'est pas valide.", color:"error"}))
					return
				}
				input.value = ""
				await axios.post('http://core/productionadd',{id: this.prod?.id, value : value, stock: el.dataset.stock, item: el.dataset.item, max: el.dataset.max}).then();
			}
		})
		this.shadowRoot!.querySelectorAll<HTMLElement>('[class="outputGet"]')!.forEach(el=> {
			el.onclick = async (_event: any) => {
				let input = this.shadowRoot!.querySelector<HTMLInputElement>('[id="'+el.id+'i"]')!;
				let value = Number(input.value)
				if(!value || Number.isNaN(Number(value)) || value <= 0){
					document.getElementById("NotificationComponent")!.setAttribute("new", JSON.stringify({title:"Production", content:"La quantité n'est pas valide.", color:"error"}))
					return
				}
				input.value = ""
				await axios.post('http://core/productionget',{id: this.prod?.id, value : value, stock: el.dataset.stock, item: el.dataset.item, max: el.dataset.max}).then();
			}
		}) 
    }

	updateProdDisplay(newprod: string){
		this.prod = JSON.parse(newprod)
		if (this.prod) {
			this.shadowRoot!.querySelector<HTMLElement>('[id="name"]')!.innerText = this.prod.name
			if (this.prod.inputItem1Id) {
				this.shadowRoot!.querySelector<HTMLElement>('[id="inputItemName1"]')!.innerText = String(this.prod.inputItem1.name)
				this.shadowRoot!.querySelector<HTMLElement>('[id="inputItem1Icon"]')!.setAttribute("src", "icons/assets/"+this.prod.inputItem1.icon)
				this.shadowRoot!.querySelector<HTMLElement>('[id="inputItem1StockText"]')!.innerText = String(this.prod.inputItem1Stock)
				this.shadowRoot!.querySelector<HTMLElement>('[id="inputItem1Max"]')!.innerText = String(this.prod.inputItem1Max)
				this.shadowRoot!.querySelector<HTMLElement>('[id="inputItem1StockBar"]')!.style.width = ((this.prod.inputItem1Stock/this.prod.inputItem1Max)*100)+"%"
				this.shadowRoot!.querySelector<HTMLElement>('[id="input1"]')!.hidden = false
			} else {
				this.shadowRoot!.querySelector<HTMLElement>('[id="input1"]')!.hidden = true
			}
			if (this.prod.inputItem2Id) {
				this.shadowRoot!.querySelector<HTMLElement>('[id="inputItemName2"]')!.innerText = String(this.prod.inputItem2.name)
				this.shadowRoot!.querySelector<HTMLElement>('[id="inputItem2Icon"]')!.setAttribute("src", "icons/assets/"+this.prod.inputItem2.icon)
				this.shadowRoot!.querySelector<HTMLElement>('[id="inputItem2StockText"]')!.innerText = String(this.prod.inputItem2Stock)
				this.shadowRoot!.querySelector<HTMLElement>('[id="inputItem2Max"]')!.innerText = String(this.prod.inputItem2Max)
				this.shadowRoot!.querySelector<HTMLElement>('[id="inputItem2StockBar"]')!.style.width = ((this.prod.inputItem2Stock!/this.prod.inputItem2Max!)*100)+"%"
				this.shadowRoot!.querySelector<HTMLElement>('[id="input2"]')!.hidden = false
			} else {
				this.shadowRoot!.querySelector<HTMLElement>('[id="input2"]')!.hidden = true
			}
			if (this.prod.inputItem3Id) {
				this.shadowRoot!.querySelector<HTMLElement>('[id="inputItemName3"]')!.innerText = String(this.prod.inputItem3.name)
				this.shadowRoot!.querySelector<HTMLElement>('[id="inputItem3Icon"]')!.setAttribute("src", "icons/assets/"+this.prod.inputItem3.icon)
				this.shadowRoot!.querySelector<HTMLElement>('[id="inputItem3StockText"]')!.innerText = String(this.prod.inputItem3Stock)
				this.shadowRoot!.querySelector<HTMLElement>('[id="inputItem3Max"]')!.innerText = String(this.prod.inputItem3Max)
				this.shadowRoot!.querySelector<HTMLElement>('[id="inputItem3StockBar"]')!.style.width = ((this.prod.inputItem3Stock!/this.prod.inputItem3Max!)*100)+"%"
				this.shadowRoot!.querySelector<HTMLElement>('[id="input3"]')!.hidden = false
			} else {
				this.shadowRoot!.querySelector<HTMLElement>('[id="input3"]')!.hidden = true
			}
			if (this.prod.outputItem1Id) {
				this.shadowRoot!.querySelector<HTMLElement>('[id="outputItemName1"]')!.innerText = String(this.prod.outputItem1.name)
				this.shadowRoot!.querySelector<HTMLElement>('[id="outputItem1Icon"]')!.setAttribute("src", "icons/assets/"+this.prod.outputItem1.icon)
				this.shadowRoot!.querySelector<HTMLElement>('[id="outputItem1StockText"]')!.innerText = String(this.prod.outputItem1Stock)
				this.shadowRoot!.querySelector<HTMLElement>('[id="outputItem1Max"]')!.innerText = String(this.prod.outputItem1Max)
				this.shadowRoot!.querySelector<HTMLElement>('[id="outputItem1StockBar"]')!.style.width = ((this.prod.outputItem1Stock/this.prod.outputItem1Max)*100)+"%"
				this.shadowRoot!.querySelector<HTMLElement>('[id="output1"]')!.hidden = false
			} else {
				this.shadowRoot!.querySelector<HTMLElement>('[id="output1"]')!.hidden = true
			}
			if (this.prod.outputItem2Id) {
				this.shadowRoot!.querySelector<HTMLElement>('[id="outputItemName2"]')!.innerText = String(this.prod.outputItem2.name)
				this.shadowRoot!.querySelector<HTMLElement>('[id="outputItem2Icon"]')!.setAttribute("src", "icons/assets/"+this.prod.outputItem2.icon)
				this.shadowRoot!.querySelector<HTMLElement>('[id="outputItem2StockText"]')!.innerText = String(this.prod.outputItem2Stock)
				this.shadowRoot!.querySelector<HTMLElement>('[id="outputItem2Max"]')!.innerText = String(this.prod.outputItem2Max)
				this.shadowRoot!.querySelector<HTMLElement>('[id="outputItem2StockBar"]')!.style.width = ((this.prod.outputItem2Stock!/this.prod.outputItem2Max!)*100)+"%"
				this.shadowRoot!.querySelector<HTMLElement>('[id="output2"]')!.hidden = false
			} else {
				this.shadowRoot!.querySelector<HTMLElement>('[id="output2"]')!.hidden = true
			}
			if (this.prod.outputItem3Id) {
				this.shadowRoot!.querySelector<HTMLElement>('[id="outputItemName3"]')!.innerText = String(this.prod.outputItem3.name)
				this.shadowRoot!.querySelector<HTMLElement>('[id="outputItem3Icon"]')!.setAttribute("src", "icons/assets/"+this.prod.outputItem3.icon)
				this.shadowRoot!.querySelector<HTMLElement>('[id="outputItem3StockText"]')!.innerText = String(this.prod.outputItem3Stock)
				this.shadowRoot!.querySelector<HTMLElement>('[id="outputItem3Max"]')!.innerText = String(this.prod.outputItem3Max)
				this.shadowRoot!.querySelector<HTMLElement>('[id="outputItem3StockBar"]')!.style.width = ((this.prod.outputItem3Stock!/this.prod.outputItem3Max!)*100)+"%"
				this.shadowRoot!.querySelector<HTMLElement>('[id="output3"]')!.hidden = false
			} else {
				this.shadowRoot!.querySelector<HTMLElement>('[id="output3"]')!.hidden = true
			}
		}
	}

	updateProdQuantity(newValue: string){
		let newqt = JSON.parse(newValue)
		if (newqt.inputItem1Id) {
			this.prod.inputItem1Stock = newqt.inputItem1Stock
			this.shadowRoot!.querySelector<HTMLElement>('[id="inputItem1StockText"]')!.innerText = String(this.prod.inputItem1Stock)
			this.shadowRoot!.querySelector<HTMLElement>('[id="inputItem1StockBar"]')!.style.width = ((this.prod.inputItem1Stock/this.prod.inputItem1Max)*100)+"%"
		}
		if (newqt.inputItem2Id) {
			this.prod.inputItem2Stock = newqt.inputItem2Stock
			this.shadowRoot!.querySelector<HTMLElement>('[id="inputItem2StockText"]')!.innerText = String(this.prod.inputItem2Stock)
			this.shadowRoot!.querySelector<HTMLElement>('[id="inputItem2StockBar"]')!.style.width = ((this.prod.inputItem2Stock!/this.prod.inputItem2Max!)*100)+"%"
		}
		if (newqt.inputItem3Id) {
			this.prod.inputItem3Stock = newqt.inputItem3Stock
			this.shadowRoot!.querySelector<HTMLElement>('[id="inputItem3StockText"]')!.innerText = String(this.prod.inputItem3Stock)
			this.shadowRoot!.querySelector<HTMLElement>('[id="inputItem3StockBar"]')!.style.width = ((this.prod.inputItem3Stock!/this.prod.inputItem3Max!)*100)+"%"
		}
		if (newqt.outputItem1Id) {
			this.prod.outputItem1Stock = newqt.outputItem1Stock
			this.shadowRoot!.querySelector<HTMLElement>('[id="outputItem1StockText"]')!.innerText = String(this.prod.outputItem1Stock)
			this.shadowRoot!.querySelector<HTMLElement>('[id="outputItem1StockBar"]')!.style.width = ((this.prod.outputItem1Stock/this.prod.outputItem1Max)*100)+"%"
		}
		if (newqt.outputItem2Id) {
			this.prod.outputItem2Stock = newqt.outputItem2Stock
			this.shadowRoot!.querySelector<HTMLElement>('[id="outputItem2StockText"]')!.innerText = String(this.prod.outputItem2Stock)
			this.shadowRoot!.querySelector<HTMLElement>('[id="outputItem2StockBar"]')!.style.width = ((this.prod.outputItem2Stock!/this.prod.outputItem2Max!)*100)+"%"
		}
		if (newqt.outputItem3Id) {
			this.prod.outputItem3Stock = newqt.outputItem3Stock
			this.shadowRoot!.querySelector<HTMLElement>('[id="outputItem3StockText"]')!.innerText = String(this.prod.outputItem3Stock)
			this.shadowRoot!.querySelector<HTMLElement>('[id="outputItem3StockBar"]')!.style.width = ((this.prod.outputItem3Stock!/this.prod.outputItem3Max!)*100)+"%"
		}
	}



    attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
		if (name=="visible"){
			if (newValue=="true") {
				document.getElementById("ProductionComponent")!.hidden = false
			} else {
				document.getElementById("ProductionComponent")!.hidden = true
			}
		}
		if (name==="color") {
			this.shadowRoot!.querySelector<HTMLElement>('[id="headerProduction"]')!.className = newValue
			this.shadowRoot!.querySelector<HTMLElement>('[id="contentProduction"]')!.className = newValue
		}
		if (name==="prod") {
			this.updateProdDisplay(newValue)
		}
		if (name==="update") {
			this.updateProdQuantity(newValue)
		}
    }

}
customElements.define("production-component", ProductionComponent);
