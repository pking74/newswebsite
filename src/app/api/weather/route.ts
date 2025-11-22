import { NextResponse } from 'next/server';
import { getWeather } from '@/lib/weather';

export async function GET() {
  try {
    const weatherData = await getWeather();
    return NextResponse.json(weatherData);
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json({ error: 'Failed to fetch weather' }, { status: 500 });
  }
}
