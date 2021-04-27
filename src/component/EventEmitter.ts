namespace h {
    interface Handler {
        listener: Function;
        context: any;
        once: boolean;
    }

    export class EventEmitter<Event = any> {
        private map: Map<Event, Handler[]> = new Map();
        /**
         * Register an event handler
         * @param name
         * @param context
         * @param listener
         * @param once
         */
        public on(name: Event, listener: Function, context: any, once: boolean = false) {
            let handlers = this.map.get(name);
            if (handlers) {
                let has = this.has(name, listener, context);
                if (!has) {
                    handlers.unshift({ listener, context, once });
                    this.map.set(name, handlers);
                } else {
                    console.warn("EventEmitter already on", name);
                }
            } else {
                this.map.set(name, [{ listener, context, once }]);
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
                    let handlers = this.map.get(target);
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
                    this.map.forEach((handler, name) => {
                        this.removeHandler(handler, target);
                        if (handler.length === 0) {
                            this.map.delete(name);
                        }
                    });
                    break;
                default:
                    console.error("Event Emitter Type Error", target);
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
            let handlers = this.map.get(name);
            if (handlers) {
                for (let i = handlers.length - 1; i > -1; --i) {
                    let handler = handlers[i];
                    handler.listener.call(handler.context, ...args);
                    if (handler.once) {
                        handlers.splice(i, 1);
                    }
                }
            }
        }
        /**
         * Check the handler had register
         * @param name
         * @param listener
         * @param context
         */
        public has(name: Event, listener: Function, context: any) {
            return (this.map.get(name) || []).some((handler) => this.checkHandler(handler, listener, context));
        }
        /**
         * Clear all handlers
         */
        public clear() {
            this.map.clear();
        }

        private checkHandler(value: Handler, listener: any, context: any) {
            return value.listener === listener && value.context === context;
        }

        private removeHandler(handlers: Handler[], target: any) {
            for (let i = handlers.length - 1; i >= 0; --i) if (handlers[i].context === target || handlers[i].listener === target) handlers.splice(i, 1);
        }

        private removeHandler2(handlers: Handler[], listener: any, context: any) {
            for (let i = handlers.length - 1; i >= 0; --i) if (handlers[i].context === context && handlers[i].listener === listener) handlers.splice(i, 1);
        }
    }
}
