export function findSetting(settings, key: string, defaultValue: any | null) {
  const setting = settings.config.properties.find((prop) => key === prop.name);
  if (setting) {
    return setting.value;
  }
  return defaultValue;
}
//
// export function hider(ref, hideFunction) {
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (ref.current && !ref.current.contains(event.target)) {
//         hideFunction.apply({});
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [ref]);
// }
