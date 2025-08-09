import { WhopApp } from "@whop/react/components";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";
import Script from "next/script";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Content Jackpot - Competitive Content Rewards",
	description: "Add a competition layer to your Content Rewards campaigns with jackpot prizes",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-app text-app`}
                suppressHydrationWarning
            >
                {/* Theme: respect user preference, system (iOS-like), and persist */}
                <Script id="theme-init" strategy="beforeInteractive">
                    {`
                    (function(){
                      try {
                        var saved = localStorage.getItem('theme');
                        var preferred;
                        if (saved === 'light' || saved === 'dark') {
                          preferred = saved;
                        } else {
                          preferred = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                          localStorage.setItem('theme','auto');
                        }
                        document.documentElement.dataset.theme = preferred;
                        // live update when system preference changes if user selected auto
                        if (saved === null || saved === 'auto') {
                          var mq = window.matchMedia('(prefers-color-scheme: dark)');
                          mq.addEventListener('change', function(e){
                            document.documentElement.dataset.theme = e.matches ? 'dark' : 'light';
                          });
                        }
                      } catch(e){}
                    })();
                    `}
                </Script>
				<WhopApp>
					<Navigation />
					<main className="min-h-[calc(100vh-4rem)]">
						{children}
					</main>
				</WhopApp>
			</body>
		</html>
	);
}
