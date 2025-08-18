"use client";

import { db } from "../configs/db";
import { USER_TABLE } from "../configs/schema";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { UserDetailContext } from "context/UserDetailContext";
import { eq } from "drizzle-orm";
import React, { useEffect } from "react";

function Provider({ children }) {
  const { user } = useUser();
  const [userDetail, setUserDetail] = useState();

  useEffect(() => {
    if (user) {
      CheckIsNewUser();
    }
    // Adding "user" to dependencies so it re-runs when the user changes
  }, [user]);

  const CheckIsNewUser = async () => {
    try {
      const result = await db
        .select()
        .from(USER_TABLE)
        .where(eq(USER_TABLE.email, user?.primaryEmailAddress?.emailAddress));

      console.log("User lookup result:", result);

      if (!result || result.length === 0) {
        const userResp = await db
          .insert(USER_TABLE)
          .values({
            name: user?.fullName,
            email: user?.primaryEmailAddress?.emailAddress,
          })
          .returning({ id: USER_TABLE.id });

        console.log("Inserted new user:", userResp);
        setUserDetail(result.data);
      }

      const resp = await axios.post("/app/api/create-user", { user });
      console.log("API response:", resp.data);
    } catch (error) {
      console.error("Error in CheckIsNewUser:", error);
    }
  };

  return (
    <UserDetailContext.Provider value={{userDetail, setUserDetail}}>
      {children}
    </UserDetailContext.Provider>
  );
}

export default Provider;
