"use strict";

const Graph = {
    create: function(args) {
        const graph = Object.create(this);
        graph.init(args)
        return graph
    },
    init: function(args) {
        this.$wrapper = args.$wrapper
        this.type = args.type
        this.initCanvas()
    },
    initCanvas: function(){
        this.width = this.$wrapper.outerWidth();
        this.height = this.$wrapper.outerHeight();
        const $canvas = $('<canvas/>').attr('width',this.width).attr('height',this.height)
        this.$canvas = $canvas
        this.$wrapper.append($canvas)
        this.Context = $canvas[0].getContext("2d")
        this.memory = [];
    },
    render: function(data){
        this['render'+this.type](data)
    },
    renderWave: function(data){

    },
    renderBars: _.throttle(function(data){

        this.Context.clearRect(0, 0, this.width, this.height);

        const minPoint = 0;
        const maxPoint = 256;
        const zeroPoint = 128;
        const barWidth = 5;
        const bars = this.width / barWidth

        const dataPerPixel = Math.floor(data.length / bars)

        const newData = [];

        let dataPerBarItterator = 0;
        let singleBarValues = [];
        _.each(data,bit => {
            if(dataPerBarItterator < dataPerPixel){
                singleBarValues.push(bit)
                dataPerBarItterator++;
            }  else {
                newData.push(_.mean(singleBarValues))
                singleBarValues = [bit]
                dataPerBarItterator = 1
            }
        })
        if(singleBarValues.length) newData.push(_.mean(singleBarValues))

        this.Context.fillStyle = "rgba(255, 0, 0, 1)";

        _.each(newData, (bit, index) => {
            this.Context.fillRect(
                index * barWidth, // left 
                bit, // top
                barWidth - 1, // width
                this.height - bit // height
            );
        });

    },200),
    renderSeries: _.throttle(function(data){

        this.Context.clearRect(0, 0, this.width, this.height);

        const minPoint = 0;
        const maxPoint = 256;
        const zeroPoint = 128;

        const barWidth = 2;
        const bars = this.width / barWidth

        const barHeight = 2;
        const rows = this.height / barHeight
        const dataPerPixel = Math.floor(data.length / rows)

        const newData = [];

        let dataPerBarItterator = 0;
        let singleBarValues = [];
        _.each(data,bit => {
            if(dataPerBarItterator < dataPerPixel){
                singleBarValues.push(bit)
                dataPerBarItterator++;
            }  else {
                newData.push(_.mean(singleBarValues))
                singleBarValues = [bit]
                dataPerBarItterator = 1
            }
        })
        if(singleBarValues.length) newData.push(_.mean(singleBarValues))

        this.memory.unshift(newData)

        this.memory = this.memory.slice(0,this.bars)

        _.each(this.memory, (data, index) => {


            _.each(data, (bit, dataIndex) => {

                let red;
                if(bit > 0) red = 0;
                if(bit > 50) red = 50;
                if(bit > 100) red = 100;
                if(bit > 150) red = 150;
                if(bit > 200) red = 200;
                if(bit > 250) red = 250;

                this.Context.fillStyle = "rgba("+red+", 0, 0, 1)";

                this.Context.fillRect(
                    index * barWidth, // left 
                    dataIndex * barHeight, // top
                    barWidth, // width
                    barHeight // height
                );
            });

        })

    },10)
}