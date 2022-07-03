'use strict';

module.exports = class Action {
  constructor (id, type, cron, server_id, channel_id, mention_role) {
    this.id = id;
    this.type = type
    this.cron = cron;
    this.server_id = server_id;
    this.channel_id = channel_id;
    this.mention_role = mention_role;
  };
};
