import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";

import "./globals.css";
import { ApiClientProvider } from "@/contexts/api-client";
import Navbar from "@/components/partials/navbar";

type ProvidersProps = {
  children: ReactNode;
};

type Props = {
  children: ReactNode;
};

const Providers = ({ children }: ProvidersProps) => {
  return (
    <>
      <NextIntlClientProvider>
        <ApiClientProvider>
          <Navbar />
					{children}
				</ApiClientProvider>
      </NextIntlClientProvider>
    </>
  );
};

const RootLayout = async ({ children }: Props) => {
	return (
		<html>
			<body className="min-h-full flex flex-col">
				<Providers>
					{children}
				</Providers>
			</body>
		</html>
	);
}

export default RootLayout;
