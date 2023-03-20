import html from "./SoundComponent.html?raw";
import style from "./SoundComponent.scss";


export class SoundComponent extends HTMLElement {
    
    static get observedAttributes() { return ["new", "volume", "stop"];}

	sound?: HTMLAudioElement
    sounds = [
		{name: "doorbell", url: "./sounds/doorbell.mp3"},
		{name: "notif", url: "./sounds/notif.mp3"},
	]
	volume: number = 1

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot!.innerHTML = html;
        const styleElement = document.createElement("style");
        styleElement.innerHTML = style;
        this.shadowRoot?.appendChild(styleElement);
    }


    connectedCallback() {
		// this.newSound("doorbell")
    }

	newSound(name:string, loop?:boolean){
		let sound = this.sounds.filter(sound => sound.name === name)[0]		
		if (sound) {
			let audio = new Audio(sound.url)
			audio.volume = this.volume
			if (loop) {
				audio.loop = true
				this.sound = audio
			}
			audio.play()
		}
	}


    attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
        if (name=="new") {
			let sound = JSON.parse(newValue)
			this.newSound(sound.name, sound.loop)
        } else if (name=="volume"){
			this.volume = Number(newValue)
		} else if (name=="stop"){
			this.sound?.pause()
		}
    }

}
customElements.define("sound-component", SoundComponent);
