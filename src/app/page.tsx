import type { AppProps } from 'next/app';
import Home from '../pages/Home';

function MyApp({ Component = Home, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
