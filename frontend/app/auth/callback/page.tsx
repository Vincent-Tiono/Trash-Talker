// app/auth/callback/page.tsx
"use client";
import { useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../components/supabase";
import { UserContext, User, Disposal } from "../../../hooks/UserContext";

export default function Callback() {
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const initUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return router.push("/login");

      console.log("Session:", session);

      const user = session.user;
      const region = await getCityFromBrowser();

      // get existing user with email from user table
      const { data: existingUser } = await supabase
        .from("user")
        .select("*")
        .eq("email", user.email)
        .single();

      // get top 10 max or less users from user table that region is same as user region
      // sort by level first then by exp
      const { data: topUsersRegion } = await supabase
        .from("user")
        .select("*")
        .ilike("region", region)
        .order("level", { ascending: false })
        .order("exp", { ascending: false })
        .limit(10);

      // get top 10 max or less users from user table global
      // sort by level first then by exp
      const { data: topUsersGlobal } = await supabase
        .from("user")
        .select("*")
        .order("level", { ascending: false })
        .order("exp", { ascending: false })
        .limit(10);

      // get all from disposal table where user_id is same as user.id
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
        total_disposal: 0,
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

  return <p>Authenticating...</p>;
}

async function getCityFromBrowser(): Promise<string> {
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
