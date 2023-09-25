import { Assets, Texture } from "pixi.js";
import textureMap from "../assets/textureMap.json";

export async function loadBundle(bundleName: string): Promise<Texture[]> {
  Assets.addBundle(bundleName, textureMap[bundleName]);

  const response = await Assets.loadBundle(bundleName);

  return response;
}
