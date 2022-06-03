'use strict';

const { v4: uuidv4 } = require('uuid');
const Action = require('./action');
const Db = require('../common/db');
const db = new Db();
const logger = require('../common/utils/logger');

module.exports = class ActionRepository {
    createAction(type, cron, channel_id, mention_role) {
        let uuid = uuidv4();
        const action = new Action(uuid, type, cron, channel_id, mention_role);
        db.insert('actions', action);
    }

    getActions() {
        return db.getAll('actions');
    }

    getActionById(id) {
        const action = db.getBy('actions', { id });
        return action;
    }

};
