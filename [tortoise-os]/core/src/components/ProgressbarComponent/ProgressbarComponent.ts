import html from "./ProgressbarComponent.html?raw";
import style from "./ProgressbarComponent.scss";

interface ProgressBar {
    id: number,
    created: Date,
    duration: number
}

export class ProgressbarComponent extends HTMLElement {
    
    static get observedAttributes() { return ["new", "color"];}

    bars: ProgressBar[] = []

	color: string = "blue"

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot!.innerHTML = html;
        const styleElement = document.createElement("style");
        styleElement.innerHTML = style;
        this.shadowRoot?.appendChild(styleElement);

        // this.createProgress(5000)
		// setTimeout(() => {
		// 	this.createProgress(2000, "Cuisson de la viande ...")
		// 	setTimeout(() => {
		// 		this.createProgress(2000)
		// 	}, 1000);
		// }, 1000);
    }


    connectedCallback() {

		window.addEventListener('message', (event) => {
			var item = event.data;
			if (item !== undefined && item.type === "ui" && item.action === "progressbar") {
				if(item.display){
					this.createProgress(item.duration, item.text, item.name)
				} else {
					if(item.name){
						let progressbar = this.shadowRoot!.querySelector<HTMLElement>('[id="progressbar'+item.name+'"]');
						if(progressbar){
							progressbar.style.animation = "slideout 0.5s forwards";
							setTimeout(() => {
								progressbar!.remove()
							}, 500);
						}
					}
				}
			}
		})
    }

    createProgress(duration: number, text: string, name?: string) {
        // let progress = this.shadowRoot!.querySelector<HTMLElement>('[id="progress"]');
		// progress!.style.width = "0%"
		// progress!.style.transition = "all "+duration/1000+"s linear";
		// setTimeout(() => {
		// 	progress!.style.width ="100%"
		// }, 10);
		let children
		for (let i = 0; i < this.shadowRoot!.childNodes.length; i++) {
			const element: any = this.shadowRoot!.childNodes[i];
			if(element.classList && element.classList.length > 0 && element.classList.contains("progressbar")){
				children = element
				break
			}
		}

		const progressContainer = document.createElement("div")
		progressContainer.classList.add("progressbar")
		name ? progressContainer.id = "progressbar"+name : null;
		
		progressContainer.classList.add(this.color)

		if(text){
			const span = document.createElement("span")
			span.innerText = text
			progressContainer.appendChild(span)
		}

		const progressBar = document.createElement("div")
		progressBar.classList.add("progress")
		progressBar.style.width = "0%"
		progressBar.style.transition = "all "+(duration-100)/1000+"s linear";
		progressContainer.appendChild(progressBar)

		if (children) {
			this.shadowRoot?.insertBefore(progressContainer, children);
		} else {
			this.shadowRoot?.appendChild(progressContainer);
		}
		setTimeout(() => {
			progressBar.style.width ="100%"
		}, 100);
		setTimeout(() => {
			if (progressContainer) {
				progressContainer.style.animation = "slideout 0.5s forwards";
				setTimeout(() => {
					progressContainer.remove()
				}, 500);
			}
		}, duration+150);
	}


    attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
		// let json = JSON.parse(newValue)
		// this.createProgress(json.duration, json.text)
		if (name=="color") {
			this.color = newValue
			
		}
    }

}
customElements.define("progressbar-component", ProgressbarComponent);
