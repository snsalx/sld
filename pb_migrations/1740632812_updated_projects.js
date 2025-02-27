/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_484305853");

    // update field
    collection.fields.addAt(
      2,
      new Field({
        cascadeDelete: false,
        collectionId: "pbc_2412994015",
        hidden: false,
        id: "relation3099598993",
        maxSelect: 999,
        minSelect: 0,
        name: "slides",
        presentable: false,
        required: false,
        system: false,
        type: "relation",
      }),
    );

    return app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_484305853");

    // update field
    collection.fields.addAt(
      2,
      new Field({
        cascadeDelete: false,
        collectionId: "pbc_2412994015",
        hidden: false,
        id: "relation3099598993",
        maxSelect: 999,
        minSelect: 0,
        name: "slides",
        presentable: false,
        required: true,
        system: false,
        type: "relation",
      }),
    );

    return app.save(collection);
  },
);
