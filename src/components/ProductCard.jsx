export default function ProductCard({ product, onAdd }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
      {product.image && (
        <img src={`${product.image}&auto=format&fit=crop&w=800&q=60`} alt={product.title} className="h-48 w-full object-cover" />
      )}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-slate-900 line-clamp-1">{product.title}</h3>
        <p className="text-slate-600 text-sm line-clamp-2 mb-3">{product.description}</p>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
          <button onClick={() => onAdd(product)} className="px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-sm">
            Add to cart
          </button>
        </div>
      </div>
    </div>
  )
}
