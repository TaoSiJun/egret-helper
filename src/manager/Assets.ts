namespace h {
    class AssetsManager {
        private movieClipFactory: { [name: string]: egret.MovieClipDataFactory } = {};
        private dbFactory: { [srcName: string]: dragonBones.EgretFactory } = {};

        private createDbFactory(srcName: string, dbName?: string, dbScale?: number) {
            let factory = new dragonBones.EgretFactory();
            let ske = RES.getRes(srcName + '_ske_json') || RES.getRes(srcName + '_ske_dbbin');
            let json = RES.getRes(srcName + '_tex_json');
            let png = RES.getRes(srcName + '_tex_png');
            factory.parseDragonBonesData(ske, dbName, dbScale);
            factory.parseTextureAtlasData(json, png, dbName, dbScale);
            return factory;
        }

        /**
         * 创建一个骨架显示对象
         * @param srcName 资源名字
         * @param armatureName 骨架名字
         * @param dbName 实例缓存名字 没有则用实例中的name
         */
        public buildArmatureDisplay(srcName: string, armatureName: string, dbName?: string) {
            if (!this.dbFactory[srcName]) {
                this.dbFactory[srcName] = this.createDbFactory(srcName, dbName);
            }
            return this.dbFactory[srcName].buildArmatureDisplay(armatureName, dbName);
        }

        /**
         * 创建一个粒子
         * @param name
         */
        public createParticle(name: string): particle.GravityParticleSystem {
            let data = RES.getRes(name + '_json');
            let texture = RES.getRes(name + '_png');
            let system = new particle.GravityParticleSystem(texture, data);
            return system;
        }

        private createFactory(name: string): egret.MovieClipDataFactory {
            if (this.movieClipFactory[name] === undefined) {
                let texture = RES.getRes(name + '_png');
                let data = RES.getRes(name + '_json');
                let factory = new egret.MovieClipDataFactory(data, texture);
                this.movieClipFactory[name] = factory;
            }
            return this.movieClipFactory[name];
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
            let factory = this.createFactory(name);
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
