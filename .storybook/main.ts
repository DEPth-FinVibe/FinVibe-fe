import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: [
    "../src/components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../src/components/**/*.mdx",
  ],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-links",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  async viteFinal(config) {
    return {
      ...config,
      css: {
        ...(config.css ?? {}),
        postcss: "./postcss.config.js",
      },
    };
  },
};

export default config;
