import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      // Purely cosmetic (apostrophes/quotes in JSX text render fine); 41
      // existing hits. Real bugs like rules-of-hooks stay errors.
      "react/no-unescaped-entities": "off",
    },
  },
];

export default eslintConfig;
