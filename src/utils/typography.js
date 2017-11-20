import Typography from 'typography'
import CodePlugin from 'typography-plugin-code'
import grandView from 'typography-theme-grand-view'

grandView.plugins = [
  new CodePlugin();
]

const typography = new Typography(grandView)

// Hot reload typography in development.
if (process.env.NODE_ENV !== 'production') {
  typography.injectStyles()
}

export default typography
