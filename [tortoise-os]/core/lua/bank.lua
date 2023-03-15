
RegisterNUICallback('retrait', function(data, cb)
    TriggerServerEvent("atm",'r', tonumber(data.value))
    cb("");
end)
    
RegisterNUICallback('depot', function(data, cb)
    TriggerServerEvent("atm",'d', tonumber(data.value))
    cb("");
end)




function setBanksMarkers()
    for i,bank in pairs(banks) do 
        Citizen.CreateThread(function()
            while true do
                local interval = 5000
                local pos = GetEntityCoords(PlayerPedId())
                DrawMarker(27, bank.x, bank.y, bank.z, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.8, 0.8, 0.8, 0, 150, 0, 255, 0, 0, 2, 0, nil, nil, 0)
                local dest = vector3(bank.x, bank.y, bank.z)
                local distance = GetDistanceBetweenCoords(pos, dest, true)
                if distance < 50 then
                    interval = 10
                    if distance < 10 then 
                        interval = 0
                    end
                    if distance < 2 then
                        if not exports.menu:isMenuOpen() then
                            AddTextEntry("BANK", "Utiliser ~INPUT_CONTEXT~")
                            DisplayHelpTextThisFrame("BANK", false)
                            if IsControlJustPressed(1, 51) then
                                TriggerServerEvent("openAtm", "bank")
                            end
                        end
                    end
                end
                Citizen.Wait(interval)
            end
        end
    end)
end

function setBanksBlips()
    Citizen.CreateThread(function()
        for i,sup in pairs(banks) do 
            local blip = AddBlipForCoord(sup.x, sup.y, sup.z)
            SetBlipSprite(blip, 108)
            AddTextEntry('BANK', "Banque")
            BeginTextCommandSetBlipName('BANK') 
            SetBlipColour(blip, 69)
            SetBlipCategory(blip, 1) 
            EndTextCommandSetBlipName(blip)
            SetBlipAsShortRange(blip, true)
            SetBlipScale(blip, 0.8)
        end
    end)
end

RegisterNetEvent("getBanksCallback")
AddEventHandler("getBanksCallback", function(sup)
    banks = sup
    setBanksBlips()
    setBanksMarkers()
end)

RegisterNetEvent("openAtm")
AddEventHandler('openAtm', function(atype)
	RequestAnimDict('anim@heists@keycard@')
	while not HasAnimDictLoaded('anim@heists@keycard@') do
		Citizen.Wait(0)
	end
	TaskPlayAnim( GetPlayerPed(-1), "anim@heists@keycard@", "enter", 8.0, 8.0, 2000, 16, 0, 0, 0, 0 )
    Wait(1500)
    TriggerServerEvent("openAtm", "atm")
end)

RegisterNetEvent("openAtmCallback")
AddEventHandler('openAtmCallback', function(data, atype)
    SetNuiFocus(true, true)
    SetNuiFocusKeepInput(false)
    SendNUIMessage({
        type = "ui",
        action = atype,
        visible = true,
        data = data
    })
end)

RegisterNetEvent("nuiBankCallback")
AddEventHandler('nuiBankCallback', function(data)
    SendNUIMessage({
        type = "ui",
        action = "bank",
        data = data
    })
    SendNUIMessage({
        type = "ui",
        action = "atm",
        data = data
    })
end)


function openAtm()
    TriggerEvent("openAtm", "atm")
end
Citizen.CreateThread(function()
    Wait(5000)
    exports.qtarget:AddTargetModel({506770882, 506770882, -870868698, -1126237515 }, {
        options = {
            {
                event = "openAtm",
                icon = "fas fa-money-bills",
                label = "Accéder à l'ATM",
            },
        },
        distance = 1
    })
    
end)
