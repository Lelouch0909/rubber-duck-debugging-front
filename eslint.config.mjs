import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import prettierPlugin from "eslint-plugin-prettier";
import prettier from "eslint-config-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Configurations Next.js/TypeScript
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  
  // Configuration Prettier
  prettier,
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      // Intégration Prettier
      "prettier/prettier": "warn",
      
      // Règles générales
      "no-unused-vars": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      
      // Règles de style de code
      "prefer-const": "warn",
      "arrow-body-style": ["warn", "as-needed"],
      "object-shorthand": "warn",
      
      // Formatage spécifique
      "quotes": ["warn", "single", { avoidEscape: true }],
      "semi": ["warn", "always"],
      "comma-dangle": ["warn", "always-multiline"],
    },
  },
  
  // Configuration spécifique aux fichiers
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },
];

export default eslintConfig;
