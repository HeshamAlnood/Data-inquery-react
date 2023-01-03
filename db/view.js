var EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "items", // Will use table name `category` as default behaviour.
  tableName: "items", // Optional: Provide `tableName` property to override the default behaviour for table name.
  columns: {
    item_part_no: {
      primary: true,
      type: "varchar",
    },
    item_description: {
      type: "varchar",
    },
  },
});
