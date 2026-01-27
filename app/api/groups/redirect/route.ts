import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Inicializa o cliente Supabase
// Certifica-te de que estas variáveis estão no teu .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface WhatsAppGroup {
  id: number;
  group_link: string;
  number_clicks: number;
  available_positions: number;
  active: boolean;
}

export async function POST() {
  try {
    // 1. Procuramos todos os grupos ativos
    // Em vez de filtrar no banco a comparação de colunas (que deu erro), 
    // trazemos os ativos e filtramos na memória do servidor.
    const { data: groups, error: fetchError } = await supabase
      .from('whatsapp_groups')
      .select('id, group_link, number_clicks, available_positions')
      .eq('active', true)
      .order('id', { ascending: true });

    if (fetchError || !groups || groups.length === 0) {
      console.error("Erro ao procurar grupos:", fetchError);
      return NextResponse.json(
        { error: "Desculpa, não encontrámos grupos ativos agora!" }, 
        { status: 404 }
      );
    }

    // 2. Filtramos no JavaScript o primeiro grupo que ainda tem vaga real
    // Comparamos o número de cliques com a capacidade definida
    const activeGroup = groups.find(g => 
      Number(g.number_clicks || 0) < Number(g.available_positions || 0)
    );

    if (!activeGroup) {
      return NextResponse.json(
        { error: "Todos os nossos grupos estão cheios no momento!" }, 
        { status: 404 }
      );
    }

    // 3. Incrementa o contador usando a função RPC 'increment_clicks'
    const { error: updateError } = await supabase.rpc('increment_clicks', { row_id: activeGroup.id });

    // Fallback caso o RPC não esteja configurado no painel do Supabase
    if (updateError) {
      console.warn("RPC falhou ou não existe, a usar update manual:", updateError.message);
      await supabase
        .from('whatsapp_groups')
        .update({ number_clicks: (Number(activeGroup.number_clicks) || 0) + 1 })
        .eq('id', activeGroup.id);
    }

    // 4. Retorna a URL para o redirecionamento
    return NextResponse.json({ url: activeGroup.group_link }, { status: 200 });

  } catch (error) {
    console.error("Erro crítico no servidor:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor ao processar o link." }, 
      { status: 500 }
    );
  }
}