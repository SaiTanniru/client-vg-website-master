module.exports = function (attributes, prompt) {
    return function (scribe) {
        var imagePromptCommand = new scribe.api.Command('insertHTML');

        imagePromptCommand.nodeName = 'IMG';

        attributes = attributes || {};
        prompt = prompt || function() {
            return {
                src: window.prompt('Enter image url')
            }
        };

        if (typeof attributes == 'function') {
            prompt = attributes;
            attributes = {};
        } else {
            attributes = attributes || {};
        }

        imagePromptCommand.execute = function () {
            var io = prompt();

            Object.keys(io).forEach(function(key){
                attributes[key] = io[key];
            })

            if (!attributes.src) return false;

            var img = document.createElement('img');

            Object.keys(attributes).forEach(function(key){
                img.setAttribute(key, attributes[key])
            })

            var div = document.createElement('div');

            div.appendChild(img);

            scribe.api.SimpleCommand.prototype.execute.call(this, div.innerHTML);
        };

        scribe.commands.imagePrompt = imagePromptCommand;
    };
}