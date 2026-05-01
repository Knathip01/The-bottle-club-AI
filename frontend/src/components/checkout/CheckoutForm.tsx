'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import type { CartItem } from '@/lib/cart';
import { readCart, subscribeCart } from '@/lib/cart';
import { User, MapPin, ChevronDown } from 'lucide-react';

interface CheckoutFormProps {
  user: any;
}

export default function CheckoutForm({ user }: CheckoutFormProps) {
  const [formData, setFormData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    country: 'ไทย',
    province: '',
    provinceId: 0,
    district: '',
    districtId: 0,
    subDistrict: '',
    zipcode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const orderItems = useSyncExternalStore(subscribeCart, readCart, () => [] as CartItem[]);

  // Thailand Address States
  const [thailandData, setThailandData] = useState<any[]>([]);
  const [filteredAmphures, setFilteredAmphures] = useState<any[]>([]);
  const [filteredTambons, setFilteredTambons] = useState<any[]>([]);

  useEffect(() => {
    const fetchThailandData = async () => {
      try {
        const response = await fetch('https://raw.githubusercontent.com/kongvut/thai-province-data/refs/heads/master/api/latest/province_with_district_and_sub_district.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setThailandData(data);
      } catch (error) {
        console.error('Failed to fetch Thailand address data:', error);
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

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.07);
  const total = subtotal;
  const points = Math.floor(subtotal / 10);
  const priceBeforeTax = subtotal - tax;

  const handleCheckout = async () => {
    if (orderItems.length === 0) {
      alert('ตะกร้าสินค้าว่างเปล่า');
      return;
    }

    if (!formData.province || !formData.district || !formData.subDistrict) {
      alert('กรุณากรอกที่อยู่จัดส่งให้ครบถ้วน');
      return;
    }

    setIsSubmitting(true);
    try {
      // 0. Filter out any invalid items from orderItems (e.g. products with no price)
      const validItems = orderItems.filter(item => item.price > 0 && item.id);
      if (validItems.length === 0) {
        alert('สินค้าในตะกร้าไม่ถูกต้อง (กรุณาลองเลือกสินค้าใหม่อีกครั้ง)');
        setIsSubmitting(false);
        return;
      }

      // 1. Save address first to get a valid address_id
      console.log('Saving address...');
      const addressResponse = await fetch('/api/proxy/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: Number(user?.id || 1),
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone || '0000000000',
          address_line: formData.address || 'Default Address',
          country: formData.country,
          province: formData.province,
          district: formData.district,
          subdistrict: formData.subDistrict,
          postal_code: formData.zipcode,
          is_default_shipping: true,
          is_default_billing: true
        })
      });

      if (!addressResponse.ok) {
        const addrErrorText = await addressResponse.text();
        console.error('Address save failed:', addrErrorText);
        throw new Error(`บันทึกที่อยู่ไม่สำเร็จ: ${addrErrorText}`);
      }

      const addressData = await addressResponse.json();
      const addressId = addressData.id;
      console.log('Address saved successfully, ID:', addressId);

      // 2. Create order using the new addressId
      console.log('Creating order with items:', validItems);
      const response = await fetch('/api/proxy/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: Number(user?.id || 1),
          address_id: addressId,
          payment_method: paymentMethod,
          items: validItems.map(item => ({
            product_id: Number(item.id),
            quantity: Number(item.quantity),
            price: Number(item.price)
          }))
        })
      });

      if (!response.ok) {
        const orderErrorText = await response.text();
        console.error('Order creation failed:', orderErrorText);
        throw new Error(`สร้างคำสั่งซื้อไม่สำเร็จ: ${orderErrorText}`);
      }

      localStorage.removeItem('cart');
      alert('สั่งซื้อสินค้าสำเร็จ!');
      window.location.href = '/account/orders';
    } catch (error) {
      console.error('Checkout error:', error);
      alert('เกิดข้อผิดพลาดในการสั่งซื้อสินค้า กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Column 1: Shipping Address */}
      <div className="flex-1 border border-stone-100 p-6">
        <h2 className="text-lg font-bold mb-8 uppercase tracking-wide">ที่อยู่จัดส่ง</h2>
        
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-stone-900 text-white rounded-full p-1"><User size={14} /></div>
            <h3 className="text-sm font-bold uppercase tracking-tight">ข้อมูลส่วนบุคคล</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-stone-900 mb-1.5">ชื่อ *</label>
              <input 
                type="text" 
                value={formData.firstName}
                className="w-full border border-stone-300 p-2.5 text-xs focus:outline-none"
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-stone-900 mb-1.5">นามสกุล *</label>
              <input 
                type="text" 
                value={formData.lastName}
                className="w-full border border-stone-300 p-2.5 text-xs focus:outline-none"
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-stone-900 mb-1.5">หมายเลขโทรศัพท์ *</label>
              <input 
                type="text" 
                placeholder="หมายเลขโทรศัพท์"
                value={formData.phone}
                className="w-full border border-stone-300 p-2.5 text-xs focus:outline-none"
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-stone-900 text-white rounded-full p-1"><MapPin size={14} /></div>
            <h3 className="text-sm font-bold uppercase tracking-tight">ที่อยู่จัดส่ง</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-stone-900 mb-1.5">ที่อยู่ *</label>
              <input 
                type="text" 
                placeholder="ที่อยู่ LINE 1"
                value={formData.address}
                className="w-full border border-stone-300 p-2.5 text-xs focus:outline-none"
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-stone-900 mb-1.5">ประเทศ *</label>
              <select className="w-full border border-stone-300 p-2.5 text-xs focus:outline-none bg-white appearance-none">
                <option>ไทย</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-stone-900 mb-1.5">จังหวัด *</label>
              <div className="relative">
                <select 
                  className="w-full border border-stone-300 p-2.5 text-xs focus:outline-none bg-white appearance-none"
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
              <label className="block text-[11px] font-bold text-stone-900 mb-1.5">เขต/อำเภอ *</label>
              <div className="relative">
                <select 
                  className="w-full border border-stone-300 p-2.5 text-xs focus:outline-none bg-white appearance-none"
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
              <label className="block text-[11px] font-bold text-stone-900 mb-1.5">แขวง/ตำบล *</label>
              <div className="relative">
                <select 
                  className="w-full border border-stone-300 p-2.5 text-xs focus:outline-none bg-white appearance-none"
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
              <label className="block text-[11px] font-bold text-stone-900 mb-1.5">รหัสไปรษณีย์ *</label>
              <input 
                type="text" 
                placeholder="รหัสไปรษณีย์"
                value={formData.zipcode}
                readOnly
                className="w-full border border-stone-300 p-2.5 text-xs bg-stone-50 focus:outline-none"
              />
            </div>
          </div>
          
          <div className="mt-6 space-y-3">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" defaultChecked className="w-4 h-4 border-stone-300 rounded focus:ring-0 accent-stone-900" />
              <span className="text-[11px] text-stone-600">ใช้ที่อยู่ในใบกำกับภาษีเหมือนกับที่อยู่ในการจัดส่ง</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 border-stone-300 rounded focus:ring-0 accent-stone-900" />
              <span className="text-[11px] text-stone-600">ต้องการใบกำกับภาษีเต็มรูปแบบ</span>
            </label>
          </div>
        </section>
      </div>

      {/* Column 2: Shipping & Payment Methods */}
      <div className="flex-1 flex flex-col gap-8">
        {/* Shipping Method */}
        <div className="border border-stone-100 p-6">
          <h3 className="text-sm font-bold uppercase tracking-tight mb-6">ช่องทางการจัดส่ง</h3>
          <p className="text-[11px] text-stone-400 uppercase leading-relaxed">
            Sorry, no quotes are available for this order at this time
          </p>
        </div>

        {/* Payment Method */}
        <div className="border border-stone-100 p-6">
          <h3 className="text-sm font-bold uppercase tracking-tight mb-6">ช่องทางการชำระเงิน</h3>
          
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="radio" 
                name="payment" 
                checked={paymentMethod === 'credit_card'}
                onChange={() => setPaymentMethod('credit_card')}
                className="w-4 h-4 border-stone-300 focus:ring-0 accent-stone-900" 
              />
              <span className="text-[11px] font-bold uppercase text-stone-600 group-hover:text-stone-900 transition-colors">Credit Card / Debit Card</span>
            </label>
            
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="radio" 
                name="payment" 
                checked={paymentMethod === 'promptpay'}
                onChange={() => setPaymentMethod('promptpay')}
                className="w-4 h-4 border-stone-300 focus:ring-0 accent-stone-900" 
              />
              <span className="text-[11px] font-bold uppercase text-stone-600 group-hover:text-stone-900 transition-colors">ชำระเงินผ่านพร้อมเพย์ (QR PromptPay)</span>
            </label>
            
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="radio" 
                name="payment" 
                checked={paymentMethod === 'wallet'}
                onChange={() => setPaymentMethod('wallet')}
                className="w-4 h-4 border-stone-300 focus:ring-0 accent-stone-900" 
              />
              <div className="flex flex-col">
                <span className="text-[11px] font-bold uppercase text-stone-600 group-hover:text-stone-900 transition-colors">Wallet Payment : Alipay, WeChat Pay,</span>
                <span className="text-[11px] font-bold uppercase text-stone-600 group-hover:text-stone-900 transition-colors">Line Pay, ShopeePay, True Wallet</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Column 3: Order Summary */}
      <div className="w-full lg:w-[350px]">
        <div className="bg-[#f5f5f5] border border-stone-100">
          <div className="p-6">
            <h3 className="text-sm font-bold uppercase tracking-tight mb-6">รายการสินค้าของคุณ</h3>
            <div className="flex justify-between items-center text-xs font-bold mb-4">
              <span className="uppercase">{orderItems.length} รายการสั่งซื้อ</span>
              <ChevronDown size={14} />
            </div>
            
            <div className="space-y-6 mb-8">
              {orderItems.map((item, idx) => (
                <div key={idx} className="text-xs">
                  <p className="font-bold text-stone-800 mb-1 leading-tight">{item.name}</p>
                      <div className="flex justify-between items-center text-stone-500 font-medium">
                        <span>QTY: {item.quantity}</span>
                        <span className="text-stone-900 font-bold">฿{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-6 border-t border-stone-200">
              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-500 font-medium uppercase">ราคาสินค้า</span>
                <span className="font-bold">฿{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-500 font-medium uppercase">คุณได้รับ</span>
                <span className="text-stone-800 font-bold">{points} POINTS</span>
              </div>
              <div className="flex justify-between items-center text-xs bg-stone-200/50 p-2 -mx-2">
                <span className="text-stone-500 font-medium uppercase">ราคาสินค้าก่อนรวมภาษี</span>
                <span className="font-bold">฿{priceBeforeTax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-500 font-medium uppercase">Shipping Fee</span>
                <span className="text-[10px] font-bold uppercase">Not yet calculated</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-500 font-medium uppercase">ภาษี</span>
                <span className="font-bold">฿{tax.toLocaleString()}</span>
              </div>
              <div className="pt-4 border-t border-stone-200 flex justify-between items-center">
                <span className="text-xs font-bold uppercase">ราคาสินค้าหลังรวมภาษี</span>
                <span className="text-lg font-bold">฿{total.toLocaleString()}</span>
              </div>
            </div>
            
            <button 
              onClick={handleCheckout}
              disabled={isSubmitting || orderItems.length === 0}
              className={`w-full bg-[#a11a1a] text-white py-4 mt-8 text-sm font-bold uppercase hover:bg-red-800 transition-colors ${
                (isSubmitting || orderItems.length === 0) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'กำลังดำเนินการ...' : 'สั่งซื้อสินค้า'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
