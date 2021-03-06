const fs = require('fs')
const _colors = require('../colors.json')
const config = require('../config.json')
const initialData = require('../initialData.json')
const requiredChannels = config.requiredChannels
// Change string values to int from colors.json
const colors = {}
Object.keys(_colors).forEach(function (key) {
  let value = _colors[key]
  colors[key] = parseInt(value)
})

exports.run = (bot, message, [error]) => {
  if (!message.member.hasPermissions['ADMINISTRATOR']) {
    return message.reply(`You don't have the permissions to manage my configuration on this server. You need to be an **administrator**`)
  }
  const guild = message.guild

  fs.writeFile(`./data/${guild.id}.json`, JSON.stringify(initialData), err => {
    console.log(err)
  })

  let didInit = true
  for (let i in requiredChannels) {
    if (!guild.channels.exists('name', requiredChannels[i])) {
      try {
        guild.createChannel(requiredChannels[i], 'text')
        didInit = true
      }
      catch (e) {
        console.log(e)
        didInit = false
      }
    }
  }
  if (didInit) {
    if (error) {
      return message.reply(`The server has been reinitialized due to: ${error}. Please run the command again. I'm sorry for the inconvinience`)
    }
    else {
      return message.reply(`The server has been reinitialized. Use the \`settings\` command to view settings`)
    }
  }
  else {
    return message.reply('Initialization failed. Please check if I have administrative permissions.')
  }
}
