/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_484305853");

    // update collection data
    unmarshal(
      {
        listRule:
          '@request.auth.id != "" && (public = true || @request.auth.id = author.id)',
      },
      collection,
    );

    return app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_484305853");

    // update collection data
    unmarshal(
      {
        listRule: '@request.auth.id != "" && public = true',
      },
      collection,
    );

    return app.save(collection);
  },
);
