import { Preset } from "../types/Preset";

export class PresetStore {
  public for(type: string): Preset[] {
    if (type === "donaton") {
      return [
        new Preset({
          name: "donaton-1",
          properties: [
            {
              name: "text",
              value: "Стрим будет идти еще <time>",
            },
            {
              name: "titleFont",
              value: {
                size: 35,
                color: {
                  angle: 0,
                  colors: [
                    {
                      color: "rgb(219, 216, 233)",
                    },
                  ],
                  gradient: false,
                  repeating: false,
                  gradientType: 0,
                },
                family: "Stalinist One",
                italic: false,
                weight: false,
                animation: "pulse",
                underline: false,
                shadowColor: "rgb(35, 48, 159)",
                shadowWidth: 2,
                animationType: "entire",
                shadowOffsetX: 1,
                shadowOffsetY: 2,
              },
            },
            {
              name: "backgroundColor",
              value: {
                angle: 90,
                colors: [
                  {
                    color: "rgb(179, 46, 46)",
                  },
                  {
                    color: "rgb(182, 185, 62)",
                  },
                  {
                    color: "rgb(179, 46, 46)",
                  },
                ],
                gradient: true,
                repeating: false,
                gradientType: 0,
              },
            },
            {
              name: "border",
              value: {
                top: {
                  type: "solid",
                  color: "#000000",
                  width: 5,
                },
                left: {
                  type: "solid",
                  color: "#000000",
                  width: 5,
                },
                right: {
                  type: "solid",
                  color: "#000000",
                  width: 5,
                },
                bottom: {
                  type: "solid",
                  color: "#000000",
                  width: 5,
                },
                isSame: true,
              },
            },
            {
              name: "padding",
              value: {
                top: 30,
                left: 30,
                right: 30,
                bottom: 30,
                isSame: true,
              },
            },
            {
              name: "rounding",
              value: {
                isSame: true,
                topLeft: 30,
                topRight: 0,
                bottomLeft: 0,
                bottomRight: 0,
              },
            },
          ],
          showcase: "https://api.oda.digital/presets/donaton-1.gif",
        }),
        new Preset({
          name: "donaton-2",
          properties: [
            {
              name: "text",
              value: "Осталось: <time>",
            },
            {
              name: "preset",
              value: "",
            },
            {
              name: "titleFont",
              value: {
                size: 35,
                color: {
                  angle: 0,
                  colors: [
                    {
                      color: "rgb(209, 39, 16)",
                    },
                  ],
                  gradient: false,
                  repeating: false,
                  gradientType: 0,
                },
                family: "Cormorant SC",
                italic: false,
                weight: true,
                animation: "none",
                underline: false,
                shadowColor: "rgb(0, 0, 0)",
                shadowWidth: 2,
                animationType: "entire",
                shadowOffsetX: 0,
                shadowOffsetY: 2,
              },
            },
            {
              name: "backgroundColor",
              value: {
                angle: 90,
                colors: [
                  {
                    color: "rgba(255, 255, 255, 0)",
                  },
                ],
                gradient: false,
                repeating: false,
                gradientType: 0,
              },
            },
            {
              name: "border",
              value: {
                top: {
                  type: "solid",
                  color: "#000000",
                  width: 0,
                },
                left: {
                  type: "solid",
                  color: "rgb(230, 18, 18)",
                  width: 0,
                },
                right: {
                  type: "solid",
                  color: "#000000",
                  width: 0,
                },
                bottom: {
                  type: "solid",
                  color: "rgb(237, 6, 6)",
                  width: 5,
                },
                isSame: false,
              },
            },
            {
              name: "padding",
              value: {
                top: 5,
                left: 5,
                right: 5,
                bottom: 5,
                isSame: true,
              },
            },
            {
              name: "rounding",
              value: {
                isSame: false,
                topLeft: 0,
                topRight: 0,
                bottomLeft: 0,
                bottomRight: 0,
              },
            },
          ],
          showcase: "https://api.oda.digital/presets/donaton-2.gif",
        }),
        new Preset({
          name: "donaton-3",
          properties: [
            {
              name: "text",
              value: "!Донатон <time>",
            },
            {
              name: "titleFont",
              value: {
                size: 35,
                color: {
                  angle: 0,
                  colors: [
                    {
                      color: "rgb(209, 39, 16)",
                    },
                  ],
                  gradient: false,
                  repeating: false,
                  gradientType: 0,
                },
                family: "Pattaya",
                italic: false,
                weight: true,
                animation: "none",
                underline: false,
                shadowColor: "rgb(0, 0, 0)",
                shadowWidth: 2,
                animationType: "entire",
                shadowOffsetX: 0,
                shadowOffsetY: 2,
              },
            },
            {
              name: "backgroundColor",
              value: {
                angle: 90,
                colors: [
                  {
                    color: "rgba(199, 149, 44, 0.5)",
                  },
                ],
                gradient: false,
                repeating: false,
                gradientType: 0,
              },
            },
            {
              name: "border",
              value: {
                top: {
                  type: "solid",
                  color: "#000000",
                  width: 0,
                },
                left: {
                  type: "solid",
                  color: "rgb(230, 18, 18)",
                  width: 0,
                },
                right: {
                  type: "solid",
                  color: "#000000",
                  width: 0,
                },
                bottom: {
                  type: "solid",
                  color: "rgb(237, 6, 6)",
                  width: 5,
                },
                isSame: null,
              },
            },
            {
              name: "padding",
              value: {
                top: 25,
                left: 25,
                right: 25,
                bottom: 25,
                isSame: true,
              },
            },
            {
              name: "rounding",
              value: {
                isSame: true,
                topLeft: 60,
                topRight: 0,
                bottomLeft: 0,
                bottomRight: 0,
              },
            },
          ],
          showcase: "https://api.oda.digital/presets/donaton-3.gif",
        }),
        new Preset({
          name: "donaton-4",
          showcase: "https://api.oda.digital/presets/donaton-4.gif",
          properties: [
            {
              name: "text",
              value: " <time>",
            },
            {
              name: "titleFont",
              value: {
                size: 35,
                color: {
                  angle: 0,
                  colors: [
                    {
                      color: "rgb(0, 0, 0)",
                    },
                  ],
                  gradient: false,
                  repeating: false,
                  gradientType: 0,
                },
                family: "Pattaya",
                italic: false,
                weight: true,
                animation: "none",
                underline: false,
                shadowColor: "rgb(190, 15, 15)",
                shadowWidth: 2,
                animationType: "entire",
                shadowOffsetX: 0,
                shadowOffsetY: 2,
              },
            },
            {
              name: "backgroundColor",
              value: {
                angle: 90,
                colors: [
                  {
                    color: "rgb(255, 255, 255)",
                  },
                ],
                gradient: false,
                repeating: false,
                gradientType: 0,
              },
            },
            {
              name: "border",
              value: {
                top: {
                  type: "groove",
                  color: "#000000",
                  width: 5,
                },
                left: {
                  type: "groove",
                  color: "rgb(230, 18, 18)",
                  width: 5,
                },
                right: {
                  type: "groove",
                  color: "#000000",
                  width: 5,
                },
                bottom: {
                  type: "groove",
                  color: "rgb(237, 6, 6)",
                  width: 5,
                },
                isSame: true,
              },
            },
            {
              name: "padding",
              value: {
                top: 15,
                left: 15,
                right: 15,
                bottom: 15,
                isSame: true,
              },
            },
            {
              name: "rounding",
              value: {
                isSame: true,
                topLeft: 60,
                topRight: 0,
                bottomLeft: 0,
                bottomRight: 0,
              },
            },
          ],
        }),
        new Preset({
          name: "donaton-5",
          showcase: "https://api.oda.digital/presets/donaton-5.gif",
          properties: [
            {
              name: "text",
              value: " <time>",
            },
            {
              name: "titleFont",
              value: {
                size: 35,
                color: {
                  angle: 0,
                  colors: [
                    {
                      color: "rgb(255, 255, 255)",
                    },
                  ],
                  gradient: false,
                  repeating: false,
                  gradientType: 0,
                },
                family: "Pattaya",
                italic: false,
                weight: true,
                animation: "tada",
                underline: false,
                shadowColor: "rgb(0, 0, 0)",
                shadowWidth: 2,
                animationType: "entire",
                shadowOffsetX: 2,
                shadowOffsetY: 2,
              },
            },
            {
              name: "backgroundColor",
              value: {
                angle: 90,
                colors: [
                  {
                    color: "rgba(255, 255, 255, 0)",
                  },
                ],
                gradient: false,
                repeating: false,
                gradientType: 0,
              },
            },
            {
              name: "border",
              value: {
                top: {
                  type: "groove",
                  color: "#000000",
                  width: 5,
                },
                left: {
                  type: "groove",
                  color: "rgb(230, 18, 18)",
                  width: 5,
                },
                right: {
                  type: "groove",
                  color: "#000000",
                  width: 5,
                },
                bottom: {
                  type: "groove",
                  color: "rgb(237, 6, 6)",
                  width: 5,
                },
                isSame: null,
              },
            },
            {
              name: "padding",
              value: {
                top: 5,
                left: 5,
                right: 5,
                bottom: 5,
                isSame: null,
              },
            },
            {
              name: "rounding",
              value: {
                isSame: null,
                topLeft: 60,
                topRight: 0,
                bottomLeft: 0,
                bottomRight: 0,
              },
            },
          ],
        }),
        new Preset({
          name: "donaton-6",
          showcase: "https://api.oda.digital/presets/donaton-6.gif",
          properties: [
            {
              name: "text",
              value: " <time>",
            },
            {
              name: "titleFont",
              value: {
                size: 50,
                color: {
                  angle: 0,
                  colors: [
                    {
                      color: "rgb(255, 255, 255)",
                    },
                  ],
                  gradient: false,
                  repeating: false,
                  gradientType: 0,
                },
                family: "Rubik Mono One",
                italic: false,
                weight: true,
                animation: "none",
                underline: false,
                shadowColor: "rgb(0, 0, 0)",
                shadowWidth: 0,
                animationType: "entire",
                shadowOffsetX: 0,
                shadowOffsetY: 0,
              },
            },
            {
              name: "backgroundColor",
              value: {
                angle: 0,
                colors: [
                  {
                    color: "rgba(255, 255, 255, 0)",
                  },
                  {
                    color: "rgb(218, 165, 12)",
                  },
                  {
                    color: "rgba(255, 255, 255, 0)",
                  },
                ],
                gradient: true,
                repeating: false,
                gradientType: 0,
              },
            },
            {
              name: "border",
              value: {
                top: {
                  type: "solid",
                  color: "rgb(169, 164, 47)",
                  width: 5,
                },
                left: {
                  type: "solid",
                  color: "rgb(169, 164, 47)",
                  width: 5,
                },
                right: {
                  type: "solid",
                  color: "rgb(169, 164, 47)",
                  width: 5,
                },
                bottom: {
                  type: "solid",
                  color: "rgb(169, 164, 47)",
                  width: 5,
                },
                isSame: null,
              },
            },
            {
              name: "padding",
              value: {
                top: 20,
                left: 20,
                right: 20,
                bottom: 20,
                isSame: true,
              },
            },
            {
              name: "rounding",
              value: {
                isSame: true,
                topLeft: 4,
                topRight: 0,
                bottomLeft: 0,
                bottomRight: 0,
              },
            },
          ],
        }),
      ];
    }
    if (type === "donation-timer") {
      return [
        new Preset({
          name: "donation-timer-1",
          properties: [
            {
              name: "resetOnLoad",
              value: true,
            },
            {
              name: "text",
              value: "Без донатов уже <time>",
            },
            {
              name: "titleFont",
              value: {
                size: 24,
                color: {
                  angle: 0,
                  colors: [
                    {
                      color: "rgb(0, 0, 0)",
                    },
                  ],
                  gradient: false,
                  repeating: false,
                  gradientType: 0,
                },
                family: "Play",
                italic: false,
                weight: true,
                animation: "none",
                underline: false,
                shadowColor: "rgb(255, 255, 255)",
                shadowWidth: 0,
                animationType: "entire",
                shadowOffsetX: 0,
                shadowOffsetY: 0,
              },
            },
            {
              name: "backgroundColor",
              value: {
                angle: 0,
                colors: [
                  {
                    color: "rgb(255, 255, 255)",
                  },
                ],
                gradient: false,
                repeating: false,
                gradientType: 0,
              },
            },
            {
              name: "border",
              value: {
                top: {
                  type: "solid",
                  color: "#000000",
                  width: 5,
                },
                left: {
                  type: "solid",
                  color: "#000000",
                  width: 5,
                },
                right: {
                  type: "solid",
                  color: "#000000",
                  width: 5,
                },
                bottom: {
                  type: "solid",
                  color: "#000000",
                  width: 5,
                },
                isSame: true,
              },
            },
            {
              name: "rounding",
              value: {
                isSame: true,
                topLeft: 30,
                topRight: 0,
                bottomLeft: 0,
                bottomRight: 0,
              },
            },
          ],
          showcase: "https://api.oda.digital/presets/donation-timer-1.gif",
        }),
        new Preset({
          name: "donation-timer-2",
          properties: [
            {
              name: "preset",
              value: "donation-timer",
            },
            {
              name: "resetOnLoad",
              value: true,
            },
            {
              name: "text",
              value: "Без донатов уже <time>",
            },
            {
              name: "titleFont",
              value: {
                size: 24,
                color: {
                  angle: 0,
                  colors: [
                    {
                      color: "rgb(217, 13, 13)",
                    },
                  ],
                  gradient: false,
                  repeating: false,
                  gradientType: 0,
                },
                family: "Russo One",
                italic: false,
                weight: true,
                animation: "pulse",
                underline: false,
                shadowColor: "rgb(255, 255, 255)",
                shadowWidth: 0,
                animationType: "entire",
                shadowOffsetX: 0,
                shadowOffsetY: 0,
              },
            },
            {
              name: "backgroundColor",
              value: {
                angle: 0,
                colors: [
                  {
                    color: "rgba(255, 255, 255, 0)",
                  },
                ],
                gradient: false,
                repeating: false,
                gradientType: 0,
              },
            },
            {
              name: "border",
              value: {
                top: {
                  type: "solid",
                  color: "#000000",
                  width: 0,
                },
                left: {
                  type: "solid",
                  color: "#000000",
                  width: 0,
                },
                right: {
                  type: "solid",
                  color: "#000000",
                  width: 0,
                },
                bottom: {
                  type: "solid",
                  color: "rgb(217, 13, 13)",
                  width: 5,
                },
                isSame: false,
              },
            },
            {
              name: "rounding",
              value: {
                isSame: null,
                topLeft: 30,
                topRight: 0,
                bottomLeft: 0,
                bottomRight: 0,
              },
            },
          ],
          showcase: "https://api.oda.digital/presets/donation-timer-2.gif",
        }),
        new Preset({
          name: "donation-timer-3",
          showcase: "https://api.oda.digital/presets/donation-timer-3.gif",
          properties: [
            {
              name: "preset",
              value: "donation-timer",
            },
            {
              name: "resetOnLoad",
              value: true,
            },
            {
              name: "text",
              value: "Без донатов уже <time>",
            },
            {
              name: "titleFont",
              value: {
                size: 24,
                color: {
                  angle: 0,
                  colors: [
                    {
                      color: "rgb(255, 255, 255)",
                    },
                  ],
                  gradient: false,
                  repeating: false,
                  gradientType: 0,
                },
                family: "Press Start 2P",
                italic: false,
                weight: true,
                animation: "flash",
                underline: false,
                shadowColor: "rgb(0, 0, 0)",
                shadowWidth: 2,
                animationType: "entire",
                shadowOffsetX: 0,
                shadowOffsetY: 0,
              },
            },
            {
              name: "backgroundColor",
              value: {
                angle: 0,
                colors: [
                  {
                    color: "rgba(255, 255, 255, 0)",
                  },
                ],
                gradient: false,
                repeating: false,
                gradientType: 0,
              },
            },
            {
              name: "border",
              value: {
                top: {
                  type: "solid",
                  color: "#000000",
                  width: 0,
                },
                left: {
                  type: "solid",
                  color: "#000000",
                  width: 0,
                },
                right: {
                  type: "solid",
                  color: "#000000",
                  width: 0,
                },
                bottom: {
                  type: "solid",
                  color: "rgb(217, 13, 13)",
                  width: 5,
                },
                isSame: null,
              },
            },
            {
              name: "rounding",
              value: {
                isSame: null,
                topLeft: 30,
                topRight: 0,
                bottomLeft: 0,
                bottomRight: 0,
              },
            },
          ],
        }),
        new Preset({
          name: "donation-timer-4",
          showcase: "https://api.oda.digital/presets/donation-timer-4.gif",
          properties: [
            {
              name: "preset",
              value: "donation-timer",
            },
            {
              name: "resetOnLoad",
              value: true,
            },
            {
              name: "text",
              value: "Без донатов уже <time>",
            },
            {
              name: "titleFont",
              value: {
                size: 30,
                color: {
                  angle: 0,
                  colors: [
                    {
                      color: "rgb(255, 255, 255)",
                    },
                  ],
                  gradient: false,
                  repeating: false,
                  gradientType: 0,
                },
                family: "Exo 2",
                italic: false,
                weight: true,
                animation: "none",
                underline: false,
                shadowColor: "rgb(0, 0, 0)",
                shadowWidth: 2,
                animationType: "entire",
                shadowOffsetX: 0,
                shadowOffsetY: 0,
              },
            },
            {
              name: "backgroundColor",
              value: {
                angle: 180,
                colors: [
                  {
                    color: "rgba(255, 255, 255, 0.5)",
                  },
                  {
                    color: "rgb(220, 38, 12)",
                  },
                  {
                    color: "rgba(255, 255, 255, 0.5)",
                  },
                ],
                gradient: true,
                repeating: false,
                gradientType: 0,
              },
            },
            {
              name: "border",
              value: {
                top: {
                  type: "solid",
                  color: "rgb(255, 255, 255)",
                  width: 0,
                },
                left: {
                  type: "solid",
                  color: "rgb(255, 255, 255)",
                  width: 0,
                },
                right: {
                  type: "solid",
                  color: "rgb(255, 255, 255)",
                  width: 0,
                },
                bottom: {
                  type: "solid",
                  color: "rgb(255, 255, 255)",
                  width: 0,
                },
                isSame: true,
              },
            },
            {
              name: "rounding",
              value: {
                isSame: true,
                topLeft: 60,
                topRight: 0,
                bottomLeft: 0,
                bottomRight: 0,
              },
            },
          ],
        }),
        new Preset({
          name: "donation-timer-5",
          showcase: "https://api.oda.digital/presets/donation-timer-5.gif",
          properties: [
            {
              name: "preset",
              value: "donation-timer",
            },
            {
              name: "resetOnLoad",
              value: true,
            },
            {
              name: "text",
              value: "Без донатов уже <time>",
            },
            {
              name: "titleFont",
              value: {
                size: 30,
                color: {
                  angle: 0,
                  colors: [
                    {
                      color: "rgb(255, 255, 255)",
                    },
                  ],
                  gradient: false,
                  repeating: false,
                  gradientType: 0,
                },
                family: "Cormorant SC",
                italic: false,
                weight: true,
                animation: "none",
                underline: false,
                shadowColor: "rgb(0, 0, 0)",
                shadowWidth: 2,
                animationType: "entire",
                shadowOffsetX: 0,
                shadowOffsetY: 0,
              },
            },
            {
              name: "backgroundColor",
              value: {
                angle: 90,
                colors: [
                  {
                    color: "rgba(255, 255, 255, 0)",
                  },
                  {
                    color: "rgb(220, 38, 12)",
                  },
                  {
                    color: "rgba(255, 255, 255, 0)",
                  },
                ],
                gradient: true,
                repeating: false,
                gradientType: 0,
              },
            },
            {
              name: "border",
              value: {
                top: {
                  type: "solid",
                  color: "rgb(255, 255, 255)",
                  width: 5,
                },
                left: {
                  type: "solid",
                  color: "rgb(255, 255, 255)",
                  width: 0,
                },
                right: {
                  type: "solid",
                  color: "rgb(255, 255, 255)",
                  width: 0,
                },
                bottom: {
                  type: "solid",
                  color: "rgb(255, 255, 255)",
                  width: 5,
                },
                isSame: false,
              },
            },
            {
              name: "rounding",
              value: {
                isSame: null,
                topLeft: 1,
                topRight: 0,
                bottomLeft: 0,
                bottomRight: 0,
              },
            },
          ],
        }),
        new Preset({
          name: "donation-timer-6",
          showcase: "https://api.oda.digital/presets/donation-timer-6.gif",
          properties: [
            {
              name: "preset",
              value: "donation-timer",
            },
            {
              name: "text",
              value: "Без донатов уже <time>",
            },
            {
              name: "titleFont",
              value: {
                size: 24,
                color: {
                  angle: 0,
                  colors: [
                    {
                      color: "rgb(217, 133, 13)",
                    },
                  ],
                  gradient: false,
                  repeating: false,
                  gradientType: 0,
                },
                family: "Rubik Mono One",
                italic: false,
                weight: true,
                animation: "none",
                underline: false,
                shadowColor: "rgb(0, 0, 0)",
                shadowWidth: 3,
                animationType: "entire",
                shadowOffsetX: 0,
                shadowOffsetY: 0,
              },
            },
            {
              name: "textAlign",
              value: "center",
            },
            {
              name: "backgroundColor",
              value: {
                angle: 0,
                colors: [
                  {
                    color: "rgba(255, 255, 255, 0.2)",
                  },
                ],
                gradient: false,
                repeating: false,
                gradientType: 0,
              },
            },
            {
              name: "border",
              value: {
                top: {
                  type: "solid",
                  color: "#000000",
                  width: 0,
                },
                left: {
                  type: "solid",
                  color: "#000000",
                  width: 0,
                },
                right: {
                  type: "solid",
                  color: "#000000",
                  width: 0,
                },
                bottom: {
                  type: "solid",
                  color: "rgb(217, 13, 13)",
                  width: 5,
                },
                isSame: null,
              },
            },
            {
              name: "rounding",
              value: {
                isSame: true,
                topLeft: 40,
                topRight: 40,
                bottomLeft: 40,
                bottomRight: 40,
              },
            },
            {
              name: "padding",
              value: {
                top: 4,
                left: 0,
                right: 0,
                bottom: 0,
                isSame: false,
              },
            },
            {
              name: "boxShadow",
              value: {
                shadows: [
                  {
                    x: 0,
                    y: 0,
                    blur: 10,
                    color: "#000000",
                    inset: false,
                    spread: 10,
                  },
                ],
              },
            },
            {
              name: "blur",
              value: {
                blur: 7,
                enabled: true,
              },
            },
          ],
        }),
        new Preset({
          name: "donation-timer-7",
          showcase: "https://api.oda.digital/presets/donation-timer-7.gif",
          properties: [
            {
              name: "preset",
              value: "donation-timer",
            },
            {
              name: "text",
              value: "Без донатов уже <time>",
            },
            {
              name: "titleFont",
              value: {
                size: 34,
                color: {
                  angle: 0,
                  colors: [
                    {
                      color: "rgb(217, 209, 13)",
                    },
                  ],
                  gradient: false,
                  repeating: false,
                  gradientType: 0,
                },
                family: "Pattaya",
                italic: false,
                weight: true,
                outline: {
                  color: "rgb(207, 148, 19)",
                  width: 2,
                  enabled: true,
                },
                animation: "none",
                underline: false,
                shadowColor: "rgb(255, 255, 255)",
                shadowWidth: 50,
                animationType: "entire",
                shadowOffsetX: 0,
                shadowOffsetY: 0,
              },
            },
            {
              name: "textAlign",
              value: "center",
            },
            {
              name: "backgroundColor",
              value: {
                angle: 0,
                colors: [
                  {
                    color: "rgba(255, 255, 255, 0)",
                  },
                ],
                gradient: false,
                repeating: false,
                gradientType: 0,
              },
            },
            {
              name: "border",
              value: {
                top: {
                  type: "solid",
                  color: "#000000",
                  width: 0,
                },
                left: {
                  type: "solid",
                  color: "#000000",
                  width: 0,
                },
                right: {
                  type: "solid",
                  color: "#000000",
                  width: 0,
                },
                bottom: {
                  type: "solid",
                  color: "rgb(217, 13, 13)",
                  width: 5,
                },
                isSame: null,
              },
            },
            {
              name: "rounding",
              value: {
                isSame: true,
                topLeft: 40,
                topRight: 40,
                bottomLeft: 40,
                bottomRight: 40,
              },
            },
            {
              name: "padding",
              value: {
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                isSame: false,
              },
            },
            {
              name: "boxShadow",
              value: {
                shadows: [],
              },
            },
            {
              name: "blur",
              value: {
                blur: 7,
                enabled: false,
              },
            },
          ],
        }),
      ];
    }
    return [];
  }
}
