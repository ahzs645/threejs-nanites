/** PGMaps-only culling switch; shared renderer defaults and distance/LOD rules stay unchanged. */
import * as THREE from 'three/webgpu';
import { NaniteRenderer, type View } from '../../src/nanite-lib/index.ts';
export class AdapterNaniteRenderer extends NaniteRenderer {
  frustumCulling = true;
  private readonly all = new THREE.Camera();
  override _cull(view: View, camera: THREE.Camera): void {
    // A finite very broad clip volume keeps both CPU chunk and GPU sphere tests enabled with the same all-visible result.
    this.all.projectionMatrix.makeScale(1e-10,1e-10,1e-10);
    super._cull(view,this.frustumCulling?camera:this.all);
  }
}
