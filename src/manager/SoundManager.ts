namespace h {
    export class SoundManager {
        private _soundsChannel: Record<string, egret.SoundChannel> = {};
        private _sounds: Record<string, egret.Sound> = {};
        private _quiet: boolean = false;
        private _soundQuiet: boolean = false;
        private _musicQuiet: boolean = false;
        private _currentMusicName: string;
        private _currentMusicVolume: number;

        /**
         * @default false
         */
        public set quiet(value: boolean) {
            this._quiet = value;
            if (value) {
                this.stopAllSounds();
            }
        }

        public get quiet() {
            return this._quiet;
        }

        /**
         * @default false
         */
        public set soundQuiet(value: boolean) {
            this._soundQuiet = value;
            if (value) {
                for (let name in this._soundsChannel) if (name !== this._currentMusicName) this.stopSound(name);
            }
        }

        public get soundQuiet() {
            return this._soundQuiet;
        }

        /**
         * @default false
         */
        public set musicQuiet(value: boolean) {
            this._musicQuiet = value;
            if (value) {
                this.stopMusic();
            } else {
                this.playMusic(this._currentMusicName, this._currentMusicVolume);
            }
        }

        public get musicQuiet() {
            return this._musicQuiet;
        }

        private load(name: string, volume: number = 1, loops: number = 1) {
            if (!name || !volume) return;
            let play = (sound: egret.Sound) => {
                if (sound == null) {
                    throw new Error("Play sound failed.");
                }
                this._sounds[name] = sound;
                this._soundsChannel[name] = sound.play(0, loops);
                this._soundsChannel[name].volume = volume;
            };
            if (this._sounds[name]) {
                if (loops < 1) {
                    this.stopSound(name);
                }
                play(this._sounds[name]);
            } else {
                RES.getResAsync(name + "_mp3", play, this);
            }
        }

        /**
         * @param name The sound name
         * @param volume The volume, 0 - 1
         * @param loops Plays, default 1, less than or equal to 0, to loop
         */
        public playSound(name: string, volume: number = 1, loops: number = 1) {
            if (this.quiet || this.soundQuiet) return;
            this.load(name, volume, loops);
        }

        /**
         * @param name The sound name
         * @param destory Destroy the sound resource, defalut false
         */
        public stopSound(name: string, destory: boolean = false) {
            if (this._soundsChannel[name]) {
                this._soundsChannel[name].stop();
                delete this._soundsChannel[name];
                if (destory) {
                    RES.destroyRes(name + "_mp3");
                }
            }
        }

        public stopAllSounds() {
            for (let name in this._soundsChannel) {
                this.stopSound(name);
            }
        }

        public playMusic(name: string, volume: number = 1) {
            if (this.quiet || this.musicQuiet) return;
            this._currentMusicName = name;
            this._currentMusicVolume = volume;
            this.load(name, volume, -1);
        }

        public stopMusic() {
            this.stopSound(this._currentMusicName);
        }

        public resumeMusic() {
            if (this._currentMusicName) {
                this.playMusic(this._currentMusicName, this._currentMusicVolume);
            }
        }
    }
}
