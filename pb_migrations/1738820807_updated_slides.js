/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_2412994015");

    // update collection data
    unmarshal(
      {
        createRule: "",
        updateRule: "",
        viewRule: "",
      },
      collection,
    );

    return app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_2412994015");

    // update collection data
    unmarshal(
      {
        createRule: null,
        updateRule: null,
        viewRule: null,
      },
      collection,
    );

    return app.save(collection);
  },
);
