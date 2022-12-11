import 'tailwindcss/tailwind.css';
import type { AppProps } from 'next/app';
import { RecoilRoot } from 'recoil';
import '@etchteam/next-pagination/dist/index.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <Component {...pageProps} />
    </RecoilRoot>
  );
}

export default MyApp;
