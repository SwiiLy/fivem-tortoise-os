fx_version 'cerulean'
games {'gta5'}

author 'SwiiLy - https://github.com/SwiiLy'
description 'Menu Resource working with "Tortoise OS" - NUI Core Resource'
version '1.0'

client_scripts {
    'client.lua'
}

client_export 'CreateMenu'
client_export 'CreateSubmenu'
client_export 'openMenu'
client_export 'closeMenu'
client_export 'isMenuOpen'


server_scripts {
	"@mysql-async/lib/MySQL.lua",
    'server.lua'
}
