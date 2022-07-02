'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const fs = require('fs');
const kyouiku = require('../../kanji/every_kyouiku.json');
const Kanji = require('../model/kanji');
const logger = require('../../common/utils/logger');
const Action = require('../model/action');
const path = require('path')

module.exports = class Db {
    constructor() {

        logger.info("Creating new db connexion")

        /* Creating an empty array. */
        const kyouiki_list = []

        // Reset database if set in config file
        if (false) {

            /* Iterating through the kanjis array and pushing the values into the kyouiku_list array. */
            kyouiku.kanjis.forEach(element => {
                kyouiki_list.push(new Kanji(element.id, element.kanji, element.available))
            })

            logger.warn('Resetting db');
            fs.unlinkSync(path.resolve(__dirname, '../db.json'));
        }

        // Chargement du fichier
        this.adapter = new FileSync(path.resolve(__dirname, '../../db.json'));
        this.db = low(this.adapter);

        // Initialisation de la base de donnée si fichier vide
        this.db.defaults({
            kanjis: kyouiki_list,
            actions: []
        }).write();
    }

    // fonction d'insertion dans la bdd
    insert(table, object) {
        logger.debug(`Inserting value in '${table}'`);
        this.db.get(table).push(object).write();
    }

    // fonction de récupération d'une valeur de la bdd
    getBy(table, conditionObject) {
        logger.debug(`Getting one value from '${table}'`);
        return this.db.get(table).find(conditionObject).value();
    }

    // fonction de récupération de valeurs de la bdd
    getAllBy(table, conditionObject) {
        logger.debug(`Get some values from '${table}'`);
        return this.db.get(table).filter(conditionObject).value();
    }

    // Fonction de mise à jour d'une valeur de la bdd
    update(table, conditionObject, values) {
        this.db.get(table)
            .find(conditionObject)
            .assign(values)
            .write();
    }

    // fonction de suppression d'une valeur de la bdd
    remove(table, id) {
        logger.debug(`Removing value from '${table}'`);
        this.db.get(table).remove({
            id
        }).write();
    }

    // fonction de récupération de toutes les valeur de la bdd
    getAll(table) {
        logger.debug(`Getting every values from '${table}'`);
        return this.db.get(table).value();
    }
};
