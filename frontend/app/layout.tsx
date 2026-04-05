import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Taskr — Task Management",
  description: "Clean, focused task management for individuals.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#1e1a16",
                color: "#f0ebe4",
                border: "1px solid #2e2820",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                borderRadius: "10px",
                padding: "12px 16px",
              },
              success: {
                iconTheme: {
                  primary: "#d4a843",
                  secondary: "#0e0c0a",
                },
              },
              error: {
                iconTheme: {
                  primary: "#c96b6b",
                  secondary: "#0e0c0a",
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
