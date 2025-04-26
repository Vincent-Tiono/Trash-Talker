// app/auth/callback/page.tsx
"use client";
import { useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../components/supabase";
import { UserContext, User, Disposal } from "../../../hooks/UserContext";
import { ClimbingBoxLoader } from "react-spinners";
import { useTheme } from "next-themes";

export default function Callback() {
  const router = useRouter();
  const { setUser } = useContext(UserContext);
  const { theme } = useTheme();

  useEffect(() => {
    const initUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return router.push("/login");

      console.log("Session:", session);

      const user = session.user;
      const region = await getCityFromBrowser();

      const { data: existingUser } = await supabase
        .from("user")
        .select("*")
        .eq("email", user.email)
        .single();

      const { data: topUsersRegion } = await supabase
        .from("user")
        .select("*")
        .ilike("region", region)
        .order("level", { ascending: false })
        .order("exp", { ascending: false })
        .limit(10);

      const { data: topUsersGlobal } = await supabase
        .from("user")
        .select("*")
        .order("level", { ascending: false })
        .order("exp", { ascending: false })
        .limit(10);

      const { data: disposals } = await supabase
        .from("disposal")
        .select("*")
        .eq("user_id", user.id);

      const userData = {
        id: user.id,
        name: user.user_metadata.name,
        email: user.email,
        image: user.user_metadata.avatar_url,
        region,
        exp: existingUser?.exp || 0,
        level: existingUser?.level || 1,
        total_disposal: existingUser?.total_disposal || 0,
        topUsersRegion: topUsersRegion || [],
        topUsersGlobal: topUsersGlobal || [],
        disposals: (disposals as Disposal[]) || [],
      };

      setUser(userData as User);

      if (!existingUser) {
        await supabase.from("user").insert(userData);
      }

      router.push("/dashboard");
    };

    initUser();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <ClimbingBoxLoader
        size={22}
        speedMultiplier={1.5}
        color={theme === "dark" ? "#ffffff" : "#000000"}
      />
    </div>
  );
}

export async function getCityFromBrowser(): Promise<string> {
  try {
    const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject)
    );
    const { latitude, longitude } = pos.coords;
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    );
    const json = await res.json();
    return json.address.city || json.address.town || "Unknown";
  } catch {
    return "Unknown";
  }
}
