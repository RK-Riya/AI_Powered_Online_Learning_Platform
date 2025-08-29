import { coursesTable, usersTable } from '@/config/schema';
import { auth, currentUser } from '@clerk/nextjs/server';
import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import { db } from '@/config/db';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';

const PROMPT = `Generate a Learning Course based on user input. Include: Course Name, Description, Banner Image Prompt, Chapters with Name, Duration, Topics, etc., in JSON format.

Schema:
{
    "course": {
        "name": "string",
        "description": "string",
        "category": "string",
        "level": "string",
        "includeVideo": "boolean",
        "noOfChapters": "number",
        "bannerImagePrompt": "string",
        "chapters": [
            {
                "chapterName": "string",
                "duration": "string",
                "topics": ["string"]
            }
        ]
    }
}

User Input:`;

// Initialize AI client
export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req) {
    const { courseId: incomingCourseId, ...formData } = await req.json();
    const user = await currentUser();

    if (!user?.primaryEmailAddress?.emailAddress) {
        return NextResponse.json(
            { error: 'User not authenticated' },
            { status: 401 }
        );
    }

    const courseId = incomingCourseId || uuidv4();

    // Generate AI content
    let rawResp;
    try {
        const contents = [
            { role: 'user', parts: [{ text: PROMPT + JSON.stringify(formData) }] }
        ];
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            config: { responseMimetypes: 'text/plain' },
            contents,
        });
        rawResp = response?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!rawResp) {
            throw new Error('No AI content returned');
        }
    } catch (err) {
        console.error('AI generation error:', err);
        return NextResponse.json(
            { error: 'Failed to generate AI course content' },
            { status: 500 }
        );
    }

    // Parse AI JSON robustly
    let JSONResp;
    try {
        const codeBlockMatch = rawResp.match(/```json\s*([\s\S]*?)```/i);
        if (codeBlockMatch) {
            JSONResp = JSON.parse(codeBlockMatch[1]);
        } else {
            const firstObjectMatch = rawResp.match(/\{[\s\S]*\}/);
            if (!firstObjectMatch) throw new Error('No JSON found in AI response');
            JSONResp = JSON.parse(firstObjectMatch[0]);
        }
    } catch (err) {
        console.error('Failed to parse AI JSON response:', err, rawResp);
        return NextResponse.json(
            { error: 'Failed to parse AI JSON response' },
            { status: 500 }
        );
    }

    // ✅ Ensure user exists in DB before inserting course
    const userExists = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, user.primaryEmailAddress.emailAddress));

    if (!userExists.length) {
        await db.insert(usersTable).values({
            name: user.firstName || 'Unknown',
            email: user.primaryEmailAddress.emailAddress,
        });
    }

    // Insert course
    try {
        await db.insert(coursesTable).values({
            ...formData,
            courseJson: JSONResp,
            userEmail: user.primaryEmailAddress.emailAddress,
            cid: courseId,
            bannerImageUrl: JSONResp.course.bannerImagePrompt || '',
            courseContent: JSONResp.course.chapters || [],
        });
    } catch (err) {
        console.error('Failed to insert course:', err);
        return NextResponse.json(
            { error: 'Failed to save course to database' },
            { status: 500 }
        );
    }

    return NextResponse.json({ courseId });
}
