import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'profile.json');

interface ProfileLink {
  title: string;
  url: string;
}

interface ProfileData {
  name: string;
  bio: string;
  avatarUrl: string;
  links: ProfileLink[];
}

export async function GET() {
  try {
    const fileContents = fs.readFileSync(dataFilePath, 'utf8');
    const data: ProfileData = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error reading profile data:", error);
    return NextResponse.json({ message: 'Error reading data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newLink: ProfileLink = await request.json();


    const fileContents = fs.readFileSync(dataFilePath, 'utf8');
    const data: ProfileData = JSON.parse(fileContents);

    data.links.push(newLink);
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));

    return NextResponse.json({ message: 'Link added successfully', links: data.links });
  } catch (error) {
    console.error("Error writing profile data:", error);
    return NextResponse.json({ message: 'Error writing data' }, { status: 500 });
  }
}