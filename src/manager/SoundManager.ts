namespace h {
    class SoundManager {
        private _soundChannel: Record<string, egret.SoundChannel> = {};
        private _sound: Record<string, egret.Sound> = {};
        private _quiet: boolean = false;
        private _path: string = "resource/sounds";

        /**
         * The sound resource path
         * @default "resource/sounds"
         */
        public set path(value: string) {
            this._path = value;
        }

        /**
         * @default false
         */
        public set quiet(value: boolean) {
            if (value) {
                this.stopAllSounds();
            }
            this._quiet = value;
        }

        public get quiet() {
            return this._quiet;
        }

        /**
         * @param name The sound name
         * @param volume The volume, 0 - 1
         * @param loops Plays, default 1, less than or equal to 0, to loop
         */
        public playSound(name: string, volume: number = 1, loops: number = 1) {
            if (this._quiet) return;
            let play = (sound: egret.Sound) => {
                this._sound[name] = sound;
                this._soundChannel[name] = sound.play(0, loops);
                this._soundChannel[name].volume = volume;
            };
            if (this._sound[name]) {
                if (loops < 1) this.stopSound(name);
                play(this._sound[name]);
            } else {
                RES.getResByUrl(this._path + "/" + name, play, this, RES.ResourceItem.TYPE_SOUND);
            }
        }

        /**
         * @param name The sound name
         * @param destory Destroy the sound resource, defalut false
         */
        public stopSound(name: string, destory: boolean = false) {
            if (this._soundChannel[name]) {
                this._soundChannel[name].stop();
                delete this._soundChannel[name];
                if (destory) {
                    RES.destroyRes(this._path + "/" + name);
                }
            }
        }

        public stopAllSounds() {
            for (let name in this._soundChannel) {
                this.stopSound(name);
            }
        }
    }
    export const sound = new SoundManager();
}
