"use client";

import React, { useState, useEffect } from 'react';
import { Users, Zap, ShieldCheck, CheckCircle, Bell } from 'lucide-react';

/**
 * MOTOR DE GERAÇÃO ALEATÓRIA (Mini-Faker)
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

const getRandom = (arr: string[]): string => arr[Math.floor(Math.random() * arr.length)];

const generatePersona = () => ({
  name: `${getRandom(DATA_POOL.firstNames)} ${getRandom(DATA_POOL.lastNames)}`,
  city: getRandom(DATA_POOL.cities),
  time: getRandom(DATA_POOL.times)
});

const CONFIG = {
  pixelId: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID!, 
  instaName: "Dicas de Ofertas e Achadinhos"
};

export default function App() {
  const [activeNotification, setActiveNotification] = useState<any>(null);
  const [vagasRestantes, setVagasRestantes] = useState(14);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inicializa o Pixel do Facebook
  useEffect(() => {
    if (typeof window !== 'undefined' && CONFIG.pixelId !== "SEU_PIXEL_AQUI") {
      // Tipagem explícita dos parâmetros para evitar erro de 'implicit any' no Vercel
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

  // Inicializa a quantidade de vagas de forma aleatória entre 14 e 25
  useEffect(() => {
    const randomVagas = Math.floor(Math.random() * (25 - 14 + 1)) + 14;
    setVagasRestantes(randomVagas);
  }, []);

  // Notificações de Prova Social
  useEffect(() => {
    const showRandomNotification = () => {
      setActiveNotification(generatePersona());
      setTimeout(() => setActiveNotification(null), 4000);
    };

    const interval = setInterval(showRandomNotification, 9000);
    return () => clearInterval(interval);
  }, []);

  // Urgência Visual: Reduz vagas gradualmente
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (vagasRestantes > 3) setVagasRestantes(prev => prev - 1);
    }, 15000);
    return () => clearTimeout(timeout);
  }, [vagasRestantes]);

  const handleJoinGroup = async () => {
    setLoading(true);
    setError(null);

    const securityTimeout = setTimeout(() => {
      setLoading(false);
    }, 8000);

    const fbq = (window as any).fbq;
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
    } catch (err: any) {
      clearTimeout(securityTimeout);
      setError("Não conseguimos validar a tua vaga. Tenta novamente!");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans text-slate-900 p-4 relative overflow-hidden">
      
      {/* Background Decorativo */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-3xl opacity-30 pointer-events-none"></div>

      {/* Container Principal */}
      <main className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 z-10">
        
        {/* Banner Superior */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 sm:p-8 text-center text-white relative">
          <div className="absolute top-4 right-4 animate-pulse">
            <Zap size={24} className="text-yellow-300 fill-yellow-300" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight mb-2 leading-tight">
            {CONFIG.instaName}
          </h1>
          <p className="text-green-50 text-xs sm:text-sm font-medium opacity-90">
            As melhores promoções antes de todo mundo!
          </p>
        </div>

        {/* Conteúdo Central */}
        <div className="p-6 sm:p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="bg-green-50 p-4 rounded-full border border-green-100 shadow-inner">
                <Users size={40} className="text-green-600 sm:w-12 sm:h-12" />
              </div>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-bounce shadow-md">
                LOTANDO
              </span>
            </div>
          </div>

          <h2 className="text-lg sm:text-xl font-bold mb-4 leading-tight">
            Entre agora no nosso grupo de ofertas exclusivo!
          </h2>

          <ul className="text-left space-y-3 mb-8 inline-block">
            <li className="flex items-center text-slate-600 text-sm font-medium">
              <CheckCircle size={16} className="text-green-500 mr-2 shrink-0" />
              Cupons de desconto diários.
            </li>
            <li className="flex items-center text-slate-600 text-sm font-medium">
              <CheckCircle size={16} className="text-green-500 mr-2 shrink-0" />
              Links verificados e 100% seguros.
            </li>
            <li className="flex items-center text-slate-600 text-sm font-medium">
              <CheckCircle size={16} className="text-green-500 mr-2 shrink-0" />
              Sem spam. Apenas o que realmente interessa.
            </li>            
          </ul>

          <button
            onClick={handleJoinGroup}
            disabled={loading}
            className={`w-full py-4 sm:py-5 px-4 rounded-2xl text-white font-bold text-sm sm:text-base lg:text-lg shadow-xl transition-all active:scale-95 flex items-center justify-center space-x-2 
              ${loading ? 'bg-slate-300 cursor-wait' : 'bg-green-600 hover:bg-green-700 animate-pulse-slow shadow-green-200/50'}`}
          >
            {loading ? (
              <div className="flex items-center italic">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                A validar vaga...
              </div>
            ) : (
              <>
                <span className="truncate">ENTRAR NO GRUPO AGORA</span>
                <Zap size={20} fill="white" className="text-white shrink-0" />
              </>
            )}
          </button>

          {error && <p className="mt-4 text-xs font-bold text-red-500">{error}</p>}

          <p className="mt-4 text-xs font-black text-red-500 flex items-center justify-center uppercase tracking-widest italic">
            <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2 animate-ping"></span>
            Resta apenas {vagasRestantes} vagas disponíveis
          </p>
        </div>

        {/* Footer Seguro */}
        <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-center space-x-4 opacity-70">
           <div className="flex items-center text-[10px] font-bold text-green-700">
             <ShieldCheck size={14} className="mr-1" /> AMBIENTE SEGURO
           </div>
           <div className="flex items-center text-[10px] font-bold text-green-700">
             <CheckCircle size={14} className="mr-1" /> VERIFICADO
           </div>
        </div>
      </main>

      {/* Popup de Prova Social */}
      <div className={`fixed bottom-6 left-6 right-6 md:right-auto md:max-w-xs z-50 transition-all duration-500 transform ${activeNotification ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className="bg-white rounded-2xl shadow-2xl p-4 border border-slate-100 flex items-center space-x-4 border-l-4 border-l-green-500">
          <div className="bg-green-100 text-green-600 p-3 rounded-full">
            <Bell size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 leading-tight font-medium">
              <strong className="text-slate-900">{activeNotification?.name}</strong> de {activeNotification?.city}
            </p>
            <p className="text-[13px] font-bold text-green-600 italic">Entrou no grupo {activeNotification?.time}</p>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
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