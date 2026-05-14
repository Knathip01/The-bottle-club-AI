'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Package } from 'lucide-react';

interface OrdersContentProps {
  initialOrders: any[];
}

export default function OrdersContent({ initialOrders }: OrdersContentProps) {
  const { t, language } = useLanguage();
  const [expandedOrders, setExpandedOrders] = useState<number[]>([]);

  const toggleOrder = (orderId: number) => {
    setExpandedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId) 
        : [...prev, orderId]
    );
  };

  return (
    <div className="flex-1">
      <h1 className="text-xl font-bold mb-8">{t('account.orders')}</h1>

      <div className="bg-white border border-stone-200 p-6 mb-8 shadow-sm">
        {initialOrders.length === 0 ? (
          <div className="bg-[#fcf8e3] text-[#8a6d3b] p-4 text-sm flex items-center gap-3 border border-[#faebcc]">
            <span className="font-bold text-lg">⚠</span> {t('account.no_orders')}
          </div>
        ) : (
          <div className="space-y-4">
            {initialOrders.map((order: any) => (
              <div key={order.id} className="border border-stone-100 overflow-hidden rounded-lg hover:border-stone-200 transition-all">
                <div className="p-5">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-stone-100 p-2 rounded-full">
                        <Package className="text-stone-600" size={18} />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-stone-900">{t('order.number')} #{order.id}</h3>
                        <p className="text-[10px] text-stone-400 uppercase tracking-tighter">
                          {new Date(order.created_at).toLocaleDateString(language === 'th' ? 'th-TH' : 'en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase ${
                      order.status === 'completed' ? 'bg-green-100 text-green-700' : 
                      order.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                      'bg-stone-100 text-stone-600'
                    }`}>
                      {t(`order.status_${order.status}`) || order.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
                    <div>
                      <p className="text-stone-400 text-[10px] uppercase font-bold mb-1 tracking-wider">{t('order.total')}</p>
                      <p className="font-bold text-[#a11a1a] text-base">฿{order.total_price?.toLocaleString() || 0}</p>
                    </div>
                    <div className="hidden md:block">
                      <p className="text-stone-400 text-[10px] uppercase font-bold mb-1 tracking-wider">{t('order.payment')}</p>
                      <p className="font-medium text-stone-800 text-xs uppercase">{order.payment_method}</p>
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                      <button 
                        onClick={() => toggleOrder(order.id)}
                        className="text-xs font-bold text-stone-900 border-b-2 border-stone-900 pb-0.5 hover:text-[#a11a1a] hover:border-[#a11a1a] transition-all"
                      >
                        {expandedOrders.includes(order.id) ? t('order.hide_details') : t('order.details')}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details Section */}
                {expandedOrders.includes(order.id) && (
                  <div className="bg-stone-50 border-t border-stone-100 p-6 animate-in slide-in-from-top duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-[10px] font-bold text-stone-900 uppercase mb-4 tracking-widest">{t('order.payment_info')}</h4>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-stone-500">{t('order.status')}:</span>
                            <span className="font-bold text-stone-900 uppercase">{t(`order.status_${order.status}`) || order.status}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-stone-500">{t('order.payment_method')}:</span>
                            <span className="font-bold text-stone-900 uppercase">{order.payment_method}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-stone-500">{t('order.address_id')}:</span>
                            <span className="font-bold text-stone-900">#{order.address_id}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-[10px] font-bold text-stone-900 uppercase mb-4 tracking-widest">{t('order.items')}</h4>
                        <p className="text-[11px] text-stone-400 italic">
                          {t('order.syncing_details')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
