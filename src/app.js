"use strict";

const GraphApp = {
    create: function(args) {
        const app = Object.create(this);
        app.init(args)
        return app
    },
    init: function(args) {
        this.GraphA = Graph.create({
            type: 'Wave',
            $wrapper: args.$GraphA
        });
        this.GraphB = Graph.create({
            type: 'Bars',
            $wrapper: args.$GraphB
        });
        this.GraphC = Graph.create({
            type: 'Series',
            $wrapper: args.$GraphC
        });
        this.$toggleMute = args.$toggleMute
        this.runGraphExample();
    },
    runGraphExample: function() {

        // Settings
        let frequency = 440;
        let defaultVolume = 0.5;
        let volume = defaultVolume;

        // Audio Context
        const Context = new(window.AudioContext || window.webkitAudioContext)();

        // Nodes
        const oscillatorNode = Context.createOscillator()
        const oscillatorNodeB = Context.createOscillator()
        const gainNode = Context.createGain()
        const analyserNode = Context.createAnalyser()

        // Gain settings
        gainNode.gain.setValueAtTime(volume, Context.currentTime);

        // Oscillator A settings
        oscillatorNode.type = 'square';
        oscillatorNode.start();

        // Oscillator B settings
        oscillatorNodeB.type = 'triangle';
        oscillatorNodeB.start();

        // Analyser settings
        analyserNode.fftSize = 2048;
        const analyserDataArray = new Uint8Array(analyserNode.frequencyBinCount)

        // Connections
        oscillatorNode.connect(gainNode)
        oscillatorNodeB.connect(gainNode)
        gainNode.connect(analyserNode)
        analyserNode.connect(Context.destination)


        // Audio Loop
        let loops = 0;
        const loop = () => {
            // Set oscillator to random frequency
            oscillatorNode.frequency.setValueAtTime(this.getRandomCFrequency(), Context.currentTime);
            if (loops++ % 3 == 0) oscillatorNodeB.frequency.setValueAtTime(this.getRandomCFrequency(), Context.currentTime);


            window.setTimeout(loop, 250)

        }
        loop()

        const renderLoop = () => {
            // Update analyser data and render graphs
            analyserNode.getByteTimeDomainData(analyserDataArray);
            this.updateGraphs(analyserDataArray)
            window.requestAnimationFrame(renderLoop);

        }
        
        window.requestAnimationFrame(renderLoop);

        // Mute Button
        this.$toggleMute.on('click', e => {
            e.preventDefault()
            volume = volume ? 0 : defaultVolume
            gainNode.gain.setValueAtTime(volume, Context.currentTime);
        })




    },
    updateGraphs: function(analyserDataArray) {
        this.GraphA.render(analyserDataArray)
        this.GraphB.render(analyserDataArray)
        this.GraphC.render(analyserDataArray)
    },
    getRandomCFrequency: function() {
        const frequencies = [261.63, 293.66, 329.63, 349.23, 392, 440, 493.88, 523.25]
        return frequencies[Math.floor(Math.random() * frequencies.length)];
    }

}

const app = GraphApp.create({
    "$GraphA": $('#graphA'),
    "$GraphB": $('#graphB'),
    "$GraphC": $('#graphC'),
    "$toggleMute": $('#toggleMute')
})