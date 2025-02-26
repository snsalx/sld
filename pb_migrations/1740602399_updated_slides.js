/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_2412994015");

    // update collection data
    unmarshal(
      {
        updateRule:
          "projects_via_slides.author ?= @request.auth.id || projects_via_slides.public = true",
        viewRule:
          "projects_via_slides.public = true || projects_via_slides.author.id = @request.auth.id",
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
        updateRule:
          "@collection.projects.author ?= @request.auth.id || @collection.projects.public = true",
        viewRule: "projects_via_slides.public = true",
      },
      collection,
    );

    return app.save(collection);
  },
);
