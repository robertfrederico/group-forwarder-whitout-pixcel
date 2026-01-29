import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Inicializa o cliente do Supabase
// Certifica-te que as variáveis de ambiente estão configuradas no teu .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Usamos a service role para garantir a escrita
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST() {
  try {
    // 1. Tentamos atualizar a contagem de acessos
    // Como é um contador global, assumimos que existe apenas uma linha ou 
    // identificamos por algum critério. Aqui vamos tentar atualizar a primeira.
    
    // Obs: No Supabase, para incrementar de forma atómica sem RPC, 
    // costumamos usar uma função SQL. Mas vamos tentar o update direto primeiro.
    
    const { data: currentData, error: fetchError } = await supabase
      .from('page_views')
      .select('access_count')
      .limit(1)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (!currentData) {
      // Se a tabela estiver vazia, cria o primeiro registro
      const { error: insertError } = await supabase
        .from('page_views')
        .insert([{ access_count: 1, last_acess: new Date().toISOString() }]);
      
      if (insertError) throw insertError;
    } else {
      // Se já existe, incrementa
      const newCount = Number(currentData.access_count || 0) + 1;
      
      const { error: updateError } = await supabase
        .from('page_views')
        .update({ 
          access_count: newCount, 
          last_acess: new Date().toISOString() 
        })
        .match({ access_count: currentData.access_count }); // Garantia simples de concorrência
      
      if (updateError) throw updateError;
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error("Erro ao gravar visualização de página:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar estatísticas." }, 
      { status: 500 }
    );
  }
}
