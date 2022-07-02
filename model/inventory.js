const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InventorySchema = new Schema({
    base: {
        type: Array,
    },
    sauce: {
        type: Array,
    },
    cheese: {
        type: Array,
    },
    veggies: {
        type: Array,
    },
    meats: {
        type: Array,
    }
});

const Inventory = mongoose.model( 'inventory', InventorySchema, 'inventory' );

module.exports = Inventory
