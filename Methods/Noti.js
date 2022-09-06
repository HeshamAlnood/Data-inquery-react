export const getDataNoti = async () => {
  let result;

  let permission = await Notification.requestPermission();

  if (!permission === "granted") {
    return;
  }
  let query = "VENDOR";
  await fetch(`http://192.168.0.159:3001/dbData?inquery=${query}`)
    .then((res) => res.json())
    .then((data) => {
      result = data;
    })
    .catch((e) => console.log(`Error in fetch ${e}`));

  let msg = `لديك ${result.length} معاملات بحاجة الى اعتماد `;
  const notificationShow = new Notification(msg, {
    body: "معاملات للاعتماد",
    icon: "https://www.my.gov.sa/wps/wcm/connect/b47400fd-a90d-4d7a-bad6-1b195ac28372/%D8%A3%D9%85%D8%A7%D9%86%D8%A9-%D8%A7%D9%84%D9%85%D9%86%D8%B7%D9%82%D8%A9-%D8%A7%D9%84%D8%B4%D8%B1%D9%82%D9%8A%D8%A9.png?MOD=AJPERES&CACHEID=ROOTWORKSPACE-b47400fd-a90d-4d7a-bad6-1b195ac28372-nKCfUxf",
  });

  setTimeout(() => notificationShow.close(), 5000);

  notificationShow.addEventListener("click", () => alert("open notification"));
};

/*setInterval(() => {
  getDataNoti();
}, 100000);*/
