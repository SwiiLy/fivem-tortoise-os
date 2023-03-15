local banks

AddEventHandler('onResourceStart', function(resourceName)
    if (GetCurrentResourceName() ~= resourceName) then
      return
    end
    MySQL.ready(function ()
        MySQL.Async.fetchAll("SELECT * FROM banks", {
        }, function(res)
            if res[1] then
                banks = res
            end
        end)
    end)
end)




RegisterNetEvent("baseevents:onPlayerDied")
AddEventHandler('baseevents:onPlayerDied', function(killerType, deathCoords)
	local _src = source
    TriggerClientEvent("closeMenu", _src)
end)








RegisterNetEvent('openProductionRequest')
AddEventHandler('openProductionRequest', function(id)
    local _src = source
    MySQL.Async.fetchAll("SELECT * FROM productions WHERE id = @id", {
        ["id"] = id
    }, function(res)
        local prod = res[1]
        if prod then
            prod.inputItem1 = MySQL.Sync.fetchAll("SELECT * FROM items WHERE id = @id ", {['id'] = prod.inputItem1Id})[1]
            prod.outputItem1 = MySQL.Sync.fetchAll("SELECT * FROM items WHERE id = @id ", {['id'] = prod.outputItem1Id})[1]
            if prod.inputItem2Id then 
                prod.inputItem2 = MySQL.Sync.fetchAll("SELECT * FROM items WHERE id = @id ", {['id'] = prod.inputItem2Id})[1]
            end
            TriggerClientEvent("openProductionCallback", _src, prod)
        else
            TriggerClientEvent("notifynui", _src, "error", "Système", "Une erreur s'est produite.")
        end
    end)
end)

RegisterNetEvent('addStockProduction')
AddEventHandler('addStockProduction', function(data)
    local _src = source
    local characterId = exports.lib:ExtractIdentifiers(_src, 'character').id
    MySQL.Async.fetchAll("SELECT * FROM productions WHERE id = @id", {
        ["id"] = data.id
    }, function(res)
        local prod = res[1]
        if prod then
            local item = MySQL.Sync.fetchAll("SELECT * FROM items WHERE id = @id", {['id'] = prod[data.item]})[1]
            if prod[data.stock] + data.value > prod[data.max] then 
                TriggerClientEvent("notifynui", _src, "error", "Production", "Impossible de dépasser la limite de stockage ("..prod[data.max].." max).")
                return
            end
            local characterQuantity = MySQL.Sync.fetchAll("SELECT * FROM inventaireCharacter WHERE characterId = @characterId AND itemId = @itemId", {['characterId'] = characterId, ['itemId'] = prod[data.item]})[1]
            if not characterQuantity or characterQuantity.quantity < data.value then 
                TriggerClientEvent("notifynui", _src, "error", "Production", "Vous n'avez pas de "..item.name.." sur vous.")
                return
            end
            MySQL.Async.execute("UPDATE productions SET "..data.stock.." = @quantity WHERE id = @id", { 
                ["quantity"] = prod[data.stock] + data.value, 
                ["id"] = prod.id 
            }, function(alteredRow)
                if not alteredRow then
                    TriggerClientEvent("notifynui", _src, "error", "Système", "Une erreur s'est produite.")
                    return
                else
                    if characterQuantity.quantity - data.value > 0 then 
                        MySQL.Async.execute("UPDATE inventaireCharacter SET quantity = @quantity WHERE characterId = @characterId AND itemId = @itemId", { 
                            ["itemId"] = prod[data.item], 
                            ["quantity"] = characterQuantity.quantity - data.value, 
                            ["characterId"] = characterId 
                        }, function(alteredRow)
                                if not alteredRow then
                                    TriggerClientEvent("notifynui", _src, "error", "Inventaire", "Une erreur s'est produite.")
                                    return
                                else
                                TriggerClientEvent("refreshInventaire", _src)
                                prod[data.stock] = prod[data.stock] + data.value
                                TriggerClientEvent("updateProductionCallback", _src, prod)
                                TriggerClientEvent("notifynui", _src, "success", "Production", "Vous avez ajouté "..data.value.." "..item.name.." dans le stock de la production.")
                            end
                        end)
                    else 
                        MySQL.Async.execute("DELETE FROM inventaireCharacter WHERE characterId = @characterId AND itemId = @itemId", { 
                            ["itemId"] = prod[data.item], 
                            ["characterId"] = characterId 
                        }, function(alteredRow)
                            if not alteredRow then
                                TriggerClientEvent("notifynui", _src, "error", "Inventaire", "Une erreur s'est produite.")
                                return
                            else
                            TriggerClientEvent("refreshInventaire", _src)
                            prod[data.stock] = prod[data.stock] + data.value
                            TriggerClientEvent("updateProductionCallback", _src, prod)
                            TriggerClientEvent("notifynui", _src, "success", "Production", "Vous avez ajouté "..data.value.." "..item.name.." dans le stock de la production.")
                        end
                        end)                
                    end
                end
            end)
        else
            TriggerClientEvent("notifynui", _src, "error", "Système", "Une erreur s'est produite.")
        end
    end)
end)
RegisterNetEvent('getStockProduction')
AddEventHandler('getStockProduction', function(data)
    local _src = source
    local characterId = exports.lib:ExtractIdentifiers(_src, 'character').id
    MySQL.Async.fetchAll("SELECT * FROM productions WHERE id = @id", {
        ["id"] = data.id
    }, function(res)
        local prod = res[1]
        if prod then
            local item = MySQL.Sync.fetchAll("SELECT * FROM items WHERE id = @id", {['id'] = prod[data.item]})[1]
            if prod[data.stock] - data.value < 0 then 
                TriggerClientEvent("notifynui", _src, "error", "Production", "Il n'y a pas cette quantité de "..item.name.." dans le stock de la production ("..prod[data.stock].."u).")
                return
            end
            local inventaire = MySQL.Sync.fetchAll("SELECT * FROM inventaireCharacter inv RIGHT JOIN items ON inv.itemId = items.id WHERE characterId = @characterId", {['characterId'] = characterId})
            local totalWeight = 0
            for i,it in pairs(inventaire) do
                totalWeight = totalWeight + (it.weight * it.quantity)
            end
            totalWeight = totalWeight + (item.weight * data.value)
            if totalWeight > 30 then 
                TriggerClientEvent("notifynui", _src, "error", "Inventaire", "Tu n'as plus de place dans ton inventaire ("..-(30-totalWeight).."kg).")
                return
            end
            local characterQuantity = MySQL.Sync.fetchAll("SELECT * FROM inventaireCharacter WHERE characterId = @characterId AND itemId = @itemId", {['characterId'] = characterId, ['itemId'] = prod[data.item]})[1]



            if characterQuantity then
                local alteredRow = MySQL.Sync.execute("UPDATE inventaireCharacter SET quantity = @quantity WHERE characterId = @characterId AND itemId = @itemId", { 
                    ["itemId"] = prod[data.item], 
                    ["quantity"] = characterQuantity.quantity + data.value, 
                    ["characterId"] = characterId 
                })
                if not alteredRow then
                    TriggerClientEvent("notifynui", _src, "error", "Inventaire", "Une erreur s'est produite.")
                    return
                else
                    TriggerClientEvent("refreshInventaire", _src)
                end
            else 
                local alteredRow = MySQL.Sync.execute("INSERT INTO inventaireCharacter (characterId, itemId, quantity) VALUES (@characterId, @itemId, @quantity)", {
                    ["characterId"] = characterId, 
                    ["itemId"] = prod[data.item], 
                    ["quantity"] = data.value
                })
                if not alteredRow then
                    TriggerClientEvent("notifynui", _src, "error", "Inventaire", "Une erreur s'est produite.")
                    return
                else
                    TriggerClientEvent("refreshInventaire", _src)
                end
            end

                
            MySQL.Async.execute("UPDATE productions SET "..data.stock.." = @quantity WHERE id = @id", { 
                ["quantity"] = prod[data.stock] - data.value, 
                ["id"] = prod.id 
            }, function(alteredRow)
                if not alteredRow then
                    TriggerClientEvent("notifynui", _src, "error", "Système", "Une erreur s'est produite.")
                    return
                else
                    TriggerClientEvent("refreshInventaire", _src)
                    prod[data.stock] = prod[data.stock] - data.value
                    TriggerClientEvent("updateProductionCallback", _src, prod)
                    TriggerClientEvent("notifynui", _src, "success", "Production", "Vous avez récupéré "..data.value.." "..item.name.." du stock de la production.")
                end
            end)
        else
            TriggerClientEvent("notifynui", _src, "error", "Système", "Une erreur s'est produite.")
        end
    end)
end)



RegisterServerEvent("getBanks")
AddEventHandler("getBanks", function()
    local _src = source
    if banks then 
        TriggerClientEvent("getBanksCallback", _src, banks)
    else
        MySQL.Async.fetchAll("SELECT * FROM banks", {
        }, function(res)
            if res[1] then
                TriggerClientEvent("getBanksCallback", _src, res)
            end
        end)
    end
end)

RegisterNetEvent("openAtm")
AddEventHandler("openAtm", function(atype)
    local _src = source
    local cId = exports.lib:ExtractIdentifiers(_src, 'character').id
    MySQL.Async.fetchAll("SELECT cash, bank FROM characters WHERE id = @cId", {
        ['cId'] = cId
    }, function(c)
        if c[1] then
            TriggerClientEvent("openAtmCallback", _src, c[1], atype)
        end
    end)
end)

RegisterNetEvent("atm")
AddEventHandler("atm", function(t, q)
    local _src = source
    local cId = exports.lib:ExtractIdentifiers(_src, 'character').id
    MySQL.Async.fetchAll("SELECT * FROM characters WHERE id = @cId", {
        ['cId'] = cId
    }, function(c)
        if c[1] then
            local bank = 0
            local cash = 0
            if t == 'r' then 
                if c[1].bank >= q then
                    bank = -q
                    cash = q
                else 
                    TriggerClientEvent("notifynui", _src, "error", "MAZE Bank", "Vous n'avez pas assez d'argent sur le compte.")
                    return
                end
            elseif t == 'd' then
                if c[1].cash >= q then
                    bank = q
                    cash = -q
                else 
                    TriggerClientEvent("notifynui", _src, "error", "MAZE Bank", "Vous n'avez pas assez d'argent sur vous.")
                    return
                end
            else 
                return
            end
            MySQL.Async.execute("UPDATE characters SET cash = cash+@cash, bank = bank+@bank WHERE id = @cId", {
                ["cash"] = cash, 
                ["bank"] = bank, 
                ['cId'] = cId
            }, function(alteredRow)                    
                if alteredRow then
                    c[1].bank = c[1].bank + bank
                    c[1].cash = c[1].cash + cash
                    if bank > 0 then 
                        TriggerClientEvent("notifynui", _src, "success", "MAZE Bank", "Vous venez de déposer "..q..'$ sur votre compte.')
                    else
                        TriggerClientEvent("notifynui", _src, "success", "MAZE Bank", "Vous venez de retirer "..q..'$ de votre compte.')
                    end
                    TriggerClientEvent("nuiBankCallback", _src, {bank = c[1].bank, cash = c[1].cash})
                else
                    TriggerClientEvent("notifynui", _src, "error", "MAZE Bank", "Une erreur s'est produite.")
                end
            end)
        else
            TriggerClientEvent("notifynui", _src, "error", "MAZE Bank", "Une erreur s'est produite.")
        end
    end)
end)
