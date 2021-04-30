namespace h {
    /**
     * egret相关资源管理
     * @private
     */
    class AssetsManager {
        private movieClipFactory: { [name: string]: egret.MovieClipDataFactory } = {};
        private dbFactory: { [srcName: string]: dragonBones.EgretFactory } = {};

        private createMcFactory(name: string): egret.MovieClipDataFactory {
            if (!this.movieClipFactory[name]) {
                let texture = RES.getRes(name + "_png");
                let data = RES.getRes(name + "_json");
                let factory = new egret.MovieClipDataFactory(data, texture);
                this.movieClipFactory[name] = factory;
            }
            return this.movieClipFactory[name];
        }

        private createDbFactory(srcName: string, split: number) {
            let factory = new dragonBones.EgretFactory();
            let ske = RES.getRes(srcName + "_ske_json") || RES.getRes(srcName + "_ske_dbbin");
            if (split) {
                while (split-- > 0) {
                    let json = RES.getRes(srcName + "_tex_" + split + "_json");
                    let png = RES.getRes(srcName + "_tex_" + split + "_png");
                    factory.parseDragonBonesData(ske);
                    factory.parseTextureAtlasData(json, png);
                }
            } else {
                let json = RES.getRes(srcName + "_tex_json");
                let png = RES.getRes(srcName + "_tex_png");
                factory.parseDragonBonesData(ske);
                factory.parseTextureAtlasData(json, png);
            }
            return factory;
        }

        /**
         * 创建一个骨架显示对象
         * @param srcName 资源名字
         * @param armatureName 骨架名字
         * @param split 图集资源分割数量
         */
        public buildArmatureDisplay(srcName: string, armatureName: string, split?: number) {
            if (!this.dbFactory[srcName]) {
                this.dbFactory[srcName] = this.createDbFactory(srcName, split);
            }
            return this.dbFactory[srcName].buildArmatureDisplay(armatureName);
        }

        /**
         * 创建一个粒子
         * @param name JSON file name
         * @param textureName
         */
        public createParticle(name: string, textureName?: string): particle.GravityParticleSystem {
            let data = RES.getRes(name + "_json");
            let texture = RES.getRes((textureName || name) + "_png");
            let system = new particle.GravityParticleSystem(texture, data);
            return system;
        }

        /**
         * 创建一个序列帧
         * @param name 资源名字
         * @param movieClipName 序列帧名字
         */
        public createMovieClip(name: string, movieClipName?: string): egret.MovieClip {
            if (movieClipName === undefined) {
                movieClipName = name;
            }
            let factory = this.createMcFactory(name);
            let movieclip = new egret.MovieClip(factory.generateMovieClipData(movieClipName));
            return movieclip;
        }

        public clearMovieClipFactory(): void {
            for (let k in this.movieClipFactory) {
                this.movieClipFactory[k].clearCache();
                delete this.movieClipFactory[k];
            }
        }
    }
    export const assets = new AssetsManager();
}
