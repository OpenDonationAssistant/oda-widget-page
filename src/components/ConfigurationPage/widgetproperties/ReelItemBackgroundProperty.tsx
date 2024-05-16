import { ChangeEvent, ReactNode } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import axios from "axios";
import classes from "./ReelItemBackgroundProperty.module.css";

export class ReelItemBackgroundProperty extends DefaultWidgetProperty {
  constructor(widgetId: string, value: string) {
    super(
      widgetId,
      "backgroundImage",
      "predefined",
      value,
      "Фон карточек",
      "prizes",
    );
  }

  uploadFile(file: File) {
    return axios.put(
      `${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${file.name}`,
      { file: file },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  }

  handleBackgroundImageChange(
    e: ChangeEvent<HTMLInputElement>,
    updateConfig: Function,
  ) {
    if (e.target.files) {
      const file = e.target.files[0];
      this.uploadFile(file).then((ignore) => {
        updateConfig(this.widgetId, "backgroundImage", file.name);
      });
    }
  }

  copy(): ReelItemBackgroundProperty {
    return new ReelItemBackgroundProperty(this.widgetId, this.value);
  }

  markup(updateConfig: Function): ReactNode {
    return (
      <>
        <div className={`${classes.itembackcontainer}`}>
          <div className={`${classes.itembacklabel}`}>Фон карточек</div>
          <label className={`upload-button ${classes.itembackuploadbutton}`}>
            <input
              type="file"
              onChange={(e) =>
                this.handleBackgroundImageChange(e, updateConfig)
              }
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
