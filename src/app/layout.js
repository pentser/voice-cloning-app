import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

export const metadata = {
  title: "Voice Cloning App",
  description: "Clone your voice using AI with ElevenLabs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
} 