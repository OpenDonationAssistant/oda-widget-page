export function findSetting(settings, key: string, defaultValue: any | null) {
  const setting = settings.config.properties.find((prop) => key === prop.name);
  if (setting) {
    return setting.value;
  }
  return defaultValue;
}
