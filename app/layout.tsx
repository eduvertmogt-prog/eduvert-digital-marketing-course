import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import { DemoDialogProvider } from "@/components/demo-dialog"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  title: "EduVert",
  description:
    "Hands-on courses, real projects, and expert guidance. Learn in Seawoods, Navi Mumbai, or live online.",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className="font-eduvert">
        <DemoDialogProvider>{children}</DemoDialogProvider>
      </body>
    </html>
  )
}
