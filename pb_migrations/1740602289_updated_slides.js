/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_2412994015");

    // update collection data
    unmarshal(
      {
        viewRule:
          "@collection.projects.slides.projects_via_slides.public = true",
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
        viewRule: "(@collection.projects.public = true)",
      },
      collection,
    );

    return app.save(collection);
  },
);
