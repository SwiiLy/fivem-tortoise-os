# tortoise-os

Warning : This is a WIP resource not fully adapted for external use, and will require some adjustments to work well. No documentation is written atm (todo). 

A FiveM NUI resource developed with webcomponent that includes the following features: 
- Food, drink, health and breathing gauges (+serverid display)
- Vehicle speedometer
- Notifications
- Progress Bars
- Menu
- Settings (NUI Color Theme)
- Dropdown Toolbar Menu
- Simple Bank and ATM
- Custom interfaces for other resources of my private server
- ID Card
- Sound player for notifications/alers or other uses

In development : 
- Talent tree production
- Notification improvements
- Driver license 
- Top screen alert or news
- Locales for translations (it's mainly in french)
- Inventory

To start resource copy `[tortoise-os]` folder on your FiveM server then install and compile nui with
```
[tortoise-os]/core
npm i --include-dev
npm run build
```

Start it in your server.cfg file with :
```
ensure core
ensure menu
```


# Architecture

- `/[tortoise-os]/core` : Includes the NUI source code and his lua files.
- `/[tortoise-os]/menu` : Includes all menus in a metatable and manager then.

# Informations

It's a little fivem resource still in development for my private server, that may not work perfectly. Documentation may not be complete. I will try to adapt it for exernal use and remove or adjust the custom parts coming from my others resources. Feel free to give me any feedbacks or suggestions. 