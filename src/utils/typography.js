import Typography from 'typography';
import CodePlugin from 'typography-plugin-code';

const typography = new Typography({
  title: 'Steve Frost - Portfolio',
  baseFontSize: '18px',
  baseLineHeight: 1.75,
  headerFontFamily: ['Raleway', 'san-serif'],
  bodyFontFamily: ['Merriweather', 'serif'],
  googleFonts: [
    { name: 'Raleway', styles: ['400', '700', '900'] },
    { name: 'Merriweather', styles: ['400', '400i', '700'] },
  ],
  overrideStyles: () => ({
    a: {
      color: '#3c6e71',
    },
    'div#___gatsby': {
      width: '100%',
    },
  }),
});

typography.plugins = new CodePlugin();

// Hot reload typography in development.
if (process.env.NODE_ENV !== 'production') {
  typography.injectStyles();
}

const { rhythm, scale } = typography;

export { rhythm, scale, typography as default };
