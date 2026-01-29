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
  firstNames: ["Marcos", "Lucas", "Felipe", "Ricardo", "Tiago", "João", "Pedro", "Bruno", "Gustavo", "André", "Rafael", "Diego", "Mariana", "Ana", "Beatriz", "Camila", "Jéssica", "Bruna", "Letícia", "Fernanda", "Amanda", "Larissa", "Patrícia", "Aline", "Juliana"],
  lastNames: ["Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira", "Lima", "Gomes", "Costa", "Ribeiro", "Martins", "Carvalho"],
  cities: ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba", "Salvador", "Fortaleza", "Brasília", "Goiânia", "Manaus", "Recife", "Porto Alegre", "Vitória"],
  times: ["agora", "há 1 min", "há 2 min", "há 3 min"]
};

const getRandom = (arr: any[]): any => arr[Math.floor(Math.random() * arr.length)];

const generatePersona = () => ({
  name: `${getRandom(DATA_POOL.firstNames)} ${getRandom(DATA_POOL.lastNames)}`,
  city: getRandom(DATA_POOL.cities),
  time: getRandom(DATA_POOL.times)
});

/**
 * UTILS & CONFIG
 */
const getSafeEnvVar = (name: string): string | null => {
  try {
    // No Next.js, as variáveis NEXT_PUBLIC_ são substituídas em tempo de build.
    // Usamos esta checagem para evitar o erro "process is not defined" no navegador.
    return typeof process !== 'undefined' && process.env ? (process.env as any)[name] : null;
  } catch (e) {
    return null;
  }
};

const CONFIG = {
  // Pegando o ID do Pixel exatamente como está no teu Vercel
  pixelId: getSafeEnvVar('NEXT_PUBLIC_FACEBOOK_PIXEL_ID'),
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
  { name: "Netshoes", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Netshoes_2024.svg/250px-Netshoes_2024.svg.png"}
];

export default function App() {
  const [activeNotification, setActiveNotification] = useState<any>(null);
  const [vagasRestantes, setVagasRestantes] = useState<number>(14);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 1. MONITORIZAÇÃO DE ACESSOS (PAGE VIEWS NO DB)
  useEffect(() => {
    const recordPageView = async () => {
      try { await fetch('/api/stats/view', { method: 'POST' }); } catch (err) {}
    };
    recordPageView();
  }, []);

  // 2. REPLICAÇÃO DO PIXEL ORIGINAL (Lógica que você confirmou que funcionava)
  useEffect(() => {
    if (typeof window !== 'undefined' && CONFIG.pixelId && CONFIG.pixelId !== "SEU_PIXEL_AQUI") {
      // Injeção idêntica ao código original
      (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
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

      const fbq = (window as any).fbq;
      if (fbq) {
        fbq('init', CONFIG.pixelId);
        fbq('track', 'PageView');
      }
    }
  }, []);

  // 3. LOGICA DE VAGAS E NOTIFICAÇÕES
  useEffect(() => {
    setVagasRestantes(Math.floor(Math.random() * (25 - 14 + 1)) + 14);
    
    const interval = setInterval(() => {
      setActiveNotification(generatePersona());
      setTimeout(() => setActiveNotification(null), 4000);
    }, 9000);

    const urgencyTimeout = setInterval(() => {
      setVagasRestantes(prev => (prev > 3 ? prev - 1 : prev));
    }, 15000);

    return () => {
      clearInterval(interval);
      clearInterval(urgencyTimeout);
    };
  }, []);

  // 4. API DE REDIRECCIONAMENTO + EVENTO LEAD
  const handleJoinGroup = async () => {
    setLoading(true);
    setError(null);
    const securityTimeout = setTimeout(() => setLoading(false), 8000);
    
    const fbq = (window as any).fbq;
    if (fbq) {
      fbq('track', 'Lead', { content_name: 'Entrada no Grupo' });
    }

    try {
      const response = await fetch('/api/groups/redirect', { method: 'POST' });
      const data = await response.json();
      
      if (data.url) {
        setTimeout(() => { window.location.href = data.url; }, 500);
      } else {
        throw new Error(data.error || "Nenhum grupo disponível.");
      }
    } catch (err: any) {
      clearTimeout(securityTimeout);
      setError("Não conseguimos validar a tua vaga. Tenta novamente!");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col items-center justify-start sm:justify-center p-2 sm:p-4 font-sans text-slate-900 relative overflow-x-hidden">
      
      {/* Notificação Flutuante */}
      <div className={`fixed top-4 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-[1000] transition-all duration-500 ${activeNotification ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'}`}>
        <div className="bg-white border border-purple-100 rounded-full px-4 py-2 shadow-2xl flex items-center gap-3 max-w-fit mx-auto">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <p className="text-[10px] sm:text-xs font-bold text-gray-700">
            <span className="text-[#6b21a8]">{activeNotification?.name}</span> entrou no grupo! ✨
          </p>
        </div>
      </div>

      <div className="w-full max-w-[390px] z-10 mt-2 mb-4">
        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-purple-50 flex flex-col">
          
          {/* Header Compacto (S24 Ultra fix) */}
          <div className="bg-[#6b21a8] pt-6 pb-5 px-6 text-center relative">
            <div className="flex justify-center mb-4">
              <div className="bg-[#fde047] text-[#6b21a8] font-black px-3 py-1 rounded-full text-[9px] uppercase tracking-wider animate-bounce shadow-md flex items-center gap-1">
                <Gift size={10} /> ACESSO 100% GRATUITO
              </div>
            </div>

            <div className="inline-block relative mb-3">
              <div className="w-16 h-16 bg-[#4c1d95] rounded-full border-[3px] border-[#fde047] flex flex-col items-center justify-center p-2 text-center shadow-lg">
                <span className="text-[6px] font-black text-[#fde047] leading-tight uppercase">Dicas de</span>
                <span className="text-[6px] font-black text-[#fde047] leading-tight uppercase">Achadinhos</span>
                <ShoppingBag size={16} className="text-[#fde047] mt-0.5" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-blue-500 w-5 h-5 rounded-full border-2 border-[#6b21a8] flex items-center justify-center shadow-md">
                <Check size={10} className="text-white" />
              </div>
            </div>

            <h1 className="text-white text-lg font-extrabold leading-tight px-4 uppercase tracking-tighter">
              Participa na nossa Comunidade de Achadinhos
            </h1>
          </div>

          {/* Carrossel de Lojas */}
          <div className="overflow-hidden py-3 bg-white border-y border-slate-50">
            <div className="flex w-max animate-carousel items-center">
              {[...LOGOS, ...LOGOS].map((logo, i) => (
                <div key={i} className="flex-none flex justify-center items-center px-4 w-[110px]">
                  <img src={logo.url} alt={logo.name} className="h-5 object-contain transform scale-110" />
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 py-5">
            <div className="space-y-2.5 mb-6">
              {[
                "Cupons de desconto diários.",
                "Links verificados e 100% seguros.",
                "Bugs de preço e promoções relâmpago.",
                "Sem spam. Apenas o que interessa."
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                    <CheckCircle size={14} />
                  </div>
                  <p className="text-[12px] font-semibold text-slate-600">{text}</p>
                </div>
              ))}
            </div>

            <button
              onClick={handleJoinGroup}
              disabled={loading}
              className={`w-full py-4 rounded-xl text-white font-black text-base shadow-lg flex items-center justify-center gap-3 transition-all active:scale-95 animate-pulse-slow
                ${loading ? 'bg-slate-300' : 'bg-[#25D366] hover:bg-[#1fb855]'}`}
            >
              {loading ? (
                <div className="flex items-center text-sm italic">
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Validando...
                </div>
              ) : (
                <>
                  <Zap size={20} fill="white" className="shrink-0" />
                  <span className="truncate uppercase tracking-tight">Entrar no grupo agora</span>
                </>
              )}
            </button>

            {error && <p className="mt-3 text-center text-[10px] font-bold text-red-600 bg-red-50 p-2 rounded-lg">{error}</p>}

            <div className="mt-6 p-3 bg-slate-50 rounded-xl text-center border border-slate-100">
              <div className="flex justify-center -space-x-1.5 mb-2">
                {[201, 202, 203, 204].map(id => (
                  <img key={id} src={`https://i.pravatar.cc/100?u=${id}`} className="w-5 h-5 rounded-full border-2 border-white shadow-sm" alt="membro" />
                ))}
                <div className="w-5 h-5 rounded-full bg-[#6b21a8] text-white text-[7px] flex items-center justify-center font-bold border-2 border-white">+</div>
              </div>
              <p className="text-[10px] font-extrabold text-gray-700 leading-tight uppercase">
                Junte-se a mais de <span className="text-[#6b21a8]">100 mil pessoas</span>
              </p>
            </div>

            <div className="mt-5 flex flex-col items-center">
              <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden mb-2">
                <div 
                  className="bg-[#6b21a8] h-full transition-all duration-1000 ease-out" 
                  style={{ width: `${100 - (vagasRestantes * 2)}%` }}
                ></div>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Grupo quase lotado</p>
                <p className="text-[10px] text-red-600 font-black uppercase italic animate-pulse">
                  Resta apenas {vagasRestantes} vagas
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-center space-x-4 opacity-60">
           <div className="flex items-center text-[9px] font-bold text-slate-500 uppercase">
             <ShieldCheck size={12} className="mr-1 text-green-600" /> Ambiente Seguro
           </div>
           <div className="flex items-center text-[9px] font-bold text-slate-500 uppercase">
             <CheckCircle size={12} className="mr-1 text-green-600" /> Verificado
           </div>
        </div>

        <p className="text-center mt-4 text-[9px] text-gray-400 font-bold uppercase tracking-widest px-4">
          Temos mais de 60 grupos de ofertas ativos!
        </p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes carousel { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-carousel { animation: carousel 20s linear infinite; }
        @keyframes pulse-slow { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }
        .animate-pulse-slow { animation: pulse-slow 2s infinite ease-in-out; }
      `}} />
    </div>
  );
}
