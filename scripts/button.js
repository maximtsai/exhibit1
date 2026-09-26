const NORMAL = "normal", HOVER = "hover", PRESS = "press", DISABLE = "disable";

class Button {
    constructor(e, s, t, i, a, r, h, o = false) {
        let n = null, g = null;
        if (!t && !i) {
            let e = s;
            s = e.container;
            t = e.onMouseUp;
            i = e.normal;
            a = e.hover;
            r = e.press;
            h = e.disable;
            o = e.isDraggable;
            n = e.onHover;
            g = e.onDrop;
        }
        this.scene = e;
        this.state = "normal";
        this.normal = i;
        this.hover = a || i;
        this.press = r || i;
        this.disable = h || i;
        this.onMouseUpFunc = t;
        this.onHoverFunc = n;
        this.onDropFunc = g;
        this.imageRefs = {};
        this.oldImageRef = null;
        this.currImageRef = null;
        gameObjects.buttonList.push(this);
        this.container = s || e;
        if (!s) {
            this.noContainer = true;
        }
        this.handlePreload();
        this.setState(NORMAL);
        this.isDraggable = o;
    }
    setState(e) {
        let s;
        switch (e) {
          case NORMAL:
            s = this.normal;
            break;

          case HOVER:
            s = this.hover;
            break;

          case PRESS:
            s = this.press;
            break;

          case DISABLE:
            s = this.disable;
            break;

          default:
            console.error("Invalid state ", e);
            return;
        }
        this.state = e;
        if (s.ref) {
            this.oldImageRef = this.currImageRef;
            this.currImageRef = s.ref;
            if (this.imageRefs[this.oldImageRef]) {
                this.imageRefs[this.oldImageRef].visible = false;
            }
            let e = this.imageRefs[s.ref];
            if (!e) {
                e = s.atlas ? this.scene.add.sprite(0, 0, s.atlas, s.ref) : this.scene.add.sprite(0, 0, s.ref);
                let t = this.imageRefs[this.oldImageRef];
                if (t) {
                    e.setOrigin(t.originX, t.originY);
                }
                if (!this.noContainer) {
                    this.container.add(e);
                }
                this.imageRefs[s.ref] = e;
            }
            e.visible = true;
        }
        let t = this.imageRefs[this.oldImageRef];
        if (!t) {
            t = this.imageRefs[this.currImageRef];
        }
        if (undefined === s.x) {
            this.imageRefs[s.ref].x = t.x || 0;
        } else {
            this.imageRefs[s.ref].x = s.x;
        }
        if (undefined === s.y) {
            this.imageRefs[s.ref].y = t.y || 0;
        } else {
            this.imageRefs[s.ref].y = s.y;
        }
        if (undefined === s.alpha) {
            this.imageRefs[s.ref].alpha = t.alpha || 1;
        } else {
            this.imageRefs[s.ref].alpha = s.alpha;
        }
        if (undefined === s.scaleX) {
            this.imageRefs[s.ref].scaleX = t.scaleX || 1;
        } else {
            this.imageRefs[s.ref].scaleX = s.scaleX;
        }
        if (undefined === s.scaleY) {
            this.imageRefs[s.ref].scaleY = t.scaleY || 1;
        } else {
            this.imageRefs[s.ref].scaleY = s.scaleY;
        }
    }
    handlePreload() {
        if (this.hover.preload) {
            this.setState(HOVER);
        }
        if (this.press.preload) {
            this.setState(PRESS);
        }
        if (this.disable.preload) {
            this.setState(DISABLE);
        }
    }
    checkCoordOver(e, s) {
        if (this.state === DISABLE) {
            return false;
        }
        let t = e - (this.noContainer ? 0 : this.container.x), i = s - (this.noContainer ? 0 : this.container.y), a = this.imageRefs[this.currImageRef], r = a.width * Math.abs(a.scaleX), h = a.height * Math.abs(a.scaleY), o = a.x - a.originX * r, n = a.x + (1 - a.originX) * r;
        if (t < o || t > n) {
            return false;
        }
        let g = a.y - a.originY * h, l = a.y + (1 - a.originY) * h;
        return !(i < g || i > l);
    }
    onHover() {
        if (this.state === NORMAL) {
            this.setState(HOVER);
        }
        if (this.onHoverFunc) {
            this.onHoverFunc();
        }
    }
    onHoverOut() {
        this.setState(NORMAL);
    }
    onMouseDown() {
        if (this.state !== DISABLE) {
            this.setState(PRESS);
            if (this.onMouseDownFunc) {
                this.onMouseDownFunc();
            }
            if (this.isDraggable) {
                if (!this.isDragged) {
                    this.setPos(gameVars.mouseposx - gameVars.halfWidth, gameVars.mouseposy);
                    this.isDragged = true;
                    if (gameObjects.draggedObj) {
                        // drop whatever was being dragged before picking this up
                        gameObjects.draggedObj.onDrop();
                    }
                    gameObjects.draggedObj = this;
                }
            }
        }
    }
    onMouseUp() {
        if (this.state === PRESS) {
            this.setState(HOVER);
            if (this.onMouseUpFunc) {
                this.onMouseUpFunc();
            }
        }
    }
    onDrop() {
        this.isDragged = false;
        gameObjects.draggedObj = null;
        if (this.onDropFunc) {
            this.onDropFunc();
        }
    }
    getPosX() {
        return this.getXPos();
    }
    getPosY() {
        return this.getYPos();
    }
    getScaleX() {
        return this.imageRefs[this.currImageRef].scaleX;
    }
    getScaleY() {
        return this.imageRefs[this.currImageRef].scaleY;
    }
    getXPos() {
        return this.normal.x;
    }
    getYPos() {
        return this.normal.y;
    }
    getWidth() {
        return this.imageRefs[this.currImageRef].width * this.imageRefs[this.currImageRef].scaleX;
    }
    getHeight() {
        return this.imageRefs[this.currImageRef].height * this.imageRefs[this.currImageRef].scaleY;
    }
    getState() {
        return this.state;
    }
    getIsDragged() {
        return this.isDragged && this.state !== DISABLE;
    }
    setOnMouseDownFunc(e) {
        this.onMouseDownFunc = e;
    }
    setOnMouseUpFunc(e) {
        this.onMouseUpFunc = e;
    }
    setOnHoverFunc(e) {
        this.onHover = e;
    }
    setOnHoverOutFunc(e) {
        this.onHoverOut = e;
    }
    setNormalRef(e) {
        this.normal.ref = e;
        if (this.state === NORMAL) {
            this.setState(NORMAL);
        }
    }
    setHoverRef(e) {
        this.hover.ref = e;
        if (this.state === HOVER) {
            this.setState(HOVER);
        }
    }
    setHoverAlpha(e) {
        this.hover.alpha = e;
    }
    setPressRef(e) {
        this.press.ref = e;
        if (this.state === PRESS) {
            this.setState(PRESS);
        }
    }
    setDisableRef(e) {
        this.disable.ref = e;
        if (this.state === DISABLE) {
            this.setState(DISABLE);
        }
    }
    setAllRef(e) {
        this.normal.ref = e;
        this.hover.ref = e;
        this.press.ref = e;
        this.disable.ref = e;
        this.setState(this.state);
    }
    setPos(e, s) {
        if (undefined !== e) {
            this.normal.x = e;
            this.hover.x = e;
            this.press.x = e;
            this.disable.x = e;
            for (let s in this.imageRefs) {
                this.imageRefs[s].x = e;
            }
        }
        if (undefined !== s) {
            this.normal.y = s;
            this.hover.y = s;
            this.press.y = s;
            this.disable.y = s;
            for (let e in this.imageRefs) {
                this.imageRefs[e].y = s;
            }
        }
    }
    setAlpha(e = 1) {
        for (let s in this.imageRefs) {
            this.imageRefs[s].alpha = e;
        }
    }
    setScale(e, s) {
        if (undefined === s) {
            s = e;
        }
        for (let t in this.imageRefs) {
            this.imageRefs[t].scaleX = e;
            this.imageRefs[t].scaleY = s;
        }
    }
    bringToTop() {
        for (let e in this.imageRefs) {
            this.container.bringToTop(this.imageRefs[e]);
        }
    }
    tweenScale(e) {
        let s = [];
        for (let e in this.imageRefs) {
            s.push(this.imageRefs[e]);
        }
        gameVarsTemp.updateTextAnim = gameObjects.scene.tweens.timeline({
            targets: s,
            tweens: [ e ]
        });
    }
    setOrigin(e, s) {
        for (let t in this.imageRefs) {
            this.imageRefs[t].setOrigin(e, s);
        }
    }
    tweenToPos(e, s, t, i) {
        let a = {
            targets: this.imageRefs[this.currImageRef],
            ease: i,
            duration: t,
            onComplete: () => {
                this.setPos(e, s);
            }
        };
        if (undefined !== e) {
            a.x = e;
        }
        if (undefined !== s) {
            a.y = s;
        }
        globalScene.tweens.add(a);
    }
    disappear() {
        if (!this.disappeared) {
            this.disappeared = true;
            this.origX = this.normal.x;
            this.origY = this.normal.y;
            this.origScale = this.imageRefs[this.currImageRef].scaleX;
            this.setPos(0, -9999);
            this.setScale(0.001);
        }
    }
    reappear() {
        if (this.disappeared) {
            this.disappeared = false;
            if (undefined !== this.origX && undefined !== this.origY) {
                this.setPos(this.origX, this.origY);
            }
            if (undefined !== this.origScale) {
                this.setScale(this.origScale);
            }
        }
    }
    runFuncOnImage(e) {
        e(this.imageRefs[this.currImageRef]);
    }
    update() {}
    destroy() {
        for (let e in gameObjects.buttonList) {
            if (gameObjects.buttonList[e] === this) {
                gameObjects.buttonList.splice(parseInt(e), 1);
                break;
            }
        }
        for (let e in this.imageRefs) {
            this.imageRefs[e].destroy();
        }
    }
}
