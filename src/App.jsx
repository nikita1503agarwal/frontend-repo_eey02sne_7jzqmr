import { useEffect, useMemo, useState } from 'react'
import Navbar from './components/Navbar'
import ProductCard from './components/ProductCard'
import CartDrawer from './components/CartDrawer'

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [cartOpen, setCartOpen] = useState(false)
  const [cart, setCart] = useState([])
  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError('')
        // Seed once if empty
        await fetch(`${backend}/seed`, { method: 'POST' }).catch(() => {})
        const res = await fetch(`${backend}/products`)
        if (!res.ok) throw new Error('Failed to load products')
        const data = await res.json()
        setProducts(data)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [backend])

  const cartCount = useMemo(() => cart.reduce((sum, i) => sum + i.quantity, 0), [cart])

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id)
      if (existing) {
        return prev.map((p) => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p)
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const updateQty = (id, qty) => {
    setCart((prev) => prev.map((p) => p.id === id ? { ...p, quantity: qty } : p))
  }

  const checkout = async ({ subtotal, tax, total }) => {
    try {
      const payload = {
        items: cart.map(({ id, title, price, quantity, image }) => ({ product_id: id, title, price, quantity })),
        shipping: {
          name: 'Guest',
          email: 'guest@example.com',
          address: 'N/A',
          city: 'N/A',
          country: 'N/A',
          postal_code: '00000'
        },
        subtotal, tax, total
      }
      const res = await fetch(`${backend}/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error('Checkout failed')
      const data = await res.json()
      alert(`Order placed! Total: $${data.total}`)
      setCart([])
      setCartOpen(false)
    } catch (e) {
      alert(e.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar cartCount={cartCount} onCartClick={() => setCartOpen(true)} />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Featured Products</h1>
        {loading && <p className="text-slate-600">Loading products...</p>}
        {error && <p className="text-red-600">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={addToCart} />
          ))}
        </div>
      </main>
      <CartDrawer open={cartOpen} items={cart} onClose={() => setCartOpen(false)} onCheckout={checkout} onUpdateQty={updateQty} />
    </div>
  )
}

export default App
