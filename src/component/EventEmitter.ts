namespace h {
    interface Handler {
        listener: Function;
        context: any;
        once: boolean;
    }

    export class EventEmitter<Event = any> {
        private eventsMap: Map<Event, Handler[]> = new Map();

        /**
         * Register an event handler
         * @param name
         * @param context
         * @param listener
         * @param once
         */
        public on(name: Event, listener: Function, context: any, once: boolean = false) {
            let handlers = this.eventsMap.get(name);
            if (handlers) {
                let has = handlers.some((value) => value.context === context && value.listener === listener);
                if (!has) {
                    handlers.push({ listener, context, once });
                    this.eventsMap.set(name, handlers);
                } else {
                    console.warn("EventEmitter already on", name);
                }
            } else {
                this.eventsMap.set(name, [{ listener, context, once }]);
            }
        }

        /**
         * Remove an event handler
         * @param target name/listener/context
         * @param listener
         * @param context
         */
        public off(target: Event | Function | object, listener?: Function, context?: any) {
            switch (typeof target) {
                case "string":
                    let handlers = this.eventsMap.get(target);
                    if (handlers) {
                        if (listener && context) {
                            this.removeHandler2(handlers, listener, context);
                        } else {
                            this.removeHandler(handlers, context);
                        }
                    }
                    break;
                case "object":
                case "function":
                    this.eventsMap.forEach((handler, name) => {
                        this.removeHandler(handler, target);
                        if (handler.length === 0) {
                            this.eventsMap.delete(name);
                        }
                    });
                    break;
            }
        }

        /**
         * Register an event handler just emit once
         */
        public once(name: Event, listener: Function, context: any) {
            this.on(name, listener, context, true);
        }

        /**
         * Emit all handlers for the given event name
         * @param name
         * @param args
         */
        public emit(name: Event, ...args: any[]) {
            let handlers = this.eventsMap.get(name);
            if (handlers) {
                handlers.map((value) => {
                    value.listener.call(value.context, ...args);
                    if (value.once) {
                        this.off(name, value.context, value.listener);
                    }
                });
            }
        }

        /**
         * Check the handler had register
         * @param name 
         * @param listener 
         * @param context 
         */
        public has(name: Event, listener: Function, context: any) {
            return (this.eventsMap.get(name) || []).some((value) => value.context === context && value.listener === listener);
        }

        /**
         * Clear all handlers
         */
        public clear() {
            this.eventsMap.clear();
        }

        private removeHandler(handlers: Handler[], target: any) {
            for (let i = handlers.length - 1; i >= 0; --i) if (handlers[i].context === target || handlers[i].listener === target) handlers.splice(i, 1);
        }

        private removeHandler2(handlers: Handler[], listener: any, context: any) {
            for (let i = handlers.length - 1; i >= 0; --i) if (handlers[i].context === context && handlers[i].listener === listener) handlers.splice(i, 1);
        }
    }
}
