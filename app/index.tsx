import "react-native-url-polyfill/auto";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import Auth from "../components/Auth";
import { Session } from "@supabase/supabase-js";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Redirect } from "expo-router";

const Stack = createNativeStackNavigator();

export default function App() {
  // const [session, setSession] = useState<Session | null>(null);

  // useEffect(() => {
  //   supabase.auth.getSession().then(({ data: { session } }) => {
  //     setSession(session);
  //   });

  //   supabase.auth.onAuthStateChange((_event, session) => {
  //     setSession(session);
  //   });
  // }, []);

  // if (!session) {
  //   return <Auth />;
  // }

  return <Redirect href="/home" />;
}
