RegisterNetEvent("baseevents:onPlayerDied")
AddEventHandler('baseevents:onPlayerDied', function(killerType, deathCoords)
	local _src = source
    TriggerClientEvent("tortoise_menu:closeMenu", _src)
end)
