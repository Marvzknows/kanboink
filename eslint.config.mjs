import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    files: [
      "app/**/*.{ts,tsx,js,jsx}", // your Next.js app directory
      "components/**/*.{ts,tsx,js,jsx}", // your components
      "lib/**/*.{ts,tsx,js,jsx}", // optional: your lib code (but not generated)
    ],
    ignores: [
      "node_modules/",
      ".next/",
      "dist/",
      "lib/generated/", // ignore Prisma or auto-generated code
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-this-alias": "off",
      "@typescript-eslint/no-unused-expressions": "off",
    },
  },
];

export default eslintConfig;
