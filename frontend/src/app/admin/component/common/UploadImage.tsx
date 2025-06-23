import {
  GetProp,
  Image,
  notification,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import { UploadListType } from "antd/lib/upload/interface";
import { useState } from "react";
import { getJwtToken } from "../../utils/tokens";
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

interface UploadImageProps {
  fileList: UploadFile[];
  setFileList: (fileList: UploadFile[]) => void;
  fileSize: number;
  apiEndpoint: string;
  listType?: UploadListType;
  maxCount?: number;
  multiple?: boolean;
}
const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const UploadImage: React.FC<UploadImageProps> = ({
  fileList,
  setFileList,
  fileSize = 2,
  apiEndpoint = "",
  listType = "picture-card",
  maxCount = 1,
  multiple = false,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  //   const { showNotification } = useNotification();

  const handleUploadChange = ({
    file,
    fileList: newFileList,
  }: {
    file: UploadFile;
    fileList: UploadFile[];
  }) => {
    setFileList(newFileList);

    if (file.status === "done") {
      notification.success({
        message: "Upload Successful",
        description: `${file.name} file uploaded successfully`,
      });
      //   showNotification("success", `${file.name} file uploaded successfully`);
    } else if (file.status === "error") {
      notification.error({
        message: "Upload Failed",
        description: `${file.name} file upload failed.`,
      });
      //   showNotification("error", `${file.name} file upload failed.`);
    }
  };
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  return (
    <>
      <Upload
        action={`${process.env.NEXT_PUBLIC_BASE_URL}${apiEndpoint}`}
        headers={{
          Authorization: `Bearer ${getJwtToken()}`,
        }}
        maxCount={maxCount}
        multiple={multiple}
        accept=".pdf,.xlsx,.xls,image/jpeg,image/png"
        listType={listType}
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleUploadChange}
        onRemove={() => setFileList([])}
        beforeUpload={(file) => {
          const isLt2M = file.size / 1024 / 1024 < fileSize;
          if (!isLt2M) {
            // showNotification("error", `Image must smaller than ${fileSize}MB!`);
            notification.error({
              message: "File Size Error",
              description: `Image must smaller than ${fileSize}MB!`,
            });
            return false;
          }
          return true;
        }}
      >
        {fileList.length < maxCount && "+ Upload"}
      </Upload>
      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          alt=""
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </>
  );
};

export default UploadImage;
