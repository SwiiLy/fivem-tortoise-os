import './style.scss'


export { AppComponent } from './components/AppComponent/AppComponent'
export { AtmComponent } from './components/AtmComponent/AtmComponent';
export { BankComponent } from './components/BankComponent/BankComponent';
export { ProductionComponent } from './components/ProductionComponent/ProductionComponent';
export { GaugesComponent } from './components/GaugesComponent/GaugesComponent'
export { VehicleComponent } from './components/VehicleComponent/VehicleComponent'
export { ProgressbarComponent } from './components/ProgressbarComponent/ProgressbarComponent';
export { MenuComponent } from './components/MenuComponent/MenuComponent';
export { NavbarComponent } from './components/NavbarComponent/NavbarComponent';
export { NotificationComponent } from './components/NotificationComponent/NotificationComponent';
// export { InventaireComponent } from './components/InventaireComponent/InventaireComponent';
export { SettingsComponent } from './components/SettingsComponent/SettingsComponent';


// setTimeout(() => {
//     window.postMessage({type:"ui",action:"production",display:true,prod:{
//         name: "Brocoli",
//         inputItem1: {
//             name: "Graines de brocoli",
//             icon: "seedweed.png"
//         },
//         inputItem1Id: 10,
//         inputItem1Quantity: 356,
//         inputItem1Max: 1000,
//         inputItem2: {
//             name: "Engrais",
//             icon: "seedweed.png"
//         },
//         inputItem2Id: 20,
//         inputItem2Quantity: 719,
//         inputItem2Max: 1000,
//         outputItem1: {
//             name: "Brocoli",
//             icon: "broccoli.png"
//         },
//         outputItem1Id: 10,
//         outputItem1Quantity: 124,
//         outputItem1Max: 1000,
//         itemRawName: "Farine",
//         itemRawId: 5}
//     }, "http://localhost:3000/")
// }, 100);
// window.postMessage({type:"non",content:"non"}, "http://localhost:3000/")


// setTimeout(() => {
//     window.postMessage({type:"ui",action:"gauges",oxygen:5}, "http://localhost:3000/")
//     window.postMessage({type:"ui",action:"gauges",hp:150}, "http://localhost:3000/")
//     window.postMessage({type:"ui",action:"gauges",food:2}, "http://localhost:3000/")
//     window.postMessage({type:"ui",action:"gauges",water:70}, "http://localhost:3000/")
//     window.postMessage({type:"ui",action:"gauges",id:5}, "http://localhost:3000/")
//     window.postMessage({type:"non",content:"non"}, "http://localhost:3000/")
//     window.postMessage({type:"ui",action:"progressbar",duration:5000}, "http://localhost:3000/")
// }, 1000);

// setTimeout(() => {
//     window.postMessage({type:"ui",action:"gauges",oxygen:15}, "http://localhost:3000/")
//     window.postMessage({type:"ui",action:"gauges",hp:150}, "http://localhost:3000/")
//     window.postMessage({type:"ui",action:"gauges",food:12}, "http://localhost:3000/")
//     window.postMessage({type:"ui",action:"gauges",water:70}, "http://localhost:3000/")
//     window.postMessage({type:"ui",action:"gauges",id:5}, "http://localhost:3000/")
//     window.postMessage({type:"non",content:"non"}, "http://localhost:3000/")
//     window.postMessage({type:"ui",action:"progressbar",duration:2000,text:"Manger des saucisses"}, "http://localhost:3000/")
// }, 5000);


window.onload = () => {
    window.addEventListener('message', (event) => {
        var item = event.data;
        if (item !== undefined && item.type === "ui") {
            if (item.action == "gauges") {
                const gaugeComponent = document.getElementById("GaugesComponent") as HTMLElement;
                gaugeComponent.setAttribute("serverId", "8")
                gaugeComponent.setAttribute("display", item.display)
                gaugeComponent.setAttribute("oxygen", item.oxygen)
                gaugeComponent.setAttribute("hp", item.hp)
                gaugeComponent.setAttribute("food", item.food)
                gaugeComponent.setAttribute("water", item.water)
                gaugeComponent.setAttribute("serverId", item.id)
            } else if (item.action == "vehicle") {
                const vehicleComponent = document.getElementById("VehicleComponent") as HTMLElement;
                vehicleComponent.setAttribute("display", item.display)
                vehicleComponent.setAttribute("speed", item.speed)
                vehicleComponent.setAttribute("rpm", item.rpm)
                vehicleComponent.setAttribute("gear", item.gear)
                vehicleComponent.setAttribute("fuel", item.fuel)
                // vehicleComponent.setAttribute("crash", item.crash)
            // } else if (item !== undefined && item.type === "ui" && item.action === "progressbar") {
            //     const progressbarComponent = document.getElementById("ProgressbarComponent") as HTMLElement;
            //     progressbarComponent.setAttribute("new", JSON.stringify({duration:item.duration, text:item.text}))
            } else if (item !== undefined && item.type === "ui" && item.action === "notification") {
                const notifComponent = document.getElementById("NotificationComponent") as HTMLElement;
                if(item.title){
                    notifComponent.setAttribute("new", JSON.stringify({title:item.title, content:item.content, color:item.color}))
                } else if(item.vehicle){
                    notifComponent.setAttribute("vehicle", item.vehicle)
                }
            } else if (item !== undefined && item.type === "ui" && item.action === "global") {
                document.getElementById("app")!.hidden = !item.display
            } else if (item.action === "navbar") {
                const navbarComponent = document.getElementById("NavbarComponent") as HTMLElement;
                navbarComponent.setAttribute("display", item.display)
            } else if (item.action === "settings") {
                const settingComponent = document.getElementById("SettingsComponent") as HTMLElement;
                settingComponent.setAttribute("color", item.color)
            } else if (item.action === "production") {
                const prodComponent = document.getElementById("ProductionComponent") as HTMLElement;
                if (item.update) {
                    prodComponent.setAttribute("update", JSON.stringify(item.update))
                } else {
                    prodComponent.setAttribute("visible", item.display)
                    prodComponent.setAttribute("prod", JSON.stringify(item.prod))
                }
            } else if (item.action == "bank") {
                const bankComponent = document.getElementById("BankComponent") as HTMLElement;
                item.visible != undefined ? bankComponent.setAttribute("visible", item.visible) : null
                bankComponent.setAttribute("cash", item.data.cash)
                bankComponent.setAttribute("bank", item.data.bank)
            } else if (item.action == "atm") {
                const atmComponent = document.getElementById("AtmComponent") as HTMLElement;
                item.visible != undefined ? atmComponent.setAttribute("visible", item.visible) : null
                atmComponent.setAttribute("bank", item.data.bank)
            }
        }
    })
}