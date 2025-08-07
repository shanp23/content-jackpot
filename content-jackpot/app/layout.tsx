import { WhopApp } from "@whop/react/components";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";

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
				className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[#0a0a0a]`}
			>
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
