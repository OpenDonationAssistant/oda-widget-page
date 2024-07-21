export function findSetting(settings, key: string, defaultValue: any | null) {
  if (!settings || !settings.config || !settings.config.properties){
    return defaultValue;
  }
  const setting = settings.config.properties.find((prop) => key === prop.name);
  if (setting) {
    return setting.value;
  }
  return defaultValue;
}
