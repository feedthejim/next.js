export const fetchCache = 'force-no-store';
export function GET() {
    return new Response('unreachable');
}
