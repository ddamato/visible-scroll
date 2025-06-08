import html from './template.html';
import css from './styles.css';

const OFFSET_CSSVAR = '--🚫-offset-top';
const CLIENT_CSSVAR = '--🚫-client-width';
const SCROLL_CSSVAR = '--🚫-scroll-width';

function getNormalizedScrollable(node) {
  const isRoot =
    node === window ||
    node === document.documentElement ||
    node === document.body;

  if (isRoot) {
    const html = document.documentElement;
    const body = document.body;
    const scrollHeight = Math.max(html.scrollHeight, body.scrollHeight);
    const scrollWidth = Math.max(html.scrollWidth, body.scrollWidth);
    const canScroll =
      window.innerHeight < scrollHeight ||
      window.innerWidth < scrollWidth;
    return canScroll ? window : null;
  }

  if (!(node instanceof window.Element)) return null;

  const style = window.getComputedStyle(node);
  const overflowY = style.overflowY;
  const overflowX = style.overflowX;

  const scrollY =
    (overflowY === 'auto' || overflowY === 'scroll') &&
    node.scrollHeight > node.clientHeight;
  const scrollX =
    (overflowX === 'auto' || overflowX === 'scroll') &&
    node.scrollWidth > node.clientWidth;

  return scrollY || scrollX ? node : null;
}


function getScrollableAncestors(el) {
  const scrollables = [el];
  let current = el;

  while (current) {
    const parent = current.parentNode || current.host;
    if (!parent) break;

    const scrollable = getNormalizedScrollable(parent);
    if (scrollable) scrollables.push(scrollable);

    // Stop if we're at the root and have checked window
    if (scrollable === window) break;

    current = parent;
  }

  return scrollables;
}

class VisibleScroll extends window.HTMLElement {
    #frame = null;
    #scroller = null;
    #targets = [];
    #ancestors = [];
    #ro = null;
    #scrollCb = Function.prototype;

    #measure() {
        const { top } = this.#frame.getBoundingClientRect();
        const diff = (window.innerHeight - top) - this.#scroller.offsetHeight;
        const offset = Math.min(diff, this.#frame.clientHeight - 1);
        this.#frame.style.setProperty(OFFSET_CSSVAR, `${offset}px`);
    }

    #onScroll({ target }) {
        this.#measure();
        if (!this.#targets.includes(target)) return;
        Object.assign(this.#targets.find(t => t !== target), { scrollLeft: target.scrollLeft });
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' }).innerHTML = `<style type="text/css">${css}</style>${html}`;
        if (typeof window.ResizeObserver !== 'undefined') {
            this.#ro = new window.ResizeObserver(([entry]) => {
            window.requestAnimationFrame(() => {
                const { style, clientWidth, scrollWidth } = entry.target;
                style.setProperty(CLIENT_CSSVAR, `${clientWidth}px`);
		        style.setProperty(SCROLL_CSSVAR, `${scrollWidth}px`);
                this.#measure();
            });
        });
        }
    }

    connectedCallback() {
        this.#frame = this.shadowRoot.getElementById('frame');
        this.#scroller = this.shadowRoot.getElementById('scroller');
        this.#targets = [this.#frame, this.#scroller];

        this.#scrollCb = this.#onScroll.bind(this);
        this.#ancestors = getScrollableAncestors(this.#scroller);
        this.#ancestors.forEach(($elem) => $elem.addEventListener('scroll', this.#scrollCb, true));
        if (typeof this.#ro?.observe === 'function') this.#ro.observe(this.#frame);
    }

    disconnectedCallback() {
        this.#ancestors.forEach(($elem) => $elem.removeEventListener('scroll', this.#scrollCb, true));
        if (typeof this.#ro?.unobserve === 'function') this.#ro.unobserve(this.#frame);
    }
}

window.customElements.define('visible-scroll', VisibleScroll);
