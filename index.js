import dotenv from 'dotenv'
import { 
    REST,
    Client, 
    ButtonBuilder,
    ButtonStyle,
    ApplicationCommandOptionType,
    SlashCommandBuilder, 
    ModalBuilder, 
    TextInputBuilder, 
    TextInputStyle, 
    GatewayIntentBits, 
    CommandInteractionOptionResolver,
    Routes
} from 'discord.js'
dotenv.config()
const DISCORD_TOKEN = process.env.DISCORD_TOKEN
const CLIENT_ID = process.env.CLIENT_ID
const GUILD_ID = process.env.GUILD_ID
const commands = [
    new SlashCommandBuilder()
        .setName('mark')
        .setDescription('Creates a bookmarklet to quick join to the player')
        .addStringOption(option => option.setName('player_id')
            .setDescription('The player to join')
            .setRequired(true)
        ),
]

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.')
        await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands })
        console.log('Successfully reloaded application (/) commands.')
    } catch (error) {
        console.error(error)
    }
})()

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages,
    ],
})

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

client.on('interactionCreate', async interaction => {
    console.log(interaction)
    if (!interaction.isChatInputCommand()) return
    if (interaction.commandName === 'mark') { 
        let target_ID = interaction.options.getString('player_id');
        await interaction.reply({
            components: [
                {"type": 1, "components": [
                    new ButtonBuilder()
                    .setURL(`https://deep-hunter.netlify.app?playerid=${target_ID}`)
                    .setLabel(`Bookmarklet`)
                    .setStyle(ButtonStyle.Link)
                ]}
            ],
            embeds: [
                {
                    color: 0x97f5c6,
                    title: `Player Marked`,
                    url: `https://www.roblox.com/users/${target_ID}/profile`,
                    description: `> Created a Bookmarklet for **Player ${target_ID}**
                    > The bookmarklet lets you quick join whoever you marked
                    > as long as they have their joins on.`,
                    thumbnail: {
                        url: 'https://cdn.discordapp.com/attachments/342709986415214602/1045254550912778250/Screenshot_196.png',
                    },
                    image: {
                        url: 'https://media.tenor.com/VXrqFIm2ROQAAAAd/bocchi-the-rock-bocchi.gif',
                    },
                    timestamp: new Date().toISOString(),
                    footer: {
                        text: "Its not suspicious I swear.",
                    },
                },
            ],
        })
    }
})

client.login(DISCORD_TOKEN)

