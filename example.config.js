module.exports = {
	embedColor: '#e73b6d',
	admins: [],
	serverId: 'SERVER_ID',
	adminRoleId: 'ADMIN_ROLE_ID',
	supportServer: (code) => `https://discord.gg/${code}`,
	inviteURL: (id, permissions) => `https://discord.com/api/oauth2/authorize?client_id=${id}&permissions=${permissions ? permissions : 2147568640}&scope=bot`,
	reset_db: false,
	font_size: 395
};