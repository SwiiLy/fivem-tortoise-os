local display = true
local displayVehicle = false
local displayGauges = false
local character

AddEventHandler('onClientResourceStart', function (resourceName)
  if(GetCurrentResourceName() ~= resourceName) then
    return
  end
  print('The resource ' .. resourceName .. ' is starting on the client.')
  Wait(500)
  TriggerServerEvent("getBanks")
  while character == nil do 
      TriggerServerEvent("getCharacter")
      Wait(1000)
  end
  Citizen.CreateThread(function()
    local color = GetResourceKvpString('theme-color')
    if not color then color = "blue" end
    SendNUIMessage({
      type = "ui",
      action = "settings",
      color = color,
    })
  end)
  print('The resource ' .. resourceName .. ' has been started on the client.')
end)

RegisterNetEvent('getCharacterCallback')
AddEventHandler('getCharacterCallback', function(c)
  Citizen.CreateThread(function()
    if character then 
      local food = character.food 
      local water = character.water 
      character = c
      character.food = food
      character.water = water
    else
      character = c
    end
  end)
end)

RegisterNetEvent('setCharacterFood')
AddEventHandler('setCharacterFood', function(f)
  if character then 
    character.food = f
  end
end)

RegisterNetEvent('setCharacterWater')
AddEventHandler('setCharacterWater', function(w)
  if character then 
    character.water = w
  end
end)

function getFood()
  if not character then
    return 100 
  else 
    return character.food 
  end
end

function getWater()
  if not character then
    return 100 
  else 
    return character.water 
  end
end



Citizen.CreateThread(function()
  while true do
    local interval = 10
    if IsPauseMenuActive() then
      if display then 
        display = false
        SendNUIMessage({
          type = "ui",
          action = "global",
          display = false
        })
      end
    else
      if not display then 
        display = true
        SendNUIMessage({
          type = "ui",
          action = "global",
          display = true
        })
      end
    end
    if IsPedInAnyVehicle(GetPlayerPed(-1), false) then 
      if not displayVehicle then 
        displayVehicle = true
        SendNUIMessage({
          type = "ui",
          action = "notification",
          vehicle = "true"
        })
      end
    else
      if displayVehicle then 
        displayVehicle = false
        SendNUIMessage({
          type = "ui",
          action = "notification",
          vehicle = "false"
        })
      end
    end
    Wait(interval)
  end
end)




Citizen.CreateThread(function()
  while true do
    local interval = 1000
    local ped = GetPlayerPed(-1)
    if DoesEntityExist(ped) and not IsEntityDead(ped) then
      interval = 100
      local oxygen = nil
      if(IsPedSwimmingUnderWater(GetPlayerPed(-1))) then
        oxygen = GetPlayerUnderwaterTimeRemaining(PlayerId())
        if oxygen < 0 then 
          oxygen = 0 
        end
      end
      SendNUIMessage({
        type = "ui",
        display = true, 
        id = GetPlayerServerId(PlayerId()),
        hp = GetEntityHealth(ped),
        food = getFood(),
        water = getWater(),
        oxygen = oxygen,
        action = "gauges",
      })
      displayGauges = true
    else
      if displayGauges then
        displayGauges = false
        SendNUIMessage({
          type = "ui",
          action = "gauges",
          display = false
        })
      end
    end
    Wait(interval)
  end
end)






local displayVehicle = false



Citizen.CreateThread(function()
  Wait(500)
  SendNUIMessage({
    type = "ui",
    display = false,
    action = "vehicle"
  })
  while true do
    local interval = 1000
    if IsPedSittingInAnyVehicle(GetPlayerPed(-1)) then 
      interval = 100
      local currentVehicle = GetVehiclePedIsIn(PlayerPedId())
      if  GetPedInVehicleSeat(currentVehicle, -1) == GetPlayerPed(-1) and GetVehicleClass(currentVehicle) ~= 13 then
        interval = 10
        displayVehicle = true
        -- local phare0, phare1, phare2 = GetVehicleLightsState(currentVehicle)
        -- if GetVehicleBodyHealth(currentVehicle) 
        -- local damage = GetVehicleBodyHealth(currentVehicle)
        local rpm 
        if IsVehicleEngineOn(currentVehicle) then 
          rpm = GetVehicleCurrentRpm(currentVehicle)
        else
          rpm = 0
        end
        SendNUIMessage({
          type = "ui",
          action = "vehicle",
          display = true, 
          speed = GetEntitySpeed(currentVehicle),
          rpm = rpm,
          gear = GetVehicleCurrentGear(currentVehicle),
          -- abs = (GetVehicleWheelSpeed(currentVehicle, 0) == 0.0) and (GetEntitySpeed(currentVehicle) > 0.0),
          -- hBrake = GetVehicleHandbrake(currentVehicle),
          fuel = 100 * GetVehicleFuelLevel(currentVehicle) / GetVehicleHandlingFloat(currentVehicle,"CHandlingData","fPetrolTankVolume"),
          -- crash = GetVehicleBodyHealth(currentVehicle),
          -- phare0 = phare0,
          -- phare1 = phare1,
          -- phare2 = phare2,
        })
      else
        if displayVehicle == true then
          SendNUIMessage({
            type = "ui",
            action = "vehicle",
            display = false
          })
          displayVehicle = false
        end
      end
    else
      if displayVehicle == true then
        SendNUIMessage({
          type = "ui",
          action = "vehicle",
          display = false
        })
        displayVehicle = false
      end
    end
    Wait(interval)
  end
end)




RegisterNetEvent('progressBar')
AddEventHandler('progressBar', function(duration, text, name)
  SendNUIMessage({
    type = "ui",
    duration = duration*1000,
    text = text,
    name = name,
    display = true,
    action = "progressbar"
  })
end)

RegisterNetEvent('stopProgressBar')
AddEventHandler('stopProgressBar', function(name)
  SendNUIMessage({
    type = "ui",
    action = "progressbar",
    name = name,
    display = false,
  })
end)



function notify(text)
  SetNotificationTextEntry('STRING')
  AddTextComponentString(text)
  DrawNotification(false, true)
end

RegisterNetEvent('notify')
AddEventHandler('notify', function(msg)
  SendNUIMessage({
    type = "ui",
    action = "notification",
    color = "info",
    title = "Information",
    content = msg,
  })
end)

RegisterNetEvent('notifynui')
AddEventHandler('notifynui', function(color, title, text)
  SendNUIMessage({
    type = "ui",
    action = "notification",
    color = color,
    title = title,
    content = text,
  })
end)


RegisterNetEvent('playsound')
AddEventHandler('playsound', function(sound)
  -- SendNUIMessage({
  --   type = "sound",
  --   sound = sound,
  -- })
end)







RegisterKeyMapping('+menu', 'Menu rapide', 'keyboard', 'F3')


RegisterCommand('+menu', function()
  exports.menu:closeMenu()
  TriggerEvent("hideInv")
  SendNUIMessage({
    type = "ui",
    action = "navbar",
    display = true
  })
  SetNuiFocus(true, true)
  SetNuiFocusKeepInput(false)
  
end, false)

RegisterCommand('-menu', function()
end, false)

RegisterNUICallback('closemenu', function(data, cb)
  SetNuiFocus(false, false)
  SetNuiFocusKeepInput(false)
  cb('')
end)

RegisterNUICallback('setcolor', function(data, cb)
  SetResourceKvp('theme-color', data.color)
  cb('')
end)





RegisterNetEvent('tortoise_core:requestIDCard')
AddEventHandler('tortoise_core:requestIDCard', function(serverId)
  if serverId and serverId ~= 0 then
    TriggerServerEvent('tortoise_core:requestIDCard', serverId, character)
  else
    TriggerEvent("notifynui", "error", "Inventaire", "Tu n'as personne devant toi.")
  end
end)


RegisterNetEvent('tortoise_core:openIDCard')
AddEventHandler('tortoise_core:openIDCard', function(c)
  if c == 'self' then 
    SendNUIMessage({
      type = "ui",
      action = "card",
      visible = true,
      character = {
        id = character.id,
        firstName = character.firstName,
        lastName = character.lastName,
        birthday = character.birthday,
        sexe = character.sexe,
        createdAt = character.createdAt,
      }
    })
  else
    SendNUIMessage({
      type = "ui",
      action = "card",
      visible = true,
      character = {
        id = c.id,
        firstName = c.firstName,
        lastName = c.lastName,
        birthday = c.birthday,
        sexe = c.sexe,
        createdAt = c.createdAt,
      }
    })
  end
end)



RegisterNetEvent('openProductionCallback')
AddEventHandler('openProductionCallback', function(prod)
  SetNuiFocus(true, true)
  SetNuiFocusKeepInput(false)
  SendNUIMessage({
    type = "ui",
    action = "production",
    display = true,
    prod = prod
  })
end)

RegisterNetEvent('updateProductionCallback')
AddEventHandler('updateProductionCallback', function(prod)
  SendNUIMessage({
    type = "ui",
    action = "production",
    update = prod
  })
end)

RegisterNUICallback('productionadd', function(data, cb)
  TriggerServerEvent("addStockProduction", data)
  cb('')
end)
RegisterNUICallback('productionget', function(data, cb)
  TriggerServerEvent("getStockProduction", data)
  cb('')
end)

