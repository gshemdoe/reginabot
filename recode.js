
//Recode chat-join request
bot.on('chat_join_request', async ctx => {
    try {

        let username = ctx.chatJoinRequest.from.first_name
        let ccid = ctx.chatJoinRequest.from.id // old
        let chatid = ctx.chatJoinRequest.user_chat_id //new update
        let cha_id = ctx.chatJoinRequest.chat.id

        let nyumbu = await nyumbuModel.findOne({ chatid })
        if (!nyumbu) {
            await nyumbuModel.create({ chatid, username, blocked: false, refferer: "Regina" })
        }

        await tempChat.create({ chatid, cha_id })

        await bot.telegram.copyMessage(chatid, imp.pzone, 7617, {
            reply_markup: {
                inline_keyboard: [[{ text: '✅ Kubali / Accept', callback_data: `ingia__${chatid}__${cha_id}` }]]
            }
        }).catch(async (error) => {
            if (error.message.includes(`can't initiate conversation`)) {
                await ctx.approveChatJoinRequest(chatid).catch(e => console.log(e.message))
                await tempChat.findOneAndDelete({ chatid })
                await bot.telegram.sendMessage(imp.shemdoe, `I failed to start convo with ${username} so I approve him regardless`)
                    .catch(ee => console.log(ee.message))
            }
        })
    } catch (err) {
        console.log(err)
        if (!err.message) {
            if (!err.description.includes('bot was blocked') && !err.description.includes('USER_ALREADY')) {
                await bot.telegram.sendMessage(imp.shemdoe, `(${ctx.chatJoinRequest.from.first_name}), "${err.description}"`)
            }
        } else {
            if (!err.message.includes('bot was blocked') && !err.message.includes('USER_ALREADY')) {
                await bot.telegram.sendMessage(imp.shemdoe, `(${ctx.chatJoinRequest.from.first_name}), "${err.message}"`)
            }
        }
    }
})