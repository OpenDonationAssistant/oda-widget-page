import { ChangeEvent, ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import axios from "axios";
import classes from "./ReelItemBackgroundProperty.module.css";
import { uuidv7 } from "uuidv7";

export class ReelItemBackgroundProperty extends DefaultWidgetProperty<
  string | null
> {
  constructor() {
    super({
      name: "backgroundImage",
      value: null,
      displayName: "Фон карточек",
    });
  }

  public copy(){
    const copy = new ReelItemBackgroundProperty();
    copy.value = this._value;
    return copy;
  }

  uploadFile(file: File, name: string) {
    return axios.put(
      `${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${name}`,
      { file: file },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  }

  handleBackgroundImageChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const file = e.target.files[0];
      const name = uuidv7();
      this.uploadFile(file, name).then(() => {
        this.value = name;
      });
    }
  }

  markup(): ReactNode {
    return (
      <>
        <div className={`${classes.itembackcontainer}`}>
          <div className={`${classes.itembacklabel}`}>Фон карточек</div>
          <label className={`upload-button ${classes.itembackuploadbutton}`}>
            <input
              type="file"
              onChange={(e) => this.handleBackgroundImageChange(e)}
            />
            Загрузить изображение
          </label>
        </div>
        {this.value && (
          <img
            className={`${classes.backgroundimage}`}
            src={`${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${this.value}`}
          />
        )}
      </>
    );
  }
}
