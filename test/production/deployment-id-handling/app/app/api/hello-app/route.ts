import { NextResponse } from 'next/server'

export function GET(req) {
  return NextResponse.json({
    deploymentId: process.env.NEXT_DEPLOYMENT_ID,
  })
}
