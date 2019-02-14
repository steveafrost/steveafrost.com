import Typography from 'typography';
import CodePlugin from 'typography-plugin-code';

import fairyGates from 'typography-theme-fairy-gates';

fairyGates.overrideThemeStyles = () => ({
  body: { color: 'rgba(0, 0, 0, 0.7)' },
});

fairyGates.plugins = [
  new CodePlugin(),
];

const typography = new Typography(fairyGates);

// Hot reload typography in development.
if (process.env.NODE_ENV !== 'production') {
  typography.injectStyles();
}

const { rhythm, scale } = typography;

export { rhythm, scale, typography as default };
