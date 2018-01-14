import Typography from 'typography'
import grandView from 'typography-theme-grand-view'

const typography = new Typography(grandView)

// Hot reload typography in development.
if (process.env.NODE_ENV !== 'production') {
  typography.injectStyles()
}

export default typography
