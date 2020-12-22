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
            let handler = this.eventsMap.get(name);
            if (handler) {
                let has = handler.some((value) => value.context === context && value.listener === listener);
                if (!has) {
                    handler.push({ listener, context, once });
                    this.eventsMap.set(name, handler);
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
                    let handler = this.eventsMap.get(target);
                    if (handler) {
                        if (listener && context) {
                            this.removeHandler2(handler, listener, context);
                        } else {
                            this.removeHandler(handler, context);
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
            let handler = this.eventsMap.get(name);
            if (handler) {
                handler.map((value) => {
                    value.listener.call(value.context, ...args);
                    if (value.once) {
                        this.off(name, value.context, value.listener);
                    }
                });
            }
        }

        /**
         * Clear all handlers
         */
        public clear() {
            this.eventsMap.clear();
        }

        private removeHandler(handler: Handler[], target: any) {
            for (let i = handler.length - 1; i >= 0; --i) if (handler[i].context === target || handler[i].listener === target) handler.splice(i, 1);
        }

        private removeHandler2(handler: Handler[], listener: any, context: any) {
            for (let i = handler.length - 1; i >= 0; --i) if (handler[i].context === context && handler[i].listener === listener) handler.splice(i, 1);
        }
    }
}
