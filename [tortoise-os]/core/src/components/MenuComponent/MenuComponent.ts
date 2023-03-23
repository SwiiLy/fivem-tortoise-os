import html from "./MenuComponent.html?raw";
import style from "./MenuComponent.scss";
import icons from "../../data/Icons.json";
import axios from 'axios';

export class MenuComponent extends HTMLElement {
    
    static get observedAttributes() { return ["color"];}

	uuid?: string
	title: string = 'Tortoise Menu'
	subtitle: string = 'Subtitle'
	footer:string = 'Footer'
  
	focusedIndex: number = 0
	lastFocusedIndex: number = 0
  
  
	displayList: any

	type: any;
	parentType: any;
	parent: any;

	menu!: {
		uuid: string,
		title:string,
		subtitle:string,
		footer:string,
		type:string,
		Items : any[]
	}

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot!.innerHTML = html;
        const styleElement = document.createElement("style");
        styleElement.innerHTML = style;
        this.shadowRoot?.appendChild(styleElement);
		this.shadowRoot!.querySelector<HTMLElement>('[id="titleText"]')!.innerText = this.title
		this.shadowRoot!.querySelector<HTMLElement>('[id="subtitleText"]')!.innerText = this.subtitle
		this.shadowRoot!.querySelector<HTMLElement>('[id="footerText"]')!.innerText = this.footer
		
		document.getElementById("MenuComponent")!.hidden = true

		// this.constructMenu(this.menu)

    }


    connectedCallback() {
		window.addEventListener('keydown', (event) => {
			this.handleKeyEvent(event)
		});
		window.addEventListener('message', (event) => {
			var item = event.data;
			if (item !== undefined && item.type === "ui" && item.action === "menu") {
				if(item.display){
					document.getElementById("MenuComponent")!.hidden = false
				} else {
					document.getElementById("MenuComponent")!.hidden = true
				}
				if(item.data) {
					this.constructMenu(item.data)
				}
			}
		})
    }


	constructMenu(menu: any){
		this.uuid = menu.uuid
		this.shadowRoot!.querySelector<HTMLElement>('[id="titleText"]')!.innerText = menu.title
		this.shadowRoot!.querySelector<HTMLElement>('[id="subtitleText"]')!.innerText = menu.subtitle
		this.shadowRoot!.querySelector<HTMLElement>('[id="footerText"]')!.innerText = menu.footer
		this.type = menu.type
		this.parentType = menu.parentType   
		this.parent = menu.parent   
		this.shadowRoot!.querySelector<HTMLElement>('[id="menu-list"]')!.innerHTML = ""
		this.displayList = menu.Items
		this.displayList[menu.position] ? this.displayList[menu.position].focused = true : (this.displayList[0]?this.displayList[0].focused = true : null);
		for (let i = 0; i < this.displayList.length; i++) {
		  this.createItem(this.displayList[i])
		}
		if(this.displayList[menu.position]){
			this.displayList[menu.position].focused = true
			setTimeout(() => {
				let el = this.shadowRoot!.querySelector<HTMLElement>('[id="'+this.displayList[menu.position].uuid+'"]')!
				el?.scrollIntoView({ behavior: 'auto', block: "center" });
			}, 50);
			this.focusedIndex = menu.position
			this.lastFocusedIndex = menu.position
		} else {
			this.displayList[0].focused = true
			let el = document.getElementById(String(0));
			el?.scrollIntoView({ behavior: 'auto', block: "center" });
			this.focusedIndex = 0
			this.lastFocusedIndex = 0
		}
		if (this.displayList.length > 1) {
			this.shadowRoot!.querySelector<HTMLElement>('[id="subtitleCount"]')!.innerText = (this.focusedIndex+1)+"/"+this.displayList.length
		}
	}
	

    createItem(item: any) {
        let list = this.shadowRoot!.querySelector<HTMLElement>('[id="menu-list"]');
        const litem = document.createElement("li");
		litem.classList.add("list-group-item")
		litem.id = item.uuid
		litem.innerText = item.label
		const badge = document.createElement("span")
		badge.classList.add("badge")
		if(item.type==="submenu"){
			badge.innerHTML = icons.double_chevron
		} else if(item.type==='checkbox'){
			item.checked ? badge.innerHTML = icons.checked : badge.innerHTML = icons.unchecked;
		} else if(item.type==='slider'){
			badge.innerHTML = icons.chevron_left
			let text
			if(typeof item.list[item.value] === "number"){
				text = item.list[item.value]+"/"+(item.list.length-1)
			} else {
				text = item.list[item.value]+" ("+(item.value+1)+"/"+item.list.length+")";
			}
			badge.innerHTML += text
			badge.innerHTML += icons.chevron_right
		} else if (item.badge) {
			badge.innerHTML = '<span class="badge-text">'+item.badge+'</span>'
		}
		litem.appendChild(badge)
		if(item.focused){
			litem.classList.add("focused")
		}
		list!.appendChild(litem)
		document.getElementById("MenuComponent")!.hidden = false
	}


    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (newValue != oldValue) {
			switch(name) {
				case "color":
					this.shadowRoot!.querySelector<HTMLElement>('[id="menuHeader"]')!.className = newValue
					this.shadowRoot!.querySelector<HTMLElement>('[id="subTitle"]')!.className = newValue
					break
			}
        }
    }

	updateSlider(){
		let badge = icons.chevron_left
		let text
		if(typeof this.displayList[this.focusedIndex].list[this.displayList[this.focusedIndex].value] === "number"){
			text = this.displayList[this.focusedIndex].list[this.displayList[this.focusedIndex].value]+"/"+(this.displayList[this.focusedIndex].list.length-1)
		} else {
			text = this.displayList[this.focusedIndex].list[this.displayList[this.focusedIndex].value]+" ("+(this.displayList[this.focusedIndex].value+1)+"/"+this.displayList[this.focusedIndex].list.length+")";
		}
		badge += text
		badge += icons.chevron_right
		this.shadowRoot!.querySelector<HTMLElement>('[id="'+this.displayList[this.focusedIndex].id+'"]')!.firstElementChild!.innerHTML = badge
	}

	async handleKeyEvent(event: KeyboardEvent){
		switch (event.code) {
			case "Escape":
			case "Backspace":
			case "ArrowLeft":
				if (this.displayList[this.focusedIndex] && this.displayList[this.focusedIndex].type==="slider" && event.code == "ArrowLeft") {
					this.displayList[this.focusedIndex].value === 0 ? this.displayList[this.focusedIndex].value = this.displayList[this.focusedIndex].list.length-1 : this.displayList[this.focusedIndex].value--;
					await axios.post('http://core/sliderchange', {uuid: this.uuid, menuType: this.type, position: this.focusedIndex, value: this.displayList[this.focusedIndex].list[this.displayList[this.focusedIndex].value], valuePosition: this.displayList[this.focusedIndex].value}).then();
					this.updateSlider()
				} else {
					if (this.type==="menu") {
						await axios.post('http://core/close', {closing: this.uuid, closingType: this.type}).then();
						document.getElementById("MenuComponent")!.hidden = true
					} else if (this.type==="submenu") {
						if (this.parentType==="menu") {
							await axios.post('http://core/requestMenu', {uuid: this.parent, closing: this.uuid, closingType: this.type}).then();
						} else if (this.parentType==="submenu") {
							await axios.post('http://core/requestSubmenu', {uuid: this.parent, closing: this.uuid, closingType: this.type}).then();
						}
					}					
					let el = document.getElementById(String(this.focusedIndex));
					el?.scrollIntoView({ behavior: 'auto', block: "center" });
				}
				await axios.post('http://core/navigate', {type: "BACK"}).then();
				break
			case "ArrowUp":
				if (this.displayList) {
					if (this.displayList[0] && this.focusedIndex!=-1) {
						if (this.focusedIndex!=0) {
							this.lastFocusedIndex = this.focusedIndex        
							this.focusedIndex = this.focusedIndex-1
							this.displayList[this.lastFocusedIndex].focused = false
							this.displayList[this.focusedIndex].focused = true
							this.shadowRoot!.querySelector<HTMLElement>('[id="'+this.displayList[this.lastFocusedIndex].uuid+'"]')!.classList.remove("focused")
							let el = this.shadowRoot!.querySelector<HTMLElement>('[id="'+this.displayList[this.focusedIndex].uuid+'"]')!;
							el!.classList.add("focused")
							el!.scrollIntoView({ behavior: 'auto', block: "center" });
						} else if(this.focusedIndex===0 && this.displayList.length > 1) {
							this.lastFocusedIndex = this.focusedIndex        
							this.focusedIndex = this.displayList.length-1
							this.displayList[this.lastFocusedIndex].focused = false
							this.displayList[this.focusedIndex].focused = true
							this.shadowRoot!.querySelector<HTMLElement>('[id="'+this.displayList[this.lastFocusedIndex].uuid+'"]')!.classList.remove("focused")
							let el = this.shadowRoot!.querySelector<HTMLElement>('[id="'+this.displayList[this.focusedIndex].uuid+'"]')!;
							el!.classList.add("focused")
							el!.scrollIntoView({ behavior: 'auto', block: "center" });
						}
					}
					await axios.post('http://core/navigate', {type: "NAV_UP_DOWN", uuid: this.uuid, menuType: this.type, position: this.focusedIndex}).then();
					if (this.displayList.length > 1) {
						this.shadowRoot!.querySelector<HTMLElement>('[id="subtitleCount"]')!.innerText = (this.focusedIndex+1)+"/"+this.displayList.length
					}
				}
			  	break
			case "ArrowDown":
				if (this.displayList) {
					if (this.displayList[0] && this.focusedIndex+1!=this.displayList.length) {
						this.lastFocusedIndex = this.focusedIndex        
						this.focusedIndex++
						this.displayList[this.lastFocusedIndex].focused = false
						this.displayList[this.focusedIndex].focused = true
						this.shadowRoot!.querySelector<HTMLElement>('[id="'+this.displayList[this.lastFocusedIndex].uuid+'"]')!.classList.remove("focused")
						let el = this.shadowRoot!.querySelector<HTMLElement>('[id="'+this.displayList[this.focusedIndex].uuid+'"]')!;
						el!.classList.add("focused")
						el!.scrollIntoView({ behavior: 'auto', block: "center" });
					} else if(this.focusedIndex===this.displayList.length-1 && this.displayList.length > 1) {
						this.lastFocusedIndex = this.focusedIndex        
						this.focusedIndex = 0
						this.displayList[this.lastFocusedIndex].focused = false
						this.displayList[this.focusedIndex].focused = true
						this.shadowRoot!.querySelector<HTMLElement>('[id="'+this.displayList[this.lastFocusedIndex].uuid+'"]')!.classList.remove("focused")
						let el = this.shadowRoot!.querySelector<HTMLElement>('[id="'+this.displayList[this.focusedIndex].uuid+'"]')!;
						el!.classList.add("focused")
						el!.scrollIntoView({ behavior: 'auto', block: "center" });
					}
					await axios.post('http://core/navigate', {type: "NAV_UP_DOWN", uuid: this.uuid, menuType: this.type, position: this.focusedIndex}).then();
					if (this.displayList.length > 1) {
						this.shadowRoot!.querySelector<HTMLElement>('[id="subtitleCount"]')!.innerText = (this.focusedIndex+1)+"/"+this.displayList.length
					}
				}
				break
			case "ArrowRight":
				switch (this.displayList[this.focusedIndex].type) {
					case "slider":
						this.displayList[this.focusedIndex].value === this.displayList[this.focusedIndex].list.length-1 ? this.displayList[this.focusedIndex].value = 0 : this.displayList[this.focusedIndex].value++;
						await axios.post('http://core/sliderchange', {uuid: this.uuid, menuType: this.type, position: this.focusedIndex, value: this.displayList[this.focusedIndex].list[this.displayList[this.focusedIndex].value], valuePosition: this.displayList[this.focusedIndex].value}).then();
						await axios.post('http://core/navigate', {type: "SELECT"}).then();
						this.updateSlider()
					break;
					case "submenu":
						await axios.post('http://core/requestSubmenu', {uuid:this.displayList[this.focusedIndex].uuid}).then();
					await axios.post('http://core/navigate', {type: "SELECT"}).then();
					break;
					}
				break
			case "Enter":
			  	switch (this.displayList[this.focusedIndex].type) {
					case "checkbox":
						this.displayList[this.focusedIndex].checked = !this.displayList[this.focusedIndex].checked
						await axios.post('http://core/triggerItem', {type: this.type, menu : this.uuid, item : this.displayList[this.focusedIndex]}).then();
					break;
					case "action":
						await axios.post('http://core/triggerItem', {type: this.type, menu : this.uuid, item : this.displayList[this.focusedIndex]}).then();
						break;
					case "slider": 
						await axios.post('http://core/triggerItem', {type: this.type, menu : this.uuid, item : this.displayList[this.focusedIndex]}).then();
						break
					case "submenu":
						await axios.post('http://core/requestSubmenu', {uuid:this.displayList[this.focusedIndex].uuid}).then();
					break;
					}
				await axios.post('http://core/navigate', {type: "SELECT"}).then();
				break
		}
	}

}
customElements.define("menu-component", MenuComponent);
