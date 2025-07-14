import { ChangeEvent, ReactNode, useEffect, useState } from "react";
import { DefaultWidgetProperty } from "./WidgetProperty";
import axios from "axios";
import classes from "./ReelItemBackgroundProperty.module.css";
import { uuidv7 } from "uuidv7";
import { observer } from "mobx-react-lite";

const ReelBackgroundComponent = observer(
  ({ property }: { property: ReelItemBackgroundProperty }) => {
    const [image, setImage] = useState<string>("");

    const fullUri = (): Promise<string> => {
      if (!property.value) {
        return Promise.resolve("");
      }
      let url = property.value;
      if (!property.value.startsWith("http")) {
        url = `${process.env.REACT_APP_FILE_API_ENDPOINT}/files/${property.value}`;
      }
      // TODO: вынести в общий модуль
      return fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access-token")}`,
        },
      })
        .then((res) => res.blob())
        .then((blob) => URL.createObjectURL(blob));
    };

    useEffect(() => {
      fullUri().then(setImage);
    }, [property.value]);

    return (
      <>
        <div className={`${classes.itembackcontainer}`}>
          <div className={`${classes.itembacklabel}`}>Фон карточек</div>
          <label className={`upload-button ${classes.itembackuploadbutton}`}>
            <input
              type="file"
              onChange={(e) => property.handleBackgroundImageChange(e)}
            />
            Загрузить изображение
          </label>
        </div>
        {property.value && (
          <img className={`${classes.backgroundimage}`} src={image} />
        )}
      </>
    );
  },
);

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

  public copy() {
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
    return <ReelBackgroundComponent property={this} />;
  }
}
