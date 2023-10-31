export const getVideoThumbnail = (videoUrl: string): string => {
  const r = new RegExp(
    /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/gim,
  );
  const x = r.exec(videoUrl);
  console.log(x);
  return "https://i3.ytimg.com/vi/Yc0Kg5PSYSo/maxresdefault.jpg";
};
