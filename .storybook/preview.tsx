import React from "react";
import type { Preview } from "@storybook/react";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "../styles/globals.css";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <main>
        <Story />
      </main>
    )
  ]
};

export default preview;
