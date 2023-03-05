import './global.css';
import '@fortawesome/fontawesome-svg-core/styles.css'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <main className='page bg-dark' style={{overflow: 'auto'}}>
          <nav style={{marginBottom: '0 !important'}}>
          </nav>
          {children}
        </main>
      </body>
    </html>
  )
}
