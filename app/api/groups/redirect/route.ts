import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Adicionamos a nova coluna na Interface
interface WhatsAppGroup {
  id: number;
  group_link: string;
  number_clicks: number;
  available_positions: number;
  active: boolean;
  group_type: string;
  secondary_groups: string | null; // Tipagem para aceitar string ou NULL
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { groupId, groupType } = body;

    let groupTypeFilter = groupType || 'G';

    // Importante: Incluímos 'secondary_groups' no select
    const { data, error: fetchError } = await supabase
      .from('whatsapp_groups')
      .select('id, group_link, number_clicks, available_positions, active, group_type, secondary_groups')
      .eq('active', true)
      .eq('group_type', groupTypeFilter)
      .order('id', { ascending: true });

    // Forçamos o cast para o array da interface que criamos
    const allGroups = data as WhatsAppGroup[] | null;

    if (fetchError || !allGroups || allGroups.length === 0) {
      return NextResponse.json(
        { error: "Nenhum grupo ativo encontrado." }, 
        { status: 404 }
      );
    }

    let targetGroup: WhatsAppGroup | null = null;

    // 1. Lógica se houver um ID específico (Vindo do anúncio)
    if (groupId) {
      const specific = allGroups.find(g => g.id.toString() === groupId.toString());

      if (specific) {
        const currentClicks = Number(specific.number_clicks || 0);
        const maxPositions = Number(specific.available_positions || 0);

        // Se o principal tem vaga
        if (currentClicks < maxPositions) {
          targetGroup = specific;
        } 
        // Se lotou e tem secundários definidos
        else if (specific.secondary_groups) {
          const secondaryIds = specific.secondary_groups.split(',').map(id => id.trim());
          
          for (const sId of secondaryIds) {
            const secondary = allGroups.find(g => g.id.toString() === sId);
            if (secondary) {
              const sClicks = Number(secondary.number_clicks || 0);
              const sMax = Number(secondary.available_positions || 0);
              
              if (sClicks < sMax) {
                targetGroup = secondary;
                break;
              }
            }
          }
        }
      }
    }

    // 2. Fallback: Se não passou ID ou a estratégia do ID (principal + secundários) falhou
    if (!targetGroup) {
      const found = allGroups.find(g => 
        Number(g.number_clicks || 0) < Number(g.available_positions || 0)
      );
      targetGroup = found || allGroups[0];
    }

    // 3. Update e Resposta (Garantindo que targetGroup existe)
    if (targetGroup) {
      const { error: updateError } = await supabase.rpc('increment_clicks', { row_id: targetGroup.id });

      if (updateError) {
        await supabase
          .from('whatsapp_groups')
          .update({ number_clicks: (Number(targetGroup.number_clicks) || 0) + 1 })
          .eq('id', targetGroup.id);
      }

      return NextResponse.json({ url: targetGroup.group_link }, { status: 200 });
    }

    return NextResponse.json({ error: "Erro ao selecionar grupo." }, { status: 400 });

  } catch (error) {
    console.error("Erro crítico:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor." }, 
      { status: 500 }
    );
  }
}
