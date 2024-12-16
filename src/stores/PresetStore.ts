import { Preset } from "../types/Preset";

export class PresetStore {
  public for(type: string): Preset[] {
    if (type === "donaton") {
      return [
        new Preset({
          name: "donaton-1",
          properties: [
            {
              name: "preset",
              value: "donaton",
            },
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
              value: "donaton",
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
              name: "preset",
              value: "donaton",
            },
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
              name: "preset",
              value: "donaton",
            },
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
              name: "preset",
              value: "donaton",
            },
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
              name: "preset",
              value: "donaton",
            },
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
    if (type === "player-popup") {
      return [
        new Preset({
          name: "player-popup-1",
          showcase: "https://api.oda.digital/presets/player-popup-1.gif",
          properties: [
            {
              name: "preset",
              value: "player-popup",
            },
            {
              name: "widgetBorder",
              value: {
                top: {
                  type: "solid",
                  color: "rgb(190, 75, 30)",
                  width: 2,
                },
                left: {
                  type: "solid",
                  color: "rgb(190, 75, 30)",
                  width: 2,
                },
                right: {
                  type: "solid",
                  color: "rgb(190, 75, 30)",
                  width: 2,
                },
                bottom: {
                  type: "solid",
                  color: "rgb(190, 75, 30)",
                  width: 2,
                },
                isSame: true,
              },
            },
            {
              name: "rounding",
              value: {
                isSame: true,
                topLeft: 30,
                topRight: 30,
                bottomLeft: 30,
                bottomRight: 30,
              },
            },
            {
              name: "boxShadow",
              value: {
                shadows: [
                  {
                    x: 0,
                    y: 0,
                    blur: 8,
                    color: "rgba(84, 8, 15, 0.5)",
                    inset: false,
                    spread: 16,
                  },
                ],
              },
            },
          ],
        }),
        new Preset({
          name: "player-popup-2",
          showcase: "https://api.oda.digital/presets/player-popup-2.gif",
          properties: [
            {
              name: "preset",
              value: "player-popup",
            },
            {
              name: "widgetBorder",
              value: {
                top: {
                  type: "solid",
                  color: "#000000",
                  width: 1,
                },
                left: {
                  type: "solid",
                  color: "#000000",
                  width: 1,
                },
                right: {
                  type: "solid",
                  color: "#000000",
                  width: 1,
                },
                bottom: {
                  type: "solid",
                  color: "#000000",
                  width: 1,
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
              name: "boxShadow",
              value: {
                shadows: [
                  {
                    x: 0,
                    y: 0,
                    blur: 8,
                    color: "#000000",
                    inset: false,
                    spread: 16,
                  },
                ],
              },
            },
          ],
        }),
        new Preset({
          name: "player-popup-3",
          showcase: "https://api.oda.digital/presets/player-popup-3.gif",
          properties: [
            {
              name: "preset",
              value: "player-popup",
            },
            {
              name: "widgetBorder",
              value: {
                top: {
                  type: "double",
                  color: "rgb(255, 0, 0)",
                  width: 4,
                },
                left: {
                  type: "double",
                  color: "rgb(255, 0, 0)",
                  width: 4,
                },
                right: {
                  type: "double",
                  color: "rgb(255, 0, 0)",
                  width: 4,
                },
                bottom: {
                  type: "double",
                  color: "rgb(255, 0, 0)",
                  width: 4,
                },
                isSame: true,
              },
            },
            {
              name: "rounding",
              value: {
                isSame: null,
                topLeft: 0,
                topRight: 0,
                bottomLeft: 0,
                bottomRight: 0,
              },
            },
            {
              name: "boxShadow",
              value: {
                shadows: [
                  {
                    x: 10,
                    y: 10,
                    blur: 10,
                    color: "#000000",
                    inset: false,
                    spread: 4,
                  },
                ],
              },
            },
          ],
        }),
      ];
    }
    if (type === "donation-goal") {
      return [
        new Preset({
          name: "donation-goal-1",
          showcase: "https://api.oda.digital/presets/donation-goal-1.png",
          properties: [
            {
              name: "preset",
              value: "donation-goal",
            },
            {
              name: "widgetBackgroundColor",
              value: {
                angle: 60,
                colors: [
                  {
                    color: "rgba(255, 255, 255, 0)",
                  },
                  {
                    color: "rgb(35, 169, 199)",
                  },
                  {
                    color: "#FFFFFF",
                  },
                ],
                gradient: false,
                repeating: false,
                gradientType: 0,
              },
            },
            {
              name: "backgroundImage",
              value: {
                url: null,
                size: "auto",
                repeat: false,
                opacity: 1,
              },
            },
            {
              name: "border",
              value: {
                top: {
                  type: "solid",
                  color: "rgb(0, 0, 0)",
                  width: 2,
                },
                left: {
                  type: "solid",
                  color: "rgb(0, 0, 0)",
                  width: 2,
                },
                right: {
                  type: "solid",
                  color: "rgb(0, 0, 0)",
                  width: 2,
                },
                bottom: {
                  type: "solid",
                  color: "rgb(0, 0, 0)",
                  width: 2,
                },
                isSame: null,
              },
            },
            {
              name: "padding",
              value: {
                top: 30,
                left: 15,
                right: 15,
                bottom: 30,
                isSame: false,
              },
            },
            {
              name: "rounding",
              value: {
                isSame: true,
                topLeft: 30,
                topRight: 30,
                bottomLeft: 30,
                bottomRight: 30,
              },
            },
            {
              name: "boxShadow",
              value: {
                shadows: [],
              },
            },
            {
              name: "titleBackgroundImage",
              value: {
                url: null,
                size: "auto",
                repeat: false,
                opacity: 1,
              },
            },
            {
              name: "descriptionFont",
              value: {
                size: 40,
                color: {
                  angle: 0,
                  colors: [
                    {
                      color: "rgb(231, 222, 22)",
                    },
                  ],
                  gradient: false,
                  repeating: false,
                  gradientType: 0,
                },
                family: "Jura",
                italic: false,
                weight: true,
                outline: {
                  color: "rgb(239, 233, 233)",
                  width: 1,
                  enabled: true,
                },
                animation: "none",
                underline: false,
                shadowColor: "#000000",
                shadowWidth: 1,
                animationType: "entire",
                shadowOffsetX: 1,
                shadowOffsetY: 1,
              },
            },
            {
              name: "titleTextAlign",
              value: "center",
            },
            {
              name: "titleBorder",
              value: {
                top: {
                  type: "solid",
                  color: "rgb(236, 5, 5)",
                  width: 2,
                },
                left: {
                  type: "solid",
                  color: "rgb(236, 5, 5)",
                  width: 2,
                },
                right: {
                  type: "solid",
                  color: "rgb(236, 5, 5)",
                  width: 2,
                },
                bottom: {
                  type: "solid",
                  color: "rgb(236, 5, 5)",
                  width: 2,
                },
                isSame: null,
              },
            },
            {
              name: "titlePadding",
              value: {
                top: 5,
                left: 45,
                right: 45,
                bottom: 5,
                isSame: false,
              },
            },
            {
              name: "titleRounding",
              value: {
                isSame: true,
                topLeft: 40,
                topRight: 40,
                bottomLeft: 40,
                bottomRight: 40,
              },
            },
            {
              name: "titleBackgroundColor",
              value: {
                angle: 0,
                colors: [
                  {
                    color: "rgba(43, 186, 35, 0)",
                  },
                ],
                gradient: false,
                repeating: false,
                gradientType: 0,
              },
            },
            {
              name: "titleBoxShadow",
              value: {
                shadows: [],
              },
            },
            {
              name: "outerImage",
              value: {
                url: "https://api.oda.digital/assets/kosmos_fon_sinij_73340_1920x1080-4215646997.jpg",
                size: "auto",
                repeat: false,
                opacity: 1,
              },
            },
            {
              name: "labelTemplate",
              value: "<collected>/<required>   ",
            },
            {
              name: "amountFont",
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
                family: "Play",
                italic: false,
                weight: true,
                outline: {
                  color: "rgb(5, 156, 183)",
                  width: 1,
                  enabled: true,
                },
                animation: "none",
                underline: false,
                shadowColor: "#000000",
                shadowWidth: 0,
                animationType: "entire",
                shadowOffsetX: 0,
                shadowOffsetY: 0,
              },
            },
            {
              name: "filledTextAlign",
              value: "left",
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
              name: "outerBorder",
              value: {
                top: {
                  type: "solid",
                  color: "#000000",
                  width: 2,
                },
                left: {
                  type: "solid",
                  color: "#000000",
                  width: 2,
                },
                right: {
                  type: "solid",
                  color: "#000000",
                  width: 2,
                },
                bottom: {
                  type: "solid",
                  color: "#000000",
                  width: 2,
                },
                isSame: true,
              },
            },
            {
              name: "outerRounding",
              value: {
                isSame: true,
                topLeft: 20,
                topRight: 20,
                bottomLeft: 20,
                bottomRight: 20,
              },
            },
            {
              name: "barPadding",
              value: {
                top: 10,
                left: 10,
                right: 10,
                bottom: 10,
                isSame: true,
              },
            },
            {
              name: "outerBoxShadow",
              value: {
                shadows: [
                  {
                    x: 0,
                    y: 0,
                    blur: 10,
                    color: "#000000",
                    inset: true,
                    spread: 10,
                  },
                  {
                    x: 0,
                    y: 0,
                    blur: 3,
                    color: "rgb(231, 222, 22)",
                    inset: false,
                    spread: 3,
                  },
                ],
              },
            },
            {
              name: "innerImage",
              value: {
                url: null,
                size: "auto",
                repeat: false,
                opacity: 1,
              },
            },
            {
              name: "filledColor",
              value: {
                angle: 90,
                colors: [
                  {
                    color: "rgb(151, 12, 12)",
                  },
                  {
                    color: "rgb(196, 189, 40)",
                  },
                  {
                    color: "rgb(36, 150, 12)",
                  },
                ],
                gradient: true,
                repeating: false,
                gradientType: 0,
              },
            },
            {
              name: "innerBorder",
              value: {
                top: {
                  type: "solid",
                  color: "rgb(0, 0, 0)",
                  width: 2,
                },
                left: {
                  type: "solid",
                  color: "rgb(0, 0, 0)",
                  width: 2,
                },
                right: {
                  type: "solid",
                  color: "rgb(0, 0, 0)",
                  width: 0,
                },
                bottom: {
                  type: "solid",
                  color: "rgb(0, 0, 0)",
                  width: 2,
                },
                isSame: null,
              },
            },
            {
              name: "innerRounding",
              value: {
                isSame: true,
                topLeft: 15,
                topRight: 15,
                bottomLeft: 15,
                bottomRight: 15,
              },
            },
            {
              name: "innerPadding",
              value: {
                top: 5,
                left: 5,
                right: 5,
                bottom: 5,
                isSame: true,
              },
            },
            {
              name: "innerBoxShadow",
              value: {
                shadows: [
                  {
                    x: 0,
                    y: 0,
                    blur: 10,
                    color: "rgb(27, 161, 49)",
                    inset: true,
                    spread: 10,
                  },
                ],
              },
            },
            {
              name: "blur",
              value: {
                blur: 10,
                enabled: false,
              },
            },
          ],
        }),
        new Preset({
          name: "donation-goal-2",
          showcase: "https://api.oda.digital/presets/donation-goal-2.png",
          properties: [
            {
              name: "preset",
              value: "donation-goal",
            },
            {
              name: "widgetBackgroundColor",
              value: {
                angle: 60,
                colors: [
                  {
                    color: "rgba(255, 255, 255, 0)",
                  },
                  {
                    color: "rgb(35, 169, 199)",
                  },
                  {
                    color: "#FFFFFF",
                  },
                ],
                gradient: false,
                repeating: false,
                gradientType: 0,
              },
            },
            {
              name: "backgroundImage",
              value: {
                url: null,
                size: "auto",
                repeat: false,
                opacity: 1,
              },
            },
            {
              name: "border",
              value: {
                top: {
                  type: "solid",
                  color: "rgb(0, 0, 0)",
                  width: 2,
                },
                left: {
                  type: "solid",
                  color: "rgb(0, 0, 0)",
                  width: 2,
                },
                right: {
                  type: "solid",
                  color: "rgb(0, 0, 0)",
                  width: 2,
                },
                bottom: {
                  type: "solid",
                  color: "rgb(0, 0, 0)",
                  width: 2,
                },
                isSame: null,
              },
            },
            {
              name: "padding",
              value: {
                top: 30,
                left: 15,
                right: 15,
                bottom: 30,
                isSame: false,
              },
            },
            {
              name: "rounding",
              value: {
                isSame: true,
                topLeft: 30,
                topRight: 30,
                bottomLeft: 30,
                bottomRight: 30,
              },
            },
            {
              name: "boxShadow",
              value: {
                shadows: [],
              },
            },
            {
              name: "titleBackgroundImage",
              value: {
                url: null,
                size: "auto",
                repeat: false,
                opacity: 1,
              },
            },
            {
              name: "descriptionFont",
              value: {
                size: 40,
                color: {
                  angle: 0,
                  colors: [
                    {
                      color: "rgb(231, 222, 22)",
                    },
                  ],
                  gradient: false,
                  repeating: false,
                  gradientType: 0,
                },
                family: "Jura",
                italic: false,
                weight: true,
                outline: {
                  color: "rgb(239, 233, 233)",
                  width: 1,
                  enabled: true,
                },
                animation: "none",
                underline: false,
                shadowColor: "#000000",
                shadowWidth: 1,
                animationType: "entire",
                shadowOffsetX: 1,
                shadowOffsetY: 1,
              },
            },
            {
              name: "titleTextAlign",
              value: "center",
            },
            {
              name: "titleBorder",
              value: {
                top: {
                  type: "solid",
                  color: "rgb(236, 5, 5)",
                  width: 2,
                },
                left: {
                  type: "solid",
                  color: "rgb(236, 5, 5)",
                  width: 2,
                },
                right: {
                  type: "solid",
                  color: "rgb(236, 5, 5)",
                  width: 2,
                },
                bottom: {
                  type: "solid",
                  color: "rgb(236, 5, 5)",
                  width: 2,
                },
                isSame: null,
              },
            },
            {
              name: "titlePadding",
              value: {
                top: 5,
                left: 45,
                right: 45,
                bottom: 5,
                isSame: false,
              },
            },
            {
              name: "titleRounding",
              value: {
                isSame: true,
                topLeft: 40,
                topRight: 40,
                bottomLeft: 40,
                bottomRight: 40,
              },
            },
            {
              name: "titleBackgroundColor",
              value: {
                angle: 0,
                colors: [
                  {
                    color: "rgba(43, 186, 35, 0)",
                  },
                ],
                gradient: false,
                repeating: false,
                gradientType: 0,
              },
            },
            {
              name: "titleBoxShadow",
              value: {
                shadows: [],
              },
            },
            {
              name: "outerImage",
              value: {
                url: null,
                size: "auto",
                repeat: false,
                opacity: 1,
              },
            },
            {
              name: "labelTemplate",
              value: "<collected>/<required>   ",
            },
            {
              name: "amountFont",
              value: {
                size: 40,
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
                family: "Play",
                italic: false,
                weight: true,
                outline: {
                  color: "rgb(0, 0, 0)",
                  width: 2,
                  enabled: true,
                },
                animation: "none",
                underline: false,
                shadowColor: "rgb(70, 30, 30)",
                shadowWidth: 5,
                animationType: "entire",
                shadowOffsetX: 0,
                shadowOffsetY: 0,
              },
            },
            {
              name: "filledTextAlign",
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
              name: "outerBorder",
              value: {
                top: {
                  type: "solid",
                  color: "#000000",
                  width: 2,
                },
                left: {
                  type: "solid",
                  color: "#000000",
                  width: 2,
                },
                right: {
                  type: "solid",
                  color: "#000000",
                  width: 2,
                },
                bottom: {
                  type: "solid",
                  color: "#000000",
                  width: 2,
                },
                isSame: true,
              },
            },
            {
              name: "outerRounding",
              value: {
                isSame: true,
                topLeft: 20,
                topRight: 20,
                bottomLeft: 20,
                bottomRight: 20,
              },
            },
            {
              name: "barPadding",
              value: {
                top: 10,
                left: 10,
                right: 10,
                bottom: 10,
                isSame: true,
              },
            },
            {
              name: "outerBoxShadow",
              value: {
                shadows: [
                  {
                    x: 0,
                    y: 0,
                    blur: 10,
                    color: "#000000",
                    inset: true,
                    spread: 10,
                  },
                  {
                    x: 0,
                    y: 0,
                    blur: 3,
                    color: "rgb(231, 222, 22)",
                    inset: false,
                    spread: 3,
                  },
                ],
              },
            },
            {
              name: "innerImage",
              value: {
                url: null,
                size: "auto",
                repeat: false,
                opacity: 1,
              },
            },
            {
              name: "filledColor",
              value: {
                angle: 90,
                colors: [
                  {
                    color: "rgb(231, 222, 22)",
                  },
                  {
                    color: "rgb(196, 189, 40)",
                  },
                  {
                    color: "rgb(36, 150, 12)",
                  },
                ],
                gradient: false,
                repeating: false,
                gradientType: 0,
              },
            },
            {
              name: "innerBorder",
              value: {
                top: {
                  type: "solid",
                  color: "rgb(0, 0, 0)",
                  width: 2,
                },
                left: {
                  type: "solid",
                  color: "rgb(0, 0, 0)",
                  width: 2,
                },
                right: {
                  type: "solid",
                  color: "rgb(0, 0, 0)",
                  width: 0,
                },
                bottom: {
                  type: "solid",
                  color: "rgb(0, 0, 0)",
                  width: 2,
                },
                isSame: null,
              },
            },
            {
              name: "innerRounding",
              value: {
                isSame: false,
                topLeft: 15,
                topRight: 0,
                bottomLeft: 15,
                bottomRight: 0,
              },
            },
            {
              name: "innerPadding",
              value: {
                top: 5,
                left: 5,
                right: 5,
                bottom: 5,
                isSame: true,
              },
            },
            {
              name: "innerBoxShadow",
              value: {
                shadows: [],
              },
            },
            {
              name: "blur",
              value: {
                blur: 10,
                enabled: false,
              },
            },
          ],
        }),
        new Preset({
          name: "donation-goal-3",
          showcase: "https://api.oda.digital/presets/donation-goal-3.png",
          properties: [
            {
              name: "preset",
              value: "donation-goal",
            },
            {
              name: "widgetBackgroundColor",
              value: {
                angle: 60,
                colors: [
                  {
                    color: "rgba(255, 255, 255, 0)",
                  },
                  {
                    color: "rgb(35, 169, 199)",
                  },
                  {
                    color: "#FFFFFF",
                  },
                ],
                gradient: false,
                repeating: false,
                gradientType: 0,
              },
            },
            {
              name: "backgroundImage",
              value: {
                url: "https://api.oda.digital/assets/kosmos_fon_sinij_73340_1920x1080-4215646997.jpg",
                size: "auto",
                repeat: false,
                opacity: 1,
              },
            },
            {
              name: "border",
              value: {
                top: {
                  type: "solid",
                  color: "rgb(0, 0, 0)",
                  width: 2,
                },
                left: {
                  type: "solid",
                  color: "rgb(0, 0, 0)",
                  width: 2,
                },
                right: {
                  type: "solid",
                  color: "rgb(0, 0, 0)",
                  width: 2,
                },
                bottom: {
                  type: "solid",
                  color: "rgb(0, 0, 0)",
                  width: 2,
                },
                isSame: true,
              },
            },
            {
              name: "padding",
              value: {
                top: 30,
                left: 15,
                right: 15,
                bottom: 30,
                isSame: false,
              },
            },
            {
              name: "rounding",
              value: {
                isSame: true,
                topLeft: 30,
                topRight: 30,
                bottomLeft: 30,
                bottomRight: 30,
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
              name: "titleBackgroundImage",
              value: {
                url: null,
                size: "auto",
                repeat: false,
                opacity: 1,
              },
            },
            {
              name: "descriptionFont",
              value: {
                size: 40,
                color: {
                  angle: 0,
                  colors: [
                    {
                      color: "rgb(22, 192, 231)",
                    },
                  ],
                  gradient: false,
                  repeating: false,
                  gradientType: 0,
                },
                family: "Spectral SC",
                italic: false,
                weight: true,
                outline: {
                  color: "rgb(239, 233, 233)",
                  width: 0,
                  enabled: false,
                },
                animation: "none",
                underline: false,
                shadowColor: "rgb(22, 192, 231)",
                shadowWidth: 5,
                animationType: "entire",
                shadowOffsetX: 0,
                shadowOffsetY: 0,
              },
            },
            {
              name: "titleTextAlign",
              value: "center",
            },
            {
              name: "titleBorder",
              value: {
                top: {
                  type: "solid",
                  color: "rgb(236, 5, 5)",
                  width: 2,
                },
                left: {
                  type: "solid",
                  color: "rgb(236, 5, 5)",
                  width: 2,
                },
                right: {
                  type: "solid",
                  color: "rgb(236, 5, 5)",
                  width: 2,
                },
                bottom: {
                  type: "solid",
                  color: "rgb(236, 5, 5)",
                  width: 2,
                },
                isSame: null,
              },
            },
            {
              name: "titlePadding",
              value: {
                top: 5,
                left: 45,
                right: 45,
                bottom: 5,
                isSame: false,
              },
            },
            {
              name: "titleRounding",
              value: {
                isSame: true,
                topLeft: 40,
                topRight: 40,
                bottomLeft: 40,
                bottomRight: 40,
              },
            },
            {
              name: "titleBackgroundColor",
              value: {
                angle: 0,
                colors: [
                  {
                    color: "rgba(43, 186, 35, 0)",
                  },
                ],
                gradient: false,
                repeating: false,
                gradientType: 0,
              },
            },
            {
              name: "titleBoxShadow",
              value: {
                shadows: [],
              },
            },
            {
              name: "outerImage",
              value: {
                url: null,
                size: "auto",
                repeat: false,
                opacity: 1,
              },
            },
            {
              name: "labelTemplate",
              value: "<collected>/<required>   ",
            },
            {
              name: "amountFont",
              value: {
                size: 40,
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
                family: "Play",
                italic: false,
                weight: true,
                outline: {
                  color: "rgb(0, 0, 0)",
                  width: 2,
                  enabled: true,
                },
                animation: "none",
                underline: false,
                shadowColor: "rgb(70, 30, 30)",
                shadowWidth: 5,
                animationType: "entire",
                shadowOffsetX: 0,
                shadowOffsetY: 0,
              },
            },
            {
              name: "filledTextAlign",
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
              name: "outerBorder",
              value: {
                top: {
                  type: "solid",
                  color: "#000000",
                  width: 2,
                },
                left: {
                  type: "solid",
                  color: "#000000",
                  width: 2,
                },
                right: {
                  type: "solid",
                  color: "#000000",
                  width: 2,
                },
                bottom: {
                  type: "solid",
                  color: "#000000",
                  width: 2,
                },
                isSame: true,
              },
            },
            {
              name: "outerRounding",
              value: {
                isSame: null,
                topLeft: 0,
                topRight: 0,
                bottomLeft: 0,
                bottomRight: 0,
              },
            },
            {
              name: "barPadding",
              value: {
                top: 10,
                left: 10,
                right: 10,
                bottom: 10,
                isSame: true,
              },
            },
            {
              name: "outerBoxShadow",
              value: {
                shadows: [
                  {
                    x: 0,
                    y: 0,
                    blur: 10,
                    color: "#000000",
                    inset: true,
                    spread: 10,
                  },
                  {
                    x: 0,
                    y: 0,
                    blur: 3,
                    color: "rgb(22, 192, 231)",
                    inset: false,
                    spread: 3,
                  },
                ],
              },
            },
            {
              name: "innerImage",
              value: {
                url: null,
                size: "auto",
                repeat: false,
                opacity: 1,
              },
            },
            {
              name: "filledColor",
              value: {
                angle: 90,
                colors: [
                  {
                    color: "rgb(22, 192, 231)",
                  },
                  {
                    color: "rgb(196, 189, 40)",
                  },
                  {
                    color: "rgb(36, 150, 12)",
                  },
                ],
                gradient: false,
                repeating: false,
                gradientType: 0,
              },
            },
            {
              name: "innerBorder",
              value: {
                top: {
                  type: "solid",
                  color: "rgb(0, 0, 0)",
                  width: 2,
                },
                left: {
                  type: "solid",
                  color: "rgb(0, 0, 0)",
                  width: 2,
                },
                right: {
                  type: "solid",
                  color: "rgb(0, 0, 0)",
                  width: 0,
                },
                bottom: {
                  type: "solid",
                  color: "rgb(0, 0, 0)",
                  width: 2,
                },
                isSame: null,
              },
            },
            {
              name: "innerRounding",
              value: {
                isSame: false,
                topLeft: 25,
                topRight: 0,
                bottomLeft: 25,
                bottomRight: 0,
              },
            },
            {
              name: "innerPadding",
              value: {
                top: 5,
                left: 5,
                right: 5,
                bottom: 5,
                isSame: true,
              },
            },
            {
              name: "innerBoxShadow",
              value: {
                shadows: [],
              },
            },
            {
              name: "blur",
              value: {
                blur: 10,
                enabled: false,
              },
            },
          ],
        }),
        new Preset({
          name: "donation-goal-4",
          showcase: "https://api.oda.digital/presets/donation-goal-4.png",
          properties: [
            {
              name: "preset",
              value: "donation-goal",
            },
            {
              name: "widgetBackgroundColor",
              value: {
                angle: 60,
                colors: [
                  {
                    color: "rgba(255, 255, 255, 0)",
                  },
                  {
                    color: "rgb(35, 169, 199)",
                  },
                  {
                    color: "#FFFFFF",
                  },
                ],
                gradient: false,
                repeating: false,
                gradientType: 0,
              },
            },
            {
              name: "backgroundImage",
              value: {
                url: null,
                size: "auto",
                repeat: false,
                opacity: 1,
              },
            },
            {
              name: "border",
              value: {
                top: {
                  type: "solid",
                  color: "rgb(0, 0, 0)",
                  width: 2,
                },
                left: {
                  type: "solid",
                  color: "rgb(0, 0, 0)",
                  width: 2,
                },
                right: {
                  type: "solid",
                  color: "rgb(0, 0, 0)",
                  width: 2,
                },
                bottom: {
                  type: "solid",
                  color: "rgb(0, 0, 0)",
                  width: 2,
                },
                isSame: null,
              },
            },
            {
              name: "padding",
              value: {
                top: 30,
                left: 15,
                right: 15,
                bottom: 30,
                isSame: null,
              },
            },
            {
              name: "rounding",
              value: {
                isSame: null,
                topLeft: 0,
                topRight: 0,
                bottomLeft: 0,
                bottomRight: 0,
              },
            },
            {
              name: "boxShadow",
              value: {
                shadows: [],
              },
            },
            {
              name: "titleBackgroundImage",
              value: {
                url: null,
                size: "auto",
                repeat: false,
                opacity: 1,
              },
            },
            {
              name: "descriptionFont",
              value: {
                size: 40,
                color: {
                  angle: 0,
                  colors: [
                    {
                      color: "rgb(22, 192, 231)",
                    },
                  ],
                  gradient: false,
                  repeating: false,
                  gradientType: 0,
                },
                family: "Rubik Mono One",
                italic: false,
                weight: true,
                outline: {
                  color: "rgb(239, 233, 233)",
                  width: 0,
                  enabled: false,
                },
                animation: "none",
                underline: false,
                shadowColor: "rgb(22, 192, 231)",
                shadowWidth: 5,
                animationType: "entire",
                shadowOffsetX: 0,
                shadowOffsetY: 0,
              },
            },
            {
              name: "titleTextAlign",
              value: "center",
            },
            {
              name: "titleBorder",
              value: {
                top: {
                  type: "solid",
                  color: "rgb(236, 5, 5)",
                  width: 2,
                },
                left: {
                  type: "solid",
                  color: "rgb(236, 5, 5)",
                  width: 2,
                },
                right: {
                  type: "solid",
                  color: "rgb(236, 5, 5)",
                  width: 2,
                },
                bottom: {
                  type: "solid",
                  color: "rgb(236, 5, 5)",
                  width: 2,
                },
                isSame: null,
              },
            },
            {
              name: "titlePadding",
              value: {
                top: 5,
                left: 45,
                right: 45,
                bottom: 5,
                isSame: false,
              },
            },
            {
              name: "titleRounding",
              value: {
                isSame: true,
                topLeft: 40,
                topRight: 40,
                bottomLeft: 40,
                bottomRight: 40,
              },
            },
            {
              name: "titleBackgroundColor",
              value: {
                angle: 0,
                colors: [
                  {
                    color: "rgba(43, 186, 35, 0)",
                  },
                ],
                gradient: false,
                repeating: false,
                gradientType: 0,
              },
            },
            {
              name: "titleBoxShadow",
              value: {
                shadows: [],
              },
            },
            {
              name: "outerImage",
              value: {
                url: null,
                size: "auto",
                repeat: false,
                opacity: 1,
              },
            },
            {
              name: "labelTemplate",
              value: "<collected> <currency>",
            },
            {
              name: "amountFont",
              value: {
                size: 40,
                color: {
                  angle: 0,
                  colors: [
                    {
                      color: "rgb(22, 192, 231)",
                    },
                  ],
                  gradient: false,
                  repeating: false,
                  gradientType: 0,
                },
                family: "Rubik Mono One",
                italic: false,
                weight: true,
                outline: {
                  color: "rgb(0, 0, 0)",
                  width: 2,
                  enabled: false,
                },
                animation: "none",
                underline: false,
                shadowColor: "rgb(22, 192, 231)",
                shadowWidth: 5,
                animationType: "entire",
                shadowOffsetX: 0,
                shadowOffsetY: 0,
              },
            },
            {
              name: "filledTextAlign",
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
              name: "outerBorder",
              value: {
                top: {
                  type: "solid",
                  color: "#000000",
                  width: 2,
                },
                left: {
                  type: "solid",
                  color: "#000000",
                  width: 2,
                },
                right: {
                  type: "solid",
                  color: "#000000",
                  width: 2,
                },
                bottom: {
                  type: "solid",
                  color: "#000000",
                  width: 2,
                },
                isSame: null,
              },
            },
            {
              name: "outerRounding",
              value: {
                isSame: null,
                topLeft: 0,
                topRight: 0,
                bottomLeft: 0,
                bottomRight: 0,
              },
            },
            {
              name: "barPadding",
              value: {
                top: 10,
                left: 10,
                right: 10,
                bottom: 10,
                isSame: null,
              },
            },
            {
              name: "outerBoxShadow",
              value: {
                shadows: [],
              },
            },
            {
              name: "innerImage",
              value: {
                url: null,
                size: "auto",
                repeat: false,
                opacity: 1,
              },
            },
            {
              name: "filledColor",
              value: {
                angle: 90,
                colors: [
                  {
                    color: "rgba(22, 192, 231, 0)",
                  },
                  {
                    color: "rgb(196, 189, 40)",
                  },
                  {
                    color: "rgb(36, 150, 12)",
                  },
                ],
                gradient: false,
                repeating: false,
                gradientType: 0,
              },
            },
            {
              name: "innerBorder",
              value: {
                top: {
                  type: "solid",
                  color: "rgb(0, 0, 0)",
                  width: 2,
                },
                left: {
                  type: "solid",
                  color: "rgb(0, 0, 0)",
                  width: 2,
                },
                right: {
                  type: "solid",
                  color: "rgb(0, 0, 0)",
                  width: 0,
                },
                bottom: {
                  type: "solid",
                  color: "rgb(0, 0, 0)",
                  width: 2,
                },
                isSame: null,
              },
            },
            {
              name: "innerRounding",
              value: {
                isSame: false,
                topLeft: 25,
                topRight: 0,
                bottomLeft: 25,
                bottomRight: 0,
              },
            },
            {
              name: "innerPadding",
              value: {
                top: 5,
                left: 5,
                right: 5,
                bottom: 5,
                isSame: true,
              },
            },
            {
              name: "innerBoxShadow",
              value: {
                shadows: [],
              },
            },
            {
              name: "blur",
              value: {
                blur: 10,
                enabled: false,
              },
            },
          ],
        }),
        new Preset({
          name: "donation-goal-5",
          showcase: "https://api.oda.digital/presets/donation-goal-5.png",
          properties: [
            {
              name: "preset",
              value: "donation-goal",
            },
            {
              name: "widgetBackgroundColor",
              value: {
                angle: 60,
                colors: [
                  {
                    color: "rgba(255, 255, 255, 0)",
                  },
                  {
                    color: "rgb(35, 169, 199)",
                  },
                  {
                    color: "#FFFFFF",
                  },
                ],
                gradient: false,
                repeating: false,
                gradientType: 0,
              },
            },
            {
              name: "backgroundImage",
              value: {
                url: "https://api.oda.digital/assets/868-3333198198.jpg",
                size: "auto",

                repeat: false,
                opacity: 1,
              },
            },
            {
              name: "border",
              value: {
                top: {
                  type: "solid",
                  color: "rgb(0, 0, 0)",
                  width: 2,
                },
                left: {
                  type: "solid",
                  color: "rgb(0, 0, 0)",
                  width: 2,
                },
                right: {
                  type: "solid",
                  color: "rgb(0, 0, 0)",
                  width: 2,
                },
                bottom: {
                  type: "solid",
                  color: "rgb(0, 0, 0)",
                  width: 2,
                },
                isSame: null,
              },
            },
            {
              name: "padding",
              value: {
                top: 30,
                left: 15,
                right: 15,
                bottom: 30,
                isSame: null,
              },
            },
            {
              name: "rounding",
              value: {
                isSame: true,
                topLeft: 30,
                topRight: 30,
                bottomLeft: 30,
                bottomRight: 30,
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
                    spread: 5,
                  },
                ],
              },
            },
            {
              name: "titleBackgroundImage",
              value: {
                url: null,
                size: "auto",
                repeat: false,
                opacity: 1,
              },
            },
            {
              name: "descriptionFont",
              value: {
                size: 40,
                color: {
                  angle: 0,
                  colors: [
                    {
                      color: "rgb(39, 231, 22)",
                    },
                  ],
                  gradient: false,
                  repeating: false,
                  gradientType: 0,
                },
                family: "Rubik Mono One",
                italic: false,
                weight: true,
                outline: {
                  color: "rgb(239, 233, 233)",
                  width: 0,
                  enabled: false,
                },
                animation: "none",
                underline: false,
                shadowColor: "rgb(22, 192, 231)",
                shadowWidth: 5,
                animationType: "entire",
                shadowOffsetX: 0,
                shadowOffsetY: 0,
              },
            },
            {
              name: "titleTextAlign",
              value: "center",
            },
            {
              name: "titleBorder",
              value: {
                top: {
                  type: "solid",
                  color: "rgb(236, 5, 5)",
                  width: 2,
                },
                left: {
                  type: "solid",
                  color: "rgb(236, 5, 5)",
                  width: 2,
                },
                right: {
                  type: "solid",
                  color: "rgb(236, 5, 5)",
                  width: 2,
                },
                bottom: {
                  type: "solid",
                  color: "rgb(236, 5, 5)",
                  width: 2,
                },
                isSame: null,
              },
            },
            {
              name: "titlePadding",
              value: {
                top: 5,
                left: 45,
                right: 45,
                bottom: 5,
                isSame: false,
              },
            },
            {
              name: "titleRounding",
              value: {
                isSame: true,
                topLeft: 40,
                topRight: 40,
                bottomLeft: 40,
                bottomRight: 40,
              },
            },
            {
              name: "titleBackgroundColor",
              value: {
                angle: 0,
                colors: [
                  {
                    color: "rgba(43, 186, 35, 0)",
                  },
                ],
                gradient: false,
                repeating: false,
                gradientType: 0,
              },
            },
            {
              name: "titleBoxShadow",
              value: {
                shadows: [],
              },
            },
            {
              name: "outerImage",
              value: {
                url: null,
                size: "auto",
                repeat: false,
                opacity: 1,
              },
            },
            {
              name: "labelTemplate",
              value: "",
            },
            {
              name: "amountFont",
              value: {
                size: 40,
                color: {
                  angle: 0,
                  colors: [
                    {
                      color: "rgb(214, 231, 22)",
                    },
                  ],
                  gradient: false,
                  repeating: false,
                  gradientType: 0,
                },
                family: "Rubik Mono One",
                italic: false,
                weight: true,
                outline: {
                  color: "rgb(0, 0, 0)",
                  width: 2,
                  enabled: false,
                },
                animation: "none",
                underline: false,
                shadowColor: "rgb(22, 192, 231)",
                shadowWidth: 5,
                animationType: "entire",
                shadowOffsetX: 0,
                shadowOffsetY: 0,
              },
            },
            {
              name: "filledTextAlign",
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
              name: "outerBorder",
              value: {
                top: {
                  type: "solid",
                  color: "rgb(255, 0, 0)",
                  width: 2,
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
                  color: "rgb(255, 0, 0)",
                  width: 2,
                },
                isSame: false,
              },
            },
            {
              name: "outerRounding",
              value: {
                isSame: null,
                topLeft: 0,
                topRight: 0,
                bottomLeft: 0,
                bottomRight: 0,
              },
            },
            {
              name: "barPadding",
              value: {
                top: 10,
                left: 10,
                right: 10,
                bottom: 10,
                isSame: null,
              },
            },
            {
              name: "outerBoxShadow",
              value: {
                shadows: [],
              },
            },
            {
              name: "innerImage",
              value: {
                url: null,
                size: "auto",
                repeat: false,
                opacity: 1,
              },
            },
            {
              name: "filledColor",
              value: {
                angle: 90,
                colors: [
                  {
                    color: "rgba(255, 0, 0, 0.5)",
                  },
                  {
                    color: "rgb(196, 189, 40)",
                  },
                  {
                    color: "rgb(36, 150, 12)",
                  },
                ],
                gradient: false,
                repeating: false,
                gradientType: 0,
              },
            },
            {
              name: "innerBorder",
              value: {
                top: {
                  type: "solid",
                  color: "rgb(0, 0, 0)",
                  width: 2,
                },
                left: {
                  type: "solid",
                  color: "rgb(0, 0, 0)",
                  width: 2,
                },
                right: {
                  type: "solid",
                  color: "rgb(0, 0, 0)",
                  width: 0,
                },
                bottom: {
                  type: "solid",
                  color: "rgb(0, 0, 0)",
                  width: 2,
                },
                isSame: null,
              },
            },
            {
              name: "innerRounding",
              value: {
                isSame: false,
                topLeft: 0,
                topRight: 0,
                bottomLeft: 0,
                bottomRight: 0,
              },
            },
            {
              name: "innerPadding",
              value: {
                top: 5,
                left: 5,
                right: 5,
                bottom: 5,
                isSame: null,
              },
            },
            {
              name: "innerBoxShadow",
              value: {
                shadows: [],
              },
            },
            {
              name: "blur",
              value: {
                blur: 10,
                enabled: false,
              },
            },
          ],
        }),
        new Preset({
          name: "donation-goal-6",
          showcase: "https://api.oda.digital/presets/donation-goal-6.png",
          properties: [
            {
              name: "preset",
              value: "donation-goal",
            },
            {
              name: "goal",
              value: [
                {
                  id: "0193c467-3273-7be6-845c-d8a31a0e3dce",
                  default: false,
                  requiredAmount: {
                    major: 100,
                    currency: "RUB",
                  },
                  fullDescription: "",
                  briefDescription: "Цель сбора",
                  accumulatedAmount: {
                    major: 0,
                    currency: "RUB",
                  },
                },
              ],
            },
            {
              name: "widgetBackgroundColor",
              value: {
                angle: 60,
                colors: [
                  {
                    color: "rgba(255, 255, 255, 0)",
                  },
                  {
                    color: "rgb(35, 169, 199)",
                  },
                  {
                    color: "#FFFFFF",
                  },
                ],
                gradient: false,
                repeating: false,
                gradientType: 0,
              },
            },
            {
              name: "backgroundImage",
              value: {
                url: null,
                size: "auto",
                repeat: false,
                opacity: 1,
              },
            },
            {
              name: "border",
              value: {
                top: {
                  type: "solid",
                  color: "rgb(0, 0, 0)",
                  width: 2,
                },
                left: {
                  type: "solid",
                  color: "rgb(0, 0, 0)",
                  width: 2,
                },
                right: {
                  type: "solid",
                  color: "rgb(0, 0, 0)",
                  width: 2,
                },
                bottom: {
                  type: "solid",
                  color: "rgb(0, 0, 0)",
                  width: 2,
                },
                isSame: null,
              },
            },
            {
              name: "padding",
              value: {
                top: 50,
                left: 50,
                right: 50,
                bottom: 50,
                isSame: true,
              },
            },
            {
              name: "rounding",
              value: {
                isSame: true,
                topLeft: 50,
                topRight: 50,
                bottomLeft: 50,
                bottomRight: 50,
              },
            },
            {
              name: "boxShadow",
              value: {
                shadows: [],
              },
            },
            {
              name: "showTitle",
              value: true,
            },
            {
              name: "titleBackgroundImage",
              value: {
                url: null,
                size: "auto",
                repeat: false,
                opacity: 1,
              },
            },
            {
              name: "descriptionFont",
              value: {
                size: 40,
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
                family: "Ruslan Display",
                italic: false,
                weight: true,
                outline: {
                  color: "rgb(22, 50, 231)",
                  width: 2,
                  enabled: true,
                },
                animation: "none",
                underline: false,
                shadowColor: "rgb(22, 50, 231)",
                shadowWidth: 5,
                animationType: "entire",
                shadowOffsetX: 0,
                shadowOffsetY: 0,
              },
            },
            {
              name: "titleTextAlign",
              value: "center",
            },
            {
              name: "titleBorder",
              value: {
                top: {
                  type: "solid",
                  color: "rgb(236, 5, 5)",
                  width: 2,
                },
                left: {
                  type: "solid",
                  color: "rgb(236, 5, 5)",
                  width: 2,
                },
                right: {
                  type: "solid",
                  color: "rgb(236, 5, 5)",
                  width: 2,
                },
                bottom: {
                  type: "solid",
                  color: "rgb(236, 5, 5)",
                  width: 2,
                },
                isSame: null,
              },
            },
            {
              name: "titlePadding",
              value: {
                top: 5,
                left: 45,
                right: 45,
                bottom: 5,
                isSame: null,
              },
            },
            {
              name: "titleRounding",
              value: {
                isSame: true,
                topLeft: 40,
                topRight: 40,
                bottomLeft: 40,
                bottomRight: 40,
              },
            },
            {
              name: "titleBackgroundColor",
              value: {
                angle: 0,
                colors: [
                  {
                    color: "rgba(43, 186, 35, 0)",
                  },
                ],
                gradient: false,
                repeating: false,
                gradientType: 0,
              },
            },
            {
              name: "titleBoxShadow",
              value: {
                shadows: [],
              },
            },
            {
              name: "outerImage",
              value: {
                url: "https://api.oda.digital/assets/bw_gzhel.png",
                size: "contain",
                repeat: true,
                opacity: 0.5,
              },
            },
            {
              name: "showLabel",
              value: true,
            },
            {
              name: "labelTemplate",
              value: "<collected> <currency>",
            },
            {
              name: "amountFont",
              value: {
                size: 40,
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
                family: "Ruslan Display",
                italic: false,
                weight: true,
                outline: {
                  color: "rgb(22, 50, 231)",
                  width: 2,
                  enabled: true,
                },
                animation: "none",
                underline: false,
                shadowColor: "rgb(22, 50, 231)",
                shadowWidth: 5,
                animationType: "entire",
                shadowOffsetX: 0,
                shadowOffsetY: 0,
              },
            },
            {
              name: "filledTextPlacement",
              value: "bottom",
            },
            {
              name: "filledTextAlign",
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
              name: "outerBorder",
              value: {
                top: {
                  type: "solid",
                  color: "rgb(255, 255, 255)",
                  width: 1,
                },
                left: {
                  type: "solid",
                  color: "rgb(255, 255, 255)",
                  width: 1,
                },
                right: {
                  type: "solid",
                  color: "rgb(255, 255, 255)",
                  width: 1,
                },
                bottom: {
                  type: "solid",
                  color: "rgb(255, 255, 255)",
                  width: 1,
                },
                isSame: true,
              },
            },
            {
              name: "outerRounding",
              value: {
                isSame: null,
                topLeft: 0,
                topRight: 0,
                bottomLeft: 0,
                bottomRight: 0,
              },
            },
            {
              name: "barPadding",
              value: {
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                isSame: null,
              },
            },
            {
              name: "outerBoxShadow",
              value: {
                shadows: [
                  {
                    x: 0,
                    y: 0,
                    blur: 12,
                    color: "#000000",
                    inset: true,
                    spread: 3,
                  },
                  {
                    x: 0,
                    y: 0,
                    blur: 6,
                    color: "rgb(255, 255, 255)",
                    inset: false,
                    spread: 2,
                  },
                ],
              },
            },
            {
              name: "innerImage",
              value: {
                url: "https://api.oda.digital/assets/2024-12-14_21-12-1734202337.png",
                size: "contain",
                repeat: true,
                opacity: 1,
              },
            },
            {
              name: "filledColor",
              value: {
                angle: 90,
                colors: [
                  {
                    color: "rgba(255, 0, 0, 0.5)",
                  },
                  {
                    color: "rgb(196, 189, 40)",
                  },
                  {
                    color: "rgb(36, 150, 12)",
                  },
                ],
                gradient: false,
                repeating: false,
                gradientType: 0,
              },
            },
            {
              name: "innerBorder",
              value: {
                top: {
                  type: "solid",
                  color: "rgb(22, 50, 231)",
                  width: 2,
                },
                left: {
                  type: "solid",
                  color: "rgb(22, 50, 231)",
                  width: 2,
                },
                right: {
                  type: "solid",
                  color: "rgb(22, 50, 231)",
                  width: 0,
                },
                bottom: {
                  type: "solid",
                  color: "rgb(22, 50, 231)",
                  width: 2,
                },
                isSame: false,
              },
            },
            {
              name: "innerRounding",
              value: {
                isSame: false,
                topLeft: 0,
                topRight: 0,
                bottomLeft: 0,
                bottomRight: 0,
              },
            },
            {
              name: "innerPadding",
              value: {
                top: 1,
                left: 1,
                right: 1,
                bottom: 1,
                isSame: true,
              },
            },
            {
              name: "innerBoxShadow",
              value: {
                shadows: [
                  {
                    x: 0,
                    y: 0,
                    blur: 9,
                    color: "rgb(22, 50, 231)",
                    inset: true,
                    spread: 3,
                  },
                ],
              },
            },
            {
              name: "blur",
              value: {
                blur: 10,
                enabled: false,
              },
            },
          ],
        }),
        new Preset({
          name: "donation-goal-7",
          showcase: "https://api.oda.digital/presets/donation-goal-7.png",
          properties: [
            {
              name: "preset",
              value: "donation-goal",
            },
            {
              name: "widgetBackgroundColor",
              value: {
                angle: 0,
                colors: [
                  {
                    color: "rgba(0, 0, 0, 0.5)",
                  },
                ],
                gradient: false,
                repeating: false,
                gradientType: 0,
              },
            },
            {
              name: "backgroundImage",
              value: {
                url: null,
                size: "auto",
                repeat: false,
                opacity: 1,
              },
            },
            {
              name: "border",
              value: {
                top: {
                  type: "solid",
                  color: "#000000",
                  width: 1,
                },
                left: {
                  type: "solid",
                  color: "#000000",
                  width: 1,
                },
                right: {
                  type: "solid",
                  color: "#000000",
                  width: 1,
                },
                bottom: {
                  type: "solid",
                  color: "#000000",
                  width: 1,
                },
                isSame: null,
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
                topLeft: 20,
                topRight: 20,
                bottomLeft: 20,
                bottomRight: 20,
              },
            },
            {
              name: "boxShadow",
              value: {
                shadows: [
                  {
                    x: 0,
                    y: 0,
                    blur: 12,
                    color: "#000000",
                    inset: false,
                    spread: 4,
                  },
                ],
              },
            },
            {
              name: "showTitle",
              value: true,
            },
            {
              name: "titleBackgroundImage",
              value: {
                url: null,
                size: "auto",
                repeat: false,
                opacity: 1,
              },
            },
            {
              name: "descriptionFont",
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
                family: "Pattaya",
                italic: false,
                weight: false,
                outline: {
                  color: "#000000",
                  width: 0,
                  enabled: false,
                },
                animation: "none",
                underline: false,
                shadowColor: "#000000",
                shadowWidth: 0,
                animationType: "entire",
                shadowOffsetX: 0,
                shadowOffsetY: 0,
              },
            },
            {
              name: "titleTextAlign",
              value: "center",
            },
            {
              name: "titleBorder",
              value: {
                top: {
                  type: "solid",
                  color: "#000000",
                  width: 1,
                },
                left: {
                  type: "solid",
                  color: "#000000",
                  width: 1,
                },
                right: {
                  type: "solid",
                  color: "#000000",
                  width: 1,
                },
                bottom: {
                  type: "solid",
                  color: "#000000",
                  width: 1,
                },
                isSame: null,
              },
            },
            {
              name: "titlePadding",
              value: {
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                isSame: null,
              },
            },
            {
              name: "titleRounding",
              value: {
                isSame: null,
                topLeft: 0,
                topRight: 0,
                bottomLeft: 0,
                bottomRight: 0,
              },
            },
            {
              name: "titleBackgroundColor",
              value: {
                angle: 0,
                colors: [
                  {
                    color: "#FFFFFF00",
                  },
                ],
                gradient: false,
                repeating: false,
                gradientType: 0,
              },
            },
            {
              name: "titleBoxShadow",
              value: {
                shadows: [],
              },
            },
            {
              name: "outerImage",
              value: {
                url: null,
                size: "auto",
                repeat: false,
                opacity: 1,
              },
            },
            {
              name: "showLabel",
              value: true,
            },
            {
              name: "labelTemplate",
              value: "<proportion>%",
            },
            {
              name: "amountFont",
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
                family: "Pattaya",
                italic: false,
                weight: false,
                outline: {
                  color: "#000000",
                  width: 0,
                  enabled: false,
                },
                animation: "none",
                underline: false,
                shadowColor: "#000000",
                shadowWidth: 0,
                animationType: "entire",
                shadowOffsetX: 0,
                shadowOffsetY: 0,
              },
            },
            {
              name: "filledTextPlacement",
              value: "center",
            },
            {
              name: "filledTextAlign",
              value: "center",
            },
            {
              name: "backgroundColor",
              value: {
                angle: 0,
                colors: [
                  {
                    color: "rgb(66, 66, 66)",
                  },
                ],
                gradient: false,
                repeating: false,
                gradientType: 0,
              },
            },
            {
              name: "outerBorder",
              value: {
                top: {
                  type: "solid",
                  color: "#000000",
                  width: 1,
                },
                left: {
                  type: "solid",
                  color: "#000000",
                  width: 1,
                },
                right: {
                  type: "solid",
                  color: "#000000",
                  width: 1,
                },
                bottom: {
                  type: "solid",
                  color: "#000000",
                  width: 1,
                },
                isSame: null,
              },
            },
            {
              name: "outerRounding",
              value: {
                isSame: true,
                topLeft: 12,
                topRight: 12,
                bottomLeft: 12,
                bottomRight: 12,
              },
            },
            {
              name: "barPadding",
              value: {
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                isSame: null,
              },
            },
            {
              name: "outerBoxShadow",
              value: {
                shadows: [],
              },
            },
            {
              name: "innerImage",
              value: {
                url: null,
                size: "auto",
                repeat: false,
                opacity: 1,
              },
            },
            {
              name: "filledColor",
              value: {
                angle: 0,
                colors: [
                  {
                    color: "rgb(245, 117, 7)",
                  },
                  {
                    color: "rgb(245, 156, 7)",
                  },
                ],
                gradient: true,
                repeating: false,
                gradientType: 0,
              },
            },
            {
              name: "innerBorder",
              value: {
                top: {
                  type: "solid",
                  color: "#000000",
                  width: 1,
                },
                left: {
                  type: "solid",
                  color: "#000000",
                  width: 1,
                },
                right: {
                  type: "solid",
                  color: "#000000",
                  width: 1,
                },
                bottom: {
                  type: "solid",
                  color: "#000000",
                  width: 1,
                },
                isSame: null,
              },
            },
            {
              name: "innerRounding",
              value: {
                isSame: false,
                topLeft: 12,
                topRight: 0,
                bottomLeft: 12,
                bottomRight: 0,
              },
            },
            {
              name: "innerPadding",
              value: {
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                isSame: null,
              },
            },
            {
              name: "innerBoxShadow",
              value: {
                shadows: [],
              },
            },
            {
              name: "blur",
              value: {
                blur: 0,
                enabled: false,
              },
            },
          ],
        }),
        new Preset({
          name: "donation-goal-8",
          showcase: "https://api.oda.digital/presets/donation-goal-8.png",
          properties: [
            {
              name: "preset",
              value: "donation-goal",
            },
            {
              name: "goal",
              value: [
                {
                  id: "0193c8c0-c64e-7b54-8f85-c928cd73894b",
                  default: false,
                  requiredAmount: {
                    major: 100,
                    currency: "RUB",
                  },
                  fullDescription: "",
                  briefDescription: "Сбор денег",
                },
              ],
            },
            {
              name: "widgetBackgroundColor",
              value: {
                angle: 0,
                colors: [
                  {
                    color: "rgba(0, 0, 0, 0)",
                  },
                ],
                gradient: false,
                repeating: false,
                gradientType: 0,
              },
            },
            {
              name: "backgroundImage",
              value: {
                url: null,
                size: "auto",
                repeat: false,
                opacity: 1,
              },
            },
            {
              name: "border",
              value: {
                top: {
                  type: "solid",
                  color: "#000000",
                  width: 1,
                },
                left: {
                  type: "solid",
                  color: "#000000",
                  width: 1,
                },
                right: {
                  type: "solid",
                  color: "#000000",
                  width: 1,
                },
                bottom: {
                  type: "solid",
                  color: "#000000",
                  width: 1,
                },
                isSame: null,
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
                isSame: null,
                topLeft: 0,
                topRight: 0,
                bottomLeft: 0,
                bottomRight: 0,
              },
            },
            {
              name: "boxShadow",
              value: {
                shadows: [],
              },
            },
            {
              name: "showTitle",
              value: true,
            },
            {
              name: "titleBackgroundImage",
              value: {
                url: null,
                size: "auto",
                repeat: false,
                opacity: 1,
              },
            },
            {
              name: "descriptionFont",
              value: {
                size: 40,
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
                family: "Ruslan Display",
                italic: false,
                weight: false,
                outline: {
                  color: "rgb(255, 0, 0)",
                  width: 1,
                  enabled: true,
                },
                animation: "none",
                underline: false,
                shadowColor: "#000000",
                shadowWidth: 0,
                animationType: "entire",
                shadowOffsetX: 0,
                shadowOffsetY: 0,
              },
            },
            {
              name: "titleTextAlign",
              value: "center",
            },
            {
              name: "titleBorder",
              value: {
                top: {
                  type: "solid",
                  color: "#000000",
                  width: 1,
                },
                left: {
                  type: "solid",
                  color: "#000000",
                  width: 1,
                },
                right: {
                  type: "solid",
                  color: "#000000",
                  width: 1,
                },
                bottom: {
                  type: "solid",
                  color: "#000000",
                  width: 1,
                },
                isSame: null,
              },
            },
            {
              name: "titlePadding",
              value: {
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                isSame: null,
              },
            },
            {
              name: "titleRounding",
              value: {
                isSame: null,
                topLeft: 0,
                topRight: 0,
                bottomLeft: 0,
                bottomRight: 0,
              },
            },
            {
              name: "titleBackgroundColor",
              value: {
                angle: 0,
                colors: [
                  {
                    color: "#FFFFFF00",
                  },
                ],
                gradient: false,
                repeating: false,
                gradientType: 0,
              },
            },
            {
              name: "titleBoxShadow",
              value: {
                shadows: [],
              },
            },
            {
              name: "outerImage",
              value: {
                url: null,
                size: "auto",
                repeat: false,
                opacity: 1,
              },
            },
            {
              name: "showLabel",
              value: true,
            },
            {
              name: "labelTemplate",
              value: "<proportion>%",
            },
            {
              name: "amountFont",
              value: {
                size: 40,
                color: {
                  angle: 0,
                  colors: [
                    {
                      color: "rgb(255, 0, 0)",
                    },
                  ],
                  gradient: false,
                  repeating: false,
                  gradientType: 0,
                },
                family: "Ruslan Display",
                italic: false,
                weight: false,
                outline: {
                  color: "#000000",
                  width: 2,
                  enabled: false,
                },
                animation: "none",
                underline: false,
                shadowColor: "rgb(255, 0, 0)",
                shadowWidth: 0,
                animationType: "entire",
                shadowOffsetX: 0,
                shadowOffsetY: 0,
              },
            },
            {
              name: "filledTextPlacement",
              value: "center",
            },
            {
              name: "filledTextAlign",
              value: "right",
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
              name: "outerBorder",
              value: {
                top: {
                  type: "solid",
                  color: "rgb(255, 0, 0)",
                  width: 2,
                },
                left: {
                  type: "solid",
                  color: "#000000",
                  width: 3,
                },
                right: {
                  type: "solid",
                  color: "#000000",
                  width: 2,
                },
                bottom: {
                  type: "solid",
                  color: "rgb(255, 0, 0)",
                  width: 2,
                },
                isSame: true,
              },
            },
            {
              name: "outerRounding",
              value: {
                isSame: null,
                topLeft: 0,
                topRight: 0,
                bottomLeft: 0,
                bottomRight: 0,
              },
            },
            {
              name: "barPadding",
              value: {
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                isSame: null,
              },
            },
            {
              name: "outerBoxShadow",
              value: {
                shadows: [],
              },
            },
            {
              name: "innerImage",
              value: {
                url: "https://api.oda.digital/assets/hohloma1.png",
                size: "cover",
                repeat: false,
                opacity: 1,
              },
            },
            {
              name: "filledColor",
              value: {
                angle: 0,
                colors: [
                  {
                    color: "rgb(245, 117, 7)",
                  },
                  {
                    color: "rgb(245, 156, 7)",
                  },
                ],
                gradient: true,
                repeating: false,
                gradientType: 0,
              },
            },
            {
              name: "innerBorder",
              value: {
                top: {
                  type: "solid",
                  color: "#000000",
                  width: 1,
                },
                left: {
                  type: "solid",
                  color: "#000000",
                  width: 1,
                },
                right: {
                  type: "solid",
                  color: "#000000",
                  width: 1,
                },
                bottom: {
                  type: "solid",
                  color: "#000000",
                  width: 1,
                },
                isSame: null,
              },
            },
            {
              name: "innerRounding",
              value: {
                isSame: null,
                topLeft: 0,
                topRight: 0,
                bottomLeft: 0,
                bottomRight: 0,
              },
            },
            {
              name: "innerPadding",
              value: {
                top: 6,
                left: 6,
                right: 6,
                bottom: 6,
                isSame: null,
              },
            },
            {
              name: "innerBoxShadow",
              value: {
                shadows: [],
              },
            },
            {
              name: "blur",
              value: {
                blur: 0,
                enabled: false,
              },
            },
          ],
        }),
        new Preset({
          name: "donation-goal-9",
          showcase: "https://api.oda.digital/presets/donation-goal-9.png",
          properties: [
            {
              name: "preset",
              value: "donation-goal",
            },
            {
              name: "widgetBackgroundColor",
              value: {
                angle: 0,
                colors: [
                  {
                    color: "rgba(0, 0, 0, 0)",
                  },
                ],
                gradient: false,
                repeating: false,
                gradientType: 0,
              },
            },
            {
              name: "backgroundImage",
              value: {
                url: null,
                size: "auto",
                repeat: false,
                opacity: 1,
              },
            },
            {
              name: "border",
              value: {
                top: {
                  type: "solid",
                  color: "#000000",
                  width: 1,
                },
                left: {
                  type: "solid",
                  color: "#000000",
                  width: 1,
                },
                right: {
                  type: "solid",
                  color: "#000000",
                  width: 1,
                },
                bottom: {
                  type: "solid",
                  color: "#000000",
                  width: 1,
                },
                isSame: null,
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
                isSame: null,
                topLeft: 0,
                topRight: 0,
                bottomLeft: 0,
                bottomRight: 0,
              },
            },
            {
              name: "boxShadow",
              value: {
                shadows: [],
              },
            },
            {
              name: "showTitle",
              value: true,
            },
            {
              name: "titleBackgroundImage",
              value: {
                url: "https://api.oda.digital/assets/gifts.png",
                size: "contain",
                repeat: true,
                opacity: 1,
              },
            },
            {
              name: "descriptionFont",
              value: {
                size: 40,
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
                family: "Fascinate",
                italic: false,
                weight: true,
                outline: {
                  color: "rgb(255, 0, 0)",
                  width: 1,
                  enabled: true,
                },
                animation: "none",
                underline: false,
                shadowColor: "#000000",
                shadowWidth: 7,
                animationType: "entire",
                shadowOffsetX: 0,
                shadowOffsetY: 0,
              },
            },
            {
              name: "titleTextAlign",
              value: "center",
            },
            {
              name: "titleBorder",
              value: {
                top: {
                  type: "solid",
                  color: "#000000",
                  width: 1,
                },
                left: {
                  type: "solid",
                  color: "#000000",
                  width: 1,
                },
                right: {
                  type: "solid",
                  color: "#000000",
                  width: 1,
                },
                bottom: {
                  type: "solid",
                  color: "#000000",
                  width: 1,
                },
                isSame: null,
              },
            },
            {
              name: "titlePadding",
              value: {
                top: 10,
                left: 10,
                right: 10,
                bottom: 10,
                isSame: true,
              },
            },
            {
              name: "titleRounding",
              value: {
                isSame: true,
                topLeft: 20,
                topRight: 20,
                bottomLeft: 20,
                bottomRight: 20,
              },
            },
            {
              name: "titleBackgroundColor",
              value: {
                angle: 0,
                colors: [
                  {
                    color: "#FFFFFF00",
                  },
                ],
                gradient: false,
                repeating: false,
                gradientType: 0,
              },
            },
            {
              name: "titleBoxShadow",
              value: {
                shadows: [],
              },
            },
            {
              name: "outerImage",
              value: {
                url: "https://api.oda.digital/assets/bwgarland1.png",
                size: "cover",
                repeat: false,
                opacity: 0.5,
              },
            },
            {
              name: "showLabel",
              value: false,
            },
            {
              name: "labelTemplate",
              value: "<proportion>%",
            },
            {
              name: "amountFont",
              value: {
                size: 40,
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
                family: "Neucha",
                italic: false,
                weight: true,
                outline: {
                  color: "rgb(255, 0, 0)",
                  width: 1,
                  enabled: true,
                },
                animation: "none",
                underline: false,
                shadowColor: "rgb(255, 0, 0)",
                shadowWidth: 0,
                animationType: "entire",
                shadowOffsetX: 0,
                shadowOffsetY: 0,
              },
            },
            {
              name: "filledTextPlacement",
              value: "bottom",
            },
            {
              name: "filledTextAlign",
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
              name: "outerBorder",
              value: {
                top: {
                  type: "solid",
                  color: "rgb(255, 0, 0)",
                  width: 2,
                },
                left: {
                  type: "solid",
                  color: "#000000",
                  width: 3,
                },
                right: {
                  type: "solid",
                  color: "#000000",
                  width: 2,
                },
                bottom: {
                  type: "solid",
                  color: "rgb(255, 0, 0)",
                  width: 2,
                },
                isSame: null,
              },
            },
            {
              name: "outerRounding",
              value: {
                isSame: null,
                topLeft: 0,
                topRight: 0,
                bottomLeft: 0,
                bottomRight: 0,
              },
            },
            {
              name: "barPadding",
              value: {
                top: 10,
                left: 10,
                right: 10,
                bottom: 10,
                isSame: true,
              },
            },
            {
              name: "outerBoxShadow",
              value: {
                shadows: [],
              },
            },
            {
              name: "innerImage",
              value: {
                url: "https://api.oda.digital/assets/garland1.png",
                size: "cover",
                repeat: false,
                opacity: 1,
              },
            },
            {
              name: "filledColor",
              value: {
                angle: 0,
                colors: [
                  {
                    color: "rgb(245, 117, 7)",
                  },
                  {
                    color: "rgb(245, 156, 7)",
                  },
                ],
                gradient: true,
                repeating: false,
                gradientType: 0,
              },
            },
            {
              name: "innerBorder",
              value: {
                top: {
                  type: "solid",
                  color: "rgb(222, 15, 15)",
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
                  color: "#000000",
                  width: 0,
                },
                isSame: false,
              },
            },
            {
              name: "innerRounding",
              value: {
                isSame: null,
                topLeft: 0,
                topRight: 0,
                bottomLeft: 0,
                bottomRight: 0,
              },
            },
            {
              name: "innerPadding",
              value: {
                top: 6,
                left: 6,
                right: 6,
                bottom: 6,
                isSame: null,
              },
            },
            {
              name: "innerBoxShadow",
              value: {
                shadows: [],
              },
            },
            {
              name: "blur",
              value: {
                blur: 0,
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
