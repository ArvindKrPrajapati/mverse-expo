const baseUrl = "https://mverse-next.vercel.app";
export const mversePost = async (url: string, data: any) => {
  let options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  const res = await fetch(baseUrl + url, options);
  return res.json();
};

export const mverseGet = async (url: string) => {
  const res = await fetch(baseUrl + url);
  return res.json();
};

export const mversePatch = async (url: string, data: any) => {
  let options: RequestInit = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  const res = await fetch(baseUrl + url, options);
  return res.json();
};

export const uploadImage = async (
  imageFile: File,
  type: string,
  onProgress: (progress: number) => void
): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "equals");

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/shivraj-technology/image/upload`,
        true
      );

      xhr.upload.onprogress = (progressEvent: ProgressEvent) => {
        if (progressEvent.lengthComputable) {
          const progress = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          if (progress < 100) {
            onProgress(progress);
          }
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const res = JSON.parse(xhr.responseText);
          const reqObj: { [key: string]: any } = {};
          reqObj[type] = res.secure_url;
          mversePatch("/api/user/channel", reqObj)
            .then((r: any) => {
              onProgress(100);
              resolve(r);
            })
            .catch((e: any) => {
              reject(e);
            });
        } else {
          reject(xhr.responseText);
        }
      };

      xhr.onerror = () => {
        reject(xhr.statusText);
      };

      xhr.send(formData);
    });
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw error;
  }
};
