import AppProviders from "@/lib/context/app-providers";
import HomeRedirect from "@/components/home-redirect";

export default function Home() {
  return (
    <AppProviders>
      <HomeRedirect />
    </AppProviders>
  );
}
