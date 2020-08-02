import { Config } from "@stencil/core";

// https://stenciljs.com/docs/config

export const config: Config = {
  globalScript: "src/global/app.ts",
  globalStyle: "src/global/app.css",
  taskQueue: "async",
  namespace: "kryptand",
  outputTargets: [
    {
      type: "dist",
    },
    {
      type: "www",
      serviceWorker: {
        globPatterns: ["**/*.{js,css,json,html,ico,png}"],
      },
    },
    {
      type: "www",
      copy: [
        {
          src: "src/assets/i18n/*.json",
          dest: "i18n",
          warn: true,
        },
      ],
    },
  ],
};
