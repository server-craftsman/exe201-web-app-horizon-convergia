import React, { useEffect, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ROUTER_URL } from '@consts/router.path.const';

const PayosCallback: React.FC = () => {
    const location = useLocation();
    const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const orderCode = params.get('orderCode') || params.get('OrderCode');
    const status = params.get('status') || params.get('Status');

    useEffect(() => {
        // Cleanup transient checkout state
        sessionStorage.removeItem('checkout_meta');
    }, []);

    const ok = (status || '').toLowerCase() === 'success' || (status || '').toLowerCase() === 'paid';

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4 text-center">
                <h1 className="text-2xl md:text-3xl font-extrabold mb-4">Kết quả thanh toán</h1>
                <div className={`inline-block px-4 py-2 rounded-full text-white ${ok ? 'bg-emerald-600' : 'bg-red-600'}`}>
                    {ok ? 'Thanh toán thành công' : 'Thanh toán thất bại'}
                </div>
                <div className="mt-4 text-gray-600">Mã đơn hàng: <b>{orderCode || '—'}</b></div>
                <div className="mt-8">
                    <Link to={ROUTER_URL.BUYER.ORDER_HISTORY} className="text-amber-600 hover:text-amber-700 font-medium">Xem đơn hàng của tôi</Link>
                    <span className="mx-3">•</span>
                    <Link to={ROUTER_URL.COMMON.HOME} className="text-gray-600 hover:text-gray-800">Về trang chủ</Link>
                </div>
            </div>
        </section>
    );
};

export default PayosCallback; 