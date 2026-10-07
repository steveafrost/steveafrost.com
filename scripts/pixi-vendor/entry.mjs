import { extensions, ExtensionType } from 'pixi-core/extensions/Extensions.mjs';
import { WebGLRenderer } from 'pixi-core/rendering/renderers/gl/WebGLRenderer.mjs';
import { SchedulerSystem } from 'pixi-core/rendering/renderers/shared/SchedulerSystem.mjs';
import { GraphicsPipe } from 'pixi-core/scene/graphics/shared/GraphicsPipe.mjs';
import { GraphicsContextSystem } from 'pixi-core/scene/graphics/shared/GraphicsContextSystem.mjs';
// Pixi8.22's default renderer scheduler starts Ticker.system even without an
// Application. Replace that extension before renderer construction. No second RAF.
class SceneClockScheduler {
 static extension={type:ExtensionType.WebGLSystem,name:'scheduler',priority:0};
 init(){} repeat(){return 0;} cancel(){} destroy(){}
}
extensions.remove(SchedulerSystem);
extensions.add(SceneClockScheduler,GraphicsPipe,GraphicsContextSystem);
export {WebGLRenderer};
export {Container} from 'pixi-core/scene/container/Container.mjs';
export {Graphics} from 'pixi-core/scene/graphics/shared/Graphics.mjs';
export {GraphicsContext} from 'pixi-core/scene/graphics/shared/GraphicsContext.mjs';
