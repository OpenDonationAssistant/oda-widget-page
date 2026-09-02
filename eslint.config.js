// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["src/videoplayer.js"]),
  ...storybook.configs["flat/recommended"]
]);
