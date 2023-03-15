fx_version 'cerulean'
games {'gta5'}

author 'SwiiLy - https://github.com/SwiiLy'
description 'Tortoise OS - NUI Core Resource'
version '1.0'

ui_page 'dist/index.html'

client_scripts {
    'lua/client.lua',
    'lua/menu.lua',
    'lua/bank.lua',
} 

server_scripts {
	"@mysql-async/lib/MySQL.lua",
    'lua/server.lua'
} 

files {
    'dist/index.html',
    'dist/**/*.png',
    'dist/*.bmp',
    'dist/icons/*.png',
    'dist/icons/assets/*.png',
    'dist/assets/*.css',
    'dist/assets/*.js',
    'dist/*.TTF',
    'dist/assets/*.TTF',
    'dist/assets/*.otf'
}