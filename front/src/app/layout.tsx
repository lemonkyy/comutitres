import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";

import "./globals.css";
import { ApiClientProvider } from "@/contexts/api-client";

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
