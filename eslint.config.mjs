// eslint.config.mjs
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
    rules: {
      // Prohibir 'any' explícito
      "@typescript-eslint/no-explicit-any": "error",
      
      // Permitir variables no usadas que empiecen con _
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "caughtErrorsIgnorePattern": "^_"
        }
      ],
      
      // Buenas prácticas de JavaScript/TypeScript
      "prefer-const": "error",
      "no-var": "error",
      "no-console": ["warn", { "allow": ["warn", "error"] }],
      
      // React específico
      "react-hooks/exhaustive-deps": "warn",
      "react/prop-types": "off", // Usamos TypeScript
      "react/no-unescaped-entities": "off",
      
      // Next.js específico
      "@next/next/no-html-link-for-pages": "off",
      
      // Permitir archivos con nombres específicos
      "import/no-anonymous-default-export": "off",
      
      // TypeScript específico
      "@typescript-eslint/no-unused-expressions": [
        "error",
        {
          "allowShortCircuit": true,
          "allowTernary": true
        }
      ],
      
      // Permitir tipos vacíos en interfaces (útil para props)
      "@typescript-eslint/no-empty-interface": "off",
      
      // Ser más flexible con funciones que no retornan
      "@typescript-eslint/no-empty-function": "warn"
    },
    
    // Ignorar archivos específicos
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "dist/**",
      "build/**",
      "*.config.js",
      "*.config.mjs"
    ]
  },
  
  // Configuración específica para archivos de configuración
  {
    files: ["*.config.js", "*.config.mjs", "*.config.ts"],
    rules: {
      "@typescript-eslint/no-var-requires": "off",
      "no-console": "off"
    }
  },
  
  // Configuración específica para archivos de test
  {
    files: ["**/*.test.{js,jsx,ts,tsx}", "**/*.spec.{js,jsx,ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn", // Más permisivo en tests
      "no-console": "off"
    }
  }
];

export default eslintConfig;