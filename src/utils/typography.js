import Typography from 'typography';
import CodePlugin from 'typography-plugin-code';
import twinPeaks from 'typography-theme-twin-peaks';

twinPeaks.plugins = [new CodePlugin()];

const typography = new Typography(twinPeaks);

// Hot reload typography in development.
if (process.env.NODE_ENV !== 'production') {
  typography.injectStyles();
}

export default typography;
