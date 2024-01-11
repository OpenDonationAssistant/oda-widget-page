export interface IFontLoader {
  addFont(font: string):void;
}
export interface IFontProvider {
  addFontLoader(loader: IFontLoader):void;
}
