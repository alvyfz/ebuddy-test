import ShinyText from "@/components/Typography/ShinyText";
import { LangType, translate } from "@/lang/lang";
import { getCookies } from "next-client-cookies/server";
import Link from "next/link";
import Button from "@mui/material/Button";

export default async function Home() {
  const cookies = await getCookies();
  const lang = (cookies.get("lang") as LangType) || "en";
  const { t } = translate(lang);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20  ">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <ShinyText
          speed={2}
          className="text-6xl font-bold font-heading text-center"
          text="Welcome to EBUDDY TEST by Alvy"
        />
        <Link href="/dashboard">
          <Button variant="contained">Go Dashboard</Button>
        </Link>
      </main>
    </div>
  );
}
