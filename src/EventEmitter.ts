namespace h {
    interface Handler {
        listener: Function;
        context: any;
        once: boolean;
    }

    export class EventEmitter<EventName = any> {
        private eventsMap: Map<EventName, Handler[]> = new Map();

        /**
         * Register an event handler
         * @param name
         * @param context
         * @param listener
         * @param once Delete after callback
         */
        public on(name: EventName, context: any, listener: Function, once: boolean = false) {
            let handler = this.eventsMap.get(name);
            if (handler) {
                let has = handler.some((value) => value.context === context && value.listener === listener);
                if (!has) {
                    handler.push({ listener, context, once });
                    this.eventsMap.set(name, handler);
                } else {
                    console.warn("EventEmitter already had", name);
                }
            } else {
                this.eventsMap.set(name, [{ listener, context, once }]);
            }
        }

        /**
         * Remove an event handler
         * @param name
         * @param context
         * @param listener
         */
        public off(name: EventName, context: any, listener?: Function) {
            let handler = this.eventsMap.get(name);
            if (handler) {
                if (listener) {
                    handler.splice(
                        handler.findIndex((value) => {
                            return value.listener === listener && value.context === context;
                        }),
                        1
                    );
                } else {
                    for (let i = handler.length; i >= 0; --i) if (handler[i].context === context) handler.splice(i, 1);
                }
            }
        }

        public once(name: EventName, context: any, listener?: Function) {
            this.on(name, context, listener, true);
        }

        /**
         * Emit all handlers for the given event name
         * @param name
         * @param args
         */
        public emit(name: EventName, ...args: any[]) {
            (this.eventsMap.get(name) || []).map((value) => {
                value.listener.call(value.context, ...args);
                if (value.once) {
                    this.off(name, value.context, value.listener);
                }
            });
        }

        /**
         * Clear all handlers
         */
        public clear() {
            this.eventsMap.clear();
        }
    }
}
