const API_URL = "http://localhost:8080/spike";

const storage = {
  load(k, fb){
    try{
      const r = localStorage.getItem(k);
      return r ? JSON.parse(r) : fb;
    } catch(e){
      return fb;
    }
  },
  save(k, v){
    localStorage.setItem(k, JSON.stringify(v));
  }
};

let products = [];
let pedidos = storage.load('si_pedidos', []);
let notifications = storage.load('si_notifications', []);
let session = storage.load('si_session', null);
let cart = [];

const main = document.getElementById('content');
const messages = document.getElementById('messages');
const userArea = document.getElementById('userArea');
const mainNav = document.getElementById('mainNav');
const cartList = document.getElementById('cartList');

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

function showMessage(text, type='info', timeout=3000){
  messages.innerHTML = `<div class="card">${text}</div>`;
  if(timeout > 0){
    setTimeout(() => messages.innerHTML = '', timeout);
  }
}

function saveSession(){
  storage.save('si_session', session);
}

function saveLocalData(){
  storage.save('si_pedidos', pedidos);
  storage.save('si_notifications', notifications);
  storage.save('si_session', session);
}

async function cargarProductos(){
  try{
    const respuesta = await fetch(`${API_URL}/productos`);
    const data = await respuesta.json();

    products = data.map(p => ({
      id: p.id,
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio: Number(p.precio || 0),
      stock: Number(p.stock || 0),
      categoria: p.categoria || '',
      img: `https://picsum.photos/seed/${p.id}/300/200`
    }));

    if(currentView === 'catalog'){
      renderCatalog();
    }

  }catch(error){
    console.error("Error cargando productos:", error);
    showMessage("No se pudieron cargar los productos desde MySQL", "error");
  }
}

function setSession(user){
  session = {
    userId: user.id,
    role: user.role,
    email: user.email,
    name: user.name,
    last: user.last || ""
  };

  saveSession();
  renderUserArea();
}


function clearSession(){
  session = null;
  saveSession();
  renderUserArea();
}

function renderUserArea(){
  userArea.innerHTML = '';

  if(session){
    const span = document.createElement('div');
    span.className = 'small';
    span.textContent = `${session.name} (${session.role})`;

    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = 'Cerrar sesión';
    btn.addEventListener('click', () => {
      clearSession();
      navigateTo('home');
      showMessage('Sesión cerrada','ok');
    });

    
    if(session.role === "admin"){
  const adminBtn = document.createElement('button');
  adminBtn.className = 'btn secondary';
  adminBtn.textContent = 'Clientes Java';
  adminBtn.addEventListener('click', () => {
    window.location.href = 'ClienteServlet';
  });

  userArea.appendChild(adminBtn);
}
    userArea.appendChild(span);
    userArea.appendChild(btn);

  }else{
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = 'Entrar / Registrar';
    btn.addEventListener('click', () => {
      document.getElementById('authCard').scrollIntoView({behavior:'smooth'});
    });

    userArea.appendChild(btn);
  }
}

let currentView = 'home';

function setActiveNav(view){
  mainNav.querySelectorAll('button[data-view]').forEach(b => {
    b.setAttribute(
      'aria-current',
      b.getAttribute('data-view') === view ? 'true' : 'false'
    );
  });
}

function navigateTo(view){
  currentView = view;
  setActiveNav(view);
  renderView(view);
}

mainNav.querySelectorAll('button[data-view]').forEach(b => {
  b.addEventListener('click', e => {
    navigateTo(e.target.getAttribute('data-view'));
  });
});

function renderView(view){
  main.innerHTML = '';

  if(view === 'home') renderHome();
  else if(view === 'catalog') renderCatalog();
  else if(view === 'orders') renderPedidos();
  else if(view === 'notifications') renderNotifications();
  else main.innerHTML = '<div class="card"><h3>En construcción</h3></div>';
}

function renderHome(){
  const el = document.createElement('div');
  el.className = 'card';

  el.innerHTML = `
    <h3>Inicio</h3>
    <p class="small">
      Bienvenido al prototipo de Spike Investments.
      Usa el menú para navegar.
    </p>
  `;

  main.appendChild(el);
}

function renderCatalog(){
  main.innerHTML = '';

  const el = document.createElement('div');
  el.className = 'card';

  el.innerHTML = `
    <h3>Catálogo de productos</h3>
    <div id="catalogList" style="margin-top:12px"></div>
  `;

  main.appendChild(el);

  const list = document.getElementById('catalogList');

  if(products.length === 0){
    list.innerHTML = '<div class="small">No hay productos registrados en MySQL</div>';
    return;
  }

  products.forEach(p => {
    const div = document.createElement('div');
    div.className = 'product';

    div.innerHTML = `
      <img src="${p.img}" alt="${escapeHtml(p.nombre)}" />

      <div class="info">
        <div style="font-weight:800">${escapeHtml(p.nombre)}</div>
        <div class="small">${escapeHtml(p.descripcion)}</div>
        <div class="small">
          Stock: <strong>${p.stock}</strong> ·
          Precio: <strong>$${Number(p.precio).toFixed(2)}</strong>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">
        <div>
          <button class="btn" data-action="view" data-id="${p.id}">Ver</button>
        </div>

        <div style="display:flex;gap:8px">
          <input
            aria-label="cantidad"
            type="number"
            min="1"
            max="${Math.max(1,p.stock)}"
            value="1"
            id="qty_${p.id}"
            style="width:68px;padding:6px;border-radius:6px;border:1px solid #ccc"
          />
          <button class="btn secondary" data-action="add" data-id="${p.id}">
            Añadir
          </button>
        </div>
      </div>
    `;

    list.appendChild(div);
  });

  list.querySelectorAll('button[data-action="view"]').forEach(b => {
    b.addEventListener('click', e => {
      renderProductDetail(e.target.getAttribute('data-id'));
    });
  });

  list.querySelectorAll('button[data-action="add"]').forEach(b => {
    b.addEventListener('click', e => {
      const id = e.target.getAttribute('data-id');
      const qty = parseInt(document.getElementById('qty_' + id).value || 1);
      addToCart(id, qty);
    });
  });
}

let lastViewedProduct = null;

function renderProductDetail(id){
  const p = products.find(x => String(x.id) === String(id)) ||
            products.find(x => String(x.id) === String(lastViewedProduct));

  if(!p){
    showMessage('Producto no encontrado','error');
    navigateTo('catalog');
    return;
  }

  lastViewedProduct = p.id;
  main.innerHTML = '';

  const el = document.createElement('div');
  el.className = 'card';

  el.innerHTML = `
    <h3>${escapeHtml(p.nombre)}</h3>

    <div style="display:flex;gap:16px;flex-wrap:wrap">
      <img src="${p.img}" alt="${escapeHtml(p.nombre)}" style="width:320px;border-radius:8px;"/>

      <div style="flex:1">
        <div class="small">${escapeHtml(p.descripcion)}</div>

        <div style="margin-top:10px">
          <strong>Precio: $${Number(p.precio).toFixed(2)}</strong>
        </div>

        <div class="small" style="margin-top:6px">
          Stock: <strong>${p.stock}</strong>
        </div>

        <label style="margin-top:8px">Cantidad</label>
        <input id="detailQty" type="number" min="1" max="${Math.max(1,p.stock)}" value="1" />

        <div style="margin-top:10px;display:flex;gap:8px">
          <button class="btn" id="btnAddDetail">Añadir al carrito</button>
          <button class="btn secondary" id="btnBack">Volver</button>
        </div>
      </div>
    </div>
  `;

  main.appendChild(el);

  document.getElementById('btnBack').addEventListener('click', () => {
    navigateTo('catalog');
  });

  document.getElementById('btnAddDetail').addEventListener('click', () => {
    const qty = parseInt(document.getElementById('detailQty').value || 1);
    addToCart(p.id, qty);
  });
}

function addToCart(id, qty=1){
  const p = products.find(x => String(x.id) === String(id));

  if(!p){
    showMessage('Producto no existe','error');
    return;
  }

  if(p.stock < qty){
    showMessage('No hay suficiente stock','error');
    return;
  }

  const existing = cart.find(ci => String(ci.id) === String(id));

  if(existing){
    existing.qty += qty;
  }else{
    cart.push({
      id: p.id,
      nombre: p.nombre,
      precio: Number(p.precio),
      qty
    });
  }

  renderCart();
  showMessage('Producto añadido al carrito','ok');
}

function renderCart(){
  if(cart.length === 0){
    cartList.innerHTML = 'No hay productos en el carrito';
    return;
  }

  cartList.innerHTML = '';
  let total = 0;

  cart.forEach(ci => {
    const div = document.createElement('div');
    div.className = 'cart-item';

    div.innerHTML = `
      <div style="flex:1">
        <strong>${escapeHtml(ci.nombre)}</strong> ·
        ${ci.qty} x $${Number(ci.precio).toFixed(2)}
      </div>

      <div style="display:flex;gap:6px">
        <button class="btn small" data-action="remove" data-id="${ci.id}">
          Quitar
        </button>
      </div>
    `;

    cartList.appendChild(div);
    total += Number(ci.precio) * ci.qty;
  });

  const tot = document.createElement('div');
  tot.style.marginTop = '10px';
  tot.innerHTML = `<div style="text-align:right;font-weight:800">Total: $${total.toFixed(2)}</div>`;
  cartList.appendChild(tot);

  cartList.querySelectorAll('button[data-action="remove"]').forEach(b => {
    b.addEventListener('click', e => {
      cart = cart.filter(c => String(c.id) !== String(e.target.getAttribute('data-id')));
      renderCart();
    });
  });
}

document.getElementById('btnCheckout').addEventListener('click', () => {
  if(!session){
    showMessage('Debes iniciar sesión para comprar','error');
    return;
  }

  if(cart.length === 0){
    showMessage('Carrito vacío','error');
    return;
  }

  main.innerHTML = '';

  const el = document.createElement('div');
  el.className = 'card';

  el.innerHTML = `
    <h3>Comprar</h3>
    <div class="small">Verifica y confirma tu compra</div>
    <div id="checkoutItems" style="margin-top:10px"></div>

    <label>Dirección de envío</label>
    <input id="shipAddr" type="text" />

    <label>Método de pago</label>
    <select id="payMethod">
      <option value="card">Tarjeta</option>
      <option value="cash">Contra entrega</option>
    </select>

    <div style="margin-top:10px;display:flex;gap:8px">
      <button class="btn" id="confirmBuy">Confirmar compra</button>
      <button class="btn secondary" id="cancelBuy">Cancelar</button>
    </div>
  `;

  main.appendChild(el);

  const itemsDiv = document.getElementById('checkoutItems');
  let total = 0;

  cart.forEach(ci => {
    const subtotal = Number(ci.precio) * ci.qty;
    total += subtotal;

    itemsDiv.innerHTML += `
      <div style="display:flex;justify-content:space-between;padding:6px 0">
        ${escapeHtml(ci.nombre)} x${ci.qty}
        <strong>$${subtotal.toFixed(2)}</strong>
      </div>
    `;
  });

  itemsDiv.innerHTML += `
    <hr/>
    <div style="text-align:right;font-weight:800">
      Total: $${total.toFixed(2)}
    </div>
  `;

  document.getElementById('cancelBuy').addEventListener('click', () => {
    navigateTo('catalog');
  });

  document.getElementById('confirmBuy').addEventListener('click', () => {
    const addr = document.getElementById('shipAddr').value.trim();

    if(!addr){
      showMessage('Ingrese una dirección válida','error');
      return;
    }

    const pedido = {
      id: 'PED-' + Date.now(),
      userId: session.userId,
      email: session.email,
      items: [...cart],
      total,
      address: addr,
      status: 'pendiente',
      created: new Date().toISOString()
    };

    pedidos.push(pedido);

    notifications.unshift({
      id: 'NOT-' + Date.now(),
      userId: session.userId,
      message: `Compra ${pedido.id} registrada. Total: $${pedido.total.toFixed(2)}`,
      date: new Date().toISOString(),
      read: false
    });

    saveLocalData();

    cart = [];
    renderCart();

    showMessage('Tu compra se realizó con éxito','ok');
    navigateTo('orders');
  });
});

document.getElementById('btnClearCart').addEventListener('click', () => {
  cart = [];
  renderCart();
  showMessage('Carrito limpiado','ok');
});

function renderPedidos(){
  const el = document.createElement('div');
  el.className = 'card';

  el.innerHTML = `
    <h3>Pedidos</h3>
    <div class="small">Lista de pedidos registrados localmente</div>
    <div id="pedidosList" style="margin-top:10px"></div>
  `;

  main.appendChild(el);

  const list = document.getElementById('pedidosList');

  if(pedidos.length === 0){
    list.innerHTML = '<div class="small">No hay pedidos aún</div>';
    return;
  }

  list.innerHTML = pedidos.map(p => `
    <div style="padding:8px;border-bottom:1px solid #eee">
      <strong>${p.id}</strong> · ${escapeHtml(p.email || '')} ·
      $${Number(p.total).toFixed(2)} · ${escapeHtml(p.status)}
    </div>
  `).join('');
}

function renderNotifications(){
  const el = document.createElement('div');
  el.className = 'card';

  el.innerHTML = `
    <h3>Notificaciones</h3>
    <div class="small" id="notifList" style="margin-top:10px"></div>
  `;

  main.appendChild(el);

  const list = document.getElementById('notifList');

  if(notifications.length === 0){
    list.innerHTML = '<div class="small">No hay notificaciones</div>';
    return;
  }

  list.innerHTML = notifications.map(n => `
    <div style="padding:6px;border-bottom:1px solid #eee">
      ${escapeHtml(n.message)}
      <div class="small">${new Date(n.date).toLocaleString()}</div>
    </div>
  `).join('');
}

/* ---------- LOGIN ---------- */
document.getElementById('btnLogin').addEventListener('click', async () => {
  const email = document.getElementById('login-email').value.trim();
  const pass = document.getElementById('login-pass').value;

  if(!email || !pass){
    showMessage('Ingrese correo y contraseña','error');
    return;
  }

  try{
  const datos = new URLSearchParams();
datos.append("accion", "login");
datos.append("correo", email);
datos.append("password", pass);

const respuesta = await fetch(`${API_URL}/ClienteServlet`, {
  method: "POST",
  body: datos
});
     

    const data = await respuesta.json();

    if(!respuesta.ok){
      showMessage(data.error || "Credenciales inválidas", "error");
      return;
    }

    const user = {
      id: data.id,
      email: data.correo,
      role: data.rol,
      name: data.nombre,
      last: ""
    };

    setSession(user);
    showMessage('Sesión iniciada desde MySQL','ok');
    renderCart();
    navigateTo('home');

  }catch(error){
    console.error("Error iniciando sesión:", error);
    showMessage("Error de conexión con el servidor", "error");
  }
});

/* ---------- REGISTER ---------- */
document.getElementById('btnShowRegister').addEventListener('click', () => {
  loginForm.classList.add('hidden');
  registerForm.classList.remove('hidden');
});

document.getElementById('btnCancelRegister').addEventListener('click', () => {
  loginForm.classList.remove('hidden');
  registerForm.classList.add('hidden');
});

document.getElementById('btnRegister').addEventListener('click', async () => {
  const name = document.getElementById('reg-name').value.trim();
  const last = document.getElementById('reg-last').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const pass = document.getElementById('reg-pass').value;
  const dob = document.getElementById('reg-dob').value;

  if(!name || !last || !email || !pass || !dob){
    showMessage('Complete todos los campos','error');
    return;
  }

  const nombreCompleto = `${name} ${last}`;

  try{
   const datos = new URLSearchParams();
datos.append("nombre", nombreCompleto);
datos.append("correo", email);
datos.append("direccionEntrega", "Sin definir");
datos.append("password", pass);

const respuesta = await fetch(`${API_URL}/ClienteServlet`, {
  method: "POST",
  body: datos
});

    const data = await respuesta.json();

    if(!respuesta.ok){
      showMessage(data.error || "No se pudo crear la cuenta", "error");
      return;
    }

    showMessage("Cuenta creada correctamente en MySQL", "ok");
     document.getElementById('reg-name').value = "";
     document.getElementById('reg-last').value = "";
     document.getElementById('reg-email').value = "";
     document.getElementById('reg-pass').value = "";
     document.getElementById('reg-dob').value = "";

    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');

  }catch(error){
    console.error("Error registrando cliente:", error);
    showMessage("Error de conexión con el servidor", "error");
  }
});

function escapeHtml(s){
  return (s || '').toString().replace(/[&<>"']/g, m => ({
    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;',
    '"':'&quot;',
    "'":'&#39;'
  })[m]);
}

/* ---------- INICIO ---------- */
renderUserArea();
renderCart();
navigateTo('home');
cargarProductos();