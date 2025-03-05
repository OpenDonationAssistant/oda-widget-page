import { makeAutoObservable, toJS } from "mobx";
import { CSSProperties, createContext } from "react";
import { LayoutPropertyValue } from "../../components/ConfigurationPage/widgetsettings/alerts/LayoutProperty";

export class AlertState {
  private _layout: LayoutPropertyValue = {
    value: "1",
    imageStartPoint: null,
    headerStartPoint: null,
    messageStartPoint: null,
  };

  private _totalClassName = "";
  private _totalAnimationDuration: CSSProperties = {};
  private _totalHeight: CSSProperties = {};
  private _totalHeightStyle: CSSProperties = { height: "100%" };
  private _totalWidth: CSSProperties = {};
  private _totalWidthStyle: CSSProperties = { width: "100%" };
  private _totalBorder: CSSProperties = {};
  private _totalBackgroundColor: CSSProperties = {};
  private _totalBackgroundImage: CSSProperties = {};
  private _totalRounding: CSSProperties = {};
  private _totalPadding: CSSProperties = {};
  private _totalShadow: CSSProperties = {};
  private _image: string | null = null;
  private _video: string | null = null;
  private _imageStyle: CSSProperties = {};
  private _imageShadowStyle: CSSProperties = {};
  private _imageClassName: string = "";
  private _showMessage: boolean = true;
  private _message: string | null = null;
  private _messageStyle: CSSProperties = {};
  private _messageImageStyle: CSSProperties = {};
  private _messageClassName: string = "";
  private _messageContainerClassName = "";
  private _showTitle: boolean = true;
  private _title: string | null = null;
  private _titleStyle: CSSProperties = {};
  private _titleClassName: string = "";
  private _titleImageStyle: CSSProperties = {};
  private _headerClassName = "";
  private _headerStyle: CSSProperties = {};
  private _images: string[] = [];
  private _fonts: string[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  public clearTotal() {
    this._totalClassName = "";
    this._totalAnimationDuration = {};
    this._totalHeight = {};
    this._totalHeightStyle = { height: "100%" };
    this._totalWidth = {};
    this._totalWidthStyle = { width: "100%" };
    this._totalBorder = {};
    this._totalBackgroundColor = {};
    this._totalBackgroundImage = {};
    this._totalRounding = {};
    this._totalPadding = {};
    this._totalShadow = {};
  }

  public clearImage() {
    this._image = null;
    this._video = null;
    this._imageStyle = {};
    this._imageShadowStyle = {};
    this._imageClassName = "";
  }

  public clearTitle() {
    this._showTitle = true;
    this._title = null;
    this._titleStyle = {};
    this._titleClassName = "";
    this._titleImageStyle = {};
    this._headerClassName = "";
  }

  public cleareMessage() {
    this._showMessage = true;
    this._message = null;
    this._messageStyle = {};
    this._messageImageStyle = {};
    this._messageClassName = "";
    this._messageContainerClassName = "";
  }

  public clear() {
    this._image = null;
    this._video = null;
    this._imageStyle = {};
    this._imageShadowStyle = {};
    this._imageClassName = "";
    this._message = null;
    this._messageStyle = {};
    this._messageImageStyle = {};
    this._messageClassName = "";
    this._title = null;
    this._titleStyle = {};
    this._titleClassName = "";
    this._titleImageStyle = {};
  }

  public get layout(): LayoutPropertyValue {
    return this._layout;
  }

  public get totalHeightStyle(): CSSProperties {
    return this._totalHeightStyle;
  }

  public get totalWidthStyle(): CSSProperties {
    return this._totalWidthStyle;
  }

  public get totalWidth(): CSSProperties {
    return this._totalWidth;
  }

  public get totalHeight(): CSSProperties {
    return this._totalHeight;
  }

  public get totalBorder(): CSSProperties {
    return toJS(this._totalBorder);
  }

  public get totalBackgroundColor(): CSSProperties {
    return toJS(this._totalBackgroundColor);
  }

  public get totalBackgroundImage(): CSSProperties {
    return toJS(this._totalBackgroundImage);
  }

  public get totalRounding(): CSSProperties {
    return toJS(this._totalRounding);
  }

  public get totalPadding(): CSSProperties {
    return toJS(this._totalPadding);
  }

  public get totalShadow(): CSSProperties {
    return toJS(this._totalShadow);
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

  public get imageShadowStyle(): CSSProperties {
    return toJS(this._imageShadowStyle);
  }

  public get imageClassName(): string {
    return this._imageClassName;
  }

  public get showMessage(): boolean {
    return this._showMessage;
  }

  public get message(): string | null {
    return this._message;
  }

  public get messageStyle(): CSSProperties {
    return toJS(this._messageStyle);
  }

  public get messageImageStyle(): CSSProperties {
    return toJS(this._messageImageStyle);
  }

  public get messageClassName(): string {
    return this._messageClassName;
  }

  public get showTitle(): boolean {
    return this._showTitle;
  }

  public get title(): string | null {
    return this._title;
  }

  public get titleStyle(): CSSProperties {
    return toJS(this._titleStyle);
  }

  public get titleImageStyle(): CSSProperties {
    return toJS(this._titleImageStyle);
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

  public set layout(layout: LayoutPropertyValue) {
    this._layout = layout;
  }

  public set totalWidthStyle(totalWidthStyle: CSSProperties) {
    this._totalWidthStyle = totalWidthStyle;
  }

  public set totalHeightStyle(totalHeightStyle: CSSProperties) {
    this._totalHeightStyle = totalHeightStyle;
  }

  public set totalWidth(totalWidth: CSSProperties) {
    this._totalWidth = totalWidth;
  }

  public set totalHeight(totalHeight: CSSProperties) {
    this._totalHeight = totalHeight;
  }

  public set totalBorder(totalBorder: CSSProperties) {
    this._totalBorder = totalBorder;
  }

  public set totalBackgroundColor(totalBackgroundColor: CSSProperties) {
    this._totalBackgroundColor = totalBackgroundColor;
  }

  public set totalBackgroundImage(totalBackgroundImage: CSSProperties) {
    this._totalBackgroundImage = totalBackgroundImage;
  }

  public set totalRounding(totalRounding: CSSProperties) {
    this._totalRounding = totalRounding;
  }

  public set totalPadding(totalPadding: CSSProperties) {
    this._totalPadding = totalPadding;
  }

  public set totalShadow(totalShadow: CSSProperties) {
    this._totalShadow = totalShadow;
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

  public set imageShadowStyle(imageShadowStyle: CSSProperties) {
    this._imageShadowStyle = imageShadowStyle;
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

  public set messageImageStyle(messageImageStyle: CSSProperties) {
    this._messageImageStyle = messageImageStyle;
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

  public set titleImageStyle(titleImageStyle: CSSProperties) {
    this._titleImageStyle = titleImageStyle;
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

  public set totalClassName(classname: string) {
    this._totalClassName = classname;
  }

  public get totalClassName(): string {
    return this._totalClassName;
  }

  public set headerClassName(classname: string) {
    this._headerClassName = classname;
  }

  public get headerClassName(): string {
    return this._headerClassName;
  }

  public set messageContainerClassName(classname: string) {
    this._messageContainerClassName = classname;
  }

  public get messageContainerClassName(): string {
    return this._messageContainerClassName;
  }

  public get totalAnimationDuration(): CSSProperties {
    return this._totalAnimationDuration;
  }

  public set totalAnimationDuration(props: CSSProperties) {
    this._totalAnimationDuration = props;
  }

  public set headerStyle(style: CSSProperties) {
    this._headerStyle = style;
  }

  public get headerStyle(): CSSProperties {
    return this._headerStyle;
  }
}

export const AlertStateContext = createContext(new AlertState());
