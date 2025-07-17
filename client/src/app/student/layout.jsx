// src/app/layout.js
import "../globals.css";

export const metadata = {
  title: "Student Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#dbeafe]">{children}</body>
    </html>
  );
}
