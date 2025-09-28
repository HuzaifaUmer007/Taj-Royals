import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ShopContextProvider from "../context/ShopContext";
import { AuthProvider } from "../context/AuthContext";
import ConditionalLayout from "../components/ConditionalLayout";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Taj Royals - Premium Fashion",
  description: "Premium fashion and lifestyle products",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <AuthProvider>
          <ShopContextProvider>
            <ConditionalLayout>
              {children}
              <ToastContainer position="top-right" autoClose={2500} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="light" />
            </ConditionalLayout>
          </ShopContextProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
