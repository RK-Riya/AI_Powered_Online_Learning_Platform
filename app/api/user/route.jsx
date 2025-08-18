import { db } from "../../config/db.jsx"; // adjust path accordingly
 // adjust path accordingly

import { usersTable } from "@/lib/schema/users";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(req) {

    const { email, name } = await req.json();
    
    //if user exist?
    const users=await db.select().from(usersTable).where(usersTable.email.eq(email));
    
    //if user does not exist, create a new user
    if (users.length === 0) {
        const result=await db.insert(usersTable).values({
            name: name,
            email: email
        }).returning(usersTable);

        console.log("New user created:", result);
        
        return NextResponse.json(result)
    }

return NextResponse.json(users[0]);  
}