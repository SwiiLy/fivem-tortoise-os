-- *** MENU ***

MenuTable = {
    name = 'Menus',
    description = 'Liste de tous les menus',
    menus = {},
    submenus = {}
}

isOpen = false
currentOpenMenu = nil


-- @func uuid
-- @description Generate a unique id.
local random = math.random
local randomseed = math.randomseed
local function uuid()
    randomseed(GetGameTimer() + random(30720, 92160))
    local template ='xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    return string.gsub(template, '[xy]', function (c)
        local v = (c == 'x') and random(0, 0xf) or random(8, 0xb)
        return string.format('%x', v)
    end)
end


-- @func toggleNuiMenu
-- @param shouldShow enable or disable menu
-- @description Call "openMenu" event in core ressource for toggle menu display
function toggleNuiMenu(shouldShow)
    isOpen = shouldShow
    TriggerEvent("openMenu", shouldShow)
    if not shouldShow then
        currentOpenMenu = nil
    end
    --
    -- A FAIRE : DESACTIVER LES CLICS SOURIS QUAND LE MENU EST OUVERT ET UTILISE MOLETTE ET CLIC POUR NAVIGUER
    --
    -- if shouldShow then
    --     DisableControlAction(0,24) -- INPUT_ATTACK MARCHE PAS CA
    --     DisableControlAction(0,69) -- INPUT_VEH_ATTACK
    --     DisableControlAction(0,70) -- INPUT_VEH_ATTACK2
    --     DisableControlAction(0,92) -- INPUT_VEH_PASSENGER_ATTACK
    --     DisableControlAction(0,114) -- INPUT_VEH_FLY_ATTACK
    --     DisableControlAction(0,257) -- INPUT_ATTACK2
    --     DisableControlAction(0,331) -- INPUT_VEH_FLY_ATTACK2
    -- else 
        -- EnableControlAction(2, 1, true)
        -- EnableControlAction(2, 2, true)
        -- EnableControlAction(2, 12, true)
        -- EnableControlAction(2, 13, true)

    -- end
end

  

-- @func openMenu
-- @param m Menu to open
-- @description Get the menu to open from list and send it to nui
function openMenu(m)
    for i,v in pairs(MenuTable.menus) do 
        if v.uuid == m.uuid then
            local menu = {
                uuid = v.uuid,
                name = v.name,
                title = v.title,
                subtitle = v.subtitle,
                footer = v.footer,
                type = v.type,
                Items = v.Items,
                position = v.position,
            }
            currentOpenMenu = v
            TriggerEvent("sendMenu", menu)
            if v.Items[v.position+1] and v.Items[v.position+1].hover then 
                local fn = v.Items[v.position+1].hover
                fn()
            end
            break
        end
    end
    toggleNuiMenu(true)
end


-- @func openSubMenu
-- @param m Submenu to open
-- @description Get the submenu to open from list and send it to nui
function openSubMenu(m)
    for i,v in pairs(MenuTable.submenus) do 
        if v.uuid == m.uuid then
            local menu = {
                uuid = v.uuid,
                name = v.name,
                title = v.title,
                subtitle = v.subtitle,
                footer = v.footer,
                type = v.type,
                Items = v.Items,
                parentType = v.parentType,
                parent = v.parent,
                position = v.position,
            }
            currentOpenMenu = v
            TriggerEvent("sendMenu", menu)
            if v.Items[v.position+1] and v.Items[v.position+1].hover then 
                local fn = v.Items[v.position+1].hover
                fn()
            end
            break
        end
    end
    toggleNuiMenu(true)
end


-- @func closeMenu
-- @description Close menu and call onclose() function of this menu if exists
function closeMenu()
    PlaySoundFrontend(-1, "QUIT", "HUD_FRONTEND_DEFAULT_SOUNDSET", true)
    if currentOpenMenu and currentOpenMenu.onclose then 
        local fn = currentOpenMenu.onclose
        fn()
    end
    toggleNuiMenu(false)
end


-- @func closeMenu
-- @description Event called of player death
RegisterNetEvent('tortoise_menu:closeMenu')
AddEventHandler('tortoise_menu:closeMenu', function()
    closeMenu()
end)


-- @func isMenuOpen
-- @param m Optional - Menu to check
-- @description Check if the menu is open or if the given menu is open 
function isMenuOpen(menu)
    if menu and isOpen then
        if currentOpenMenu and currentOpenMenu.uuid and menu.uuid == currentOpenMenu.uuid then 
            return true 
        else
            return false
        end
    else
        return isOpen
    end
end


-- @event triggerItem
-- @param data Data sent from NUI, menu of submenu
-- @description Get the menu or submenu element triggered and call his select() function
RegisterNetEvent('tortoise_menu:triggerItem')
AddEventHandler('tortoise_menu:triggerItem', function(data)
    if data.type == "menu" then 
        for i,menu in pairs(MenuTable.menus) do 
            if menu.uuid == data.menu then 
                for i,v in pairs(menu.Items) do
                    if v.uuid == data.item.uuid and v.select then
                        local fn = v.select
                        fn()
                        return
                    end
                end
            end
        end
    else 
        for i,menu in pairs(MenuTable.submenus) do 
            if menu.uuid == data.menu then 
                for i,v in pairs(menu.Items) do
                    if v.uuid == data.item.uuid and v.select then
                        local fn = v.select
                        fn()
                        return
                    end
                end
            end
        end
    end
end)



-- @event requestMenu
-- @param data Data sent from NUI, uuid of requested menu
-- @description Request a menu and send it back to NUI, call function hover of first element of the menu if exists
RegisterNetEvent('tortoise_menu:requestMenu')
AddEventHandler('tortoise_menu:requestMenu', function(data)
    for i,menu in pairs(MenuTable.menus) do 
        if menu.uuid == data.uuid then
            currentOpenMenu = menu
            TriggerEvent("sendMenu", menu)
            if menu.Items and menu.position then 
                if menu.Items[menu.position+1] and menu.Items[menu.position+1].hover then 
                    local fn = menu.Items[menu.position+1].hover
                    fn()
                end
            end
            break
        end
    end
    -- A VERIFIER : utile? 
    if data.closing then 
        if data.closingType == "menu" then 
            for i,menu in pairs(MenuTable.menus) do 
                if menu.uuid == data.closing then
                    if menu.onclose then 
                        local fn = menu.onclose
                        fn()
                    end
                    break
                end
            end
        else
            for i,menu in pairs(MenuTable.submenus) do 
                if menu.uuid == data.closing then
                    if menu.onclose then 
                        local fn = menu.onclose
                        fn()
                    end
                    break
                end
            end
        end
    end
end)


-- @event requestSubmenu
-- @param data Data sent from NUI, uuid of requested submenu
-- @description Request a submenu and send it back to NUI, call function hover of first element of the submenu if exists
RegisterNetEvent('tortoise_menu:requestSubmenu')
AddEventHandler('tortoise_menu:requestSubmenu', function(data)
    for i,menu in pairs(MenuTable.submenus) do 
        if menu.uuid == data.uuid then
            currentOpenMenu = menu
            TriggerEvent("sendMenu", menu)
            if menu.Items and menu.position then 
                if menu.Items[menu.position+1] and menu.Items[menu.position+1].hover then 
                    local fn = menu.Items[menu.position+1].hover
                    fn()
                end
            end
            break
        end
    end
    -- A VERIFIER
    if data.closing then 
        if data.closingType == "menu" then 
            for i,menu in pairs(MenuTable.menus) do 
                if menu.uuid == data.closing then
                    if menu.onclose then 
                        local fn = menu.onclose
                        fn()
                    end
                    break
                end
            end
        else
            for i,menu in pairs(MenuTable.submenus) do 
                if menu.uuid == data.closing then
                    if menu.onclose then 
                        local fn = menu.onclose
                        fn()
                    end
                    break
                end
            end
        end
    end
end)



-- @func addMenu
-- @param menu Menu
-- @description Add the given menu to metatable, if the menu already exists replace it
function addMenu(menu)
    for i,p in pairs(MenuTable.menus) do 
        if p.uuid == menu.uuid or menu.name and menu.name == p.name then
            MenuTable.menus[i] = menu
            return
        end
    end
    table.insert(MenuTable.menus, menu)
end

-- @func updateMenu
-- @param menu Menu
-- @param items Items
-- @description Update the items of the given menu to metatable
function updateMenu(menu, items)
    for i,p in pairs(MenuTable.menus) do 
        if p.uuid == menu.uuid then
            table.insert(MenuTable.menus[i].Items, items)
            return
        end
    end
end

-- @func removeMenu
-- @param uuid UUID of the menu
-- @description Delete the menu from metatable
function removeMenu(uuid)
    for i,p in pairs(MenuTable.menus) do
        if p.uuid == uuid then
            table.remove(MenuTable.menus, i)
            return
            -- return printlib("Suppression de "..uuid.." des menus actifs.", 1)
        end
    end
end

-- @func addSubmenu
-- @param submenu Submenu
-- @description Add the given submenu to metatable, if the submenu already exists replace it
function addSubmenu(submenu)
    for i,p in pairs(MenuTable.submenus) do 
        if p.uuid == submenu.uuid or submenu.name and submenu.name == p.name then
            local pos = p.position
            MenuTable.submenus[i] = submenu
            MenuTable.submenus[i].position = pos
            return
        end
    end
    table.insert(MenuTable.submenus, submenu)
end

-- @func updateSubmenu
-- @param submenu Submenu
-- @param items Items
-- @description Update the items of the given submenu to metatable
function updateSubmenu(submenu, item)
    for i,p in pairs(MenuTable.submenus) do 
        if p.uuid == submenu.uuid then
            table.insert(MenuTable.submenus[i].Items, item)
            return
        end
    end
end

-- @func removeMenu
-- @param uuid UUID of the submenu
-- @description Delete the submenu from metatable
function removeSubmenu(uuid)
    for i,p in pairs(MenuTable.submenus) do
        if p.uuid == uuid then
            table.remove(MenuTable.submenus, i)
            return
            -- return printlib("Suppression de "..uuid.." des submenus actifs.", 1)
        end
    end
end


-- Create a new menu
-- @param infos Menu informations
-- @description Create and new menu with the given infos, and add it the global metatable
-- @return Menu created
function CreateMenu(infos)
    local postion = 0
    if infos.position then 
        position = infos.position 
    end
    local newMenu = {
        name = infos.name,
        title = infos.title,
        subtitle = infos.subtitle,
        footer = infos.footer,
        onclose = infos.onclose,
        uuid = uuid(),
        Items = {},
        type = "menu",
        position = postion,
        -- @func AddButton
        -- @param t Menu that include this button
        -- @param data Button informations
        -- @description Create a new button and add it to the items array
        AddButton = function(t, data)
            local item = {
                uuid = uuid(),
                label = data.label,
                type = "action",
                badge = data.badge,
                select = data.select,
                hover = data.hover,
            }
            local items = rawget(t, 'Items')
            local newIndex = #items + 1
            rawset(items, newIndex, item)
            updateMenu(t, item)
            return item
        end,
        -- @func AddCheckbox
        -- @param t Menu that include this checkbox
        -- @param data checkbox informations
        -- @description Create a new checkbox and add it to the items array
        AddCheckbox = function(t, data)
            local item = {
                uuid = uuid(),
                label = data.label,
                type = "checkbox",
                checked = data.checked,
                hover = data.hover,
                select = data.select
            }
            local items = rawget(t, 'Items')
            local newIndex = #items + 1
            rawset(items, newIndex, item)
            updateMenu(t, item)
            return item
        end,
        -- @func AddSlider
        -- @param t Menu that include this slider
        -- @param data slider informations
        -- @description Create a new slider and add it to the items array
        AddSlider = function(t, data)
            local item = {
                uuid = uuid(),
                label = data.label,
                type = "slider",
                select = data.select,
                value = data.value,
                onchange = data.onchange,
                hover = data.hover,
                list = data.list
            }
            local items = rawget(t, 'Items')
            local newIndex = #items + 1
            rawset(items, newIndex, item)
            updateMenu(t, item)
            return item
        end,
        -- @func AddSubmenu
        -- @param t Menu that include this submenu
        -- @param data submenu informations
        -- @description Create a new submenu and add it to global metatable
        AddSubmenu = function(t, data)
            local item = {
                type = 'submenu',
                label = data.title,
                parentType = 'menu',
                hover = data.hover,
                uuid = data.uuid
            }
            local items = rawget(t, 'Items')
            local newIndex = #items + 1
            rawset(items, newIndex, item)
            updateMenu(t, item)
            return item
        end,
        -- @func ClearItems
        -- @param t Menu to clear
        -- @description Remove all items from this menu
        ClearItems = function(t)
            for i,p in pairs(MenuTable.menus) do 
                if p.uuid == t.uuid or p.name == t.name then
                    MenuTable.menus[i].Items = {}
                    return
                end
            end
            return true
        end,
    }
    addMenu(newMenu)
    return newMenu
end

--- Create a new sub menu
---@param infos table Menu information
---@return Menu New item
function CreateSubmenu(parent, infos)
    local postion = 0
    if infos.position then 
        position = infos.position 
    end
    local newMenu = {
        name = infos.name,
        title = infos.title,
        subtitle = infos.subtitle,
        footer = infos.footer,
        onclose = infos.onclose,
        hover = infos.hover,
        uuid = uuid(),
        Items = {},
        type = "submenu",
        parentType = parent.type,
        parent = parent.uuid,
        position = infos.position,
        -- @func AddButton
        -- @param t Submenu that include this button
        -- @param data Button informations
        -- @description Create a new button and add it to the items array
        AddButton = function(t, data)
            local item = {
                uuid = uuid(),
                label = data.label,
                type = "action",
                badge = data.badge,
                select = data.select,
                hover = data.hover,
            }
            local items = rawget(t, 'Items')
            local newIndex = #items + 1
            rawset(items, newIndex, item)
            updateSubmenu(t, item)
            return item
        end,
        -- @func AddCheckbox
        -- @param t Submenu that include this checkbox
        -- @param data checkbox informations
        -- @description Create a new checkbox and add it to the items array
        AddCheckbox = function(t, data)
            local item = {
                uuid = uuid(),
                label = data.label,
                type = "checkbox",
                checked = data.checked,
                hover = data.hover,
                select = data.select
            }
            local items = rawget(t, 'Items')
            local newIndex = #items + 1
            rawset(items, newIndex, item)
            updateSubmenu(t, item)
            return item
        end,
        -- @func AddSlider
        -- @param t Submenu that include this slider
        -- @param data slider informations
        -- @description Create a new slider and add it to the items array
        AddSlider = function(t, data)
            local item = {
                uuid = uuid(),
                label = data.label,
                type = "slider",
                select = data.select,
                value = data.value,
                onchange = data.onchange,
                hover = data.hover,
                list = data.list
            }
            local items = rawget(t, 'Items')
            local newIndex = #items + 1
            rawset(items, newIndex, item)
            updateSubmenu(t, item)
            return item
        end,
        -- @func AddSubmenu
        -- @param t Submenu that include this submenu
        -- @param data submenu informations
        -- @description Create a new submenu and add it to global metatable
        AddSubmenu = function(t, data)
            local item = {
                type = 'submenu',
                label = data.title,
                uuid = data.uuid,
                parentType = rawget(t, 'type'),
                hover = data.hover,
                parent = rawget(t, 'uuid')
            }
            local items = rawget(t, 'Items')
            local newIndex = #items + 1
            rawset(items, newIndex, item)
            updateSubmenu(t, item)
            return item
        end,
        -- @func ClearItems
        -- @param t Submenu to clear
        -- @description Remove all items from this submenu
        ClearItems = function(t)
            for i,p in pairs(MenuTable.submenus) do 
                if p.uuid == t.uuid or p.name == t.name then
                    MenuTable.submenus[i].Items = {}
                    return
                end
            end
            return true
        end,
    }
    addSubmenu(newMenu)
    return newMenu
end


-- ************************************************************************************




-- @event sound
-- @param data Menu send from NUI
-- @description Play a sound when menu navigation and trigger hover() function of item if exists
RegisterNetEvent('tortoise_menu:navigate')
AddEventHandler('tortoise_menu:navigate', function(data)
    PlaySoundFrontend(-1, data.type, "HUD_FRONTEND_DEFAULT_SOUNDSET", true)
    if data.type == "NAV_UP_DOWN" then 
        if data.menuType == "menu" then 
            for i,v in pairs(MenuTable.menus) do 
                if v.uuid == data.uuid then
                    MenuTable.menus[i].position = data.position
                    if v.Items[data.position+1].hover then 
                        local fn = v.Items[data.position+1].hover
                        fn()
                    end
                end
            end
        else 
            for i,v in pairs(MenuTable.submenus) do 
                if v.uuid == data.uuid then
                    MenuTable.submenus[i].position = data.position
                    if v.Items[data.position+1].hover then 
                        local fn = v.Items[data.position+1].hover
                        fn()
                    end
                end
            end
        end
    end
end)


-- @event sliderchange
-- @param menu Menu or submenu or the slider
-- @description Change the value of the slider and call onchange() function if exists
RegisterNetEvent('tortoise_menu:sliderchange')
AddEventHandler('tortoise_menu:sliderchange', function(menu)
    if data.menuType == "menu" then 
        for i,v in pairs(MenuTable.menus) do 
            if v.uuid == data.uuid then
                v.Items[data.position+1].value = data.valuePosition
                if v.Items[data.position+1].onchange then 
                    local fn = v.Items[data.position+1].onchange
                    fn(data.value)
                end
            end
        end
    else 
        for i,v in pairs(MenuTable.submenus) do 
            if v.uuid == data.uuid then
                v.Items[data.position+1].value = data.valuePosition
                if v.Items[data.position+1].onchange then 
                    local fn = v.Items[data.position+1].onchange
                    fn(data.value)
                end
            end
        end
    end
end)


-- EXPORTS
exports('CreateMenu', CreateMenu)
exports('CreateSubmenu', CreateSubmenu)
exports('openMenu', openMenu)
exports('openSubMenu', openSubMenu)
exports('closeMenu', closeMenu)
exports('isMenuOpen', isMenuOpen)
