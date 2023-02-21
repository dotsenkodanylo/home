import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <>
      <main className='page'>
        {/* Add header here for upper nav bar -> will need to adjust height correctly */}
        <Component {...pageProps} />
      </main>
    </>
  );
}
