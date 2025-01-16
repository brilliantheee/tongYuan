import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        //频谱数据
        data: {},
        satellites: []
    },
    mutations: {
        updateData(state, data) {
            state.data = data;
        },
        addSatellites(state,data){
            let arr=[];
            arr.push({
                id:data.ID[0],
                name:data.name[0],
                tleLine1:data.tleline1[0],
                tleLine2:data.tleline2[0],
                time:data.local_time,
                seconds:data.last_time,
            })
            state.satellites=arr;
        }
    },
    actions: {},
    modules: {}
})
