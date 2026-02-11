import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Inicializa o cliente Supabase com as tuas variáveis de ambiente
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

export async function POST(req: Request) {
  try {
    // 1. Pegamos o groupId do corpo da requisição (se vier da landing page)
    const body = await req.json().catch(() => ({}));
    const { groupId, groupType } = body;

    let groupTypeFilter = groupType; 
    if (!groupTypeFilter) groupTypeFilter = 'G'

    // 2. Buscamos TODOS os grupos ativos do banco de uma vez
    const { data: allGroups, error: fetchError } = await supabase
      .from('whatsapp_groups')
      .select('id, group_link, number_clicks, available_positions, active, group_type')
      .eq('active', true)
      .eq('group_type', groupTypeFilter)
      .order('id', { ascending: true });

    if (fetchError || !allGroups || allGroups.length === 0) {
      console.error("Erro ao buscar grupos:", fetchError);
      return NextResponse.json(
        { error: "Nenhum grupo ativo encontrado no momento." }, 
        { status: 404 }
      );
    }

    let targetGroup: WhatsAppGroup | null = null;

    // 3. Lógica de Seleção
    
    // Tentativa A: Se passou ID, verifica se o grupo existe e tem vaga
    if (groupId) {
      const specific = allGroups.find(g => g.id.toString() === groupId.toString());
      if (specific && Number(specific.number_clicks || 0) < Number(specific.available_positions || 0)) {
        targetGroup = specific;
      }
    }

    // Tentativa B: Se não teve ID ou o grupo do ID está lotado, percorre a lista em ordem
    if (!targetGroup) {
      // O "find" retorna o primeiro que encontrar. Se não achar, retorna undefined.
      const found = allGroups.find(g => 
        Number(g.number_clicks || 0) < Number(g.available_positions || 0)
      );

      // Atribuímos ao targetGroup. Se "found" for undefined, ele assume o fallback.
      targetGroup = found || allGroups[0] || null;
    }

    // 4. Incrementa o contador de cliques
    // Tenta via RPC primeiro (mais performático e evita race conditions)
    const { error: updateError } = await supabase.rpc('increment_clicks', { row_id: targetGroup.id });

    // Fallback manual se o RPC não estiver configurado
    if (updateError) {
      console.warn("RPC falhou, a usar update manual:", updateError.message);
      await supabase
        .from('whatsapp_groups')
        .update({ number_clicks: (Number(targetGroup.number_clicks) || 0) + 1 })
        .eq('id', targetGroup.id);
    }

    // 5. Retorna o link final
    return NextResponse.json({ url: targetGroup.group_link }, { status: 200 });

  } catch (error) {
    console.error("Erro crítico no servidor:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar o redirecionamento." }, 
      { status: 500 }
    );
  }
}
