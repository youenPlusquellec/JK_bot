'use strict';

const { v4: uuidv4 } = require('uuid');
const Action = require('./action');
const Db = require('../common/db');
const db = new Db();
const logger = require('../common/utils/logger');

module.exports = class ActionRepository {
    createAction(type, cron, server_id, channel_id, mention_role) {
        let uuid = uuidv4();
        const action = new Action(uuid, type, cron, server_id, channel_id, mention_role);
        db.insert('actions', action);
    }

    getActions() {
        return db.getAll('actions');
    }

    getActionById(id) {
        const action = db.getBy('actions', { id });
        return action;
    }

    getActionsByServerId(server_id) {
        const actions = db.getAllBy(
            'actions',
            (action) => action.server_id === server_id
        );
        return actions;
    }

    getActionsByServerIdAndChannelId(server_id, channel_id) {
        const actions = db.getAllBy(
            'actions',
            (action) => action.server_id === server_id && action.channel_id === channel_id
        );
        return actions;
    }

};
