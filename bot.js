const Client = require('./structures/Client');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const client = new Client();
client.login();


client.on("interactionCreate", (interaction) => {
	console.log(interaction)
	if (interaction.isButton()) {
        // Make this work only for certain buttons,
        // with IDs like switch_0, switch_1, etc.
        if (interaction.customId.startsWith("switch_")) {

            // Change the style of the button component,
            // that triggered this interaction
            interaction.component.setStyle("DANGER");

            // Respond to the interaction,
            // and send updated components to the Discord API
            interaction.update({
                components: interaction.message.components
            });

        }
    }
});

process.on('uncaughtException', err => console.error(err.stack));
process.on('unhandledRejection', err => console.error(err.stack));
process.on('SIGINT', function() {

	// Stop every scheduled tasks
	if (global.cronTasks) {
		for (const [key, value] of global.cronTasks) {
			value.stop();
			global.cronTasks.delete(key);
		}
	}

	// Stop dump scheduled task
	if (global.cronDump) {
		global.cronDump.stop();
	}

	process.exit();
});