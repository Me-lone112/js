function t(t, i, e) {
    return Math.max(t, Math.min(i, e));
}

var i = class {
    isRunning = !1;
    value = 0;
    from = 0;
    to = 0;
    currentTime = 0;
    lerp;
    duration;
    easing;
    onUpdate;

    advance(i) {
        if (!this.isRunning) return;

        let e = !1;
        if (this.duration && this.easing) {
            this.currentTime += i;
            const s = t(0, this.currentTime / this.duration, 1);
            e = s >= 1;
            const o = e ? 1 : this.easing(s);
            this.value = this.from + (this.to - this.from) * o;
        } else {
            this.lerp ? (this.value = function(t, i, e, s) {
                return function(t, i, e) {
                    return (1 - e) * t + e * i;
                }(t, i, 1 - Math.exp(-e * s));
            }(this.value, this.to, 60 * this.lerp, i), Math.round(this.value) === this.to && (this.value = this.to, e = !0)) : (this.value = this.to, e = !0);
        }

        e && this.stop();
        this.onUpdate?.(this.value, e);
    }

    stop() {
        this.isRunning = !1;
    }

    fromTo(t, i, { lerp: e, duration: s, easing: o, onStart: n, onUpdate: r }) {
        this.from = this.value = t;
        this.to = i;
        this.lerp = e;
        this.duration = s;
        this.easing = o;
        this.currentTime = 0;
        this.isRunning = !0;
        n?.();
        this.onUpdate = r;
    }
};

var e = class {
    constructor(t, i, { autoResize: e = !0, debounce: s = 250 } = {}) {
        this.wrapper = t;
        this.content = i;
        e && (this.debouncedResize = function(t, i) {
            let e;
            return function(...s) {
                let o = this;
                clearTimeout(e);
                e = setTimeout(() => { e = void 0; t.apply(o, s); }, i);
            };
        }(this.resize, s), this.wrapper instanceof Window ? window.addEventListener("resize", this.debouncedResize, !1) : (this.wrapperResizeObserver = new ResizeObserver(this.debouncedResize), this.wrapperResizeObserver.observe(this.wrapper)), this.contentResizeObserver = new ResizeObserver(this.debouncedResize), this.contentResizeObserver.observe(this.content));
        this.resize();
    }

    width = 0;
    height = 0;
    scrollHeight = 0;
    scrollWidth = 0;
    debouncedResize;
    wrapperResizeObserver;
    contentResizeObserver;

    destroy() {
        this.wrapperResizeObserver?.disconnect();
        this.contentResizeObserver?.disconnect();
        this.wrapper === window && this.debouncedResize && window.removeEventListener("resize", this.debouncedResize, !1);
    }

    resize = () => {
        this.onWrapperResize();
        this.onContentResize();
    };

    onWrapperResize = () => {
        this.wrapper instanceof Window ? (this.width = window.innerWidth, this.height = window.innerHeight) : (this.width = this.wrapper.clientWidth, this.height = this.wrapper.clientHeight);
    };

    onContentResize = () => {
        this.wrapper instanceof Window ? (this.scrollHeight = this.content.scrollHeight, this.scrollWidth = this.content.scrollWidth) : (this.scrollHeight = this.wrapper.scrollHeight, this.scrollWidth = this.wrapper.scrollWidth);
    };

    get limit() {
        return { x: this.scrollWidth - this.width, y: this.scrollHeight - this.height };
    }
};

var s = class {
    events = {};

    emit(t, ...i) {
        let e = this.events[t] || [];
        for (let t = 0, s = e.length; t < s; t++) e[t]?.(...i);
    }

    on(t, i) {
        return this.events[t]?.push(i) || (this.events[t] = [i]), () => { this.events[t] = this.events[t]?.filter(t => i !== t); };
    }

    off(t, i) {
        this.events[t] = this.events[t]?.filter(t => i !== t);
    }

    destroy() {
        this.events = {};
    }
};

var o = 100 / 6,
    n = { passive: !1 },

    r = class {
        constructor(t, i = { wheelMultiplier: 1, touchMultiplier: 1 }) {
            this.element = t;
            this.options = i;
            window.addEventListener("resize", this.onWindowResize, !1);
            this.onWindowResize();
            this.element.addEventListener("wheel", this.onWheel, n);
            this.element.addEventListener("touchstart", this.onTouchStart, n);
            this.element.addEventListener("touchmove", this.onTouchMove, n);
            this.element.addEventListener("touchend", this.onTouchEnd, n);
        }

        touchStart = { x: 0, y: 0 };
        lastDelta = { x: 0, y: 0 };
        window = { width: 0, height: 0 };
        emitter = new s();

        on(t, i) {
            return this.emitter.on(t, i);
        }

        destroy() {
            this.emitter.destroy();
            window.removeEventListener("resize", this.onWindowResize, !1);
            this.element.removeEventListener("wheel", this.onWheel, n);
            this.element.removeEventListener("touchstart", this.onTouchStart, n);
            this.element.removeEventListener("touchmove", this.onTouchMove, n);
            this.element.removeEventListener("touchend", this.onTouchEnd, n);
        }

        onTouchStart = t => {
            const { clientX: i, clientY: e } = t.targetTouches ? t.targetTouches[0] : t;
            this.touchStart.x = i;
            this.touchStart.y = e;
            this.lastDelta = { x: 0, y: 0 };
            this.emitter.emit("scroll", { deltaX: 0, deltaY: 0, event: t });
        };

        onTouchMove = t => {
            const { clientX: i, clientY: e } = t.targetTouches ? t.targetTouches[0] : t;
            const s = -(i - this.touchStart.x) * this.options.touchMultiplier;
            const o = -(e - this.touchStart.y) * this.options.touchMultiplier;
            this.touchStart.x = i;
            this.touchStart.y = e;
            this.lastDelta = { x: s, y: o };
            this.emitter.emit("scroll", { deltaX: s, deltaY: o, event: t });
        };

        onTouchEnd = t => {
            this.emitter.emit("scroll", { deltaX: this.lastDelta.x, deltaY: this.lastDelta.y, event: t });
        };

        onWheel = t => {
            let { deltaX: i, deltaY: e, deltaMode: s } = t;
            i *= 1 === s ? o : 2 === s ? this.window.width : 1;
            e *= 1 === s ? o : 2 === s ? this.window.height : 1;
            i *= this.options.wheelMultiplier;
            e *= this.options.wheelMultiplier;
            this.emitter.emit("scroll", { deltaX: i, deltaY: e, event: t });
        };

        onWindowResize = () => {
            this.window = { width: window.innerWidth, height: window.innerHeight };
        };
    },

    Lenis = class {
        _isScrolling = !1;
        _isStopped = !1;
        _isLocked = !1;
        _preventNextNativeScrollEvent = !1;
        _resetVelocityTimeout = null;
        __rafID = null;
        isTouching;
        time = 0;
        userData = {};
        lastVelocity = 0;
        velocity = 0;
        direction = 0;
        options;
        targetScroll;
        animatedScroll;
        animate = new i();
        emitter = new s();
        dimensions;
        virtualScroll;

        constructor({
            wrapper: t = window,
            content: i = document.documentElement,
            eventsTarget: s = t,
            smoothWheel: o = !0,
            syncTouch: n = !1,
            syncTouchLerp: l = .075,
            touchInertiaMultiplier: h = 35,
            duration: a,
            easing: c = t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            lerp: p = .1,
            infinite: d = !1,
            orientation: u = "vertical",
            gestureOrientation: m = "vertical",
            touchMultiplier: v = 1,
            wheelMultiplier: S = 1,
            autoResize: w = !0,
            prevent: g,
            virtualScroll: f,
            overscroll: y = !0,
            autoRaf: E = !1,
            anchors: T = !1,
            __experimental__naiveDimensions: z = !1
        } = {}) {
            window.lenisVersion = "1.1.20";
            t && t !== document.documentElement || (t = window);
            this.options = {
                wrapper: t,
                content: i,
                eventsTarget: s,
                smoothWheel: o,
                syncTouch: n,
                syncTouchLerp: l,
                touchInertiaMultiplier: h,
                duration: a,
                easing: c,
                lerp: p,
                infinite: d,
                gestureOrientation: m,
                orientation: u,
                touchMultiplier: v,
                wheelMultiplier: S,
                autoResize: w,
                prevent: g,
                virtualScroll: f,
                overscroll: y,
                autoRaf: E,
                anchors: T,
                __experimental__naiveDimensions: z
            };

            this.dimensions = new e(t, i, { autoResize: w });
            this.updateClassName();
            this.targetScroll = this.animatedScroll = this.actualScroll;

            this.options.wrapper.addEventListener("scroll", this.onNativeScroll, !1);
            this.options.wrapper.addEventListener("scrollend", this.onScrollEnd, { capture: !0 });
            this.options.anchors && this.options.wrapper === window && this.options.wrapper.addEventListener("click", this.onClick, !1);
            this.options.wrapper.addEventListener("pointerdown", this.onPointerDown, !1);
            this.virtualScroll = new r(s, { touchMultiplier: v, wheelMultiplier: S });
            this.virtualScroll.on("scroll", this.onVirtualScroll);
            this.options.autoRaf && (this.__rafID = requestAnimationFrame(this.raf));
        }

        destroy() {
            this.emitter.destroy();
            this.options.wrapper.removeEventListener("scroll", this.onNativeScroll, !1);
            this.options.wrapper.removeEventListener("scrollend", this.onScrollEnd, { capture: !0 });
            this.options.wrapper.removeEventListener("pointerdown", this.onPointerDown, !1);
            this.options.anchors && this.options.wrapper === window && this.options.wrapper.removeEventListener("click", this.onClick, !1);
            this.virtualScroll.destroy();
            this.dimensions.destroy();
            this.cleanUpClassName();
            this.__rafID && cancelAnimationFrame(this.__rafID);
        }

        on(t, i) {
            return this.emitter.on(t, i);
        }

        off(t, i) {
            return this.emitter.off(t, i);
        }

        onScrollEnd = t => {
            t instanceof CustomEvent || "smooth" !== this.isScrolling && !1 !== this.isScrolling || t.stopPropagation();
        };

        dispatchScrollendEvent = () => {
            this.options.wrapper.dispatchEvent(new CustomEvent("scrollend", { bubbles: this.options.wrapper === window, detail: { lenisScrollEnd: !0 } }));
        };

        setScroll(t) {
            this.isHorizontal ? this.options.wrapper.scrollTo({ left: t, behavior: "instant" }) : this.options.wrapper.scrollTo({ top: t, behavior: "instant" });
        }

        onClick = t => {
            const i = t.composedPath().find(t => t instanceof HTMLAnchorElement && t.getAttribute("href")?.startsWith("#"));
            if (i) {
                const t = i.getAttribute("href");
                if (t) {
                    const i = "object" == typeof this.options.anchors && this.options.anchors ? this.options.anchors : void 0;
                    this.scrollTo(t, i);
                }
            }
        };

        onPointerDown = t => {
            1 === t.button && this.reset();
        };

        onVirtualScroll = t => {
            if ("function" == typeof this.options.virtualScroll && !1 === this.options.virtualScroll(t)) return;
            const { deltaX: i, deltaY: e, event: s } = t;
            if (this.emitter.emit("virtual-scroll", { deltaX: i, deltaY: e, event: s }), s.ctrlKey) return;
            if (s.lenisStopPropagation) return;
            const o = s.type.includes("touch"),
                n = s.type.includes("wheel");
            this.isTouching = "touchstart" === s.type || "touchmove" === s.type;
            const r = 0 === i && 0 === e;
            if (this.options.syncTouch && o && "touchstart" === s.type && r && !this.isStopped && !this.isLocked) return void this.reset();
            const l = "vertical" === this.options.gestureOrientation && 0 === e || "horizontal" === this.options.gestureOrientation && 0 === i;
            if (r || l) return;

            let h = s.composedPath()?.find(t => t instanceof HTMLButtonElement);
            let a = s.target;
            let c = 0;
            let p = 0;
            let d = !1;
            let u = !1;
            let m = !1;
            let v = !1;
            if (e < 0) {
                u = !0;
            } else if (e > 0) {
                m = !0;
            }

            if (i < 0) {
                v = !0;
            } else if (i > 0) {
                c = !0;
            }
        };
    };
