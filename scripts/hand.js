class Hand {
    constructor(i) {
    	this.baseScene = i;
        this.x = -999, this.y = -999, this.isGrabbing = !1, this.entity = null, this.visual = i.add.sprite(this.x, this.y, "hand"), this.visual.scaleX = .95, this.visual.scaleY = .95, this.visualPoint = i.add.sprite(this.x, this.y, "handPoint"), this.visualPoint.scaleX = 1, this.visualPoint.scaleY = 1, this.visualPoint.visible = !1, this.visual.setDepth(99999), this.visualPoint.setDepth(99999)
    }
    setPos(i, s) {
        this.x = i, this.y = s
    }
    switchHand() {
        let i = this.visualPoint.scaleX,
            s = this.visualPoint.x,
            t = this.visualPoint.y,
            h = this.visualPoint.visible;
        this.visualPoint.destroy(), this.visualPoint = this.baseScene.add.sprite(this.x, this.y, "handPointBlood").setDepth(999999), this.visualPoint.scaleX = i, this.visualPoint.scaleY = i, this.visualPoint.x = s, this.visualPoint.y = t, this.visualPoint.visible = h
    }
    getPosX() {
        return this.x
    }
    getPosY() {
        return this.y
    }
    setDragging(i) {
        this.entity = i
    }
    releaseDragging() {
        this.entity = null
    }
    getDragging() {
        return this.entity
    }
    setPointing(i) {
        i ? this.visual.visible && (this.visual.visible = !1, this.visualPoint.visible = !0, this.visualPoint.scaleX = 1.05, this.visualPoint.scaleY = 1.05, setTimeout(() => {
            this.visualPoint.scaleX = 1.02, this.visualPoint.scaleY = 1.02, setTimeout(() => {
                this.visualPoint.scaleX = 1, this.visualPoint.scaleY = 1
            }, 100)
        }, 50)) : this.visual.visible || (this.visual.visible = !0, this.visualPoint.visible = !1)
    }
    update(i) {
        if (this.entity) {
            let i = this.x - this.entity.x,
                s = this.y - this.entity.y,
                t = (Math.sqrt(i * i + s * s), .12 * i - .3 * this.entity.velX),
                h = .12 * s - .3 * this.entity.velY;
            this.entity.addVel(t, h)
        }
        let s = this.x - this.visual.x,
            t = this.y - this.visual.y;
        this.visual.x = this.x + .2 * s / i, this.visual.y = this.y + .2 * t / i, this.visualPoint.x = this.x, this.visualPoint.y = this.y
    }
}