"use client";

import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  ShieldCheck, 
  CheckCircle, 
  Bell, 
  Gift, 
  Tag, 
  ShoppingBag,
  Check,
  Users
} from 'lucide-react';

/**
 * MOTOR DE GERAÇÃO ALEATÓRIA (Mini-Faker Original)
 */
const DATA_POOL = {
  firstNames: [
    "Marcos", "Lucas", "Felipe", "Ricardo", "Tiago", "João", "Pedro", "Bruno", 
    "Gustavo", "André", "Rafael", "Diego", "Leonardo", "Vitor", "Gabriel",
    "Mariana", "Ana", "Beatriz", "Camila", "Jéssica", "Bruna", "Letícia", 
    "Fernanda", "Amanda", "Larissa", "Patrícia", "Aline", "Juliana",
    "Adriano", "Alex", "Anderson", "Breno", "Caio", "Daniel", "Danilo",
    "Eduardo", "Elias", "Henrique", "Igor", "Luiz", "Marcelo", "Matheus",
    "Alice", "Andréia", "Bianca", "Carolina", "Daniela", "Gabriela", "Helena",
    "Isabela", "Júlia", "Luana", "Marcela", "Natália", "Priscila", "Renata"
  ],
  lastNames: [
    "Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", 
    "Pereira", "Lima", "Gomes", "Costa", "Ribeiro", "Martins", "Carvalho",
    "Almeida", "Araújo", "Barbosa", "Cardoso", "Dias", "Fernandes", "Garcia", 
    "Lopes", "Machado", "Melo", "Mendes", "Moreira", "Nascimento", "Nunes", 
    "Rocha", "Santana", "Teixeira", "Vieira"
  ],
  cities: [
    "São Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba", "Salvador", 
    "Fortaleza", "Brasília", "Goiânia", "Manaus", "Recife", "Porto Alegre", 
    "Belém", "Florianópolis", "Vitória", "Cuiabá", "Natal", "Maceió", "Teresina",
    "João Pessoa", "Aracaju", "Campo Grande", "Porto Velho", "Boa Vista", "Macapá",
    "Campinas", "São Luís", "Osasco", "Niterói", "São Gonçalo", "Ribeirão Preto",
    "Guarulhos", "São Bernardo do Campo", "Duque de Caxias", "Joinville", "Londrina",
    "Sorocaba", "Uberlândia", "Jundiaí", "Anápolis", "Caxias do Sul", "Feira de Santana",
    "Juiz de Fora", "Cascavel", "Mossoró", "Petrolina", "Blumenau", "Santos", "Piracicaba",
    "Bauru", "Maringá", "Campos dos Goytacazes", "Vila Velha", "Serra", "Betim"
  ],
  times: ["agora", "há 1 min", "há 2 min", "há 3 min"]
};

const getRandom = (arr: any) => arr[Math.floor(Math.random() * arr.length)];

const generatePersona = () => ({
  name: `${getRandom(DATA_POOL.firstNames)} ${getRandom(DATA_POOL.lastNames)}`,
  city: getRandom(DATA_POOL.cities),
  time: getRandom(DATA_POOL.times)
});

// Ajuste técnico para evitar ReferenceError: process is not defined em ambientes de navegador
const getSafeEnvVar = (name) => {
  try {
    return typeof process !== 'undefined' && process.env ? process.env[name] : null;
  } catch (e) {
    return null;
  }
};

const CONFIG = {
  pixelId: getSafeEnvVar('NEXT_PUBLIC_FACEBOOK_PIXEL_ID') || "SEU_PIXEL_AQUI", 
  instaName: "Dicas de Ofertas e Achadinhos"
};

const LOGOS = [
  { name: "Amazon", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Amazon_2024.svg/250px-Amazon_2024.svg.png" },
  { name: "Mercado Livre", url: "https://upload.wikimedia.org/wikipedia/pt/thumb/0/04/Logotipo_MercadoLivre.png/330px-Logotipo_MercadoLivre.png" },
  { name: "Shopee", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Shopee_logo.svg/250px-Shopee_logo.svg.png" },
  { name: "Shein", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Shein_Logo_2017.svg/250px-Shein_Logo_2017.svg.png" },
  { name: "Magalu", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Magalu_-_novo_logo.png/250px-Magalu_-_novo_logo.png" },
  { name: "AliExpress", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/AliExpress_2024.svg/250px-AliExpress_2024.svg.png" },
  { name: "Sephora", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Sephora_logo.svg/250px-Sephora_logo.svg.png" },
  { name: "Natura", url: "https://upload.wikimedia.org/wikipedia/pt/thumb/c/cb/Natura_Logo.png/250px-Natura_Logo.png" },
  { name: "Avon", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Avon_Products_logo_%282023%29.svg/250px-Avon_Products_logo_%282023%29.svg.png" },
  { name: "OBoticario", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Oboticario-logo.png/250px-Oboticario-logo.png" },
  { name: "Casas Bahia", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Casas_Bahia_logo_2020.svg/250px-Casas_Bahia_logo_2020.svg.png" },
  { name: "Netshoes", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Netshoes_2024.svg/250px-Netshoes_2024.svg.png"}
];

export default function App() {
  const [activeNotification, setActiveNotification] = useState(null);
  const [vagasRestantes, setVagasRestantes] = useState(14);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. Registro de Acesso (Page Views) - Lógica NOVA solicitada
  useEffect(() => {
    const recordPageView = async () => {
      try {
        // Faz a chamada para a sua rota de estatísticas
        await fetch('/api/stats/view', { method: 'POST' });
      } catch (err) {
        // Falha silenciosa para não atrapalhar a experiência do usuário
        console.warn("Monitoramento de acesso indisponível no momento.");
      }
    };
    recordPageView();
  }, []);

  // 2. Inicializa o Pixel do Facebook (Lógica Original)
  useEffect(() => {
    if (typeof window !== 'undefined' && CONFIG.pixelId !== "SEU_PIXEL_AQUI") {
      (function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      
      const fbq = window.fbq;
      if (fbq) {
        fbq('init', CONFIG.pixelId);
        fbq('track', 'PageView');
      }
    }
  }, []);

  // 3. Inicializa Vagas (Lógica Original)
  useEffect(() => {
    const randomVagas = Math.floor(Math.random() * (25 - 14 + 1)) + 14;
    setVagasRestantes(randomVagas);
  }, []);

  // 4. Notificações de Prova Social (Lógica Original: 9s/4s)
  useEffect(() => {
    const showRandomNotification = () => {
      setActiveNotification(generatePersona());
      setTimeout(() => setActiveNotification(null), 4000);
    };

    const interval = setInterval(showRandomNotification, 9000);
    return () => clearInterval(interval);
  }, []);

  // 5. Urgência Visual (Lógica Original)
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (vagasRestantes > 3) setVagasRestantes(prev => prev - 1);
    }, 15000);
    return () => clearTimeout(timeout);
  }, [vagasRestantes]);

  // 6. Redirecionamento de Grupos via API (Lógica Original)
  const handleJoinGroup = async () => {
    setLoading(true);
    setError(null);

    const securityTimeout = setTimeout(() => {
      setLoading(false);
    }, 8000);

    const fbq = window.fbq;
    if (fbq) {
      fbq('track', 'Lead', { content_name: 'Entrada no Grupo' });
    }

    try {
      const response = await fetch('/api/groups/redirect', { method: 'POST' });
      const data = await response.json();
      
      if (data.url) {
        setTimeout(() => {
          window.location.href = data.url;
        }, 500);
      } else {
        clearTimeout(securityTimeout);
        throw new Error(data.error || "Nenhum grupo disponível.");
      }
    } catch (err) {
      clearTimeout(securityTimeout);
      setError("Não conseguimos validar a tua vaga. Tenta novamente!");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfaf9] flex flex-col items-center justify-center p-4 py-8 font-sans text-slate-900 relative overflow-hidden">
      
      {/* Notificação Flutuante */}
      <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-[1000] transition-all duration-500 ${activeNotification ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'}`}>
        <div className="bg-white border border-purple-100 rounded-full px-5 py-3 shadow-2xl flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <p className="text-[11px] font-bold text-gray-700">
            <span className="text-[#6b21a8]">{activeNotification?.name}</span> entrou no grupo! ✨
          </p>
        </div>
      </div>

      <div className="w-full max-w-sm z-10">
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-purple-50">
          
          {/* Header Roxo Premium */}
          <div className="bg-[#6b21a8] p-8 text-center relative">
            <div className="flex justify-center mb-6">
              <div className="bg-[#fde047] text-[#6b21a8] font-black px-3 py-1 rounded-full text-[10px] uppercase tracking-wider animate-bounce shadow-lg flex items-center gap-1">
                <Gift size={12} /> ACESSO 100% GRATUITO
              </div>
            </div>

            <div className="inline-block relative mb-4">
              <div className="w-20 h-20 bg-[#4c1d95] rounded-full border-4 border-[#fde047] flex flex-col items-center justify-center p-2 text-center shadow-lg">
                <span className="text-[7px] font-black text-[#fde047] leading-tight uppercase">Dicas de Ofertas e</span>
                <span className="text-[7px] font-black text-[#fde047] leading-tight uppercase">Achadinhos</span>
                <ShoppingBag size={20} className="text-[#fde047] mt-1" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-blue-500 w-6 h-6 rounded-full border-4 border-[#6b21a8] flex items-center justify-center shadow-md">
                <Check size={12} className="text-white" />
              </div>
            </div>

            <h1 className="text-white text-xl font-extrabold leading-tight px-2 uppercase tracking-tighter">
              Participa na nossa Comunidade de Achadinhos
            </h1>
          </div>

          {/* Carrossel de Lojas */}
          <div className="overflow-hidden py-6 bg-white border-y border-slate-100">
            <div className="flex w-max animate-carousel items-center">
              {[...LOGOS, ...LOGOS].map((logo, i) => (
                <div key={i} className="flex-none flex justify-center items-center px-6 w-[140px]">
                  <img 
                    src={logo.url} 
                    alt={logo.name} 
                    className="h-6 md:h-7 object-contain transition-all duration-300 transform hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="p-8">
            {/* Checklist de Valor */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
                  <CheckCircle size={14} />
                </div>
                <p className="text-[13px] font-bold text-slate-600">Cupons de desconto diários.</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
                  <CheckCircle size={14} />
                </div>
                <p className="text-[13px] font-bold text-slate-600">Links verificados e 100% seguros.</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
                  <CheckCircle size={14} />
                </div>
                <p className="text-[13px] font-bold text-slate-600">Bugs de preço e promoções relâmpago.</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
                  <CheckCircle size={14} />
                </div>
                <p className="text-[13px] font-bold text-slate-600">Sem spam. Apenas o que realmente interessa.</p>
              </div>
            </div>

            {/* Botão de Ação */}
            <button
              onClick={handleJoinGroup}
              disabled={loading}
              className={`w-full py-5 rounded-2xl text-white font-black text-lg shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 animate-pulse-slow
                ${loading ? 'bg-slate-300 cursor-wait' : 'bg-[#25D366] hover:bg-[#1fb855] shadow-green-200/50 uppercase'}`}
            >
              {loading ? (
                <div className="flex items-center italic">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Validando...
                </div>
              ) : (
                <>
                  <Zap size={24} fill="white" className="shrink-0" />
                  <span className="truncate">ENTRAR NO GRUPO AGORA</span>
                </>
              )}
            </button>

            {error && <p className="mt-4 text-center text-xs font-bold text-red-600 bg-red-50 p-2 rounded-lg">{error}</p>}

            {/* Prova Social de Membros */}
            <div className="mt-8 p-4 bg-gray-50 rounded-2xl text-center border border-gray-100">
              <div className="flex justify-center -space-x-2 mb-2">
                {[201, 202, 203].map(id => (
                  <img key={id} src={`https://i.pravatar.cc/100?u=${id}`} className="w-6 h-6 rounded-full border-2 border-white shadow-sm" alt="membro" />
                ))}
                <div className="w-6 h-6 rounded-full bg-[#6b21a8] text-white text-[8px] flex items-center justify-center font-bold border-2 border-white">+</div>
              </div>
              <p className="text-[11px] font-extrabold text-gray-700 leading-tight uppercase">
                Junte-se a mais de <span className="text-[#6b21a8]">100 mil pessoas</span><br />economizando todos os dias!
              </p>
            </div>

            {/* Barra de Escassez Dinâmica */}
            <div className="mt-6 flex flex-col items-center gap-2">
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-[#6b21a8] h-full transition-all duration-1000 ease-out" 
                  style={{ width: `${100 - (vagasRestantes * 2)}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">
                Grupo quase lotado
              </p>
            </div>
          </div>
        </div>
        
        {/* Footer de Confiança */}
        <div className="mt-8 flex items-center justify-center space-x-6 opacity-40">
           <div className="flex items-center text-[10px] font-bold text-slate-600">
             <ShieldCheck size={14} className="mr-1 text-green-600" /> AMBIENTE SEGURO
           </div>
           <div className="flex items-center text-[10px] font-bold text-slate-600">
             <CheckCircle size={14} className="mr-1 text-green-600" /> VERIFICADO
           </div>
        </div>

        <p className="text-center mt-6 text-[10px] text-gray-300 font-bold uppercase tracking-widest italic px-4">
          Temos mais de 60 grupos de ofertas ativos!
        </p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes carousel {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-carousel {
          animation: carousel 20s linear infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s infinite ease-in-out;
        }
      `}} />
    </div>
  );
}
