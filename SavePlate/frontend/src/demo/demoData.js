const ORDERS_KEY = 'demo_orders';

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (_) {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getOrders() {
  return readJson(ORDERS_KEY, []);
}

export function saveOrders(orders) {
  writeJson(ORDERS_KEY, orders);
}

export function createOrder({ customerId, customerEmail, item, price }) {
  const orders = getOrders();
  const order = {
    id: crypto.randomUUID(),
    customerId,
    customerEmail,
    item,
    price,
    status: 'new',
    createdAt: Date.now(),
    paymentStatus: 'unpaid',
    paymentMethod: null,
    referenceId: null
  };
  orders.push(order);
  saveOrders(orders);
  return order;
}

export function listOrdersByCustomer(customerId) {
  return getOrders().filter(o => o.customerId === customerId);
}

export function listOrdersByStatus(status) {
  return getOrders().filter(o => o.status === status);
}

export function markOrderReady(orderId) {
  const orders = getOrders();
  const idx = orders.findIndex(o => o.id === orderId);
  if (idx === -1) return;
  orders[idx].status = 'ready_for_pickup';
  saveOrders(orders);
}

export function getOrderById(orderId) {
  return getOrders().find(o => o.id === orderId) || null;
}

export function markOrderPaid(orderId, method) {
  const orders = getOrders();
  const idx = orders.findIndex(o => o.id === orderId);
  if (idx === -1) return null;
  orders[idx].paymentStatus = 'paid';
  orders[idx].paymentMethod = method;
  orders[idx].referenceId = `PAY-${String(Math.floor(Math.random()*1e9)).padStart(9,'0')}`;
  saveOrders(orders);
  return orders[idx];
}


