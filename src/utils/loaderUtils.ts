import { Assets, Texture } from "pixi.js";

export async function loadBundle(bundleName: string): Promise<Texture[]> {
  const textureFile = await fetch("/textureMap.json");
  const textureMap = await textureFile.json();

  // @ts-ignore
  Assets.addBundle(bundleName, textureMap[bundleName]);

  const response = await Assets.loadBundle(bundleName);

  return response;
}
