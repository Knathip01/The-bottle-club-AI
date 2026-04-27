'use client';

import { useState, useEffect } from 'react';
import MainHeader from '@/components/MainHeader';
import Footer from '@/components/Footer';
import AccountSidebar from '@/components/account/AccountSidebar';
import { ChevronDown } from 'lucide-react';

export default function AddAddressPage() {
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
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

  useEffect(() => {
    // Fetch user session (simulated or from local storage/auth utils)
    // For now, we'll try to fetch it or use a placeholder
    const fetchUser = async () => {
      try {
        // In a real app, this would come from a server component or a context
        // For simplicity in this client component, we'll assume the session is available
        // or redirect if not. But since we're in a client component, we might need a wrapper.
        // Let's just set some defaults for now to match the screenshot.
        setUser({
          first_name: 'KHANATHIP',
          last_name: 'SASIBUT',
          email: 'DUNGKNATHIP@GMAIL.COM'
        });
        
        setFormData(prev => ({
          ...prev,
          firstName: 'Khanathip',
          lastName: 'Sasibut'
        }));
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

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

    fetchUser();
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving address:', formData);
    alert('บันทึกที่อยู่เรียบร้อยแล้ว');
    window.location.href = '/account';
  };

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <MainHeader />

      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-[10px] text-stone-500 uppercase tracking-widest mb-8">
          HOME / MY ACCOUNT
        </div>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar */}
          <AccountSidebar user={user} activePath="/account/addresses" />

          {/* Main Content */}
          <div className="flex-1">
            <h1 className="text-xl font-bold mb-10">เพิ่มที่อยู่ใหม่</h1>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {/* User Info Column */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-8">ข้อมูลผู้ใช้</h3>
                
                <div>
                  <label className="block text-[11px] font-bold text-stone-900 mb-2">ชื่อ *</label>
                  <input 
                    type="text" 
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full border border-stone-200 p-3 text-xs focus:outline-none focus:border-stone-900 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-900 mb-2">นามสกุล *</label>
                  <input 
                    type="text" 
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full border border-stone-200 p-3 text-xs focus:outline-none focus:border-stone-900 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-900 mb-2">หมายเลขโทรศัพท์ *</label>
                  <input 
                    type="text" 
                    placeholder="หมายเลขโทรศัพท์"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full border border-stone-200 p-3 text-xs focus:outline-none focus:border-stone-900 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-900 mb-2">บริษัท</label>
                  <input 
                    type="text" 
                    placeholder="บริษัท"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    className="w-full border border-stone-200 p-3 text-xs focus:outline-none focus:border-stone-900 transition-colors"
                  />
                </div>
              </div>

              {/* Address Column */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-8">ที่อยู่</h3>
                
                <div>
                  <label className="block text-[11px] font-bold text-stone-900 mb-2">ที่อยู่ *</label>
                  <input 
                    type="text" 
                    placeholder="ที่อยู่ LINE 1"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full border border-stone-200 p-3 text-xs focus:outline-none focus:border-stone-900 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-900 mb-2">ประเทศ *</label>
                  <div className="relative">
                    <select className="w-full border border-stone-200 p-3 text-xs focus:outline-none bg-white appearance-none transition-colors">
                      <option>ไทย</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-900 mb-2">จังหวัด *</label>
                  <div className="relative">
                    <select 
                      className="w-full border border-stone-200 p-3 text-xs focus:outline-none bg-white appearance-none transition-colors"
                      value={formData.provinceId}
                      onChange={handleProvinceChange}
                    >
                      <option value="0">กรุณาเลือกจังหวัด</option>
                      {thailandData.map(p => (
                        <option key={p.id} value={p.id}>{p.name_th}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-900 mb-2">เขต/อำเภอ *</label>
                  <div className="relative">
                    <select 
                      className="w-full border border-stone-200 p-3 text-xs focus:outline-none bg-white appearance-none transition-colors"
                      value={formData.districtId}
                      onChange={handleAmphureChange}
                      disabled={!formData.provinceId}
                    >
                      <option value="0">กรุณาเลือกอำเภอ</option>
                      {filteredAmphures.map(a => (
                        <option key={a.id} value={a.id}>{a.name_th}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-900 mb-2">แขวง/ตำบล *</label>
                  <div className="relative">
                    <select 
                      className="w-full border border-stone-200 p-3 text-xs focus:outline-none bg-white appearance-none transition-colors"
                      value={filteredTambons.find(t => t.name_th === formData.subDistrict)?.id || 0}
                      onChange={handleTambonChange}
                      disabled={!formData.districtId}
                    >
                      <option value="0">กรุณาเลือกตำบล</option>
                      {filteredTambons.map(t => (
                        <option key={t.id} value={t.id}>{t.name_th}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-900 mb-2">รหัสไปรษณีย์ *</label>
                  <input 
                    type="text" 
                    placeholder="รหัสไปรษณีย์"
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
                    <span className="text-[11px] font-bold text-stone-700">ใช้เป็นที่อยู่สำหรับการจัดส่ง</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={formData.isDefaultBilling}
                      onChange={(e) => setFormData({...formData, isDefaultBilling: e.target.checked})}
                      className="w-4 h-4 border-stone-300 rounded focus:ring-0 accent-stone-900" 
                    />
                    <span className="text-[11px] font-bold text-stone-700">ใช้เป็นที่อยู่สำหรับการออกใบเสร็จ</span>
                  </label>
                </div>
              </div>

              <div className="md:col-span-2 flex justify-center mt-10">
                <button 
                  type="submit"
                  className="bg-black text-white px-12 py-3 text-xs font-bold uppercase hover:bg-stone-800 transition-colors tracking-widest"
                >
                  บันทึกที่อยู่
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
