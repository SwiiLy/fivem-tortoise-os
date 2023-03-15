import html from "./NotificationComponent.html?raw";
import style from "./NotificationComponent.scss";

interface Notification {
    id: number,
    created: Date,
    duration: number
}

export class NotificationComponent extends HTMLElement {
    
    static get observedAttributes() { return ["new", "vehicle"];}

    bars: Notification[] = []

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot!.innerHTML = html;
        const styleElement = document.createElement("style");
        styleElement.innerHTML = style;
        this.shadowRoot?.appendChild(styleElement);


        // this.createNotification(5000, "Inventaire", "Une erreur s'est produite", "success")
		// setTimeout(() => {
		// 	this.createNotification(2000, "Cuisson de la viande ...")
		// 	setTimeout(() => {
		// 		this.createNotification(2000)
		// 	}, 1000);
		// }, 1000);

        // window.onload = () => {
        //     window.addEventListener('message', (event) => {
        //         var item = event.data;
        //         if (item !== undefined && item.type === "ui") {
        //             if (item.action == "notification") {
		// 				this.createNotification(5000, item.title, item.content, item.ctype)
		// 			}
        //         }
        //     })
        // }
    }


    connectedCallback() {
    }

    createNotification(duration: number, titleText: string, text: string, type?: string) {
		let children
		for (let i = 0; i < this.shadowRoot!.childNodes.length; i++) {
			const element: any = this.shadowRoot!.childNodes[i];
			if(element.classList && element.classList.length > 0 && element.classList.contains("notification")){
				children = element
				break
			}
		}
		const progressContainer = document.createElement("div")
		progressContainer.classList.add("notification")
		if(type){
			progressContainer.classList.add(type)
		}
		const progressBar = document.createElement("div")
		progressBar.classList.add("progress")
		progressBar.style.width = "100%"
		progressBar.style.transition = "all "+(duration-100)/1000+"s linear";
		progressContainer.appendChild(progressBar)
		const title = document.createElement("h1")
		title.innerText = titleText
		progressContainer.appendChild(title)
		const content = document.createElement("p")
		content.innerText = text
		progressContainer.appendChild(content)
		if (children) {
			this.shadowRoot?.insertBefore(progressContainer, children);
		} else {
			this.shadowRoot?.appendChild(progressContainer);
		}
		setTimeout(() => {
			progressBar.style.width ="0%"
		}, 100);
		setTimeout(() => {
			progressContainer.style.animation = "slideout 0.3s";
			setTimeout(() => {
				progressContainer.remove()
			}, 300);
		}, duration+50);
	}


    attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
        if (name=="new") {
			let notification = JSON.parse(newValue)
			this.createNotification(5000, notification.title, notification.content, notification.color)
        } else if (name=="vehicle"){
			if (newValue=="true") {
				document.getElementById("NotificationComponent")?.classList.contains("vehicle") ? null : document.getElementById("NotificationComponent")?.classList.add("vehicle");
			} else {
				document.getElementById("NotificationComponent")?.classList.remove("vehicle")
			}
		}
    }

}
customElements.define("notification-component", NotificationComponent);
