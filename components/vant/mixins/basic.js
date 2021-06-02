const _my = require("../../../__antmove/api/index.js")(my);
const wx = _my;
function Behavior(behavior) {
    behavior.$id = Number(new Date()) + String(Math.random()).substring(2, 7);
    return behavior;
}

export const basic = Behavior({
    methods: {
        $emit(name, detail, options) {
            this.triggerEvent(name, detail, options);
        },

        set(data) {
            this.setData(data);
            return new Promise(resolve => wx.nextTick(resolve));
        }
    }
});
