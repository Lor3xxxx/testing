import sys

with open('src/App.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add ReviewFormModal component before BookingsView
review_modal_code = """
function ReviewFormModal({ order, onClose, onSubmit }) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const user_id = window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || "test_user_123";
      await fetch('http://localhost:8000/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_id: order.item_id,
          user_id: user_id,
          rating: rating,
          text: text
        })
      });
      onSubmit();
    } catch (e) {
      console.error(e);
      alert('Ошибка при отправке отзыва');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-4">
       <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-fade-in" onClick={onClose}></div>
       <div className="bg-white w-full max-w-sm rounded-[2rem] p-6 relative z-10 animate-slide-up shadow-2xl">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-[20px] font-extrabold text-slate-900">Оцените аренду</h3>
             <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex justify-center items-center text-slate-500 hover:bg-slate-200">
                <span className="material-symbols-outlined text-[18px]">close</span>
             </button>
          </div>
          <div className="flex justify-center gap-2 mb-6">
             {[1, 2, 3, 4, 5].map(star => (
                <button key={star} onClick={() => setRating(star)} className="focus:outline-none transform transition active:scale-90">
                   <span className={`material-symbols-outlined text-[40px] ${star <= rating ? 'text-[#ffb300]' : 'text-slate-200'}`} style={{ fontVariationSettings: star <= rating ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                </button>
             ))}
          </div>
          <textarea 
             value={text}
             onChange={e => setText(e.target.value)}
             placeholder="Что вам понравилось, а что стоит улучшить?"
             className="w-full bg-[#f4f7fb] border border-slate-100 rounded-2xl p-4 text-[15px] font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0d6978]/30 resize-none h-32 mb-6"
          />
          <button onClick={handleSubmit} disabled={isSubmitting || text.trim() === ''} className="w-full bg-[#0d6978] text-white py-4 rounded-2xl font-bold hover:bg-[#0a5360] transition disabled:opacity-50 disabled:cursor-not-allowed text-[15px]">
             {isSubmitting ? 'Отправка...' : 'Отправить отзыв'}
          </button>
       </div>
    </div>
  );
}

"""

text = text.replace('function BookingsView(', review_modal_code + 'function BookingsView(')

# 2. Modify BookingsView 
bookings_view_start = text.find('function BookingsView({')
bookings_view_end = text.find('function formatDatePill(', bookings_view_start)

bv_code = text[bookings_view_start:bookings_view_end]
bv_code = bv_code.replace('function BookingsView({ orders, isLoading, filter, setFilter, gearList, fallbackGear }) {', 
                          'function BookingsView({ orders, isLoading, filter, setFilter, gearList, fallbackGear }) {\\n  const [reviewOrder, setReviewOrder] = useState(null);')

btn_injection = """                       {order.status === 'active' ? (
                          <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[11px] font-extrabold uppercase tracking-wider">Активен</div>
                       ) : (
                          <div className="px-3 py-1 rounded-full bg-slate-500/10 text-slate-500 border border-slate-500/20 text-[11px] font-extrabold uppercase tracking-wider">Завершен</div>
                       )}
                    </div>
                    {order.status === 'completed' && (
                        <button onClick={() => setReviewOrder(order)} className="w-full py-2.5 mt-1 bg-[#f4f7fb] hover:bg-[#e4ebf5] text-[#5578a1] font-bold rounded-xl text-[13px] border border-[#e4ebf5] transition-colors">
                            Оставить отзыв
                        </button>
                    )}"""
bv_code = bv_code.replace("""                       {order.status === 'active' ? (
                          <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[11px] font-extrabold uppercase tracking-wider">Активен</div>
                       ) : (
                          <div className="px-3 py-1 rounded-full bg-slate-500/10 text-slate-500 border border-slate-500/20 text-[11px] font-extrabold uppercase tracking-wider">Завершен</div>
                       )}
                    </div>""", btn_injection)

bv_code = bv_code.replace('    </div>\\n  )', '      {reviewOrder && <ReviewFormModal order={reviewOrder} onClose={() => setReviewOrder(null)} onSubmit={() => { setReviewOrder(null); alert("Ваш отзыв успешно сохранен!"); }} />}\\n    </div>\\n  )')

text = text[:bookings_view_start] + bv_code + text[bookings_view_end:]

# 3. Modify ProductPage
product_page_start = text.find('function ProductPage({')
product_page_end = text.find('function ProfileView({', product_page_start)

pp_code = text[product_page_start:product_page_end]
pp_code = pp_code.replace("const [activeModal, setActiveModal] = useState(null); // 'weight' | 'length'",
                          "const [activeModal, setActiveModal] = useState(null);\\n  const [reviews, setReviews] = useState([]);\\n  useEffect(() => {\\n    fetch(`http://localhost:8000/api/reviews?item_id=${product.id}`).then(r => r.json()).then(d => setReviews(d)).catch(e => console.error(e));\\n  }, [product.id]);")

reviews_ui = """
        {/* Reviews Section */}
        <div className="mt-8 mb-4 border-t border-slate-100 pt-8">
           <div className="flex items-center justify-between mb-6">
              <h2 className="text-[20px] font-extrabold text-slate-900">Отзывы <span className="text-slate-400 text-[16px] font-bold">({reviews.length})</span></h2>
              <div className="flex items-center gap-1">
                 <span className="material-symbols-outlined text-[16px] text-[#ffb300]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                 <span className="font-bold text-slate-700 text-[14px]">{(reviews.length > 0 ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length) : product.rating).toFixed(1)}</span>
              </div>
           </div>
           
           {reviews.length === 0 ? (
              <div className="text-center bg-[#f5f6f8] rounded-3xl p-6">
                 <span className="material-symbols-outlined text-[32px] text-slate-300 mb-2">forum</span>
                 <p className="text-slate-500 text-[14px] font-medium">Для этого товара пока нет отзывов.<br/>Будьте первыми!</p>
              </div>
           ) : (
              <div className="flex flex-col gap-4">
                 {reviews.map(r => (
                   <div key={r.id} className="bg-[#f5f6f8] rounded-[1.5rem] p-5">
                      <div className="flex items-center justify-between mb-3">
                         <div className="flex items-center gap-1">
                            {[1,2,3,4,5].map(star => (
                               <span key={star} className={`material-symbols-outlined text-[14px] ${star <= r.rating ? 'text-[#ffb300]' : 'text-slate-300'}`} style={{ fontVariationSettings: star <= r.rating ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                            ))}
                         </div>
                         <div className="text-[10px] text-[#647b97] font-bold uppercase tracking-widest text-right">
                            {new Date(r.created_at).toLocaleDateString('ru-RU')}
                         </div>
                      </div>
                      <p className="text-[14px] text-slate-700 leading-relaxed font-medium">{r.text}</p>
                   </div>
                 ))}
              </div>
           )}
        </div>
"""

pp_code = pp_code.replace("        </div>\\n\\n      </div>", "        </div>\\n" + reviews_ui + "      </div>")

text = text[:product_page_start] + pp_code + text[product_page_end:]

with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Success')
