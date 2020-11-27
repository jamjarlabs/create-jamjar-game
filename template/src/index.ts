{{!--
Copyright 2020 JamJar Authors

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
--}}

import {
    Game,
    Vector,
    WebGLSystem,
    FullscreenSystem,
    KeyboardSystem,
    PointerSystem,
    EntityManager,
    MessageBus,
    TextSystem,
    Renderable,
    IMessageBus
} from "jamjar"

class JamJarGame extends Game {
    constructor(messageBus: IMessageBus) {
        super(messageBus, "{{game_name}}");
    }

    OnStart(): void {

    }
}

const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
const gl = canvas.getContext("webgl2", { alpha: false });
if (!gl) {
    throw ("WebGL2 not supported in this browser")
}

const messageBus = new MessageBus();

new EntityManager(messageBus);
new WebGLSystem(messageBus, gl);
new PointerSystem(messageBus, canvas);
new KeyboardSystem(messageBus, document);
new FullscreenSystem(messageBus, canvas, document);

const shooter = new JamJarGame(messageBus);

shooter.Start();
