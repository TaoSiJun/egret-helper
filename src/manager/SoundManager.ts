namespace h {
    class SoundManager {
        private _channelCache: { [name: string]: egret.SoundChannel } = {};
        private _musicChannel: egret.SoundChannel;
        private _quite: boolean;
        public currentMusic: string;

        public set quite(value: boolean) {
            this._quite = value;
            if (value) {
                this.stopAllSounds();
            }
        }
        public get quite() {
            return this._quite;
        }
        private async getSound(name: string): Promise<egret.Sound> {
            try {
                return await RES.getResAsync(name + "_mp3");
            } catch (error) {
                console.warn("Sound not found:", name);
            }
        }
        public playSound(name: string, vol: number = 1, loops: number = 1) {
            if (this.quite) {
                return;
            }
            this.getSound(name).then((sound) => {
                this._channelCache[name] = sound.play(0, loops);
                this._channelCache[name].volume = vol;
            });
        }
        public playMusic(name: string, vol: number = 1) {
            if (this.quite) {
                return;
            }
            this.getSound(name).then((sound) => {
                if (this._musicChannel) {
                    this._musicChannel.stop();
                }
                this._musicChannel = sound.play(0, -1);
                this._musicChannel.volume = vol;
                this.currentMusic = name;
            });
        }
        public stopAllSounds() {
            for (const name in this._channelCache) {
                this.stopSound(name);
            }
            this.stopMusic();
        }
        public stopSound(name: string) {
            if (this._channelCache[name]) {
                this._channelCache[name].stop();
                delete this._channelCache[name];
            }
        }
        public stopMusic() {
            if (this._musicChannel) {
                this._musicChannel.stop();
                this._musicChannel = null;
            }
        }
    }
    /**
     * 声音管理
     */
    export const sound = new SoundManager();
}
