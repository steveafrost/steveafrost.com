import Typography from 'typography';
import CodePlugin from 'typography-plugin-code';

const typography = new Typography({
  title: 'Steve Frost - Portfolio',
  baseFontSize: '18px',
  baseLineHeight: 1.45,
  headerFontFamily: ['Raleway', 'san-serif'],
  bodyFontFamily: ['Merriweather', 'serif'],
  googleFonts: [
    { name: 'Raleway', styles: ['400', '700', '900'] },
    { name: 'Merriweather', styles: ['400', '400i', '700'] },
  ],
  overrideStyles: () => ({
    body: {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
    },
    a: {
      color: '#3c6e71',
    },
  }),
});

typography.plugins = [new CodePlugin()];

// Hot reload typography in development.
if (process.env.NODE_ENV !== 'production') {
  typography.injectStyles();
}

export default typography;
