import { useEffect, useMemo, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function ProductCard({ item }) {
  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition p-4 flex flex-col">
      <div className="aspect-[4/5] w-full bg-gray-100 rounded-lg overflow-hidden mb-3">
        {item.images?.length ? (
          <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
        )}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 line-clamp-2">{item.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mt-1">{item.description}</p>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-pink-600 font-bold">PKR {Number(item.price).toLocaleString()}</span>
        <button className="text-sm bg-pink-600 text-white px-3 py-1.5 rounded-md hover:bg-pink-700">Add to cart</button>
      </div>
      <div className="mt-2 text-xs text-gray-500">{item.category} • {item.sizes?.join(', ')}</div>
    </div>
  )
}

function Filters({ filters, setFilters }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <input className="border rounded-md px-3 py-2" placeholder="Search lawn, kurti, abaya..." value={filters.q} onChange={(e)=>setFilters(f=>({...f,q:e.target.value}))} />
      <select className="border rounded-md px-3 py-2" value={filters.category} onChange={(e)=>setFilters(f=>({...f,category:e.target.value}))}>
        <option value="">All Categories</option>
        <option>Lawn</option>
        <option>Pret</option>
        <option>Abaya</option>
        <option>Kurti</option>
        <option>Formal</option>
      </select>
      <select className="border rounded-md px-3 py-2" value={filters.size} onChange={(e)=>setFilters(f=>({...f,size:e.target.value}))}>
        <option value="">All Sizes</option>
        <option>XS</option>
        <option>S</option>
        <option>M</option>
        <option>L</option>
        <option>XL</option>
        <option>Free</option>
      </select>
      <select className="border rounded-md px-3 py-2" value={filters.city} onChange={(e)=>setFilters(f=>({...f,city:e.target.value}))}>
        <option>Karachi</option>
        <option>Lahore</option>
        <option>Islamabad</option>
      </select>
    </div>
  )
}

function App() {
  const [filters, setFilters] = useState({ q:'', category:'', size:'', city:'Karachi' })
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  const query = useMemo(()=>{
    const params = new URLSearchParams()
    if(filters.q) params.set('q', filters.q)
    if(filters.category) params.set('category', filters.category)
    if(filters.size) params.set('size', filters.size)
    if(filters.city) params.set('city', filters.city)
    return params.toString()
  }, [filters])

  useEffect(()=>{
    const fetchData = async ()=>{
      setLoading(true)
      try {
        const res = await fetch(`${API_BASE}/api/products?${query}`)
        const data = await res.json()
        setItems(data.items || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  },[query])

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold">KW</div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Karachi Wear</h1>
              <p className="text-xs text-gray-500">Pakistani women's fashion</p>
            </div>
          </div>
          <nav className="hidden md:flex gap-6 text-sm text-gray-600">
            <a className="hover:text-gray-900" href="#">New Arrivals</a>
            <a className="hover:text-gray-900" href="#">Lawn</a>
            <a className="hover:text-gray-900" href="#">Pret</a>
            <a className="hover:text-gray-900" href="#">Abayas</a>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">Shop Karachi Collections</h2>
          <Filters filters={filters} setFilters={setFilters} />
        </section>

        {loading ? (
          <div className="py-16 text-center text-gray-500">Loading products…</div>
        ) : (
          items.length ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((item)=> (
                <ProductCard key={item._id} item={item} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-gray-500">No products found.</div>
          )
        )}
      </main>

      <footer className="border-t bg-white/70">
        <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-gray-600 flex flex-col md:flex-row items-center justify-between gap-3">
          <div>© {new Date().getFullYear()} Karachi Wear. All rights reserved.</div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-900">Contact</a>
            <a href="#" className="hover:text-gray-900">Shipping in Karachi</a>
            <a href="#" className="hover:text-gray-900">Returns</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
