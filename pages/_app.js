import 'bulma/css/bulma.min.css';
import '@fortawesome/fontawesome-free/css/all.css';
import '@creativebulma/bulma-tagsinput/dist/css/bulma-tagsinput.min.css';
import '../styles/globals.scss';

function SafeHydrate({ children }) {
  return (
    <div suppressHydrationWarning>
      {typeof window === 'undefined' ? null : children}
    </div>
  );
}

function MyApp({ Component, pageProps }) {
  return <SafeHydrate><Component {...pageProps} /></SafeHydrate>;
}

export default MyApp;
