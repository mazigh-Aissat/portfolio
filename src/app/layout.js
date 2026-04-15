import './globals.css';
import ReduxProvider from '@/components/ReduxProvider';

export const metadata = {
  title: 'Mazigh Aissat — Portfolio',
  description: 'Portfolio de Mazigh Aissat — Développeur Full Stack',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
