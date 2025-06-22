// components/FcmTokenHandler.tsx
"use client";

import { AuthService } from "@/service/auth-service";
import { useEffect, useState } from "react";
import { getFcmToken } from "../utils/firebase-client-config";

export default function FcmTokenHandler() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const fcmToken = await getFcmToken();
        if (fcmToken) {
          setToken(fcmToken);

          // Send token to Express backend
          //   const response = await fetch("http://localhost:3001/store-token", {
          //     method: "POST",
          //     headers: { "Content-Type": "application/json" },
          //     body: JSON.stringify({ token: fcmToken }),
          //   });

          //   if (!response.ok) {
          //     throw new Error("Failed to store token in backend");
          //   }
          const username = localStorage.getItem("user_web");
          const jwt_token = localStorage.getItem("jwt_token_web");
          await AuthService.storeToken({
            token: fcmToken,
            username: username || "",
            jwt_token: jwt_token || null,
          });
          console.log("Token stored successfully", token);
        }
      } catch (err) {
        console.error("Error:", err);
      }
    };

    fetchToken();
  }, [token]);

  return <></>;
}
