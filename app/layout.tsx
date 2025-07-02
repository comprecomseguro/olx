import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import { UserProvider } from "./contexts/user.context";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const nunitoSans = Nunito_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});


// 👇 Tipagem forçada manualmente
export default function RootLayout(props: any) {
  const { children } = props;

  return (
    <html lang="en">
      <body className={`${nunitoSans.variable} antialiased bg-white`}>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
