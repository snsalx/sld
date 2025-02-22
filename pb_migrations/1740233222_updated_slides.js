/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_2412994015");

    // update field
    collection.fields.addAt(
      1,
      new Field({
        autogeneratePattern: "",
        hidden: false,
        id: "text1579384326",
        max: 128,
        min: 0,
        name: "name",
        pattern: "",
        presentable: false,
        primaryKey: false,
        required: true,
        system: false,
        type: "text",
      }),
    );

    return app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_2412994015");

    // update field
    collection.fields.addAt(
      1,
      new Field({
        autogeneratePattern: "",
        hidden: false,
        id: "text1579384326",
        max: 16,
        min: 0,
        name: "name",
        pattern: "",
        presentable: false,
        primaryKey: false,
        required: true,
        system: false,
        type: "text",
      }),
    );

    return app.save(collection);
  },
);
