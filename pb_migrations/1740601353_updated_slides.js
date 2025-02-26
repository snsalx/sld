/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_2412994015");

    // update collection data
    unmarshal(
      {
        viewRule:
          "@collection.projects.author ?= @request.auth.id || @collection.projects.public = true",
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
        viewRule: "@collection.projects.author ?= @request.auth.id",
      },
      collection,
    );

    return app.save(collection);
  },
);
