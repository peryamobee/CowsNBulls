/**
 * Created by pery on 30/03/2016.
 */
var $$ = document.querySelectorAll.bind(document);
var $ = document.querySelector.bind(document);

window.h = {
    component: function ( name ,type, initcb) {
        var component = $('[data-component='+name+'][data-type='+type+']');
        var behaviors = new Map();

        component.addEventListener('click', function(evt){
            var target = evt.target;
            for( let [cmp,fnc]  of behaviors){
                var component = target.closest('[data-behavior='+cmp+']');
                if (component) {
                    fnc.call(component)
                }
            }

        });

        initcb && initcb( behavior,inputs );
        
        function behavior(type, func){
            behaviors.set(type, func);
        }

        function inputs(type){
            return $('input[data-ref='+type+']');
            // return new Proxy( $('input[data-ref='+type+']'),{
                // set: function(target, prop, value, receiver) {
                //     target[prop] = value;
                //     return receiver;
                // }
            // } )
        }

        return behavior;
    }

};