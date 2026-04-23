import sys

with open('src/App.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Modify ProfileView Отзывы button
btn_target = """         <button className="flex items-center justify-between p-5 border-b border-slate-100 hover:bg-slate-50 transition-colors transform active:bg-slate-100">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-[#f4f7fb] flex items-center justify-center text-[#0d6978]">
                   <span className="material-symbols-outlined text-[20px]">star</span>
               </div>
               <span className="font-extrabold text-slate-800 text-[15px]">Отзывы</span>
            </div>
            <span className="material-symbols-outlined text-[#647b97]">chevron_right</span>
         </button>"""
         
btn_replacement = btn_target.replace('<button className', '<button onClick={() => setTab(\'my_reviews\')} className')
text = text.replace(btn_target, btn_replacement)

# 2. Add MyReviewsView component before App
my_reviews_comp = """
function MyReviewsView({ setTab, gear }) {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyReviews = async () => {
      try {
        const user_id = window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || "test_user_123";
        const res = await fetch(`http://localhost:8000/api/reviews?user_id=${user_id}`);
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyReviews();
  }, []);

  return (
    <div className="pt-2 px-1 animate-slide-up pb-28">
      <div className="flex items-center gap-3 mb-6 w-full">
          <button onClick={() => setTab('profile')} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-700 hover:bg-slate-50 transition transform active:scale-90">
             <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <h1 className="text-3xl font-extrabold font-headline tracking-tight text-slate-900">Мои отзывы</h1>
      </div>

      {isLoading ? (
         <div className="text-center text-slate-400 mt-10 font-bold">Ожидайте, загружаем...</div>
      ) : reviews.length === 0 ? (
         <div className="bg-white rounded-[2rem] p-8 text-center text-slate-500 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-5xl opacity-30 mb-3 text-slate-400">star_rate</span>
            <p className="font-bold text-[15px]">Вы еще не писали отзывы.</p>
         </div>
      ) : (
         <div className="flex flex-col gap-4">
            {reviews.map(r => {
               const product = gear.find(g => g.id === r.item_id) || { name: 'Неизвестный товар', image_url: '' };
               return (
                 <div key={r.id} className="bg-white rounded-[2rem] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 relative">
                    <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-50">
                       <img src={product.image_url} alt={product.name} className="w-12 h-12 rounded-[14px] object-cover bg-slate-100" />
                       <div>
                          <h4 className="font-extrabold text-[14px] text-slate-900 leading-tight mb-1">{product.name}</h4>
                          <div className="text-[10px] text-[#647b97] font-bold uppercase tracking-widest">{new Date(r.created_at).toLocaleDateString('ru-RU')}</div>
                       </div>
                    </div>
                    <div>
                       <div className="flex items-center gap-1 mb-2">
                          {[1,2,3,4,5].map(star => (
                             <span key={star} className={`material-symbols-outlined text-[15px] ${star <= r.rating ? 'text-[#ffb300]' : 'text-slate-200'}`} style={{ fontVariationSettings: star <= r.rating ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                          ))}
                       </div>
                       <p className="text-[14px] text-slate-700 leading-relaxed font-medium">{r.text}</p>
                    </div>
                 </div>
               );
            })}
         </div>
      )}
    </div>
  );
}

"""

text = text.replace('export default function App() {', my_reviews_comp + 'export default function App() {')

# 3. Add to App rendering:
render_target = """        ) : activeTab === 'profile' ? (
          <ProfileView orders={orders} setTab={setActiveTab} />
        ) : null}"""

render_replacement = """        ) : activeTab === 'profile' ? (
          <ProfileView orders={orders} setTab={setActiveTab} />
        ) : activeTab === 'my_reviews' ? (
          <MyReviewsView setTab={setActiveTab} gear={gear.length > 0 ? gear : FALLBACK_GEAR} />
        ) : null}"""

text = text.replace(render_target, render_replacement)

with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Saved patch")
