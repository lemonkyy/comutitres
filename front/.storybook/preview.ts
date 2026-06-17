import type { Preview } from "@storybook/nextjs-vite";
import { NextIntlClientProvider } from "next-intl";
import { createElement } from "react";

import frMessages from "../messages/fr.json";
import "../src/app/globals.css";

const preview: Preview = {
  decorators: [
    (Story) =>
      createElement(
        NextIntlClientProvider,
        {
          locale: "fr",
          messages: frMessages,
        },
        createElement(Story),
      ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: true,
    },
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ["autodocs"],
};

export default preview;
