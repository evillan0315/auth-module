const Xe = (e, t) => e === t, oe = Symbol("solid-proxy"), Ge = typeof Proxy == "function", X = {
  equals: Xe
};
let Ye = Oe;
const j = 1, G = 2, be = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
};
var g = null;
let te = null, Je = null, y = null, x = null, U = null, Q = 0;
function ve(e, t) {
  const n = y, r = g, s = e.length === 0, i = t === void 0 ? r : t, l = s ? be : {
    owned: null,
    cleanups: null,
    context: i ? i.context : null,
    owner: i
  }, o = s ? e : () => e(() => L(() => K(l)));
  g = l, y = null;
  try {
    return O(o, !0);
  } finally {
    y = n, g = r;
  }
}
function $(e, t) {
  t = t ? Object.assign({}, X, t) : X;
  const n = {
    value: e,
    observers: null,
    observerSlots: null,
    comparator: t.equals || void 0
  }, r = (s) => (typeof s == "function" && (s = s(n.value)), Re(n, s));
  return [Ee.bind(n), r];
}
function W(e, t, n) {
  const r = Ce(e, t, !1, j);
  Z(r);
}
function P(e, t, n) {
  n = n ? Object.assign({}, X, n) : X;
  const r = Ce(e, t, !0, 0);
  return r.observers = null, r.observerSlots = null, r.comparator = n.equals || void 0, Z(r), Ee.bind(r);
}
function Qe(e) {
  return O(e, !1);
}
function L(e) {
  if (y === null) return e();
  const t = y;
  y = null;
  try {
    return e();
  } finally {
    y = t;
  }
}
function ue(e, t, n) {
  const r = Array.isArray(e);
  let s, i = n && n.defer;
  return (l) => {
    let o;
    if (r) {
      o = Array(e.length);
      for (let u = 0; u < e.length; u++) o[u] = e[u]();
    } else o = e();
    if (i)
      return i = !1, l;
    const a = L(() => t(o, s, l));
    return s = o, a;
  };
}
function Ae(e) {
  return g === null || (g.cleanups === null ? g.cleanups = [e] : g.cleanups.push(e)), e;
}
function Se() {
  return g;
}
function Pe(e, t) {
  const n = g, r = y;
  g = e, y = null;
  try {
    return O(t, !0);
  } catch (s) {
    fe(s);
  } finally {
    g = n, y = r;
  }
}
function Ze(e) {
  const t = y, n = g;
  return Promise.resolve().then(() => {
    y = t, g = n;
    let r;
    return O(e, !1), y = g = null, r ? r.done : void 0;
  });
}
const [Vt, Ht] = /* @__PURE__ */ $(!1);
function xe(e, t) {
  const n = Symbol("context");
  return {
    id: n,
    Provider: rt(n),
    defaultValue: e
  };
}
function ze(e) {
  let t;
  return g && g.context && (t = g.context[e.id]) !== void 0 ? t : e.defaultValue;
}
function ce(e) {
  const t = P(e), n = P(() => ie(t()));
  return n.toArray = () => {
    const r = n();
    return Array.isArray(r) ? r : r != null ? [r] : [];
  }, n;
}
function Ee() {
  if (this.sources && this.state)
    if (this.state === j) Z(this);
    else {
      const e = x;
      x = null, O(() => Y(this), !1), x = e;
    }
  if (y) {
    const e = this.observers ? this.observers.length : 0;
    y.sources ? (y.sources.push(this), y.sourceSlots.push(e)) : (y.sources = [this], y.sourceSlots = [e]), this.observers ? (this.observers.push(y), this.observerSlots.push(y.sources.length - 1)) : (this.observers = [y], this.observerSlots = [y.sources.length - 1]);
  }
  return this.value;
}
function Re(e, t, n) {
  let r = e.value;
  return (!e.comparator || !e.comparator(r, t)) && (e.value = t, e.observers && e.observers.length && O(() => {
    for (let s = 0; s < e.observers.length; s += 1) {
      const i = e.observers[s], l = te && te.running;
      l && te.disposed.has(i), (l ? !i.tState : !i.state) && (i.pure ? x.push(i) : U.push(i), i.observers && Te(i)), l || (i.state = j);
    }
    if (x.length > 1e6)
      throw x = [], new Error();
  }, !1)), t;
}
function Z(e) {
  if (!e.fn) return;
  K(e);
  const t = Q;
  et(e, e.value, t);
}
function et(e, t, n) {
  let r;
  const s = g, i = y;
  y = g = e;
  try {
    r = e.fn(t);
  } catch (l) {
    return e.pure && (e.state = j, e.owned && e.owned.forEach(K), e.owned = null), e.updatedAt = n + 1, fe(l);
  } finally {
    y = i, g = s;
  }
  (!e.updatedAt || e.updatedAt <= n) && (e.updatedAt != null && "observers" in e ? Re(e, r) : e.value = r, e.updatedAt = n);
}
function Ce(e, t, n, r = j, s) {
  const i = {
    fn: e,
    state: r,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: t,
    owner: g,
    context: g ? g.context : null,
    pure: n
  };
  return g === null || g !== be && (g.owned ? g.owned.push(i) : g.owned = [i]), i;
}
function Le(e) {
  if (e.state === 0) return;
  if (e.state === G) return Y(e);
  if (e.suspense && L(e.suspense.inFallback)) return e.suspense.effects.push(e);
  const t = [e];
  for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < Q); )
    e.state && t.push(e);
  for (let n = t.length - 1; n >= 0; n--)
    if (e = t[n], e.state === j)
      Z(e);
    else if (e.state === G) {
      const r = x;
      x = null, O(() => Y(e, t[0]), !1), x = r;
    }
}
function O(e, t) {
  if (x) return e();
  let n = !1;
  t || (x = []), U ? n = !0 : U = [], Q++;
  try {
    const r = e();
    return tt(n), r;
  } catch (r) {
    n || (U = null), x = null, fe(r);
  }
}
function tt(e) {
  if (x && (Oe(x), x = null), e) return;
  const t = U;
  U = null, t.length && O(() => Ye(t), !1);
}
function Oe(e) {
  for (let t = 0; t < e.length; t++) Le(e[t]);
}
function Y(e, t) {
  e.state = 0;
  for (let n = 0; n < e.sources.length; n += 1) {
    const r = e.sources[n];
    if (r.sources) {
      const s = r.state;
      s === j ? r !== t && (!r.updatedAt || r.updatedAt < Q) && Le(r) : s === G && Y(r, t);
    }
  }
}
function Te(e) {
  for (let t = 0; t < e.observers.length; t += 1) {
    const n = e.observers[t];
    n.state || (n.state = G, n.pure ? x.push(n) : U.push(n), n.observers && Te(n));
  }
}
function K(e) {
  let t;
  if (e.sources)
    for (; e.sources.length; ) {
      const n = e.sources.pop(), r = e.sourceSlots.pop(), s = n.observers;
      if (s && s.length) {
        const i = s.pop(), l = n.observerSlots.pop();
        r < s.length && (i.sourceSlots[l] = r, s[r] = i, n.observerSlots[r] = l);
      }
    }
  if (e.tOwned) {
    for (t = e.tOwned.length - 1; t >= 0; t--) K(e.tOwned[t]);
    delete e.tOwned;
  }
  if (e.owned) {
    for (t = e.owned.length - 1; t >= 0; t--) K(e.owned[t]);
    e.owned = null;
  }
  if (e.cleanups) {
    for (t = e.cleanups.length - 1; t >= 0; t--) e.cleanups[t]();
    e.cleanups = null;
  }
  e.state = 0;
}
function nt(e) {
  return e instanceof Error ? e : new Error(typeof e == "string" ? e : "Unknown error", {
    cause: e
  });
}
function fe(e, t = g) {
  throw nt(e);
}
function ie(e) {
  if (typeof e == "function" && !e.length) return ie(e());
  if (Array.isArray(e)) {
    const t = [];
    for (let n = 0; n < e.length; n++) {
      const r = ie(e[n]);
      Array.isArray(r) ? t.push.apply(t, r) : t.push(r);
    }
    return t;
  }
  return e;
}
function rt(e, t) {
  return function(r) {
    let s;
    return W(() => s = L(() => (g.context = {
      ...g.context,
      [e]: r.value
    }, ce(() => r.children))), void 0), s;
  };
}
function R(e, t) {
  return L(() => e(t || {}));
}
function V() {
  return !0;
}
const st = {
  get(e, t, n) {
    return t === oe ? n : e.get(t);
  },
  has(e, t) {
    return t === oe ? !0 : e.has(t);
  },
  set: V,
  deleteProperty: V,
  getOwnPropertyDescriptor(e, t) {
    return {
      configurable: !0,
      enumerable: !0,
      get() {
        return e.get(t);
      },
      set: V,
      deleteProperty: V
    };
  },
  ownKeys(e) {
    return e.keys();
  }
};
function ne(e) {
  return (e = typeof e == "function" ? e() : e) ? e : {};
}
function ot() {
  for (let e = 0, t = this.length; e < t; ++e) {
    const n = this[e]();
    if (n !== void 0) return n;
  }
}
function it(...e) {
  let t = !1;
  for (let l = 0; l < e.length; l++) {
    const o = e[l];
    t = t || !!o && oe in o, e[l] = typeof o == "function" ? (t = !0, P(o)) : o;
  }
  if (Ge && t)
    return new Proxy({
      get(l) {
        for (let o = e.length - 1; o >= 0; o--) {
          const a = ne(e[o])[l];
          if (a !== void 0) return a;
        }
      },
      has(l) {
        for (let o = e.length - 1; o >= 0; o--)
          if (l in ne(e[o])) return !0;
        return !1;
      },
      keys() {
        const l = [];
        for (let o = 0; o < e.length; o++) l.push(...Object.keys(ne(e[o])));
        return [...new Set(l)];
      }
    }, st);
  const n = {}, r = /* @__PURE__ */ Object.create(null);
  for (let l = e.length - 1; l >= 0; l--) {
    const o = e[l];
    if (!o) continue;
    const a = Object.getOwnPropertyNames(o);
    for (let u = a.length - 1; u >= 0; u--) {
      const c = a[u];
      if (c === "__proto__" || c === "constructor") continue;
      const f = Object.getOwnPropertyDescriptor(o, c);
      if (!r[c])
        r[c] = f.get ? {
          enumerable: !0,
          configurable: !0,
          get: ot.bind(n[c] = [f.get.bind(o)])
        } : f.value !== void 0 ? f : void 0;
      else {
        const d = n[c];
        d && (f.get ? d.push(f.get.bind(o)) : f.value !== void 0 && d.push(() => f.value));
      }
    }
  }
  const s = {}, i = Object.keys(r);
  for (let l = i.length - 1; l >= 0; l--) {
    const o = i[l], a = r[o];
    a && a.get ? Object.defineProperty(s, o, a) : s[o] = a ? a.value : void 0;
  }
  return s;
}
const lt = (e) => `Stale read from <${e}>.`;
function _e(e) {
  const t = e.keyed, n = P(() => e.when, void 0, void 0), r = t ? n : P(n, void 0, {
    equals: (s, i) => !s == !i
  });
  return P(() => {
    const s = r();
    if (s) {
      const i = e.children;
      return typeof i == "function" && i.length > 0 ? L(() => i(t ? s : () => {
        if (!L(r)) throw lt("Show");
        return n();
      })) : i;
    }
    return e.fallback;
  }, void 0, void 0);
}
const at = (e) => P(() => e());
function ut(e, t, n) {
  let r = n.length, s = t.length, i = r, l = 0, o = 0, a = t[s - 1].nextSibling, u = null;
  for (; l < s || o < i; ) {
    if (t[l] === n[o]) {
      l++, o++;
      continue;
    }
    for (; t[s - 1] === n[i - 1]; )
      s--, i--;
    if (s === l) {
      const c = i < r ? o ? n[o - 1].nextSibling : n[i - o] : a;
      for (; o < i; ) e.insertBefore(n[o++], c);
    } else if (i === o)
      for (; l < s; )
        (!u || !u.has(t[l])) && t[l].remove(), l++;
    else if (t[l] === n[i - 1] && n[o] === t[s - 1]) {
      const c = t[--s].nextSibling;
      e.insertBefore(n[o++], t[l++].nextSibling), e.insertBefore(n[--i], c), t[s] = n[i];
    } else {
      if (!u) {
        u = /* @__PURE__ */ new Map();
        let f = o;
        for (; f < i; ) u.set(n[f], f++);
      }
      const c = u.get(t[l]);
      if (c != null)
        if (o < c && c < i) {
          let f = l, d = 1, m;
          for (; ++f < s && f < i && !((m = u.get(t[f])) == null || m !== c + d); )
            d++;
          if (d > c - o) {
            const S = t[l];
            for (; o < c; ) e.insertBefore(n[o++], S);
          } else e.replaceChild(n[o++], t[l++]);
        } else l++;
      else t[l++].remove();
    }
  }
}
const me = "_$DX_DELEGATE";
function ct(e, t, n, r = {}) {
  let s;
  return ve((i) => {
    s = i, t === document ? e() : $e(t, e(), t.firstChild ? null : void 0, n);
  }, r.owner), () => {
    s(), t.textContent = "";
  };
}
function ke(e, t, n, r) {
  let s;
  const i = () => {
    const o = document.createElement("template");
    return o.innerHTML = e, o.content.firstChild;
  }, l = () => (s || (s = i())).cloneNode(!0);
  return l.cloneNode = l, l;
}
function ft(e, t = window.document) {
  const n = t[me] || (t[me] = /* @__PURE__ */ new Set());
  for (let r = 0, s = e.length; r < s; r++) {
    const i = e[r];
    n.has(i) || (n.add(i), t.addEventListener(i, ht));
  }
}
function $e(e, t, n, r) {
  if (n !== void 0 && !r && (r = []), typeof t != "function") return J(e, t, r, n);
  W((s) => J(e, t(), s, n), r);
}
function ht(e) {
  let t = e.target;
  const n = `$$${e.type}`, r = e.target, s = e.currentTarget, i = (a) => Object.defineProperty(e, "target", {
    configurable: !0,
    value: a
  }), l = () => {
    const a = t[n];
    if (a && !t.disabled) {
      const u = t[`${n}Data`];
      if (u !== void 0 ? a.call(t, u, e) : a.call(t, e), e.cancelBubble) return;
    }
    return t.host && typeof t.host != "string" && !t.host._$host && t.contains(e.target) && i(t.host), !0;
  }, o = () => {
    for (; l() && (t = t._$host || t.parentNode || t.host); ) ;
  };
  if (Object.defineProperty(e, "currentTarget", {
    configurable: !0,
    get() {
      return t || document;
    }
  }), e.composedPath) {
    const a = e.composedPath();
    i(a[0]);
    for (let u = 0; u < a.length - 2 && (t = a[u], !!l()); u++) {
      if (t._$host) {
        t = t._$host, o();
        break;
      }
      if (t.parentNode === s)
        break;
    }
  } else o();
  i(r);
}
function J(e, t, n, r, s) {
  for (; typeof n == "function"; ) n = n();
  if (t === n) return n;
  const i = typeof t, l = r !== void 0;
  if (e = l && n[0] && n[0].parentNode || e, i === "string" || i === "number") {
    if (i === "number" && (t = t.toString(), t === n))
      return n;
    if (l) {
      let o = n[0];
      o && o.nodeType === 3 ? o.data !== t && (o.data = t) : o = document.createTextNode(t), n = F(e, n, r, o);
    } else
      n !== "" && typeof n == "string" ? n = e.firstChild.data = t : n = e.textContent = t;
  } else if (t == null || i === "boolean")
    n = F(e, n, r);
  else {
    if (i === "function")
      return W(() => {
        let o = t();
        for (; typeof o == "function"; ) o = o();
        n = J(e, o, n, r);
      }), () => n;
    if (Array.isArray(t)) {
      const o = [], a = n && Array.isArray(n);
      if (le(o, t, n, s))
        return W(() => n = J(e, o, n, r, !0)), () => n;
      if (o.length === 0) {
        if (n = F(e, n, r), l) return n;
      } else a ? n.length === 0 ? we(e, o, r) : ut(e, n, o) : (n && F(e), we(e, o));
      n = o;
    } else if (t.nodeType) {
      if (Array.isArray(n)) {
        if (l) return n = F(e, n, r, t);
        F(e, n, null, t);
      } else n == null || n === "" || !e.firstChild ? e.appendChild(t) : e.replaceChild(t, e.firstChild);
      n = t;
    }
  }
  return n;
}
function le(e, t, n, r) {
  let s = !1;
  for (let i = 0, l = t.length; i < l; i++) {
    let o = t[i], a = n && n[e.length], u;
    if (!(o == null || o === !0 || o === !1)) if ((u = typeof o) == "object" && o.nodeType)
      e.push(o);
    else if (Array.isArray(o))
      s = le(e, o, a) || s;
    else if (u === "function")
      if (r) {
        for (; typeof o == "function"; ) o = o();
        s = le(e, Array.isArray(o) ? o : [o], Array.isArray(a) ? a : [a]) || s;
      } else
        e.push(o), s = !0;
    else {
      const c = String(o);
      a && a.nodeType === 3 && a.data === c ? e.push(a) : e.push(document.createTextNode(c));
    }
  }
  return s;
}
function we(e, t, n = null) {
  for (let r = 0, s = t.length; r < s; r++) e.insertBefore(t[r], n);
}
function F(e, t, n, r) {
  if (n === void 0) return e.textContent = "";
  const s = r || document.createTextNode("");
  if (t.length) {
    let i = !1;
    for (let l = t.length - 1; l >= 0; l--) {
      const o = t[l];
      if (s !== o) {
        const a = o.parentNode === e;
        !i && !l ? a ? e.replaceChild(s, o) : e.insertBefore(s, n) : a && o.remove();
      } else i = !0;
    }
  } else e.insertBefore(s, n);
  return [s];
}
const dt = !1;
function Ue() {
  let e = /* @__PURE__ */ new Set();
  function t(s) {
    return e.add(s), () => e.delete(s);
  }
  let n = !1;
  function r(s, i) {
    if (n)
      return !(n = !1);
    const l = {
      to: s,
      options: i,
      defaultPrevented: !1,
      preventDefault: () => l.defaultPrevented = !0
    };
    for (const o of e)
      o.listener({
        ...l,
        from: o.location,
        retry: (a) => {
          a && (n = !0), o.navigate(s, { ...i, resolve: !1 });
        }
      });
    return !l.defaultPrevented;
  }
  return {
    subscribe: t,
    confirm: r
  };
}
let ae;
function he() {
  (!window.history.state || window.history.state._depth == null) && window.history.replaceState({ ...window.history.state, _depth: window.history.length - 1 }, ""), ae = window.history.state._depth;
}
he();
function pt(e) {
  return {
    ...e,
    _depth: window.history.state && window.history.state._depth
  };
}
function gt(e, t) {
  let n = !1;
  return () => {
    const r = ae;
    he();
    const s = r == null ? null : ae - r;
    if (n) {
      n = !1;
      return;
    }
    s && t(s) ? (n = !0, window.history.go(-s)) : e();
  };
}
const mt = /^(?:[a-z0-9]+:)?\/\//i, wt = /^\/+|(\/)\/+$/g, je = "http://sr";
function q(e, t = !1) {
  const n = e.replace(wt, "$1");
  return n ? t || /^[?#]/.test(n) ? n : "/" + n : "";
}
function H(e, t, n) {
  if (mt.test(t))
    return;
  const r = q(e), s = n && q(n);
  let i = "";
  return !s || t.startsWith("/") ? i = r : s.toLowerCase().indexOf(r.toLowerCase()) !== 0 ? i = r + s : i = s, (i || "/") + q(t, !i);
}
function yt(e, t) {
  return q(e).replace(/\/*(\*.*)?$/g, "") + q(t);
}
function De(e) {
  const t = {};
  return e.searchParams.forEach((n, r) => {
    r in t ? Array.isArray(t[r]) ? t[r].push(n) : t[r] = [t[r], n] : t[r] = n;
  }), t;
}
function bt(e, t, n) {
  const [r, s] = e.split("/*", 2), i = r.split("/").filter(Boolean), l = i.length;
  return (o) => {
    const a = o.split("/").filter(Boolean), u = a.length - l;
    if (u < 0 || u > 0 && s === void 0 && !t)
      return null;
    const c = {
      path: l ? "" : "/",
      params: {}
    }, f = (d) => n === void 0 ? void 0 : n[d];
    for (let d = 0; d < l; d++) {
      const m = i[d], S = m[0] === ":", h = S ? a[d] : a[d].toLowerCase(), p = S ? m.slice(1) : m.toLowerCase();
      if (S && re(h, f(p)))
        c.params[p] = h;
      else if (S || !re(h, p))
        return null;
      c.path += `/${h}`;
    }
    if (s) {
      const d = u ? a.slice(-u).join("/") : "";
      if (re(d, f(s)))
        c.params[s] = d;
      else
        return null;
    }
    return c;
  };
}
function re(e, t) {
  const n = (r) => r === e;
  return t === void 0 ? !0 : typeof t == "string" ? n(t) : typeof t == "function" ? t(e) : Array.isArray(t) ? t.some(n) : t instanceof RegExp ? t.test(e) : !1;
}
function vt(e) {
  const [t, n] = e.pattern.split("/*", 2), r = t.split("/").filter(Boolean);
  return r.reduce((s, i) => s + (i.startsWith(":") ? 2 : 3), r.length - (n === void 0 ? 0 : 1));
}
function Be(e) {
  const t = /* @__PURE__ */ new Map(), n = Se();
  return new Proxy({}, {
    get(r, s) {
      return t.has(s) || Pe(n, () => t.set(s, P(() => e()[s]))), t.get(s)();
    },
    getOwnPropertyDescriptor() {
      return {
        enumerable: !0,
        configurable: !0
      };
    },
    ownKeys() {
      return Reflect.ownKeys(e());
    }
  });
}
function Fe(e) {
  let t = /(\/?\:[^\/]+)\?/.exec(e);
  if (!t)
    return [e];
  let n = e.slice(0, t.index), r = e.slice(t.index + t[0].length);
  const s = [n, n += t[1]];
  for (; t = /^(\/\:[^\/]+)\?/.exec(r); )
    s.push(n += t[1]), r = r.slice(t[0].length);
  return Fe(r).reduce((i, l) => [...i, ...s.map((o) => o + l)], []);
}
const At = 100, St = xe(), Ie = xe();
function Pt(e, t = "") {
  const { component: n, preload: r, load: s, children: i, info: l } = e, o = !i || Array.isArray(i) && !i.length, a = {
    key: e,
    component: n,
    preload: r || s,
    info: l
  };
  return Ne(e.path).reduce((u, c) => {
    for (const f of Fe(c)) {
      const d = yt(t, f);
      let m = o ? d : d.split("/*", 1)[0];
      m = m.split("/").map((S) => S.startsWith(":") || S.startsWith("*") ? S : encodeURIComponent(S)).join("/"), u.push({
        ...a,
        originalPath: c,
        pattern: m,
        matcher: bt(m, !o, e.matchFilters)
      });
    }
    return u;
  }, []);
}
function xt(e, t = 0) {
  return {
    routes: e,
    score: vt(e[e.length - 1]) * 1e4 - t,
    matcher(n) {
      const r = [];
      for (let s = e.length - 1; s >= 0; s--) {
        const i = e[s], l = i.matcher(n);
        if (!l)
          return null;
        r.unshift({
          ...l,
          route: i
        });
      }
      return r;
    }
  };
}
function Ne(e) {
  return Array.isArray(e) ? e : [e];
}
function qe(e, t = "", n = [], r = []) {
  const s = Ne(e);
  for (let i = 0, l = s.length; i < l; i++) {
    const o = s[i];
    if (o && typeof o == "object") {
      o.hasOwnProperty("path") || (o.path = "");
      const a = Pt(o, t);
      for (const u of a) {
        n.push(u);
        const c = Array.isArray(o.children) && o.children.length === 0;
        if (o.children && !c)
          qe(o.children, u.pattern, n, r);
        else {
          const f = xt([...n], r.length);
          r.push(f);
        }
        n.pop();
      }
    }
  }
  return n.length ? r : r.sort((i, l) => l.score - i.score);
}
function se(e, t) {
  for (let n = 0, r = e.length; n < r; n++) {
    const s = e[n].matcher(t);
    if (s)
      return s;
  }
  return [];
}
function Et(e, t, n) {
  const r = new URL(je), s = P((c) => {
    const f = e();
    try {
      return new URL(f, r);
    } catch {
      return console.error(`Invalid path ${f}`), c;
    }
  }, r, {
    equals: (c, f) => c.href === f.href
  }), i = P(() => s().pathname), l = P(() => s().search, !0), o = P(() => s().hash), a = () => "", u = ue(l, () => De(s()));
  return {
    get pathname() {
      return i();
    },
    get search() {
      return l();
    },
    get hash() {
      return o();
    },
    get state() {
      return t();
    },
    get key() {
      return a();
    },
    query: n ? n(u) : Be(u)
  };
}
let k;
function Rt() {
  return k;
}
function Ct(e, t, n, r = {}) {
  const { signal: [s, i], utils: l = {} } = e, o = l.parsePath || ((w) => w), a = l.renderPath || ((w) => w), u = l.beforeLeave || Ue(), c = H("", r.base || "");
  if (c === void 0)
    throw new Error(`${c} is not a valid base path`);
  c && !s().value && i({ value: c, replace: !0, scroll: !1 });
  const [f, d] = $(!1);
  let m;
  const S = (w, b) => {
    b.value === h() && b.state === A() || (m === void 0 && d(!0), k = w, m = b, Ze(() => {
      m === b && (p(m.value), v(m.state), _[1]((E) => E.filter((D) => D.pending)));
    }).finally(() => {
      m === b && Qe(() => {
        k = void 0, w === "navigate" && Ve(m), d(!1), m = void 0;
      });
    }));
  }, [h, p] = $(s().value), [A, v] = $(s().state), T = Et(h, A, l.queryWrapper), C = [], _ = $([]), I = P(() => typeof r.transformUrl == "function" ? se(t(), r.transformUrl(T.pathname)) : se(t(), T.pathname)), de = () => {
    const w = I(), b = {};
    for (let E = 0; E < w.length; E++)
      Object.assign(b, w[E].params);
    return b;
  }, We = l.paramsWrapper ? l.paramsWrapper(de, t) : Be(de), pe = {
    pattern: c,
    path: () => c,
    outlet: () => null,
    resolvePath(w) {
      return H(c, w);
    }
  };
  return W(ue(s, (w) => S("native", w), { defer: !0 })), {
    base: pe,
    location: T,
    params: We,
    isRouting: f,
    renderPath: a,
    parsePath: o,
    navigatorFactory: Me,
    matches: I,
    beforeLeave: u,
    preloadRoute: He,
    singleFlight: r.singleFlight === void 0 ? !0 : r.singleFlight,
    submissions: _
  };
  function Ke(w, b, E) {
    L(() => {
      if (typeof b == "number") {
        b && (l.go ? l.go(b) : console.warn("Router integration does not support relative routing"));
        return;
      }
      const D = !b || b[0] === "?", { replace: z, resolve: B, scroll: ee, state: N } = {
        replace: !1,
        resolve: !D,
        scroll: !0,
        ...E
      }, M = B ? w.resolvePath(b) : H(D && T.pathname || "", b);
      if (M === void 0)
        throw new Error(`Path '${b}' is not a routable path`);
      if (C.length >= At)
        throw new Error("Too many redirects");
      const ge = h();
      (M !== ge || N !== A()) && (dt || u.confirm(M, E) && (C.push({ value: ge, replace: z, scroll: ee, state: A() }), S("navigate", {
        value: M,
        state: N
      })));
    });
  }
  function Me(w) {
    return w = w || ze(Ie) || pe, (b, E) => Ke(w, b, E);
  }
  function Ve(w) {
    const b = C[0];
    b && (i({
      ...w,
      replace: b.replace,
      scroll: b.scroll
    }), C.length = 0);
  }
  function He(w, b) {
    const E = se(t(), w.pathname), D = k;
    k = "preload";
    for (let z in E) {
      const { route: B, params: ee } = E[z];
      B.component && B.component.preload && B.component.preload();
      const { preload: N } = B;
      b && N && Pe(n(), () => N({
        params: ee,
        location: {
          pathname: w.pathname,
          search: w.search,
          hash: w.hash,
          query: De(w),
          state: null,
          key: ""
        },
        intent: "preload"
      }));
    }
    k = D;
  }
}
function Lt(e, t, n, r) {
  const { base: s, location: i, params: l } = e, { pattern: o, component: a, preload: u } = r().route, c = P(() => r().path);
  a && a.preload && a.preload();
  const f = u ? u({ params: l, location: i, intent: k || "initial" }) : void 0;
  return {
    parent: t,
    pattern: o,
    path: c,
    outlet: () => a ? R(a, {
      params: l,
      location: i,
      data: f,
      get children() {
        return n();
      }
    }) : n(),
    resolvePath(m) {
      return H(s.path(), m, c());
    }
  };
}
const Ot = (e) => (t) => {
  const {
    base: n
  } = t, r = ce(() => t.children), s = P(() => qe(r(), t.base || ""));
  let i;
  const l = Ct(e, s, () => i, {
    base: n,
    singleFlight: t.singleFlight,
    transformUrl: t.transformUrl
  });
  return e.create && e.create(l), R(St.Provider, {
    value: l,
    get children() {
      return R(Tt, {
        routerState: l,
        get root() {
          return t.root;
        },
        get preload() {
          return t.rootPreload || t.rootLoad;
        },
        get children() {
          return [at(() => (i = Se()) && null), R(_t, {
            routerState: l,
            get branches() {
              return s();
            }
          })];
        }
      });
    }
  });
};
function Tt(e) {
  const t = e.routerState.location, n = e.routerState.params, r = P(() => e.preload && L(() => {
    e.preload({
      params: n,
      location: t,
      intent: Rt() || "initial"
    });
  }));
  return R(_e, {
    get when() {
      return e.root;
    },
    keyed: !0,
    get fallback() {
      return e.children;
    },
    children: (s) => R(s, {
      params: n,
      location: t,
      get data() {
        return r();
      },
      get children() {
        return e.children;
      }
    })
  });
}
function _t(e) {
  const t = [];
  let n;
  const r = P(ue(e.routerState.matches, (s, i, l) => {
    let o = i && s.length === i.length;
    const a = [];
    for (let u = 0, c = s.length; u < c; u++) {
      const f = i && i[u], d = s[u];
      l && f && d.route.key === f.route.key ? a[u] = l[u] : (o = !1, t[u] && t[u](), ve((m) => {
        t[u] = m, a[u] = Lt(e.routerState, a[u - 1] || e.routerState.base, ye(() => r()[u + 1]), () => e.routerState.matches()[u]);
      }));
    }
    return t.splice(s.length).forEach((u) => u()), l && o ? l : (n = a[0], a);
  }));
  return ye(() => r() && n)();
}
const ye = (e) => () => R(_e, {
  get when() {
    return e();
  },
  keyed: !0,
  children: (t) => R(Ie.Provider, {
    value: t,
    get children() {
      return t.outlet();
    }
  })
}), kt = (e) => {
  const t = ce(() => e.children);
  return it(e, {
    get children() {
      return t();
    }
  });
};
function $t([e, t], n, r) {
  return [e, r ? (s) => t(r(s)) : t];
}
function Ut(e) {
  let t = !1;
  const n = (s) => typeof s == "string" ? { value: s } : s, r = $t($(n(e.get()), {
    equals: (s, i) => s.value === i.value && s.state === i.state
  }), void 0, (s) => (!t && e.set(s), s));
  return e.init && Ae(e.init((s = e.get()) => {
    t = !0, r[1](n(s)), t = !1;
  })), Ot({
    signal: r,
    create: e.create,
    utils: e.utils
  });
}
function jt(e, t, n) {
  return e.addEventListener(t, n), () => e.removeEventListener(t, n);
}
function Dt(e, t) {
  const n = e && document.getElementById(e);
  n ? n.scrollIntoView() : t && window.scrollTo(0, 0);
}
const Bt = /* @__PURE__ */ new Map();
function Ft(e = !0, t = !1, n = "/_server", r) {
  return (s) => {
    const i = s.base.path(), l = s.navigatorFactory(s.base);
    let o, a;
    function u(h) {
      return h.namespaceURI === "http://www.w3.org/2000/svg";
    }
    function c(h) {
      if (h.defaultPrevented || h.button !== 0 || h.metaKey || h.altKey || h.ctrlKey || h.shiftKey)
        return;
      const p = h.composedPath().find((I) => I instanceof Node && I.nodeName.toUpperCase() === "A");
      if (!p || t && !p.hasAttribute("link"))
        return;
      const A = u(p), v = A ? p.href.baseVal : p.href;
      if ((A ? p.target.baseVal : p.target) || !v && !p.hasAttribute("state"))
        return;
      const C = (p.getAttribute("rel") || "").split(/\s+/);
      if (p.hasAttribute("download") || C && C.includes("external"))
        return;
      const _ = A ? new URL(v, document.baseURI) : new URL(v);
      if (!(_.origin !== window.location.origin || i && _.pathname && !_.pathname.toLowerCase().startsWith(i.toLowerCase())))
        return [p, _];
    }
    function f(h) {
      const p = c(h);
      if (!p)
        return;
      const [A, v] = p, T = s.parsePath(v.pathname + v.search + v.hash), C = A.getAttribute("state");
      h.preventDefault(), l(T, {
        resolve: !1,
        replace: A.hasAttribute("replace"),
        scroll: !A.hasAttribute("noscroll"),
        state: C ? JSON.parse(C) : void 0
      });
    }
    function d(h) {
      const p = c(h);
      if (!p)
        return;
      const [A, v] = p;
      r && (v.pathname = r(v.pathname)), s.preloadRoute(v, A.getAttribute("preload") !== "false");
    }
    function m(h) {
      clearTimeout(o);
      const p = c(h);
      if (!p)
        return a = null;
      const [A, v] = p;
      a !== A && (r && (v.pathname = r(v.pathname)), o = setTimeout(() => {
        s.preloadRoute(v, A.getAttribute("preload") !== "false"), a = A;
      }, 20));
    }
    function S(h) {
      if (h.defaultPrevented)
        return;
      let p = h.submitter && h.submitter.hasAttribute("formaction") ? h.submitter.getAttribute("formaction") : h.target.getAttribute("action");
      if (!p)
        return;
      if (!p.startsWith("https://action/")) {
        const v = new URL(p, je);
        if (p = s.parsePath(v.pathname + v.search), !p.startsWith(n))
          return;
      }
      if (h.target.method.toUpperCase() !== "POST")
        throw new Error("Only POST forms are supported for Actions");
      const A = Bt.get(p);
      if (A) {
        h.preventDefault();
        const v = new FormData(h.target, h.submitter);
        A.call({ r: s, f: h.target }, h.target.enctype === "multipart/form-data" ? v : new URLSearchParams(v));
      }
    }
    ft(["click", "submit"]), document.addEventListener("click", f), e && (document.addEventListener("mousemove", m, { passive: !0 }), document.addEventListener("focusin", d, { passive: !0 }), document.addEventListener("touchstart", d, { passive: !0 })), document.addEventListener("submit", S), Ae(() => {
      document.removeEventListener("click", f), e && (document.removeEventListener("mousemove", m), document.removeEventListener("focusin", d), document.removeEventListener("touchstart", d)), document.removeEventListener("submit", S);
    });
  };
}
function It(e) {
  const t = () => {
    const r = window.location.pathname.replace(/^\/+/, "/") + window.location.search, s = window.history.state && window.history.state._depth && Object.keys(window.history.state).length === 1 ? void 0 : window.history.state;
    return {
      value: r + window.location.hash,
      state: s
    };
  }, n = Ue();
  return Ut({
    get: t,
    set({ value: r, replace: s, scroll: i, state: l }) {
      s ? window.history.replaceState(pt(l), "", r) : window.history.pushState(l, "", r), Dt(decodeURIComponent(window.location.hash.slice(1)), i), he();
    },
    init: (r) => jt(window, "popstate", gt(r, (s) => {
      if (s && s < 0)
        return !n.confirm(s);
      {
        const i = t();
        return !n.confirm(i.value, { state: i.state });
      }
    })),
    create: Ft(e.preload, e.explicitLinks, e.actionBase, e.transformUrl),
    utils: {
      go: (r) => window.history.go(r),
      beforeLeave: n
    }
  })(e);
}
var Nt = /* @__PURE__ */ ke('<div class="flex min-h-screen items-center justify-center">');
function qt() {
  const [e, t] = $("");
  return Nt();
}
var Wt = /* @__PURE__ */ ke('<div class="dark:bg-solid-darkbg relative flex h-screen flex-col overflow-auto bg-white font-sans text-slate-900 dark:text-slate-50">');
const Kt = () => (() => {
  var e = Wt();
  return $e(e, R(It, {
    get children() {
      return R(kt, {
        path: "/",
        component: qt
      });
    }
  })), e;
})(), Mt = document.getElementById("root");
ct(() => R(Kt, {}), Mt);
