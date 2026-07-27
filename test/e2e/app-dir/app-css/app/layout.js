import '../styles/global.css'
import './style.css'

export default function Root({ children }) {
  return (
    <html className="this-is-the-document-html">
      <head></head>
      <body className="this-is-the-document-body">{children}</body>
    </html>
  )
}
