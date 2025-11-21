import { X } from "lucide-react";

export default function CartDrawer({ open, items, onClose, onCheckout, onUpdateQty }) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = +(subtotal * 0.1).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);

  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`}>
      <div className={`absolute inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      <aside className={`absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-xl transform transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 space-y-4 h-[calc(100%-200px)] overflow-y-auto">
          {items.length === 0 ? (
            <p className="text-slate-600">Your cart is empty.</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 items-center">
                {item.image && (
                  <img src={`${item.image}&auto=format&fit=crop&w=200&q=60`} alt={item.title} className="w-16 h-16 rounded object-cover" />
                )}
                <div className="flex-1">
                  <p className="font-medium line-clamp-1">{item.title}</p>
                  <p className="text-sm text-slate-600">${item.price.toFixed(2)}</p>
                  <div className="mt-2 inline-flex items-center border rounded-md overflow-hidden">
                    <button className="px-2 py-1 text-slate-700 hover:bg-slate-100" onClick={() => onUpdateQty(item.id, Math.max(1, item.quantity - 1))}>-</button>
                    <span className="px-3 py-1">{item.quantity}</span>
                    <button className="px-2 py-1 text-slate-700 hover:bg-slate-100" onClick={() => onUpdateQty(item.id, item.quantity + 1)}>+</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="p-4 border-t space-y-2">
          <div className="flex justify-between text-sm"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between text-sm"><span>Tax (10%)</span><span>${tax.toFixed(2)}</span></div>
          <div className="flex justify-between font-semibold text-lg"><span>Total</span><span>${total.toFixed(2)}</span></div>
          <button onClick={() => onCheckout({ subtotal, tax, total })} disabled={items.length === 0} className="w-full mt-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-2 rounded-md">
            Checkout
          </button>
        </div>
      </aside>
    </div>
  );
}
