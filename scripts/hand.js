class Hand {
    constructor(scene) {
        this.baseScene = scene;
        this.x = -999;
        this.y = -999;
        this.isGrabbing = false;
        this.entity = null;
        this.visual = scene.add.sprite(this.x, this.y, "hand");
        this.visual.scaleX = 0.95;
        this.visual.scaleY = 0.95;
        this.visualPoint = scene.add.sprite(this.x, this.y, "handPoint");
        this.visualPoint.scaleX = 1;
        this.visualPoint.scaleY = 1;
        this.visualPoint.visible = false;
        this.visual.setDepth(99999);
        this.visualPoint.setDepth(99999);
    }
    setPos(i, s) {
        this.x = i;
        this.y = s;
    }
    switchHand() {
        let i = this.visualPoint.scaleX, s = this.visualPoint.x, t = this.visualPoint.y, h = this.visualPoint.visible;
        this.visualPoint.destroy();
        this.visualPoint = this.baseScene.add.sprite(this.x, this.y, "handPointBlood").setDepth(999999);
        this.visualPoint.scaleX = i;
        this.visualPoint.scaleY = i;
        this.visualPoint.x = s;
        this.visualPoint.y = t;
        this.visualPoint.visible = h;
    }
    getPosX() {
        return this.x;
    }
    getPosY() {
        return this.y;
    }
    setDragging(i) {
        this.entity = i;
    }
    releaseDragging() {
        this.entity = null;
    }
    getDragging() {
        return this.entity;
    }
    setPointing(i) {
        if (i) {
            if (this.visual.visible) {
                this.visual.visible = false;
                this.visualPoint.visible = true;
                this.visualPoint.scaleX = 1.05;
                this.visualPoint.scaleY = 1.05;
                setTimeout(() => {
                    this.visualPoint.scaleX = 1.02;
                    this.visualPoint.scaleY = 1.02;
                    setTimeout(() => {
                        this.visualPoint.scaleX = 1;
                        this.visualPoint.scaleY = 1;
                    }, 100);
                }, 50);
            }
        } else if (!this.visual.visible) {
            this.visual.visible = true;
            this.visualPoint.visible = false;
        }
    }
    update(i) {
        if (this.entity) {
            let i = this.x - this.entity.x, s = this.y - this.entity.y, t = (Math.sqrt(i * i + s * s), 
            0.12 * i - 0.3 * this.entity.velX), h = 0.12 * s - 0.3 * this.entity.velY;
            this.entity.addVel(t, h);
        }
        let s = this.x - this.visual.x, t = this.y - this.visual.y;
        this.visual.x = this.x + 0.2 * s / i;
        this.visual.y = this.y + 0.2 * t / i;
        this.visualPoint.x = this.x;
        this.visualPoint.y = this.y;
    }
}
