import Typography from 'typography';
import fairyGates from 'typography-theme-fairy-gates';

const typography = new Typography(fairyGates);

// Hot reload typography in development.
if (process.env.NODE_ENV !== 'production') {
  typography.injectStyles();
}

const { rhythm, scale } = typography;

export { rhythm, scale, typography as default };
