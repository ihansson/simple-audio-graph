"use strict";

const Graph = {
    create: function(args) {
        const graph = Object.create(this);
        graph.init(args)
        return graph
    },
    init: function(args) {
        this.$wrapper = args.$wrapper
        this.type = args.$type
    },
    render: function(data){
        
    }
}