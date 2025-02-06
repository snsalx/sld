/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    const collection = new Collection({
      createRule: null,
      deleteRule: null,
      fields: [
        {
          autogeneratePattern: "[a-z0-9]{15}",
          hidden: false,
          id: "text3208210256",
          max: 15,
          min: 15,
          name: "id",
          pattern: "^[a-z0-9]+$",
          presentable: false,
          primaryKey: true,
          required: true,
          system: true,
          type: "text",
        },
        {
          hidden: false,
          id: "json2505182891",
          maxSize: 0,
          name: "geometry",
          presentable: false,
          required: true,
          system: false,
          type: "json",
        },
        {
          hidden: false,
          id: "json4274335913",
          maxSize: 0,
          name: "content",
          presentable: false,
          required: true,
          system: false,
          type: "json",
        },
        {
          hidden: false,
          id: "file3309110367",
          maxSelect: 1,
          maxSize: 0,
          mimeTypes: [
            "image/jpeg",
            "image/png",
            "image/vnd.mozilla.apng",
            "image/svg+xml",
          ],
          name: "image",
          presentable: false,
          protected: false,
          required: false,
          system: false,
          thumbs: [],
          type: "file",
        },
        {
          hidden: false,
          id: "json917281265",
          maxSize: 0,
          name: "link",
          presentable: false,
          required: false,
          system: false,
          type: "json",
        },
        {
          hidden: false,
          id: "autodate2990389176",
          name: "created",
          onCreate: true,
          onUpdate: false,
          presentable: false,
          system: false,
          type: "autodate",
        },
        {
          hidden: false,
          id: "autodate3332085495",
          name: "updated",
          onCreate: true,
          onUpdate: true,
          presentable: false,
          system: false,
          type: "autodate",
        },
      ],
      id: "pbc_592032537",
      indexes: [],
      listRule: null,
      name: "objects",
      system: false,
      type: "base",
      updateRule: null,
      viewRule: null,
    });

    return app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_592032537");

    return app.delete(collection);
  },
);
