/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_484305853");

    // update collection data
    unmarshal(
      {
        createRule: '@request.auth.id != ""',
        listRule: '@request.auth.id != "" && public = true',
        updateRule:
          '(@request.auth.id != "" && public = true) || @request.auth.id = author.id',
        viewRule: "public = true || @request.auth.id = author.id",
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
        createRule: "",
        listRule: "",
        updateRule: "",
        viewRule: "",
      },
      collection,
    );

    return app.save(collection);
  },
);
