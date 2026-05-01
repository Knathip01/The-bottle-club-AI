'use client';

import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { Edit2, Plus, FileText } from 'lucide-react';
import AccountSidebar from './AccountSidebar';

interface AccountContentProps {
  user: any;
}

export default function AccountContent({ user }: AccountContentProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <AccountSidebar user={user} />

      {/* Main Content */}
      <div className="flex-1">
        <h1 className="text-xl font-bold mb-8">{t('account.title')}</h1>

        {/* Section: Account Info */}
        <div className="bg-white border border-stone-200 p-6 mb-8">
          <div className="flex justify-between items-center mb-6 pb-2 border-b border-stone-100">
            <h3 className="text-sm font-bold uppercase tracking-wider">{t('account.profile')}</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xs font-bold text-stone-900 mb-4 uppercase">{t('account.user_info')}</h4>
              <p className="text-xs text-stone-600 mb-1">{user?.first_name} {user?.last_name}</p>
              <p className="text-xs text-stone-600 mb-6">{user?.email}</p>
              
              <div className="flex gap-4">
                <Link href="/account/profile" className="flex items-center gap-2 px-4 py-2 border border-stone-200 text-[10px] font-bold uppercase hover:bg-stone-50 transition-colors">
                  <Edit2 size={12} /> {t('common.edit')}
                </Link>
                <button className="flex items-center gap-2 px-4 py-2 border border-stone-200 text-[10px] font-bold uppercase hover:bg-stone-50 transition-colors">
                  {t('account.change_password')}
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-stone-900 mb-4 uppercase">{t('account.newsletter')}</h4>
              <p className="text-xs text-stone-600 mb-4">{t('account.no_newsletter')}</p>
              
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 border-stone-300 rounded focus:ring-0 accent-stone-900" />
                <span className="text-xs text-stone-500 group-hover:text-stone-900 transition-colors">{t('account.subscribe_newsletter')}</span>
              </label>
            </div>
          </div>
        </div>

        {/* Section: Address Book */}
        <div className="bg-white border border-stone-200 p-6 mb-8">
          <div className="flex justify-between items-center mb-6 pb-2 border-b border-stone-100">
            <h3 className="text-sm font-bold uppercase tracking-wider">
              {t('account.addresses')} 
              <Link href="/account/addresses" className="text-[10px] text-stone-400 ml-2 font-normal hover:underline cursor-pointer">
                {t('account.manage_addresses')}
              </Link>
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xs font-bold text-stone-900 mb-4 uppercase tracking-wide">{t('account.billing_address')}</h4>
              <p className="text-xs text-stone-400 mb-6 italic">{t('account.no_billing_address')}</p>
              
              <Link href="/account/addresses" className="flex items-center gap-2 px-4 py-2 border border-stone-200 text-[10px] font-bold uppercase hover:bg-stone-50 transition-colors w-fit">
                <Edit2 size={12} /> {t('account.edit_address')}
              </Link>
            </div>

            <div>
              <h4 className="text-xs font-bold text-stone-900 mb-4 uppercase tracking-wide">{t('account.shipping_address')}</h4>
              <p className="text-xs text-stone-400 mb-6 italic">{t('account.no_shipping_address')}</p>
              
              <Link href="/account/addresses" className="flex items-center gap-2 px-4 py-2 border border-stone-200 text-[10px] font-bold uppercase hover:bg-stone-50 transition-colors w-fit">
                <Edit2 size={12} /> {t('account.edit_address')}
              </Link>
            </div>
          </div>
        </div>

        {/* Section: Document Registration */}
        <div className="bg-white border border-stone-200 p-6">
          <div className="flex justify-between items-center mb-6 pb-2 border-b border-stone-100">
            <h3 className="text-sm font-bold uppercase tracking-wider">{t('account.docs_title')}</h3>
          </div>
          
          <div className="bg-[#f9f9f9] p-6 border border-stone-100">
            <h4 className="text-xs font-bold text-stone-900 mb-6">{t('account.docs_list_title')}:</h4>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <div className="bg-stone-200 p-1.5 rounded-full"><FileText size={14} className="text-stone-600" /></div>
                <span className="text-xs text-stone-600 font-medium">{t('account.doc_liquor_license')}</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-stone-200 p-1.5 rounded-full"><FileText size={14} className="text-stone-600" /></div>
                <span className="text-xs text-stone-600 font-medium">{t('account.doc_id_certificate')}</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-stone-200 p-1.5 rounded-full"><FileText size={14} className="text-stone-600" /></div>
                <span className="text-xs text-stone-600 font-medium">{t('account.doc_vat_certificate')}</span>
              </li>
            </ul>

            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder={t('account.no_file_selected')} 
                  className="flex-1 border border-stone-300 px-4 py-2 text-xs bg-white focus:outline-none"
                  readOnly 
                />
                <button className="bg-stone-200 hover:bg-stone-300 px-6 py-2 text-xs font-bold transition-colors">
                  {t('account.choose_file')}
                </button>
              </div>
              
              <button className="w-fit flex items-center gap-2 border-2 border-stone-900 px-6 py-3 text-xs font-bold uppercase hover:bg-stone-900 hover:text-white transition-all">
                <Plus size={16} /> {t('account.add_more_files')}
              </button>
            </div>
            
            <p className="text-[10px] text-stone-400 mt-4 leading-relaxed">
              {t('account.docs_hint')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
