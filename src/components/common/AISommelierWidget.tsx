'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Wine, 
  X, 
  Send, 
  Bot, 
  User, 
  Plus, 
  Check, 
  ChefHat 
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { INITIAL_MENU_ITEMS } from '@/lib/seed-data';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  recommendedItem?: {
    id: string;
    name: string;
    price: number;
    category: string;
  };
}

const KNOWLEDGE_BASE: Record<string, { reply: string; itemId?: string }> = {
  wagyu: {
    reply: "For the A5 Miyazaki Wagyu, our Head Sommelier strongly recommends the 2018 Barolo or our Smoked Obsidian Negroni. The rich marbling of the Japanese beef harmonizes magnificently with the firm tannins and charred citrus rosemary notes.",
    itemId: 'dr-2'
  },
  steak: {
    reply: "Our Wood-Grilled Prime Ribeye pairs exquisitely with bold Cabernet Sauvignon or our Smoked Obsidian Negroni. Its roasted garlic bone marrow butter cuts through the smoky char to create culinary balance.",
    itemId: 'dr-2'
  },
  gluten: {
    reply: "For a superb gluten-free experience, I recommend starting with our Quinoa & Avocado Sunshine Salad ($12.99), followed by the Glacier 51 Toothfish en Papillote ($32.00), and finishing with the Warm Valrhona Chocolate Sphere ($14.50).",
    itemId: 'dn-3'
  },
  dessert: {
    reply: "Nothing surpasses our Warm Chocolate Lava Cake ($8.99) with Belgian molten center, or our Golden Mirabelle Plum Soufflé. Pair them with a double shot of our 18-hour cold brew roast.",
    itemId: 'ds-1'
  },
  wine: {
    reply: "Our cellar features over 350 curated labels. If you enjoy vintage complexity, try our Château d’Yquem Vintage Cocktail ($18.50) with Sauternes 2011, saffron bitters, and orange blossom mist.",
    itemId: 'dr-3'
  },
  odyssey: {
    reply: "The 7-Course Seasonal Odyssey ($85.00) is Executive Chef Marco Rossi's signature blind tasting. It features Brittany blue lobster, A5 Miyazaki Wagyu, and hand-shaved Périgord truffles.",
    itemId: 'cs-1'
  }
};

export default function AISommelierWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [addedId, setAddedId] = useState<string | null>(null);
  const { addToCart } = useCart();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: "Bonjour! I am Chef Marco & Sophia's AI Sommelier & Culinary Concierge. How may I elevate your dining experience today?",
    }
  ]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');

    // Process AI response
    setTimeout(() => {
      const q = query.toLowerCase();
      let match = KNOWLEDGE_BASE.wine;

      if (q.includes('wagyu') || q.includes('beef')) match = KNOWLEDGE_BASE.wagyu;
      else if (q.includes('steak') || q.includes('meat') || q.includes('ribeye')) match = KNOWLEDGE_BASE.steak;
      else if (q.includes('gluten') || q.includes('allergy') || q.includes('vegan') || q.includes('diet')) match = KNOWLEDGE_BASE.gluten;
      else if (q.includes('dessert') || q.includes('sweet') || q.includes('cake') || q.includes('chocolate')) match = KNOWLEDGE_BASE.dessert;
      else if (q.includes('odyssey') || q.includes('tasting') || q.includes('course') || q.includes('chef')) match = KNOWLEDGE_BASE.odyssey;

      let recItem = undefined;
      if (match.itemId) {
        const found = INITIAL_MENU_ITEMS.find(i => i.id === match.itemId);
        if (found) {
          recItem = {
            id: found.id,
            name: found.name,
            price: found.price,
            category: found.category
          };
        }
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: match.reply,
        recommendedItem: recItem
      };

      setMessages(prev => [...prev, aiMsg]);
    }, 600);
  };

  const handleAddToCart = (item: { id: string; name: string; price: number; category: string }) => {
    const fullDish = INITIAL_MENU_ITEMS.find(i => i.id === item.id);
    if (fullDish) {
      addToCart(fullDish, 1);
      setAddedId(item.id);
      setTimeout(() => setAddedId(null), 2000);
    }
  };

  return (
    <>
      {/* Floating Trigger Pill */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#1a4231] hover:bg-[#122b20] text-white shadow-2xl border-2 border-white/20 transition-all duration-300 hover:scale-105"
          title="Open AI Sommelier & Concierge"
        >
          <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-400/40 flex items-center justify-center text-[#ea580c]">
            <Wine className="w-4 h-4 text-orange-400 group-hover:rotate-12 transition-transform" />
          </div>
          <div className="text-left hidden sm:block">
            <span className="block text-[10px] uppercase font-bold text-orange-300 tracking-wider leading-none">
              AI SOMMELIER
            </span>
            <span className="text-xs font-serif font-bold text-white leading-none mt-0.5 block">
              Pairing Concierge
            </span>
          </div>
          <span className="relative flex h-2.5 w-2.5 ml-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500" />
          </span>
        </button>
      </div>

      {/* Concierge Dialog Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 w-96 max-w-[calc(100vw-2rem)] h-[520px] max-h-[85vh] bg-white rounded-3xl border border-stone-200 shadow-2xl z-50 flex flex-col overflow-hidden animate-fade-in">
          
          {/* Header */}
          <div className="p-4 bg-[#1a4231] text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-orange-400">
                <ChefHat className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm leading-tight">Flavoria AI Concierge</h4>
                <span className="text-[10px] text-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Head Sommelier & Chef Assistant
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs bg-[#FAF8F5]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-full bg-[#1a4231] text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl p-3 shadow-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#ea580c] text-white rounded-tr-none'
                      : 'bg-white text-stone-800 border border-stone-200 rounded-tl-none'
                  }`}
                >
                  <p>{m.text}</p>

                  {/* Recommendation Card */}
                  {m.recommendedItem && (
                    <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between bg-stone-50 p-2 rounded-xl">
                      <div>
                        <strong className="block text-[11px] text-stone-900 line-clamp-1">
                          {m.recommendedItem.name}
                        </strong>
                        <span className="text-[#ea580c] font-bold text-xs">
                          ${m.recommendedItem.price.toFixed(2)}
                        </span>
                      </div>
                      <button
                        onClick={() => handleAddToCart(m.recommendedItem!)}
                        className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all ${
                          addedId === m.recommendedItem.id
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#1a4231] hover:bg-[#122b20] text-white'
                        }`}
                      >
                        {addedId === m.recommendedItem.id ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {m.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-stone-300 text-stone-700 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Prompts Bar */}
          <div className="p-2 bg-stone-100/80 border-t border-stone-200 flex items-center gap-1.5 overflow-x-auto text-[10px] scrollbar-none">
            <button
              onClick={() => handleSend("What wine pairs best with A5 Wagyu?")}
              className="px-2.5 py-1 rounded-full bg-white border border-stone-200 text-stone-700 whitespace-nowrap hover:border-[#ea580c]"
            >
              🍷 Wagyu Wine Pairing
            </button>
            <button
              onClick={() => handleSend("Recommend a gluten-free dinner")}
              className="px-2.5 py-1 rounded-full bg-white border border-stone-200 text-stone-700 whitespace-nowrap hover:border-[#ea580c]"
            >
              🌿 Gluten-Free Options
            </button>
            <button
              onClick={() => handleSend("What dessert do you recommend?")}
              className="px-2.5 py-1 rounded-full bg-white border border-stone-200 text-stone-700 whitespace-nowrap hover:border-[#ea580c]"
            >
              🍰 Best Dessert
            </button>
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-stone-200 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask sommelier or chef anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#ea580c]"
            />
            <button
              type="submit"
              className="w-8 h-8 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white flex items-center justify-center transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
