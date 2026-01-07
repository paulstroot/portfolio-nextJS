import { FlatCompat } from "@eslint/eslintrc"
import js from "@eslint/js"
import { dirname } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  js.configs.recommended,
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript", "prettier"],
    rules: {
      "multiline-ternary": "off",
      "operator-linebreak": "off",
      "jsx-no-bind": "off",
      "space-before-function-paren": 0,
      "@next/next/no-img-element": "off",
      "no-useless-escape": "off",
      "no-console": ["error", { allow: ["warn", "error"] }],
      indent: ["warn", 2, { ignoredNodes: ["ConditionalExpression *", "SwitchCase"] }],
    },
  }),
]

export default eslintConfig
