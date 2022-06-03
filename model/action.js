'use strict';

module.exports = class Action {
  constructor (id, type, cron, channel_id, mention_role) {
    this.id = id;
    this.type = type
    this.cron = cron;
    this.channel_id = channel_id;
    this.mention_role = mention_role;
  };
};
