RegisterNetEvent('openMenu')
AddEventHandler('openMenu', function(shouldShow)
    SetNuiFocus(shouldShow, false)
    SetNuiFocusKeepInput(shouldShow)
    SendNUIMessage({
        type = "ui",
        action = "menu",
        display = shouldShow
    })
end)
RegisterNetEvent('sendMenu')
AddEventHandler('sendMenu', function(menu)
    SendNUIMessage({
        type = "ui",
        action = "menu",
        data = menu
    })
end)


RegisterNUICallback('requestMenu', function(data, cb)
    TriggerEvent("tortoise_menu:requestMenu", data)
    cb("")
end)

RegisterNUICallback('requestSubmenu', function(data, cb)
    TriggerEvent("tortoise_menu:requestSubmenu", data)
    cb("")
end)

RegisterNUICallback('close', function(data, cb)
    TriggerEvent("tortoise_menu:closeMenu")
    cb("")
end)

RegisterNUICallback('triggerItem', function(data, cb)
    TriggerEvent("tortoise_menu:triggerItem", data)
    cb("")
end)

RegisterNUICallback('navigate', function(data, cb)
    TriggerEvent("tortoise_menu:navigate", data)
    cb("")
end)

RegisterNUICallback('sliderchange', function(data, cb)
    TriggerEvent("tortoise_menu:sliderchange", data)
    cb("")
end)