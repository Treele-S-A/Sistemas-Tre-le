import { verificarStatus } from '../server/verificarStatus';

// Função da Vercel: GET /api/status. A CDN guarda a resposta por 2 minutos, então cada sistema é testado
// no máximo uma vez a cada 2 minutos, não importa quantas pessoas abram o portal.
export async function GET(): Promise<Response> {
  const corpo = await verificarStatus();
  return new Response(JSON.stringify(corpo), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300',
    },
  });
}
