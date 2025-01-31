import { makeAutoObservable, toJS } from "mobx";
import { CSSProperties, createContext } from "react";

export class AlertState {

  private _image: string | null = null;
  private _video: string | null = null;
  private _imageStyle: CSSProperties = {};
  private _imageClassName: string = "";
  private _message: string | null = null;
  private _messageStyle: CSSProperties = {};
  private _messageClassName: string = "";
  private _title: string | null = null;
  private _titleStyle: CSSProperties = {};
  private _titleClassName: string = "";
  private _images: string[] = [];
  private _fonts: string[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  public clear(){
    this._image = null;
    this._video = null;
    this._imageStyle = {};
    this._imageClassName = "";
    this._message = null;
    this._messageStyle = {};
    this._messageClassName = "";
    this._title = null;
    this._titleStyle = {};
    this._titleClassName = "";
  }

  public get image(): string | null {
    return this._image;
  }

  public get video(): string | null {
    return this._video;
  }

  public get imageStyle(): CSSProperties {
    return toJS(this._imageStyle);
  }

  public get imageClassName(): string {
    return this._imageClassName;
  }

  public get message(): string | null {
    return this._message;
  }

  public get messageStyle(): CSSProperties {
    return toJS(this._messageStyle);
  }

  public get messageClassName(): string {
    return this._messageClassName;
  }

  public get title(): string | null {
    return this._title;
  }

  public get titleStyle(): CSSProperties {
    return toJS(this._titleStyle);
  }

  public get titleClassName(): string {
    return this._titleClassName;
  }

  public get images(): string[] {
    return this._images;
  }

  public get fonts(): string[] {
      return this._fonts;
  }

  public set image(image: string | null) {
    this._image = image;
  }

  public set video(video: string | null) {
    this._video = video;
  }

  public set imageStyle(imageStyle: CSSProperties) {
    this._imageStyle = imageStyle;
  }

  public set imageClassName(imageClassName: string) {
    this._imageClassName = imageClassName;
  }

  public set message(message: string | null) {
    this._message = message;
  }

  public set messageStyle(messageStyle: CSSProperties) {
    this._messageStyle = messageStyle;
  }

  public set messageClassName(messageClassName: string) {
    this._messageClassName = messageClassName;
  }

  public set title(title: string | null) {
    this._title = title;
  }

  public set titleStyle(titleStyle: CSSProperties) {
    this._titleStyle = titleStyle;
  }

  public set titleClassName(titleClassName: string) {
    this._titleClassName = titleClassName;
  }

  public set images(images: string[]) {
    this._images = images;
  }

  public set fonts(fonts: string[]) {
    this._fonts = fonts;
  }

}

export const AlertStateContext = createContext(new AlertState());
