'use client';

import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface AddressFormProps {
  user: any;
}

export default function AddressForm({ user }: AddressFormProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    phone: '',
    company: '',
    address: '',
    country: 'ไทย',
    province: '',
    provinceId: 0,
    district: '',
    districtId: 0,
    subDistrict: '',
    zipcode: '',
    isDefaultShipping: true,
    isDefaultBilling: true,
  });

  const [thailandData, setThailandData] = useState<any[]>([]);
  const [filteredAmphures, setFilteredAmphures] = useState<any[]>([]);
  const [filteredTambons, setFilteredTambons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchThailandData = async () => {
      try {
        const response = await fetch('https://raw.githubusercontent.com/kongvut/thai-province-data/refs/heads/master/api/latest/province_with_district_and_sub_district.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setThailandData(data);
      } catch (error) {
        console.error('Failed to fetch Thailand address data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchThailandData();
  }, []);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceId = parseInt(e.target.value);
    const province = thailandData.find(p => p.id === provinceId);
    
    setFormData({
      ...formData,
      province: province?.name_th || '',
      provinceId: provinceId,
      district: '',
      districtId: 0,
      subDistrict: '',
      zipcode: ''
    });
    
    setFilteredAmphures(province?.districts || []);
    setFilteredTambons([]);
  };

  const handleAmphureChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const amphureId = parseInt(e.target.value);
    const amphure = filteredAmphures.find(a => a.id === amphureId);
    
    setFormData({
      ...formData,
      district: amphure?.name_th || '',
      districtId: amphureId,
      subDistrict: '',
      zipcode: ''
    });
    
    setFilteredTambons(amphure?.sub_districts || []);
  };

  const handleTambonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tambonId = parseInt(e.target.value);
    const tambon = filteredTambons.find(t => t.id === tambonId);
    
    setFormData({
      ...formData,
      subDistrict: tambon?.name_th || '',
      zipcode: tambon?.zip_code?.toString() || ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/proxy/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user?.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          address_line: formData.address,
          country: formData.country,
          province: formData.province,
          district: formData.district,
          subdistrict: formData.subDistrict,
          postal_code: formData.zipcode,
          is_default_shipping: formData.isDefaultShipping,
          is_default_billing: formData.isDefaultBilling
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save address');
      }

      alert(t('account.save_success'));
      window.location.href = '/account';
    } catch (error) {
      console.error('Error saving address:', error);
      alert(t('account.save_error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="py-10 text-center text-stone-400">{t('account.loading_data')}</div>;

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
      {/* User Info Column */}
      <div className="space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wider mb-8">{t('account.user_info')}</h3>
        
        <div>
          <label className="block text-[11px] font-bold text-stone-900 mb-2">{t('account.first_name')} *</label>
          <input 
            type="text" 
            required
            value={formData.firstName}
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            className="w-full border border-stone-200 p-3 text-xs focus:outline-none focus:border-stone-900 transition-colors"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-stone-900 mb-2">{t('account.last_name')} *</label>
          <input 
            type="text" 
            required
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            className="w-full border border-stone-200 p-3 text-xs focus:outline-none focus:border-stone-900 transition-colors"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-stone-900 mb-2">{t('account.phone')} *</label>
          <input 
            type="tel" 
            required
            placeholder={t('account.phone')}
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full border border-stone-200 p-3 text-xs focus:outline-none focus:border-stone-900 transition-colors"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-stone-900 mb-2">{t('account.company')}</label>
          <input 
            type="text" 
            placeholder={t('account.company')}
            value={formData.company}
            onChange={(e) => setFormData({...formData, company: e.target.value})}
            className="w-full border border-stone-200 p-3 text-xs focus:outline-none focus:border-stone-900 transition-colors"
          />
        </div>
      </div>

      {/* Address Column */}
      <div className="space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wider mb-8">{t('account.address_title')}</h3>
        
        <div>
          <label className="block text-[11px] font-bold text-stone-900 mb-2">{t('account.address_label')} *</label>
          <input 
            type="text" 
            required
            placeholder="Address Line 1"
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            className="w-full border border-stone-200 p-3 text-xs focus:outline-none focus:border-stone-900 transition-colors"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-stone-900 mb-2">{t('account.country')} *</label>
          <div className="relative">
            <select className="w-full border border-stone-200 p-3 text-xs focus:outline-none bg-white appearance-none transition-colors">
              <option>ไทย</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-stone-900 mb-2">{t('account.province')} *</label>
          <div className="relative">
            <select 
              required
              className="w-full border border-stone-200 p-3 text-xs focus:outline-none bg-white appearance-none transition-colors"
              value={formData.provinceId}
              onChange={handleProvinceChange}
            >
              <option value="0">{t('account.select_province')}</option>
              {thailandData.map(p => (
                <option key={p.id} value={p.id}>{p.name_th}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-stone-900 mb-2">{t('account.district')} *</label>
          <div className="relative">
            <select 
              required
              className="w-full border border-stone-200 p-3 text-xs focus:outline-none bg-white appearance-none transition-colors"
              value={formData.districtId}
              onChange={handleAmphureChange}
              disabled={!formData.provinceId}
            >
              <option value="0">{t('account.select_district')}</option>
              {filteredAmphures.map(a => (
                <option key={a.id} value={a.id}>{a.name_th}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-stone-900 mb-2">{t('account.sub_district')} *</label>
          <div className="relative">
            <select 
              required
              className="w-full border border-stone-200 p-3 text-xs focus:outline-none bg-white appearance-none transition-colors"
              value={filteredTambons.find(t => t.name_th === formData.subDistrict)?.id || 0}
              onChange={handleTambonChange}
              disabled={!formData.districtId}
            >
              <option value="0">{t('account.select_sub_district')}</option>
              {filteredTambons.map(t => (
                <option key={t.id} value={t.id}>{t.name_th}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-stone-900 mb-2">{t('account.zipcode')} *</label>
          <input 
            type="text" 
            required
            placeholder={t('account.zipcode')}
            value={formData.zipcode}
            readOnly
            className="w-full border border-stone-200 p-3 text-xs bg-stone-50 focus:outline-none"
          />
        </div>
      </div>

      {/* Checkboxes and Submit button */}
      <div className="md:col-start-2 space-y-6">
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input 
              type="checkbox" 
              checked={formData.isDefaultShipping}
              onChange={(e) => setFormData({...formData, isDefaultShipping: e.target.checked})}
              className="w-4 h-4 border-stone-300 rounded focus:ring-0 accent-stone-900" 
            />
            <span className="text-[11px] font-bold text-stone-700">{t('account.use_shipping')}</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input 
              type="checkbox" 
              checked={formData.isDefaultBilling}
              onChange={(e) => setFormData({...formData, isDefaultBilling: e.target.checked})}
              className="w-4 h-4 border-stone-300 rounded focus:ring-0 accent-stone-900" 
            />
            <span className="text-[11px] font-bold text-stone-700">{t('account.use_billing')}</span>
          </label>
        </div>
      </div>

      <div className="md:col-span-2 flex justify-center mt-10">
        <button 
          type="submit"
          disabled={isSubmitting}
          className={`bg-black text-white px-12 py-4 text-xs font-bold uppercase hover:bg-stone-800 transition-colors tracking-widest ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? t('account.saving') : t('account.save_address')}
        </button>
      </div>
    </form>
  );
}
