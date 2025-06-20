import "./globals.css";

export const metadata = {
  title: "Voice Cloning App",
  description: "Clone your voice using AI with ElevenLabs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 min-h-screen">
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
} 